import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Chip,
  Avatar,
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  DirectionsCar as VehicleIcon,
  Route as RouteIcon,
  TrendingUp as TrendsIcon
} from '@mui/icons-material';

// Simplified version of GlobalComponents for Storybook
// This strips out all the complex context and API stuff
const SimpleGlobalComponents = ({ user = null }) => {
  // Stubbed data for realistic display
  const mockData = {
    totalVehicles: 25,
    activeRoutes: 12,
    totalMiles: 15420,
    avgEfficiency: 87,
    recentActivity: [
      { id: 1, action: 'Route completed', vehicle: 'Truck-001', time: '2 hours ago' },
      { id: 2, action: 'Maintenance scheduled', vehicle: 'Van-003', time: '4 hours ago' },
      { id: 3, action: 'Fuel efficiency updated', vehicle: 'Truck-002', time: '6 hours ago' }
    ]
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
          Transportation Analytics Platform
        </Typography>
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {user.email?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Welcome back
              </Typography>
              <Typography variant="subtitle1">
                {user.email}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <VehicleIcon color="primary" sx={{ mr: 1 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Vehicles
                  </Typography>
                  <Typography variant="h4">
                    {mockData.totalVehicles}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <RouteIcon color="success" sx={{ mr: 1 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Active Routes
                  </Typography>
                  <Typography variant="h4">
                    {mockData.activeRoutes}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendsIcon color="info" sx={{ mr: 1 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Avg Efficiency
                  </Typography>
                  <Typography variant="h4">
                    {mockData.avgEfficiency}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <DashboardIcon color="warning" sx={{ mr: 1 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Miles
                  </Typography>
                  <Typography variant="h4">
                    {mockData.totalMiles.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Main Content Area */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Dashboard Overview
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {user ? `Welcome to your transportation analytics dashboard, ${user.email.split('@')[0]}!` : 'Please log in to view your dashboard.'}
              </Typography>
              <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 1, backgroundColor: '#fafafa' }}>
                <Typography variant="h6" gutterBottom>
                  Main Content Area
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This is where the main application content would be rendered via React Router Outlet.
                  The actual GlobalComponents provides context for data management and routing.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {mockData.recentActivity.map((activity) => (
                <Box key={activity.id} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Chip 
                    label={activity.action} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                    sx={{ mr: 1 }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2">
                      {activity.vehicle}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {activity.time}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default {
  title: 'Components/GlobalComponents',
  component: SimpleGlobalComponents,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Box sx={{ p: 2 }}>
          <Story />
        </Box>
      </BrowserRouter>
    ),
  ],
};

export const Default = {
  render: () => <SimpleGlobalComponents />,
};

export const WithUser = {
  render: () => (
    <SimpleGlobalComponents 
      user={{ id: '1', email: 'test@example.com' }} 
    />
  ),
};

export const NotAuthenticated = {
  render: () => <SimpleGlobalComponents user={null} />,
};

export const AdminUser = {
  render: () => (
    <SimpleGlobalComponents 
      user={{ id: '2', email: 'admin@example.com' }} 
    />
  ),
};