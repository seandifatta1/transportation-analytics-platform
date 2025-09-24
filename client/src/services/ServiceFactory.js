import { ServiceContainer, SERVICE_NAMES } from './ServiceContainer';
import { HttpClient } from './HttpClient';
import { DataService } from './DataService';
import { ChartService } from './ChartService';
import { NotificationService } from './NotificationService';
import { StorageService } from './StorageService';
import { AuthService } from './authService';

export class ServiceFactory {
    private container: ServiceContainer;
    private baseUrl: string;

    constructor(baseUrl: string = process.env.REACT_APP_BASE_URL || 'http://localhost:3001') {
        this.container = new ServiceContainer();
        this.baseUrl = baseUrl;
    }

    /**
     * Initialize all services with proper dependencies
     */
    async initializeServices(): Promise<ServiceContainer> {
        try {
            // Create core services first
            const httpClient = new HttpClient({
                baseURL: this.baseUrl,
                timeout: 10000,
                retries: 3,
                retryDelay: 1000
            });

            const storageService = new StorageService();
            const notificationService = new NotificationService();
            const authService = new AuthService();
            const dataService = new DataService(httpClient, this.baseUrl);
            const chartService = new ChartService(dataService);

            // Register services in dependency order
            this.container.register(SERVICE_NAMES.STORAGE, storageService);
            this.container.register(SERVICE_NAMES.NOTIFICATION, notificationService);
            this.container.register('HttpClient', httpClient);
            this.container.register(SERVICE_NAMES.AUTH, authService);
            this.container.register(SERVICE_NAMES.DATA, dataService);
            this.container.register(SERVICE_NAMES.CHART, chartService);

            // Initialize all services
            await this.container.initializeAll();

            return this.container;
        } catch (error) {
            console.error('Failed to initialize services:', error);
            throw error;
        }
    }

    /**
     * Create services for testing with mocks
     */
    async initializeTestServices(mocks: Record<string, any> = {}): Promise<ServiceContainer> {
        const testContainer = new ServiceContainer();
        
        // Create mock services
        const mockHttpClient = mocks.httpClient || this.createMockHttpClient();
        const mockStorageService = mocks.storageService || this.createMockStorageService();
        const mockNotificationService = mocks.notificationService || this.createMockNotificationService();
        const mockAuthService = mocks.authService || this.createMockAuthService();
        const mockDataService = mocks.dataService || this.createMockDataService();
        const mockChartService = mocks.chartService || this.createMockChartService();

        // Register mock services
        testContainer.register(SERVICE_NAMES.STORAGE, mockStorageService);
        testContainer.register(SERVICE_NAMES.NOTIFICATION, mockNotificationService);
        testContainer.register('HttpClient', mockHttpClient);
        testContainer.register(SERVICE_NAMES.AUTH, mockAuthService);
        testContainer.register(SERVICE_NAMES.DATA, mockDataService);
        testContainer.register(SERVICE_NAMES.CHART, mockChartService);

        // Initialize all services
        await testContainer.initializeAll();

        return testContainer;
    }

    /**
     * Create a service container with specific configuration
     */
    async createCustomServices(config: {
        baseUrl?: string;
        httpTimeout?: number;
        storagePrefix?: string;
        enableLogging?: boolean;
    }): Promise<ServiceContainer> {
        const container = new ServiceContainer();
        const baseUrl = config.baseUrl || this.baseUrl;

        // Create services with custom configuration
        const httpClient = new HttpClient({
            baseURL: baseUrl,
            timeout: config.httpTimeout || 10000,
            retries: 3,
            retryDelay: 1000
        });

        const storageService = new StorageService(config.storagePrefix);
        const notificationService = new NotificationService();
        const authService = new AuthService();
        const dataService = new DataService(httpClient, baseUrl);
        const chartService = new ChartService(dataService);

        // Register services
        container.register(SERVICE_NAMES.STORAGE, storageService);
        container.register(SERVICE_NAMES.NOTIFICATION, notificationService);
        container.register('HttpClient', httpClient);
        container.register(SERVICE_NAMES.AUTH, authService);
        container.register(SERVICE_NAMES.DATA, dataService);
        container.register(SERVICE_NAMES.CHART, chartService);

        // Initialize all services
        await container.initializeAll();

        return container;
    }

    // Mock service creators
    private createMockHttpClient() {
        return {
            name: 'MockHttpClient',
            async initialize() {},
            async destroy() {},
            async get() { return { success: true, data: [] }; },
            async post() { return { success: true, data: {} }; },
            async put() { return { success: true, data: {} }; },
            async delete() { return { success: true }; },
            setAuthToken() {},
            removeAuthToken() {}
        };
    }

    private createMockStorageService() {
        const storage = new Map();
        return {
            name: 'MockStorageService',
            async initialize() {},
            async destroy() {},
            get: (key) => storage.get(key) || null,
            set: (key, value) => storage.set(key, value),
            remove: (key) => storage.delete(key),
            clear: () => storage.clear(),
            has: (key) => storage.has(key),
            keys: () => Array.from(storage.keys())
        };
    }

    private createMockNotificationService() {
        return {
            name: 'MockNotificationService',
            async initialize() {},
            async destroy() {},
            showSuccess: (message) => console.log(`SUCCESS: ${message}`),
            showError: (message) => console.log(`ERROR: ${message}`),
            showWarning: (message) => console.log(`WARNING: ${message}`),
            showInfo: (message) => console.log(`INFO: ${message}`)
        };
    }

    private createMockAuthService() {
        return {
            name: 'MockAuthService',
            async initialize() {},
            async destroy() {},
            async login() { return { success: true, user: { id: '1', email: 'test@test.com' } }; },
            async register() { return { success: true, user: { id: '1', email: 'test@test.com' } }; },
            async logout() {},
            async validateSession() { return { valid: true, user: { id: '1', email: 'test@test.com' } }; },
            getCurrentUser: () => ({ id: '1', email: 'test@test.com' }),
            isAuthenticated: () => true
        };
    }

    private createMockDataService() {
        return {
            name: 'MockDataService',
            async initialize() {},
            async destroy() {},
            async getVehicles() { return []; },
            async getFleetRoutes() { return []; },
            async getRouteSessions() { return []; },
            async getPerformanceRecords() { return []; },
            async getFleetSummary() { return { totalVehicles: 0, totalDistance: 0 }; }
        };
    }

    private createMockChartService() {
        return {
            name: 'MockChartService',
            async initialize() {},
            async destroy() {},
            async getChartData() { return { labels: [], datasets: [] }; },
            async getFleetPerformanceChart() { return { labels: [], datasets: [], summary: {} }; },
            async getVehicleEfficiencyChart() { return { labels: [], datasets: [], vehicle: {}, efficiencyScore: 0 }; },
            async getRoutePerformanceChart() { return { labels: [], datasets: [], route: {}, performance: {} }; },
            async getTimeSeriesChart() { return { labels: [], datasets: [], metric: {}, trends: {} }; }
        };
    }
}

export default ServiceFactory;
