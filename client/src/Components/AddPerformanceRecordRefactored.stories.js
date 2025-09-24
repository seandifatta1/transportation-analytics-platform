import React from 'react';
import { ServiceProvider } from '../contexts/ServiceContext';
import { AuthProvider } from '../contexts/AuthContext';
import AddPerformanceRecordRefactored from './AddPerformanceRecordRefactored';

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
  },
  {
    id: 'vehicle-003',
    name: 'Truck-003',
    type: 'DELIVERY',
    capacity: '8T',
    status: 'MAINTENANCE'
  }
];

const mockRoutes = [
  {
    id: 'route-001',
    name: 'City Delivery',
    type: 'CITY_ROUTES',
    description: 'Urban delivery routes'
  },
  {
    id: 'route-002',
    name: 'Long Haul',
    type: 'LONG_HAUL',
    description: 'Interstate transportation'
  }
];

const mockSessions = [
  {
    id: 'session-001',
    name: 'Morning Delivery',
    routeId: 'route-001',
    date: '2024-01-15'
  },
  {
    id: 'session-002',
    name: 'Afternoon Pickup',
    routeId: 'route-002',
    date: '2024-01-15'
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
  title: 'Components/AddPerformanceRecordRefactored',
  component: AddPerformanceRecordRefactored,
  decorators: [(Story) => <Wrapper><Story /></Wrapper>],
  argTypes: {
    batchMode: {
      control: 'boolean',
      description: 'Whether batch mode is enabled'
    },
    loading: {
      control: 'boolean',
      description: 'Whether the form is in loading state'
    },
    success: {
      control: 'boolean',
      description: 'Whether the form shows success state'
    },
    error: {
      control: 'text',
      description: 'Error message to display'
    }
  }
};

// Default story
export const Default = {
  args: {
    batchMode: false,
    loading: false,
    success: false,
    error: null
  }
};

// Batch mode enabled
export const BatchMode = {
  args: {
    batchMode: true,
    loading: false,
    success: false,
    error: null
  }
};

// Loading state
export const Loading = {
  args: {
    batchMode: false,
    loading: true,
    success: false,
    error: null
  }
};

// Success state
export const Success = {
  args: {
    batchMode: false,
    loading: false,
    success: true,
    error: null
  }
};

// Error state
export const Error = {
  args: {
    batchMode: false,
    loading: false,
    success: false,
    error: 'Failed to save performance record'
  }
};

// With batch records
export const WithBatchRecords = {
  args: {
    batchMode: true,
    loading: false,
    success: false,
    error: null
  },
  render: (args) => (
    <div>
      <div style={{ marginBottom: '20px', color: '#666' }}>
        Form with batch records added
      </div>
      <AddPerformanceRecordRefactored {...args} />
    </div>
  )
};

// No user logged in
export const NoUser = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        padding: '16px', 
        backgroundColor: '#fff3e0', 
        border: '1px solid #ff9800',
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        Please log in to add performance records
      </div>
      <AddPerformanceRecordRefactored />
    </div>
  )
};

// With loading data
export const LoadingData = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', color: '#666' }}>
        Loading vehicles, routes, and sessions...
      </div>
      <AddPerformanceRecordRefactored />
    </div>
  )
};

// With no vehicles available
export const NoVehicles = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', color: '#666' }}>
        No vehicles available
      </div>
      <AddPerformanceRecordRefactored />
    </div>
  )
};

// Mobile view
export const MobileView = {
  render: () => (
    <div style={{ width: '375px', margin: '0 auto' }}>
      <AddPerformanceRecordRefactored />
    </div>
  )
};

// Tablet view
export const TabletView = {
  render: () => (
    <div style={{ width: '768px', margin: '0 auto' }}>
      <AddPerformanceRecordRefactored />
    </div>
  )
};

// Desktop view
export const DesktopView = {
  render: () => (
    <div style={{ width: '1200px', margin: '0 auto' }}>
      <AddPerformanceRecordRefactored />
    </div>
  )
};

// Form validation states
export const FormValidation = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', color: '#666' }}>
        Form with validation errors
      </div>
      <AddPerformanceRecordRefactored />
    </div>
  )
};

// Different metric types
export const FuelEfficiency = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', color: '#666' }}>
        Form with fuel efficiency metric selected
      </div>
      <AddPerformanceRecordRefactored />
    </div>
  )
};

export const DistanceTraveled = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', color: '#666' }}>
        Form with distance traveled metric selected
      </div>
      <AddPerformanceRecordRefactored />
    </div>
  )
};

export const AverageSpeed = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', color: '#666' }}>
        Form with average speed metric selected
      </div>
      <AddPerformanceRecordRefactored />
    </div>
  )
};

export const IdleTime = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', color: '#666' }}>
        Form with idle time metric selected
      </div>
      <AddPerformanceRecordRefactored />
    </div>
  )
};
