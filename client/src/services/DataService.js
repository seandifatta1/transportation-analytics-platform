import { BaseService } from './BaseService.js';

export class DataService extends BaseService {
    constructor(httpClient, authService) {
        super('DataService');
        this.httpClient = httpClient;
        this.authService = authService;
    }

    async initialize() {
        console.log('DataService initialized');
    }

    async destroy() {
        console.log('DataService destroyed');
    }

    // Vehicles
    async getVehicles() {
        return this.httpClient.get('/vehicles');
    }

    async getVehicleById(id) {
        return this.httpClient.get(`/vehicles/${id}`);
    }

    async createVehicle(vehicle) {
        return this.httpClient.post('/vehicles', vehicle);
    }

    async updateVehicle(id, vehicle) {
        return this.httpClient.put(`/vehicles/${id}`, vehicle);
    }

    async deleteVehicle(id) {
        return this.httpClient.delete(`/vehicles/${id}`);
    }

    // Fleet Routes
    async getFleetRoutes() {
        return this.httpClient.get('/fleet-routes');
    }

    async getFleetRouteById(id) {
        return this.httpClient.get(`/fleet-routes/${id}`);
    }

    async createFleetRoute(route) {
        return this.httpClient.post('/fleet-routes', route);
    }

    async updateFleetRoute(id, route) {
        return this.httpClient.put(`/fleet-routes/${id}`, route);
    }

    async deleteFleetRoute(id) {
        return this.httpClient.delete(`/fleet-routes/${id}`);
    }

    // Route Sessions
    async getRouteSessions() {
        return this.httpClient.get('/route-sessions');
    }

    async getRouteSessionById(id) {
        return this.httpClient.get(`/route-sessions/${id}`);
    }

    async createRouteSession(session) {
        return this.httpClient.post('/route-sessions', session);
    }

    async updateRouteSession(id, session) {
        return this.httpClient.put(`/route-sessions/${id}`, session);
    }

    async deleteRouteSession(id) {
        return this.httpClient.delete(`/route-sessions/${id}`);
    }

    // Performance Records
    async getPerformanceRecords(filters = {}) {
        return this.httpClient.get('/performance-records', { params: filters });
    }

    async getPerformanceRecordById(id) {
        return this.httpClient.get(`/performance-records/${id}`);
    }

    async createPerformanceRecord(record) {
        return this.httpClient.post('/performance-records', record);
    }

    async createBatchPerformanceRecords(records) {
        return this.httpClient.post('/performance-records/batch', { records });
    }

    async updatePerformanceRecord(id, record) {
        return this.httpClient.put(`/performance-records/${id}`, record);
    }

    async deletePerformanceRecord(id) {
        return this.httpClient.delete(`/performance-records/${id}`);
    }

    // Analytics
    async getFleetSummary() {
        return this.httpClient.get('/analytics/fleet-summary');
    }

    async getPerformanceAnalytics(filters) {
        return this.httpClient.get('/analytics/performance', { params: filters });
    }

    async getVehiclePerformance(vehicleId, filters = {}) {
        return this.httpClient.get(`/analytics/vehicle/${vehicleId}`, { params: filters });
    }

    async getRoutePerformance(routeId, filters = {}) {
        return this.httpClient.get(`/analytics/route/${routeId}`, { params: filters });
    }
}

export default DataService;