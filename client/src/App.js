import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { CustomAppBar, CustomDrawer } from './Components/globals';
import DrawerItems from './Components/TransportationListItems';
import FleetManagement from './Components/FleetManagement';
import DriverPerformance from './Components/DriverPerformance';
import AddPerformanceRecord from './Components/AddPerformanceRecord';
import TransportationCharts from './Components/TransportationCharts';
import Login from './Components/Login';
import LogoutButton from './Components/LogoutButton';
import ProtectedRoute from './Components/ProtectedRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Main layout component
const MainLayout = ({ children, title }) => {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <CustomAppBar 
        open={open} 
        handleDrawerOpen={handleDrawerOpen} 
        title={title}
      />
      <CustomDrawer 
        open={open} 
        handleDrawerClose={handleDrawerClose}
      >
        <DrawerItems />
        <Box sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <LogoutButton onLogout={logout} />
        </Box>
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
        {children}
      </Box>
    </Box>
  );
};

// Dashboard component
const Dashboard = () => (
  <Box>
    <TransportationCharts />
  </Box>
);

// Main App component
const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout title="Dashboard">
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/fleet" element={
              <ProtectedRoute>
                <MainLayout title="Fleet Management">
                  <FleetManagement />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/drivers" element={
              <ProtectedRoute>
                <MainLayout title="Driver Performance">
                  <DriverPerformance />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/performance" element={
              <ProtectedRoute>
                <MainLayout title="Add Performance Record">
                  <AddPerformanceRecord />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;