import * as React from 'react';
import { useState, useMemo } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Chip,
    Stack,
    ToggleButton,
    ToggleButtonGroup
} from '@mui/material';
import {
    BarChart,
    LineChart,
    ScatterChart,
    PieChart
} from '@mui/x-charts';
import {
    TrendingUp as TrendingUpIcon,
    LocalGasStation as FuelIcon,
    Speed as SpeedIcon,
    Route as RouteIcon,
    DirectionsCar as VehicleIcon
} from '@mui/icons-material';
import { 
    CHART_COLORS, 
    METRIC_CONFIG, 
    DEFAULT_CHART_PROPS,
    getMetricConfig,
    formatValue,
    calculateEfficiencyScore,
    generateChartPalette
} from './ChartConfig';

// Transportation-specific chart components
export function FleetPerformanceChart({ data, title = "Fleet Performance", height = 400 }) {
    const [selectedMetric, setSelectedMetric] = useState('fuel_efficiency');
    const [chartType, setChartType] = useState('bar');

    const chartData = useMemo(() => {
        if (!data || data.length === 0) return [];
        
        return data.map((record, index) => ({
            id: index,
            vehicle: record.vehicle_name || record.Exercise || `Vehicle ${index + 1}`,
            value: record.metric_value || record.Weight || 0,
            date: record.recorded_at || record.Time,
            metric: record.metric_name || 'fuel_efficiency'
        }));
    }, [data]);

    const filteredData = chartData.filter(item => item.metric === selectedMetric);

    const metricOptions = Object.keys(METRIC_CONFIG).map(key => ({
        value: key,
        ...METRIC_CONFIG[key],
        icon: <FuelIcon /> // Will be updated based on actual icon mapping
    }));

    const selectedMetricInfo = metricOptions.find(m => m.value === selectedMetric) || metricOptions[0];

    const renderChart = () => {
        if (filteredData.length === 0) {
            return (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="textSecondary">
                        No data available for {selectedMetricInfo.label}
                    </Typography>
                </Box>
            );
        }

        const commonProps = {
            dataset: filteredData,
            height: height,
            margin: { left: 100, right: 50, top: 50, bottom: 50 }
        };

        switch (chartType) {
            case 'line':
                return (
                    <LineChart
                        {...commonProps}
                        xAxis={[{
                            scaleType: 'point',
                            dataKey: 'vehicle',
                            label: 'Vehicle'
                        }]}
                        yAxis={[{
                            label: `${selectedMetricInfo.label} (${selectedMetricInfo.unit})`
                        }]}
                        series={[{
                            dataKey: 'value',
                            label: selectedMetricInfo.label,
                            color: selectedMetricInfo.color || CHART_COLORS.primary
                        }]}
                    />
                );
            case 'scatter':
                return (
                    <ScatterChart
                        {...commonProps}
                        xAxis={[{
                            scaleType: 'linear',
                            dataKey: 'value',
                            label: selectedMetricInfo.label
                        }]}
                        yAxis={[{
                            scaleType: 'linear',
                            dataKey: 'value',
                            label: 'Performance'
                        }]}
                        series={[{
                            dataKey: 'value',
                            label: selectedMetricInfo.label
                        }]}
                    />
                );
            case 'pie':
                const pieData = filteredData.map((item, index) => ({
                    id: index,
                    value: item.value,
                    label: item.vehicle
                }));
                return (
                    <PieChart
                        dataset={pieData}
                        series={[{
                            dataKey: 'value',
                            label: selectedMetricInfo.label
                        }]}
                        height={height}
                    />
                );
            default: // bar
                return (
                    <BarChart
                        {...commonProps}
                        xAxis={[{
                            scaleType: 'band',
                            dataKey: 'vehicle',
                            label: 'Vehicle'
                        }]}
                        yAxis={[{
                            label: `${selectedMetricInfo.label} (${selectedMetricInfo.unit})`
                        }]}
                        series={[{
                            dataKey: 'value',
                            label: selectedMetricInfo.label,
                            color: '#1976d2'
                        }]}
                    />
                );
        }
    };

    return (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">{title}</Typography>
                    <Stack direction="row" spacing={1}>
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Metric</InputLabel>
                            <Select
                                value={selectedMetric}
                                onChange={(e) => setSelectedMetric(e.target.value)}
                                label="Metric"
                            >
                                {metricOptions.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {option.icon}
                                            {option.label}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <ToggleButtonGroup
                            value={chartType}
                            exclusive
                            onChange={(e, value) => value && setChartType(value)}
                            size="small"
                        >
                            <ToggleButton value="bar">Bar</ToggleButton>
                            <ToggleButton value="line">Line</ToggleButton>
                            <ToggleButton value="scatter">Scatter</ToggleButton>
                            <ToggleButton value="pie">Pie</ToggleButton>
                        </ToggleButtonGroup>
                    </Stack>
                </Box>
                {renderChart()}
            </CardContent>
        </Card>
    );
}

export function FleetEfficiencyChart({ data, title = "Fleet Efficiency Analysis" }) {
    const efficiencyData = useMemo(() => {
        if (!data || data.length === 0) return [];
        
        // Group by vehicle and calculate efficiency metrics
        const vehicleStats = {};
        data.forEach(record => {
            const vehicle = record.vehicle_name || record.Exercise;
            if (!vehicleStats[vehicle]) {
                vehicleStats[vehicle] = {
                    vehicle,
                    fuelEfficiency: [],
                    distance: [],
                    speed: []
                };
            }
            
            if (record.metric_name === 'fuel_efficiency') {
                vehicleStats[vehicle].fuelEfficiency.push(record.metric_value);
            } else if (record.metric_name === 'distance_traveled') {
                vehicleStats[vehicle].distance.push(record.metric_value);
            } else if (record.metric_name === 'average_speed') {
                vehicleStats[vehicle].speed.push(record.metric_value);
            }
        });

        return Object.values(vehicleStats).map(stats => ({
            vehicle: stats.vehicle,
            avgFuelEfficiency: stats.fuelEfficiency.length > 0 
                ? stats.fuelEfficiency.reduce((sum, val) => sum + val, 0) / stats.fuelEfficiency.length 
                : 0,
            totalDistance: stats.distance.reduce((sum, val) => sum + val, 0),
            avgSpeed: stats.speed.length > 0 
                ? stats.speed.reduce((sum, val) => sum + val, 0) / stats.speed.length 
                : 0,
            efficiencyScore: calculateVehicleEfficiencyScore(stats)
        }));
    }, [data]);

    const calculateVehicleEfficiencyScore = (stats) => {
        const avgFuelEfficiency = stats.fuelEfficiency.length > 0 
            ? stats.fuelEfficiency.reduce((sum, val) => sum + val, 0) / stats.fuelEfficiency.length 
            : 0;
        const totalDistance = stats.distance.reduce((sum, val) => sum + val, 0);
        const avgSpeed = stats.speed.length > 0 
            ? stats.speed.reduce((sum, val) => sum + val, 0) / stats.speed.length 
            : 0;
        const avgIdleTime = 0; // Would need idle time data
        
        return calculateEfficiencyScore(avgFuelEfficiency, totalDistance, avgSpeed, avgIdleTime);
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>{title}</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                        <BarChart
                            dataset={efficiencyData}
                            xAxis={[{
                                scaleType: 'band',
                                dataKey: 'vehicle',
                                label: 'Vehicle'
                            }]}
                            yAxis={[{
                                label: 'Efficiency Score (0-1)'
                            }]}
                            series={[{
                                dataKey: 'efficiencyScore',
                                label: 'Efficiency Score',
                                color: CHART_COLORS.success
                            }]}
                            height={300}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Stack spacing={2}>
                            {efficiencyData.map((vehicle, index) => (
                                <Box key={index} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        {vehicle.vehicle}
                                    </Typography>
                                    <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                                        <Chip 
                                            icon={<FuelIcon />} 
                                            label={`${vehicle.avgFuelEfficiency.toFixed(1)} mpg`} 
                                            size="small" 
                                        />
                                        <Chip 
                                            icon={<RouteIcon />} 
                                            label={`${vehicle.totalDistance.toFixed(0)} mi`} 
                                            size="small" 
                                        />
                                    </Stack>
                                    <Typography variant="body2" color="textSecondary">
                                        Efficiency: {(vehicle.efficiencyScore * 100).toFixed(0)}%
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

export function RoutePerformanceChart({ data, title = "Route Performance Analysis" }) {
    const routeData = useMemo(() => {
        if (!data || data.length === 0) return [];
        
        // Group by route and calculate performance metrics
        const routeStats = {};
        data.forEach(record => {
            const route = record.route_name || 'Unknown Route';
            if (!routeStats[route]) {
                routeStats[route] = {
                    route,
                    sessions: new Set(),
                    totalDistance: 0,
                    totalFuelUsed: 0,
                    avgSpeed: 0,
                    performanceRecords: 0
                };
            }
            
            routeStats[route].sessions.add(record.session_name);
            routeStats[route].performanceRecords++;
            
            if (record.metric_name === 'distance_traveled') {
                routeStats[route].totalDistance += record.metric_value;
            } else if (record.metric_name === 'fuel_efficiency') {
                routeStats[route].totalFuelUsed += record.metric_value;
            } else if (record.metric_name === 'average_speed') {
                routeStats[route].avgSpeed = record.metric_value;
            }
        });

        return Object.values(routeStats).map(stats => ({
            route: stats.route,
            sessions: stats.sessions.size,
            totalDistance: stats.totalDistance,
            avgFuelEfficiency: stats.totalFuelUsed / Math.max(stats.performanceRecords, 1),
            avgSpeed: stats.avgSpeed,
            performanceRecords: stats.performanceRecords
        }));
    }, [data]);

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>{title}</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" gutterBottom>
                            Distance by Route
                        </Typography>
                        <BarChart
                            dataset={routeData}
                            xAxis={[{
                                scaleType: 'band',
                                dataKey: 'route',
                                label: 'Route'
                            }]}
                            yAxis={[{
                                label: 'Distance (miles)'
                            }]}
                            series={[{
                                dataKey: 'totalDistance',
                                label: 'Total Distance',
                                color: CHART_COLORS.primary
                            }]}
                            height={250}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" gutterBottom>
                            Sessions by Route
                        </Typography>
                        <BarChart
                            dataset={routeData}
                            xAxis={[{
                                scaleType: 'band',
                                dataKey: 'route',
                                label: 'Route'
                            }]}
                            yAxis={[{
                                label: 'Number of Sessions'
                            }]}
                            series={[{
                                dataKey: 'sessions',
                                label: 'Sessions',
                                color: CHART_COLORS.success
                            }]}
                            height={250}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

export function TimeSeriesChart({ data, title = "Performance Over Time", metric = 'fuel_efficiency' }) {
    const timeSeriesData = useMemo(() => {
        if (!data || data.length === 0) return [];
        
        // Filter by metric and group by date
        const filteredData = data.filter(record => 
            record.metric_name === metric || record.Exercise
        );
        
        const groupedByDate = {};
        filteredData.forEach(record => {
            const date = new Date(record.recorded_at || record.Time).toISOString().split('T')[0];
            if (!groupedByDate[date]) {
                groupedByDate[date] = [];
            }
            groupedByDate[date].push(record.metric_value || record.Weight || 0);
        });

        return Object.keys(groupedByDate)
            .sort()
            .map(date => ({
                date,
                value: groupedByDate[date].reduce((sum, val) => sum + val, 0) / groupedByDate[date].length,
                count: groupedByDate[date].length
            }));
    }, [data, metric]);

    const metricLabels = {
        'fuel_efficiency': 'Fuel Efficiency (mpg)',
        'distance_traveled': 'Distance (miles)',
        'average_speed': 'Speed (mph)',
        'idle_time': 'Idle Time (hours)'
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>{title}</Typography>
                {timeSeriesData.length > 0 ? (
                    <LineChart
                        dataset={timeSeriesData}
                        xAxis={[{
                            scaleType: 'point',
                            dataKey: 'date',
                            label: 'Date'
                        }]}
                        yAxis={[{
                            label: metricLabels[metric] || metric
                        }]}
                        series={[{
                            dataKey: 'value',
                            label: metricLabels[metric] || metric,
                            color: getMetricConfig(metric).color || CHART_COLORS.primary
                        }]}
                        height={300}
                    />
                ) : (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography color="textSecondary">
                            No time series data available for {metric}
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}

export function FleetSummaryCards({ data, title = "Fleet Summary" }) {
    const summary = useMemo(() => {
        if (!data || data.length === 0) {
            return {
                totalVehicles: 0,
                totalDistance: 0,
                avgFuelEfficiency: 0,
                totalSessions: 0
            };
        }

        const vehicles = new Set();
        const sessions = new Set();
        let totalDistance = 0;
        let fuelEfficiencySum = 0;
        let fuelEfficiencyCount = 0;

        data.forEach(record => {
            vehicles.add(record.vehicle_name || record.Exercise);
            sessions.add(record.session_name || record.Day);
            
            if (record.metric_name === 'distance_traveled' || record.Exercise) {
                totalDistance += record.metric_value || record.Weight || 0;
            }
            
            if (record.metric_name === 'fuel_efficiency') {
                fuelEfficiencySum += record.metric_value;
                fuelEfficiencyCount++;
            }
        });

        return {
            totalVehicles: vehicles.size,
            totalDistance: totalDistance,
            avgFuelEfficiency: fuelEfficiencyCount > 0 ? fuelEfficiencySum / fuelEfficiencyCount : 0,
            totalSessions: sessions.size
        };
    }, [data]);

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>{title}</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: 'center' }}>
                            <VehicleIcon sx={{ fontSize: 40, color: CHART_COLORS.primary, mb: 1 }} />
                            <Typography variant="h4">{summary.totalVehicles}</Typography>
                            <Typography color="textSecondary">Vehicles</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: 'center' }}>
                            <RouteIcon sx={{ fontSize: 40, color: CHART_COLORS.secondary, mb: 1 }} />
                            <Typography variant="h4">{summary.totalDistance.toFixed(0)}</Typography>
                            <Typography color="textSecondary">Miles</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: 'center' }}>
                            <FuelIcon sx={{ fontSize: 40, color: CHART_COLORS.fuel, mb: 1 }} />
                            <Typography variant="h4">{summary.avgFuelEfficiency.toFixed(1)}</Typography>
                            <Typography color="textSecondary">Avg MPG</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: 'center' }}>
                            <TrendingUpIcon sx={{ fontSize: 40, color: CHART_COLORS.info, mb: 1 }} />
                            <Typography variant="h4">{summary.totalSessions}</Typography>
                            <Typography color="textSecondary">Sessions</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

// Export all chart components
export default {
    FleetPerformanceChart,
    FleetEfficiencyChart,
    RoutePerformanceChart,
    TimeSeriesChart,
    FleetSummaryCards
};
