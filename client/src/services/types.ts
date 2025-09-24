// Service Architecture Types and Interfaces

export interface IService {
  readonly name: string;
  initialize(): Promise<void>;
  destroy(): Promise<void>;
}

export interface IDataService extends IService {
  // Vehicles
  getVehicles(): Promise<Vehicle[]>;
  getVehicleById(id: string): Promise<Vehicle | null>;
  createVehicle(vehicle: CreateVehicleRequest): Promise<Vehicle>;
  updateVehicle(id: string, vehicle: UpdateVehicleRequest): Promise<Vehicle>;
  deleteVehicle(id: string): Promise<boolean>;
  
  // Fleet Routes
  getFleetRoutes(): Promise<FleetRoute[]>;
  getFleetRouteById(id: string): Promise<FleetRoute | null>;
  createFleetRoute(route: CreateFleetRouteRequest): Promise<FleetRoute>;
  updateFleetRoute(id: string, route: UpdateFleetRouteRequest): Promise<FleetRoute>;
  deleteFleetRoute(id: string): Promise<boolean>;
  
  // Route Sessions
  getRouteSessions(): Promise<RouteSession[]>;
  getRouteSessionById(id: string): Promise<RouteSession | null>;
  createRouteSession(session: CreateRouteSessionRequest): Promise<RouteSession>;
  updateRouteSession(id: string, session: UpdateRouteSessionRequest): Promise<RouteSession>;
  deleteRouteSession(id: string): Promise<boolean>;
  
  // Performance Records
  getPerformanceRecords(filters?: PerformanceRecordFilters): Promise<PerformanceRecord[]>;
  getPerformanceRecordById(id: string): Promise<PerformanceRecord | null>;
  createPerformanceRecord(record: CreatePerformanceRecordRequest): Promise<PerformanceRecord>;
  createBatchPerformanceRecords(records: CreatePerformanceRecordRequest[]): Promise<PerformanceRecord[]>;
  updatePerformanceRecord(id: string, record: UpdatePerformanceRecordRequest): Promise<PerformanceRecord>;
  deletePerformanceRecord(id: string): Promise<boolean>;
  
  // Analytics
  getFleetSummary(): Promise<FleetSummary>;
  getPerformanceAnalytics(filters: AnalyticsFilters): Promise<PerformanceAnalytics>;
  getVehiclePerformance(vehicleId: string, filters?: AnalyticsFilters): Promise<VehiclePerformance>;
  getRoutePerformance(routeId: string, filters?: AnalyticsFilters): Promise<RoutePerformance>;
}

export interface IAuthService extends IService {
  login(email: string, password: string): Promise<AuthResult>;
  register(userData: RegisterRequest): Promise<AuthResult>;
  logout(): Promise<void>;
  validateSession(): Promise<SessionValidationResult>;
  refreshToken(): Promise<TokenRefreshResult>;
  getCurrentUser(): User | null;
  isAuthenticated(): boolean;
}

export interface IChartService extends IService {
  getChartData(type: ChartType, filters: ChartFilters): Promise<ChartData>;
  getFleetPerformanceChart(filters: FleetPerformanceFilters): Promise<FleetPerformanceChartData>;
  getVehicleEfficiencyChart(filters: VehicleEfficiencyFilters): Promise<VehicleEfficiencyChartData>;
  getRoutePerformanceChart(filters: RoutePerformanceFilters): Promise<RoutePerformanceChartData>;
  getTimeSeriesChart(filters: TimeSeriesFilters): Promise<TimeSeriesChartData>;
}

export interface INotificationService extends IService {
  showSuccess(message: string): void;
  showError(message: string): void;
  showWarning(message: string): void;
  showInfo(message: string): void;
}

export interface IStorageService extends IService {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
  clear(): void;
}

// Data Models
export interface Vehicle {
  id: string;
  name: string;
  type: VehicleType;
  status: VehicleStatus;
  mileage: number;
  capacity: string;
  createdAt: string;
  updatedAt: string;
}

