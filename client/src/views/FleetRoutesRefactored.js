import React, { useState, useContext } from 'react';
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
    MenuItem,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    Add as AddIcon,
    DirectionsCar as DirectionsCarIcon,
    LocalShipping as LocalShippingIcon,
    DirectionsBus as DirectionsBusIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Analytics as AnalyticsIcon
} from '@mui/icons-material';
import { ScreenContext } from '../GlobalComponents';
import { useData, useNotifications } from '../hooks/useServices';
import { useNavigate } from 'react-router-dom';

const FleetRoutesRefactored = () => {
    const [currentScreen, setCurrentScreen] = useContext(ScreenContext);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingRoute, setEditingRoute] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: 'CITY_ROUTES',
        averageDistance: '',
        averageDuration: ''
    });
    const [loading, setLoading] = useState(false);
    const { showSuccess, showError } = useNotifications();
    const navigate = useNavigate();

    if (currentScreen !== "Fleet Routes") {
        setCurrentScreen("Fleet Routes");
    }

    // Use services for data fetching
    const { data: routes, loading: routesLoading, error: routesError, refetch: refetchRoutes } = useData('fleetRoutes');
    const { data: vehicles, loading: vehiclesLoading } = useData('vehicles');

    // Handle errors
    if (routesError) {
        showError('Failed to load fleet routes');
    }

    const handleOpenDialog = (route = null) => {
        if (route) {
            setEditingRoute(route);
            setFormData({
                name: route.name || '',
                description: route.description || '',
                type: route.type || 'CITY_ROUTES',
                averageDistance: route.averageDistance || '',
                averageDuration: route.averageDuration || ''
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

    const handleInputChange = (field) => (event) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const routeData = {
                ...formData,
                averageDistance: parseFloat(formData.averageDistance) || 0,
                averageDuration: parseInt(formData.averageDuration) || 0
            };

            if (editingRoute) {
                // Update existing route
                console.log('Updating route:', routeData);
                showSuccess('Route updated successfully');
            } else {
                // Create new route
                console.log('Creating route:', routeData);
                showSuccess('Route created successfully');
            }

            handleCloseDialog();
            refetchRoutes();
        } catch (error) {
            console.error('Error saving route:', error);
            showError('Failed to save route');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (routeId) => {
        if (window.confirm('Are you sure you want to delete this route?')) {
            try {
                console.log('Deleting route:', routeId);
                showSuccess('Route deleted successfully');
                refetchRoutes();
            } catch (error) {
                console.error('Error deleting route:', error);
                showError('Failed to delete route');
            }
        }
    };

    const handleViewAnalytics = (routeId) => {
        navigate(`/Dashboard/VehicleAnalysis?route=${routeId}`);
    };

    const getRouteIcon = (type) => {
        switch (type) {
            case 'CITY_ROUTES':
                return <DirectionsCarIcon />;
            case 'LONG_HAUL':
                return <LocalShippingIcon />;
            case 'LOCAL_ROUTES':
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
            case 'LOCAL_ROUTES':
                return 'success';
            default:
                return 'default';
        }
    };

    if (routesLoading) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Loading fleet routes...</Typography>
            </Box>
        );
    }

    return (
        <Box>
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

            {routes && routes.length > 0 ? (
                <Grid container spacing={3}>
                    {routes.map((route) => (
                        <Grid item xs={12} sm={6} md={4} key={route.id}>
                            <RouteCard
                                route={route}
                                onEdit={() => handleOpenDialog(route)}
                                onDelete={() => handleDelete(route.id)}
                                onViewAnalytics={() => handleViewAnalytics(route.id)}
                                getRouteIcon={getRouteIcon}
                                getRouteColor={getRouteColor}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Card>
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                        <DirectionsCarIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            No Routes Found
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 2 }}>
                            Get started by creating your first fleet route
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
            )}

            <RouteDialog
                open={openDialog}
                onClose={handleCloseDialog}
                onSubmit={handleSubmit}
                formData={formData}
                onInputChange={handleInputChange}
                editingRoute={editingRoute}
                loading={loading}
            />
        </Box>
    );
};

const RouteCard = ({ route, onEdit, onDelete, onViewAnalytics, getRouteIcon, getRouteColor }) => {
    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {getRouteIcon(route.type)}
                    <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
                        {route.name}
                    </Typography>
                    <Chip
                        label={route.type.replace('_', ' ')}
                        color={getRouteColor(route.type)}
                        size="small"
                    />
                </Box>
                
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                    {route.description}
                </Typography>
                
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Box>
                        <Typography variant="caption" color="text.secondary">
                            Distance
                        </Typography>
                        <Typography variant="body2">
                            {route.averageDistance || 0} miles
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" color="text.secondary">
                            Duration
                        </Typography>
                        <Typography variant="body2">
                            {route.averageDuration || 0} min
                        </Typography>
                    </Box>
                </Stack>
            </CardContent>
            
            <Box sx={{ p: 2, pt: 0 }}>
                <Stack direction="row" spacing={1}>
                    <Button
                        size="small"
                        startIcon={<AnalyticsIcon />}
                        onClick={onViewAnalytics}
                    >
                        Analytics
                    </Button>
                    <IconButton size="small" onClick={onEdit}>
                        <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={onDelete} color="error">
                        <DeleteIcon />
                    </IconButton>
                </Stack>
            </Box>
        </Card>
    );
};

const RouteDialog = ({ open, onClose, onSubmit, formData, onInputChange, editingRoute, loading }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {editingRoute ? 'Edit Route' : 'Create New Route'}
            </DialogTitle>
            <form onSubmit={onSubmit}>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            fullWidth
                            label="Route Name"
                            value={formData.name}
                            onChange={onInputChange('name')}
                            required
                        />
                        
                        <TextField
                            fullWidth
                            label="Description"
                            value={formData.description}
                            onChange={onInputChange('description')}
                            multiline
                            rows={3}
                        />
                        
                        <FormControl fullWidth>
                            <InputLabel>Route Type</InputLabel>
                            <Select
                                value={formData.type}
                                onChange={onInputChange('type')}
                                label="Route Type"
                            >
                                <MenuItem value="CITY_ROUTES">City Routes</MenuItem>
                                <MenuItem value="LONG_HAUL">Long Haul</MenuItem>
                                <MenuItem value="LOCAL_ROUTES">Local Routes</MenuItem>
                            </Select>
                        </FormControl>
                        
                        <TextField
                            fullWidth
                            label="Average Distance (miles)"
                            type="number"
                            value={formData.averageDistance}
                            onChange={onInputChange('averageDistance')}
                            inputProps={{ step: "0.1" }}
                        />
                        
                        <TextField
                            fullWidth
                            label="Average Duration (minutes)"
                            type="number"
                            value={formData.averageDuration}
                            onChange={onInputChange('averageDuration')}
                            inputProps={{ step: "1" }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? 'Saving...' : (editingRoute ? 'Update' : 'Create')}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default FleetRoutesRefactored;
