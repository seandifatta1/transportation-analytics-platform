// Service Architecture Constants

export const SERVICE_NAMES = {
    HTTP_CLIENT: 'httpClient',
    STORAGE_SERVICE: 'storageService',
    NOTIFICATION_SERVICE: 'notificationService',
    AUTH_SERVICE: 'authService',
    DATA_SERVICE: 'dataService',
    CHART_SERVICE: 'chartService'
};

export const VEHICLE_TYPES = {
    DELIVERY: 'DELIVERY',
    PICKUP: 'PICKUP',
    VAN: 'VAN',
    SEMI: 'SEMI'
};

export const VEHICLE_STATUS = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    MAINTENANCE: 'MAINTENANCE',
    RETIRED: 'RETIRED'
};

export const ROUTE_TYPES = {
    CITY_ROUTES: 'CITY_ROUTES',
    LONG_HAUL: 'LONG_HAUL',
    PICKUP: 'PICKUP'
};

export const ROUTE_STATUS = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    SUSPENDED: 'SUSPENDED'
};

export const SESSION_STATUS = {
    SCHEDULED: 'SCHEDULED',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED'
};

export const CHART_TYPES = {
    BAR: 'BAR',
    LINE: 'LINE',
    PIE: 'PIE',
    SCATTER: 'SCATTER',
    AREA: 'AREA'
};