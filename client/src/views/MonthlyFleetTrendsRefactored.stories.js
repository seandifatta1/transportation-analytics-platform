import React from 'react';
import { ServiceProvider } from '../contexts/ServiceContext';
import { AuthProvider } from '../contexts/AuthContext';
import MonthlyFleetTrendsRefactored from './MonthlyFleetTrendsRefactored';

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
    vehicleId: 'vehicle-002',
    metricName: 'fuel_efficiency',
    metricValue: 12.3,
    unit: 'mpg',
    recordedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: 'record-004',
    vehicleId: 'vehicle-002',
    metricName: 'distance_traveled',
    metricValue: 200,
    unit: 'miles',
    recordedAt: '2024-01-15T09:00:00Z'
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
  title: 'Views/MonthlyFleetTrendsRefactored',
  component: MonthlyFleetTrendsRefactored,
  decorators: [(Story) => <Wrapper><Story /></Wrapper>],
  argTypes: {
    currentTab: {
      control: 'select',
      options: ['Delivery', 'Long Haul'],
      description: 'Currently selected tab'
    },
    selectedMetric: {
      control: 'select',
      options: ['fuel_efficiency', 'distance_traveled', 'average_speed', 'idle_time'],
      description: 'Selected metric for analysis'
    },
    selectedTimeRange: {
      control: 'select',
      options: ['7days', '30days', '90days', '1year'],
      description: 'Selected time range'
    }
  }
};

// Default story
export const Default = {
  args: {
    currentTab: 'Delivery',
    selectedMetric: 'fuel_efficiency',
    selectedTimeRange: '30days'
  }
};

// Long Haul tab
export const LongHaulTab = {
  args: {
    currentTab: 'Long Haul',
    selectedMetric: 'fuel_efficiency',
    selectedTimeRange: '30days'
  }
};

// Different metrics
export const DistanceTraveled = {
  args: {
    currentTab: 'Delivery',
    selectedMetric: 'distance_traveled',
    selectedTimeRange: '30days'
  }
};

export const AverageSpeed = {
  args: {
    currentTab: 'Delivery',
    selectedMetric: 'average_speed',
    selectedTimeRange: '30days'
  }
};

export const IdleTime = {
  args: {
    currentTab: 'Delivery',
    selectedMetric: 'idle_time',
    selectedTimeRange: '30days'
  }
};

// Different time ranges
export const Last7Days = {
  args: {
    currentTab: 'Delivery',
    selectedMetric: 'fuel_efficiency',
    selectedTimeRange: '7days'
  }
};

export const Last90Days = {
  args: {
    currentTab: 'Delivery',
    selectedMetric: 'fuel_efficiency',
    selectedTimeRange: '90days'
  }
};

export const LastYear = {
  args: {
    currentTab: 'Delivery',
    selectedMetric: 'fuel_efficiency',
    selectedTimeRange: '1year'
  }
};

// With loading state
export const Loading = {
  render: () => (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <div>Loading monthly fleet trends...</div>
    </div>
  )
};

// With error state
export const Error = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <div style={{ color: 'red', marginBottom: '20px' }}>
        Failed to load performance data
      </div>
      <MonthlyFleetTrendsRefactored />
    </div>
  )
};

// Empty state
export const EmptyState = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', color: '#666' }}>
        No performance data available
      </div>
      <MonthlyFleetTrendsRefactored />
    </div>
  )
};

// Mobile view
export const MobileView = {
  render: () => (
    <div style={{ width: '375px', margin: '0 auto' }}>
      <MonthlyFleetTrendsRefactored />
    </div>
  )
};

// Tablet view
export const TabletView = {
  render: () => (
    <div style={{ width: '768px', margin: '0 auto' }}>
      <MonthlyFleetTrendsRefactored />
    </div>
  )
};

// Desktop view
export const DesktopView = {
  render: () => (
    <div style={{ width: '1200px', margin: '0 auto' }}>
      <MonthlyFleetTrendsRefactored />
    </div>
  )
};
