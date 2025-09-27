import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Box, Button, Typography, Paper } from '@mui/material';

// Create a mock AuthContext
const MockAuthContext = createContext();

// Mock useAuth hook
const useAuth = () => {
  const context = useContext(MockAuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock AuthProvider
const AuthProvider = ({ children, value }) => {
  return (
    <MockAuthContext.Provider value={value}>
      {children}
    </MockAuthContext.Provider>
  );
};

// Simple ProtectedRoute component that uses our mock
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <div>Redirecting to login...</div>;
};

// Protected content component
const ProtectedContent = () => (
  <Paper sx={{ p: 3, textAlign: 'center' }}>
    <Typography variant="h5" color="success.main">
      🔒 Protected Content
    </Typography>
    <Typography variant="body1" sx={{ mt: 2 }}>
      This content is only visible to authenticated users!
    </Typography>
  </Paper>
);

export default {
  title: 'Components/ProtectedRoute',
  component: ProtectedRoute,
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

export const Authenticated = {
  render: () => (
    <AuthProvider value={{ isAuthenticated: true, user: { id: '1', name: 'John' } }}>
      <ProtectedRoute>
        <ProtectedContent />
      </ProtectedRoute>
    </AuthProvider>
  ),
};

export const NotAuthenticated = {
  render: () => (
    <AuthProvider value={{ isAuthenticated: false, user: null }}>
      <ProtectedRoute>
        <ProtectedContent />
      </ProtectedRoute>
    </AuthProvider>
  ),
};

export const InteractiveToggle = {
  render: () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    const mockAuthContext = {
      isAuthenticated,
      user: isAuthenticated ? { id: '1', name: 'John' } : null,
      login: () => setIsAuthenticated(true),
      logout: () => setIsAuthenticated(false)
    };

    return (
      <AuthProvider value={mockAuthContext}>
        <Box>
          <Button 
            onClick={() => setIsAuthenticated(!isAuthenticated)}
            variant="contained"
            color={isAuthenticated ? "error" : "success"}
            sx={{ mb: 2 }}
          >
            {isAuthenticated ? 'Logout' : 'Login'}
          </Button>
          
          <Typography variant="body2" sx={{ mb: 2 }}>
            Current state: {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
          </Typography>
          
          <ProtectedRoute>
            <ProtectedContent />
          </ProtectedRoute>
        </Box>
      </AuthProvider>
    );
  },
};

export const WithDifferentChildren = {
  render: () => (
    <AuthProvider value={{ isAuthenticated: true, user: { id: '1', name: 'John' } }}>
      <ProtectedRoute>
        <Box sx={{ p: 2, border: '2px dashed #1976d2', borderRadius: 1 }}>
          <Typography variant="h6" color="primary">
            Custom Protected Content
          </Typography>
          <Typography variant="body2">
            This could be any component that needs protection!
          </Typography>
        </Box>
      </ProtectedRoute>
    </AuthProvider>
  ),
};