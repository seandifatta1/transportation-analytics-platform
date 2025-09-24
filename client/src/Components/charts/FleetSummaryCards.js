import React, { useMemo } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Box
} from '@mui/material';
import {
    DirectionsCar as VehicleIcon,
    Route as RouteIcon,
    LocalGasStation as FuelIcon,
    TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { CHART_COLORS } from '../ChartConfig';

const FleetSummaryCards = ({ 
    data = [], 
    title = "Fleet Summary" 
}) => {
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
};

export default FleetSummaryCards;
