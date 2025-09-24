import React, { useState, useMemo } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    ToggleButton,
    ToggleButtonGroup
} from '@mui/material';
import {
    BarChart,
    LineChart,
    ScatterChart,
    PieChart
} from '@mui/x-charts';
import { CHART_COLORS, METRIC_CONFIG } from '../ChartConfig';

const FleetPerformanceChart = ({ 
    data = [], 
    title = "Fleet Performance", 
    height = 400,
    onMetricChange,
    onChartTypeChange 
}) => {
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
        ...METRIC_CONFIG[key]
    }));

    const selectedMetricInfo = metricOptions.find(m => m.value === selectedMetric) || metricOptions[0];

    const handleMetricChange = (event) => {
        const newMetric = event.target.value;
        setSelectedMetric(newMetric);
        onMetricChange?.(newMetric);
    };

    const handleChartTypeChange = (event, newType) => {
        if (newType) {
            setChartType(newType);
            onChartTypeChange?.(newType);
        }
    };

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
                            color: selectedMetricInfo.color || CHART_COLORS.primary
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
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Metric</InputLabel>
                            <Select
                                value={selectedMetric}
                                onChange={handleMetricChange}
                                label="Metric"
                            >
                                {metricOptions.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <ToggleButtonGroup
                            value={chartType}
                            exclusive
                            onChange={handleChartTypeChange}
                            size="small"
                        >
                            <ToggleButton value="bar">Bar</ToggleButton>
                            <ToggleButton value="line">Line</ToggleButton>
                            <ToggleButton value="scatter">Scatter</ToggleButton>
                            <ToggleButton value="pie">Pie</ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                </Box>
                {renderChart()}
            </CardContent>
        </Card>
    );
};

export default FleetPerformanceChart;
