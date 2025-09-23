const axios = require("axios");
const {describe, test, expect, afterEach, beforeEach, beforeAll} = require("@jest/globals")
const {addDoc, or, getDocs, collection, query, collectionGroup, and, where} = require("firebase/firestore");
const { db, auth } = require("../../src/fddFirebase")
const firestore = require("firebase/firestore");
const {connectAuthEmulator} = require("firebase/auth");

beforeAll(async () => {

        console.log("Using firestore emulator")
        firestore.connectFirestoreEmulator(db, '127.0.0.1', 8082)

        console.log("Using auth emulator")
        connectAuthEmulator(auth , 'http://localhost:9099')

})

beforeEach(async () => {

    try {

        require("dotenv").config({path: "/Users/seandifatta/PycharmProjects/fitnessdatadashboard/local-dev.env"});


        await axios.delete("http://localhost:8082/emulator/v1/projects/fitnessdatadashboard/databases/(default)/documents")

        await axios.delete("http://localhost:9099/emulator/v1/projects/fitnessdatadashboard/accounts")

    } catch (e) {

        console.log(`Something went wrong in test setup ${e.message}`)

    }


});

describe("GET /users : get all users", () => {

    test(" GET /users : get all users", async function () {


        const response1 = await axios.post(`${process.env.BASE_URL}/users`, {
            email: "test-email1@gmail.com",
            password: "password"
        })

        const response2 = await axios.post(`${process.env.BASE_URL}/users`, {
            email: "test-email2@gmail.com",
            password: "password"
        })


        const querySnapshot = await getDocs(collection(db, "/users"))

        let emails = []

        querySnapshot.forEach( doc => {
            emails.push(doc.data().email)
        } )

        expect(response1.status).toEqual(200)
        expect(response2.status).toEqual(200)



        expect(emails.sort()).toEqual(["test-email1@gmail.com", "test-email2@gmail.com"].sort())
        // expect(true).toBe(true);


    })

})

describe("POST /users : post a user", () => {

    test(" Create a user with valid syntax for email and pass, who does not already have their email registered in firebase ", async function () {

        try {

            await addDoc(collection(db, "sessions"), {

            })

            const email = process.env.EMAIL
            const password = process.env.PASSWORD

            const response = await axios.post(`${process.env.BASE_URL}/users`, {
                email: email,
                password: password
            })

            expect(response.status).toEqual(200)

        } catch (e) {

            expect(true).toEqual(false)

        }

    })
})


