import React from 'react';
import { LineChart } from '@mui/x-charts';
import { Card, CardContent, Typography, Box } from '@mui/material';

export function FleetEfficiencyChart({ data, title = "Fleet Efficiency" }) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>{title}</Typography>
                <Box sx={{ height: 300 }}>
                    <LineChart
                        series={[{ data: data?.efficiency || [], label: 'Efficiency Metric' }]}
                        height={300}
                        xAxis={[{ scaleType: 'band', data: data?.labels || [] }]}
                    />
                </Box>
            </CardContent>
        </Card>
    );
}

export default FleetEfficiencyChart;

