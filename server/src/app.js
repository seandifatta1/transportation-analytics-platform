const {manageAuthentication, db, auth} = require("./fddFirebase");

require("dotenv").config()

const express = require('express');

const cors = require("cors")
const cookieParser = require('cookie-parser')

const {programRouter} = require("./routes/programRouter");
const {userRouter} = require("./routes/userRouter");
const {sessionRouter} = require("./routes/sessionRouter");
const {setRouter} = require("./routes/setRouter");
const axios = require("axios");
const {toJSON, DataFrame} = require("danfojs-node");
const {filterByDate, getHistograms, makeid} = require("./dataUtils");
const {getDocs, collection, addDoc} = require("firebase/firestore");
const {createUserWithEmailAndPassword} = require("firebase/auth");
const {postNewProgram, getAllPrograms, getProgram, getAllSessions, postNewSet} = require("./firestoreInterface");
const _ = require("lodash")


const app = express();

app.use((cors({
    origin: [
        'http://localhost:8081',
        'https://localhost:8081',
        'http://localhost:3000',
        'https://localhost:3000'
    ],
    // origin: true,
    credentials: true,
})))
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(cookieParser())
app.use(express.json({limit: "200kb"}));
app.use(express.urlencoded({extended: true}));

app.use(async (req, res, next) => {

    // authentication middleware

    try {

        if (req.method === "POST" && req.url === "/users") {

            // if we're creating a new user, we need to skip validation since it will autofail

            return next()

        }

        if (req.method === "POST" && req.url === "/" && req.body.email === undefined && req.body.password === undefined) {

            // if we're creating a new user, we need to skip validation since it will autofail

            return next()

        }


        const authenticationStatus = await manageAuthentication(req)


        if (authenticationStatus.validSession) {

            res.cookie("sessionID", authenticationStatus.sessionID)
            res.cookie("email", authenticationStatus.email)
            res.cookie("user", authenticationStatus.user)

            return next()

        }

        throw new Error("Invalid login credentials")

    } catch (e) {

        res.status(400).send({
            errorMessage: e.message
        })

    }

})

app.all("/", (req, res) => {

    if (req.method === "POST" && req.url === "/" && req.body.email === undefined && req.body.password === undefined) {
        res.status(400).send("Need to authenticate")
    } else {
        res.status(200).send("Welcome to the FDD backend root! \n\n You are logged in and all middleware has been passed succesfully");
    }

})

app.get("/users", async (req, res) => {

    // currently commented since I can't think of a reason for someone calling this, :user is the fundamental entry point

    // try {
    //
    //     const querySnapshot = await getDocs(collection(db, "/users"))
    //
    //     const data = []
    //
    //     querySnapshot.forEach(doc => {
    //         // data.push(doc.data())
    //         data.push(doc.id);
    //     })
    //
    //     res.send(data)
    //
    // } catch (e) {
    //
    //     res.send(new Error(e))
    //
    // }


})

app.post("/users", async (req, res) => {

    try {

        const sessionDocs = await getDocs(collection(db, "sessions"))
        if (sessionDocs.size === 0) {
            await addDoc(collection(db, "sessions"), {})
        }

        const createUserResponse = await createUserWithEmailAndPassword(auth, req.body.email, req.body.password)

        // Add user to firestore


        const userDoc = await addDoc(collection(db, "users"), {
            email: req.body.email
        })

        const sessionID = makeid(10)

        const sessionDoc = await addDoc(collection(db, "sessions"), {
            email: req.body.email,
            sessionID: sessionID,
            user: userDoc.id
        })

        const docAdded = await addDoc(collection(db, `/users/${userDoc.id}/exercises`), {name: "unknown"})

        // On addition of new user to the firestore database, create "Misc.", "Lifting", and "Running"
        // Programs, just as template references
        //

        await postNewProgram({user: userDoc.id, program: "Misc.", type: "lifting"})
        await postNewProgram({user: userDoc.id, program: "Lifting", type: "lifting"})
        await postNewProgram({user: userDoc.id, program: "Running", type: "running"})

        res.cookie("user", userDoc.id)
        res.cookie("sessionID", sessionID)
        res.cookie("email", req.body.email)

        res.status(200).send({
            email: req.body.email,
            sessionID: sessionID,
            user: userDoc.id
        })

    } catch (e) {

        res.status(409).send(new Error(e))
    }


})

