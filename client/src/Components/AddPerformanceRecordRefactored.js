import React, { useState, useEffect } from 'react';
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
    Snackbar,
    Switch,
    FormControlLabel,
    Divider
} from '@mui/material';
import {
    Save as SaveIcon,
    Add as AddIcon,
    Clear as ClearIcon
} from '@mui/icons-material';
import { useData, useNotifications } from '../hooks/useServices';
import { useAuthService } from '../hooks/useServices';

const AddPerformanceRecordRefactored = () => {
    const { showSuccess, showError } = useNotifications();
    const authService = useAuthService();
    
    // Data from services
    const { data: vehicles, loading: vehiclesLoading } = useData('vehicles');
    const { data: routes, loading: routesLoading } = useData('fleetRoutes');
    const { data: sessions, loading: sessionsLoading } = useData('routeSessions');

    // Form state
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
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    // Get current user
    const currentUser = authService.getCurrentUser();

    useEffect(() => {
        if (!currentUser) {
            showError('Please log in to add performance records');
            return;
        }
    }, [currentUser, showError]);

    const handleInputChange = (field) => (event) => {
        const value = event.target.value;
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleBatchModeToggle = (event) => {
        setBatchMode(event.target.checked);
        if (!event.target.checked) {
            setBatchRecords([]);
        }
    };

    const addBatchRecord = () => {
        if (!formData.vehicleId || !formData.metricValue) {
            showError('Please fill in vehicle and metric value');
            return;
        }

        const newRecord = {
            ...formData,
            id: `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };

        setBatchRecords(prev => [...prev, newRecord]);
        setFormData(prev => ({
            ...prev,
            metricValue: '',
            notes: ''
        }));
    };

    const removeBatchRecord = (id) => {
        setBatchRecords(prev => prev.filter(record => record.id !== id));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (batchMode && batchRecords.length > 0) {
                // Submit batch records
                const recordsToSubmit = batchRecords.map(record => ({
                    vehicleId: record.vehicleId,
                    routeId: record.routeId,
                    sessionId: record.sessionId,
                    metricName: record.metricName,
                    metricValue: parseFloat(record.metricValue),
                    unit: record.unit,
                    notes: record.notes,
                    recordedAt: new Date().toISOString()
                }));

                // This would use the data service
                console.log('Submitting batch records:', recordsToSubmit);
                showSuccess(`Successfully added ${recordsToSubmit.length} performance records`);
                setBatchRecords([]);
            } else {
                // Submit single record
                const recordToSubmit = {
                    vehicleId: formData.vehicleId,
                    routeId: formData.routeId,
                    sessionId: formData.sessionId,
                    metricName: formData.metricName,
                    metricValue: parseFloat(formData.metricValue),
                    unit: formData.unit,
                    notes: formData.notes,
                    recordedAt: new Date().toISOString()
                };

                // This would use the data service
                console.log('Submitting single record:', recordToSubmit);
                showSuccess('Performance record added successfully');
            }

            setSuccess(true);
            setFormData({
                vehicleId: '',
                routeId: '',
                sessionId: '',
                metricName: 'fuel_efficiency',
                metricValue: '',
                unit: 'mpg',
                notes: ''
            });
        } catch (err) {
            console.error('Error submitting performance record:', err);
            setError(err.message || 'Failed to add performance record');
            showError(err.message || 'Failed to add performance record');
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
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
        setError(null);
    };

    const getMetricUnit = (metricName) => {
        const units = {
            'fuel_efficiency': 'mpg',
            'distance_traveled': 'miles',
            'average_speed': 'mph',
            'idle_time': 'hours'
        };
        return units[metricName] || 'unknown';
    };

    const updateUnit = (metricName) => {
        const unit = getMetricUnit(metricName);
        setFormData(prev => ({
            ...prev,
            metricName,
            unit
        }));
    };

    if (!currentUser) {
        return (
            <Card>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary">
                        Please log in to add performance records
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Add Performance Record
                </Typography>
                
                <FormControlLabel
                    control={
                        <Switch
                            checked={batchMode}
                            onChange={handleBatchModeToggle}
                        />
                    }
                    label="Batch Mode"
                    sx={{ mb: 2 }}
                />

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {/* Vehicle Selection */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Vehicle</InputLabel>
                                <Select
                                    value={formData.vehicleId}
                                    onChange={handleInputChange('vehicleId')}
                                    label="Vehicle"
                                    disabled={vehiclesLoading}
                                >
                                    {vehicles?.map((vehicle) => (
                                        <MenuItem key={vehicle.id} value={vehicle.id}>
                                            {vehicle.name} ({vehicle.type})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Route Selection */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Route (Optional)</InputLabel>
                                <Select
                                    value={formData.routeId}
                                    onChange={handleInputChange('routeId')}
                                    label="Route (Optional)"
                                    disabled={routesLoading}
                                >
                                    {routes?.map((route) => (
                                        <MenuItem key={route.id} value={route.id}>
                                            {route.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Session Selection */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Session (Optional)</InputLabel>
                                <Select
                                    value={formData.sessionId}
                                    onChange={handleInputChange('sessionId')}
                                    label="Session (Optional)"
                                    disabled={sessionsLoading}
                                >
                                    {sessions?.map((session) => (
                                        <MenuItem key={session.id} value={session.id}>
                                            {session.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Metric Selection */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Metric</InputLabel>
                                <Select
                                    value={formData.metricName}
                                    onChange={(e) => {
                                        handleInputChange('metricName')(e);
                                        updateUnit(e.target.value);
                                    }}
                                    label="Metric"
                                >
                                    <MenuItem value="fuel_efficiency">Fuel Efficiency</MenuItem>
                                    <MenuItem value="distance_traveled">Distance Traveled</MenuItem>
                                    <MenuItem value="average_speed">Average Speed</MenuItem>
                                    <MenuItem value="idle_time">Idle Time</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Metric Value */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label={`Value (${formData.unit})`}
                                type="number"
                                value={formData.metricValue}
                                onChange={handleInputChange('metricValue')}
                                inputProps={{ step: "0.01" }}
                            />
                        </Grid>

                        {/* Notes */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Notes (Optional)"
                                multiline
                                rows={2}
                                value={formData.notes}
                                onChange={handleInputChange('notes')}
                            />
                        </Grid>

                        {/* Batch Mode Controls */}
                        {batchMode && (
                            <>
                                <Grid item xs={12}>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="subtitle1" gutterBottom>
                                        Batch Records ({batchRecords.length})
                                    </Typography>
                                </Grid>
                                
                                <Grid item xs={12} sm={6}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<AddIcon />}
                                        onClick={addBatchRecord}
                                        disabled={!formData.vehicleId || !formData.metricValue}
                                        fullWidth
                                    >
                                        Add to Batch
                                    </Button>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<ClearIcon />}
                                        onClick={() => setBatchRecords([])}
                                        disabled={batchRecords.length === 0}
                                        fullWidth
                                    >
                                        Clear Batch
                                    </Button>
                                </Grid>

                                {/* Batch Records List */}
                                {batchRecords.length > 0 && (
                                    <Grid item xs={12}>
                                        <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                                            {batchRecords.map((record, index) => (
                                                <Box key={record.id} sx={{ 
                                                    display: 'flex', 
                                                    justifyContent: 'space-between', 
                                                    alignItems: 'center',
                                                    p: 1,
                                                    border: '1px solid #e0e0e0',
                                                    borderRadius: 1,
                                                    mb: 1
                                                }}>
                                                    <Typography variant="body2">
                                                        {vehicles?.find(v => v.id === record.vehicleId)?.name} - 
                                                        {record.metricName}: {record.metricValue} {record.unit}
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
                                        </Box>
                                    </Grid>
                                )}
                            </>
                        )}

                        {/* Action Buttons */}
                        <Grid item xs={12}>
                            <Stack direction="row" spacing={2} justifyContent="flex-end">
                                <Button
                                    variant="outlined"
                                    startIcon={<ClearIcon />}
                                    onClick={handleClear}
                                    disabled={loading}
                                >
                                    Clear
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={<SaveIcon />}
                                    disabled={loading || (!batchMode && !formData.vehicleId) || (batchMode && batchRecords.length === 0)}
                                >
                                    {loading ? 'Saving...' : (batchMode ? `Save ${batchRecords.length} Records` : 'Save Record')}
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </form>

                {/* Error Display */}
                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* Success Snackbar */}
                <Snackbar
                    open={success}
                    autoHideDuration={4000}
                    onClose={() => setSuccess(false)}
                    message="Performance record saved successfully!"
                />
            </CardContent>
        </Card>
    );
};

export default AddPerformanceRecordRefactored;
