import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';

export function FleetSummaryCards({ summary }) {
    return (
        <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                            Total Vehicles
                        </Typography>
                        <Typography variant="h4">
                            {summary?.totalVehicles || 0}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                            Active Vehicles
                        </Typography>
                        <Typography variant="h4" color="primary">
                            {summary?.activeVehicles || 0}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                            Avg Fuel Efficiency
                        </Typography>
                        <Typography variant="h4" color="success.main">
                            {summary?.avgFuelEfficiency || 0} mpg
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                            Total Distance
                        </Typography>
                        <Typography variant="h4" color="info.main">
                            {summary?.totalDistance || 0} mi
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}

export default FleetSummaryCards;

