import React from 'react';
import TimeSeriesChart from './TimeSeriesChart';

const mockData = [
  {
    vehicle_name: 'Truck-001',
    metric_name: 'fuel_efficiency',
    metric_value: 8.5,
    recorded_at: '2024-01-15T08:00:00Z'
  },
  {
    vehicle_name: 'Truck-001',
    metric_name: 'fuel_efficiency',
    metric_value: 8.8,
    recorded_at: '2024-01-16T08:00:00Z'
  },
  {
    vehicle_name: 'Truck-001',
    metric_name: 'fuel_efficiency',
    metric_value: 8.2,
    recorded_at: '2024-01-17T08:00:00Z'
  },
  {
    vehicle_name: 'Van-002',
    metric_name: 'fuel_efficiency',
    metric_value: 12.3,
    recorded_at: '2024-01-15T09:00:00Z'
  },
  {
    vehicle_name: 'Van-002',
    metric_name: 'fuel_efficiency',
    metric_value: 12.1,
    recorded_at: '2024-01-16T09:00:00Z'
  },
  {
    vehicle_name: 'Van-002',
    metric_name: 'fuel_efficiency',
    metric_value: 12.5,
    recorded_at: '2024-01-17T09:00:00Z'
  }
];

const distanceData = [
  {
    vehicle_name: 'Truck-001',
    metric_name: 'distance_traveled',
    metric_value: 150,
    recorded_at: '2024-01-15T08:00:00Z'
  },
  {
    vehicle_name: 'Truck-001',
    metric_name: 'distance_traveled',
    metric_value: 165,
    recorded_at: '2024-01-16T08:00:00Z'
  },
  {
    vehicle_name: 'Truck-001',
    metric_name: 'distance_traveled',
    metric_value: 140,
    recorded_at: '2024-01-17T08:00:00Z'
  }
];

const speedData = [
  {
    vehicle_name: 'Truck-001',
    metric_name: 'average_speed',
    metric_value: 35,
    recorded_at: '2024-01-15T08:00:00Z'
  },
  {
    vehicle_name: 'Truck-001',
    metric_name: 'average_speed',
    metric_value: 38,
    recorded_at: '2024-01-16T08:00:00Z'
  },
  {
    vehicle_name: 'Truck-001',
    metric_name: 'average_speed',
    metric_value: 32,
    recorded_at: '2024-01-17T08:00:00Z'
  }
];

const legacyData = [
  {
    Exercise: 'Truck-001',
    Weight: 8.5,
    Time: '2024-01-15T08:00:00Z'
  },
  {
    Exercise: 'Truck-001',
    Weight: 8.8,
    Time: '2024-01-16T08:00:00Z'
  },
  {
    Exercise: 'Truck-001',
    Weight: 8.2,
    Time: '2024-01-17T08:00:00Z'
  }
];

export default {
  title: 'Charts/TimeSeriesChart',
  component: TimeSeriesChart,
  argTypes: {
    data: {
      control: 'object',
      description: 'Array of performance records'
    },
    title: {
      control: 'text',
      description: 'Chart title'
    },
    metric: {
      control: 'text',
      description: 'Metric to display'
    }
  }
};

// Default story
export const Default = {
  args: {
    data: mockData,
    title: 'Performance Over Time',
    metric: 'fuel_efficiency'
  }
};

// With custom title
export const CustomTitle = {
  args: {
    data: mockData,
    title: 'Weekly Fuel Efficiency Trends',
    metric: 'fuel_efficiency'
  }
};

// Distance traveled metric
export const DistanceTraveled = {
  args: {
    data: distanceData,
    title: 'Distance Traveled Over Time',
    metric: 'distance_traveled'
  }
};

// Average speed metric
export const AverageSpeed = {
  args: {
    data: speedData,
    title: 'Average Speed Over Time',
    metric: 'average_speed'
  }
};

// With no data
export const NoData = {
  args: {
    data: [],
    title: 'Performance Over Time',
    metric: 'fuel_efficiency'
  }
};

// With single data point
export const SingleDataPoint = {
  args: {
    data: [mockData[0]],
    title: 'Single Data Point',
    metric: 'fuel_efficiency'
  }
};

// With many data points
export const ManyDataPoints = {
  args: {
    data: [
      ...mockData,
      {
        vehicle_name: 'Truck-001',
        metric_name: 'fuel_efficiency',
        metric_value: 8.9,
        recorded_at: '2024-01-18T08:00:00Z'
      },
      {
        vehicle_name: 'Truck-001',
        metric_name: 'fuel_efficiency',
        metric_value: 8.1,
        recorded_at: '2024-01-19T08:00:00Z'
      },
      {
        vehicle_name: 'Truck-001',
        metric_name: 'fuel_efficiency',
        metric_value: 8.7,
        recorded_at: '2024-01-20T08:00:00Z'
      }
    ],
    title: 'Extended Performance Trends',
    metric: 'fuel_efficiency'
  }
};

// With legacy data format
export const LegacyDataFormat = {
  args: {
    data: legacyData,
    title: 'Legacy Data Format',
    metric: 'fuel_efficiency'
  }
};

// Multiple metrics comparison
export const MultipleMetrics = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      <div style={{ flex: '1', minWidth: '300px' }}>
        <TimeSeriesChart
          data={mockData}
          title="Fuel Efficiency Trends"
          metric="fuel_efficiency"
        />
      </div>
      <div style={{ flex: '1', minWidth: '300px' }}>
        <TimeSeriesChart
          data={distanceData}
          title="Distance Trends"
          metric="distance_traveled"
        />
      </div>
      <div style={{ flex: '1', minWidth: '300px' }}>
        <TimeSeriesChart
          data={speedData}
          title="Speed Trends"
          metric="average_speed"
        />
      </div>
    </div>
  )
};
