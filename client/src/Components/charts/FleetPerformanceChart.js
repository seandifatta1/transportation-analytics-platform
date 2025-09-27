import React from 'react';
import { BarChart } from '@mui/x-charts';
import { Card, CardContent, Typography, Box } from '@mui/material';

export function FleetPerformanceChart({ data, title = "Fleet Performance" }) {
    const hasData = data?.performance && data.performance.length > 0;
    
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>{title}</Typography>
                <Box sx={{ height: 300 }}>
                    {hasData ? (
                        <BarChart
                            series={[{ data: data.performance, label: 'Performance Metric' }]}
                            height={300}
                            xAxis={[{ scaleType: 'band', data: data.labels }]}
                        />
                    ) : (
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            height: '100%',
                            color: 'text.secondary'
                        }}>
                            No data available
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
}

export default FleetPerformanceChart;

