import { BaseService } from './BaseService';
import { HttpClient } from './HttpClient';
import { 
    IDataService, 
    Vehicle, 
    FleetRoute, 
    RouteSession, 
    PerformanceRecord,
    CreateVehicleRequest,
    UpdateVehicleRequest,
    CreateFleetRouteRequest,
    UpdateFleetRouteRequest,
    CreateRouteSessionRequest,
    UpdateRouteSessionRequest,
    CreatePerformanceRecordRequest,
    UpdatePerformanceRecordRequest,
    PerformanceRecordFilters,
    FleetSummary,
    PerformanceAnalytics,
    VehiclePerformance,
    RoutePerformance,
    AnalyticsFilters
} from './types';

export class DataService extends BaseService implements IDataService {
    private httpClient: HttpClient;
    private baseUrl: string;

    constructor(httpClient: HttpClient, baseUrl: string) {
        super('DataService');
        this.httpClient = httpClient;
        this.baseUrl = baseUrl;
    }

    protected async onInitialize(): Promise<void> {
        this.log('info', 'DataService initialized');
    }

    protected async onDestroy(): Promise<void> {
        this.log('info', 'DataService destroyed');
    }

    // Vehicles
    async getVehicles(): Promise<Vehicle[]> {
        this.validateReady();
        const response = await this.httpClient.get<Vehicle[]>(`${this.baseUrl}/vehicles`);
        return response.data || [];
    }

    async getVehicleById(id: string): Promise<Vehicle | null> {
        this.validateReady();
        try {
            const response = await this.httpClient.get<Vehicle>(`${this.baseUrl}/vehicles/${id}`);
            return response.data || null;
        } catch (error) {
            this.log('warn', `Vehicle ${id} not found:`, error.message);
            return null;
        }
    }

    async createVehicle(vehicle: CreateVehicleRequest): Promise<Vehicle> {
        this.validateReady();
        const response = await this.httpClient.post<Vehicle>(`${this.baseUrl}/vehicles`, vehicle);
        if (!response.success || !response.data) {
            throw new Error('Failed to create vehicle');
        }
        return response.data;
    }

    async updateVehicle(id: string, vehicle: UpdateVehicleRequest): Promise<Vehicle> {
        this.validateReady();
        const response = await this.httpClient.put<Vehicle>(`${this.baseUrl}/vehicles/${id}`, vehicle);
        if (!response.success || !response.data) {
            throw new Error('Failed to update vehicle');
        }
        return response.data;
    }

    async deleteVehicle(id: string): Promise<boolean> {
        this.validateReady();
        const response = await this.httpClient.delete(`${this.baseUrl}/vehicles/${id}`);
        return response.success;
    }

    // Fleet Routes
    async getFleetRoutes(): Promise<FleetRoute[]> {
        this.validateReady();
        const response = await this.httpClient.get<FleetRoute[]>(`${this.baseUrl}/fleet-routes`);
        return response.data || [];
    }

    async getFleetRouteById(id: string): Promise<FleetRoute | null> {
        this.validateReady();
        try {
            const response = await this.httpClient.get<FleetRoute>(`${this.baseUrl}/fleet-routes/${id}`);
            return response.data || null;
        } catch (error) {
            this.log('warn', `Fleet route ${id} not found:`, error.message);
            return null;
        }
    }

    async createFleetRoute(route: CreateFleetRouteRequest): Promise<FleetRoute> {
        this.validateReady();
        const response = await this.httpClient.post<FleetRoute>(`${this.baseUrl}/fleet-routes`, route);
        if (!response.success || !response.data) {
            throw new Error('Failed to create fleet route');
        }
        return response.data;
    }

    async updateFleetRoute(id: string, route: UpdateFleetRouteRequest): Promise<FleetRoute> {
        this.validateReady();
        const response = await this.httpClient.put<FleetRoute>(`${this.baseUrl}/fleet-routes/${id}`, route);
        if (!response.success || !response.data) {
            throw new Error('Failed to update fleet route');
        }
        return response.data;
    }

    async deleteFleetRoute(id: string): Promise<boolean> {
        this.validateReady();
        const response = await this.httpClient.delete(`${this.baseUrl}/fleet-routes/${id}`);
        return response.success;
    }

    // Route Sessions
    async getRouteSessions(): Promise<RouteSession[]> {
        this.validateReady();
        const response = await this.httpClient.get<RouteSession[]>(`${this.baseUrl}/route-sessions`);
        return response.data || [];
    }

    async getRouteSessionById(id: string): Promise<RouteSession | null> {
        this.validateReady();
        try {
            const response = await this.httpClient.get<RouteSession>(`${this.baseUrl}/route-sessions/${id}`);
            return response.data || null;
        } catch (error) {
            this.log('warn', `Route session ${id} not found:`, error.message);
            return null;
        }
    }

    async createRouteSession(session: CreateRouteSessionRequest): Promise<RouteSession> {
        this.validateReady();
        const response = await this.httpClient.post<RouteSession>(`${this.baseUrl}/route-sessions`, session);
        if (!response.success || !response.data) {
            throw new Error('Failed to create route session');
        }
        return response.data;
    }

