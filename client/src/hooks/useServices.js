import { useContext, useMemo } from 'react';
import { ServiceContext } from '../contexts/ServiceContext';
import { SERVICE_NAMES } from '../services/ServiceContainer';

/**
 * Hook to access the service container
 */
export const useServiceContainer = () => {
    const context = useContext(ServiceContext);
    if (!context) {
        throw new Error('useServiceContainer must be used within a ServiceProvider');
    }
    return context.container;
};

/**
 * Hook to get a specific service
 */
export const useService = (serviceName) => {
    const container = useServiceContainer();
    return container.get(serviceName);
};

/**
 * Hook to get multiple services at once
 */
export const useServices = (serviceNames) => {
    const container = useServiceContainer();
    return useMemo(() => {
        const services = {};
        serviceNames.forEach(name => {
            services[name] = container.get(name);
        });
        return services;
    }, [container, serviceNames]);
};

/**
 * Hook to get data service
 */
export const useDataService = () => {
    return useService(SERVICE_NAMES.DATA);
};

/**
 * Hook to get chart service
 */
export const useChartService = () => {
    return useService(SERVICE_NAMES.CHART);
};

/**
 * Hook to get auth service
 */
export const useAuthService = () => {
    return useService(SERVICE_NAMES.AUTH);
};

/**
 * Hook to get notification service
 */
export const useNotificationService = () => {
    return useService(SERVICE_NAMES.NOTIFICATION);
};

/**
 * Hook to get storage service
 */
export const useStorageService = () => {
    return useService(SERVICE_NAMES.STORAGE);
};

/**
 * Hook for data fetching with services
 */
export const useData = (dataType, options = {}) => {
    const dataService = useDataService();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            let result;
            switch (dataType) {
                case 'vehicles':
                    result = await dataService.getVehicles();
                    break;
                case 'fleetRoutes':
                    result = await dataService.getFleetRoutes();
                    break;
                case 'routeSessions':
                    result = await dataService.getRouteSessions();
                    break;
                case 'performanceRecords':
                    result = await dataService.getPerformanceRecords(options.filters);
                    break;
                case 'fleetSummary':
                    result = await dataService.getFleetSummary();
                    break;
                default:
                    throw new Error(`Unknown data type: ${dataType}`);
            }
            setData(result);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [dataService, dataType, options.filters]);

    useEffect(() => {
        if (options.autoFetch !== false) {
            fetchData();
        }
    }, [fetchData, options.autoFetch]);

    return {
        data,
        loading,
        error,
        refetch: fetchData
    };
};

/**
 * Hook for chart data with services
 */
export const useChartData = (chartType, filters = {}) => {
    const chartService = useChartService();
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchChartData = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            let result;
            switch (chartType) {
                case 'fleetPerformance':
                    result = await chartService.getFleetPerformanceChart(filters);
                    break;
                case 'vehicleEfficiency':
                    result = await chartService.getVehicleEfficiencyChart(filters);
                    break;
                case 'routePerformance':
                    result = await chartService.getRoutePerformanceChart(filters);
                    break;
                case 'timeSeries':
                    result = await chartService.getTimeSeriesChart(filters);
                    break;
                default:
                    throw new Error(`Unknown chart type: ${chartType}`);
            }
            setChartData(result);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [chartService, chartType, filters]);

    useEffect(() => {
        fetchChartData();
    }, [fetchChartData]);

    return {
        chartData,
        loading,
        error,
        refetch: fetchChartData
    };
};

/**
 * Hook for notifications
 */
export const useNotifications = () => {
    const notificationService = useNotificationService();
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const unsubscribe = notificationService.subscribe(setNotifications);
        return unsubscribe;
    }, [notificationService]);

    return {
        notifications,
        showSuccess: notificationService.showSuccess.bind(notificationService),
        showError: notificationService.showError.bind(notificationService),
        showWarning: notificationService.showWarning.bind(notificationService),
        showInfo: notificationService.showInfo.bind(notificationService),
        remove: notificationService.removeNotification.bind(notificationService),
        clear: notificationService.clearAllNotifications.bind(notificationService)
    };
};

/**
 * Hook for storage operations
 */
export const useStorage = () => {
    const storageService = useStorageService();

    return {
        get: storageService.get.bind(storageService),
        set: storageService.set.bind(storageService),
        remove: storageService.remove.bind(storageService),
        clear: storageService.clear.bind(storageService),
        has: storageService.has.bind(storageService),
        keys: storageService.keys.bind(storageService)
    };
};

export default {
    useServiceContainer,
    useService,
    useServices,
    useDataService,
    useChartService,
    useAuthService,
    useNotificationService,
    useStorageService,
    useData,
    useChartData,
    useNotifications,
    useStorage
};
