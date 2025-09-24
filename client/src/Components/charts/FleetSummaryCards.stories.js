import React from 'react';
import FleetSummaryCards from './FleetSummaryCards';

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
  }
];

const sessionData = [
  {
    vehicle_name: 'Truck-001',
    session_name: 'Morning Delivery',
    metric_name: 'fuel_efficiency',
    metric_value: 8.5,
    recorded_at: '2024-01-15T08:00:00Z'
  },
  {
    vehicle_name: 'Truck-001',
    session_name: 'Afternoon Delivery',
    metric_name: 'fuel_efficiency',
    metric_value: 8.8,
    recorded_at: '2024-01-15T14:00:00Z'
  },
  {
    vehicle_name: 'Van-002',
    session_name: 'Morning Pickup',
    metric_name: 'fuel_efficiency',
    metric_value: 12.3,
    recorded_at: '2024-01-15T09:00:00Z'
  }
];

const legacyData = [
  {
    Exercise: 'Truck-001',
    Weight: 8.5,
    Time: '2024-01-15T08:00:00Z',
    Day: 'Morning Delivery'
  },
  {
    Exercise: 'Van-002',
    Weight: 12.3,
    Time: '2024-01-15T09:00:00Z',
    Day: 'Morning Pickup'
  }
];

export default {
  title: 'Charts/FleetSummaryCards',
  component: FleetSummaryCards,
  argTypes: {
    data: {
      control: 'object',
      description: 'Array of performance records'
    },
    title: {
      control: 'text',
      description: 'Summary title'
    }
  }
};

// Default story
export const Default = {
  args: {
    data: mockData,
    title: 'Fleet Summary'
  }
};

// With custom title
export const CustomTitle = {
  args: {
    data: mockData,
    title: 'Weekly Fleet Overview'
  }
};

// With session data
export const WithSessions = {
  args: {
    data: sessionData,
    title: 'Fleet Summary with Sessions'
  }
};

// With no data
export const NoData = {
  args: {
    data: [],
    title: 'Fleet Summary'
  }
};

// With null data
export const NullData = {
  args: {
    data: null,
    title: 'Fleet Summary'
  }
};

// With single vehicle
export const SingleVehicle = {
  args: {
    data: mockData.filter(record => record.vehicle_name === 'Truck-001'),
    title: 'Single Vehicle Summary'
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
      }
    ],
    title: 'Large Fleet Summary'
  }
};

// With legacy data format
export const LegacyDataFormat = {
  args: {
    data: legacyData,
    title: 'Legacy Data Summary'
  }
};

// Different time periods
export const TimePeriods = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      <div style={{ flex: '1', minWidth: '300px' }}>
        <FleetSummaryCards
          data={mockData}
          title="Today's Summary"
        />
      </div>
      <div style={{ flex: '1', minWidth: '300px' }}>
        <FleetSummaryCards
          data={[...mockData, ...mockData]}
          title="This Week's Summary"
        />
      </div>
      <div style={{ flex: '1', minWidth: '300px' }}>
        <FleetSummaryCards
          data={[...mockData, ...mockData, ...mockData]}
          title="This Month's Summary"
        />
      </div>
    </div>
  )
};
