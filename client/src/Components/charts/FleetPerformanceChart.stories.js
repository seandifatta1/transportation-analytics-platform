import React from 'react';
import { FleetPerformanceChart } from './FleetPerformanceChart';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Mock MUI X Charts for Storybook
const mockChart = ({ dataset, series, ...props }) => (
  <div 
    style={{ 
      height: '400px', 
      border: '1px solid #ccc', 
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '4px'
    }}
    {...props}
  >
    <h4>Chart Preview</h4>
    <p>Dataset: {JSON.stringify(dataset, null, 2)}</p>
    <p>Series: {JSON.stringify(series, null, 2)}</p>
  </div>
);

// Mock the chart components
jest.mock('@mui/x-charts', () => ({
  BarChart: mockChart,
  LineChart: mockChart,
  ScatterChart: mockChart,
  PieChart: mockChart,
}));

const theme = createTheme();

const mockData = [
  {
    vehicle_name: 'Truck-001',
    metric_name: 'fuel_efficiency',
    metric_value: 8.5,
    recorded_at: '2024-01-15T08:00:00Z'
  },
  {
    vehicle_name: 'Van-002',
    metric_name: 'fuel_efficiency',
    metric_value: 12.3,
    recorded_at: '2024-01-15T09:00:00Z'
  },
  {
    vehicle_name: 'Truck-003',
    metric_name: 'fuel_efficiency',
    metric_value: 9.2,
    recorded_at: '2024-01-15T10:00:00Z'
  },
  {
    vehicle_name: 'Truck-001',
    metric_name: 'distance_traveled',
    metric_value: 150,
    recorded_at: '2024-01-15T08:00:00Z'
  },
  {
    vehicle_name: 'Van-002',
    metric_name: 'distance_traveled',
    metric_value: 200,
    recorded_at: '2024-01-15T09:00:00Z'
  }
];

const legacyData = [
  {
    Exercise: 'Truck-001',
    Weight: 8.5,
    Time: '2024-01-15T08:00:00Z'
  },
  {
    Exercise: 'Van-002',
    Weight: 12.3,
    Time: '2024-01-15T09:00:00Z'
  }
];

const Wrapper = ({ children }) => (
  <ThemeProvider theme={theme}>
    <div style={{ padding: '20px' }}>
      {children}
    </div>
  </ThemeProvider>
);

export default {
  title: 'Charts/FleetPerformanceChart',
  component: FleetPerformanceChart,
  decorators: [(Story) => <Wrapper><Story /></Wrapper>],
  argTypes: {
    data: {
      control: 'object',
      description: 'Array of performance records'
    },
    title: {
      control: 'text',
      description: 'Chart title'
    },
    height: {
      control: 'number',
      description: 'Chart height in pixels'
    },
    onMetricChange: {
      action: 'metricChanged',
      description: 'Callback when metric selection changes'
    },
    onChartTypeChange: {
      action: 'chartTypeChanged',
      description: 'Callback when chart type changes'
    }
  }
};

// Default story
export const Default = {
  args: {
    data: mockData,
    title: 'Fleet Performance',
    height: 400
  }
};

// With custom title
export const CustomTitle = {
  args: {
    data: mockData,
    title: 'Weekly Fleet Performance Analysis',
    height: 400
  }
};

// With different height
export const TallChart = {
  args: {
    data: mockData,
    title: 'Fleet Performance',
    height: 600
  }
};

// With no data
export const NoData = {
  args: {
    data: [],
    title: 'Fleet Performance',
    height: 400
  }
};

// With null data
export const NullData = {
  args: {
    data: null,
    title: 'Fleet Performance',
    height: 400
  }
};

// With legacy data format
export const LegacyDataFormat = {
  args: {
    data: legacyData,
    title: 'Legacy Data Format',
    height: 400
  }
};

// With single data point
export const SingleDataPoint = {
  args: {
    data: [mockData[0]],
    title: 'Single Vehicle Performance',
    height: 400
  }
};

// With many data points
export const ManyDataPoints = {
  args: {
    data: [
      ...mockData,
      {
        vehicle_name: 'Truck-004',
        metric_name: 'fuel_efficiency',
        metric_value: 7.8,
        recorded_at: '2024-01-15T11:00:00Z'
      },
      {
        vehicle_name: 'Truck-005',
        metric_name: 'fuel_efficiency',
        metric_value: 10.1,
        recorded_at: '2024-01-15T12:00:00Z'
      },
      {
        vehicle_name: 'Van-006',
        metric_name: 'fuel_efficiency',
        metric_value: 13.5,
        recorded_at: '2024-01-15T13:00:00Z'
      }
    ],
    title: 'Large Fleet Performance',
    height: 400
  }
};

// Interactive example
export const Interactive = {
  args: {
    data: mockData,
    title: 'Interactive Fleet Performance',
    height: 400,
    onMetricChange: (metric) => console.log('Metric changed to:', metric),
    onChartTypeChange: (chartType) => console.log('Chart type changed to:', chartType)
  }
};

// Different metrics
export const DistanceTraveled = {
  args: {
    data: mockData.filter(record => record.metric_name === 'distance_traveled'),
    title: 'Distance Traveled Analysis',
    height: 400
  }
};

// Performance comparison
export const PerformanceComparison = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      <div style={{ flex: '1', minWidth: '300px' }}>
        <FleetPerformanceChart
          data={mockData.filter(record => record.metric_name === 'fuel_efficiency')}
          title="Fuel Efficiency"
          height={300}
        />
      </div>
      <div style={{ flex: '1', minWidth: '300px' }}>
        <FleetPerformanceChart
          data={mockData.filter(record => record.metric_name === 'distance_traveled')}
          title="Distance Traveled"
          height={300}
        />
      </div>
    </div>
  )
};
