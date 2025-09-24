import React from 'react';
import FleetEfficiencyChart from './FleetEfficiencyChart';

const mockData = [
  {
    vehicle_name: 'Truck-001',
    metric_name: 'fuel_efficiency',
    metric_value: 8.5,
    recorded_at: '2024-01-15T08:00:00Z'
  },
  {
    vehicle_name: 'Truck-001',
    metric_name: 'distance_traveled',
    metric_value: 150,
    recorded_at: '2024-01-15T08:00:00Z'
  },
  {
    vehicle_name: 'Truck-001',
    metric_name: 'average_speed',
    metric_value: 35,
    recorded_at: '2024-01-15T08:00:00Z'
  },
  {
    vehicle_name: 'Van-002',
    metric_name: 'fuel_efficiency',
    metric_value: 12.3,
    recorded_at: '2024-01-15T09:00:00Z'
  },
  {
    vehicle_name: 'Van-002',
    metric_name: 'distance_traveled',
    metric_value: 200,
    recorded_at: '2024-01-15T09:00:00Z'
  },
  {
    vehicle_name: 'Van-002',
    metric_name: 'average_speed',
    metric_value: 40,
    recorded_at: '2024-01-15T09:00:00Z'
  },
  {
    vehicle_name: 'Truck-003',
    metric_name: 'fuel_efficiency',
    metric_value: 9.2,
    recorded_at: '2024-01-15T10:00:00Z'
  },
  {
    vehicle_name: 'Truck-003',
    metric_name: 'distance_traveled',
    metric_value: 300,
    recorded_at: '2024-01-15T10:00:00Z'
  },
  {
    vehicle_name: 'Truck-003',
    metric_name: 'average_speed',
    metric_value: 45,
    recorded_at: '2024-01-15T10:00:00Z'
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
  },
  {
    Exercise: 'Truck-003',
    Weight: 9.2,
    Time: '2024-01-15T10:00:00Z'
  }
];

export default {
  title: 'Charts/FleetEfficiencyChart',
  component: FleetEfficiencyChart,
  argTypes: {
    data: {
      control: 'object',
      description: 'Array of performance records'
    },
    title: {
      control: 'text',
      description: 'Chart title'
    }
  }
};

// Default story
export const Default = {
  args: {
    data: mockData,
    title: 'Fleet Efficiency Analysis'
  }
};

// With custom title
export const CustomTitle = {
  args: {
    data: mockData,
    title: 'Weekly Efficiency Report'
  }
};

// With no data
export const NoData = {
  args: {
    data: [],
    title: 'Fleet Efficiency Analysis'
  }
};

// With single vehicle
export const SingleVehicle = {
  args: {
    data: mockData.filter(record => record.vehicle_name === 'Truck-001'),
    title: 'Single Vehicle Efficiency'
  }
};

// With many vehicles
export const ManyVehicles = {
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
        vehicle_name: 'Truck-004',
        metric_name: 'distance_traveled',
        metric_value: 250,
        recorded_at: '2024-01-15T11:00:00Z'
      },
      {
        vehicle_name: 'Truck-004',
        metric_name: 'average_speed',
        metric_value: 38,
        recorded_at: '2024-01-15T11:00:00Z'
      },
      {
        vehicle_name: 'Van-005',
        metric_name: 'fuel_efficiency',
        metric_value: 13.5,
        recorded_at: '2024-01-15T12:00:00Z'
      },
      {
        vehicle_name: 'Van-005',
        metric_name: 'distance_traveled',
        metric_value: 180,
        recorded_at: '2024-01-15T12:00:00Z'
      },
      {
        vehicle_name: 'Van-005',
        metric_name: 'average_speed',
        metric_value: 42,
        recorded_at: '2024-01-15T12:00:00Z'
      }
    ],
    title: 'Large Fleet Efficiency Analysis'
  }
};

// With legacy data format
export const LegacyDataFormat = {
  args: {
    data: legacyData,
    title: 'Legacy Data Format'
  }
};

// Efficiency comparison
export const EfficiencyComparison = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      <div style={{ flex: '1', minWidth: '300px' }}>
        <FleetEfficiencyChart
          data={mockData.filter(record => record.vehicle_name.includes('Truck'))}
          title="Truck Efficiency"
        />
      </div>
      <div style={{ flex: '1', minWidth: '300px' }}>
        <FleetEfficiencyChart
          data={mockData.filter(record => record.vehicle_name.includes('Van'))}
          title="Van Efficiency"
        />
      </div>
    </div>
  )
};
