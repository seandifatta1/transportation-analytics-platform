const {beforeEach, afterEach} = require("@jest/globals");
const axios = require("axios");
const {addDoc, getDocs, query, collection, where, setDoc, and} = require("firebase/firestore");
const {db, auth} = require("../src/fddFirebase");
const firestore = require("firebase/firestore");
const {connectAuthEmulator} = require("firebase/auth");
const setCookie = require("set-cookie-parser")

beforeAll(async () => {


    // addDoc(doc(collection(db, "/sessions"), {}))

    console.log("Using firestore emulator")
    firestore.connectFirestoreEmulator(db, '127.0.0.1', 8082)

    // console.log("Using auth emulator")
    // connectAuthEmulator(auth, 'http://localhost:9099')


})

beforeEach(async () => {


    require("dotenv").config({path: "/Users/seandifatta/PycharmProjects/fitnessdatadashboard/local-dev.env"});

    await axios.delete("http://localhost:8082/emulator/v1/projects/fitnessdatadashboard/databases/(default)/documents")

    await axios.delete("http://localhost:9099/emulator/v1/projects/fitnessdatadashboard/accounts")


});

// We're are assuming the creation of a user has already gone succesfuly
describe("Validate auth middleware", () => {

    test("Valid session/user cookie combo", async () => {

        const userCreated = await axios.post(`${process.env.BASE_URL}/users`, {
            email: process.env.EMAIL,
            password: process.env.PASSWORD
        })

        const cookie = setCookie(userCreated)

        const authQuery = query(collection(db, "sessions"),
            and(where('email', '==', process.env.EMAIL),
                where('sessionID', '==', userCreated.data.sessionID))
        )

        const docs = await getDocs(authQuery)

        let users = []

        docs.forEach(user => {
            users.push(user.id)
        })

        let user = users[0]

        const didPassMiddelware = await axios.post(`${process.env.BASE_URL}/`, {}, {
            withCredentials: true,
            headers: {
                Cookie: `${cookie[0].name}=${cookie[0].value}; ${cookie[1].name}=${cookie[1].value}; ${cookie[2].name}=${cookie[2].value}`
            },
        })


        expect(didPassMiddelware.status).toBe(200)


    })

    test("Invalid session/user combo, but valid user/password", async () => {


        const userCreated = await axios.post(`${process.env.BASE_URL}/users`, {
            email: process.env.EMAIL,
            password: process.env.PASSWORD
        })

        const didPassMiddleware = await axios.post(`${process.env.BASE_URL}/`, {
            email: process.env.EMAIL,
            password: process.env.PASSWORD
        }, {
            withCredentials: false
        })

        expect(didPassMiddleware.status).toBe(200)

    })

})