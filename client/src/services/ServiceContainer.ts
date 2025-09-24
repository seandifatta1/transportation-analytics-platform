import { IService, IServiceContainer } from './types';

/**
 * Simple Dependency Injection Container
 * Manages service registration, instantiation, and lifecycle
 */
export class ServiceContainer implements IServiceContainer {
  private services = new Map<string, IService>();
  private serviceInstances = new Map<string, IService>();
  private initialized = false;

  /**
   * Register a service with the container
   */
  register<T extends IService>(name: string, service: T): void {
    if (this.initialized) {
      throw new Error(`Cannot register service '${name}' after container initialization`);
    }
    
    if (this.services.has(name)) {
      throw new Error(`Service '${name}' is already registered`);
    }

    this.services.set(name, service);
  }

  /**
   * Get a service instance from the container
   */
  get<T extends IService>(name: string): T {
    if (!this.services.has(name)) {
      throw new Error(`Service '${name}' is not registered`);
    }

    // Return existing instance if available
    if (this.serviceInstances.has(name)) {
      return this.serviceInstances.get(name) as T;
    }

    // Create new instance
    const ServiceClass = this.services.get(name)!;
    const instance = ServiceClass as T;
    this.serviceInstances.set(name, instance);
    
    return instance;
  }

  /**
   * Check if a service is registered
   */
  has(name: string): boolean {
    return this.services.has(name);
  }

  /**
   * Initialize all registered services
   */
  async initializeAll(): Promise<void> {
    if (this.initialized) {
      return;
    }

    const initPromises = Array.from(this.services.keys()).map(async (name) => {
      try {
        const service = this.get(name);
        await service.initialize();
        console.log(`Service '${name}' initialized successfully`);
      } catch (error) {
        console.error(`Failed to initialize service '${name}':`, error);
        throw error;
      }
    });

    await Promise.all(initPromises);
    this.initialized = true;
  }

  /**
   * Destroy all service instances
   */
  async destroyAll(): Promise<void> {
    const destroyPromises = Array.from(this.serviceInstances.values()).map(async (service) => {
      try {
        await service.destroy();
      } catch (error) {
        console.error(`Error destroying service '${service.name}':`, error);
      }
    });

    await Promise.all(destroyPromises);
    this.serviceInstances.clear();
    this.initialized = false;
  }

  /**
   * Get all registered service names
   */
  getServiceNames(): string[] {
    return Array.from(this.services.keys());
  }

  /**
   * Check if container is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Reset the container (useful for testing)
   */
  reset(): void {
    this.services.clear();
    this.serviceInstances.clear();
    this.initialized = false;
  }
}

// Global service container instance
export const serviceContainer = new ServiceContainer();

// Service name constants
export const SERVICE_NAMES = {
  DATA: 'DataService',
  AUTH: 'AuthService',
  CHART: 'ChartService',
  NOTIFICATION: 'NotificationService',
  STORAGE: 'StorageService',
} as const;

// Service factory functions
export const createServiceContainer = (): ServiceContainer => {
  return new ServiceContainer();
};

// Hook for using services in React components
export const useService = <T extends IService>(name: string): T => {
  return serviceContainer.get<T>(name);
};

// Higher-order component for injecting services
export const withServices = <P extends object>(
  Component: React.ComponentType<P>,
  serviceNames: string[]
) => {
  return (props: P) => {
    const services = serviceNames.reduce((acc, name) => {
      acc[name] = serviceContainer.get(name);
      return acc;
    }, {} as Record<string, IService>);

    return <Component {...props} services={services} />;
  };
};

// Service provider component
export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [initialized, setInitialized] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const initializeServices = async () => {
      try {
        await serviceContainer.initializeAll();
        setInitialized(true);
      } catch (err) {
        setError(err as Error);
      }
    };

    initializeServices();

    return () => {
      serviceContainer.destroyAll();
    };
  }, []);

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Service Initialization Error</h2>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  if (!initialized) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Initializing Services...</h2>
        <div>Please wait while services are being initialized.</div>
      </div>
    );
  }

  return <>{children}</>;
};

export default serviceContainer;
