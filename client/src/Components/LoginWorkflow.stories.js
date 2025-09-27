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
  Divider
} from '@mui/material';
import { 
  Login as LoginIcon, 
  Logout as LogoutIcon,
  Person as PersonIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { mockAuthService } from '../mockServices';

// Mock the authService for stories
jest.mock('../services/authService', () => mockAuthService);

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

// User Dashboard Component
const UserDashboard = ({ user, onLogout }) => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await onLogout();
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PersonIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
          <Box>
            <Typography variant="h5">
              Welcome, {user?.name || 'User'}!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Authentication Status
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CheckIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="body2">Authenticated</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CheckIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="body2">Session Valid</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="body2">Token Active</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  User Information
                </Typography>
                <Box sx={{ mb: 1 }}>
                  <Chip label={`ID: ${user?.id}`} size="small" sx={{ mr: 1 }} />
                  <Chip label="Active User" color="success" size="small" />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Email: {user?.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Name: {user?.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            disabled={loading}
            color="error"
          >
            {loading ? 'Signing Out...' : 'Sign Out'}
          </Button>
        </Box>
      </Paper>

      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
        This demonstrates the complete authentication workflow using DI with authService
      </Typography>
    </Box>
  );
};

// Main Auth Workflow Component
const LoginWorkflowDemo = () => {
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
        <UserDashboard user={user} onLogout={logout} />
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
          <LoginForm onLogin={login} />
        </Box>
      )}
    </Box>
  );
};

export default {
  title: 'Workflows/Login',
  component: LoginWorkflowDemo,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <AuthProvider>
          <Story />
        </AuthProvider>
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export const LoginWorkflow = {
  render: () => (
    <AuthWorkflowDemo />
  ),
};

export const AuthenticationStates = {
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
          The authentication workflow has three main states:
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

export const ServiceIntegration = {
  render: () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        AuthService Integration
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        This demonstrates how the authentication workflow uses Dependency Injection with authService:
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Real AuthService
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Used in production app:
              </Typography>
              <Box component="pre" sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, fontSize: '0.8rem' }}>
{`// Real implementation
import authService from '../services/authService';

const { login, logout, user } = useAuth();
// Uses real API calls`}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Mock AuthService
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Used in Storybook:
              </Typography>
              <Box component="pre" sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, fontSize: '0.8rem' }}>
{`// Mock implementation
import { mockAuthService } from '../mockServices';

// Same interface, mock behavior
// Simulates API delays and responses`}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mt: 3, bgcolor: 'success.light', color: 'success.contrastText' }}>
        <Typography variant="h6" gutterBottom>
          ✅ Dependency Injection Benefits
        </Typography>
        <Typography variant="body2">
          • Same component code works in both real app and Storybook<br/>
          • Easy to test different scenarios<br/>
          • Clean separation of concerns<br/>
          • No hardcoded dependencies
        </Typography>
      </Paper>
    </Box>
  ),
};
