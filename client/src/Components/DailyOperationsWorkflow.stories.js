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
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { 
  DirectionsCar as VehicleIcon, 
  Route as RouteIcon,
  Person as DriverIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  PlayArrow as StartIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Assessment as AnalyticsIcon,
  Notifications as NotificationIcon
} from '@mui/icons-material';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { mockAuthService } from '../mockServices';

// Create a mock AuthProvider that uses mockAuthService
const MockAuthProvider = ({ children }) => {
  const [user, setUser] = useState({ name: 'Fleet Manager', email: 'manager@fleet.com' });
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

// Mock data for daily operations
const mockVehicles = [
  { id: 'V001', name: 'Truck Alpha', status: 'active', driver: 'John Smith', route: 'City Loop', fuel: 85 },
  { id: 'V002', name: 'Van Beta', status: 'maintenance', driver: 'Sarah Johnson', route: 'Suburban', fuel: 0 },
  { id: 'V003', name: 'Truck Gamma', status: 'active', driver: 'Mike Wilson', route: 'Highway Run', fuel: 92 },
  { id: 'V004', name: 'Van Delta', status: 'inactive', driver: null, route: null, fuel: 0 }
];

const mockRoutes = [
  { id: 'R001', name: 'City Loop', status: 'active', vehicles: 2, estimatedTime: '4h 30m', priority: 'high' },
  { id: 'R002', name: 'Suburban', status: 'planned', vehicles: 1, estimatedTime: '3h 15m', priority: 'medium' },
  { id: 'R003', name: 'Highway Run', status: 'active', vehicles: 1, estimatedTime: '6h 45m', priority: 'high' }
];

const mockAlerts = [
  { id: 'A001', type: 'maintenance', message: 'Vehicle V002 requires oil change', priority: 'high', time: '09:30' },
  { id: 'A002', type: 'fuel', message: 'Vehicle V001 fuel level low', priority: 'medium', time: '10:15' },
  { id: 'A003', type: 'route', message: 'Route R002 delayed due to traffic', priority: 'low', time: '11:00' }
];

// Status Chip Component
const StatusChip = ({ status, type = 'vehicle' }) => {
  let color;
  let label;
  
  if (type === 'vehicle') {
    switch (status) {
      case 'active':
        color = 'success';
        label = 'Active';
        break;
      case 'maintenance':
        color = 'warning';
        label = 'Maintenance';
        break;
      case 'inactive':
        color = 'error';
        label = 'Inactive';
        break;
      default:
        color = 'default';
        label = 'Unknown';
    }
  } else if (type === 'route') {
    switch (status) {
      case 'active':
        color = 'success';
        label = 'Active';
        break;
      case 'planned':
        color = 'info';
        label = 'Planned';
        break;
      case 'completed':
        color = 'primary';
        label = 'Completed';
        break;
      default:
        color = 'default';
        label = 'Unknown';
    }
  } else if (type === 'alert') {
    switch (status) {
      case 'high':
        color = 'error';
        label = 'High';
        break;
      case 'medium':
        color = 'warning';
        label = 'Medium';
        break;
      case 'low':
        color = 'info';
        label = 'Low';
        break;
      default:
        color = 'default';
        label = 'Unknown';
    }
  }

  return <Chip label={label} color={color} size="small" />;
};

// Morning Briefing Component
const MorningBriefing = ({ onStartDay }) => {
  const activeVehicles = mockVehicles.filter(v => v.status === 'active').length;
  const plannedRoutes = mockRoutes.filter(r => r.status === 'planned').length;
  const highPriorityAlerts = mockAlerts.filter(a => a.priority === 'high').length;

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Morning Briefing
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Good morning! Here's your fleet status overview for today.
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <VehicleIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">{activeVehicles}</Typography>
              <Typography variant="body2" color="text.secondary">
                Active Vehicles
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <RouteIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">{plannedRoutes}</Typography>
              <Typography variant="body2" color="text.secondary">
                Planned Routes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <WarningIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">{highPriorityAlerts}</Typography>
              <Typography variant="body2" color="text.secondary">
                High Priority Alerts
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {highPriorityAlerts > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          You have {highPriorityAlerts} high priority alert(s) that need attention.
        </Alert>
      )}

      <Button 
        variant="contained" 
        size="large" 
        onClick={onStartDay}
        endIcon={<StartIcon />}
      >
        Start Daily Operations
      </Button>
    </Paper>
  );
};

