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
  ListItemText,
  Avatar,
  Rating
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  DirectionsCar as VehicleIcon,
  TrendingUp as PerformanceIcon,
  CheckCircle as ActiveIcon,
  Warning as WarningIcon,
  Cancel as InactiveIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Star as StarIcon
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

// Driver Status Chip Component
const DriverStatusChip = ({ status }) => {
  let color;
  let label;
  switch (status) {
    case 'active':
      color = 'success';
      label = 'Active';
      break;
    case 'suspended':
      color = 'error';
      label = 'Suspended';
      break;
    case 'training':
      color = 'warning';
      label = 'Training';
      break;
    default:
      color = 'default';
      label = 'Unknown';
  }
  return <Chip label={label} color={color} size="small" />;
};

// Performance Rating Component
const PerformanceRating = ({ value, readOnly = false, onChange }) => (
  <Rating
    value={value}
    readOnly={readOnly}
    onChange={(event, newValue) => onChange && onChange(newValue)}
    precision={0.5}
    icon={<StarIcon fontSize="inherit" />}
  />
);

// Driver Form Dialog Component
const DriverFormDialog = ({ open, onClose, onSave, driver = null }) => {
  const [formData, setFormData] = useState({
    name: driver?.name || '',
    licenseNumber: driver?.licenseNumber || '',
    experience: driver?.experience || '',
    status: driver?.status || 'active'
  });

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{driver ? 'Edit Driver' : 'Add New Driver'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Driver Name"
          type="text"
          fullWidth
          variant="standard"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <TextField
          margin="dense"
          label="License Number"
          type="text"
          fullWidth
          variant="standard"
          value={formData.licenseNumber}
          onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Experience (years)"
          type="number"
          fullWidth
          variant="standard"
          value={formData.experience}
          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
        />
        <FormControl fullWidth margin="dense" variant="standard">
          <InputLabel>Status</InputLabel>
          <Select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            label="Status"
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="suspended">Suspended</MenuItem>
            <MenuItem value="training">Training</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {driver ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Performance Record Form Dialog Component
const PerformanceRecordDialog = ({ open, onClose, onSave, record = null, drivers = [] }) => {
  const [formData, setFormData] = useState({
    driverId: record?.driverId || '',
    metricName: record?.metricName || 'fuel_efficiency',
    metricValue: record?.metricValue || '',
    unit: record?.unit || 'mpg',
    date: record?.date || new Date().toISOString().split('T')[0],
    notes: record?.notes || ''
  });

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{record ? 'Edit Performance Record' : 'Add Performance Record'}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense" variant="standard">
          <InputLabel>Driver</InputLabel>
          <Select
            value={formData.driverId}
            onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
            label="Driver"
          >
            {drivers.map((driver) => (
              <MenuItem key={driver.id} value={driver.id}>
                {driver.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense" variant="standard">
          <InputLabel>Metric Type</InputLabel>
          <Select
            value={formData.metricName}
            onChange={(e) => setFormData({ ...formData, metricName: e.target.value })}
            label="Metric Type"
          >
            <MenuItem value="fuel_efficiency">Fuel Efficiency</MenuItem>
            <MenuItem value="safety_score">Safety Score</MenuItem>
            <MenuItem value="delivery_time">Delivery Time</MenuItem>
            <MenuItem value="customer_rating">Customer Rating</MenuItem>
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          label="Value"
          type="text"
          fullWidth
          variant="standard"
          value={formData.metricValue}
          onChange={(e) => setFormData({ ...formData, metricValue: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Unit"
          type="text"
          fullWidth
          variant="standard"
          value={formData.unit}
          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Date"
          type="date"
          fullWidth
          variant="standard"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          margin="dense"
          label="Notes"
          type="text"
          fullWidth
          variant="standard"
          multiline
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {record ? 'Update' : 'Add'}
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
        Driver Management
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
            <ListItemIcon><PersonIcon /></ListItemIcon>
            <ListItemText primary="Driver Management" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  </Drawer>
);

// Main Driver Management Capability Demo
const DriverManagementCapabilityDemo = () => {
  const [drivers, setDrivers] = useState([
    { id: '1', name: 'John Smith', licenseNumber: 'DL-001', experience: '5', status: 'active' },
    { id: '2', name: 'Sarah Johnson', licenseNumber: 'DL-002', experience: '3', status: 'active' },
    { id: '3', name: 'Mike Wilson', licenseNumber: 'DL-003', experience: '8', status: 'suspended' }
  ]);

  const [performanceMetrics, setPerformanceMetrics] = useState([
    { id: '1', driverId: '1', metricName: 'fuel_efficiency', metricValue: '8.5', unit: 'mpg', date: '2024-01-15', notes: 'Excellent fuel efficiency' },
    { id: '2', driverId: '1', metricName: 'safety_score', metricValue: '9.2', unit: '/10', date: '2024-01-15', notes: 'Outstanding safety record' },
    { id: '3', driverId: '2', metricName: 'fuel_efficiency', metricValue: '7.8', unit: 'mpg', date: '2024-01-14', notes: 'Good performance' }
  ]);

  const [openDriverDialog, setOpenDriverDialog] = useState(false);
  const [openPerformanceDialog, setOpenPerformanceDialog] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [editingPerformance, setEditingPerformance] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleAddDriver = (driverData) => {
    const newDriver = { id: Date.now().toString(), ...driverData };
    setDrivers([...drivers, newDriver]);
  };

  const handleEditDriver = (driverData) => {
    setDrivers(drivers.map(d => d.id === editingDriver.id ? { ...d, ...driverData } : d));
    setEditingDriver(null);
  };

  const handleDeleteDriver = (id) => {
    setDrivers(drivers.filter(d => d.id !== id));
    setPerformanceMetrics(performanceMetrics.filter(p => p.driverId !== id));
  };

  const handleAddPerformanceRecord = (recordData) => {
    const newRecord = { id: Date.now().toString(), ...recordData };
    setPerformanceMetrics([...performanceMetrics, newRecord]);
  };

  const handleEditPerformanceRecord = (recordData) => {
    setPerformanceMetrics(performanceMetrics.map(p => p.id === editingPerformance.id ? { ...p, ...recordData } : p));
    setEditingPerformance(null);
  };

  const handleDeletePerformanceRecord = (id) => {
    setPerformanceMetrics(performanceMetrics.filter(p => p.id !== id));
  };

  const openEditDriver = (driver) => {
    setEditingDriver(driver);
    setOpenDriverDialog(true);
  };

  const openEditPerformance = (record) => {
    setEditingPerformance(record);
    setOpenPerformanceDialog(true);
  };

  const totalDrivers = drivers.length;
  const activeDrivers = drivers.filter(d => d.status === 'active').length;
  const suspendedDrivers = drivers.filter(d => d.status === 'suspended').length;
  const totalRecords = performanceMetrics.length;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <MockAppBar onMenuClick={() => setDrawerOpen(true)} />
      <MockDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      
      <Box sx={{ p: 3, ml: drawerOpen ? '250px' : 0, transition: 'margin 0.3s' }}>
        <Typography variant="h4" gutterBottom>
          Driver Management
        </Typography>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <PersonIcon color="primary" sx={{ mr: 1 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>Total Drivers</Typography>
                    <Typography variant="h5">{totalDrivers}</Typography>
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
                    <Typography color="textSecondary" gutterBottom>Active Drivers</Typography>
                    <Typography variant="h5">{activeDrivers}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <WarningIcon color="error" sx={{ mr: 1 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>Suspended</Typography>
                    <Typography variant="h5">{suspendedDrivers}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <PerformanceIcon color="info" sx={{ mr: 1 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>Performance Records</Typography>
                    <Typography variant="h5">{totalRecords}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Drivers Section */}
        <Box sx={{ mb: 5 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">Drivers</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDriverDialog(true)}>
              Add Driver
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Driver</TableCell>
                  <TableCell>License</TableCell>
                  <TableCell>Experience</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Performance</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {drivers.map((driver) => {
                  const driverRecords = performanceMetrics.filter(p => p.driverId === driver.id);
                  const avgRating = driverRecords.length > 0 ? 
                    driverRecords.reduce((sum, record) => sum + parseFloat(record.metricValue || 0), 0) / driverRecords.length : 0;
                  
                  return (
                    <TableRow key={driver.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                            {driver.name.charAt(0)}
                          </Avatar>
                          {driver.name}
                        </Box>
                      </TableCell>
                      <TableCell>{driver.licenseNumber}</TableCell>
                      <TableCell>{driver.experience} years</TableCell>
                      <TableCell><DriverStatusChip status={driver.status} /></TableCell>
                      <TableCell>
                        <PerformanceRating value={Math.min(avgRating / 2, 5)} readOnly />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton color="primary" onClick={() => openEditDriver(driver)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDeleteDriver(driver.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Performance Records Section */}
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">Performance Records</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenPerformanceDialog(true)}>
              Add Performance Record
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Driver</TableCell>
                  <TableCell>Metric</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {performanceMetrics.map((record) => {
                  const driver = drivers.find(d => d.id === record.driverId);
                  return (
                    <TableRow key={record.id}>
                      <TableCell>{driver?.name || 'Unknown'}</TableCell>
                      <TableCell>{record.metricName.replace('_', ' ')}</TableCell>
                      <TableCell>{record.metricValue} {record.unit}</TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.notes}</TableCell>
                      <TableCell align="right">
                        <IconButton color="primary" onClick={() => openEditPerformance(record)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDeletePerformanceRecord(record.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {/* Dialogs */}
      <DriverFormDialog
        open={openDriverDialog}
        onClose={() => setOpenDriverDialog(false)}
        onSave={editingDriver ? handleEditDriver : handleAddDriver}
        driver={editingDriver}
      />
      <PerformanceRecordDialog
        open={openPerformanceDialog}
        onClose={() => setOpenPerformanceDialog(false)}
        onSave={editingPerformance ? handleEditPerformanceRecord : handleAddPerformanceRecord}
        record={editingPerformance}
        drivers={drivers}
      />
    </Box>
  );
};

export default {
  title: 'Capabilities/DriverManagement',
  component: DriverManagementCapabilityDemo,
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

export const DriverManagementFlow = {
  render: () => <DriverManagementCapabilityDemo />,
};

export const DriverComponents = {
  render: () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Driver Management Capability Components
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        The Driver Management capability consists of multiple components working together:
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Driver Management
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                CRUD operations for drivers with status management
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <DriverStatusChip status="active" />
                <DriverStatusChip status="suspended" />
                <DriverStatusChip status="training" />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>J</Avatar>
                <Typography variant="body2">John Smith - Active</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance Tracking
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Record and track driver performance metrics
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>Performance Rating:</Typography>
                <PerformanceRating value={4.5} readOnly />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Fuel Efficiency: 8.5 mpg
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance Records
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Detailed performance tracking with metrics and notes
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Driver</TableCell>
                      <TableCell>Metric</TableCell>
                      <TableCell>Value</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>John Smith</TableCell>
                      <TableCell>Fuel Efficiency</TableCell>
                      <TableCell>8.5 mpg</TableCell>
                      <TableCell>2024-01-15</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>John Smith</TableCell>
                      <TableCell>Safety Score</TableCell>
                      <TableCell>9.2 /10</TableCell>
                      <TableCell>2024-01-15</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  ),
};
