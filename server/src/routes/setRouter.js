// import {postNewSet} from "../firestoreInterface";

const {getDoc, addDoc, getDocs, collection, doc, setDoc, query} = require("firebase/firestore");
const {db} = require("../fddFirebase");
const express = require("express");
const danfos = require("danfojs-node")
const axios = require("axios")
// const {login} = require("passport/lib/http/request");
const _ = require('underscore');


require("dotenv").config()

const setRouter = express.Router();

/**
 * This is the lowest level router for the data model, all set related data is managed here
 */

setRouter.post("/users/:user/programs/:program/sessions/:session/sets", async (req, res) => {

    /**
     Post 1 or more sets to the program/session of choice
     *
     */


    try {

        /*
        * Start: block that checks if this set contains a new exercises the needs to be added to thelist of exiercises
        * */
        let allCurrentExercises = []

        const exercisesSnapshot = await getDocs(collection(db, `/users/${req.params.user}/exercises`))

        exercisesSnapshot.forEach(exercise => {

            const name = exercise.data().name

            if (name) {
                allCurrentExercises.push(name)
            }

        })

        /**
         * Stop
         */

        if (req.params.session !== "") {

            for (const set of req.body) {

                set.program = req.params.program
                set.session = req.params.session

                await addDoc(collection(db, `/users/${req.params.user}/programs/${req.params.program}/sessions/${req.params.session}/sets`), set)


                // is exerises in current exercises check
                if (!allCurrentExercises.includes(set.Exercise)) {

                    allCurrentExercises.push(set.Exercise)

                    const colRef = collection(db, `/users/${req.params.user}/exercises`)


                    await addDoc(colRef, {
                        name: set.Exercise
                    })


                }

            }

        }

        res.status(200).send()

    } catch (e) {

        res.status(400).send(new Error(e))

    }

})

module.exports = {
    setRouter,
}