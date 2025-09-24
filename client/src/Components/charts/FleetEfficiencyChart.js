import React, { useMemo } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Chip,
    Stack,
    Box
} from '@mui/material';
import { BarChart } from '@mui/x-charts';
import {
    LocalGasStation as FuelIcon,
    Route as RouteIcon
} from '@mui/icons-material';
import { CHART_COLORS, calculateEfficiencyScore } from '../ChartConfig';

const FleetEfficiencyChart = ({ 
    data = [], 
    title = "Fleet Efficiency Analysis" 
}) => {
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
};

export default FleetEfficiencyChart;
