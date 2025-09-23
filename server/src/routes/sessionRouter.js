// import {getAllSessions, getSession, postNewSession} from "../firestoreInterface";
//
const {addDoc, getDocs, collection, doc, setDoc, getDoc} = require("firebase/firestore");
const {db} = require("../fddFirebase");
const express = require("express");
const axios = require("axios")
const {postNewSet} = require("./setRouter");

require("dotenv").config()

const sessionRouter = express.Router();

sessionRouter.get(`/users/:user/programs/:program/sessions`, (req, res) => {

    getDocs(collection(db, `/users/${req.params.user}/programs/${req.params.program}/sessions`))
        .then(querySnapshot => {

            const sessions = []

            querySnapshot.forEach(doc => {
                sessions.push(doc.id);
            })

            res.send(sessions)

        })
        .catch(e => res.send(e))
})

sessionRouter.get("/users/:user/programs/:program/sessions/:session", async (req, res) => {


    const docRef = doc(db, `/users/${req.params.user}/programs}/${req.params.program}/sessions/${req.params.session}`)

    const sessionDoc = await getDoc(docRef)

    return sessionDoc.id


})

sessionRouter.post("/users/:user/programs/:program/sessions/:session", async(req, res) => {

    try {

        const sessionPath = `/users/${req.params.user}/programs/${req.params.program}/sessions/${req.params.session}`

        const docRef = doc(db, sessionPath);

        await setDoc(docRef, {})

        const data = req.body.slice(0, req.body.length)

        await axios.post(process.env.BASE_URL + sessionPath + "/sets", data, {
            withCredentials: true,
            headers: {
                Cookie: `user=${req.cookies.user}; sessionID=${req.cookies.sessionID}; email=${req.cookies.email}`
            }
        })

        res.status(200).send()

    } catch (e) {

        res.status(400).send(new Error(e))

    }

})

module.exports = {
    sessionRouter,

}