export interface FleetRoute {
  id: string;
  name: string;
  type: RouteType;
  description?: string;
  averageDistance: number;
  averageDuration: number;
  status: RouteStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RouteSession {
  id: string;
  name: string;
  routeId: string;
  vehicleId: string;
  driverId?: string;
  startTime: string;
  endTime?: string;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PerformanceRecord {
  id: string;
  sessionId: string;
  vehicleId: string;
  metricName: string;
  metricValue: number;
  unit: string;
  recordedAt: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

// Request/Response Types
export interface CreateVehicleRequest {
  name: string;
  type: VehicleType;
  capacity: string;
}

export interface UpdateVehicleRequest {
  name?: string;
  type?: VehicleType;
  status?: VehicleStatus;
  capacity?: string;
}

export interface CreateFleetRouteRequest {
  name: string;
  type: RouteType;
  description?: string;
  averageDistance?: number;
  averageDuration?: number;
}

export interface UpdateFleetRouteRequest {
  name?: string;
  type?: RouteType;
  description?: string;
  averageDistance?: number;
  averageDuration?: number;
  status?: RouteStatus;
}

export interface CreateRouteSessionRequest {
  name: string;
  routeId: string;
  vehicleId: string;
  driverId?: string;
  startTime: string;
}

export interface UpdateRouteSessionRequest {
  name?: string;
  vehicleId?: string;
  driverId?: string;
  endTime?: string;
  status?: SessionStatus;
}

export interface CreatePerformanceRecordRequest {
  sessionId: string;
  vehicleId: string;
  metricName: string;
  metricValue: number;
  unit: string;
  recordedAt: string;
  notes?: string;
}

export interface UpdatePerformanceRecordRequest {
  metricName?: string;
  metricValue?: number;
  unit?: string;
  recordedAt?: string;
  notes?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Filter Types
export interface PerformanceRecordFilters {
  vehicleId?: string;
  sessionId?: string;
  metricName?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  vehicleIds?: string[];
  routeIds?: string[];
  metricNames?: string[];
}

export interface ChartFilters {
  startDate?: string;
  endDate?: string;
  vehicleIds?: string[];
  routeIds?: string[];
  groupBy?: 'day' | 'week' | 'month' | 'quarter' | 'year';
}

export interface FleetPerformanceFilters extends ChartFilters {
  metricType: 'fuel_efficiency' | 'distance_traveled' | 'average_speed' | 'idle_time';
}

export interface VehicleEfficiencyFilters extends ChartFilters {
  vehicleId: string;
}

export interface RoutePerformanceFilters extends ChartFilters {
  routeId: string;
}

export interface TimeSeriesFilters extends ChartFilters {
  metricName: string;
}

// Chart Data Types
export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

export interface FleetPerformanceChartData extends ChartData {
  summary: {
    totalVehicles: number;
    averageEfficiency: number;
    bestPerformer: string;
    worstPerformer: string;
  };
}

export interface VehicleEfficiencyChartData extends ChartData {
  vehicle: Vehicle;
  efficiencyScore: number;
  trends: {
    improving: boolean;
    changePercent: number;
  };
}

export interface RoutePerformanceChartData extends ChartData {
  route: FleetRoute;
  performance: {
    totalDistance: number;
    averageSpeed: number;
    completionRate: number;
  };
}

export interface TimeSeriesChartData extends ChartData {
  metric: {
    name: string;
    unit: string;
    description: string;
  };
  trends: {
    direction: 'up' | 'down' | 'stable';
    changePercent: number;
  };
}

// Auth Types
export interface AuthResult {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

export interface SessionValidationResult {
  valid: boolean;
  user?: User;
}

export interface TokenRefreshResult {
  success: boolean;
  token?: string;
}

// Summary Types
export interface FleetSummary {
  totalVehicles: number;
  activeVehicles: number;
  totalRoutes: number;
  activeRoutes: number;
  totalSessions: number;
  completedSessions: number;
  averageFuelEfficiency: number;
  totalDistance: number;
  totalFuelUsed: number;
}

export interface PerformanceAnalytics {
  summary: FleetSummary;
  trends: {
    fuelEfficiency: TrendData;
    distance: TrendData;
    speed: TrendData;
  };
  topPerformers: {
    vehicles: VehiclePerformance[];
    routes: RoutePerformance[];
  };
}

export interface VehiclePerformance {
  vehicle: Vehicle;
  metrics: {
    fuelEfficiency: number;
    distance: number;
    speed: number;
    efficiencyScore: number;
  };
  trends: {
    improving: boolean;
    changePercent: number;
  };
}

export interface RoutePerformance {
  route: FleetRoute;
  metrics: {
    totalDistance: number;
    averageSpeed: number;
    completionRate: number;
    efficiencyScore: number;
  };
  trends: {
    improving: boolean;
    changePercent: number;
  };
}

export interface TrendData {
  current: number;
  previous: number;
  change: number;
  changePercent: number;
  direction: 'up' | 'down' | 'stable';
}

// Enums
export enum VehicleType {
  DELIVERY = 'DELIVERY',
  PICKUP = 'PICKUP',
  VAN = 'VAN',
  SEMI = 'SEMI'
}

export enum VehicleStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
  RETIRED = 'RETIRED'
}

export enum RouteType {
  CITY_ROUTES = 'CITY_ROUTES',
  LONG_HAUL = 'LONG_HAUL',
  PICKUP = 'PICKUP'
}

export enum RouteStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}

export enum SessionStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum ChartType {
  BAR = 'BAR',
  LINE = 'LINE',
  PIE = 'PIE',
  SCATTER = 'SCATTER',
  AREA = 'AREA'
}

// Service Container
export interface IServiceContainer {
  register<T extends IService>(name: string, service: T): void;
  get<T extends IService>(name: string): T;
  has(name: string): boolean;
  initializeAll(): Promise<void>;
  destroyAll(): Promise<void>;
}
