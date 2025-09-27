import * as React from 'react';
import {createContext, useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {Outlet} from "react-router-dom";
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
            }
        )

        axios.get(`${process.env.REACT_APP_BASE_URL}/users/${userId}/programs`, {
            withCredentials: true,
        })
            .then(r => {
                setListOfPrograms(r.data)
            }).catch(
            e => {
                console.log(e)
            }
        )

        axios.get(`${process.env.REACT_APP_BASE_URL}/users/${userId}/sessions`, {
            withCredentials: true,
        })
            .then(r => {
                setListOfSessions(r.data)
            }).catch(
            e => {
                console.log(e)
            }
        )

    }, [user]);

    // Simplified return for testing - remove problematic components
    return (
        <BrowserSessionContext.Provider value={[browserSession, setBrowserSession]}>
            <ScreenContext.Provider value={[currentScreen, setCurrentScreen]}>
                <ListOfExercisesContext.Provider value={[listOfExercises, setListOfExercises]}>
                    <ListOfProgramsContext.Provider value={[listOfPrograms, setListOfPrograms]}>
                        <SessionContext.Provider value={[listOfSessions, setListOfSessions]}>
                            <RawDataContext.Provider value={[rawData, setRawData]}>
                                <Box sx={{ padding: 2 }}>
                                    <Typography variant="h4" gutterBottom>
                                        Transportation Analytics Platform
                                    </Typography>
                                    <Typography variant="body1">
                                        GlobalComponents loaded successfully! User: {user?.email || 'Not logged in'}
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Outlet />
                                    </Box>
                                </Box>
                            </RawDataContext.Provider>
                        </SessionContext.Provider>
                    </ListOfProgramsContext.Provider>
                </ListOfExercisesContext.Provider>
            </ScreenContext.Provider>
        </BrowserSessionContext.Provider>
    )
}