const {db} = require("../src/fddFirebase")

const {
    addDoc,
    collection,
    collectionGroup,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc
} = require("firebase/firestore");

const {toJSON, DataFrame} = require("danfojs-node");
const {where} = require("underscore");

async function getAllSets({user, program, session}) {

    try {

        const setDocsQuery = await getDocs(collection(db, `/users/${user}/programs/${program}/sessions/${session}/sets`))

        const sets = []

        setDocsQuery.forEach(set => {
            sets.push(set.data())
        })

        return sets

    } catch (e) {

        return e

    }

}

async function postNewSet({
                              user, program, session, setData = [
        {
            Exercise: "",
            Substitution: "",
            Reps: null,
            Weight: null,
            Notes: "",
            Time: "2023-09-26T03:32:00.000Z",
            Day: "",
            monthUTC: 0,
            yearUTC: 0
        }
    ]
                          }) {

    try {

        if (!await checkIfUserHasProgram({user, program})) {
            return await postNewProgram( { user: user, program: program, setData: setData })
        } else if (!await checkIfSessionIsInProgram( { user, program, session })) {
            return await postNewSession( { user, program, session, setData })
        }

        /*
        * Start: block that checks if this set contains a new exercises the needs to be added to thelist of exiercises
        * */
        let allCurrentExercises = []

        const exercisesSnapshot = await getDocs(collection(db, `/users/${user}/exercises`))

        exercisesSnapshot.forEach(exercise => {

            const name = exercise.data().name

            if (name) {
                allCurrentExercises.push(name)
            }

        })

        /**
         * Stop
         */

        if (session !== "") {

            for (const set of setData) {

                set.program = program
                set.session = session

                await addDoc(collection(db, `/users/${user}/programs/${program}/sessions/${session}/sets`), set)


                // is exerises in current exercises check
                if (!allCurrentExercises.includes(set.Exercise)) {

                    allCurrentExercises.push(set.Exercise)

                    const colRef = collection(db, `/users/${user}/exercises`)


                    await addDoc(colRef, {
                        name: set.Exercise
                    })


                }

            }

        }

        return true

    } catch (e) {

        return e

    }
}

async function getAllSessions({user, program}) {

    try {

        const querySnapshot = await getDocs(collection(db, `/users/${user}/programs/${program}/sessions`))

        const sessions = []

        querySnapshot.forEach(doc => {
            sessions.push(doc.id);
        })

        return sessions

    } catch (e) {

        return e

    }

}

async function getSession({user, program, session}) {

    try {

        const docRef = doc(db, `/users/${user}/programs}/${program}/sessions/${session}`)

        const sessionDoc = await getDoc(docRef)

        return sessionDoc.id

    } catch (e) {

        return e

    }

}

async function postNewSession({
                                  user, program, session, setData = [
        {
            Exercise: "",
            Substitution: "",
            Reps: null,
            Weight: null,
            Notes: "",
            Time: "2023-09-26T03:32:00.000Z",
            Day: "",
            monthUTC: 0,
            yearUTC: 0
        }
    ]
                              }) {

    try {

        const sessionPath = `/users/${user}/programs/${program}/sessions/${session}`

        const docRef = await doc(db, sessionPath);

        await setDoc(docRef, {})

        if (setData !== null) {

            // const x = setData.slice(0, setData.length)

            await postNewSet({user: user, program: program, session: session, setData: setData})

        }

        return true

    } catch (e) {

        return e

    }


}

async function getAllPrograms(user) {

    try {
        const querySnapshot = await getDocs(collection(db, `/users/${user}/programs`))

        const programs = []

        querySnapshot.forEach(doc => {
            programs.push(doc.id);
        })

        return programs

    } catch (e) {

        return e

    }

}

async function getProgram({user, program}) {

    try {

        /*
       Gets all data for a given program, filters must be passed as query params - not any logic for handling
       query params as of 5/2
        */


        const programDocRef = doc(db, `/users/${user}/programs`, program)
        const programDoc = await getDoc(programDocRef)
        const type = programDoc.data().type

        let sets = []
        const sessions = await getAllSessions({user: user, program: program})

        for (const session of sessions) {

            const sessionSets = await getAllSets({user: user, program: program, session: session})

            sets = sets.concat(sessionSets)

        }

        return {
            type: type,
            setData: sets
        }


    } catch (e) {

        return e

    }

}

async function postNewProgram({
                                  user, program, type = "lifting", setData = [
        {
            Exercise: "",
            Substitution: "",
            Reps: null,
            Weight: null,
            Notes: "",
            Time: "2023-09-26T03:32:00.000Z",
            Day: "",
            monthUTC: 0,
            yearUTC: 0
        }
    ]
                              }) {

    try {

        // create a doc ref for the new program with name "program"
        const docRef = doc(db, `/users/${user}/programs`, program);

        // add the docref to the db to officially create the program with established workout type
        const programNameIsSuccesfullyAdded = await setDoc(docRef, {
            type: type ? type : "lifting"
        })


        let df = new DataFrame(setData)

        df = df.applyMap(element => {
            return element === "" ? "unknown" : element
        })

        let sessions = df["Day"].unique().$dataIncolumnFormat;

        for (const session of sessions) {

            const sessionData = df.query(df["Day"].eq(session))

            await postNewSession({user: user, program: program, session, setData: toJSON(sessionData)})

        }

        return true
    } catch (e) {

        return e

    }

}

async function checkIfUserHasProgram( { user, program }) {

    const currentPrograms = await getAllPrograms( user )

    return currentPrograms.includes(program)

}

async function checkIfSessionIsInProgram( { user, program, session }) {

    const sessions = await getAllSessions( { user, program })

    return sessions.includes(session)

}

module.exports = {
    postNewSet,
    getAllSessions,
    getSession,
    postNewSession,
    getAllPrograms,
    getProgram,
    postNewProgram
}