// Fleet Status Component
const FleetStatus = ({ vehicles, onVehicleAction }) => {
  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Fleet Status
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Current status of all vehicles in your fleet
      </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Vehicle</TableCell>
              <TableCell>Driver</TableCell>
              <TableCell>Route</TableCell>
              <TableCell>Fuel Level</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell>
                  <Box>
                    <Typography variant="subtitle2">{vehicle.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {vehicle.id}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{vehicle.driver || 'Unassigned'}</TableCell>
                <TableCell>{vehicle.route || 'None'}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box 
                      sx={{ 
                        width: 60, 
                        height: 8, 
                        bgcolor: 'grey.200', 
                        borderRadius: 1,
                        mr: 1
                      }}
                    >
                      <Box 
                        sx={{ 
                          width: `${vehicle.fuel}%`, 
                          height: '100%', 
                          bgcolor: vehicle.fuel < 20 ? 'error.main' : vehicle.fuel < 50 ? 'warning.main' : 'success.main',
                          borderRadius: 1
                        }}
                      />
                    </Box>
                    <Typography variant="body2">{vehicle.fuel}%</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <StatusChip status={vehicle.status} type="vehicle" />
                </TableCell>
                <TableCell align="right">
                  <IconButton 
                    size="small" 
                    onClick={() => onVehicleAction(vehicle.id, 'edit')}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

// Route Management Component
const RouteManagement = ({ routes, onRouteAction }) => {
  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Route Management
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage and monitor your delivery routes
      </Typography>

      <Grid container spacing={2}>
        {routes.map((route) => (
          <Grid item xs={12} md={4} key={route.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6">{route.name}</Typography>
                  <StatusChip status={route.status} type="route" />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {route.vehicles} vehicle(s) assigned
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Est. time: {route.estimatedTime}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip 
                    label={route.priority} 
                    color={route.priority === 'high' ? 'error' : route.priority === 'medium' ? 'warning' : 'info'}
                    size="small"
                  />
                  <IconButton 
                    size="small" 
                    onClick={() => onRouteAction(route.id, 'manage')}
                  >
                    <EditIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

// Alerts and Notifications Component
const AlertsPanel = ({ alerts, onAlertAction }) => {
  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Alerts & Notifications
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Current alerts and notifications requiring attention
      </Typography>

      <List>
        {alerts.map((alert) => (
          <ListItem key={alert.id} sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: 1, mb: 1 }}>
            <ListItemIcon>
              {alert.type === 'maintenance' && <WarningIcon color="warning" />}
              {alert.type === 'fuel' && <VehicleIcon color="error" />}
              {alert.type === 'route' && <RouteIcon color="info" />}
            </ListItemIcon>
            <ListItemText
              primary={alert.message}
              secondary={`${alert.time} - Priority: ${alert.priority}`}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StatusChip status={alert.priority} type="alert" />
              <IconButton size="small" onClick={() => onAlertAction(alert.id, 'dismiss')}>
                <CheckIcon />
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>

      {alerts.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CheckIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No alerts at this time
          </Typography>
          <Typography variant="body2" color="text.secondary">
            All systems are running smoothly
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

// End of Day Summary Component
const EndOfDaySummary = ({ onEndDay }) => {
  const completedRoutes = mockRoutes.filter(r => r.status === 'completed').length;
  const totalMiles = 1247;
  const avgEfficiency = 87.3;
  const issuesResolved = 3;

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        End of Day Summary
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Today's operations completed successfully
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <RouteIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">{completedRoutes}</Typography>
              <Typography variant="body2" color="text.secondary">
                Routes Completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <VehicleIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">{totalMiles}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total Miles
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AnalyticsIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">{avgEfficiency}%</Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Efficiency
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">{issuesResolved}</Typography>
              <Typography variant="body2" color="text.secondary">
                Issues Resolved
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Alert severity="success" sx={{ mb: 3 }}>
        Great job! All scheduled operations completed on time with excellent efficiency.
      </Alert>

      <Button 
        variant="contained" 
        size="large" 
        onClick={onEndDay}
        endIcon={<StopIcon />}
      >
        End Day
      </Button>
    </Paper>
  );
};

// Main Daily Operations Workflow Component
const DailyOperationsWorkflowDemo = () => {
  const [currentView, setCurrentView] = useState('briefing');
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [routes, setRoutes] = useState(mockRoutes);
  const [alerts, setAlerts] = useState(mockAlerts);

  const handleStartDay = () => {
    setCurrentView('fleet');
  };

  const handleVehicleAction = (vehicleId, action) => {
    console.log(`Vehicle action: ${action} for ${vehicleId}`);
    // In real app, this would open a dialog or navigate to vehicle details
  };

  const handleRouteAction = (routeId, action) => {
    console.log(`Route action: ${action} for ${routeId}`);
    // In real app, this would open route management interface
  };

  const handleAlertAction = (alertId, action) => {
    if (action === 'dismiss') {
      setAlerts(alerts.filter(alert => alert.id !== alertId));
    }
  };

  const handleEndDay = () => {
    setCurrentView('briefing');
    // Reset data for next day
    setVehicles([...mockVehicles]);
    setRoutes([...mockRoutes]);
    setAlerts([...mockAlerts]);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'briefing':
        return <MorningBriefing onStartDay={handleStartDay} />;
      case 'fleet':
        return (
          <Box>
            <FleetStatus vehicles={vehicles} onVehicleAction={handleVehicleAction} />
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={() => setCurrentView('routes')}
                startIcon={<RouteIcon />}
              >
                Manage Routes
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => setCurrentView('alerts')}
                startIcon={<WarningIcon />}
              >
                View Alerts
              </Button>
              <Button 
                variant="contained" 
                onClick={() => setCurrentView('summary')}
                endIcon={<CheckIcon />}
              >
                End Day
              </Button>
            </Box>
          </Box>
        );
      case 'routes':
        return (
          <Box>
            <RouteManagement routes={routes} onRouteAction={handleRouteAction} />
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={() => setCurrentView('fleet')}
                startIcon={<VehicleIcon />}
              >
                Back to Fleet
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => setCurrentView('alerts')}
                startIcon={<WarningIcon />}
              >
                View Alerts
              </Button>
            </Box>
          </Box>
        );
      case 'alerts':
        return (
          <Box>
            <AlertsPanel alerts={alerts} onAlertAction={handleAlertAction} />
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={() => setCurrentView('fleet')}
                startIcon={<VehicleIcon />}
              >
                Back to Fleet
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => setCurrentView('routes')}
                startIcon={<RouteIcon />}
              >
                Manage Routes
              </Button>
            </Box>
          </Box>
        );
      case 'summary':
        return (
          <Box>
            <EndOfDaySummary onEndDay={handleEndDay} />
          </Box>
        );
      default:
        return <MorningBriefing onStartDay={handleStartDay} />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Daily Operations Workflow
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Complete daily operations management workflow for fleet managers
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip 
          label="Morning Briefing" 
          color={currentView === 'briefing' ? 'primary' : 'default'}
          onClick={() => setCurrentView('briefing')}
        />
        <Chip 
          label="Fleet Status" 
          color={currentView === 'fleet' ? 'primary' : 'default'}
          onClick={() => setCurrentView('fleet')}
        />
        <Chip 
          label="Route Management" 
          color={currentView === 'routes' ? 'primary' : 'default'}
          onClick={() => setCurrentView('routes')}
        />
        <Chip 
          label="Alerts" 
          color={currentView === 'alerts' ? 'primary' : 'default'}
          onClick={() => setCurrentView('alerts')}
        />
        <Chip 
          label="End of Day" 
          color={currentView === 'summary' ? 'primary' : 'default'}
          onClick={() => setCurrentView('summary')}
        />
      </Box>

      {renderCurrentView()}
    </Box>
  );
};

export default {
  title: 'Workflows/DailyOperations',
  component: DailyOperationsWorkflowDemo,
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

export const Default = {
  render: () => <DailyOperationsWorkflowDemo />,
};

export const MorningBriefingStory = {
  render: () => <MorningBriefing onStartDay={() => console.log('Start day clicked')} />,
};

export const FleetStatus = {
  render: () => <FleetStatus vehicles={mockVehicles} onVehicleAction={() => {}} />,
};

export const RouteManagement = {
  render: () => <RouteManagement routes={mockRoutes} onRouteAction={() => {}} />,
};

export const AlertsPanel = {
  render: () => <AlertsPanel alerts={mockAlerts} onAlertAction={() => {}} />,
};
