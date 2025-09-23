import * as React from "react";
import {createContext, useContext, useEffect, useState} from "react";
import {LineChart, ScatterChart} from "@mui/x-charts";
import {FormControl, FormControlLabel, ListItem, Radio, RadioGroup, Stack, Tab, Tabs} from "@mui/material";
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import Box from "@mui/material/Box";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import {FixedSizeList} from 'react-window';

import axios from "axios";
import Title from "../Components/Title";
import {BarChart} from "@mui/x-charts/BarChart";
import {ListOfExercisesContext, RawDataContext, ScreenContext} from "../GlobalComponents";
import {useCookies} from "react-cookie";

const liftingContext = createContext()



function LiftingTimeSeriesChart(props) {

    let x = []
    let y = []

    const myData = props.data.filter(set => {
        return set.Exercise === props.selectedExercise && set.Weight !== "unknown"
    })

    for (let i = 0; i < myData.length; i++) {
        x.push(i)
        y.push(myData[i].Weight)
    }

    return (
        <React.Fragment>
            <LineChart
                height={600}

                xAxis={
                    [
                        {
                            data: x,

                            label: "Set #"
                        },

                    ]}
                yAxis={[{
                    label: "Weight (lbs)"

                }]}
                series={[
                    {
                        data: y,
                        // area: true,
                    },

                ]}

            />
        </React.Fragment>
    );
}


export function SpecificExercise() {

    const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);


    const [currentScreen, setCurrentScreen] = useContext(ScreenContext)

    const [rawData, setRawData] = useContext(RawDataContext)

    setCurrentScreen("Specific Exercise")

    const [currentTab, setCurrentTab] = useState("Lifting")

    const [myPrograms, setMyPrograms] = useState([])

    const [maxData, setMaxData] = useState();


    useEffect(() => {

        // axios.get(`${process.env.REACT_APP_BASE_URL}/${cookies.user}/month?unitOfTime=week&amount=1&from=now`, {
        //     withCredentials: true
        // })
        //     // axios.get(`http://localhost:8081/users/sean/month?unitOfTime=month&amount=2&from=now`)
        //     .then(data => {
        //         setRawData(data.data.lifting.rawData)
        //         setMaxData(data.data.lifting.statistics.max)

        //     }).catch(e => {
        //     console.log(e)
        // })


    }, [])

    useEffect(() => {

        // setMaxData(getH)
        
    }, [rawData])


    return (<>
            <ExerciseTabs currentTab={currentTab} setCurrentTab={setCurrentTab}/>

            {/* {currentTab === "Lifting" && maxData && rawData ? <LiftingCharts */}
            {currentTab === "Lifting" && rawData ? <LiftingCharts
                data={{
                    rawData: rawData, maxData: maxData

                }}
                myKey={["Weight_max"]}
                myTitle={["Max Weight"]}/> : <RunningCharts/>}

        </>


    )
}

function RunningCharts(props) {

    return (<>
        <Title name={""}></Title>
    </>)

}

function LiftingCharts(props) {

    const [whichPlot, setWhichPlot] = useState("Time")

    const [listOfExercises, setListOfExercises] = useState([]);

    const [selectedExercise, setSelectedExercise] = useState(0);

    useEffect(() => {

        let exerciseNames = []

        props.data.rawData.forEach(set => {

            exerciseNames.push(set.Exercise)

        })


        let temp = exerciseNames.filter(onlyUnique)
        setListOfExercises(temp);
        setSelectedExercise(temp[0])


    }, [])


    return (<>
            <Stack spacing={2} justifyContent="center"
                   alignItems="left" sx={{"paddingTop": "50px"}}>


                <RowRadioButtonsGroup whichPlot={whichPlot} setWhichPlot={setWhichPlot}/>

                <Stack spacing={2} justifyContent="center" direction="row" minWidth={1000}
                       alignItems="center">
                    <VirtualizedList listOfExercises={listOfExercises} setSelectedExercise={setSelectedExercise}/>
                    {whichPlot === "Time" ? <>
                        <LiftingTimeSeriesChart data={props.data.rawData} listOfExercises={listOfExercises}
                                                selectedExercise={selectedExercise}/>
                    </> : <LiftingWeightVsRepsChart data={props.data.rawData} listOfExercises={listOfExercises}
                                                    selectedExercise={selectedExercise}/>}
                </Stack>


            </Stack>
        </>

    )

}

function LiftingWeightVsRepsChart(props) {

    // let myData = DataFrame(props.data);

    // let df = DataFrame(props.data);

    const myData = props.data.filter(set => {
        return set.Exercise === props.selectedExercise && set.Weight !== "unknown"
    })

    const data1 = null; // myData.filter({column: "Exercise", is: "==", to: exercises[whichExercise]})

    return (<ScatterChart
        height={600}

        // width={600}
        // height={300}
        series={[
            {
                data: myData.map((v) => ({x: v.Reps, y: v.Weight})),
            },
        ]}
        grid={{vertical: true, horizontal: true}}
        xAxis={[{label: "Reps"}]}
        yAxis={[{label: "Weight (lbs)"}]}

    />);
}

function LiftingBarChart(props) {

    // function valueFormatter(value, context) {
    //     console.log(
    //         {
    //             value: value,
    //             context: context
    //         }
    //     )
    //     return ""
    // }

    return (


        <BarChart
            margin={{left: 150}}
            layout={"horizontal"}
            dataset={props.data}

            // bottomAxis={{fontSize: 10}}

            yAxis={[{
                scaleType: 'band', dataKey: 'Exercise'
            },]}
            series={[

                {dataKey: `${props.myKey}`}]}
            // width={900}
            height={600}
            xAxis={
                [
                    {
                        label: props.myYLabel,
                    }

                ]
            }


            grid={{horizontal: true}}
            // sx={{
            //     "paddingLeft": "50px",
            //     // [`.${axisClasses.bottom} .${axisClasses.tickLabel}`]: {
            //     //     transform: "rotateZ(-45deg) translateY(100px)"
            //     // },
            //     [`.${axisClasses.left} .${axisClasses.label}`]: {
            //         transform: "translate(-0px, 0px)"
            //     },
            //
            // }}

        />);
}

function ExerciseTabs(props) {

    // const [value, setValue] = useState("Lifting")

    return (<>
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

    </>)

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
                <FormControlLabel value="Time" control={<Radio/>} label="Sets over Time"/>
                <FormControlLabel value="Reps Vs. Weight" control={<Radio/>} label="Reps Vs. Weight"/>

            </RadioGroup>
        </FormControl>
    );
}


function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
}

function VirtualizedList(props) {

    const {listOfExercises, setSelectedExercise} = props

    function renderRow(props) {
        const {index, style} = props;

        return (
            <ListItem style={style} key={listOfExercises[index]} component="div" disablePadding>
                <ListItemButton onClick={e => setSelectedExercise(e.target.innerText)}>
                    <ListItemText primary={listOfExercises[index]}/>
                </ListItemButton>
            </ListItem>
        );
    }


    return (
        <Box
            sx={{width: '100%', height: 500, maxWidth: 250, bgcolor: 'background.paper', border: '1px solid grey'}}
        >
            <FixedSizeList
                height={500}
                // width={360}
                itemSize={46}
                itemCount={props.listOfExercises.length}
                overscanCount={5}
            >
                {renderRow}
            </FixedSizeList>
        </Box>
    );
}