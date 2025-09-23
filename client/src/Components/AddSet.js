import * as React from 'react';
import {useContext, useState} from 'react';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import AddIcon from '@mui/icons-material/Add';
import {Autocomplete, createFilterOptions, Fab} from "@mui/material";
import TextField from '@mui/material/TextField';
import DialogActions from "@mui/material/DialogActions";
import {ListOfExercisesContext, ListOfProgramsContext, RawDataContext, SessionContext} from "../GlobalComponents";
import {useCookies} from "react-cookie";
import axios from "axios";
import * as _ from "lodash"


const filter = createFilterOptions();


export default function SetInputDialogFab() {


    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
        // setSelectedValue(value);
    };

    return (
        <div>

            <br/>
            <Fab style={{
                margin: 0,
                top: 'auto',
                right: 20,
                bottom: 20,
                left: 'auto',
                position: 'fixed',
            }} color="primary" aria-label="add" onClick={ handleClickOpen }>
                <AddIcon/>
            </Fab>

            <SetInputDialog
                open = { open }
                onClose = { handleClose }
            />
        </div>
    );
}

function SetInputTextBox({label, listData, value, setValue}) {
    // const [value, setValue] = React.useState(null);

    const placeHolder = `Enter ${label}`

    return (

        <Autocomplete

            onChange={(event, newValue) => {

                event.preventDefault()

                if (typeof (newValue) === 'string') {
                    setValue({
                        title: newValue,
                    });
                } else if (newValue && newValue.inputValue) {
                    // Create a new value from the user input
                    setValue({
                        title: newValue.inputValue,
                    });

                } else {
                    setValue(newValue);
                }
            }}

            filterOptions={(options, params) => {
                const filtered = filter(options, params);

                const {inputValue} = params;
                // Suggest the creation of a new value
                const isExisting = options.some((option) => inputValue === option.title);

                if ((inputValue !== '' && !isExisting) && (label === "Program" || label === "Session" || label === "Exercise")) {
                    filtered.push({
                        inputValue,
                        title: `Add "${inputValue}"`,
                    });
                }

                return filtered;
            }}

            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            id="free-solo-with-text-demo"
            options={listData}
            getOptionLabel={(option) => {
                // Value selected with enter, right from the input
                if (typeof option === 'string') {
                    return option;
                }
                // Add "xxx" option created dynamically
                if (option.inputValue) {
                    return option.inputValue;
                }
                // Regular option
                return option.title;
            }}
            renderOption={(props, option) => <li {...props}>
                {option.title}
            </li>}
            sx={{width: 300}}
            freeSolo
            renderInput={(params) => (
                <TextField {...params} label={label} placeholder={placeHolder}/>
            )}
        />
    );
}

function SetInputDialog(props) {

    const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);

    const [programs, setPrograms] = useContext(ListOfProgramsContext)
    const [listOfExercises, setListOfExercises] = useContext(ListOfExercisesContext)
    const [listOfSessions, setListOfSessions] = useContext(SessionContext)

    const [rawData, setRawData] = useContext(RawDataContext)

    const {onClose, selectedValue, open} = props;

    const [currentProgram, setCurrentProgram] = useState()
    const [currentSession, setCurrentSession] = useState()
    const [currentExercise, setCurrentExercise] = useState()
    const [currentReps, setCurrentReps] = useState()
    const [currentWeight, setCurrentWeight] = useState()

    const handleClose = (setData) => {
        axios.post(`${process.env.REACT_APP_BASE_URL}/users/${cookies.user}/sets`, setData, {
            withCredentials: true
        })

        setRawData(rawData.concat([setData]))

    };

    return (
        // <Dialog onClose={handleClose} open={open} PaperProps={{
        <Dialog onClose={() => {}} open={open} PaperProps={{
            component: 'form', onSubmit: (event) => {


                event.preventDefault();
                
                try {
                    const formJson = {}


                    formJson.Program = event.target[0].value
                    formJson.Session = event.target[3].value
                    formJson.Exercise = event.target[6].value
                    formJson.Weight = event.target[9].value
                    formJson.Reps = event.target[12].value
                    formJson.Time = Date.now()

                    handleClose(formJson);
                } catch (e) {
                    
                }
                
            },
        }}>

            <DialogTitle>Enter Data for your Set</DialogTitle>


            <ListItem>
                <SetInputTextBox label={"Program"} listData={programs.map(program => {
                    return {
                        title: program
                    }
                })} value={currentProgram} setValue={setCurrentProgram}/>
            </ListItem>
            <ListItem>
                <SetInputTextBox label={"Session"} listData={listOfSessions.map(session => {
                    return {
                        title: session
                    }
                })} value={currentSession} setValue={setCurrentSession}/>
            </ListItem>
            <ListItem>
                <SetInputTextBox label={"Exercise"} listData={listOfExercises.map(exercise => {
                    return {
                        title: exercise
                    }
                })} value={currentExercise} setValue={setCurrentExercise}/>
            </ListItem>
            <ListItem>
                <SetInputTextBox label={"Weight (lbs)"} listData={[0]} value={currentWeight}
                                 setValue={setCurrentWeight}/>
            </ListItem>
            <ListItem>
                <SetInputTextBox label={"Reps"} listData={[0]} value={currentReps} setValue={setCurrentReps}/>
            </ListItem>

            <DialogActions>
                <Button onClick={ onClose }>Cancel</Button>
                <Button type="submit" onClick={
                    (event, data) => {
                        console.log()
                        // handleAddClick(event)
                        onClose()
                    }
                }
                >Add</Button>
            </DialogActions>

        </Dialog>)
}
