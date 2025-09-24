import * as React from 'react';
import {useContext, useState} from "react";
import {
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Divider,
    Collapse
} from "@mui/material";
import {
    Dashboard as DashboardIcon,
    ViewWeek as ViewWeekIcon,
    CalendarMonth as CalendarMonthIcon,
    DirectionsCar as DirectionsCarIcon,
    LocalShipping as LocalShippingIcon,
    Analytics as AnalyticsIcon,
    Add as AddIcon,
    ExpandLess,
    ExpandMore
} from '@mui/icons-material';
import {useNavigate} from "react-router-dom";
import {ScreenContext} from "../GlobalComponents";

export default function TransportationDrawerItems() {
    return (
        <List>
            <FleetAnalytics />
            <Divider sx={{ my: 1 }} />
            <FleetManagement />
            <Divider sx={{ my: 1 }} />
            <QuickActions />
        </List>
    );
}

function FleetAnalytics() {
    const navigate = useNavigate();
    const [currentScreen] = useContext(ScreenContext);

    return (
        <div>
            <ListSubheader component="div" inset>
                Fleet Analytics
            </ListSubheader>
            <ListItemButton 
                onClick={() => navigate('/Dashboard/WeeklyFleetAnalysis')}
                selected={currentScreen === "Weekly Fleet Analysis"}
            >
                <ListItemIcon>
                    <ViewWeekIcon />
                </ListItemIcon>
                <ListItemText primary="Weekly Analysis" />
            </ListItemButton>
            <ListItemButton 
                onClick={() => navigate('/Dashboard/MonthlyFleetTrends')}
                selected={currentScreen === "Monthly Fleet Trends"}
            >
                <ListItemIcon>
                    <CalendarMonthIcon />
                </ListItemIcon>
                <ListItemText primary="Monthly Trends" />
            </ListItemButton>
            <ListItemButton 
                onClick={() => navigate('/Dashboard/VehicleAnalysis')}
                selected={currentScreen === "Vehicle Analysis"}
            >
                <ListItemIcon>
                    <DirectionsCarIcon />
                </ListItemIcon>
                <ListItemText primary="Vehicle Analysis" />
            </ListItemButton>
        </div>
    );
}

function FleetManagement() {
    const navigate = useNavigate();
    const [currentScreen] = useContext(ScreenContext);
    const [open, setOpen] = useState(true);

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <div>
            <ListSubheader component="div" inset>
                Fleet Management
            </ListSubheader>
            <ListItemButton onClick={handleClick}>
                <ListItemIcon>
                    <LocalShippingIcon />
                </ListItemIcon>
                <ListItemText primary="Fleet Routes" />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemButton 
                        sx={{ pl: 4 }}
                        onClick={() => navigate('/Dashboard/FleetRoutes')}
                        selected={currentScreen === "Fleet Routes"}
                    >
                        <ListItemIcon>
                            <LocalShippingIcon />
                        </ListItemIcon>
                        <ListItemText primary="All Routes" />
                    </ListItemButton>
                    <ListItemButton 
                        sx={{ pl: 4 }}
                        onClick={() => navigate('/Dashboard/MyPrograms')}
                        selected={currentScreen === "MyPrograms"}
                    >
                        <ListItemIcon>
                            <AnalyticsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Route Analytics" />
                    </ListItemButton>
                </List>
            </Collapse>
        </div>
    );
}

function QuickActions() {
    const navigate = useNavigate();

    return (
        <div>
            <ListSubheader component="div" inset>
                Quick Actions
            </ListSubheader>
            <ListItemButton onClick={() => navigate('/Dashboard/AddPerformanceRecord')}>
                <ListItemIcon>
                    <AddIcon />
                </ListItemIcon>
                <ListItemText primary="Add Performance Record" />
            </ListItemButton>
        </div>
    );
}

// Legacy components for backward compatibility
export function Favorites() {
    const navigate = useNavigate();
    const [currentScreen] = useContext(ScreenContext);

    return (
        <div>
            <Divider sx={{ my: 1 }} />
            <ListSubheader component="div" inset>
                Quick Access
            </ListSubheader>
            <ListItemButton 
                onClick={() => navigate('/Dashboard/WeeklyFleetAnalysis')}
                selected={currentScreen === "Weekly Fleet Analysis"}
            >
                <ListItemIcon>
                    <ViewWeekIcon />
                </ListItemIcon>
                <ListItemText primary="This Week" />
            </ListItemButton>
            <ListItemButton 
                onClick={() => navigate('/Dashboard/MonthlyFleetTrends')}
                selected={currentScreen === "Monthly Fleet Trends"}
            >
                <ListItemIcon>
                    <CalendarMonthIcon />
                </ListItemIcon>
                <ListItemText primary="This Month" />
            </ListItemButton>
        </div>
    );
}

export function Programs() {
    const navigate = useNavigate();
    const [currentScreen] = useContext(ScreenContext);

    return (
        <div>
            <ListSubheader component="div" inset>
                Fleet Routes
            </ListSubheader>
            <ListItemButton 
                onClick={() => navigate('/Dashboard/FleetRoutes')}
                selected={currentScreen === "Fleet Routes"}
            >
                <ListItemIcon>
                    <LocalShippingIcon />
                </ListItemIcon>
                <ListItemText primary="All Routes" />
            </ListItemButton>
        </div>
    );
}

export function Snapshots() {
    const navigate = useNavigate();
    const [currentScreen] = useContext(ScreenContext);

    return (
        <div>
            <ListSubheader component="div" inset>
                Analytics
            </ListSubheader>
            <ListItemButton 
                onClick={() => navigate('/Dashboard/VehicleAnalysis')}
                selected={currentScreen === "Vehicle Analysis"}
            >
                <ListItemIcon>
                    <DirectionsCarIcon />
                </ListItemIcon>
                <ListItemText primary="Vehicle Analysis" />
            </ListItemButton>
        </div>
    );
}
