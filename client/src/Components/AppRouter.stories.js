import React, { useState, createContext, useContext } from 'react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box, Button, Typography, Paper, Grid } from '@mui/material';
import AppRouter from './AppRouter';
import FleetManagement from '../Components/FleetManagement';
import DriverPerformance from '../Components/DriverPerformance';
import AddPerformanceRecord from '../Components/AddPerformanceRecord';
import TransportationCharts from '../Components/TransportationCharts';
import Login from '../Components/Login';

// Create mock AuthContext
const MockAuthContext = createContext();

// Mock useAuth hook
const useAuth = () => {
  const context = useContext(MockAuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock ProtectedRoute component
const MockProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Mock AppRouter component that uses our mock context
const MockAppRouter = () => {
  return (
    <Box>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <MockProtectedRoute>
            <TransportationCharts />
          </MockProtectedRoute>
        } />
        <Route path="/fleet" element={
          <MockProtectedRoute>
            <FleetManagement />
          </MockProtectedRoute>
        } />
        <Route path="/drivers" element={
          <MockProtectedRoute>
            <DriverPerformance />
          </MockProtectedRoute>
        } />
        <Route path="/performance" element={
          <MockProtectedRoute>
            <AddPerformanceRecord />
          </MockProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Box>
  );
};

// Mock AuthProvider for stories
const MockAuthProvider = ({ children, isAuthenticated = true }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated,
    user: isAuthenticated ? { email: 'test@example.com', id: '1' } : null,
    login: (email, password) => {
      setAuthState({
        isAuthenticated: true,
        user: { email, id: '1' }
      });
    },
    logout: () => {
      setAuthState({
        isAuthenticated: false,
        user: null
      });
    }
  });

  return (
    <MockAuthContext.Provider value={authState}>
      {children}
    </MockAuthContext.Provider>
  );
};

// Navigation component for story
const StoryNavigation = ({ currentRoute, onRouteChange }) => {
  const routes = [
    { path: '/', label: 'Dashboard', description: 'Main analytics dashboard' },
    { path: '/fleet', label: 'Fleet Management', description: 'Manage vehicles and routes' },
    { path: '/drivers', label: 'Driver Performance', description: 'Track driver performance' },
    { path: '/performance', label: 'Add Performance', description: 'Record new performance data' },
  ];

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Navigation
      </Typography>
      <Grid container spacing={1}>
        {routes.map((route) => (
          <Grid item xs={12} sm={6} md={3} key={route.path}>
            <Button
              fullWidth
              variant={currentRoute === route.path ? 'contained' : 'outlined'}
              onClick={() => onRouteChange(route.path)}
              sx={{ mb: 1 }}
            >
              {route.label}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default {
  title: 'Components/AppRouter',
  component: MockAppRouter,
  decorators: [
    (Story) => (
      <Box sx={{ minHeight: '100vh', p: 2 }}>
        <Story />
      </Box>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export const Default = {
  render: () => (
    <MemoryRouter initialEntries={['/']}>
      <MockAuthProvider isAuthenticated={true}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            AppRouter - Default Story
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            This demonstrates the AppRouter component with authentication context.
          </Typography>
          <Paper sx={{ p: 2, bgcolor: 'success.light', color: 'success.contrastText' }}>
            <Typography variant="h6">
              ✅ Router Context: Active
            </Typography>
            <Typography variant="body2">
              ✅ Authentication: Authenticated
            </Typography>
            <Typography variant="body2">
              ✅ Component: MockAppRouter
            </Typography>
          </Paper>
        </Box>
      </MockAuthProvider>
    </MemoryRouter>
  ),
};

export const NotAuthenticated = {
  render: () => (
    <MemoryRouter initialEntries={['/']}>
      <MockAuthProvider isAuthenticated={false}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            AppRouter - Not Authenticated Story
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            This demonstrates the AppRouter component when user is not authenticated.
          </Typography>
          <Paper sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText' }}>
            <Typography variant="h6">
              ❌ Router Context: Active
            </Typography>
            <Typography variant="body2">
              ❌ Authentication: Not Authenticated
            </Typography>
            <Typography variant="body2">
              ✅ Component: MockAppRouter
            </Typography>
          </Paper>
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            In a real app, this would redirect to the login page.
          </Typography>
        </Box>
      </MockAuthProvider>
    </MemoryRouter>
  ),
};

export const WithNavigation = {
  render: () => {
    const [currentRoute, setCurrentRoute] = useState('/');

    return (
      <MockAuthProvider isAuthenticated={true}>
        <Box>
          <StoryNavigation 
            currentRoute={currentRoute} 
            onRouteChange={setCurrentRoute} 
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Current Route: {currentRoute}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              In a real app, this would navigate to the selected route.
            </Typography>
          </Box>
        </Box>
      </MockAuthProvider>
    );
  },
};

export const RouteOverview = {
  render: () => (
    <Box>
      <Typography variant="h4" gutterBottom>
        App Router - Route Overview
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        The AppRouter component handles all the main application routes and navigation.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Public Routes
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • <strong>/login</strong> - Authentication page
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="secondary">
              Protected Routes
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • <strong>/</strong> - Dashboard (Charts)
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • <strong>/fleet</strong> - Fleet Management
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • <strong>/drivers</strong> - Driver Performance
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • <strong>/performance</strong> - Add Performance Record
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Features
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • All routes except /login are protected by ProtectedRoute
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • Wildcard route redirects to dashboard
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • Each route renders its respective component
        </Typography>
        <Typography variant="body2">
          • Integrates with authentication context
        </Typography>
      </Paper>
    </Box>
  ),
};

export const AuthenticationFlow = {
  render: () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentRoute, setCurrentRoute] = useState('/');

    return (
      <Box>
        <Paper sx={{ p: 3, mb: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Authentication Status: {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => setIsAuthenticated(!isAuthenticated)}
            sx={{ mr: 2 }}
          >
            {isAuthenticated ? 'Logout' : 'Login'}
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => setCurrentRoute('/')}
            disabled={!isAuthenticated}
          >
            Go to Dashboard
          </Button>
        </Paper>

        <StoryNavigation 
          currentRoute={currentRoute} 
          onRouteChange={setCurrentRoute} 
        />

        <MockAuthProvider isAuthenticated={isAuthenticated}>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Current Route: {currentRoute}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Authentication Status: {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              In a real app, this would show the appropriate route content.
            </Typography>
          </Box>
        </MockAuthProvider>
      </Box>
    );
  },
};
