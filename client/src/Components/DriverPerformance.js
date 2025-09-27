import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Safety as SafetyIcon,
  Speed as SpeedIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import Rating from '@mui/material/Rating';

const DriverPerformance = ({ 
  drivers = [], 
  performanceMetrics = [],
  onAddDriver, 
  onEditDriver, 
  onDeleteDriver,
  onAddPerformanceRecord,
  onEditPerformanceRecord,
  onDeletePerformanceRecord,
  isLoading = false 
}) => {
  const [openDriverDialog, setOpenDriverDialog] = useState(false);
  const [openPerformanceDialog, setOpenPerformanceDialog] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [editingPerformance, setEditingPerformance] = useState(null);
  const [driverForm, setDriverForm] = useState({
    name: '',
    licenseNumber: '',
    experience: '',
    status: 'active'
  });
  const [performanceForm, setPerformanceForm] = useState({
    driverId: '',
    metricName: '',
    metricValue: '',
    unit: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const handleDriverSubmit = () => {
    if (editingDriver) {
      onEditDriver?.(editingDriver.id, driverForm);
    } else {
      onAddDriver?.(driverForm);
    }
    setOpenDriverDialog(false);
    setEditingDriver(null);
    setDriverForm({ name: '', licenseNumber: '', experience: '', status: 'active' });
  };

  const handlePerformanceSubmit = () => {
    if (editingPerformance) {
      onEditPerformanceRecord?.(editingPerformance.id, performanceForm);
    } else {
      onAddPerformanceRecord?.(performanceForm);
    }
    setOpenPerformanceDialog(false);
    setEditingPerformance(null);
    setPerformanceForm({ 
      driverId: '', 
      metricName: '', 
      metricValue: '', 
      unit: '', 
      date: new Date().toISOString().split('T')[0], 
      notes: '' 
    });
  };

  const handleEditDriver = (driver) => {
    setEditingDriver(driver);
    setDriverForm(driver);
    setOpenDriverDialog(true);
  };

  const handleEditPerformance = (performance) => {
    setEditingPerformance(performance);
    setPerformanceForm(performance);
    setOpenPerformanceDialog(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'suspended': return 'warning';
      case 'inactive': return 'error';
      default: return 'default';
    }
  };

  const getPerformanceRating = (driverId) => {
    const driverMetrics = performanceMetrics.filter(p => p.driverId === driverId);
    if (driverMetrics.length === 0) return 0;
    
    const avgScore = driverMetrics.reduce((sum, metric) => {
      const value = parseFloat(metric.metricValue) || 0;
      return sum + (value / 10);
    }, 0) / driverMetrics.length;
    
    return Math.min(5, Math.max(0, avgScore));
  };

  const getSafetyLevel = (driverId) => {
    const driverMetrics = performanceMetrics.filter(p => 
      p.metricName.toLowerCase().includes('safety') || 
      p.metricName.toLowerCase().includes('incident')
    );
    
    if (driverMetrics.length === 0) return 'good';
    
    const avgSafety = driverMetrics.reduce((sum, metric) => {
      return sum + (parseFloat(metric.metricValue) || 0);
    }, 0) / driverMetrics.length;
    
    if (avgSafety >= 8) return 'excellent';
    if (avgSafety >= 6) return 'good';
    if (avgSafety >= 4) return 'fair';
    return 'poor';
  };

  const getSafetyIcon = (level) => {
    switch (level) {
      case 'excellent': return <CheckCircleIcon color="success" />;
      case 'good': return <SafetyIcon color="info" />;
      case 'fair': return <WarningIcon color="warning" />;
      case 'poor': return <WarningIcon color="error" />;
      default: return <SafetyIcon />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Driver Performance Tracking
      </Typography>
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon color="primary" sx={{ mr: 1 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Drivers
                  </Typography>
                  <Typography variant="h4">
                    {drivers.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SafetyIcon color="success" sx={{ mr: 1 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Active Drivers
                  </Typography>
                  <Typography variant="h4">
                    {drivers.filter(d => d.status === 'active').length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon color="info" sx={{ mr: 1 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Performance Records
                  </Typography>
                  <Typography variant="h4">
                    {performanceMetrics.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SpeedIcon color="warning" sx={{ mr: 1 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Avg Performance
                  </Typography>
                  <Typography variant="h4">
                    {drivers.length > 0 ? 
                      (drivers.reduce((sum, driver) => sum + getPerformanceRating(driver.id), 0) / drivers.length).toFixed(1) 
                      : '0.0'
                    }
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Drivers Table */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Drivers
                </Typography>
                <Button
                  startIcon={<AddIcon />}
                  variant="contained"
                  onClick={() => setOpenDriverDialog(true)}
                >
                  Add Driver
                </Button>
              </Box>
              <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Driver</TableCell>
                      <TableCell>Performance</TableCell>
                      <TableCell>Safety</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {drivers.map((driver) => {
                      const performanceRating = getPerformanceRating(driver.id);
                      const safetyLevel = getSafetyLevel(driver.id);
                      
                      return (
                        <TableRow key={driver.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ mr: 1, bgcolor: 'primary.main' }}>
                                {driver.name.charAt(0).toUpperCase()}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight="bold">
                                  {driver.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {driver.licenseNumber}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Rating value={performanceRating} readOnly size="small" />
                              <Typography variant="caption" sx={{ ml: 1 }}>
                                {performanceRating.toFixed(1)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {getSafetyIcon(safetyLevel)}
                              <Typography variant="caption" sx={{ ml: 1 }}>
                                {safetyLevel}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={driver.status} 
                              size="small" 
                              color={getStatusColor(driver.status)}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton 
                              size="small" 
                              onClick={() => handleEditDriver(driver)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={() => onDeleteDriver?.(driver.id)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Records Table */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Performance Records
                </Typography>
                <Button
                  startIcon={<AddIcon />}
                  variant="contained"
                  onClick={() => setOpenPerformanceDialog(true)}
                >
                  Add Record
                </Button>
              </Box>
              <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Driver</TableCell>
                      <TableCell>Metric</TableCell>
                      <TableCell>Value</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {performanceMetrics.map((record) => {
                      const driver = drivers.find(d => d.id === record.driverId);
                      return (
                        <TableRow key={record.id}>
                          <TableCell>
                            <Typography variant="body2">
                              {driver?.name || 'Unknown Driver'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={record.metricName} 
                              size="small" 
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {record.metricValue} {record.unit}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption">
                              {new Date(record.date).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <IconButton 
                              size="small" 
                              onClick={() => handleEditPerformance(record)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={() => onDeletePerformanceRecord?.(record.id)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Driver Dialog */}
      <Dialog open={openDriverDialog} onClose={() => setOpenDriverDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingDriver ? 'Edit Driver' : 'Add Driver'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Driver Name"
            value={driverForm.name}
            onChange={(e) => setDriverForm({...driverForm, name: e.target.value})}
            margin="normal"
          />
          <TextField
            fullWidth
            label="License Number"
            value={driverForm.licenseNumber}
            onChange={(e) => setDriverForm({...driverForm, licenseNumber: e.target.value})}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Experience (years)"
            type="number"
            value={driverForm.experience}
            onChange={(e) => setDriverForm({...driverForm, experience: e.target.value})}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={driverForm.status}
              onChange={(e) => setDriverForm({...driverForm, status: e.target.value})}
              label="Status"
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="suspended">Suspended</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDriverDialog(false)}>Cancel</Button>
          <Button onClick={handleDriverSubmit} variant="contained">
            {editingDriver ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Performance Record Dialog */}
      <Dialog open={openPerformanceDialog} onClose={() => setOpenPerformanceDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingPerformance ? 'Edit Performance Record' : 'Add Performance Record'}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Driver</InputLabel>
            <Select
              value={performanceForm.driverId}
              onChange={(e) => setPerformanceForm({...performanceForm, driverId: e.target.value})}
              label="Driver"
            >
              {drivers.map((driver) => (
                <MenuItem key={driver.id} value={driver.id}>
                  {driver.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Metric Name</InputLabel>
            <Select
              value={performanceForm.metricName}
              onChange={(e) => setPerformanceForm({...performanceForm, metricName: e.target.value})}
              label="Metric Name"
            >
              <MenuItem value="fuel_efficiency">Fuel Efficiency</MenuItem>
              <MenuItem value="safety_score">Safety Score</MenuItem>
              <MenuItem value="incident_count">Incident Count</MenuItem>
              <MenuItem value="delivery_time">Delivery Time</MenuItem>
              <MenuItem value="customer_rating">Customer Rating</MenuItem>
              <MenuItem value="mileage">Mileage</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Value"
            type="number"
            value={performanceForm.metricValue}
            onChange={(e) => setPerformanceForm({...performanceForm, metricValue: e.target.value})}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Unit"
            value={performanceForm.unit}
            onChange={(e) => setPerformanceForm({...performanceForm, unit: e.target.value})}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Date"
            type="date"
            value={performanceForm.date}
            onChange={(e) => setPerformanceForm({...performanceForm, date: e.target.value})}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Notes"
            value={performanceForm.notes}
            onChange={(e) => setPerformanceForm({...performanceForm, notes: e.target.value})}
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPerformanceDialog(false)}>Cancel</Button>
          <Button onClick={handlePerformanceSubmit} variant="contained">
            {editingPerformance ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DriverPerformance;