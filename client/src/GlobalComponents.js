import * as React from 'react';
import {createContext, useEffect, useState} from 'react';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DrawerItems, {Favorites, Programs, Snapshots} from './Components/ListItems';
import {AppBar, defaultTheme, Drawer} from "./Components/globals";
import {Outlet} from "react-router-dom";
import SetInputDialogFab from "./Components/AddSet";
import {useCookies} from "react-cookie";
import axios from "axios";

export const RawDataContext = createContext();
export const ListOfExercisesContext = createContext();
export const ListOfProgramsContext = createContext()
export const ScreenContext = createContext()
export const SessionContext = createContext()
export const BrowserSessionContext = createContext()

export default function GlobalComponents() {

    const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);
    const [browserSession, setBrowserSession] = useState(false)


    const [rawData, setRawData] = useState([])
    const [listOfExercises, setListOfExercises] = useState([])
    const [listOfPrograms, setListOfPrograms] = useState([])
    const [listOfSessions, setListOfSessions] = useState([])

    const [currentScreen, setCurrentScreen] = useState([])

    const [open, setOpen] = React.useState(true);

    useEffect(() => {

        axios.get(`${process.env.REACT_APP_BASE_URL}/users/${cookies.user}/data`, {
            withCredentials: true,

        })
            .then(r => {
                setRawData(r.data)
            }).catch(
            e => {
                console.log()

                if (e.message.includes(401)) {
                    setBrowserSession(true)
                }

            })

        axios.get(`${process.env.REACT_APP_BASE_URL}/users/${cookies.user}/exercises`, {
            withCredentials: true
        })
            .then(r => {
                setListOfExercises(r.data)
            }).catch(e => console.log(e))

        axios.get(`${process.env.REACT_APP_BASE_URL}/users/${cookies.user}/programs`, {
            withCredentials: true
        })
            .then(r => {
                setListOfPrograms(r.data)
            }).catch(e => console.log(e))
        //
        axios.get(`${process.env.REACT_APP_BASE_URL}/users/${cookies.user}/sessions`, {withCredentials: true})
            .then(r => {
                setListOfSessions(r.data)
            }).catch(e => console.log(e))

    }, []);


    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <BrowserSessionContext.Provider value={[browserSession, setBrowserSession]}>
            <ScreenContext.Provider value={[currentScreen, setCurrentScreen]}>
                <ListOfExercisesContext.Provider value={[listOfExercises, setListOfExercises]}>
                    <ListOfProgramsContext.Provider value={[
                        listOfPrograms,
                        setListOfPrograms
                    ]}>
                        <SessionContext.Provider value={[
                            listOfSessions,
                            setListOfSessions
                        ]}>

                            < RawDataContext.Provider value={[rawData, setRawData]}>
                                <ThemeProvider theme={defaultTheme}>
                                    <Box sx={{display: 'flex'}}>
                                        <CssBaseline/>
                                        <AppBar position="absolute" open={open}>
                                            <Toolbar
                                                sx={{
                                                    pr: '24px', // keep right padding when drawer closed
                                                }}
                                            >
                                                <IconButton
                                                    edge="start"
                                                    color="inherit"
                                                    aria-label="open drawer"
                                                    onClick={toggleDrawer}
                                                    sx={{
                                                        marginRight: '36px',
                                                        ...(open && {display: 'none'}),
                                                    }}
                                                >
                                                    <MenuIcon/>
                                                </IconButton>
                                                <Typography
                                                    component="h1"
                                                    variant="h6"
                                                    color="inherit"
                                                    noWrap
                                                    sx={{flexGrow: 1}}
                                                >
                                                    {currentScreen}
                                                </Typography>

                                            </Toolbar>
                                        </AppBar>
                                        <Drawer variant="permanent" open={open}>
                                            <Toolbar
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'flex-end',
                                                    px: [1],
                                                }}
                                            >
                                                <IconButton onClick={toggleDrawer}>
                                                    <ChevronLeftIcon/>
                                                </IconButton>
                                            </Toolbar>
                                            <Divider/>
                                            <DrawerItems/>

                                        </Drawer>
                                        <Box
                                            component="main"
                                            sx={{
                                                backgroundColor: (theme) =>
                                                    theme.palette.mode === 'light'
                                                        ? theme.palette.grey[100]
                                                        : theme.palette.grey[900],
                                                flexGrow: 1,
                                                height: '100vh',
                                                overflow: 'auto',
                                            }}
                                        >
                                            <Toolbar/>
                                            <Container maxWidth="lg" sx={{mt: 4, mb: 4}}>
                                                <Outlet/>
                                                {/*<Copyright sx={{pt: 4}}/>*/}
                                            </Container>
                                        </Box>
                                        <SetInputDialogFab/>
                                    </Box>
                                </ThemeProvider>
                            </RawDataContext.Provider>
                        </SessionContext.Provider>
                    </ListOfProgramsContext.Provider>
                </ListOfExercisesContext.Provider>
            </ScreenContext.Provider>
        </BrowserSessionContext.Provider>
    )
}

