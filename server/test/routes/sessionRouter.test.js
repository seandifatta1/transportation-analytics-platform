const {beforeAll, beforeEach} = require("@jest/globals");
const firestore = require("firebase/firestore");
const {db, auth} = require("../../src/fddFirebase");
const {connectAuthEmulator} = require("firebase/auth");
const axios = require("axios");
const setCookie = require("set-cookie-parser");
const {getAllSessions, getSession, postNewSession} = require("../../src/routes/sessionRouter");
const {
    addDoc,
    getDocs,
    collection,
    doc,
    setDoc,
    getDoc,
    query,
    where
} = require("firebase/firestore");

let user

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

    const userCreation = await axios.post(`${process.env.BASE_URL}/users`, {
        email: process.env.EMAIL,
        password: process.env.PASSWORD
    })

    const cookie = setCookie(userCreation)


})

