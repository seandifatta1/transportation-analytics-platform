import React, { useState } from 'react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
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
  Divider,
  Chip,
  Button
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  DirectionsCar as VehicleIcon,
  Person as PersonIcon,
  Assessment as AnalyticsIcon,
  Add as AddIcon,
  Logout as LogoutIcon
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

// Custom App Bar Component
const CustomAppBar = ({ open, handleDrawerOpen, title }) => {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        transition: (theme) =>
          theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        ...(open && {
          marginLeft: 240,
          width: `calc(100% - 240px)`,
          transition: (theme) =>
            theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
        }),
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{
            marginRight: 5,
            ...(open && { display: 'none' }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          {title || 'Transportation Analytics Platform'}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

// Custom Drawer Component
const CustomDrawer = ({ open, handleDrawerClose, children }) => {
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: 1,
          justifyContent: 'flex-end',
        }}
      >
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>
      <Divider />
      {children}
    </Drawer>
  );
};

// Navigation Items Component
const NavigationItems = () => {
  const [selectedItem, setSelectedItem] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { id: 'fleet', label: 'Fleet Management', icon: <VehicleIcon />, path: '/fleet' },
    { id: 'drivers', label: 'Driver Performance', icon: <PersonIcon />, path: '/drivers' },
    { id: 'analytics', label: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
    { id: 'performance', label: 'Add Performance', icon: <AddIcon />, path: '/performance' },
  ];

  return (
    <List>
      {menuItems.map((item) => (
        <ListItem key={item.id} disablePadding>
          <ListItemButton
            selected={selectedItem === item.id}
            onClick={() => setSelectedItem(item.id)}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
                '&:hover': {
                  backgroundColor: 'primary.main',
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: selectedItem === item.id ? 'primary.contrastText' : 'inherit',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

// Logout Button Component
const LogoutButton = ({ onLogout }) => (
  <Button
    variant="outlined"
    startIcon={<LogoutIcon />}
    onClick={onLogout}
    color="error"
    size="small"
    sx={{ m: 2 }}
  >
    Sign Out
  </Button>
);

// Mock Page Components
const DashboardPage = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>
      Dashboard
    </Typography>
    <Typography variant="body1">
      Welcome to the Transportation Analytics Dashboard. This is the main overview page.
    </Typography>
    <Grid container spacing={2} sx={{ mt: 2 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Total Vehicles</Typography>
            <Typography variant="h4" color="primary">25</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Active Routes</Typography>
            <Typography variant="h4" color="success">12</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

const FleetPage = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>
      Fleet Management
    </Typography>
    <Typography variant="body1">
      Manage your fleet vehicles and routes from this page.
    </Typography>
  </Box>
);

const DriversPage = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>
      Driver Performance
    </Typography>
    <Typography variant="body1">
      Track and manage driver performance metrics.
    </Typography>
  </Box>
);

const AnalyticsPage = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>
      Analytics
    </Typography>
    <Typography variant="body1">
      View comprehensive analytics and reports.
    </Typography>
  </Box>
);

const PerformancePage = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>
      Add Performance Record
    </Typography>
    <Typography variant="body1">
      Add new performance records and metrics.
    </Typography>
  </Box>
);

// Main Navigation Capability Demo
const NavigationCapabilityDemo = () => {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'fleet':
        return <FleetPage />;
      case 'drivers':
        return <DriversPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'performance':
        return <PerformancePage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CustomAppBar 
        open={open} 
        handleDrawerOpen={handleDrawerOpen} 
        title="Transportation Analytics"
      />
      <CustomDrawer 
        open={open} 
        handleDrawerClose={handleDrawerClose}
      >
        <NavigationItems />
        <Divider />
        <LogoutButton onLogout={handleLogout} />
      </CustomDrawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          transition: 'margin 0.3s',
          marginLeft: open ? '240px' : 0
        }}
      >
        {renderPage()}
      </Box>
    </Box>
  );
};

export default {
  title: 'Capabilities/Navigation',
  component: NavigationCapabilityDemo,
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

export const NavigationFlow = {
  render: () => <NavigationCapabilityDemo />,
};

export const NavigationComponents = {
  render: () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Navigation Capability Components
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        The Navigation capability consists of multiple components working together:
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                App Bar
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Top navigation bar with menu toggle and title
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <MenuIcon sx={{ mr: 2 }} />
                  <Typography variant="h6">Transportation Analytics</Typography>
                </Box>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Drawer Navigation
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Side navigation drawer with menu items
              </Typography>
              <Paper sx={{ p: 2, width: 200 }}>
                <List dense>
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemIcon><DashboardIcon /></ListItemIcon>
                      <ListItemText primary="Dashboard" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemIcon><VehicleIcon /></ListItemIcon>
                      <ListItemText primary="Fleet" />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Navigation Items
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Interactive menu items with icons and selection states
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip icon={<DashboardIcon />} label="Dashboard" color="primary" />
                <Chip icon={<VehicleIcon />} label="Fleet" />
                <Chip icon={<PersonIcon />} label="Drivers" />
                <Chip icon={<AnalyticsIcon />} label="Analytics" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Page Routing
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Dynamic page rendering based on navigation selection
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
                <Typography variant="body2">
                  Current Page: <strong>Dashboard</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Content changes based on selected navigation item
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  ),
};

export const ResponsiveNavigation = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);

    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Responsive Navigation
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          The navigation adapts to different screen sizes:
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Desktop Navigation
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Persistent drawer with full navigation
                </Typography>
                <Button 
                  variant="outlined" 
                  onClick={() => setIsMobile(false)}
                  sx={{ mr: 1 }}
                >
                  Desktop View
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Mobile Navigation
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Overlay drawer with hamburger menu
                </Typography>
                <Button 
                  variant="outlined" 
                  onClick={() => setIsMobile(true)}
                >
                  Mobile View
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ p: 2, bgcolor: 'info.light', color: 'info.contrastText' }}>
          <Typography variant="h6" gutterBottom>
            Current View: {isMobile ? 'Mobile' : 'Desktop'}
          </Typography>
          <Typography variant="body2">
            {isMobile 
              ? 'Drawer appears as overlay with hamburger menu toggle'
              : 'Drawer is persistent and can be collapsed/expanded'
            }
          </Typography>
        </Paper>
      </Box>
    );
  },
};
