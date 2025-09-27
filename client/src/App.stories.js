import React, { useState, createContext, useContext } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Box, Button, Typography, Paper } from '@mui/material';
import App from './App';

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

// Mock AuthContext for stories
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

// Mock components for stories
const MockFleetManagement = () => (
  <Paper sx={{ p: 3, textAlign: 'center' }}>
    <Typography variant="h5" gutterBottom>
      Fleet Management
    </Typography>
    <Typography variant="body1">
      This is the Fleet Management page with vehicle and route management.
    </Typography>
  </Paper>
);

const MockDriverPerformance = () => (
  <Paper sx={{ p: 3, textAlign: 'center' }}>
    <Typography variant="h5" gutterBottom>
      Driver Performance
    </Typography>
    <Typography variant="body1">
      This is the Driver Performance page with driver management and performance tracking.
    </Typography>
  </Paper>
);

const MockAddPerformanceRecord = () => (
  <Paper sx={{ p: 3, textAlign: 'center' }}>
    <Typography variant="h5" gutterBottom>
      Add Performance Record
    </Typography>
    <Typography variant="body1">
      This is the Add Performance Record page for recording new performance data.
    </Typography>
  </Paper>
);

const MockTransportationCharts = () => (
  <Paper sx={{ p: 3, textAlign: 'center' }}>
    <Typography variant="h5" gutterBottom>
      Dashboard Charts
    </Typography>
    <Typography variant="body1">
      This is the main dashboard with transportation analytics charts.
    </Typography>
  </Paper>
);

const MockLogin = () => (
  <Paper sx={{ p: 3, textAlign: 'center', maxWidth: 400, margin: '50px auto' }}>
    <Typography variant="h5" gutterBottom>
      Login
    </Typography>
    <Typography variant="body1">
      This is the login page for authentication.
    </Typography>
  </Paper>
);

export default {
  title: 'App/Full Application',
  component: App,
  decorators: [
    (Story) => (
      <Box sx={{ height: '100vh', width: '100vw' }}>
        <Story />
      </Box>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export const AuthenticatedApp = {
  render: () => (
    <MockAuthProvider isAuthenticated={true}>
      <App />
    </MockAuthProvider>
  ),
};

export const NotAuthenticatedApp = {
  render: () => (
    <MockAuthProvider isAuthenticated={false}>
      <App />
    </MockAuthProvider>
  ),
};

export const AppWithNavigation = {
  render: () => {
    const [currentRoute, setCurrentRoute] = useState('/');
    
    const routes = [
      { path: '/', label: 'Dashboard', component: MockTransportationCharts },
      { path: '/fleet', label: 'Fleet Management', component: MockFleetManagement },
      { path: '/drivers', label: 'Driver Performance', component: MockDriverPerformance },
      { path: '/performance', label: 'Add Performance', component: MockAddPerformanceRecord },
    ];

    const CurrentComponent = routes.find(r => r.path === currentRoute)?.component || MockTransportationCharts;

    return (
      <MockAuthProvider isAuthenticated={true}>
        <Box sx={{ height: '100vh', display: 'flex' }}>
          {/* Mock Navigation */}
          <Box sx={{ width: 240, bgcolor: 'background.paper', p: 2, borderRight: '1px solid #eee' }}>
            <Typography variant="h6" gutterBottom>
              Navigation
            </Typography>
            {routes.map((route) => (
              <Button
                key={route.path}
                fullWidth
                variant={currentRoute === route.path ? 'contained' : 'text'}
                onClick={() => setCurrentRoute(route.path)}
                sx={{ mb: 1, justifyContent: 'flex-start' }}
              >
                {route.label}
              </Button>
            ))}
          </Box>
          
          {/* Main Content */}
          <Box sx={{ flexGrow: 1, p: 3 }}>
            <CurrentComponent />
          </Box>
        </Box>
      </MockAuthProvider>
    );
  },
};

export const AppLayoutDemo = {
  render: () => (
    <MockAuthProvider isAuthenticated={true}>
      <Box sx={{ height: '100vh', display: 'flex' }}>
        {/* Mock App Bar */}
        <Box sx={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          height: 64, 
          bgcolor: 'primary.main', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          px: 3,
          zIndex: 1000
        }}>
          <Typography variant="h6">
            Transportation Analytics Platform
          </Typography>
        </Box>

        {/* Mock Drawer */}
        <Box sx={{ 
          width: 240, 
          bgcolor: 'background.paper', 
          p: 2, 
          borderRight: '1px solid #eee',
          mt: 8
        }}>
          <Typography variant="h6" gutterBottom>
            Navigation
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fleet Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Driver Performance
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add Performance
            </Typography>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ 
          flexGrow: 1, 
          p: 3, 
          mt: 8,
          marginLeft: '240px'
        }}>
          <MockTransportationCharts />
        </Box>
      </Box>
    </MockAuthProvider>
  ),
};

export const LoginFlow = {
  render: () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
      <MockAuthProvider isAuthenticated={isAuthenticated}>
        <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
            <Typography variant="h5" gutterBottom>
              {isAuthenticated ? 'Welcome to the App!' : 'Please Login'}
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {isAuthenticated 
                ? 'You are now authenticated and can access the full application.' 
                : 'Click the button below to simulate login.'
              }
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => setIsAuthenticated(!isAuthenticated)}
              sx={{ mb: 2 }}
            >
              {isAuthenticated ? 'Logout' : 'Login'}
            </Button>
            {isAuthenticated && (
              <Typography variant="body2" color="text.secondary">
                In the real app, you would now see the full dashboard with navigation.
              </Typography>
            )}
          </Paper>
        </Box>
      </MockAuthProvider>
    );
  },
};
