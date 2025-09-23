const dfd = require("danfojs-node");
// const e = require("express");
const fs = require('fs')

/*
* Config
*
*
*
*/

const monthsOfDataToCopy = 5;
const monthsOfDataToGenerate = 5;

/*
* End Config
* **/


const week = 1000 * 60 * 60 * 24 * 7;

const month = 1000 * 60 * 60 * 24 * 30;

const year = 1000 * 60 * 60 * 24 * 30 * 365;

const exercisesForNewData = ["someNewExercises", "dumbbell supinated curls"];

async function generateData() {

    let data = require("/Users/seandifatta/PycharmProjects/fitnessdatadashboard/server/test/exampleData.json")
    existingData = data.setData
    const type = data.type

    existingData.map(set => {
        const dateUTC = new Date(set.Time)
        set.Time = dateUTC
        set.monthUTC = dateUTC.getMonth()
        set.yearUTC = dateUTC.getFullYear()
    })

    let pastFewMonths = existingData.filter(set => {
        return set.monthUTC > 1 && set.yearUTC === 2024
    })

    // pastFewMonths.map(set => {
    //
    //     let time = set.Time;
    //
    //     time = new Date(time)
    //
    //     console.log()
    //
    // })

    pastFewMonths.map(set => {

        let timeStamp = new Date(set.Time)
        timeStamp = timeStamp.getTime()
        set.Time = new Date(timeStamp + monthsOfDataToGenerate * month)


    })

    let allData = existingData.concat(pastFewMonths);

    // allData = new dfd.DataFrame(allData)

    allData = { setData: allData, type: "lifting" }

    // dfd.toJSON(allData, {
    //     filePath: "/Users/seandifatta/PycharmProjects/fitnessdatadashboard/server/src/exampleData2.json"
    // })
    fs.writeFileSync("/Users/seandifatta/PycharmProjects/fitnessdatadashboard/server/src/exampleData2.json", JSON.stringify(allData))
    // fs.writeFileSync("/Users/seandifatta/PycharmProjects/fitnessdatadashboard/server/src/exampleData2.json", JSON.stringify(allData, null, 2))
}

generateData()


