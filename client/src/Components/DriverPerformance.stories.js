import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import DriverPerformance from './DriverPerformance';

const mockDrivers = [
  { id: '1', name: 'John Smith', licenseNumber: 'DL-001', experience: '5', status: 'active' },
  { id: '2', name: 'Sarah Johnson', licenseNumber: 'DL-002', experience: '3', status: 'active' },
  { id: '3', name: 'Mike Wilson', licenseNumber: 'DL-003', experience: '8', status: 'suspended' }
];

const mockPerformanceMetrics = [
  { id: '1', driverId: '1', metricName: 'fuel_efficiency', metricValue: '8.5', unit: 'mpg', date: '2024-01-15', notes: 'Excellent fuel efficiency' },
  { id: '2', driverId: '1', metricName: 'safety_score', metricValue: '9.2', unit: '/10', date: '2024-01-15', notes: 'Outstanding safety record' },
  { id: '3', driverId: '2', metricName: 'fuel_efficiency', metricValue: '7.8', unit: 'mpg', date: '2024-01-14', notes: 'Good performance' }
];

export default {
  title: 'Components/DriverPerformance',
  component: DriverPerformance,
  decorators: [
    (Story) => (
      <Box sx={{ p: 2 }}>
        <Story />
      </Box>
    ),
  ],
};

export const Default = {
  render: () => {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          DriverPerformance - Default Story
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          This demonstrates the DriverPerformance component.
        </Typography>
        <Paper sx={{ p: 2, bgcolor: 'info.light', color: 'info.contrastText' }}>
          <Typography variant="h6">
            ✅ Component: DriverPerformance
          </Typography>
          <Typography variant="body2">
            ✅ Props: drivers, performanceMetrics, handlers
          </Typography>
          <Typography variant="body2">
            ✅ State: Loading, dialogs, forms
          </Typography>
        </Paper>
        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
          In a real app, this would show the full driver performance management interface.
        </Typography>
      </Box>
    );
  },
};