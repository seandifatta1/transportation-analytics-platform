import * as React from "react";
import {useState, useEffect} from "react";
import {
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    Box,
    Alert,
    Snackbar
} from "@mui/material";
import {
    Save as SaveIcon,
    Add as AddIcon,
    Clear as ClearIcon
} from "@mui/icons-material";
import axios from "axios";
import {useCookies} from "react-cookie";
import { initializeTransportationData } from "../utils/initializeTransportationData";

export default function AddPerformanceRecord() {
    const [cookies,] = useCookies(['cookie-name']);
    const [vehicles, setVehicles] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    
    const [formData, setFormData] = useState({
        vehicleId: '',
        routeId: '',
        sessionId: '',
        metricName: 'fuel_efficiency',
        metricValue: '',
        unit: 'mpg',
        notes: ''
    });

    const [batchMode, setBatchMode] = useState(false);
    const [batchRecords, setBatchRecords] = useState([]);

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            // Load vehicles
            const vehiclesResponse = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/users/${cookies.user}/vehicles`,
                { withCredentials: true }
            );
            setVehicles(vehiclesResponse.data);

            // Load routes
            const routesResponse = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/users/${cookies.user}/programs`,
                { withCredentials: true }
            );
            setRoutes(routesResponse.data);

        } catch (e) {
            console.log("Using stub data");
            const stubData = initializeTransportationData();
            setVehicles(stubData.vehicles);
            setRoutes(stubData.fleetRoutes.map(route => ({ name: route.name, id: route.id })));
        }
    };

    const loadSessions = async (routeId) => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/users/${cookies.user}/sessions`,
                { withCredentials: true }
            );
            const routeSessions = response.data.filter(session => session.route_id == routeId);
            setSessions(routeSessions);
        } catch (e) {
            console.log("Using stub data for sessions");
            const stubData = initializeTransportationData();
            setSessions(stubData.routeSessions);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Load sessions when route changes
        if (field === 'routeId') {
            loadSessions(value);
        }

        // Update unit when metric changes
        if (field === 'metricName') {
            const units = {
                'fuel_efficiency': 'mpg',
                'distance_traveled': 'miles',
                'average_speed': 'mph',
                'idle_time': 'hours'
            };
            setFormData(prev => ({
                ...prev,
                [field]: value,
                unit: units[value] || 'unknown'
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (batchMode) {
                await handleBatchSubmit();
            } else {
                await handleSingleSubmit();
            }
            setSuccess(true);
            resetForm();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save performance record');
        } finally {
            setLoading(false);
        }
    };

    const handleSingleSubmit = async () => {
        const payload = {
            Vehicle: formData.vehicleId,
            Program: formData.routeId,
            Session: formData.sessionId,
            MetricName: formData.metricName,
            MetricValue: parseFloat(formData.metricValue),
            Unit: formData.unit,
            Notes: formData.notes
        };

        await axios.post(
            `${process.env.REACT_APP_BASE_URL}/users/${cookies.user}/sets`,
            payload,
            { withCredentials: true }
        );
    };

    const handleBatchSubmit = async () => {
        const payload = batchRecords.map(record => ({
            sessionId: record.sessionId,
            vehicleId: record.vehicleId,
            metricName: record.metricName,
            metricValue: parseFloat(record.metricValue),
            unit: record.unit,
            notes: record.notes
        }));

        await axios.post(
            `${process.env.REACT_APP_BASE_URL}/users/${cookies.user}/performance-records/batch`,
            payload,
            { withCredentials: true }
        );
    };

    const resetForm = () => {
        setFormData({
            vehicleId: '',
            routeId: '',
            sessionId: '',
            metricName: 'fuel_efficiency',
            metricValue: '',
            unit: 'mpg',
            notes: ''
        });
        setBatchRecords([]);
    };

    const addBatchRecord = () => {
        if (formData.vehicleId && formData.sessionId && formData.metricName && formData.metricValue) {
            const newRecord = {
                ...formData,
                id: Date.now() // Temporary ID for UI
            };
            setBatchRecords(prev => [...prev, newRecord]);
            resetForm();
        }
    };

    const removeBatchRecord = (id) => {
        setBatchRecords(prev => prev.filter(record => record.id !== id));
    };

    const getMetricOptions = () => [
        { value: 'fuel_efficiency', label: 'Fuel Efficiency' },
        { value: 'distance_traveled', label: 'Distance Traveled' },
        { value: 'average_speed', label: 'Average Speed' },
        { value: 'idle_time', label: 'Idle Time' },
        { value: 'maintenance_hours', label: 'Maintenance Hours' },
        { value: 'delivery_count', label: 'Delivery Count' }
    ];

    return (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5">
                        {batchMode ? 'Add Performance Records (Batch)' : 'Add Performance Record'}
                    </Typography>
                    <Button
                        variant={batchMode ? "contained" : "outlined"}
                        onClick={() => setBatchMode(!batchMode)}
                        startIcon={<AddIcon />}
                    >
                        {batchMode ? 'Single Mode' : 'Batch Mode'}
                    </Button>
                </Box>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Vehicle</InputLabel>
                                <Select
                                    value={formData.vehicleId}
                                    onChange={(e) => handleInputChange('vehicleId', e.target.value)}
                                    label="Vehicle"
                                >
                                    {vehicles.map(vehicle => (
                                        <MenuItem key={vehicle.id} value={vehicle.id}>
                                            {vehicle.name} ({vehicle.type})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Route</InputLabel>
                                <Select
                                    value={formData.routeId}
                                    onChange={(e) => handleInputChange('routeId', e.target.value)}
                                    label="Route"
                                >
                                    {routes.map(route => (
                                        <MenuItem key={route.id || route.name} value={route.id || route.name}>
                                            {route.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Session</InputLabel>
                                <Select
                                    value={formData.sessionId}
                                    onChange={(e) => handleInputChange('sessionId', e.target.value)}
                                    label="Session"
                                >
                                    {sessions.map(session => (
                                        <MenuItem key={session.id} value={session.id}>
                                            {session.name} ({session.route_date})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Metric</InputLabel>
                                <Select
                                    value={formData.metricName}
                                    onChange={(e) => handleInputChange('metricName', e.target.value)}
                                    label="Metric"
                                >
                                    {getMetricOptions().map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Value"
                                type="number"
                                value={formData.metricValue}
                                onChange={(e) => handleInputChange('metricValue', e.target.value)}
                                required
                                inputProps={{ step: "0.01" }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Unit"
                                value={formData.unit}
                                onChange={(e) => handleInputChange('unit', e.target.value)}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Notes"
                                value={formData.notes}
                                onChange={(e) => handleInputChange('notes', e.target.value)}
                                multiline
                                rows={2}
                            />
                        </Grid>

                        {batchMode && (
                            <Grid item xs={12}>
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Batch Records ({batchRecords.length})
                                    </Typography>
                                    {batchRecords.length > 0 && (
                                        <Stack spacing={1}>
                                            {batchRecords.map(record => (
                                                <Box key={record.id} sx={{ 
                                                    display: 'flex', 
                                                    justifyContent: 'space-between', 
                                                    alignItems: 'center',
                                                    p: 1,
                                                    border: '1px solid #e0e0e0',
                                                    borderRadius: 1
                                                }}>
                                                    <Typography variant="body2">
                                                        {vehicles.find(v => v.id == record.vehicleId)?.name} - 
                                                        {record.metricName} - 
                                                        {record.metricValue} {record.unit}
                                                    </Typography>
                                                    <Button
                                                        size="small"
                                                        color="error"
                                                        onClick={() => removeBatchRecord(record.id)}
                                                    >
                                                        Remove
                                                    </Button>
                                                </Box>
                                            ))}
                                        </Stack>
                                    )}
                                    <Button
                                        variant="outlined"
                                        onClick={addBatchRecord}
                                        disabled={!formData.vehicleId || !formData.sessionId || !formData.metricName || !formData.metricValue}
                                        sx={{ mt: 1 }}
                                    >
                                        Add to Batch
                                    </Button>
                                </Box>
                            </Grid>
                        )}

                        <Grid item xs={12}>
                            <Stack direction="row" spacing={2}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={<SaveIcon />}
                                    disabled={loading || (batchMode && batchRecords.length === 0)}
                                >
                                    {loading ? 'Saving...' : 'Save Record(s)'}
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<ClearIcon />}
                                    onClick={resetForm}
                                >
                                    Clear
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </form>

                <Snackbar
                    open={success}
                    autoHideDuration={6000}
                    onClose={() => setSuccess(false)}
                >
                    <Alert onClose={() => setSuccess(false)} severity="success">
                        Performance record(s) saved successfully!
                    </Alert>
                </Snackbar>

                <Snackbar
                    open={!!error}
                    autoHideDuration={6000}
                    onClose={() => setError(null)}
                >
                    <Alert onClose={() => setError(null)} severity="error">
                        {error}
                    </Alert>
                </Snackbar>
            </CardContent>
        </Card>
    );
}
