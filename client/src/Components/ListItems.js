import * as React from 'react';
// import {useContext, useState} from 'react';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import ListSubheader from '@mui/material/ListSubheader';
// import DashboardIcon from '@mui/icons-material/Dashboard';

// import Divider from "@mui/material/Divider";
// import {Fab, TextField} from "@mui/material";
// import ViewWeekIcon from '@mui/icons-material/ViewWeek';
// import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
//
import Divider from "@mui/material/Divider";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import {useContext, useState} from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListItemText from "@mui/material/ListItemText";
import {useNavigate} from "react-router-dom";
import {ScreenContext} from "../GlobalComponents";

export default function DrawerItems() {

    //
    return (
        <List >
            <Programs/>
            <Divider sx={{my: 1}}/>
            <Snapshots/>
            <Favorites/>
        </List>
    );
}

//
function Favorites() {

    const navigate = useNavigate();

    return (
        <div>
            <Divider sx={{my: 1}}/>
            <ListSubheader component="div" inset>
                Favorites
            </ListSubheader>
        </div>
    )

}

function Snapshots() {

    const navigate = useNavigate();

    return (
        <div>
                <ListSubheader component="div" inset>
                    Snapshots
                </ListSubheader>

                <ListItemButton onClick={() => navigate("/Dashboard/ThisWeek")}>
                    <ListItemIcon>
                        <ViewWeekIcon/>
                    </ListItemIcon>
                    Weekly Snapshot
                </ListItemButton>

                <ListItemButton onClick={() => navigate("/Dashboard/ThisMonth")}>
                    <ListItemIcon>
                        <CalendarMonthIcon/>
                    </ListItemIcon>
                    Monthly Snapshot
                </ListItemButton>

                <ListItemButton onClick={() => navigate("/Dashboard/SpecificExercise")}>
                    <ListItemIcon>
                        <CenterFocusStrongIcon/>
                    </ListItemIcon>
                    Specific Exercise
                </ListItemButton>
        </div>

    )

}

function Programs() {

    const navigate = useNavigate();

    return (
        <React.Fragment>


                <ListItemButton onClick={() => navigate("/Dashboard/MyPrograms")}>
                    <ListItemIcon>
                        <DashboardIcon/>
                    </ListItemIcon>
                    <ListItemText primary="My Programs"/>
                </ListItemButton>

        </React.Fragment>
    );
}

