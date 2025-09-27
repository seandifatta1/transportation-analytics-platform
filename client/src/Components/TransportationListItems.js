import React from 'react';
import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    DirectionsCar as VehicleIcon,
    Route as RouteIcon,
    TrendingUp as TrendsIcon,
    Assessment as AnalysisIcon
} from '@mui/icons-material';

export const Favorites = () => (
    <List>
        <ListItem disablePadding>
            <ListItemButton>
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
            </ListItemButton>
        </ListItem>
    </List>
);

export const Programs = () => (
    <List>
        <ListItem disablePadding>
            <ListItemButton>
                <ListItemIcon>
                    <RouteIcon />
                </ListItemIcon>
                <ListItemText primary="Fleet Routes" />
            </ListItemButton>
        </ListItem>
    </List>
);

export const Snapshots = () => (
    <List>
        <ListItem disablePadding>
            <ListItemButton>
                <ListItemIcon>
                    <AnalysisIcon />
                </ListItemIcon>
                <ListItemText primary="Vehicle Analysis" />
            </ListItemButton>
        </ListItem>
    </List>
);

const DrawerItems = () => (
    <>
        <Favorites />
        <Divider />
        <Programs />
        <Divider />
        <Snapshots />
    </>
);

export default DrawerItems;