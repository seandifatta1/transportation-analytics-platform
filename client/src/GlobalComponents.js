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
import DrawerItems, {Favorites, Programs, Snapshots} from './Components/TransportationListItems';
import {AppBar, defaultTheme, Drawer} from "./Components/globals";
import {Outlet} from "react-router-dom";
import AddPerformanceRecord from "./Components/AddPerformanceRecord";
import AddPerformanceRecordRefactored from "./Components/AddPerformanceRecordRefactored";
import LogoutButton from "./Components/LogoutButton";
import {useCookies} from "react-cookie";
import axios from "axios";
import { useAuth } from './contexts/AuthContext';

export const RawDataContext = createContext();
export const ListOfExercisesContext = createContext();
export const ListOfProgramsContext = createContext()
export const ScreenContext = createContext()
export const SessionContext = createContext()
export const BrowserSessionContext = createContext()

export default function GlobalComponents() {

    const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);
    const { user, logout, isAuthenticated } = useAuth();
    const [browserSession, setBrowserSession] = useState(false)


    const [rawData, setRawData] = useState([])
    const [listOfExercises, setListOfExercises] = useState([])
    const [listOfPrograms, setListOfPrograms] = useState([])
    const [listOfSessions, setListOfSessions] = useState([])

    const [currentScreen, setCurrentScreen] = useState([])

    const [open, setOpen] = React.useState(true);

    useEffect(() => {
        if (!user?.id) return;

        const userId = user.id;

        axios.get(`${process.env.REACT_APP_BASE_URL}/users/${userId}/data`, {
            withCredentials: true,

        })
            .then(r => {
                setRawData(r.data)
            }).catch(
            e => {
                console.log(e)

                if (e.message.includes(401)) {
                    setBrowserSession(true)
                }

            })

        axios.get(`${process.env.REACT_APP_BASE_URL}/users/${userId}/exercises`, {
            withCredentials: true
        })
            .then(r => {
                setListOfExercises(r.data)
            }).catch(e => console.log(e))

        axios.get(`${process.env.REACT_APP_BASE_URL}/users/${userId}/programs`, {
            withCredentials: true
        })
            .then(r => {
                setListOfPrograms(r.data)
            }).catch(e => console.log(e))
        //
        axios.get(`${process.env.REACT_APP_BASE_URL}/users/${userId}/sessions`, {withCredentials: true})
            .then(r => {
                setListOfSessions(r.data)
            }).catch(e => console.log(e))

    }, [user]);


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
                                                
                                                <LogoutButton variant="icon" />

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
                                        <AddPerformanceRecordRefactored/>
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

