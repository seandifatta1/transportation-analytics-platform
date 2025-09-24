import { ServiceContainer, SERVICE_NAMES } from '../ServiceContainer';
import { ServiceFactory } from '../ServiceFactory';

// Mock services
const mockDataService = {
  name: 'DataService',
  async initialize() {},
  async destroy() {},
  getVehicles: jest.fn(),
  getFleetRoutes: jest.fn()
};

const mockChartService = {
  name: 'ChartService',
  async initialize() {},
  async destroy() {},
  getChartData: jest.fn()
};

const mockNotificationService = {
  name: 'NotificationService',
  async initialize() {},
  async destroy() {},
  showSuccess: jest.fn(),
  showError: jest.fn()
};

describe('ServiceContainer', () => {
  let container;

  beforeEach(() => {
    container = new ServiceContainer();
    jest.clearAllMocks();
  });

  afterEach(() => {
    if (container) {
      container.destroyAll();
    }
  });

  describe('Service Registration', () => {
    it('should register a service', () => {
      container.register('TestService', mockDataService);
      expect(container.get('TestService')).toBe(mockDataService);
    });

    it('should register multiple services', () => {
      container.register('DataService', mockDataService);
      container.register('ChartService', mockChartService);
      
      expect(container.get('DataService')).toBe(mockDataService);
      expect(container.get('ChartService')).toBe(mockChartService);
    });

    it('should throw error when getting unregistered service', () => {
      expect(() => container.get('NonExistentService')).toThrow('Service NonExistentService not found');
    });
  });

  describe('Service Lifecycle', () => {
    it('should initialize all services', async () => {
      const initSpy1 = jest.spyOn(mockDataService, 'initialize');
      const initSpy2 = jest.spyOn(mockChartService, 'initialize');
      
      container.register('DataService', mockDataService);
      container.register('ChartService', mockChartService);
      
      await container.initializeAll();
      
      expect(initSpy1).toHaveBeenCalled();
      expect(initSpy2).toHaveBeenCalled();
    });

    it('should destroy all services', async () => {
      const destroySpy1 = jest.spyOn(mockDataService, 'destroy');
      const destroySpy2 = jest.spyOn(mockChartService, 'destroy');
      
      container.register('DataService', mockDataService);
      container.register('ChartService', mockChartService);
      
      await container.initializeAll();
      container.destroyAll();
      
      expect(destroySpy1).toHaveBeenCalled();
      expect(destroySpy2).toHaveBeenCalled();
    });

    it('should handle initialization errors gracefully', async () => {
      const errorService = {
        name: 'ErrorService',
        async initialize() {
          throw new Error('Initialization failed');
        },
        async destroy() {}
      };
      
      container.register('ErrorService', errorService);
      
      await expect(container.initializeAll()).rejects.toThrow('Initialization failed');
    });
  });

  describe('Service Dependencies', () => {
    it('should handle circular dependencies', () => {
      const serviceA = {
        name: 'ServiceA',
        async initialize() {},
        async destroy() {}
      };
      
      const serviceB = {
        name: 'ServiceB',
        async initialize() {},
        async destroy() {}
      };
      
      container.register('ServiceA', serviceA);
      container.register('ServiceB', serviceB);
      
      expect(() => container.initializeAll()).not.toThrow();
    });
  });

  describe('Service Factory', () => {
    let factory;

    beforeEach(() => {
      factory = new ServiceFactory('http://localhost:3001');
    });

    it('should create services with factory', async () => {
      const container = await factory.initializeServices();
      
      expect(container).toBeDefined();
      expect(container.get(SERVICE_NAMES.DATA)).toBeDefined();
      expect(container.get(SERVICE_NAMES.CHART)).toBeDefined();
      expect(container.get(SERVICE_NAMES.NOTIFICATION)).toBeDefined();
    });

    it('should create test services with factory', async () => {
      const container = await factory.initializeTestServices();
      
      expect(container).toBeDefined();
      expect(container.get(SERVICE_NAMES.DATA)).toBeDefined();
      expect(container.get(SERVICE_NAMES.CHART)).toBeDefined();
      expect(container.get(SERVICE_NAMES.NOTIFICATION)).toBeDefined();
    });

    it('should create custom services with factory', async () => {
      const container = await factory.createCustomServices({
        baseUrl: 'http://localhost:3002',
        httpTimeout: 5000,
        storagePrefix: 'test_',
        enableLogging: true
      });
      
      expect(container).toBeDefined();
      expect(container.get(SERVICE_NAMES.DATA)).toBeDefined();
    });
  });

  describe('Service Constants', () => {
    it('should have correct service names', () => {
      expect(SERVICE_NAMES.DATA).toBe('DataService');
      expect(SERVICE_NAMES.CHART).toBe('ChartService');
      expect(SERVICE_NAMES.NOTIFICATION).toBe('NotificationService');
      expect(SERVICE_NAMES.STORAGE).toBe('StorageService');
      expect(SERVICE_NAMES.AUTH).toBe('AuthService');
    });
  });
});
