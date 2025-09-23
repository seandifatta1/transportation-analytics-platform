const {makeid, filterByDate, getHistograms} = require("../dataUtils")

const {addDoc, getDocs, collection, doc, setDoc, getDoc} = require("firebase/firestore");
const {db, auth} = require("../fddFirebase");
const express = require("express");
const axios = require("axios")
const {programRouter} = require("./programRouter");
const {connectAuthEmulator, getAuth, createUserWithEmailAndPassword} = require("firebase/auth");
const {toJSON, DataFrame} = require("danfojs-node");
const {postNewProgram, getAllPrograms, getProgram, getAllSessions} = require("../firestoreInterface");

const userRouter = express.Router({mergeParams: true});


module.exports = {
    userRouter,
}
