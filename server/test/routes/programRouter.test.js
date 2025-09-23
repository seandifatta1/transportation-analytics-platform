const axios = require("axios");
const {afterAll, afterEach, test, describe, expect, beforeAll, beforeEach} = require("@jest/globals");

require("dotenv").config({path: "../local-dev.env"});
const exampleData = require("../exampleData.json");

const setCookie = require("set-cookie-parser")
const firestore = require("firebase/firestore");
const {db, auth} = require("../../src/fddFirebase");
const {connectAuthEmulator} = require("firebase/auth");
const {collection, query, and, where, getDocs} = require("firebase/firestore");
const {postNewProgram} = require("../../src/routes/programRouter");

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

describe("Add a program", () => {


    test("Add an empty lifting program by using a POST request with no 'setData' object in the body", async () => {


        try {

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


            const response = await axios.post(`${process.env.BASE_URL}/users/${user}/programs/${process.env.PROGRAM}`, {

                type: exampleData.type

            }, {
                withCredentials: true,
                headers: {
                    Cookie: `${cookie[0].name}=${cookie[0].value}; ${cookie[1].name}=${cookie[1].value}; ${cookie[2].name}=${cookie[2].value}`
                },
            })

            expect(response.status).toBe(200)


        } catch (e) {

            // expect(e.response.status).toBe(400)
            expect(true).toBe(false)

        }

    })



    test("Same, but no enpoint", async () => {


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

        const response = await postNewProgram({
            user,
            program: program,
            setData: exampleData.setData,
            type: exampleData.type
        })

    expect(response).toEqual(true)
    })
})