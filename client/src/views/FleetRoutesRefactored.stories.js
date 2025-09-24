import React from 'react';
import { ServiceProvider } from '../contexts/ServiceContext';
import { AuthProvider } from '../contexts/AuthContext';
import FleetRoutesRefactored from './FleetRoutesRefactored';

const mockRoutes = [
  {
    id: 'route-001',
    name: 'City Delivery',
    type: 'CITY_ROUTES',
    description: 'Urban delivery routes within city limits',
    averageDistance: 25.5,
    averageDuration: 120,
    status: 'ACTIVE'
  },
  {
    id: 'route-002',
    name: 'Long Haul',
    type: 'LONG_HAUL',
    description: 'Interstate transportation routes',
    averageDistance: 450.0,
    averageDuration: 480,
    status: 'ACTIVE'
  },
  {
    id: 'route-003',
    name: 'Local Pickup',
    type: 'LOCAL_ROUTES',
    description: 'Local pickup and delivery routes',
    averageDistance: 15.2,
    averageDuration: 90,
    status: 'ACTIVE'
  }
];

const mockVehicles = [
  {
    id: 'vehicle-001',
    name: 'Truck-001',
    type: 'DELIVERY',
    capacity: '5T',
    status: 'ACTIVE'
  },
  {
    id: 'vehicle-002',
    name: 'Van-002',
    type: 'PICKUP',
    capacity: '2T',
    status: 'ACTIVE'
  }
];

const Wrapper = ({ children }) => (
  <ServiceProvider config={{ baseUrl: 'http://localhost:3001' }}>
    <AuthProvider>
      <div style={{ padding: '20px', minHeight: '100vh' }}>
        {children}
      </div>
    </AuthProvider>
  </ServiceProvider>
);

export default {
  title: 'Views/FleetRoutesRefactored',
  component: FleetRoutesRefactored,
  decorators: [(Story) => <Wrapper><Story /></Wrapper>],
  argTypes: {
    openDialog: {
      control: 'boolean',
      description: 'Whether the add/edit dialog is open'
    },
    editingRoute: {
      control: 'object',
      description: 'Route being edited (null for new route)'
    }
  }
};

// Default story
export const Default = {
  args: {
    openDialog: false,
    editingRoute: null
  }
};

// With dialog open for new route
export const NewRouteDialog = {
  args: {
    openDialog: true,
    editingRoute: null
  }
};

// With dialog open for editing
export const EditRouteDialog = {
  args: {
    openDialog: true,
    editingRoute: mockRoutes[0]
  }
};

// With loading state
export const Loading = {
  render: () => (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <div>Loading fleet routes...</div>
    </div>
  )
};

// Empty state
export const EmptyState = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', color: '#666' }}>
        No routes found
      </div>
      <FleetRoutesRefactored />
    </div>
  )
};

// With error state
export const Error = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <div style={{ color: 'red', marginBottom: '20px' }}>
        Failed to load fleet routes
      </div>
      <FleetRoutesRefactored />
    </div>
  )
};

// Single route
export const SingleRoute = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', color: '#666' }}>
        Single route available
      </div>
      <FleetRoutesRefactored />
    </div>
  )
};

// Many routes
export const ManyRoutes = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', color: '#666' }}>
        Multiple routes available
      </div>
      <FleetRoutesRefactored />
    </div>
  )
};

// Mobile view
export const MobileView = {
  render: () => (
    <div style={{ width: '375px', margin: '0 auto' }}>
      <FleetRoutesRefactored />
    </div>
  )
};

// Tablet view
export const TabletView = {
  render: () => (
    <div style={{ width: '768px', margin: '0 auto' }}>
      <FleetRoutesRefactored />
    </div>
  )
};

// Desktop view
export const DesktopView = {
  render: () => (
    <div style={{ width: '1200px', margin: '0 auto' }}>
      <FleetRoutesRefactored />
    </div>
  )
};
