import React from 'react';
import { BarChart } from '@mui/x-charts';
import { Card, CardContent, Typography, Box } from '@mui/material';

export function FleetPerformanceChart({ data, title = "Fleet Performance" }) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>{title}</Typography>
                <Box sx={{ height: 300 }}>
                    <BarChart
                        series={[{ data: data?.performance || [], label: 'Performance Metric' }]}
                        height={300}
                        xAxis={[{ scaleType: 'band', data: data?.labels || [] }]}
                    />
                </Box>
            </CardContent>
        </Card>
    );
}

export default FleetPerformanceChart;
