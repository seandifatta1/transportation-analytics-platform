import React, { useState } from 'react';
import { Box } from '@mui/material';
import FleetManagement from './FleetManagement';
import { userEvent, within, expect } from '@storybook/test';

// Mock data for stories
const mockVehicles = [
  { id: '1', name: 'Truck-001', type: 'truck', capacity: '5T', status: 'active' },
  { id: '2', name: 'Van-002', type: 'van', capacity: '2T', status: 'active' },
  { id: '3', name: 'Truck-003', type: 'truck', capacity: '8T', status: 'maintenance' },
  { id: '4', name: 'Car-004', type: 'car', capacity: '1T', status: 'inactive' },
  { id: '5', name: 'Van-005', type: 'van', capacity: '3T', status: 'active' }
];

const mockRoutes = [
  { id: '1', name: 'City Delivery', type: 'city', description: 'Urban delivery routes', status: 'active' },
  { id: '2', name: 'Long Haul East', type: 'long_haul', description: 'Interstate transportation to East Coast', status: 'active' },
  { id: '3', name: 'Local Pickup', type: 'pickup', description: 'Local package pickup routes', status: 'active' },
  { id: '4', name: 'Warehouse Delivery', type: 'delivery', description: 'Bulk delivery to warehouses', status: 'inactive' }
];

export default {
  title: 'Components/FleetManagement',
  component: FleetManagement,
  decorators: [
    (Story) => (
      <Box sx={{ p: 2 }}>
        <Story />
      </Box>
    ),
  ],
};

export const Default = {
  render: () => {
    const [vehicles, setVehicles] = useState(mockVehicles);
    const [routes, setRoutes] = useState(mockRoutes);

    const handleAddVehicle = (vehicleData) => {
      const newVehicle = {
        id: Date.now().toString(),
        ...vehicleData
      };
      setVehicles([...vehicles, newVehicle]);
      console.log('Added vehicle:', newVehicle);
    };

    const handleEditVehicle = (id, vehicleData) => {
      setVehicles(vehicles.map(v => v.id === id ? { ...v, ...vehicleData } : v));
      console.log('Edited vehicle:', id, vehicleData);
    };

    const handleDeleteVehicle = (id) => {
      setVehicles(vehicles.filter(v => v.id !== id));
      console.log('Deleted vehicle:', id);
    };

    const handleAddRoute = (routeData) => {
      const newRoute = {
        id: Date.now().toString(),
        ...routeData
      };
      setRoutes([...routes, newRoute]);
      console.log('Added route:', newRoute);
    };

    const handleEditRoute = (id, routeData) => {
      setRoutes(routes.map(r => r.id === id ? { ...r, ...routeData } : r));
      console.log('Edited route:', id, routeData);
    };

    const handleDeleteRoute = (id) => {
      setRoutes(routes.filter(r => r.id !== id));
      console.log('Deleted route:', id);
    };

    return (
      <FleetManagement
        vehicles={vehicles}
        routes={routes}
        onAddVehicle={handleAddVehicle}
        onEditVehicle={handleEditVehicle}
        onDeleteVehicle={handleDeleteVehicle}
        onAddRoute={handleAddRoute}
        onEditRoute={handleEditRoute}
        onDeleteRoute={handleDeleteRoute}
      />
    );
  },
};

export const EmptyFleet = {
  render: () => {
    const [vehicles, setVehicles] = useState([]);
    const [routes, setRoutes] = useState([]);

    const handleAddVehicle = (vehicleData) => {
      const newVehicle = {
        id: Date.now().toString(),
        ...vehicleData
      };
      setVehicles([...vehicles, newVehicle]);
      console.log('Added vehicle:', newVehicle);
    };

    const handleAddRoute = (routeData) => {
      const newRoute = {
        id: Date.now().toString(),
        ...routeData
      };
      setRoutes([...routes, newRoute]);
      console.log('Added route:', newRoute);
    };

    return (
      <FleetManagement
        vehicles={vehicles}
        routes={routes}
        onAddVehicle={handleAddVehicle}
        onAddRoute={handleAddRoute}
      />
    );
  },
};

export const AddNewVehicle = {
  render: () => {
    const [vehicles, setVehicles] = useState(mockVehicles);
    const [routes, setRoutes] = useState(mockRoutes);

    const handleAddVehicle = (vehicleData) => {
      const newVehicle = {
        id: Date.now().toString(),
        ...vehicleData
      };
      setVehicles([...vehicles, newVehicle]);
      console.log('Added vehicle:', newVehicle);
    };

    const handleEditVehicle = (id, vehicleData) => {
      setVehicles(vehicles.map(v => v.id === id ? { ...v, ...vehicleData } : v));
      console.log('Edited vehicle:', id, vehicleData);
    };

    const handleDeleteVehicle = (id) => {
      setVehicles(vehicles.filter(v => v.id !== id));
      console.log('Deleted vehicle:', id);
    };

    const handleAddRoute = (routeData) => {
      const newRoute = {
        id: Date.now().toString(),
        ...routeData
      };
      setRoutes([...routes, newRoute]);
      console.log('Added route:', newRoute);
    };

    const handleEditRoute = (id, routeData) => {
      setRoutes(routes.map(r => r.id === id ? { ...r, ...routeData } : r));
      console.log('Edited route:', id, routeData);
    };

    const handleDeleteRoute = (id) => {
      setRoutes(routes.filter(r => r.id !== id));
      console.log('Deleted route:', id);
    };

    return (
      <FleetManagement
        vehicles={vehicles}
        routes={routes}
        onAddVehicle={handleAddVehicle}
        onEditVehicle={handleEditVehicle}
        onDeleteVehicle={handleDeleteVehicle}
        onAddRoute={handleAddRoute}
        onEditRoute={handleEditRoute}
        onDeleteRoute={handleDeleteRoute}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Click "Add Vehicle" button
    await userEvent.click(canvas.getByRole('button', { name: /add vehicle/i }));
    
    // Fill in vehicle form
    await userEvent.type(canvas.getByLabelText(/vehicle type/i), 'Truck');
    await userEvent.type(canvas.getByLabelText(/capacity/i), '10T');
    
    // Select status
    await userEvent.click(canvas.getByLabelText(/status/i));
    await userEvent.click(canvas.getByText(/active/i));
    
    // Submit form
    await userEvent.click(canvas.getByRole('button', { name: /add/i }));
    
    // Verify vehicle was added (should appear in table)
    await expect(canvas.getByText('Truck')).toBeInTheDocument();
  },
};