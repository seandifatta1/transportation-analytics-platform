import React, { useState, useContext, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Chip,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    ToggleButton,
    ToggleButtonGroup,
    Alert,
    CircularProgress
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SpeedIcon from '@mui/icons-material/Speed';
import RouteIcon from '@mui/icons-material/Route';
import { ScreenContext } from '../GlobalComponents';
import { useData, useChartData, useNotifications } from '../hooks/useServices';
import FleetPerformanceChart from '../components/charts/FleetPerformanceChart';
import TimeSeriesChart from '../components/charts/TimeSeriesChart';
import FleetSummaryCards from '../components/charts/FleetSummaryCards';

const VehicleAnalysisRefactored = () => {
    const [currentScreen, setCurrentScreen] = useContext(ScreenContext);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [selectedMetric, setSelectedMetric] = useState("fuel_efficiency");
    const [timeRange, setTimeRange] = useState("month");
    const { showError, showSuccess } = useNotifications();

    if (currentScreen !== "Vehicle Analysis") {
        setCurrentScreen("Vehicle Analysis");
    }

    // Use services for data fetching
    const { data: vehicles, loading: vehiclesLoading, error: vehiclesError } = useData('vehicles');
    const { data: performanceData, loading: performanceLoading, error: performanceError } = useData('performanceRecords', {
        filters: {
            vehicleId: selectedVehicle?.id,
            startDate: getStartDate(timeRange),
            endDate: new Date().toISOString().split('T')[0]
        }
    });

    // Use services for chart data
    const { chartData: vehiclePerformanceData, loading: chartLoading } = useChartData('vehicleEfficiency', {
        vehicleId: selectedVehicle?.id,
        startDate: getStartDate(timeRange),
        endDate: new Date().toISOString().split('T')[0]
    });

    const { chartData: timeSeriesData, loading: timeSeriesLoading } = useChartData('timeSeries', {
        metricName: selectedMetric,
        vehicleId: selectedVehicle?.id,
        startDate: getStartDate(timeRange),
        endDate: new Date().toISOString().split('T')[0]
    });

    // Auto-select first vehicle if none selected
    useEffect(() => {
        if (vehicles && vehicles.length > 0 && !selectedVehicle) {
            setSelectedVehicle(vehicles[0]);
        }
    }, [vehicles, selectedVehicle]);

    // Handle errors
    if (vehiclesError) {
        showError('Failed to load vehicles');
    }
    if (performanceError) {
        showError('Failed to load performance data');
    }

    const handleVehicleChange = (vehicleId) => {
        const vehicle = vehicles?.find(v => v.id === vehicleId);
        setSelectedVehicle(vehicle);
        if (vehicle) {
            showSuccess(`Switched to ${vehicle.name}`);
        }
    };

    const handleMetricChange = (metric) => {
        setSelectedMetric(metric);
    };

    const handleTimeRangeChange = (range) => {
        setTimeRange(range);
    };

    if (vehiclesLoading) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Loading vehicles...</Typography>
            </Box>
        );
    }

    if (!vehicles || vehicles.length === 0) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="info">
                    No vehicles available. Please add some vehicles to view analysis.
                </Alert>
            </Box>
        );
    }

    if (!selectedVehicle) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="warning">
                    Please select a vehicle to view analysis.
                </Alert>
            </Box>
        );
    }

    return (
        <Box>
            <VehicleSelector 
                vehicles={vehicles}
                selectedVehicle={selectedVehicle}
                onVehicleChange={handleVehicleChange}
            />
            
            <MetricAndTimeSelectors
                selectedMetric={selectedMetric}
                timeRange={timeRange}
                onMetricChange={handleMetricChange}
                onTimeRangeChange={handleTimeRangeChange}
            />
            
            <VehicleSummary 
                vehicle={selectedVehicle}
                data={performanceData || []}
            />
            
            <VehicleCharts
                vehicle={selectedVehicle}
                data={performanceData || []}
                selectedMetric={selectedMetric}
                timeRange={timeRange}
                onMetricChange={handleMetricChange}
            />
        </Box>
    );
};

