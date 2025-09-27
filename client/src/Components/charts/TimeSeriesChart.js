import React from 'react';
import { ScatterChart } from '@mui/x-charts';
import { Card, CardContent, Typography, Box } from '@mui/material';

export function TimeSeriesChart({ data, title = "Time Series Data" }) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>{title}</Typography>
                <Box sx={{ height: 300 }}>
                    <ScatterChart
                        series={[{ data: data?.series || [], label: 'Time Series Data' }]}
                        height={300}
                    />
                </Box>
            </CardContent>
        </Card>
    );
}

export default TimeSeriesChart;

