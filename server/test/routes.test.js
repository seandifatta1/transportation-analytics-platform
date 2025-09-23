const axios = require("axios")

const {fddBeforeAll, fddBeforeEach, fddTopOfEach} = require("./testUtils");
const {createUserWithEmailAndPassword, signInWithEmailAndPassword} = require("firebase/auth");
const {auth} = require("../src/fddFirebase");
const exampleData = require("./exampleData.json");
const {postNewProgram} = require("../src/firestoreInterface");
const {response} = require("express");

beforeAll(async () => {
    fddBeforeAll()
})

beforeEach(() => {
    fddBeforeEach()
})

describe('Creating/trying to create a new user', () => {

    test("POST: /users | valid and available user/pass ", async () => {

        const email = process.env.EMAIL
        const password = process.env.PASSWORD

        const response = await axios.post(`${process.env.BASE_URL}/users`, {
            email: email,
            password: password
        })

        expect(response.status).toBe(200)
        expect(response.data.email).toBe(email)

        const authResponse = await signInWithEmailAndPassword(auth, email, password)

        expect(authResponse.user.email).toBe(process.env.EMAIL)


    })

    test("POST: /users | valid but unavaible user pass", () => {

        // implement this after going to production

    })

    test("Invalid user/pass", () => {

        // get this in before going to production if easy

    })

});

describe("Getting a user", () => {

    test(" This is all covered in middleware, skip", async () => {
    })

})

describe("GET /users/:user/data", () => {

    test("", async () => {

        const user = await fddTopOfEach()

        const response1 = await postNewProgram({
            user: user.user,
            program: process.env.PROGRAM + "1",
            type: "lifting",
            setData: exampleData.setData
        })
        const response2 = await postNewProgram({
            user: user.user,
            program: process.env.PROGRAM + "2",
            type: "lifting",
            setData: exampleData.setData
        })


        const data = await axios.get(`${process.env.BASE_URL}/users/${user.user}/data`, {
            withCredentials: true,
            headers: {
                Cookie: `user=${user.user}; email=${user.email}; sessionID=${user.sessionID}`
            },
        })

        expect(data.status).toBe(200)
        expect(data.data.length).toBe(1168)


    })

    test("Get list of exericse", async () => {

        const user = await fddTopOfEach()

        const programResponse = await postNewProgram({
            user: user.user,
            program: process.env.PROGRAM + "1",
            type: "lifting",
            setData: exampleData.setData
        })

        const exerciseResponse = await axios.get(`${process.env.BASE_URL}/users/${user.user}/exercises`, {
            withCredentials: true,
            headers: {
                Cookie: `user=${user.user}; email=${user.email}; sessionID=${user.sessionID}`
            },
        })

        expect(exerciseResponse.status).toBe(200)
        expect(exerciseResponse.data.length).toBe(20)

    })

    test("Get list of sessions", async () => {

        const user = await fddTopOfEach()

        const programResponse = await postNewProgram({
            user: user.user,
            program: process.env.PROGRAM + "1",
            type: "lifting",
            setData: exampleData.setData
        })

        const exerciseResponse = await axios.get(`${process.env.BASE_URL}/users/${user.user}/sessions`, {
            withCredentials: true,
            headers: {
                Cookie: `user=${user.user}; email=${user.email}; sessionID=${user.sessionID}`
            },
        })

        expect(exerciseResponse.status).toBe(200)
        expect(exerciseResponse.data.length).toBe(3)

    })

})
