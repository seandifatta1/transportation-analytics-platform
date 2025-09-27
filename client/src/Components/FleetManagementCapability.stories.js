import React, { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  TextField, 
  Card,
  CardContent,
  Grid,
  Chip,
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
  MenuItem,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DirectionsCar as VehicleIcon,
  Route as RouteIcon,
  CheckCircle as ActiveIcon,
  Build as MaintenanceIcon,
  Cancel as InactiveIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon
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

// Vehicle Status Chip Component
const VehicleStatusChip = ({ status }) => {
  let color;
  let label;
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
  return <Chip label={label} color={color} size="small" />;
};

// Route Status Chip Component
const RouteStatusChip = ({ status }) => {
  let color;
  let label;
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
  return <Chip label={label} color={color} size="small" />;
};

// Vehicle Form Dialog Component
const VehicleFormDialog = ({ open, onClose, onSave, vehicle = null }) => {
  const [formData, setFormData] = useState({
    type: vehicle?.type || '',
    capacity: vehicle?.capacity || '',
    status: vehicle?.status || 'active'
  });

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Vehicle Type"
          type="text"
          fullWidth
          variant="standard"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Capacity"
          type="text"
          fullWidth
          variant="standard"
          value={formData.capacity}
          onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
        />
        <FormControl fullWidth margin="dense" variant="standard">
          <InputLabel>Status</InputLabel>
          <Select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            label="Status"
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="maintenance">Maintenance</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {vehicle ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Route Form Dialog Component
const RouteFormDialog = ({ open, onClose, onSave, route = null }) => {
  const [formData, setFormData] = useState({
    name: route?.name || '',
    description: route?.description || '',
    status: route?.status || 'active'
  });

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{route ? 'Edit Route' : 'Add New Route'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Route Name"
          type="text"
          fullWidth
          variant="standard"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Description"
          type="text"
          fullWidth
          variant="standard"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <FormControl fullWidth margin="dense" variant="standard">
          <InputLabel>Status</InputLabel>
          <Select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            label="Status"
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="planned">Planned</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {route ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Mock App Bar
const MockAppBar = ({ onMenuClick }) => (
  <AppBar position="static">
    <Toolbar>
      <IconButton edge="start" color="inherit" onClick={onMenuClick} sx={{ mr: 2 }}>
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Fleet Management
      </Typography>
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
            <ListItemIcon><VehicleIcon /></ListItemIcon>
            <ListItemText primary="Fleet Management" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  </Drawer>
);

// Main Fleet Management Capability Demo
const FleetManagementCapabilityDemo = () => {
  const [vehicles, setVehicles] = useState([
    { id: 'v1', type: 'Truck', capacity: '10T', status: 'active' },
    { id: 'v2', type: 'Van', capacity: '2T', status: 'maintenance' },
    { id: 'v3', type: 'Car', capacity: '0.5T', status: 'active' },
  ]);

  const [routes, setRoutes] = useState([
    { id: 'r1', name: 'City Loop', description: 'Daily city deliveries', status: 'active' },
    { id: 'r2', name: 'Highway Run', description: 'Long haul to warehouse', status: 'planned' },
  ]);

  const [openVehicleDialog, setOpenVehicleDialog] = useState(false);
  const [openRouteDialog, setOpenRouteDialog] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [editingRoute, setEditingRoute] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleAddVehicle = (vehicleData) => {
    const newVehicle = { id: `v${Date.now()}`, ...vehicleData };
    setVehicles([...vehicles, newVehicle]);
  };

  const handleEditVehicle = (vehicleData) => {
    setVehicles(vehicles.map(v => v.id === editingVehicle.id ? { ...v, ...vehicleData } : v));
    setEditingVehicle(null);
  };

  const handleDeleteVehicle = (id) => {
    setVehicles(vehicles.filter(v => v.id !== id));
  };

  const handleAddRoute = (routeData) => {
    const newRoute = { id: `r${Date.now()}`, ...routeData };
    setRoutes([...routes, newRoute]);
  };

  const handleEditRoute = (routeData) => {
    setRoutes(routes.map(r => r.id === editingRoute.id ? { ...r, ...routeData } : r));
    setEditingRoute(null);
  };

  const handleDeleteRoute = (id) => {
    setRoutes(routes.filter(r => r.id !== id));
  };

  const openEditVehicle = (vehicle) => {
    setEditingVehicle(vehicle);
    setOpenVehicleDialog(true);
  };

  const openEditRoute = (route) => {
    setEditingRoute(route);
    setOpenRouteDialog(true);
  };

  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter(v => v.status === 'active').length;
  const vehiclesInMaintenance = vehicles.filter(v => v.status === 'maintenance').length;
  const totalRoutes = routes.length;
  const activeRoutes = routes.filter(r => r.status === 'active').length;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <MockAppBar onMenuClick={() => setDrawerOpen(true)} />
      <MockDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      
      <Box sx={{ p: 3, ml: drawerOpen ? '250px' : 0, transition: 'margin 0.3s' }}>
        <Typography variant="h4" gutterBottom>
          Fleet Management
        </Typography>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <VehicleIcon color="primary" sx={{ mr: 1 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>Total Vehicles</Typography>
                    <Typography variant="h5">{totalVehicles}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <ActiveIcon color="success" sx={{ mr: 1 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>Active Vehicles</Typography>
                    <Typography variant="h5">{activeVehicles}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <MaintenanceIcon color="warning" sx={{ mr: 1 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>In Maintenance</Typography>
                    <Typography variant="h5">{vehiclesInMaintenance}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <RouteIcon color="info" sx={{ mr: 1 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>Total Routes</Typography>
                    <Typography variant="h5">{totalRoutes}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Vehicles Section */}
        <Box sx={{ mb: 5 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">Vehicles</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenVehicleDialog(true)}>
              Add Vehicle
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Capacity</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>{vehicle.id}</TableCell>
                    <TableCell>{vehicle.type}</TableCell>
                    <TableCell>{vehicle.capacity}</TableCell>
                    <TableCell><VehicleStatusChip status={vehicle.status} /></TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => openEditVehicle(vehicle)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteVehicle(vehicle.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Routes Section */}
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">Routes</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenRouteDialog(true)}>
              Add Route
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {routes.map((route) => (
                  <TableRow key={route.id}>
                    <TableCell>{route.id}</TableCell>
                    <TableCell>{route.name}</TableCell>
                    <TableCell>{route.description}</TableCell>
                    <TableCell><RouteStatusChip status={route.status} /></TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => openEditRoute(route)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteRoute(route.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {/* Dialogs */}
      <VehicleFormDialog
        open={openVehicleDialog}
        onClose={() => setOpenVehicleDialog(false)}
        onSave={editingVehicle ? handleEditVehicle : handleAddVehicle}
        vehicle={editingVehicle}
      />
      <RouteFormDialog
        open={openRouteDialog}
        onClose={() => setOpenRouteDialog(false)}
        onSave={editingRoute ? handleEditRoute : handleAddRoute}
        route={editingRoute}
      />
    </Box>
  );
};

export default {
  title: 'Capabilities/FleetManagement',
  component: FleetManagementCapabilityDemo,
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

export const FleetManagementFlow = {
  render: () => <FleetManagementCapabilityDemo />,
};

export const FleetComponents = {
  render: () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Fleet Management Capability Components
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        The Fleet Management capability consists of multiple components working together:
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Vehicle Management
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                CRUD operations for vehicles with status management
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <VehicleStatusChip status="active" />
                <VehicleStatusChip status="maintenance" />
                <VehicleStatusChip status="inactive" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Route Management
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                CRUD operations for delivery routes
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <RouteStatusChip status="active" />
                <RouteStatusChip status="planned" />
                <RouteStatusChip status="completed" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Summary Dashboard
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Real-time metrics and status overview
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">25</Typography>
                    <Typography variant="body2">Total Vehicles</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="success">20</Typography>
                    <Typography variant="body2">Active</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="warning">3</Typography>
                    <Typography variant="body2">Maintenance</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="info">12</Typography>
                    <Typography variant="body2">Routes</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  ),
};
