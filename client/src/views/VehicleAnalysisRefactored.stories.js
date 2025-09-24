import React from 'react';
import { ServiceProvider } from '../contexts/ServiceContext';
import { AuthProvider } from '../contexts/AuthContext';
import VehicleAnalysisRefactored from './VehicleAnalysisRefactored';

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

const mockPerformanceData = [
  {
    id: 'record-001',
    vehicleId: 'vehicle-001',
    metricName: 'fuel_efficiency',
    metricValue: 8.5,
    unit: 'mpg',
    recordedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: 'record-002',
    vehicleId: 'vehicle-001',
    metricName: 'distance_traveled',
    metricValue: 150,
    unit: 'miles',
    recordedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: 'record-003',
    vehicleId: 'vehicle-001',
    metricName: 'average_speed',
    metricValue: 35,
    unit: 'mph',
    recordedAt: '2024-01-15T08:00:00Z'
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
  title: 'Views/VehicleAnalysisRefactored',
  component: VehicleAnalysisRefactored,
  decorators: [(Story) => <Wrapper><Story /></Wrapper>],
  argTypes: {
    selectedVehicle: {
      control: 'select',
      options: ['vehicle-001', 'vehicle-002', 'vehicle-003'],
      description: 'Selected vehicle ID'
    },
    selectedMetric: {
      control: 'select',
      options: ['fuel_efficiency', 'distance_traveled', 'average_speed', 'idle_time'],
      description: 'Selected metric for analysis'
    },
    timeRange: {
      control: 'select',
      options: ['week', 'month', 'quarter', 'year'],
      description: 'Selected time range'
    }
  }
};

// Default story
export const Default = {
  args: {
    selectedVehicle: 'vehicle-001',
    selectedMetric: 'fuel_efficiency',
    timeRange: 'month'
  }
};

// Different vehicles
export const VanAnalysis = {
  args: {
    selectedVehicle: 'vehicle-002',
    selectedMetric: 'fuel_efficiency',
    timeRange: 'month'
  }
};

export const LargeTruckAnalysis = {
  args: {
    selectedVehicle: 'vehicle-003',
    selectedMetric: 'fuel_efficiency',
    timeRange: 'month'
  }
};

// Different metrics
export const DistanceAnalysis = {
  args: {
    selectedVehicle: 'vehicle-001',
    selectedMetric: 'distance_traveled',
    timeRange: 'month'
  }
};

export const SpeedAnalysis = {
  args: {
    selectedVehicle: 'vehicle-001',
    selectedMetric: 'average_speed',
    timeRange: 'month'
  }
};

export const IdleTimeAnalysis = {
  args: {
    selectedVehicle: 'vehicle-001',
    selectedMetric: 'idle_time',
    timeRange: 'month'
  }
};

// Different time ranges
export const WeeklyAnalysis = {
  args: {
    selectedVehicle: 'vehicle-001',
    selectedMetric: 'fuel_efficiency',
    timeRange: 'week'
  }
};

export const QuarterlyAnalysis = {
  args: {
    selectedVehicle: 'vehicle-001',
    selectedMetric: 'fuel_efficiency',
    timeRange: 'quarter'
  }
};

export const YearlyAnalysis = {
  args: {
    selectedVehicle: 'vehicle-001',
    selectedMetric: 'fuel_efficiency',
    timeRange: 'year'
  }
};

// With loading state
export const Loading = {
  render: () => (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <div>Loading vehicles...</div>
    </div>
  )
};

// No vehicles available
export const NoVehicles = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        padding: '16px', 
        backgroundColor: '#e3f2fd', 
        border: '1px solid #2196f3',
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        No vehicles available. Please add some vehicles to view analysis.
      </div>
      <VehicleAnalysisRefactored />
    </div>
  )
};

// No vehicle selected
export const NoVehicleSelected = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        padding: '16px', 
        backgroundColor: '#fff3e0', 
        border: '1px solid #ff9800',
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        Please select a vehicle to view analysis.
      </div>
      <VehicleAnalysisRefactored />
    </div>
  )
};

// With error state
export const Error = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <div style={{ color: 'red', marginBottom: '20px' }}>
        Failed to load vehicles
      </div>
      <VehicleAnalysisRefactored />
    </div>
  )
};

// Empty performance data
export const EmptyPerformanceData = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', color: '#666' }}>
        No performance data available for selected vehicle
      </div>
      <VehicleAnalysisRefactored />
    </div>
  )
};

// Mobile view
export const MobileView = {
  render: () => (
    <div style={{ width: '375px', margin: '0 auto' }}>
      <VehicleAnalysisRefactored />
    </div>
  )
};

// Tablet view
export const TabletView = {
  render: () => (
    <div style={{ width: '768px', margin: '0 auto' }}>
      <VehicleAnalysisRefactored />
    </div>
  )
};

// Desktop view
export const DesktopView = {
  render: () => (
    <div style={{ width: '1200px', margin: '0 auto' }}>
      <VehicleAnalysisRefactored />
    </div>
  )
};