    async updateRouteSession(id: string, session: UpdateRouteSessionRequest): Promise<RouteSession> {
        this.validateReady();
        const response = await this.httpClient.put<RouteSession>(`${this.baseUrl}/route-sessions/${id}`, session);
        if (!response.success || !response.data) {
            throw new Error('Failed to update route session');
        }
        return response.data;
    }

    async deleteRouteSession(id: string): Promise<boolean> {
        this.validateReady();
        const response = await this.httpClient.delete(`${this.baseUrl}/route-sessions/${id}`);
        return response.success;
    }

    // Performance Records
    async getPerformanceRecords(filters: PerformanceRecordFilters = {}): Promise<PerformanceRecord[]> {
        this.validateReady();
        const queryParams = new URLSearchParams();
        
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    value.forEach(v => queryParams.append(key, v.toString()));
                } else {
                    queryParams.append(key, value.toString());
                }
            }
        });

        const url = `${this.baseUrl}/performance-records${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await this.httpClient.get<PerformanceRecord[]>(url);
        return response.data || [];
    }

    async getPerformanceRecordById(id: string): Promise<PerformanceRecord | null> {
        this.validateReady();
        try {
            const response = await this.httpClient.get<PerformanceRecord>(`${this.baseUrl}/performance-records/${id}`);
            return response.data || null;
        } catch (error) {
            this.log('warn', `Performance record ${id} not found:`, error.message);
            return null;
        }
    }

    async createPerformanceRecord(record: CreatePerformanceRecordRequest): Promise<PerformanceRecord> {
        this.validateReady();
        const response = await this.httpClient.post<PerformanceRecord>(`${this.baseUrl}/performance-records`, record);
        if (!response.success || !response.data) {
            throw new Error('Failed to create performance record');
        }
        return response.data;
    }

    async createBatchPerformanceRecords(records: CreatePerformanceRecordRequest[]): Promise<PerformanceRecord[]> {
        this.validateReady();
        const response = await this.httpClient.post<PerformanceRecord[]>(`${this.baseUrl}/performance-records/batch`, records);
        if (!response.success || !response.data) {
            throw new Error('Failed to create batch performance records');
        }
        return response.data;
    }

    async updatePerformanceRecord(id: string, record: UpdatePerformanceRecordRequest): Promise<PerformanceRecord> {
        this.validateReady();
        const response = await this.httpClient.put<PerformanceRecord>(`${this.baseUrl}/performance-records/${id}`, record);
        if (!response.success || !response.data) {
            throw new Error('Failed to update performance record');
        }
        return response.data;
    }

    async deletePerformanceRecord(id: string): Promise<boolean> {
        this.validateReady();
        const response = await this.httpClient.delete(`${this.baseUrl}/performance-records/${id}`);
        return response.success;
    }

    // Analytics
    async getFleetSummary(): Promise<FleetSummary> {
        this.validateReady();
        const response = await this.httpClient.get<FleetSummary>(`${this.baseUrl}/analytics/summary`);
        if (!response.success || !response.data) {
            throw new Error('Failed to get fleet summary');
        }
        return response.data;
    }

    async getPerformanceAnalytics(filters: AnalyticsFilters): Promise<PerformanceAnalytics> {
        this.validateReady();
        const queryParams = new URLSearchParams();
        
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    value.forEach(v => queryParams.append(key, v.toString()));
                } else {
                    queryParams.append(key, value.toString());
                }
            }
        });

        const url = `${this.baseUrl}/analytics/performance${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await this.httpClient.get<PerformanceAnalytics>(url);
        if (!response.success || !response.data) {
            throw new Error('Failed to get performance analytics');
        }
        return response.data;
    }

    async getVehiclePerformance(vehicleId: string, filters: AnalyticsFilters = {}): Promise<VehiclePerformance> {
        this.validateReady();
        const queryParams = new URLSearchParams();
        
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    value.forEach(v => queryParams.append(key, v.toString()));
                } else {
                    queryParams.append(key, value.toString());
                }
            }
        });

        const url = `${this.baseUrl}/vehicles/${vehicleId}/performance${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await this.httpClient.get<VehiclePerformance>(url);
        if (!response.success || !response.data) {
            throw new Error('Failed to get vehicle performance');
        }
        return response.data;
    }

    async getRoutePerformance(routeId: string, filters: AnalyticsFilters = {}): Promise<RoutePerformance> {
        this.validateReady();
        const queryParams = new URLSearchParams();
        
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    value.forEach(v => queryParams.append(key, v.toString()));
                } else {
                    queryParams.append(key, value.toString());
                }
            }
        });

        const url = `${this.baseUrl}/fleet-routes/${routeId}/performance${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await this.httpClient.get<RoutePerformance>(url);
        if (!response.success || !response.data) {
            throw new Error('Failed to get route performance');
        }
        return response.data;
    }
}

export default DataService;
