import React, { useState, useContext } from 'react';
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
import { ScreenContext } from '../GlobalComponents';
import { useData, useChartData, useNotifications } from '../hooks/useServices';
import FleetPerformanceChart from '../components/charts/FleetPerformanceChart';
import FleetEfficiencyChart from '../components/charts/FleetEfficiencyChart';
import FleetSummaryCards from '../components/charts/FleetSummaryCards';
import TimeSeriesChart from '../components/charts/TimeSeriesChart';

const MonthlyFleetTrendsRefactored = () => {
    const [currentScreen, setCurrentScreen] = useContext(ScreenContext);
    const [currentTab, setCurrentTab] = useState("Delivery");
    const [selectedMetric, setSelectedMetric] = useState('fuel_efficiency');
    const [selectedTimeRange, setSelectedTimeRange] = useState('30days');
    const { showError } = useNotifications();

    if (currentScreen !== "Monthly Fleet Trends") {
        setCurrentScreen("Monthly Fleet Trends");
    }

    // Calculate date range based on selection
    const getDateRange = (timeRange) => {
        const endDate = new Date();
        const startDate = new Date();
        
        switch (timeRange) {
            case '7days':
                startDate.setDate(endDate.getDate() - 7);
                break;
            case '30days':
                startDate.setDate(endDate.getDate() - 30);
                break;
            case '90days':
                startDate.setDate(endDate.getDate() - 90);
                break;
            case '1year':
                startDate.setFullYear(endDate.getFullYear() - 1);
                break;
            default:
                startDate.setDate(endDate.getDate() - 30);
        }
        
        return {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
        };
    };

    const dateRange = getDateRange(selectedTimeRange);

    // Use services for data fetching
    const { data: performanceData, loading: performanceLoading, error: performanceError } = useData('performanceRecords', {
        filters: {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate
        }
    });

    const { data: vehicles, loading: vehiclesLoading } = useData('vehicles');
    const { data: routes, loading: routesLoading } = useData('fleetRoutes');

    // Use services for chart data
    const { chartData: fleetPerformanceData, loading: chartLoading } = useChartData('fleetPerformance', {
        metricType: selectedMetric,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
    });

    const { chartData: timeSeriesData, loading: timeSeriesLoading } = useChartData('timeSeries', {
        metricName: selectedMetric,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
    });

    // Handle errors
    if (performanceError) {
        showError('Failed to load performance data');
    }

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    const handleMetricChange = (metric) => {
        setSelectedMetric(metric);
    };

    const handleTimeRangeChange = (timeRange) => {
        setSelectedTimeRange(timeRange);
    };

    if (performanceLoading || vehiclesLoading || routesLoading) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography>Loading monthly fleet trends...</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <FleetTabs currentTab={currentTab} onTabChange={handleTabChange} />
            
            {/* Time Range and Metric Selectors */}
            <Box sx={{ mb: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Time Range</InputLabel>
                        <Select
                            value={selectedTimeRange}
                            onChange={(e) => handleTimeRangeChange(e.target.value)}
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
                            onChange={(e) => handleMetricChange(e.target.value)}
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
                        label={`${selectedTimeRange.replace('days', ' days').replace('1year', '1 year')}`} 
                        color="primary" 
                    />
                </Stack>
            </Box>
            
            {/* Fleet Summary Cards */}
            <Box sx={{ mb: 3 }}>
                <FleetSummaryCards 
                    data={performanceData || []} 
                    title="Monthly Fleet Summary" 
                />
            </Box>
            
            {currentTab === "Delivery" ? (
                <DeliveryCharts
                    data={performanceData || []}
                    vehicles={vehicles || []}
                    routes={routes || []}
                    selectedMetric={selectedMetric}
                    onMetricChange={handleMetricChange}
                />
            ) : (
                <LongHaulCharts />
            )}
        </Box>
    );
};

const FleetTabs = ({ currentTab, onTabChange }) => {
    return (
        <Tabs
            value={currentTab}
            onChange={onTabChange}
            variant="fullWidth"
            scrollButtons
            allowScrollButtonsMobile
            aria-label="fleet type tabs"
            sx={{ mb: 3 }}
        >
            <Tab icon={<DirectionsCarIcon/>} label="Delivery" value="Delivery"/>
            <Tab icon={<LocalShippingIcon/>} label="Long Haul" value="Long Haul"/>
        </Tabs>
    );
};

const DeliveryCharts = ({ data, vehicles, routes, selectedMetric, onMetricChange }) => {
    return (
        <Grid container spacing={3}>
            {/* Fleet Performance Chart */}
            <Grid item xs={12} md={8}>
                <FleetPerformanceChart 
                    data={data}
                    title="Monthly Fleet Performance"
                    onMetricChange={onMetricChange}
                />
            </Grid>
            
            {/* Fleet Efficiency Analysis */}
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
                    title="Performance Trends Over Time"
                    metric={selectedMetric}
                />
            </Grid>
        </Grid>
    );
};

const LongHaulCharts = () => {
    return (
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
    );
};

export default MonthlyFleetTrendsRefactored;