app.get("/users/:user/data", async (req, res) => {

    try {

        let data = []

        let programs = await getAllPrograms(req.params.user)

        for (let program of programs) {

            let newData = await getProgram({user: req.params.user, program: program})

            data = data.concat(newData.setData)

        }


        res.status(200).send(data)

    } catch (e) {

        res.status(400).send(e)

    }

})

app.get("/users/:user/exercises", async (req, res) => {

    try {

        let exercises = [];

        const exercisesDocs = await getDocs(collection(db, `/users/${req.params.user}/exercises`))

        await exercisesDocs.forEach(doc => {
            exercises.push(doc.data().name)
        })

        res.status(200).send(exercises)

    } catch (e) {

        res.status(400).send(e)

    }

})

app.get("/users/:user/sessions", async (req, res) => {

    try {

        let programs = await getAllPrograms(req.params.user)

        let sessions = []

        for (const program of programs) {

            const tempSessions = await getAllSessions({user: req.params.user, program: program})

            tempSessions.forEach(session => {
                    sessions.push(session)
                }
            )

        }

        res.status(200).send(_.uniq(sessions))

    } catch
        (e) {

        res.status(400).send(e)

    }

})

app.post("/users/:user/sets", async (req, res) => {

    try {

        // let timeStamp = Date.now()
        // const Time = timeStamp

        await postNewSet({
            user: req.params.user, program: req.body.Program, session: req.body.Session,setData: [{
                Day: req.body.Session,
                Exercise: req.body.Exercise,
                Weight: req.body.Weight,
                Reps: req.body.Reps,
                Time: new Date(Date.now()),
                Notes: "",
            }]
        })
    } catch (e) {

        res.status(400).send(e)

    }





})

app.get("/users/:user/programs", async (req, res) => {

    try {

        const programs = await getAllPrograms(req.params.user)

        return res.status(200).send(programs)

    } catch (e) {

        res.status(400).send(e)

    }

})

app.post("/users/:user/programs/:program", async (req, res) => {

    try {

        await postNewProgram({
            user: req.params.user,
            program: req.params.program,
            type: req.body.type,
            setData: req.body.setData
        })

        res.status(200).send()

    } catch (e) {

        res.status(400).send(e)

    }


})

app.get("/users/:user/time", async (req, res) => {

    const {unitOfTime, amount, from} = req.query
    const user = req.params.user
    const sessionID = req.cookies.sessionID

    let response = {}

    response.lifting = {
        rawData: [],
        statistics: []
    }
    response.running = {}

    try {

        const programs = await getAllPrograms(req.params.user)


        for (let program of programs) {

            let data = await getProgram({user: user, program: program})


            if (data.type.toLowerCase() === "lifting") {
                let temp = toJSON(filterByDate(data.setData, unitOfTime, amount, from));
                response.lifting.rawData = response.lifting.rawData.concat(temp)
            } else if (data.type.toLowerCase() === "running") {
                response.running[program] = {}
            }

        }

        response.lifting.statistics = getHistograms(new DataFrame(response.lifting.rawData))

        res.status(200).send(response)

    } catch (e) {

        res.status(400).send(e)

    }

})

app.get("/users/:user/:specificExercise", async (req, res) => {

    /**
     *  This router is not currently needed, but will be as the application grows
     */

    // try {
    //
    //     let sets = []
    //
    //     const setsOfSpecificExercise = query(collectionGroup(db, 'sets'),
    //         and(
    //             where('Exercise', '==', specificExercise),
    //             where('Exercise', '==', specificExercise),
    //             where('Exercise', '==', specificExercise),
    //             where('Exercise', '==', specificExercise),
    //         ));
    //
    //     const querySnapshot = await getDocs(setsOfSpecificExercise);
    //
    //     querySnapshot.forEach((doc) => {
    //         sets.push(doc.data());
    //     });
    //
    //     return sets
    //
    // } catch (e) {
    //
    //     return e
    //
    // }
})

module.exports = {
    app
}
