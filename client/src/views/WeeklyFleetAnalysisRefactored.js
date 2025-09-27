import React, { useState, useContext } from 'react';
import {
    Box,
    Tab,
    Tabs,
    Grid,
    Card,
    CardContent,
    Typography
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { ScreenContext } from '../GlobalComponents';
import { useData, useChartData, useNotifications } from '../hooks/useServices';
import { FleetPerformanceChart } from '../components/charts/FleetPerformanceChart';
import { FleetEfficiencyChart } from '../components/charts/FleetEfficiencyChart';
import { FleetSummaryCards } from '../components/charts/FleetSummaryCards';
import { TimeSeriesChart } from '../components/charts/TimeSeriesChart';

const WeeklyFleetAnalysisRefactored = () => {
    const [currentScreen, setCurrentScreen] = useContext(ScreenContext);
    const [currentTab, setCurrentTab] = useState("Delivery");
    const { showError } = useNotifications();

    if (currentScreen !== "Weekly Fleet Analysis") {
        setCurrentScreen("Weekly Fleet Analysis");
    }

    // Use services for data fetching
    const { data: performanceData, loading: performanceLoading, error: performanceError } = useData('performanceRecords', {
        filters: {
            startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last 7 days
            endDate: new Date().toISOString().split('T')[0]
        }
    });

    const { data: vehicles, loading: vehiclesLoading } = useData('vehicles');
    const { data: fleetRoutes, loading: routesLoading } = useData('fleetRoutes');

    // Use services for chart data
    const { chartData: fleetPerformanceData, loading: chartLoading } = useChartData('fleetPerformance', {
        metricType: 'fuel_efficiency',
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });

    // Handle errors
    if (performanceError) {
        showError('Failed to load performance data');
    }

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    const handleMetricChange = (metric) => {
        console.log('Metric changed to:', metric);
        // This would trigger a chart refresh with the new metric
    };

    const handleChartTypeChange = (chartType) => {
        console.log('Chart type changed to:', chartType);
        // This would trigger a chart refresh with the new type
    };

    if (performanceLoading || vehiclesLoading || routesLoading) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography>Loading fleet data...</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <FleetTabs currentTab={currentTab} onTabChange={handleTabChange} />
            
            {/* Fleet Summary Cards */}
            <Box sx={{ mb: 3 }}>
                <FleetSummaryCards 
                    data={performanceData || []} 
                    title="Weekly Fleet Summary" 
                />
            </Box>
            
            {currentTab === "Delivery" ? (
                <DeliveryCharts
                    data={performanceData || []}
                    vehicles={vehicles || []}
                    onMetricChange={handleMetricChange}
                    onChartTypeChange={handleChartTypeChange}
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

const DeliveryCharts = ({ data, vehicles, onMetricChange, onChartTypeChange }) => {
    return (
        <Grid container spacing={3}>
            {/* Fleet Performance Chart */}
            <Grid item xs={12} md={8}>
                <FleetPerformanceChart 
                    data={data}
                    title="Weekly Fleet Performance"
                    onMetricChange={onMetricChange}
                    onChartTypeChange={onChartTypeChange}
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
                    title="Performance Trends This Week"
                    metric="fuel_efficiency"
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

export default WeeklyFleetAnalysisRefactored;
