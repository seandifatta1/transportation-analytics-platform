import AddCircleIcon from '@mui/icons-material/AddCircle';
import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import {createTheme, ThemeProvider, styled} from '@mui/material/styles';
import axios, {formToJSON, get} from "axios";

import {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import FormDialog from "../Components/MyForm";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {Fab, FormControl, FormControlLabel, Radio, RadioGroup, Stack} from "@mui/material";
import {Add, UploadFile} from "@mui/icons-material";
import PublishIcon from '@mui/icons-material/Publish';
import Typography from "@mui/material/Typography";
import {BrowserSessionContext, ScreenContext} from "../GlobalComponents";
import {useCookies} from "react-cookie";

const lightTheme = createTheme({palette: {mode: 'light'}});
const cardElevation = 6;


const Item = styled(Paper)(({theme}) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: 240,
    lineHeight: '60px',

}));

const cardTextStyle = {
    component: "h1",
    variant: "h6",
    color: "inherit",
    // noWrap,
    sx: {
        flexGrow: 1, justifyContent: "center", margin: 0,
        position: "relative",
        top: "50%",
        "-ms-transform": "translateY(-50%)",
        transform: "translateY(-50%)"
    }
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
                <FormControlLabel value="Running" control={<Radio/>} label="Running" disabled={true}/>
                <FormControlLabel value="Lifting" control={<Radio/>} label="Lifting" disabled={true}/>

            </RadioGroup>
        </FormControl>
    );
}

function AddNewProgram({ myPrograms, setMyPrograms }) {
    const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);

    const [open, setOpen] = React.useState(false);

    const [data, setData] = useState(null);

    // useEffect(() => {

    // }, [data]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (form) => {

        // setData(form["enter program name"])
        if (data !== null) {
            axios.post(`${process.env.REACT_APP_BASE_URL}/users/${cookies.user}/programs/${data}`, {
                setData: [{}],
                type: "lifting"
            }, { withCredentials: true })
        }

        setOpen(false);
        setMyPrograms(myPrograms.concat([data]))
        // setData("")
    };

    function handleSub(event) {
        // setData(true)
    }


    return (<Item key={"New Program"} elevation={cardElevation} onClick={handleClickOpen}>
    {/*return (<Item key={"New Program"} elevation={cardElevation} onClick={() => {}}>*/}

        <stack>

            <Typography padding={"25px"} fontSize={20}>
                Add a New Program
            </Typography>
            <AddCircleIcon style={{
                width: '25%',
                height: '25%',
            }}/>
        </stack>

        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
                component: 'form', onSubmit: (event) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    const formJson = Object.fromEntries(formData.entries());
                    const email = formJson.email;
                    handleClose(formJson);
                },
            }}
        >
            <DialogTitle>Add Program</DialogTitle>
            <DialogContent>
                {/*<DialogContentText>*/}
                {/*    To subscribe to this website, please enter your email address here. We*/}
                {/*    will send updates occasionally.*/}
                {/*</DialogContentText>*/}
                <RowRadioButtonsGroup/>
                <TextField
                    autoFocus
                    // required
                    margin="dense"
                    id="name"
                    name="enter program name"
                    label="Program Name"
                    // type="nam"
                    fullWidth
                    variant="standard"

                    onChange={e => {
                        setData(e.target.value)
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit" onClick={
                    (event, data) => {
                        // handleClose(event)
                        handleSub(event)
                    }
                }
                >Add</Button>
            </DialogActions>
        </Dialog>

    </Item>)
}


export default function ProgramCards(newProgram, programs, updatePrograms) {


    const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);

    const [browserSession, setBrowserSession] = useContext(BrowserSessionContext)

    const [currentScreen, setCurrentScreen] = useContext(ScreenContext)

    setCurrentScreen("My Programs")

    const navigate = useNavigate();

    const [myPrograms, setMyPrograms] = useState([])

    const [programList, setProgramList] = useState([<AddNewProgram/>])

    useEffect(() => {

        axios.get(`${process.env.REACT_APP_BASE_URL}/users/${cookies.user}/programs`, { withCredentials: true })
            .then(val => {



                setMyPrograms(val.data);
            }).catch(e => {
            console.log()
        })
    }, []);

    return (
        <Grid container spacing={{xs: 2, md: 3}} columns={{xs: 4, sm: 8, md: 12}}>
            {myPrograms.concat("Add New Program").map((name, index) => name !== "Add New Program" ? (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                        <Item onClick={() => {
                            navigate(`/Dashboard/MyPrograms/${name}`)
                        }} elevation={cardElevation}>
                            <Typography
                                {...cardTextStyle}
                            >
                                {name}
                            </Typography>
                        </Item>
                    </Grid>
                ) : (
                    <>
                        <Grid item xs={2} sm={4} md={4} key={index}>
                            <AddNewProgram myPrograms={myPrograms} setMyPrograms={setMyPrograms}/>
                        </Grid>
                    </>
                )
            )}
        </Grid>
    );

}



