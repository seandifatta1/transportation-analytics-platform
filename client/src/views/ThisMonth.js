import {useContext, useEffect, useState} from "react";
import {BarChart} from "@mui/x-charts/BarChart";
import * as React from "react";
import {axisClasses} from '@mui/x-charts/ChartsAxis';
import axios from "axios";
import {
    FormControl,
    FormControlLabel,
    FormLabel, Radio,
    RadioGroup, Stack,
    Tab,
    Tabs,
    ToggleButton,
    ToggleButtonGroup
} from "@mui/material";
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

import {ScreenContext} from "../GlobalComponents";
import {useCookies} from "react-cookie";

export function ThisMonth() {
    const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);

    const [currentScreen, setCurrentScreen] = useContext(ScreenContext)

    setCurrentScreen("This Month")

    const [currentTab, setCurrentTab] = useState("Lifting")

    const [myPrograms, setMyPrograms] = useState([])

    const [repsData, setRepsData] = useState();

    const [setsData, setSetsData] = useState();

    const [maxData, setMaxData] = useState();


    useEffect(() => {


        axios.get(`${process.env.REACT_APP_BASE_URL}/users/${cookies.user}/time?unitOfTime=month&amount=1&from=now`, {
            withCredentials: true
        })
            .then(data => {
                setSetsData(data.data.lifting.statistics.totalSets)
                setRepsData(data.data.lifting.statistics.totalReps)
                setMaxData(data.data.lifting.statistics.max)

            }).catch(e => {
            console.log(e)
        })


    }, [])


    return (
        <>
            <ExerciseTabs currentTab={currentTab} setCurrentTab={setCurrentTab}/>

            {currentTab === "Lifting" && setsData && repsData ? <LiftingCharts
                data={{
                    repsData: repsData,
                    setsData: setsData,
                    maxData: maxData

                }}
                myKey={["Reps_sum", "Reps_count", "Weight_max"]}
                myTitle={["# of Reps", "# of Sets", "Max Weight"]}/> : <RunningCharts/>
            }

        </>


    )
}

function RunningCharts(props) {

    return (
        <>
            {/*Fuck*/}
        </>
    )

}

function LiftingCharts(props) {

    const [whichPlot, setWhichPlot] = useState("Max")

    function handleTogglePlot() {

        if (whichPlot === "Sets") {

            return (
                <LiftingChart data={props.data.setsData} myKey={props.myKey[1]} myTitle={props.myTitle[1]} myYLabel="# of Sets"/>
            )
        } else if (whichPlot === "Reps") {
            return (
                <LiftingChart data={props.data.repsData} myKey={props.myKey[0]} myTitle={props.myTitle[0]} myYLabel="# of Reps"/>
            )
        } else {
            return (
                <LiftingChart data={props.data.maxData} myKey={props.myKey[2]} myTitle={props.myTitle[2]} myYLabel="Max (lbs)"/>
            )
        }

    }

    useEffect(() => {


    }, [whichPlot]);

    return (
        <>
            <Stack spacing={2} justifyContent="center"
                   alignItems="left" sx={{"paddingTop": "50px"}}>

                <RowRadioButtonsGroup whichPlot={whichPlot} setWhichPlot={setWhichPlot}/>

                {handleTogglePlot()}

            </Stack>
        </>

    )

}

function LiftingChart(props) {

    return (
        <BarChart
            margin={{ left: 150 }}
            layout={"horizontal"}
            dataset={props.data}
            yAxis={[
                {
                    scaleType: 'band',
                    dataKey: 'Exercise',

                },
            ]}
            series={[

                {dataKey: `${props.myKey}`}
            ]}
            height={600}
            xAxis={[{label: props.myYLabel}]}
            grid={{horizontal: true}}

        />
    );
}

function ExerciseTabs(props) {

    // const [value, setValue] = useState("Lifting")

    return (
        <>
            <Tabs
                value={props.currentTab}
                onChange={(e, v) => {
                    props.setCurrentTab(v)
                }}
                variant="fullWidth"
                scrollButtons
                allowScrollButtonsMobile
                aria-label="scrollable force tabs example"
            >
                <Tab icon={<FitnessCenterIcon/>} label="Lifting" value={"Lifting"}/>
                <Tab icon={<DirectionsRunIcon/>} label="Running" value={"Running"}/>

            </Tabs>
            {/*<h1>{props.currentTab}</h1>*/}

        </>
    )

}

function RowRadioButtonsGroup(props) {
    return (
        <FormControl sx={{"padding-left": "35%"}}>
            {/*<FormLabel id="demo-row-radio-buttons-group-label">This Month's Data</FormLabel>*/}
            <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={props.whichPlot}
                onChange={(event) => {
                    props.setWhichPlot(event.target.value)
                }}
            >
                <FormControlLabel value="Max" control={<Radio/>} label="Max"/>
                <FormControlLabel value="Sets" control={<Radio/>} label="Sets"/>
                <FormControlLabel value="Reps" control={<Radio/>} label="Reps"/>

            </RadioGroup>
        </FormControl>
    );
}