import React, { useMemo } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box
} from '@mui/material';
import { LineChart } from '@mui/x-charts';
import { CHART_COLORS, getMetricConfig } from '../ChartConfig';

const TimeSeriesChart = ({ 
    data = [], 
    title = "Performance Over Time", 
    metric = 'fuel_efficiency' 
}) => {
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

    const metricConfig = getMetricConfig(metric);

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
                            label: `${metricConfig.label} (${metricConfig.unit})`
                        }]}
                        series={[{
                            dataKey: 'value',
                            label: metricConfig.label,
                            color: metricConfig.color || CHART_COLORS.primary
                        }]}
                        height={300}
                    />
                ) : (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography color="textSecondary">
                            No time series data available for {metricConfig.label}
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default TimeSeriesChart;
