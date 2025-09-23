// const docRef =
//     dbMethods.doc(db, "example/lOMdseX4gOg4rexEHIhP");
// // const docRef = dbMethods.doc(db, "express-sessions/hJRs4TehpHaqodiexMzLioF0IzhOiWc0");
// const docSnap = await dbMethods.getDoc(docRef);
//
// const citiesRef = dbMethods.collection(db, 'express-sessions');
// const snapshot =
//     await dbMethods.getDocs(citiesRef)
// if (snapshot.empty) {
//     console.log('No matching documents.');
//     return;
// }
//
// snapshot.forEach(doc => {
//     console.log(doc.id, '=>', doc.data());
// });

const { doc, setDoc} = require("firebase/firestore")
const {db} = require("../../src/fddFirebase");
const firestore = require("firebase/firestore");
// const {data} = require("express-session/session/cookie");
firestore.connectFirestoreEmulator(db, '127.0.0.1', 8082)

async function data()  {
// Add a new document in collection "cities"
    await setDoc(doc(db, "cities1", "LA"), {
        name: "Los Angeles",
        state: "CA",
        country: "USA"
    });

}

data();
