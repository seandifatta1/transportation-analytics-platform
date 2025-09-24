import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Drawer,
    Box,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Menu as MenuIcon,
    ChevronLeft as ChevronLeftIcon
} from '@mui/icons-material';

const drawerWidth = 240;

export const defaultTheme = {
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
};

export const CustomAppBar = ({ open, handleDrawerOpen, title }) => {
    return (
        <AppBar
            position="fixed"
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                transition: (theme) =>
                    theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                ...(open && {
                    marginLeft: drawerWidth,
                    width: `calc(100% - ${drawerWidth}px)`,
                    transition: (theme) =>
                        theme.transitions.create(['width', 'margin'], {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                }),
            }}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    sx={{
                        marginRight: 5,
                        ...(open && { display: 'none' }),
                    }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div">
                    {title || 'Transportation Analytics Platform'}
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export const CustomDrawer = ({ open, handleDrawerClose, children }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Drawer
            variant={isMobile ? 'temporary' : 'persistent'}
            anchor="left"
            open={open}
            onClose={handleDrawerClose}
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: theme.spacing(0, 1),
                    ...theme.mixins.toolbar,
                    justifyContent: 'flex-end',
                }}
            >
                <IconButton onClick={handleDrawerClose}>
                    <ChevronLeftIcon />
                </IconButton>
            </Box>
            {children}
        </Drawer>
    );
};
