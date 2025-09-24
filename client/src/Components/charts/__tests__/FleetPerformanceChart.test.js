import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import FleetPerformanceChart from '../FleetPerformanceChart';

// Mock MUI X Charts
jest.mock('@mui/x-charts', () => ({
  BarChart: ({ dataset, series, ...props }) => (
    <div data-testid="bar-chart" data-dataset={JSON.stringify(dataset)} data-series={JSON.stringify(series)} {...props}>
      Bar Chart
    </div>
  ),
  LineChart: ({ dataset, series, ...props }) => (
    <div data-testid="line-chart" data-dataset={JSON.stringify(dataset)} data-series={JSON.stringify(series)} {...props}>
      Line Chart
    </div>
  ),
  ScatterChart: ({ dataset, series, ...props }) => (
    <div data-testid="scatter-chart" data-dataset={JSON.stringify(dataset)} data-series={JSON.stringify(series)} {...props}>
      Scatter Chart
    </div>
  ),
  PieChart: ({ dataset, series, ...props }) => (
    <div data-testid="pie-chart" data-dataset={JSON.stringify(dataset)} data-series={JSON.stringify(series)} {...props}>
      Pie Chart
    </div>
  ),
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
    vehicle_name: 'Truck-001',
    metric_name: 'distance_traveled',
    metric_value: 150,
    recorded_at: '2024-01-15T08:00:00Z'
  }
];

const renderWithTheme = (component) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('FleetPerformanceChart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    renderWithTheme(<FleetPerformanceChart data={mockData} />);
    
    expect(screen.getByText('Fleet Performance')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    renderWithTheme(<FleetPerformanceChart data={mockData} title="Custom Title" />);
    
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('displays no data message when data is empty', () => {
    renderWithTheme(<FleetPerformanceChart data={[]} />);
    
    expect(screen.getByText('No data available for Fuel Efficiency')).toBeInTheDocument();
  });

  it('displays no data message when data is null', () => {
    renderWithTheme(<FleetPerformanceChart data={null} />);
    
    expect(screen.getByText('No data available for Fuel Efficiency')).toBeInTheDocument();
  });

  it('filters data by selected metric', () => {
    renderWithTheme(<FleetPerformanceChart data={mockData} />);
    
    // Should show bar chart with fuel efficiency data (2 records)
    const barChart = screen.getByTestId('bar-chart');
    const dataset = JSON.parse(barChart.getAttribute('data-dataset'));
    expect(dataset).toHaveLength(2);
    expect(dataset[0].metric).toBe('fuel_efficiency');
  });

  it('changes chart type when toggle button is clicked', async () => {
    renderWithTheme(<FleetPerformanceChart data={mockData} />);
    
    // Initially shows bar chart
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    
    // Click line chart button
    const lineButton = screen.getByRole('button', { name: 'Line' });
    fireEvent.click(lineButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });
  });

  it('changes metric when select dropdown is changed', async () => {
    renderWithTheme(<FleetPerformanceChart data={mockData} />);
    
    // Initially shows fuel efficiency data
    let barChart = screen.getByTestId('bar-chart');
    let dataset = JSON.parse(barChart.getAttribute('data-dataset'));
    expect(dataset).toHaveLength(2);
    
    // Change to distance traveled metric
    const metricSelect = screen.getByLabelText('Metric');
    fireEvent.mouseDown(metricSelect);
    
    const distanceOption = screen.getByText('Distance Traveled');
    fireEvent.click(distanceOption);
    
    await waitFor(() => {
      barChart = screen.getByTestId('bar-chart');
      dataset = JSON.parse(barChart.getAttribute('data-dataset'));
      expect(dataset).toHaveLength(1);
      expect(dataset[0].metric).toBe('distance_traveled');
    });
  });

  it('calls onMetricChange callback when metric changes', async () => {
    const onMetricChange = jest.fn();
    renderWithTheme(
      <FleetPerformanceChart 
        data={mockData} 
        onMetricChange={onMetricChange} 
      />
    );
    
    const metricSelect = screen.getByLabelText('Metric');
    fireEvent.mouseDown(metricSelect);
    
    const distanceOption = screen.getByText('Distance Traveled');
    fireEvent.click(distanceOption);
    
    await waitFor(() => {
      expect(onMetricChange).toHaveBeenCalledWith('distance_traveled');
    });
  });

  it('calls onChartTypeChange callback when chart type changes', async () => {
    const onChartTypeChange = jest.fn();
    renderWithTheme(
      <FleetPerformanceChart 
        data={mockData} 
        onChartTypeChange={onChartTypeChange} 
      />
    );
    
    const lineButton = screen.getByRole('button', { name: 'Line' });
    fireEvent.click(lineButton);
    
    await waitFor(() => {
      expect(onChartTypeChange).toHaveBeenCalledWith('line');
    });
  });

  it('renders all chart types correctly', () => {
    const { rerender } = renderWithTheme(<FleetPerformanceChart data={mockData} />);
    
    // Bar chart (default)
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    
    // Line chart
    rerender(<FleetPerformanceChart data={mockData} chartType="line" />);
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    
    // Scatter chart
    rerender(<FleetPerformanceChart data={mockData} chartType="scatter" />);
    expect(screen.getByTestId('scatter-chart')).toBeInTheDocument();
    
    // Pie chart
    rerender(<FleetPerformanceChart data={mockData} chartType="pie" />);
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });

  it('handles legacy data format', () => {
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
    
    renderWithTheme(<FleetPerformanceChart data={legacyData} />);
    
    const barChart = screen.getByTestId('bar-chart');
    const dataset = JSON.parse(barChart.getAttribute('data-dataset'));
    expect(dataset).toHaveLength(2);
    expect(dataset[0].vehicle).toBe('Truck-001');
    expect(dataset[0].value).toBe(8.5);
  });

  it('applies custom height', () => {
    renderWithTheme(<FleetPerformanceChart data={mockData} height={500} />);
    
    const barChart = screen.getByTestId('bar-chart');
    expect(barChart).toHaveAttribute('height', '500');
  });
});
