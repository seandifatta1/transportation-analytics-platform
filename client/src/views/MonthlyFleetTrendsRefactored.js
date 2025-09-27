import React from 'react';
import {
    Box,
    Tab,
    Tabs,
    Grid,
    Card,
    CardContent,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    Chip
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
// Removed all dynamic imports - no hooks, no contexts
import { FleetPerformanceChart } from '../components/charts/FleetPerformanceChart';
import { FleetEfficiencyChart } from '../components/charts/FleetEfficiencyChart';
import { FleetSummaryCards } from '../components/charts/FleetSummaryCards';
import { TimeSeriesChart } from '../components/charts/TimeSeriesChart';

const MonthlyFleetTrendsRefactored = () => {
    // Static stub data - no hooks, no state, no dynamic data
    const currentTab = "Delivery";
    const selectedMetric = 'fuel_efficiency';
    const selectedTimeRange = '30days';

    // Stub performance data
    const performanceData = [
        { id: 1, vehicleId: 'V001', date: '2024-01-01', fuelEfficiency: 8.5, distanceTraveled: 150, averageSpeed: 45, idleTime: 2.5 },
        { id: 2, vehicleId: 'V002', date: '2024-01-02', fuelEfficiency: 7.8, distanceTraveled: 200, averageSpeed: 50, idleTime: 1.8 },
        { id: 3, vehicleId: 'V003', date: '2024-01-03', fuelEfficiency: 9.2, distanceTraveled: 180, averageSpeed: 42, idleTime: 3.2 },
        { id: 4, vehicleId: 'V001', date: '2024-01-04', fuelEfficiency: 8.1, distanceTraveled: 220, averageSpeed: 48, idleTime: 2.1 },
        { id: 5, vehicleId: 'V002', date: '2024-01-05', fuelEfficiency: 7.5, distanceTraveled: 190, averageSpeed: 46, idleTime: 2.8 },
    ];

    // Stub vehicles data
    const vehicles = [
        { id: 'V001', make: 'Ford', model: 'Transit', year: 2020, licensePlate: 'ABC123' },
        { id: 'V002', make: 'Mercedes', model: 'Sprinter', year: 2021, licensePlate: 'DEF456' },
        { id: 'V003', make: 'Volkswagen', model: 'Crafter', year: 2019, licensePlate: 'GHI789' },
    ];

    // Stub routes data
    const routes = [
        { id: 'R001', name: 'City Delivery', type: 'DELIVERY', status: 'ACTIVE' },
        { id: 'R002', name: 'Highway Haul', type: 'LONG_HAUL', status: 'ACTIVE' },
        { id: 'R003', name: 'Local Pickup', type: 'DELIVERY', status: 'INACTIVE' },
    ];

    return (
        <Box>
            <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
                Monthly Fleet Trends
            </Typography>
            
            {/* Fleet Tabs */}
            <Tabs
                value={currentTab}
                variant="fullWidth"
                scrollButtons
                allowScrollButtonsMobile
                aria-label="fleet type tabs"
                sx={{ mb: 3 }}
            >
                <Tab icon={<DirectionsCarIcon/>} label="Delivery" value="Delivery"/>
                <Tab icon={<LocalShippingIcon/>} label="Long Haul" value="Long Haul"/>
            </Tabs>
            
            {/* Time Range and Metric Selectors */}
            <Box sx={{ mb: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Time Range</InputLabel>
                        <Select
                            value={selectedTimeRange}
                            label="Time Range"
                        >
                            <MenuItem value="7days">Last 7 Days</MenuItem>
                            <MenuItem value="30days">Last 30 Days</MenuItem>
                            <MenuItem value="90days">Last 90 Days</MenuItem>
                            <MenuItem value="1year">Last Year</MenuItem>
                        </Select>
                    </FormControl>
                    
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Metric</InputLabel>
                        <Select
                            value={selectedMetric}
                            label="Metric"
                        >
                            <MenuItem value="fuel_efficiency">Fuel Efficiency</MenuItem>
                            <MenuItem value="distance_traveled">Distance Traveled</MenuItem>
                            <MenuItem value="average_speed">Average Speed</MenuItem>
                            <MenuItem value="idle_time">Idle Time</MenuItem>
                        </Select>
                    </FormControl>
                    
                    <Chip 
                        icon={<TrendingUpIcon />} 
                        label="30 days" 
                        color="primary" 
                    />
                </Stack>
            </Box>
            
            {/* Fleet Summary Cards */}
            <Box sx={{ mb: 3 }}>
                <FleetSummaryCards 
                    data={performanceData} 
                    title="Monthly Fleet Summary" 
                />
            </Box>
            
            {/* Charts */}
            {currentTab === "Delivery" ? (
                <Grid container spacing={3}>
                    {/* Fleet Performance Chart */}
                    <Grid item xs={12} md={8}>
                        <FleetPerformanceChart 
                            data={performanceData}
                            title="Monthly Fleet Performance"
                            metricType={selectedMetric}
                        />
                    </Grid>
                    
                    {/* Fleet Efficiency Chart */}
                    <Grid item xs={12} md={4}>
                        <FleetEfficiencyChart 
                            data={performanceData}
                            title="Fleet Efficiency"
                            metricType={selectedMetric}
                        />
                    </Grid>
                    
                    {/* Time Series Chart */}
                    <Grid item xs={12}>
                        <TimeSeriesChart 
                            data={performanceData}
                            title="Performance Over Time"
                            metricName={selectedMetric}
                        />
                    </Grid>
                </Grid>
            ) : (
                <Card>
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                        <LocalShippingIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            Long Haul Analytics
                        </Typography>
                        <Typography color="text.secondary">
                            Long haul performance analytics coming soon...
                        </Typography>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};

export default MonthlyFleetTrendsRefactored;