const VehicleSelector = ({ vehicles, selectedVehicle, onVehicleChange }) => {
    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Select Vehicle
                </Typography>
                <FormControl fullWidth>
                    <InputLabel>Vehicle</InputLabel>
                    <Select
                        value={selectedVehicle?.id || ''}
                        onChange={(e) => onVehicleChange(e.target.value)}
                        label="Vehicle"
                    >
                        {vehicles.map((vehicle) => (
                            <MenuItem key={vehicle.id} value={vehicle.id}>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <DirectionsCarIcon />
                                    <Box>
                                        <Typography variant="body1">{vehicle.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {vehicle.type} • {vehicle.capacity}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </CardContent>
        </Card>
    );
};

const MetricAndTimeSelectors = ({ selectedMetric, timeRange, onMetricChange, onTimeRangeChange }) => {
    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Analysis Options
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Metric</InputLabel>
                        <Select
                            value={selectedMetric}
                            onChange={(e) => onMetricChange(e.target.value)}
                            label="Metric"
                        >
                            <MenuItem value="fuel_efficiency">
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <LocalGasStationIcon fontSize="small" />
                                    <span>Fuel Efficiency</span>
                                </Stack>
                            </MenuItem>
                            <MenuItem value="distance_traveled">
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <RouteIcon fontSize="small" />
                                    <span>Distance Traveled</span>
                                </Stack>
                            </MenuItem>
                            <MenuItem value="average_speed">
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <SpeedIcon fontSize="small" />
                                    <span>Average Speed</span>
                                </Stack>
                            </MenuItem>
                            <MenuItem value="idle_time">
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <DirectionsCarIcon fontSize="small" />
                                    <span>Idle Time</span>
                                </Stack>
                            </MenuItem>
                        </Select>
                    </FormControl>
                    
                    <ToggleButtonGroup
                        value={timeRange}
                        exclusive
                        onChange={(e, newValue) => newValue && onTimeRangeChange(newValue)}
                        size="small"
                    >
                        <ToggleButton value="week">Week</ToggleButton>
                        <ToggleButton value="month">Month</ToggleButton>
                        <ToggleButton value="quarter">Quarter</ToggleButton>
                        <ToggleButton value="year">Year</ToggleButton>
                    </ToggleButtonGroup>
                </Stack>
            </CardContent>
        </Card>
    );
};

const VehicleSummary = ({ vehicle, data }) => {
    const summary = calculateVehicleSummary(data);
    
    return (
        <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                        <DirectionsCarIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                        <Typography variant="h6">{vehicle.name}</Typography>
                        <Typography color="text.secondary">{vehicle.type}</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                        <LocalGasStationIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                        <Typography variant="h6">{summary.avgFuelEfficiency.toFixed(1)}</Typography>
                        <Typography color="text.secondary">Avg MPG</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                        <RouteIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                        <Typography variant="h6">{summary.totalDistance.toFixed(0)}</Typography>
                        <Typography color="text.secondary">Total Miles</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                        <SpeedIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                        <Typography variant="h6">{summary.avgSpeed.toFixed(1)}</Typography>
                        <Typography color="text.secondary">Avg Speed</Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

const VehicleCharts = ({ vehicle, data, selectedMetric, timeRange, onMetricChange }) => {
    return (
        <Grid container spacing={3}>
            {/* Performance Chart */}
            <Grid item xs={12} md={8}>
                <FleetPerformanceChart 
                    data={data}
                    title={`${vehicle.name} Performance`}
                    onMetricChange={onMetricChange}
                />
            </Grid>
            
            {/* Efficiency Chart */}
            <Grid item xs={12} md={4}>
                <FleetEfficiencyChart 
                    data={data}
                    title="Efficiency Analysis"
                />
            </Grid>
            
            {/* Time Series Chart */}
            <Grid item xs={12}>
                <TimeSeriesChart 
                    data={data}
                    title={`${vehicle.name} Trends - ${selectedMetric.replace('_', ' ')}`}
                    metric={selectedMetric}
                />
            </Grid>
        </Grid>
    );
};

// Helper functions
const getStartDate = (timeRange) => {
    const endDate = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
        case 'week':
            startDate.setDate(endDate.getDate() - 7);
            break;
        case 'month':
            startDate.setDate(endDate.getDate() - 30);
            break;
        case 'quarter':
            startDate.setDate(endDate.getDate() - 90);
            break;
        case 'year':
            startDate.setFullYear(endDate.getFullYear() - 1);
            break;
        default:
            startDate.setDate(endDate.getDate() - 30);
    }
    
    return startDate.toISOString().split('T')[0];
};

const calculateVehicleSummary = (data) => {
    if (!data || data.length === 0) {
        return {
            avgFuelEfficiency: 0,
            totalDistance: 0,
            avgSpeed: 0,
            totalRecords: 0
        };
    }

    const fuelEfficiency = data.filter(d => d.metricName === 'fuel_efficiency');
    const distance = data.filter(d => d.metricName === 'distance_traveled');
    const speed = data.filter(d => d.metricName === 'average_speed');

    return {
        avgFuelEfficiency: fuelEfficiency.length > 0 
            ? fuelEfficiency.reduce((sum, d) => sum + d.metricValue, 0) / fuelEfficiency.length 
            : 0,
        totalDistance: distance.reduce((sum, d) => sum + d.metricValue, 0),
        avgSpeed: speed.length > 0 
            ? speed.reduce((sum, d) => sum + d.metricValue, 0) / speed.length 
            : 0,
        totalRecords: data.length
    };
};

export default VehicleAnalysisRefactored;
