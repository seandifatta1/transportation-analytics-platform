
const  {addDoc, and, collection, getDocs, query, where} = require("firebase/firestore");
const  {signInWithEmailAndPassword} = require("firebase/auth");
const {makeid} = require("./dataUtils");

const initializeApp = require('firebase/app').initializeApp
const firestore = require('firebase/firestore')
const {getAuth, connectAuthEmulator} = require("firebase/auth");

require("dotenv").config()

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCqTLdMCIOlvjy8AXNBLYNPNFtKqAji8xI",
    authDomain: "fitnessdatadashboard.firebaseapp.com",
    projectId: "fitnessdatadashboard",
    storageBucket: "fitnessdatadashboard.appspot.com",
    messagingSenderId: "874346681314",
    appId: "1:874346681314:web:332297bdd35729eda85fbb",
    measurementId: "G-DWQM6EG367"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = firestore.getFirestore(app)

const auth = getAuth();

if (process.env.ENV === "DEV") {


    console.log("Using fddFirebase emulator")
    firestore.connectFirestoreEmulator(db, '127.0.0.1', 8082)

    console.log("Using auth emulator")
    connectAuthEmulator(auth, 'http://localhost:9099')

}

async function validateSession(email, sessionID, user) {

    try {

        const authQuery = query(collection(db, "sessions"),
            and(
                where('email', '==', email),
                where('sessionID', '==', sessionID),
                where('user', '==', user)
            )
        )


        const docs = await getDocs(authQuery)


        return {
            validSession: !docs.empty,
            user: user,
            email: email,
            sessionID: sessionID,
        }

    } catch (err) {
        return false
    }

}

async function authenticateWithEmailAndPassword(email, password) {

    try {

        const userCredential = await signInWithEmailAndPassword(auth, email, password)

        const user = userCredential.user;

        const authQuery = query(collection(db, "sessions"),
            and(where('email', '==', email),
            )
        )

        const userDocs = await getDocs(authQuery)

        if (userDocs.size > 0 && userCredential.user.email === email) {

            // if valid login, and there is an exitsting session in db, aka the user deleted their cookies

            let session = userDocs.docs[0].data()
            session.validSession = true

            return session

        } else if (userDocs.size === 0 && userCredential.user.email === email) {

            // if login valid, but there is not an existing session in db

            let session = {
                user:  userDocs.docs[0].id,
                email: email,
                sessionID: makeid(10),
                validSession: true
            }

            await addDoc(collection(db, "sessions"), {
                user: session.user,
                email: session.email,
                sessionID: session.sessionID
            })

            return session


        } else {

            // fail

            return {
                user: null,
                email: null,
                sessionID: null,
                validSession: false
            }

        }

    } catch (e) {

        return new Error(`Invalid user or pass \n\n${e}`);

    }

}

async function manageAuthentication(req) {

    let isAuthenticatedSession = {
        validSession: false
    }

    if (req.cookies.user && req.cookies.sessionID) {

        isAuthenticatedSession = await validateSession(req.cookies.email, req.cookies.sessionID, req.cookies.user)

    }


    if (isAuthenticatedSession.validSession === true) {

        return isAuthenticatedSession

    }

    return await authenticateWithEmailAndPassword(req.body.email, req.body.password)

}

module.exports = {
    db,
    app,
    auth,
    manageAuthentication,
}