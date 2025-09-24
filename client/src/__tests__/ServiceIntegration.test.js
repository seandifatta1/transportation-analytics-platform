import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ServiceProvider } from '../contexts/ServiceContext';
import { AuthProvider } from '../contexts/AuthContext';
import WeeklyFleetAnalysisRefactored from '../views/WeeklyFleetAnalysisRefactored';
import { ServiceFactory } from '../services/ServiceFactory';

// Mock the ScreenContext
const MockScreenContext = React.createContext();

// Mock data
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
    vehicleId: 'vehicle-002',
    metricName: 'fuel_efficiency',
    metricValue: 12.3,
    unit: 'mpg',
    recordedAt: '2024-01-15T09:00:00Z'
  }
];

const TestWrapper = ({ children, mockServices = {} }) => {
  const [container, setContainer] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const initializeServices = async () => {
      try {
        const factory = new ServiceFactory('http://localhost:3001');
        const serviceContainer = await factory.initializeTestServices(mockServices);
        setContainer(serviceContainer);
      } catch (error) {
        console.error('Failed to initialize services:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeServices();
  }, [mockServices]);

  if (loading) {
    return <div>Loading services...</div>;
  }

  if (!container) {
    return <div>Failed to initialize services</div>;
  }

  return (
    <ServiceProvider config={{ baseUrl: 'http://localhost:3001' }}>
      <AuthProvider>
        <div style={{ padding: '20px' }}>
          {children}
        </div>
      </AuthProvider>
    </ServiceProvider>
  );
};

describe('Service Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render component with services', async () => {
    const mockServices = {
      dataService: {
        getVehicles: jest.fn().mockResolvedValue(mockVehicles),
        getPerformanceRecords: jest.fn().mockResolvedValue(mockPerformanceData)
      },
      chartService: {
        getFleetPerformanceChart: jest.fn().mockResolvedValue({
          labels: ['Truck-001', 'Van-002'],
          datasets: [{
            label: 'Fuel Efficiency',
            data: [8.5, 12.3],
            backgroundColor: '#1976d2'
          }]
        })
      },
      notificationService: {
        showError: jest.fn(),
        showSuccess: jest.fn()
      }
    };

    render(
      <TestWrapper mockServices={mockServices}>
        <WeeklyFleetAnalysisRefactored />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Weekly Fleet Summary')).toBeInTheDocument();
    });
  });

  it('should handle service errors gracefully', async () => {
    const mockServices = {
      dataService: {
        getVehicles: jest.fn().mockRejectedValue(new Error('Service unavailable')),
        getPerformanceRecords: jest.fn().mockRejectedValue(new Error('Service unavailable'))
      },
      chartService: {
        getFleetPerformanceChart: jest.fn().mockRejectedValue(new Error('Service unavailable'))
      },
      notificationService: {
        showError: jest.fn(),
        showSuccess: jest.fn()
      }
    };

    render(
      <TestWrapper mockServices={mockServices}>
        <WeeklyFleetAnalysisRefactored />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Loading fleet data...')).toBeInTheDocument();
    });
  });

  it('should handle empty data from services', async () => {
    const mockServices = {
      dataService: {
        getVehicles: jest.fn().mockResolvedValue([]),
        getPerformanceRecords: jest.fn().mockResolvedValue([])
      },
      chartService: {
        getFleetPerformanceChart: jest.fn().mockResolvedValue({
          labels: [],
          datasets: []
        })
      },
      notificationService: {
        showError: jest.fn(),
        showSuccess: jest.fn()
      }
    };

    render(
      <TestWrapper mockServices={mockServices}>
        <WeeklyFleetAnalysisRefactored />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Weekly Fleet Summary')).toBeInTheDocument();
    });
  });

  it('should handle service initialization failure', async () => {
    const mockServices = {
      dataService: {
        getVehicles: jest.fn().mockImplementation(() => {
          throw new Error('Service initialization failed');
        })
      }
    };

    render(
      <TestWrapper mockServices={mockServices}>
        <WeeklyFleetAnalysisRefactored />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to initialize services')).toBeInTheDocument();
    });
  });

  it('should handle service container lifecycle', async () => {
    const mockServices = {
      dataService: {
        initialize: jest.fn(),
        destroy: jest.fn(),
        getVehicles: jest.fn().mockResolvedValue(mockVehicles)
      }
    };

    const { unmount } = render(
      <TestWrapper mockServices={mockServices}>
        <WeeklyFleetAnalysisRefactored />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(mockServices.dataService.initialize).toHaveBeenCalled();
    });

    unmount();

    await waitFor(() => {
      expect(mockServices.dataService.destroy).toHaveBeenCalled();
    });
  });
});
