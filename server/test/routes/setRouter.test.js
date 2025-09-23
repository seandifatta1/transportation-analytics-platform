const firestore = require("firebase/firestore");
const {db, auth} = require("../../src/fddFirebase");
const {connectAuthEmulator} = require("firebase/auth");
const axios = require("axios");
const {afterAll, afterEach, test, describe, expect, beforeAll, beforeEach} = require("@jest/globals");
const {doc, addDoc, getDocs, query, collection, where, setDoc} = require("firebase/firestore");
const _ = require("lodash")
const setCookie = require("set-cookie-parser");
const {postNewSet} = require("../../src/routes/setRouter");

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

});

describe("/user/:user/programs/:program/sessions/:session| HTTP Methods", () => {
    test("POST: add a set", async () => {


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

        const response = await axios.post(`${process.env.BASE_URL}/users/${user}/programs/Lifting/sessions/1a/sets`,

            [{
                Exercise: "Back Squat",
                Substitution: "Goblet Squat",
                Reps: 10,
                Weight: 20,
                Notes: "",
                Time: "2023-09-26T03:32:00.000Z",
                Day: "",
                monthUTC: 8,
                yearUTC: 2023
            }],
            {
                withCredentials: true,
                headers: {
                    Cookie: `${cookie[0].name}=${cookie[0].value}; ${cookie[1].name}=${cookie[1].value}; ${cookie[2].name}=${cookie[2].value}`
                },
            }
        )

        expect(response.status).toBe(200)

    })


})
