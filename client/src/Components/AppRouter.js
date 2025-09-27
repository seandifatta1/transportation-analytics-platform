import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import FleetManagement from '../Components/FleetManagement';
import DriverPerformance from '../Components/DriverPerformance';
import AddPerformanceRecord from '../Components/AddPerformanceRecord';
import TransportationCharts from '../Components/TransportationCharts';
import Login from '../Components/Login';
import ProtectedRoute from '../Components/ProtectedRoute';

// Main content router component
const AppRouter = ({ title = "Transportation Analytics Platform" }) => {
  return (
    <Box>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <TransportationCharts />
          </ProtectedRoute>
        } />
        <Route path="/fleet" element={
          <ProtectedRoute>
            <FleetManagement />
          </ProtectedRoute>
        } />
        <Route path="/drivers" element={
          <ProtectedRoute>
            <DriverPerformance />
          </ProtectedRoute>
        } />
        <Route path="/performance" element={
          <ProtectedRoute>
            <AddPerformanceRecord />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Box>
  );
};

export default AppRouter;
