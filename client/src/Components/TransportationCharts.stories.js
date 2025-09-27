import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import {
  FleetPerformanceChart,
  FleetEfficiencyChart,
  TimeSeriesChart,
  FleetSummaryCards,
  RoutePerformanceChart
} from './TransportationCharts';

// Sample data for charts
const fleetPerformanceData = [
  { name: 'Jan', efficiency: 85, speed: 45 },
  { name: 'Feb', efficiency: 78, speed: 52 },
  { name: 'Mar', efficiency: 92, speed: 48 },
  { name: 'Apr', efficiency: 88, speed: 55 },
  { name: 'May', efficiency: 95, speed: 50 },
  { name: 'Jun', efficiency: 90, speed: 47 }
];

const fleetEfficiencyData = [
  { name: 'Vehicle 1', efficiency: 85 },
  { name: 'Vehicle 2', efficiency: 78 },
  { name: 'Vehicle 3', efficiency: 92 },
  { name: 'Vehicle 4', efficiency: 88 },
  { name: 'Vehicle 5', efficiency: 95 }
];

const timeSeriesData = [
  { time: '00:00', value: 20 },
  { time: '04:00', value: 15 },
  { time: '08:00', value: 45 },
  { time: '12:00', value: 60 },
  { time: '16:00', value: 55 },
  { time: '20:00', value: 30 }
];

const summaryData = {
  totalVehicles: 25,
  activeRoutes: 12,
  avgEfficiency: 87,
  totalMiles: 15420
};

const routePerformanceData = [
  { name: 'Route A', value: 35 },
  { name: 'Route B', value: 28 },
  { name: 'Route C', value: 22 },
  { name: 'Route D', value: 15 }
];

export default {
  title: 'Components/TransportationCharts',
  component: FleetPerformanceChart,
  decorators: [
    (Story) => (
      <Box sx={{ p: 2 }}>
        <Story />
      </Box>
    ),
  ],
};

export const AllCharts = {
  render: () => (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Transportation Analytics Dashboard
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <FleetSummaryCards data={summaryData} />
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FleetPerformanceChart data={fleetPerformanceData} />
        </Grid>
        <Grid item xs={12} md={6}>
          <FleetEfficiencyChart data={fleetEfficiencyData} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TimeSeriesChart data={timeSeriesData} />
        </Grid>
        <Grid item xs={12} md={6}>
          <RoutePerformanceChart data={routePerformanceData} />
        </Grid>
      </Grid>
    </Box>
  ),
};

export const FleetPerformance = {
  render: () => <FleetPerformanceChart data={fleetPerformanceData} />,
};

export const FleetEfficiency = {
  render: () => <FleetEfficiencyChart data={fleetEfficiencyData} />,
};

export const TimeSeries = {
  render: () => <TimeSeriesChart data={timeSeriesData} />,
};

export const SummaryCards = {
  render: () => <FleetSummaryCards data={summaryData} />,
};

export const RoutePerformance = {
  render: () => <RoutePerformanceChart data={routePerformanceData} />,
};

export const EmptyData = {
  render: () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Charts with Empty Data
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FleetPerformanceChart data={[]} />
        </Grid>
        <Grid item xs={12} md={6}>
          <FleetEfficiencyChart data={[]} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TimeSeriesChart data={[]} />
        </Grid>
        <Grid item xs={12} md={6}>
          <RoutePerformanceChart data={[]} />
        </Grid>
        <Grid item xs={12}>
          <FleetSummaryCards data={{}} />
        </Grid>
      </Grid>
    </Box>
  ),
};

export const HighPerformanceData = {
  render: () => {
    const highPerfData = [
      { name: 'Jan', efficiency: 95, speed: 60 },
      { name: 'Feb', efficiency: 98, speed: 65 },
      { name: 'Mar', efficiency: 99, speed: 70 },
      { name: 'Apr', efficiency: 97, speed: 68 },
      { name: 'May', efficiency: 100, speed: 75 },
      { name: 'Jun', efficiency: 99, speed: 72 }
    ];

    const highSummaryData = {
      totalVehicles: 50,
      activeRoutes: 25,
      avgEfficiency: 98,
      totalMiles: 25000
    };

    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          High Performance Fleet
        </Typography>
        <FleetSummaryCards data={highSummaryData} />
        <Box sx={{ mt: 3 }}>
          <FleetPerformanceChart data={highPerfData} />
        </Box>
      </Box>
    );
  },
};
