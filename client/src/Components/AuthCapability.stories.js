import React, { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  TextField, 
  Alert,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  Login as LoginIcon, 
  Logout as LogoutIcon,
  Person as PersonIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { mockAuthService } from '../mockServices';

// Create a mock AuthProvider that uses mockAuthService
const MockAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

// Login Form Component
const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await onLogin(email, password);
      if (!result.success) {
        setError(result.message);
      }
    } catch (err) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 400, mx: 'auto' }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <LoginIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Transportation Analytics Platform
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
        />
        
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{ mt: 3, mb: 2 }}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
        Demo credentials: test@example.com / password
      </Typography>
    </Paper>
  );
};

// Logout Button Component
const LogoutButton = ({ onLogout, loading }) => (
  <Button
    variant="outlined"
    startIcon={<LogoutIcon />}
    onClick={onLogout}
    disabled={loading}
    color="error"
    size="small"
  >
    {loading ? 'Signing Out...' : 'Sign Out'}
  </Button>
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <ErrorIcon sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You need to be logged in to access this content.
        </Typography>
      </Box>
    );
  }
  
  return children;
};

// Mock App Bar
const MockAppBar = ({ onLogout, user }) => (
  <AppBar position="static">
    <Toolbar>
      <IconButton edge="start" color="inherit" sx={{ mr: 2 }}>
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Transportation Analytics
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <PersonIcon />
        <Typography variant="body2">
          {user?.name || 'User'}
        </Typography>
        <LogoutButton onLogout={onLogout} />
      </Box>
    </Toolbar>
  </AppBar>
);

// Mock Navigation Drawer
const MockDrawer = () => (
  <Drawer variant="permanent" sx={{ width: 240 }}>
    <Box sx={{ p: 2 }}>
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
      </List>
    </Box>
  </Drawer>
);

// Main Auth Capability Demo
const AuthCapabilityDemo = () => {
  const { user, isAuthenticated, login, logout, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {isAuthenticated ? (
        <Box>
          <MockAppBar onLogout={logout} user={user} />
          <Box sx={{ display: 'flex' }}>
            <MockDrawer />
            <Box sx={{ flexGrow: 1, p: 3 }}>
              <ProtectedRoute>
                <Card>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      Welcome to the Dashboard!
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      You are successfully authenticated and can access protected content.
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Paper sx={{ p: 2, bgcolor: 'success.light', color: 'success.contrastText' }}>
                          <Typography variant="h6">Authentication Status</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <CheckIcon sx={{ mr: 1 }} />
                            <Typography variant="body2">Logged In</Typography>
                          </Box>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper sx={{ p: 2, bgcolor: 'info.light', color: 'info.contrastText' }}>
                          <Typography variant="h6">User Info</Typography>
                          <Typography variant="body2">Name: {user?.name}</Typography>
                          <Typography variant="body2">Email: {user?.email}</Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </ProtectedRoute>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
          <LoginForm onLogin={login} />
        </Box>
      )}
    </Box>
  );
};

export default {
  title: 'Capabilities/Auth',
  component: AuthCapabilityDemo,
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

export const LoginFlow = {
  render: () => <AuthCapabilityDemo />,
};

export const AuthComponents = {
  render: () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Auth Capability Components
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        The Auth capability consists of multiple components working together:
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Login Form
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Handles user authentication with email/password
              </Typography>
              <LoginForm onLogin={() => ({ success: true })} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Logout Button
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Provides logout functionality
              </Typography>
              <LogoutButton onLogout={() => {}} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Protected Route
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Guards routes that require authentication
              </Typography>
              <ProtectedRoute>
                <Paper sx={{ p: 2, bgcolor: 'success.light', color: 'success.contrastText' }}>
                  <Typography>This content is protected!</Typography>
                </Paper>
              </ProtectedRoute>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  ),
};

export const AuthStates = {
  render: () => {
    const [currentState, setCurrentState] = useState('not-authenticated');

    const states = [
      {
        key: 'not-authenticated',
        title: 'Not Authenticated',
        description: 'User needs to log in',
        color: 'error',
        icon: <ErrorIcon />
      },
      {
        key: 'authenticated',
        title: 'Authenticated',
        description: 'User is logged in and can access the app',
        color: 'success',
        icon: <CheckIcon />
      },
      {
        key: 'loading',
        title: 'Loading',
        description: 'Authentication status is being checked',
        color: 'info',
        icon: <CheckIcon />
      }
    ];

    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Authentication States
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          The Auth capability manages different authentication states:
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {states.map((state) => (
            <Grid item xs={12} md={4} key={state.key}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  border: currentState === state.key ? 2 : 1,
                  borderColor: currentState === state.key ? 'primary.main' : 'divider'
                }}
                onClick={() => setCurrentState(state.key)}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ color: `${state.color}.main`, mb: 2 }}>
                    {state.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {state.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {state.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Paper sx={{ p: 3, bgcolor: 'background.paper' }}>
          <Typography variant="h6" gutterBottom>
            Current State: {states.find(s => s.key === currentState)?.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {states.find(s => s.key === currentState)?.description}
          </Typography>
        </Paper>
      </Box>
    );
  },
};
