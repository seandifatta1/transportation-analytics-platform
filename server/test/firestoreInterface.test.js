const {beforeAll, beforeEach, test, expect} = require("@jest/globals");
const firestore = require("firebase/firestore");
const {connectAuthEmulator} = require("firebase/auth");
const axios = require("axios");
const setCookie = require("set-cookie-parser");
const {getDocs, query, collection, where, doc, setDoc, getDoc} = require("firebase/firestore");

const {db, auth} = require("../src/fddFirebase");
const {
    postNewSet,
    getAllSessions,
    getSession,
    postNewSession,
    postNewProgram
} = require("../src/firestoreInterface");

const exampleData = require("./exampleData.json");
const {fddTopOfEach} = require("./testUtils");

beforeAll(async () => {

    require("dotenv").config({path: "/Users/seandifatta/PycharmProjects/fitnessdatadashboard/local-dev.env"});

    console.log("Using firestore emulator")
    firestore.connectFirestoreEmulator(db, '127.0.0.1', 8082)

    console.log("Using auth emulator")
    connectAuthEmulator(auth, 'http://localhost:9099')


})

beforeEach(async () => {


    await axios.delete("http://localhost:8082/emulator/v1/projects/fitnessdatadashboard/databases/(default)/documents")
    await axios.delete("http://localhost:9099/emulator/v1/projects/fitnessdatadashboard/accounts")

})

describe("set interface", () => {

    test("POST a new set", async () => {


        const userCreation = await axios.post(`${process.env.BASE_URL}/users`, {
            email: process.env.EMAIL,
            password: process.env.PASSWORD
        })

        const cookie = setCookie(userCreation)

        const userQuery = await getDocs(query(collection(db, "users"),
            where('email', '==', process.env.EMAIL),
        ))

        let users = []

        userQuery.forEach(user => {
            users.push(users.id)
        })

        let user = users[0]

        const docRef = doc(db, `/users/${user}/programs/Lifting/sessions`, "1a")

        await setDoc(docRef, {})

        const response = await postNewSet(
            {

                user: cookie[0].value,
                program: "Lifting",
                session: "1a",
                data: [{
                    Exercise: "Back Squat",
                    Substitution: "Goblet Squat",
                    Reps: 10,
                    Weight: 20,
                    Notes: "",
                    Time: "2023-09-26T03:32:00.000Z",
                    Day: "",
                    monthUTC: 8,
                    yearUTC: 2023
                }]
            }
        )

        expect(response).toBe(true)

    })

    test("POST a empty set", async () => {


        const userCreation = await axios.post(`${process.env.BASE_URL}/users`, {
            email: process.env.EMAIL,
            password: process.env.PASSWORD
        })

        const cookie = setCookie(userCreation)

        const userQuery = await getDocs(query(collection(db, "users"),
            where('email', '==', process.env.EMAIL),
        ))

        let users = []

        userQuery.forEach(user => {
            users.push(users.id)
        })

        let user = users[0]

        // const docRef = doc(db, `/users/${user}/programs/Lifting/sessions`, "1a")
        //
        // await setDoc(docRef, {})

        const response = await postNewSet(
            {

                user: cookie[0].value,
                program: "Lifting",
                session: "1a",
            }
        )



        expect(response).toBe(true)

    })

})

describe('session interface test', () => {

    test("get all sessions", async () => {

        const userQuery = await getDocs(query(collection(db, "users"),
            where('email', '==', process.env.EMAIL),
        ))

        let users = []

        userQuery.forEach(user => {
            users.push(user.id)
        })

        let user = users[0]


        const program = process.env.PROGRAM

        await setDoc(doc(collection(db, `users/${user}/programs`), program), {})
        await setDoc(doc(collection(db, `users/${user}/programs/${program}/sessions`), "1"), {})
        await setDoc(doc(collection(db, `users/${user}/programs/${program}/sessions`), "2"), {})

        const sessions = await getAllSessions({user, program})

        expect(sessions).toEqual(sessions)

    })

    test("get a session", async () => {

        const userQuery = await getDocs(query(collection(db, "users"),
            where('email', '==', process.env.EMAIL),
        ))

        let users = []

        userQuery.forEach(user => {
            users.push(user.id)
        })

        let user = users[0]


        const program = process.env.PROGRAM

        await setDoc(doc(collection(db, `users/${user}/programs`), program), {})
        await setDoc(doc(collection(db, `users/${user}/programs/${program}/sessions`), "1"), {})

        session = "1"

        const sessionResponse = await getSession({user, program, session})

        expect(sessionResponse).toEqual(session)

    })

    test("post new session", async () => {

        const userQuery = await getDocs(query(collection(db, "users"),
            where('email', '==', process.env.EMAIL),
        ))

        let users = []

        userQuery.forEach(user => {
            users.push(user.id)
        })

        let user = users[0]

        const session = "1"

        const program = process.env.PROGRAM

        const response = await postNewSession({user, program, session})

        expect(response).toBe(true)

        const sessionDoc = await getDoc(doc(collection(db, `users/${user}/programs/${program}/sessions`), session))

        expect(sessionDoc.id).toEqual(session)


    })

});

describe("program interface test", () => {


    test("same, but no enpoint", async () => {
        const userCreation = await axios.post(`${process.env.BASE_URL}/users`, {
            email: process.env.EMAIL,
            password: process.env.PASSWORD
        })

        const cookie = setCookie(userCreation)


        const userQuery = await getDocs(query(collection(db, "users"),
            where('email', '==', process.env.EMAIL),
        ))

        let users = []

        userQuery.forEach(user => {
            users.push(user.id)
        })

        let user = users[0]

        const program = process.env.PROGRAM

        const response = await postNewProgram({user, program})

        expect(response).toBe(true)

    })

    test("Add an  lifting program by using a POST request with 'setData' object in the body", async () => {


            const user = await fddTopOfEach()

            const response = await postNewProgram({
                user: user.user,
                program: process.env.PROGRAM,
                type: exampleData.type,
                setData: exampleData.setData
            })


            expect(response.status).toBe(200)


        }
    )


})