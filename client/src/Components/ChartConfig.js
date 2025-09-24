// Transportation Analytics Chart Configuration
export const CHART_COLORS = {
    primary: '#1976d2',
    secondary: '#dc004e',
    success: '#2e7d32',
    warning: '#ed6c02',
    info: '#0288d1',
    error: '#d32f2f',
    fuel: '#2e7d32',
    distance: '#1976d2',
    speed: '#ed6c02',
    idle: '#9c27b0'
};

export const METRIC_CONFIG = {
    fuel_efficiency: {
        label: 'Fuel Efficiency',
        unit: 'mpg',
        color: CHART_COLORS.fuel,
        icon: 'LocalGasStation',
        description: 'Miles per gallon efficiency'
    },
    distance_traveled: {
        label: 'Distance Traveled',
        unit: 'miles',
        color: CHART_COLORS.distance,
        icon: 'Route',
        description: 'Total distance covered'
    },
    average_speed: {
        label: 'Average Speed',
        unit: 'mph',
        color: CHART_COLORS.speed,
        icon: 'Speed',
        description: 'Average vehicle speed'
    },
    idle_time: {
        label: 'Idle Time',
        unit: 'hours',
        color: CHART_COLORS.idle,
        icon: 'AccessTime',
        description: 'Time spent idling'
    },
    maintenance_hours: {
        label: 'Maintenance Hours',
        unit: 'hours',
        color: CHART_COLORS.warning,
        icon: 'Build',
        description: 'Time spent on maintenance'
    },
    delivery_count: {
        label: 'Delivery Count',
        unit: 'deliveries',
        color: CHART_COLORS.info,
        icon: 'LocalShipping',
        description: 'Number of deliveries completed'
    }
};

export const VEHICLE_TYPES = {
    DELIVERY: {
        label: 'Delivery Truck',
        color: CHART_COLORS.primary,
        icon: 'LocalShipping'
    },
    PICKUP: {
        label: 'Pickup Truck',
        color: CHART_COLORS.secondary,
        icon: 'DirectionsCar'
    },
    VAN: {
        label: 'Van',
        color: CHART_COLORS.success,
        icon: 'DirectionsBus'
    },
    SEMI: {
        label: 'Semi Truck',
        color: CHART_COLORS.warning,
        icon: 'LocalShipping'
    }
};

export const ROUTE_TYPES = {
    CITY_ROUTES: {
        label: 'City Routes',
        color: CHART_COLORS.primary,
        description: 'Urban delivery routes'
    },
    LONG_HAUL: {
        label: 'Long Haul',
        color: CHART_COLORS.secondary,
        description: 'Interstate transportation'
    },
    PICKUP: {
        label: 'Pickup Routes',
        color: CHART_COLORS.success,
        description: 'Local pickup and delivery'
    }
};

export const CHART_THEMES = {
    light: {
        background: '#ffffff',
        text: '#333333',
        grid: '#e0e0e0',
        border: '#cccccc'
    },
    dark: {
        background: '#121212',
        text: '#ffffff',
        grid: '#333333',
        border: '#555555'
    }
};

export const DEFAULT_CHART_PROPS = {
    height: 400,
    margin: { left: 100, right: 50, top: 50, bottom: 50 },
    grid: { vertical: true, horizontal: true }
};

export const TIME_RANGES = {
    week: {
        label: 'Week',
        days: 7,
        format: 'MMM DD'
    },
    month: {
        label: 'Month',
        days: 30,
        format: 'MMM DD'
    },
    quarter: {
        label: 'Quarter',
        days: 90,
        format: 'MMM YYYY'
    },
    year: {
        label: 'Year',
        days: 365,
        format: 'MMM YYYY'
    }
};

// Helper functions
export const getMetricConfig = (metric) => {
    return METRIC_CONFIG[metric] || {
        label: metric.replace('_', ' ').toUpperCase(),
        unit: 'unknown',
        color: CHART_COLORS.primary,
        icon: 'TrendingUp',
        description: 'Performance metric'
    };
};

export const getVehicleTypeConfig = (type) => {
    return VEHICLE_TYPES[type] || {
        label: type,
        color: CHART_COLORS.primary,
        icon: 'DirectionsCar'
    };
};

export const getRouteTypeConfig = (type) => {
    return ROUTE_TYPES[type] || {
        label: type,
        color: CHART_COLORS.primary,
        description: 'Route type'
    };
};

export const formatValue = (value, metric) => {
    const config = getMetricConfig(metric);
    return `${value.toFixed(2)} ${config.unit}`;
};

export const formatDate = (date, timeRange = 'month') => {
    const config = TIME_RANGES[timeRange];
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: timeRange === 'year' ? 'numeric' : undefined
    });
};

export const calculateEfficiencyScore = (fuelEfficiency, distance, speed, idleTime) => {
    // Normalize values and calculate weighted efficiency score
    const fuelScore = Math.min(fuelEfficiency / 15, 1); // Max 15 mpg = 1.0
    const distanceScore = Math.min(distance / 200, 1); // Max 200 miles = 1.0
    const speedScore = Math.min(speed / 60, 1); // Max 60 mph = 1.0
    const idleScore = Math.max(0, 1 - (idleTime / 8)); // Max 8 hours idle = 0.0
    
    return (fuelScore * 0.4 + distanceScore * 0.3 + speedScore * 0.2 + idleScore * 0.1);
};

export const generateChartPalette = (count) => {
    const colors = [
        CHART_COLORS.primary,
        CHART_COLORS.secondary,
        CHART_COLORS.success,
        CHART_COLORS.warning,
        CHART_COLORS.info,
        CHART_COLORS.fuel,
        CHART_COLORS.distance,
        CHART_COLORS.speed
    ];
    
    return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
};

export default {
    CHART_COLORS,
    METRIC_CONFIG,
    VEHICLE_TYPES,
    ROUTE_TYPES,
    CHART_THEMES,
    DEFAULT_CHART_PROPS,
    TIME_RANGES,
    getMetricConfig,
    getVehicleTypeConfig,
    getRouteTypeConfig,
    formatValue,
    formatDate,
    calculateEfficiencyScore,
    generateChartPalette
};
