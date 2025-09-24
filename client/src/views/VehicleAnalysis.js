import * as React from "react";
import {useContext, useEffect, useState} from "react";
import {BarChart, LineChart} from "@mui/x-charts";
import axios from "axios";
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
    ToggleButtonGroup
} from "@mui/material";
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SpeedIcon from '@mui/icons-material/Speed';
import RouteIcon from '@mui/icons-material/Route';
import Title from "../Components/Title";
import {useCookies} from "react-cookie";
import {ScreenContext} from "../GlobalComponents";
import { initializeTransportationData } from "../utils/initializeTransportationData";
import { 
    FleetPerformanceChart, 
    TimeSeriesChart,
    FleetSummaryCards 
} from "../Components/TransportationCharts";

export function VehicleAnalysis() {
    const [cookies,] = useCookies(['cookie-name']);
    const [currentScreen, setCurrentScreen] = useContext(ScreenContext);
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [performanceData, setPerformanceData] = useState([]);
    const [vehicleSummary, setVehicleSummary] = useState(null);
    const [selectedMetric, setSelectedMetric] = useState("fuel_efficiency");
    const [timeRange, setTimeRange] = useState("month");

    if (currentScreen !== "Vehicle Analysis") {
        setCurrentScreen("Vehicle Analysis");
    }

    useEffect(() => {
        // Initialize with stub data
        const stubData = initializeTransportationData();
        
        // Load vehicles
        axios.get(`${process.env.REACT_APP_BASE_URL}/users/${cookies.user}/vehicles`, {
            withCredentials: true
        })
        .then(data => {
            setVehicles(data.data);
            if (data.data.length > 0) {
                setSelectedVehicle(data.data[0]);
            }
        })
        .catch(e => {
            console.log("Using stub data for vehicles");
            setVehicles(stubData.vehicles);
            setSelectedVehicle(stubData.vehicles[0]);
        });
    }, []);

    useEffect(() => {
        if (selectedVehicle) {
            loadVehiclePerformance(selectedVehicle.id);
        }
    }, [selectedVehicle]);

    const loadVehiclePerformance = async (vehicleId) => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/users/${cookies.user}/vehicles/${vehicleId}/performance`,
                { withCredentials: true }
            );
            setPerformanceData(response.data.data || []);
            
            // Load vehicle summary
            const summaryResponse = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/users/${cookies.user}/vehicles/${vehicleId}/summary`,
                { withCredentials: true }
            );
            setVehicleSummary(summaryResponse.data.data);
        } catch (e) {
            console.log("Using stub data for vehicle performance");
            const stubData = initializeTransportationData();
            const vehicleRecords = stubData.getVehiclePerformanceRecords(vehicleId);
            setPerformanceData(vehicleRecords);
            
            // Create mock summary
            setVehicleSummary({
                totalRecords: vehicleRecords.length,
                metrics: {
                    fuel_efficiency: {
                        average: 8.5,
                        min: 6.2,
                        max: 12.1,
                        count: 15,
                        unit: 'mpg'
                    },
                    distance_traveled: {
                        average: 45.2,
                        min: 12.5,
                        max: 78.3,
                        count: 15,
                        unit: 'miles'
                    }
                }
            });
        }
    };

    const handleVehicleChange = (event) => {
        const vehicleId = event.target.value;
        const vehicle = vehicles.find(v => v.id === vehicleId);
        setSelectedVehicle(vehicle);
    };

    const handleMetricChange = (event) => {
        setSelectedMetric(event.target.value);
    };

    const handleTimeRangeChange = (event, newTimeRange) => {
        if (newTimeRange !== null) {
            setTimeRange(newTimeRange);
        }
    };

    if (!selectedVehicle) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6">No vehicles available</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Title name={`${selectedVehicle.name} Analysis`} />
            
            {/* Vehicle Selection */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Select Vehicle</InputLabel>
                                <Select
                                    value={selectedVehicle.id}
                                    onChange={handleVehicleChange}
                                    label="Select Vehicle"
                                >
                                    {vehicles.map(vehicle => (
                                        <MenuItem key={vehicle.id} value={vehicle.id}>
                                            {vehicle.name} ({vehicle.type})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Stack direction="row" spacing={1}>
                                <Chip 
                                    icon={<DirectionsCarIcon />} 
                                    label={selectedVehicle.type} 
                                    color="primary" 
                                />
                                <Chip 
                                    label={selectedVehicle.status} 
                                    color={selectedVehicle.status === 'ACTIVE' ? 'success' : 'warning'} 
                                />
                                <Chip 
                                    label={`${selectedVehicle.mileage} mi`} 
                                    color="info" 
                                />
                            </Stack>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Vehicle Summary Cards */}
            {vehicleSummary && (
                <VehicleSummaryCards summary={vehicleSummary} vehicle={selectedVehicle} />
            )}

            {/* Performance Charts */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6">Performance Trends</Typography>
                                <Stack direction="row" spacing={1}>
                                    <FormControl size="small">
                                        <InputLabel>Metric</InputLabel>
                                        <Select
                                            value={selectedMetric}
                                            onChange={handleMetricChange}
                                            label="Metric"
                                            sx={{ minWidth: 150 }}
                                        >
                                            <MenuItem value="fuel_efficiency">Fuel Efficiency</MenuItem>
                                            <MenuItem value="distance_traveled">Distance</MenuItem>
                                            <MenuItem value="average_speed">Speed</MenuItem>
                                            <MenuItem value="idle_time">Idle Time</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <ToggleButtonGroup
                                        value={timeRange}
                                        exclusive
                                        onChange={handleTimeRangeChange}
                                        size="small"
                                    >
                                        <ToggleButton value="week">Week</ToggleButton>
                                        <ToggleButton value="month">Month</ToggleButton>
                                        <ToggleButton value="quarter">Quarter</ToggleButton>
                                    </ToggleButtonGroup>
                                </Stack>
                            </Box>
                            <TimeSeriesChart 
                                data={performanceData} 
                                title={`${selectedVehicle.name} Performance Trends`}
                                metric={selectedMetric}
                            />
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Performance Metrics
                            </Typography>
                            <MetricComparison 
                                data={performanceData} 
                                vehicle={selectedVehicle}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Recent Performance Records */}
            <Card sx={{ mt: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Recent Performance Records
                    </Typography>
                    <RecentRecordsTable data={performanceData.slice(0, 10)} />
                </CardContent>
            </Card>
        </Box>
    );
}

function VehicleSummaryCards({ summary, vehicle }) {
    const metrics = summary.metrics || {};
    
    return (
        <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardContent>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <LocalGasStationIcon color="primary" />
                            <Box>
                                <Typography color="textSecondary" variant="body2">
                                    Avg Fuel Efficiency
                                </Typography>
                                <Typography variant="h6">
                                    {metrics.fuel_efficiency?.average?.toFixed(1) || 'N/A'} mpg
                                </Typography>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardContent>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <RouteIcon color="secondary" />
                            <Box>
                                <Typography color="textSecondary" variant="body2">
                                    Total Distance
                                </Typography>
                                <Typography variant="h6">
                                    {metrics.distance_traveled?.sum?.toFixed(0) || 'N/A'} mi
                                </Typography>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardContent>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <SpeedIcon color="success" />
                            <Box>
                                <Typography color="textSecondary" variant="body2">
                                    Avg Speed
                                </Typography>
                                <Typography variant="h6">
                                    {metrics.average_speed?.average?.toFixed(1) || 'N/A'} mph
                                </Typography>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardContent>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <DirectionsCarIcon color="info" />
                            <Box>
                                <Typography color="textSecondary" variant="body2">
                                    Total Records
                                </Typography>
                                <Typography variant="h6">
                                    {summary.totalRecords || 0}
                                </Typography>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}


function MetricComparison({ data, vehicle }) {
    const metrics = ['fuel_efficiency', 'distance_traveled', 'average_speed'];
    const metricLabels = {
        'fuel_efficiency': 'Fuel Efficiency',
        'distance_traveled': 'Distance',
        'average_speed': 'Speed'
    };

    const comparisonData = metrics.map(metric => {
        const metricData = data.filter(record => record.metric_name === metric);
        const values = metricData.map(record => record.metric_value);
        
        return {
            metric: metricLabels[metric],
            average: values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0,
            count: values.length
        };
    }).filter(item => item.count > 0);

    return (
        <Stack spacing={2}>
            {comparisonData.map(item => (
                <Box key={item.metric}>
                    <Typography variant="body2" color="textSecondary">
                        {item.metric}
                    </Typography>
                    <Typography variant="h6">
                        {item.average.toFixed(1)}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                        {item.count} records
                    </Typography>
                </Box>
            ))}
        </Stack>
    );
}

function RecentRecordsTable({ data }) {
    if (data.length === 0) {
        return (
            <Typography color="textSecondary">
                No recent performance records available
            </Typography>
        );
    }

    return (
        <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Date</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Metric</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Value</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Unit</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Session</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((record, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                            <td style={{ padding: '8px' }}>
                                {new Date(record.recorded_at).toLocaleDateString()}
                            </td>
                            <td style={{ padding: '8px' }}>
                                {record.metric_name.replace('_', ' ')}
                            </td>
                            <td style={{ padding: '8px' }}>
                                {record.metric_value}
                            </td>
                            <td style={{ padding: '8px' }}>
                                {record.unit}
                            </td>
                            <td style={{ padding: '8px' }}>
                                {record.session_name}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Box>
    );
}

function getMetricLabel(metric) {
    const labels = {
        'fuel_efficiency': 'Fuel Efficiency (mpg)',
        'distance_traveled': 'Distance (miles)',
        'average_speed': 'Speed (mph)',
        'idle_time': 'Idle Time (hours)'
    };
    return labels[metric] || metric;
}
