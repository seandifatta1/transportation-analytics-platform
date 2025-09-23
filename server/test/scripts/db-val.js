
const {
    doc,
    addDoc,
    getDocs,
    getDoc,
    setDoc,
    collection,
    where,
    query
}  = require("firebase/firestore");

const { db } = require("../../src/fddFirebase")

require("dotenv").config()

console.log(`The current environment is: ${process.env.ENV}`)

async function makeCollection(path){

    const col = await collection(db, "users", "sean", "jeff-nippard");

    await addDoc(col, {

    });

}

async function getData(){

    const data = await doc(db, "users", "bLjerKyDbIwi4407ZoJo")

    const myDoc = await getDoc(data)
    console.log(myDoc.data())

}

async function queryData(){

    const col = await collection(db, "users");

    const q = query(col, where("name", "==", "sean"));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
    });


}

async function makeDoc() {

    // Add a new document in collection "cities"
    await setDoc(doc(db, "cities", "LA"), {
        name: "Los Angeles",
        state: "CA",
        country: "USA"
    });


}
async function showData() {
    //
    const db = require("../../src/fddFirebase").db;


    const docRef =
        doc(db, "my-col/OqGO41Iy2hjIVZGTXCO3");
    // const docRef =
    //     dbMethods.doc(db, "users/4H4htO4mTbeoJOgkB6XT");
    //
    // const docRef = dbMethods.doc(db, "express-sessions/hJRs4TehpHaqodiexMzLioF0IzhOiWc0");
    const docSnap = getDoc(docRef);
    ``
    console.log(docSnap.data())


}


// makeDoc()
makeCollection()
// getData()

// queryData()




