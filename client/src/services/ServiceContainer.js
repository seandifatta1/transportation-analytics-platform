export class ServiceContainer {
    constructor() {
        this.services = new Map();
        this.serviceInstances = new Map();
        this.initialized = false;
    }

    register(name, serviceFactory) {
        if (this.initialized) {
            throw new Error(`Cannot register service '${name}' after container initialization`);
        }
        
        if (this.services.has(name)) {
            throw new Error(`Service '${name}' is already registered`);
        }

        this.services.set(name, serviceFactory);
    }

    get(name) {
        if (!this.services.has(name)) {
            throw new Error(`Service '${name}' is not registered`);
        }

        if (!this.serviceInstances.has(name)) {
            const serviceFactory = this.services.get(name);
            const instance = serviceFactory();
            this.serviceInstances.set(name, instance);
        }

        return this.serviceInstances.get(name);
    }

    has(name) {
        return this.services.has(name);
    }

    async initializeAll() {
        if (this.initialized) {
            return;
        }

        for (const [name, serviceFactory] of this.services) {
            try {
                const service = this.get(name);
                if (service && typeof service.initialize === 'function') {
                    await service.initialize();
                }
            } catch (error) {
                console.error(`Failed to initialize service '${name}':`, error);
            }
        }

        this.initialized = true;
    }

    async destroyAll() {
        for (const [name, instance] of this.serviceInstances) {
            try {
                if (instance && typeof instance.destroy === 'function') {
                    await instance.destroy();
                }
            } catch (error) {
                console.error(`Failed to destroy service '${name}':`, error);
            }
        }

        this.serviceInstances.clear();
        this.initialized = false;
    }
}

export const SERVICE_NAMES = {
    HTTP_CLIENT: 'httpClient',
    STORAGE_SERVICE: 'storageService',
    NOTIFICATION_SERVICE: 'notificationService',
    AUTH_SERVICE: 'authService',
    DATA_SERVICE: 'dataService',
    CHART_SERVICE: 'chartService'
};

export default ServiceContainer;