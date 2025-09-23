// import {getAllPrograms, getProgram, postNewProgram} from "../firestoreInterface";

const {collectionGroup, getDoc, addDoc, getDocs, collection, doc, setDoc, query} = require("firebase/firestore");
const {db} = require("../fddFirebase");
const express = require("express");
const danfos = require("danfojs-node")
const axios = require("axios")

const {filterByDate, getHistograms} = require("../dataUtils");
const {postNewSet} = require("./setRouter");

const programRouter = express.Router();

programRouter.get("/users/:user/programs", (req, res) => {


        // if (!req.body.program) {
        // then list all programs

        getDocs(collection(db, `/users/${req.cookies.user}/programs`))
            .then(querySnapshot => {

                const programs = []

                querySnapshot.forEach(doc => {
                    programs.push(doc.id);
                })

                res.status(200).send(programs)
                // res.send()

            }).catch(e => {
            res.send(e)
        })
        // }
        console.log()
    }
)

programRouter.get("/users/:user/programs/:program", (req, res) => {

    /*
    Gets all data for a given program, filters must be passed as query params - not any logic for handling
    query params as of 5/2
     */

    const docRef = doc(db, `/users/${req.cookies.user}/programs`, req.params.program)

    const sets = query(collectionGroup(db, 'sets'))

    let metaData;

    getDoc(docRef)
        .then(value => {
            metaData = value.data()
        })

    let myDocs = []
    getDocs(sets)
        .then(querySnapeshot => {
            querySnapeshot.forEach(doc => {
                myDocs.push(doc.data())
                // console.log(doc.data())
            })

            res.send(
                {
                    metaData: metaData,
                    data: myDocs
                })


        }).catch(e => res.send(e))
})

programRouter.post("/users/:user/programs/:program", async (req, res) => {

    try {

        // await addProgram(user, program, workoutType)

        // create a doc ref for the new program with name "program"
        const docRef = doc(db, `/users/${req.params.user}/programs`, req.params.program);

        // add the docref to the db to officially create the program with established workout type
        const programNameIsSuccesfullyAdded = await setDoc(docRef, {
            type: req.body.type ? req.body.type : "lifting"
        })


        // boolean for whether or not there is actual program data attached to the data, upon initial resume deployment, this can only be done internally through the http client
        const hasBody = req.body.setData

        // add the data to users/:user/programs
        if (hasBody) {

            let df = new danfos.DataFrame(req.body.setData)

            df = df.applyMap(element => {
                return element === "" ? "unknown" : element
            })

            let sessions = df["Day"].unique().$dataIncolumnFormat;

            for (const session of sessions) {

                const sessionData = df.query(df["Day"].eq(session))

                const response = await axios.post(`${process.env.BASE_URL}/users/${req.params.user}/programs/${req.params.program}/sessions/${session}`, danfos.toJSON(sessionData), {
                    withCredentials: true,
                    headers: {
                        Cookie: `user=${req.cookies.user}; sessionID=${req.cookies.sessionID}; email=${req.cookies.email}`
                    }
                })

            }

        }

        // res.send()
        // return
        res.status(200).send(`Success! ${req.params.program} added`)

    } catch (e) {

        res.status(400).send(new Error(e))

    }

})

module.exports = {
    programRouter,
}