import * as React from 'react';
import {useState} from 'react';
import {Chart} from "../views/SpecificExercise";

// Generate Sales Data
function createData(time, amount, intesity) {
    return {time: time, amount: amount ?? null, intensity: amount + 2};
}

const data = [
    createData('00:00', 0),
    createData('03:00', 300),
    createData('06:00', 600),
    createData('09:00', 800),
    createData('12:00', 1500),
    createData('15:00', 2000),
    createData('18:00', 2400),
    createData('21:00', 2400),
    createData('24:00'),
];

export default function TrendView() {

    const [exercise, setExercise] = useState("intensity")


    // function onExerciseChange(event, value) {
    //     setExercise(value)
    // }

    return (
        <React.Fragment>

            <ComboBox exercise={exercise} onExerciseChange={setExercise}/>
            <Chart exercise={exercise}/>

        </React.Fragment>
    )
}

