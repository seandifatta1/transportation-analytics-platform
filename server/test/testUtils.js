const axios = require("axios");
const setCookie = require("set-cookie-parser");
const {getDocs, query, collection, where} = require("firebase/firestore");
const {db, auth} = require("../src/fddFirebase");
const firestore = require("firebase/firestore");
const {connectAuthEmulator} = require("firebase/auth");

async function fddBeforeAll() {

    require("dotenv").config({path: "/Users/seandifatta/PycharmProjects/fitnessdatadashboard/local-dev.env"});

    console.log("Using firestore emulator")
    firestore.connectFirestoreEmulator(db, '127.0.0.1', 8082)

    console.log("Using auth emulator")
    connectAuthEmulator(auth, 'http://localhost:9099')

}

async function fddBeforeEach() {

    await axios.delete("http://localhost:8082/emulator/v1/projects/fitnessdatadashboard/databases/(default)/documents")
    await axios.delete("http://localhost:9099/emulator/v1/projects/fitnessdatadashboard/accounts")

}

async function fddTopOfEach(){

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

    return userCreation.data

}

module.exports = {
    fddBeforeAll,
    fddBeforeEach,
    fddTopOfEach
}
