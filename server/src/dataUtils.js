// in millisconds

const firestore = require("firebase/firestore");
const { DataFrame, toJSON } = require("danfojs-node");
const axios = require("axios");

const week = 1000 * 60 * 60 * 24 * 7;

const month = 1000 * 60 * 60 * 24 * 30;

const year = 1000 * 60 * 60 * 24 * 30 * 365;

function filterByDate(data, unitOfTime = "week", amount = 1, from = "now") {

    let unitOfTimeUTC;
    let fromUTC;

    if (from === "now") {
        fromUTC = Date.now()
    } else {
        console.error("only supports now")
    }

    if (unitOfTime === "week") {
        unitOfTimeUTC = week;
    } else if (unitOfTime === "month") {
        unitOfTimeUTC = month;
    } else {
        console.error("not supported")
    }

    const startUTC = fromUTC - (unitOfTimeUTC*amount);

    const programData = new DataFrame(data);

    const filteredMask = programData.apply(set => {

        let time = new Date(set[5])
        time = time.getTime()
        return  time > startUTC;

    }, {axis: 1})


    let filteredData;

    if (programData.size !== 0) {
        filteredData = programData.loc({rows: filteredMask})
    } else {
        filteredData = programData
    }

    return filteredData

}

function getHistograms(data) {

    try {
        data = data.asType("Weight", "float32")

        const nanMask = data["Weight"].apply(weight => {

            if (typeof(weight) === "number") {
                return true
            }  else {
                return false
            }
        }, {axis: 1})

        let dataDropNaN = data.loc( { rows: nanMask })

        let exerciseGroups = data.groupby(["Exercise"])
        let exerciseGroupsDropNaN = dataDropNaN.groupby(["Exercise"])
        dataDropNaN.column("Weight").values.forEach(x => console.log(typeof(x)))

        // Math.max(...exerciseGroupsDropNaN.apply(x => x)["Weight"].values)

        return {
            totalSets: toJSON(exerciseGroups.col(["Reps"]).count()),
            totalReps: toJSON(exerciseGroups.col(["Reps"]).sum()),
            max: toJSON(exerciseGroupsDropNaN.col(["Weight"]).max())
        }
    } catch (e) {
        return new Error("Bypassing lack of formatting")
    }


}

class Log {

    // This class is the interface between the datasources (e.g. Notion, Excel, CSV) and the databases

    constructor(data) {

        this.data = data

    }

    static fromNotion(res) {

        let listOfEntries = []

        for (let i = 0; i < res.results.length; i++) {

            const entry = res.results[i];

            const keys = Object.keys(entry.properties)

            listOfEntries[i] = {}

            for (let j = 0; j < keys.length; j++) {

                const key = keys[j]

                let value = entry.properties[key];

                try {

                    if (key === 'Rest') {
                        value = value.number;
                    } else if (key === 'Reps') {
                        value = value.number;
                    } else if (key === 'Weight/Amount') {
                        value = value.number;
                    } else if (key === 'Day') {
                        value = value.select.name;
                    } else if (key === 'Variation') {
                        value = value.select.name;
                    } else if (key === 'RPEs') {
                        value = value.number;
                    } else if (key === 'Set') {
                        value = value.select.name;

                    } else if (key === 'Notes') {
                        value = value.rich_text[0].text.content;
                    } else if (key === 'Activity Name') {
                        value = value.select.name;
                    } else if (key === 'Weight Unit') {
                        value = value.select.name;
                    } else if (key === 'Created time') {
                        value = value.created_time;
                    }
                } catch (err) {
                    value = null
                }

                if (['Template', 'Date', 'Name'].includes(keys[j]) === false) {

                    listOfEntries[i][keys[j]] = value;
                }

            }
        }

        return Log(listOfEntries);

    }


    fromExcel() {
        // TODO read excelsheet into Log
    }

    fromCSV() {
        // TODO read csv into Log
    }

    toFirestore() {

        /*
        *
        *  Writes Log objects to firestore
        *
        * */

        for (let i = 0; i < this.data.length; i++) {
            const documentReference = doc(this.client, 'sessions', i.toString());
            setDoc(documentReference, data[i])
        }
    }

    static fromFirestore() {

        // This func

    }

}

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}
module.exports = {
    filterByDate,
    getHistograms,
    makeid
}

