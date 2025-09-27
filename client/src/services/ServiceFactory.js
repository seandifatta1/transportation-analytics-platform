import { ServiceContainer, SERVICE_NAMES } from './ServiceContainer.js';
import { HttpClient } from './HttpClient.js';
import { DataService } from './DataService.js';
import { ChartService } from './ChartService.js';
import { NotificationService } from './NotificationService.js';
import { StorageService } from './StorageService.js';
import AuthService from './authService.js';

export class ServiceFactory {
    constructor(baseUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:8081') {
        this.container = new ServiceContainer();
        this.baseUrl = baseUrl;
    }

    /**
     * Initialize all services with proper dependencies
     */
    initializeServices() {
        try {
            // Register HttpClient first (no dependencies)
            this.container.register(SERVICE_NAMES.HTTP_CLIENT, () => new HttpClient(this.baseUrl));

            // Register StorageService (no dependencies)
            this.container.register(SERVICE_NAMES.STORAGE_SERVICE, () => new StorageService());

            // Register NotificationService (no dependencies)
            this.container.register(SERVICE_NAMES.NOTIFICATION_SERVICE, () => new NotificationService());

            // Register AuthService (depends on HttpClient and StorageService)
            this.container.register(SERVICE_NAMES.AUTH_SERVICE, () => {
                const httpClient = this.container.get(SERVICE_NAMES.HTTP_CLIENT);
                const storageService = this.container.get(SERVICE_NAMES.STORAGE_SERVICE);
                return new AuthService(httpClient, storageService);
            });

            // Register DataService (depends on HttpClient only for now)
            this.container.register(SERVICE_NAMES.DATA_SERVICE, () => {
                const httpClient = this.container.get(SERVICE_NAMES.HTTP_CLIENT);
                return new DataService(httpClient);
            });

            // Register ChartService (depends on DataService)
            this.container.register(SERVICE_NAMES.CHART_SERVICE, () => {
                const dataService = this.container.get(SERVICE_NAMES.DATA_SERVICE);
                return new ChartService(dataService);
            });

            console.log('Services initialized successfully');
        } catch (error) {
            console.error('Error initializing services:', error);
            throw error;
        }
    }

    /**
     * Get a service instance
     */
    getService(serviceName) {
        return this.container.get(serviceName);
    }

    /**
     * Get all services
     */
    getAllServices() {
        return {
            httpClient: this.getService(SERVICE_NAMES.HTTP_CLIENT),
            storageService: this.getService(SERVICE_NAMES.STORAGE_SERVICE),
            notificationService: this.getService(SERVICE_NAMES.NOTIFICATION_SERVICE),
            authService: this.getService(SERVICE_NAMES.AUTH_SERVICE),
            dataService: this.getService(SERVICE_NAMES.DATA_SERVICE),
            chartService: this.getService(SERVICE_NAMES.CHART_SERVICE)
        };
    }

    /**
     * Create a new service factory instance
     */
    static create(baseUrl) {
        const factory = new ServiceFactory(baseUrl);
        factory.initializeServices();
        return factory;
    }
}

export default ServiceFactory;