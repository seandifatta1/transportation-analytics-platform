import React, { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Card,
  CardContent,
  Grid,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp as TrendingUpIcon,
  DirectionsCar as VehicleIcon,
  Route as RouteIcon,
  Assessment as AnalyticsIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { mockAuthService } from '../mockServices';

// Create a mock AuthProvider that uses mockAuthService
const MockAuthProvider = ({ children }) => {
  const [user, setUser] = useState({ name: 'Test User', email: 'test@example.com' });
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const login = async (email, password) => {
    setLoading(true);
    const result = await mockAuthService.login(email, password);
    if (result.success) {
      setUser(result.user);
      setIsAuthenticated(true);
    }
    setLoading(false);
    return result;
  };

  const logout = async () => {
    setLoading(true);
    await mockAuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
    return { success: true };
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    register: async () => ({ success: false, message: 'Not implemented' }),
    refreshToken: async () => ({ success: false }),
    checkAuthStatus: async () => {}
  };

  return (
    <AuthProvider value={value}>
      {children}
    </AuthProvider>
  );
};

// Sample data for charts
const fleetPerformanceData = [
  { name: 'Jan', efficiency: 4000, speed: 2400 },
  { name: 'Feb', efficiency: 3000, speed: 1398 },
  { name: 'Mar', efficiency: 2000, speed: 9800 },
  { name: 'Apr', efficiency: 2780, speed: 3908 },
  { name: 'May', efficiency: 1890, speed: 4800 },
  { name: 'Jun', efficiency: 2390, speed: 3800 },
  { name: 'Jul', efficiency: 3490, speed: 4300 },
];

const fleetEfficiencyData = [
  { name: 'Truck A', efficiency: 85 },
  { name: 'Truck B', efficiency: 90 },
  { name: 'Van C', efficiency: 70 },
  { name: 'Van D', efficiency: 95 },
];

const timeSeriesData = [
  { time: '00:00', value: 10 },
  { time: '02:00', value: 15 },
  { time: '04:00', value: 8 },
  { time: '06:00', value: 20 },
  { time: '08:00', value: 12 },
  { time: '10:00', value: 25 },
  { time: '12:00', value: 18 },
];

const routePerformanceData = [
  { name: 'City Delivery', value: 400 },
  { name: 'Long Haul', value: 300 },
  { name: 'Local Pickup', value: 300 },
  { name: 'Express', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Fleet Performance Chart Component
const FleetPerformanceChart = ({ data }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Fleet Performance
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="efficiency" stroke="#8884d8" />
            <Line type="monotone" dataKey="speed" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Fleet Efficiency Chart Component
const FleetEfficiencyChart = ({ data }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Fleet Efficiency
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="efficiency" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Time Series Chart Component
const TimeSeriesChart = ({ data }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Performance Over Time
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Fleet Summary Cards Component
const FleetSummaryCards = ({ data }) => {
  return (
    <Grid container spacing={2}>
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
                  {data?.totalVehicles || 0}
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
                  {data?.activeRoutes || 0}
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
              <TrendingUpIcon color="info" sx={{ mr: 1 }} />
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Avg Efficiency
                </Typography>
                <Typography variant="h4">
                  {data?.avgEfficiency || 0}%
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
              <AnalyticsIcon color="warning" sx={{ mr: 1 }} />
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Total Miles
                </Typography>
                <Typography variant="h4">
                  {data?.totalMiles || 0}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

// Route Performance Chart Component
const RoutePerformanceChart = ({ data }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Route Performance
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Mock App Bar
const MockAppBar = ({ onMenuClick, onFilterChange, filterValue }) => (
  <AppBar position="static">
    <Toolbar>
      <IconButton edge="start" color="inherit" onClick={onMenuClick} sx={{ mr: 2 }}>
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Analytics Dashboard
      </Typography>
      <FormControl size="small" sx={{ minWidth: 120, mr: 2 }}>
        <InputLabel>Filter</InputLabel>
        <Select
          value={filterValue}
          onChange={onFilterChange}
          label="Filter"
        >
          <MenuItem value="all">All Data</MenuItem>
          <MenuItem value="last7days">Last 7 Days</MenuItem>
          <MenuItem value="last30days">Last 30 Days</MenuItem>
          <MenuItem value="last90days">Last 90 Days</MenuItem>
        </Select>
      </FormControl>
      <Chip
        icon={<FilterIcon />}
        label={`${filterValue === 'all' ? 'All' : filterValue.replace('last', '').replace('days', ' Days')}`}
        color="secondary"
        variant="outlined"
      />
    </Toolbar>
  </AppBar>
);

// Mock Navigation Drawer
const MockDrawer = ({ open, onClose }) => (
  <Drawer anchor="left" open={open} onClose={onClose}>
    <Box sx={{ width: 250, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Navigation
      </Typography>
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon><AnalyticsIcon /></ListItemIcon>
            <ListItemText primary="Analytics" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  </Drawer>
);

// Main Analytics Capability Demo
const AnalyticsCapabilityDemo = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filterValue, setFilterValue] = useState('all');

  const summaryData = {
    totalVehicles: 25,
    activeRoutes: 12,
    avgEfficiency: 87,
    totalMiles: 15420,
  };

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <MockAppBar 
        onMenuClick={() => setDrawerOpen(true)} 
        onFilterChange={handleFilterChange}
        filterValue={filterValue}
      />
      <MockDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      
      <Box sx={{ p: 3, ml: drawerOpen ? '250px' : 0, transition: 'margin 0.3s' }}>
        <Typography variant="h4" gutterBottom>
          Analytics Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Comprehensive fleet performance analytics and insights
        </Typography>

        {/* Summary Cards */}
        <FleetSummaryCards data={summaryData} />

        {/* Charts Grid */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
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
    </Box>
  );
};

export default {
  title: 'Capabilities/Analytics',
  component: AnalyticsCapabilityDemo,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <MockAuthProvider>
          <Story />
        </MockAuthProvider>
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export const AnalyticsFlow = {
  render: () => <AnalyticsCapabilityDemo />,
};

export const AnalyticsComponents = {
  render: () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Analytics Capability Components
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        The Analytics capability consists of multiple chart components working together:
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Summary Cards
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Key performance indicators and metrics
              </Typography>
              <FleetSummaryCards data={{ totalVehicles: 25, activeRoutes: 12, avgEfficiency: 87, totalMiles: 15420 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance Charts
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Interactive charts for data visualization
              </Typography>
              <Box sx={{ height: 200 }}>
                <FleetPerformanceChart data={fleetPerformanceData.slice(0, 4)} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Efficiency Analysis
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Bar charts for comparative analysis
              </Typography>
              <Box sx={{ height: 200 }}>
                <FleetEfficiencyChart data={fleetEfficiencyData} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Route Distribution
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Pie charts for route performance breakdown
              </Typography>
              <Box sx={{ height: 200 }}>
                <RoutePerformanceChart data={routePerformanceData} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  ),
};
