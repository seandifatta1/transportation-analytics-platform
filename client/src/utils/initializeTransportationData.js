// Transportation Data Initialization Utility
// This utility loads stub data into Redux store for development

import { 
    setPerformanceRecords,
    setVehicles,
    setFleetRoutes,
    setRouteSessions,
    setDrivers
} from '../redux/slices/dataSlice';
import transportationStubData from '../data/transportationStubData';

/**
 * Initialize the Redux store with transportation stub data
 * @param {Function} dispatch - Redux dispatch function
 */
export const initializeTransportationData = (dispatch) => {
    console.log('Initializing transportation data...');
    
    // Load all transportation data into Redux store
    dispatch(setVehicles(transportationStubData.vehicles));
    dispatch(setFleetRoutes(transportationStubData.fleetRoutes));
    dispatch(setRouteSessions(transportationStubData.routeSessions));
    dispatch(setPerformanceRecords(transportationStubData.performanceRecords));
    dispatch(setDrivers(transportationStubData.drivers));
    
    console.log('Transportation data initialized successfully');
};

/**
 * Get performance records for a specific vehicle
 * @param {string} vehicleId - The vehicle ID
 * @returns {Array} Array of performance records for the vehicle
 */
export const getVehiclePerformanceRecords = (vehicleId) => {
    return transportationStubData.getPerformanceRecordsByVehicle(vehicleId);
};

/**
 * Get performance records for a specific session
 * @param {string} sessionId - The session ID
 * @returns {Array} Array of performance records for the session
 */
export const getSessionPerformanceRecords = (sessionId) => {
    return transportationStubData.getPerformanceRecordsBySession(sessionId);
};

/**
 * Get performance records for a specific metric
 * @param {string} metricName - The metric name (e.g., 'fuel_efficiency', 'average_speed')
 * @returns {Array} Array of performance records for the metric
 */
export const getMetricPerformanceRecords = (metricName) => {
    return transportationStubData.getPerformanceRecordsByMetric(metricName);
};

/**
 * Get vehicle information by ID
 * @param {string} vehicleId - The vehicle ID
 * @returns {Object} Vehicle object or undefined
 */
export const getVehicleById = (vehicleId) => {
    return transportationStubData.getVehicleById(vehicleId);
};

/**
 * Get route information by ID
 * @param {string} routeId - The route ID
 * @returns {Object} Route object or undefined
 */
export const getRouteById = (routeId) => {
    return transportationStubData.getRouteById(routeId);
};

/**
 * Get session information by ID
 * @param {string} sessionId - The session ID
 * @returns {Object} Session object or undefined
 */
export const getSessionById = (sessionId) => {
    return transportationStubData.getSessionById(sessionId);
};

/**
 * Get performance data for charts (fuel efficiency over time, etc.)
 * @param {string} vehicleId - Optional vehicle ID to filter by
 * @param {string} metricName - Optional metric name to filter by
 * @returns {Array} Formatted data for charts
 */
export const getChartData = (vehicleId = null, metricName = null) => {
    let records = transportationStubData.performanceRecords;
    
    // Filter by vehicle if specified
    if (vehicleId) {
        records = records.filter(record => record.vehicleId === vehicleId);
    }
    
    // Filter by metric if specified
    if (metricName) {
        records = records.filter(record => record.metricName === metricName);
    }
    
    // Sort by timestamp
    records.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    return records;
};

/**
 * Get fleet performance summary statistics
 * @returns {Object} Summary statistics for the fleet
 */
export const getFleetPerformanceSummary = () => {
    const records = transportationStubData.performanceRecords;
    const vehicles = transportationStubData.vehicles;
    const routes = transportationStubData.fleetRoutes;
    const sessions = transportationStubData.routeSessions;
    
    // Calculate summary statistics
    const totalVehicles = vehicles.length;
    const activeVehicles = vehicles.filter(v => v.status === 'ACTIVE').length;
    const totalRoutes = routes.length;
    const completedSessions = sessions.filter(s => s.status === 'COMPLETED').length;
    const activeSessions = sessions.filter(s => s.status === 'IN_PROGRESS').length;
    
    // Calculate average fuel efficiency
    const fuelEfficiencyRecords = records.filter(r => r.metricName === 'fuel_efficiency');
    const avgFuelEfficiency = fuelEfficiencyRecords.length > 0 
        ? fuelEfficiencyRecords.reduce((sum, r) => sum + r.metricValue, 0) / fuelEfficiencyRecords.length
        : 0;
    
    // Calculate total distance traveled
    const distanceRecords = records.filter(r => r.metricName === 'distance_traveled');
    const totalDistance = distanceRecords.reduce((sum, r) => sum + r.metricValue, 0);
    
    return {
        totalVehicles,
        activeVehicles,
        totalRoutes,
        completedSessions,
        activeSessions,
        avgFuelEfficiency: Math.round(avgFuelEfficiency * 10) / 10,
        totalDistance: Math.round(totalDistance * 10) / 10
    };
};

export default {
    initializeTransportationData,
    getVehiclePerformanceRecords,
    getSessionPerformanceRecords,
    getMetricPerformanceRecords,
    getVehicleById,
    getRouteById,
    getSessionById,
    getChartData,
    getFleetPerformanceSummary
};
