import { DataService } from '../DataService';
import { HttpClient } from '../HttpClient';

// Mock HttpClient
jest.mock('../HttpClient');

describe('DataService', () => {
  let dataService;
  let mockHttpClient;

  beforeEach(() => {
    mockHttpClient = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn()
    };
    
    HttpClient.mockImplementation(() => mockHttpClient);
    
    dataService = new DataService(mockHttpClient, 'http://localhost:3001');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getVehicles', () => {
    it('should fetch vehicles successfully', async () => {
      const mockVehicles = [
        { id: '1', name: 'Truck-001', type: 'DELIVERY' },
        { id: '2', name: 'Van-002', type: 'PICKUP' }
      ];
      
      mockHttpClient.get.mockResolvedValue({ data: mockVehicles });

      const result = await dataService.getVehicles();

      expect(mockHttpClient.get).toHaveBeenCalledWith('http://localhost:3001/vehicles');
      expect(result).toEqual(mockVehicles);
    });

    it('should return empty array when no data', async () => {
      mockHttpClient.get.mockResolvedValue({ data: null });

      const result = await dataService.getVehicles();

      expect(result).toEqual([]);
    });

    it('should handle errors gracefully', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('Network error'));

      await expect(dataService.getVehicles()).rejects.toThrow('Network error');
    });
  });

  describe('getVehicleById', () => {
    it('should fetch vehicle by id successfully', async () => {
      const mockVehicle = { id: '1', name: 'Truck-001', type: 'DELIVERY' };
      
      mockHttpClient.get.mockResolvedValue({ data: mockVehicle });

      const result = await dataService.getVehicleById('1');

      expect(mockHttpClient.get).toHaveBeenCalledWith('http://localhost:3001/vehicles/1');
      expect(result).toEqual(mockVehicle);
    });

    it('should return null when vehicle not found', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('Not found'));

      const result = await dataService.getVehicleById('999');

      expect(result).toBeNull();
    });
  });

  describe('createVehicle', () => {
    it('should create vehicle successfully', async () => {
      const newVehicle = { name: 'Truck-003', type: 'DELIVERY', capacity: '5T' };
      const createdVehicle = { id: '3', ...newVehicle };
      
      mockHttpClient.post.mockResolvedValue({ success: true, data: createdVehicle });

      const result = await dataService.createVehicle(newVehicle);

      expect(mockHttpClient.post).toHaveBeenCalledWith('http://localhost:3001/vehicles', newVehicle);
      expect(result).toEqual(createdVehicle);
    });

    it('should throw error when creation fails', async () => {
      const newVehicle = { name: 'Truck-003', type: 'DELIVERY' };
      
      mockHttpClient.post.mockResolvedValue({ success: false });

      await expect(dataService.createVehicle(newVehicle)).rejects.toThrow('Failed to create vehicle');
    });
  });

  describe('getPerformanceRecords', () => {
    it('should fetch performance records with filters', async () => {
      const mockRecords = [
        { id: '1', vehicleId: '1', metricName: 'fuel_efficiency', metricValue: 8.5 },
        { id: '2', vehicleId: '1', metricName: 'distance_traveled', metricValue: 150 }
      ];
      
      const filters = {
        vehicleId: '1',
        startDate: '2024-01-01',
        endDate: '2024-01-31'
      };
      
      mockHttpClient.get.mockResolvedValue({ data: mockRecords });

      const result = await dataService.getPerformanceRecords(filters);

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'http://localhost:3001/performance-records?vehicleId=1&startDate=2024-01-01&endDate=2024-01-31'
      );
      expect(result).toEqual(mockRecords);
    });

    it('should fetch performance records without filters', async () => {
      const mockRecords = [];
      
      mockHttpClient.get.mockResolvedValue({ data: mockRecords });

      const result = await dataService.getPerformanceRecords();

      expect(mockHttpClient.get).toHaveBeenCalledWith('http://localhost:3001/performance-records');
      expect(result).toEqual(mockRecords);
    });

    it('should handle array filters correctly', async () => {
      const filters = {
        vehicleIds: ['1', '2'],
        metricNames: ['fuel_efficiency', 'distance_traveled']
      };
      
      mockHttpClient.get.mockResolvedValue({ data: [] });

      await dataService.getPerformanceRecords(filters);

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'http://localhost:3001/performance-records?vehicleIds=1&vehicleIds=2&metricNames=fuel_efficiency&metricNames=distance_traveled'
      );
    });
  });

  describe('createBatchPerformanceRecords', () => {
    it('should create batch performance records successfully', async () => {
      const records = [
        { vehicleId: '1', metricName: 'fuel_efficiency', metricValue: 8.5 },
        { vehicleId: '1', metricName: 'distance_traveled', metricValue: 150 }
      ];
      
      const createdRecords = records.map((record, index) => ({ id: `record-${index}`, ...record }));
      
      mockHttpClient.post.mockResolvedValue({ success: true, data: createdRecords });

      const result = await dataService.createBatchPerformanceRecords(records);

      expect(mockHttpClient.post).toHaveBeenCalledWith('http://localhost:3001/performance-records/batch', records);
      expect(result).toEqual(createdRecords);
    });

    it('should throw error when batch creation fails', async () => {
      const records = [{ vehicleId: '1', metricName: 'fuel_efficiency', metricValue: 8.5 }];
      
      mockHttpClient.post.mockResolvedValue({ success: false });

      await expect(dataService.createBatchPerformanceRecords(records)).rejects.toThrow('Failed to create batch performance records');
    });
  });

  describe('getFleetSummary', () => {
    it('should fetch fleet summary successfully', async () => {
      const mockSummary = {
        totalVehicles: 5,
        totalDistance: 1000,
        averageFuelEfficiency: 10.5,
        totalSessions: 25
      };
      
      mockHttpClient.get.mockResolvedValue({ success: true, data: mockSummary });

      const result = await dataService.getFleetSummary();

      expect(mockHttpClient.get).toHaveBeenCalledWith('http://localhost:3001/analytics/summary');
      expect(result).toEqual(mockSummary);
    });

    it('should throw error when summary fetch fails', async () => {
      mockHttpClient.get.mockResolvedValue({ success: false });

      await expect(dataService.getFleetSummary()).rejects.toThrow('Failed to get fleet summary');
    });
  });

  describe('getPerformanceAnalytics', () => {
    it('should fetch performance analytics with filters', async () => {
      const mockAnalytics = {
        timeSeries: [],
        summary: {},
        trends: {}
      };
      
      const filters = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        metricName: 'fuel_efficiency'
      };
      
      mockHttpClient.get.mockResolvedValue({ success: true, data: mockAnalytics });

      const result = await dataService.getPerformanceAnalytics(filters);

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'http://localhost:3001/analytics/performance?startDate=2024-01-01&endDate=2024-01-31&metricName=fuel_efficiency'
      );
      expect(result).toEqual(mockAnalytics);
    });
  });

  describe('getVehiclePerformance', () => {
    it('should fetch vehicle performance successfully', async () => {
      const mockPerformance = {
        vehicle: { id: '1', name: 'Truck-001' },
        metrics: { fuel_efficiency: 8.5, distance_traveled: 150 },
        trends: { improving: true, changePercent: 5.2 }
      };
      
      const filters = { startDate: '2024-01-01', endDate: '2024-01-31' };
      
      mockHttpClient.get.mockResolvedValue({ success: true, data: mockPerformance });

      const result = await dataService.getVehiclePerformance('1', filters);

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'http://localhost:3001/vehicles/1/performance?startDate=2024-01-01&endDate=2024-01-31'
      );
      expect(result).toEqual(mockPerformance);
    });
  });

  describe('getRoutePerformance', () => {
    it('should fetch route performance successfully', async () => {
      const mockPerformance = {
        route: { id: '1', name: 'City Delivery' },
        performance: { totalDistance: 500, averageSpeed: 25, efficiencyScore: 0.85 }
      };
      
      mockHttpClient.get.mockResolvedValue({ success: true, data: mockPerformance });

      const result = await dataService.getRoutePerformance('1');

      expect(mockHttpClient.get).toHaveBeenCalledWith('http://localhost:3001/fleet-routes/1/performance');
      expect(result).toEqual(mockPerformance);
    });
  });
});
