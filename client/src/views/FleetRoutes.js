import * as React from "react";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Button,
    Chip,
    Stack,
    Box,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";
import {
    Add as AddIcon,
    DirectionsCar as DirectionsCarIcon,
    LocalShipping as LocalShippingIcon,
    DirectionsBus as DirectionsBusIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Analytics as AnalyticsIcon
} from "@mui/icons-material";
import {useCookies} from "react-cookie";
import {ScreenContext} from "../GlobalComponents";
import { initializeTransportationData } from "../utils/initializeTransportationData";
import { useNavigate } from "react-router-dom";

export default function FleetRoutes() {
    const [cookies,] = useCookies(['cookie-name']);
    const [currentScreen, setCurrentScreen] = useContext(ScreenContext);
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingRoute, setEditingRoute] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: 'CITY_ROUTES',
        averageDistance: '',
        averageDuration: ''
    });

    const navigate = useNavigate();

    if (currentScreen !== "Fleet Routes") {
        setCurrentScreen("Fleet Routes");
    }

    useEffect(() => {
        loadRoutes();
    }, []);

    const loadRoutes = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/${cookies.user}/programs`, {
                withCredentials: true
            });
            setRoutes(response.data);
        } catch (e) {
            console.log("Using stub data for routes");
            const stubData = initializeTransportationData();
            setRoutes(stubData.fleetRoutes);
        }
        setLoading(false);
    };

    const handleOpenDialog = (route = null) => {
        if (route) {
            setEditingRoute(route);
            setFormData({
                name: route.name,
                description: route.description || '',
                type: route.type,
                averageDistance: route.average_distance || '',
                averageDuration: route.average_duration || ''
            });
        } else {
            setEditingRoute(null);
            setFormData({
                name: '',
                description: '',
                type: 'CITY_ROUTES',
                averageDistance: '',
                averageDuration: ''
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingRoute(null);
        setFormData({
            name: '',
            description: '',
            type: 'CITY_ROUTES',
            averageDistance: '',
            averageDuration: ''
        });
    };

    const handleSaveRoute = async () => {
        try {
            if (editingRoute) {
                // Update existing route
                await axios.put(
                    `${process.env.REACT_APP_BASE_URL}/users/${cookies.user}/programs/${editingRoute.name}`,
                    {
                        type: formData.type,
                        description: formData.description,
                        averageDistance: parseFloat(formData.averageDistance) || 0,
                        averageDuration: parseFloat(formData.averageDuration) || 0
                    },
                    { withCredentials: true }
                );
            } else {
                // Create new route
                await axios.post(
                    `${process.env.REACT_APP_BASE_URL}/users/${cookies.user}/programs/${formData.name}`,
                    {
                        type: formData.type,
                        description: formData.description,
                        averageDistance: parseFloat(formData.averageDistance) || 0,
                        averageDuration: parseFloat(formData.averageDuration) || 0
                    },
                    { withCredentials: true }
                );
            }
            loadRoutes();
            handleCloseDialog();
        } catch (e) {
            console.error("Error saving route:", e);
        }
    };

    const handleDeleteRoute = async (routeName) => {
        if (window.confirm(`Are you sure you want to delete the route "${routeName}"?`)) {
            try {
                await axios.delete(
                    `${process.env.REACT_APP_BASE_URL}/users/${cookies.user}/programs/${routeName}`,
                    { withCredentials: true }
                );
                loadRoutes();
            } catch (e) {
                console.error("Error deleting route:", e);
            }
        }
    };

    const handleViewAnalytics = (routeName) => {
        navigate(`/Dashboard/MyPrograms/${routeName}`);
    };

    const getRouteIcon = (type) => {
        switch (type) {
            case 'CITY_ROUTES':
                return <DirectionsCarIcon />;
            case 'LONG_HAUL':
                return <LocalShippingIcon />;
            case 'PICKUP':
                return <DirectionsBusIcon />;
            default:
                return <DirectionsCarIcon />;
        }
    };

    const getRouteColor = (type) => {
        switch (type) {
            case 'CITY_ROUTES':
                return 'primary';
            case 'LONG_HAUL':
                return 'secondary';
            case 'PICKUP':
                return 'success';
            default:
                return 'default';
        }
    };

    const getRouteTypeLabel = (type) => {
        switch (type) {
            case 'CITY_ROUTES':
                return 'City Routes';
            case 'LONG_HAUL':
                return 'Long Haul';
            case 'PICKUP':
                return 'Pickup';
            default:
                return type;
        }
    };

    if (loading) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography>Loading fleet routes...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Fleet Routes</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Add Route
                </Button>
            </Box>

            {routes.length === 0 ? (
                <Card>
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                        <DirectionsCarIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            No Fleet Routes
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 2 }}>
                            Create your first fleet route to start tracking performance
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenDialog()}
                        >
                            Create First Route
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Grid container spacing={3}>
                    {routes.map((route, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <RouteCard
                                route={route}
                                onEdit={() => handleOpenDialog(route)}
                                onDelete={() => handleDeleteRoute(route.name)}
                                onViewAnalytics={() => handleViewAnalytics(route.name)}
                                getRouteIcon={getRouteIcon}
                                getRouteColor={getRouteColor}
                                getRouteTypeLabel={getRouteTypeLabel}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Add/Edit Route Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingRoute ? 'Edit Fleet Route' : 'Add New Fleet Route'}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            fullWidth
                            label="Route Name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            disabled={!!editingRoute}
                        />
                        
                        <TextField
                            fullWidth
                            label="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            multiline
                            rows={2}
                        />
                        
                        <FormControl fullWidth>
                            <InputLabel>Route Type</InputLabel>
                            <Select
                                value={formData.type}
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                                label="Route Type"
                            >
                                <MenuItem value="CITY_ROUTES">City Routes</MenuItem>
                                <MenuItem value="LONG_HAUL">Long Haul</MenuItem>
                                <MenuItem value="PICKUP">Pickup</MenuItem>
                            </Select>
                        </FormControl>
                        
                        <TextField
                            fullWidth
                            label="Average Distance (miles)"
                            type="number"
                            value={formData.averageDistance}
                            onChange={(e) => setFormData({...formData, averageDistance: e.target.value})}
                        />
                        
                        <TextField
                            fullWidth
                            label="Average Duration (hours)"
                            type="number"
                            value={formData.averageDuration}
                            onChange={(e) => setFormData({...formData, averageDuration: e.target.value})}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSaveRoute} variant="contained">
                        {editingRoute ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

function RouteCard({ route, onEdit, onDelete, onViewAnalytics, getRouteIcon, getRouteColor, getRouteTypeLabel }) {
    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {getRouteIcon(route.type)}
                    <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
                        {route.name}
                    </Typography>
                    <IconButton size="small" onClick={onEdit}>
                        <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={onDelete} color="error">
                        <DeleteIcon />
                    </IconButton>
                </Box>
                
                <Typography color="textSecondary" sx={{ mb: 2 }}>
                    {route.description || 'No description provided'}
                </Typography>
                
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip
                        icon={getRouteIcon(route.type)}
                        label={getRouteTypeLabel(route.type)}
                        color={getRouteColor(route.type)}
                        size="small"
                    />
                    <Chip
                        label={route.status || 'ACTIVE'}
                        color={route.status === 'ACTIVE' ? 'success' : 'default'}
                        size="small"
                    />
                </Stack>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box>
                        <Typography variant="body2" color="textSecondary">
                            Avg Distance
                        </Typography>
                        <Typography variant="h6">
                            {route.average_distance || 0} mi
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="body2" color="textSecondary">
                            Avg Duration
                        </Typography>
                        <Typography variant="h6">
                            {route.average_duration || 0} hrs
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
            
            <Box sx={{ p: 2, pt: 0 }}>
                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AnalyticsIcon />}
                    onClick={onViewAnalytics}
                >
                    View Analytics
                </Button>
            </Box>
        </Card>
    );
}
