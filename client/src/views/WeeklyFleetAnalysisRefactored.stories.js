import React from 'react';
import { ServiceProvider } from '../contexts/ServiceContext';
import { AuthProvider } from '../contexts/AuthContext';
import WeeklyFleetAnalysisRefactored from './WeeklyFleetAnalysisRefactored';

// Mock the ScreenContext
const MockScreenContext = React.createContext();

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

// Mock services
const mockServices = {
  get: (serviceName) => {
    switch (serviceName) {
      case 'DATA':
        return {
          getVehicles: () => Promise.resolve(mockVehicles),
          getFleetRoutes: () => Promise.resolve(mockRoutes),
          getPerformanceRecords: () => Promise.resolve(mockPerformanceData)
        };
      case 'CHART':
        return {
          getFleetPerformanceChart: () => Promise.resolve({
            labels: ['Truck-001', 'Van-002'],
            datasets: [{
              label: 'Fuel Efficiency',
              data: [8.5, 12.3],
              backgroundColor: '#1976d2'
            }]
          }),
          getTimeSeriesChart: () => Promise.resolve({
            labels: ['2024-01-15', '2024-01-16', '2024-01-17'],
            datasets: [{
              label: 'Fuel Efficiency',
              data: [8.5, 8.8, 8.2],
              backgroundColor: '#1976d2'
            }]
          })
        };
      case 'NOTIFICATION':
        return {
          showError: () => {},
          showSuccess: () => {}
        };
      default:
        return {};
    }
  }
};

const mockContainer = {
  get: mockServices.get
};

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
  title: 'Views/WeeklyFleetAnalysisRefactored',
  component: WeeklyFleetAnalysisRefactored,
  decorators: [(Story) => <Wrapper><Story /></Wrapper>],
  argTypes: {
    currentTab: {
      control: 'select',
      options: ['Delivery', 'Long Haul'],
      description: 'Currently selected tab'
    }
  }
};

// Default story
export const Default = {
  args: {
    currentTab: 'Delivery'
  }
};

// Long Haul tab
export const LongHaulTab = {
  args: {
    currentTab: 'Long Haul'
  }
};

// With loading state
export const Loading = {
  render: () => (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <div>Loading fleet data...</div>
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
      <WeeklyFleetAnalysisRefactored />
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
      <WeeklyFleetAnalysisRefactored />
    </div>
  )
};

// Mobile view
export const MobileView = {
  render: () => (
    <div style={{ width: '375px', margin: '0 auto' }}>
      <WeeklyFleetAnalysisRefactored />
    </div>
  )
};

// Tablet view
export const TabletView = {
  render: () => (
    <div style={{ width: '768px', margin: '0 auto' }}>
      <WeeklyFleetAnalysisRefactored />
    </div>
  )
};

// Desktop view
export const DesktopView = {
  render: () => (
    <div style={{ width: '1200px', margin: '0 auto' }}>
      <WeeklyFleetAnalysisRefactored />
    </div>
  )
};
