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
  DirectionsCar as VehicleIcon,
  Route as RouteIcon,
  TrendingUp as PerformanceIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const FleetManagement = ({ 
  vehicles = [], 
  routes = [], 
  onAddVehicle, 
  onEditVehicle, 
  onDeleteVehicle,
  onAddRoute,
  onEditRoute,
  onDeleteRoute,
  isLoading = false 
}) => {
  const [openVehicleDialog, setOpenVehicleDialog] = useState(false);
  const [openRouteDialog, setOpenRouteDialog] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [editingRoute, setEditingRoute] = useState(null);
  const [vehicleForm, setVehicleForm] = useState({
    name: '',
    type: '',
    capacity: '',
    status: 'active'
  });
  const [routeForm, setRouteForm] = useState({
    name: '',
    type: '',
    description: '',
    status: 'active'
  });

  const handleVehicleSubmit = () => {
    if (editingVehicle) {
      onEditVehicle?.(editingVehicle.id, vehicleForm);
    } else {
      onAddVehicle?.(vehicleForm);
    }
    setOpenVehicleDialog(false);
    setEditingVehicle(null);
    setVehicleForm({ name: '', type: '', capacity: '', status: 'active' });
  };

  const handleRouteSubmit = () => {
    if (editingRoute) {
      onEditRoute?.(editingRoute.id, routeForm);
    } else {
      onAddRoute?.(routeForm);
    }
    setOpenRouteDialog(false);
    setEditingRoute(null);
    setRouteForm({ name: '', type: '', description: '', status: 'active' });
  };

  const handleEditVehicle = (vehicle) => {
    setEditingVehicle(vehicle);
    setVehicleForm(vehicle);
    setOpenVehicleDialog(true);
  };

  const handleEditRoute = (route) => {
    setEditingRoute(route);
    setRouteForm(route);
    setOpenRouteDialog(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'maintenance': return 'warning';
      case 'inactive': return 'error';
      default: return 'default';
    }
  };

  const getVehicleTypeIcon = (type) => {
    switch (type) {
      case 'truck': return '🚛';
      case 'van': return '🚐';
      case 'car': return '🚗';
      default: return '🚗';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Fleet Management
      </Typography>
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <VehicleIcon color="primary" sx={{ mr: 1 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Vehicles
                  </Typography>
                  <Typography variant="h4">
                    {vehicles.length}
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
                <RouteIcon color="success" sx={{ mr: 1 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Active Routes
                  </Typography>
                  <Typography variant="h4">
                    {routes.filter(r => r.status === 'active').length}
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
                <PerformanceIcon color="info" sx={{ mr: 1 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Active Vehicles
                  </Typography>
                  <Typography variant="h4">
                    {vehicles.filter(v => v.status === 'active').length}
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
                <WarningIcon color="warning" sx={{ mr: 1 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Maintenance
                  </Typography>
                  <Typography variant="h4">
                    {vehicles.filter(v => v.status === 'maintenance').length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Vehicles Table */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Vehicles
                </Typography>
                <Button
                  startIcon={<AddIcon />}
                  variant="contained"
                  onClick={() => setOpenVehicleDialog(true)}
                >
                  Add Vehicle
                </Button>
              </Box>
              <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Vehicle</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vehicles.map((vehicle) => (
                      <TableRow key={vehicle.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ mr: 1, bgcolor: 'primary.main' }}>
                              {getVehicleTypeIcon(vehicle.type)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {vehicle.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {vehicle.capacity}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={vehicle.type} 
                            size="small" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={vehicle.status} 
                            size="small" 
                            color={getStatusColor(vehicle.status)}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            size="small" 
                            onClick={() => handleEditVehicle(vehicle)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={() => onDeleteVehicle?.(vehicle.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Routes Table */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Routes
                </Typography>
                <Button
                  startIcon={<AddIcon />}
                  variant="contained"
                  onClick={() => setOpenRouteDialog(true)}
                >
                  Add Route
                </Button>
              </Box>
              <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Route</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {routes.map((route) => (
                      <TableRow key={route.id}>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {route.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {route.description}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={route.type} 
                            size="small" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={route.status} 
                            size="small" 
                            color={getStatusColor(route.status)}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            size="small" 
                            onClick={() => handleEditRoute(route)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={() => onDeleteRoute?.(route.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Vehicle Dialog */}
      <Dialog open={openVehicleDialog} onClose={() => setOpenVehicleDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingVehicle ? 'Edit Vehicle' : 'Add Vehicle'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Vehicle Name"
            value={vehicleForm.name}
            onChange={(e) => setVehicleForm({...vehicleForm, name: e.target.value})}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Type</InputLabel>
            <Select
              value={vehicleForm.type}
              onChange={(e) => setVehicleForm({...vehicleForm, type: e.target.value})}
              label="Type"
            >
              <MenuItem value="truck">Truck</MenuItem>
              <MenuItem value="van">Van</MenuItem>
              <MenuItem value="car">Car</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Capacity"
            value={vehicleForm.capacity}
            onChange={(e) => setVehicleForm({...vehicleForm, capacity: e.target.value})}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={vehicleForm.status}
              onChange={(e) => setVehicleForm({...vehicleForm, status: e.target.value})}
              label="Status"
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="maintenance">Maintenance</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenVehicleDialog(false)}>Cancel</Button>
          <Button onClick={handleVehicleSubmit} variant="contained">
            {editingVehicle ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Route Dialog */}
      <Dialog open={openRouteDialog} onClose={() => setOpenRouteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingRoute ? 'Edit Route' : 'Add Route'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Route Name"
            value={routeForm.name}
            onChange={(e) => setRouteForm({...routeForm, name: e.target.value})}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Type</InputLabel>
            <Select
              value={routeForm.type}
              onChange={(e) => setRouteForm({...routeForm, type: e.target.value})}
              label="Type"
            >
              <MenuItem value="city">City Routes</MenuItem>
              <MenuItem value="long_haul">Long Haul</MenuItem>
              <MenuItem value="delivery">Delivery</MenuItem>
              <MenuItem value="pickup">Pickup</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Description"
            value={routeForm.description}
            onChange={(e) => setRouteForm({...routeForm, description: e.target.value})}
            margin="normal"
            multiline
            rows={3}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={routeForm.status}
              onChange={(e) => setRouteForm({...routeForm, status: e.target.value})}
              label="Status"
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRouteDialog(false)}>Cancel</Button>
          <Button onClick={handleRouteSubmit} variant="contained">
            {editingRoute ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FleetManagement;