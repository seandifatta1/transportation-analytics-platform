const {DataFrame, toJson} = require("danfojs-node")
const {getHistograms} = require("../src/dataUtils");

describe('dataUtils', () => {

    test("getHistorgarms", async () => {

        const data = new DataFrame([
            {
                Exercise: "",
                Substitution: "",
                Reps: 0,
                Weight: 0,
                Notes: "",
                Time: "2023-09-26T03:32:00.000Z",
                Day: "",
                monthUTC: 0,
                yearUTC: 0
            }
        ])

        getHistograms(data)

    })

})