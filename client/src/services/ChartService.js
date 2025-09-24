import { BaseService } from './BaseService';
import { DataService } from './DataService';
import { 
    IChartService,
    ChartType,
    ChartData,
    ChartDataset,
    FleetPerformanceChartData,
    VehicleEfficiencyChartData,
    RoutePerformanceChartData,
    TimeSeriesChartData,
    FleetPerformanceFilters,
    VehicleEfficiencyFilters,
    RoutePerformanceFilters,
    TimeSeriesFilters,
    CHART_COLORS,
    generateChartPalette
} from './types';

export class ChartService extends BaseService implements IChartService {
    private dataService: DataService;

    constructor(dataService: DataService) {
        super('ChartService');
        this.dataService = dataService;
    }

    protected async onInitialize(): Promise<void> {
        this.log('info', 'ChartService initialized');
    }

    protected async onDestroy(): Promise<void> {
        this.log('info', 'ChartService destroyed');
    }

    async getChartData(type: ChartType, filters: any): Promise<ChartData> {
        this.validateReady();
        
        switch (type) {
            case ChartType.BAR:
                return this.createBarChartData(filters);
            case ChartType.LINE:
                return this.createLineChartData(filters);
            case ChartType.PIE:
                return this.createPieChartData(filters);
            case ChartType.SCATTER:
                return this.createScatterChartData(filters);
            case ChartType.AREA:
                return this.createAreaChartData(filters);
            default:
                throw new Error(`Unsupported chart type: ${type}`);
        }
    }

    async getFleetPerformanceChart(filters: FleetPerformanceFilters): Promise<FleetPerformanceChartData> {
        this.validateReady();
        
        const performanceRecords = await this.dataService.getPerformanceRecords({
            metricName: filters.metricType,
            startDate: filters.startDate,
            endDate: filters.endDate,
            vehicleIds: filters.vehicleIds,
            routeIds: filters.routeIds
        });

        const vehicles = await this.dataService.getVehicles();
        const vehiclePerformance = this.calculateVehiclePerformance(performanceRecords, vehicles);

        const chartData = this.createFleetPerformanceChartData(vehiclePerformance, filters.metricType);
        const summary = this.calculateFleetPerformanceSummary(vehiclePerformance);

        return {
            ...chartData,
            summary
        };
    }

    async getVehicleEfficiencyChart(filters: VehicleEfficiencyFilters): Promise<VehicleEfficiencyChartData> {
        this.validateReady();
        
        const vehicle = await this.dataService.getVehicleById(filters.vehicleId);
        if (!vehicle) {
            throw new Error(`Vehicle ${filters.vehicleId} not found`);
        }

        const performanceRecords = await this.dataService.getPerformanceRecords({
            vehicleId: filters.vehicleId,
            startDate: filters.startDate,
            endDate: filters.endDate
        });

        const chartData = this.createVehicleEfficiencyChartData(performanceRecords);
        const efficiencyScore = this.calculateVehicleEfficiencyScore(performanceRecords);
        const trends = this.calculateVehicleTrends(performanceRecords);

        return {
            ...chartData,
            vehicle,
            efficiencyScore,
            trends
        };
    }

    async getRoutePerformanceChart(filters: RoutePerformanceFilters): Promise<RoutePerformanceChartData> {
        this.validateReady();
        
        const route = await this.dataService.getFleetRouteById(filters.routeId);
        if (!route) {
            throw new Error(`Route ${filters.routeId} not found`);
        }

        const performanceRecords = await this.dataService.getPerformanceRecords({
            routeId: filters.routeId,
            startDate: filters.startDate,
            endDate: filters.endDate
        });

        const chartData = this.createRoutePerformanceChartData(performanceRecords);
        const performance = this.calculateRoutePerformance(performanceRecords);

        return {
            ...chartData,
            route,
            performance
        };
    }

    async getTimeSeriesChart(filters: TimeSeriesFilters): Promise<TimeSeriesChartData> {
        this.validateReady();
        
        const performanceRecords = await this.dataService.getPerformanceRecords({
            metricName: filters.metricName,
            startDate: filters.startDate,
            endDate: filters.endDate,
            vehicleIds: filters.vehicleIds,
            routeIds: filters.routeIds
        });

        const chartData = this.createTimeSeriesChartData(performanceRecords, filters);
        const trends = this.calculateTimeSeriesTrends(performanceRecords, filters.metricName);

        return {
            ...chartData,
            metric: {
                name: filters.metricName,
                unit: this.getMetricUnit(filters.metricName),
                description: this.getMetricDescription(filters.metricName)
            },
            trends
        };
    }

    // Private helper methods
    private createBarChartData(filters: any): ChartData {
        // Implementation for bar chart data
        return {
            labels: [],
            datasets: []
        };
    }

    private createLineChartData(filters: any): ChartData {
        // Implementation for line chart data
        return {
            labels: [],
            datasets: []
        };
    }

    private createPieChartData(filters: any): ChartData {
        // Implementation for pie chart data
        return {
            labels: [],
            datasets: []
        };
    }

    private createScatterChartData(filters: any): ChartData {
        // Implementation for scatter chart data
        return {
            labels: [],
            datasets: []
        };
    }

    private createAreaChartData(filters: any): ChartData {
        // Implementation for area chart data
        return {
            labels: [],
            datasets: []
        };
    }

    private createFleetPerformanceChartData(vehiclePerformance: any[], metricType: string): ChartData {
        const labels = vehiclePerformance.map(vp => vp.vehicle.name);
        const data = vehiclePerformance.map(vp => vp.metrics[metricType] || 0);
        
        return {
            labels,
            datasets: [{
                label: this.getMetricLabel(metricType),
                data,
                backgroundColor: CHART_COLORS.primary,
                borderColor: CHART_COLORS.primary,
                borderWidth: 1
            }]
        };
    }

    private createVehicleEfficiencyChartData(performanceRecords: any[]): ChartData {
        // Group by date and calculate efficiency
        const groupedData = this.groupPerformanceRecordsByDate(performanceRecords);
        const labels = Object.keys(groupedData).sort();
        const efficiencyData = labels.map(date => 
            this.calculateDailyEfficiency(groupedData[date])
        );

        return {
            labels,
            datasets: [{
                label: 'Efficiency Score',
                data: efficiencyData,
                backgroundColor: CHART_COLORS.success,
                borderColor: CHART_COLORS.success,
                borderWidth: 2
            }]
        };
    }

    private createRoutePerformanceChartData(performanceRecords: any[]): ChartData {
        // Implementation for route performance chart
        return {
            labels: [],
            datasets: []
        };
    }

    private createTimeSeriesChartData(performanceRecords: any[], filters: TimeSeriesFilters): ChartData {
        const groupedData = this.groupPerformanceRecordsByDate(performanceRecords);
        const labels = Object.keys(groupedData).sort();
        const data = labels.map(date => 
            this.calculateDailyAverage(groupedData[date], filters.metricName)
        );

        return {
            labels,
            datasets: [{
                label: this.getMetricLabel(filters.metricName),
                data,
                backgroundColor: CHART_COLORS.primary,
                borderColor: CHART_COLORS.primary,
                borderWidth: 2
            }]
        };
    }

    private calculateVehiclePerformance(performanceRecords: any[], vehicles: any[]): any[] {
        const vehicleStats = {};
        
        performanceRecords.forEach(record => {
            const vehicleId = record.vehicleId;
            if (!vehicleStats[vehicleId]) {
                vehicleStats[vehicleId] = {
                    vehicle: vehicles.find(v => v.id === vehicleId),
                    metrics: {}
                };
            }
            
            const metricName = record.metricName;
            if (!vehicleStats[vehicleId].metrics[metricName]) {
                vehicleStats[vehicleId].metrics[metricName] = [];
            }
            
            vehicleStats[vehicleId].metrics[metricName].push(record.metricValue);
        });

        return Object.values(vehicleStats).map(stats => ({
            ...stats,
            metrics: Object.keys(stats.metrics).reduce((acc, metric) => {
                acc[metric] = stats.metrics[metric].reduce((sum, val) => sum + val, 0) / stats.metrics[metric].length;
                return acc;
            }, {})
        }));
    }

    private calculateFleetPerformanceSummary(vehiclePerformance: any[]): any {
        const totalVehicles = vehiclePerformance.length;
        const averageEfficiency = vehiclePerformance.reduce((sum, vp) => sum + vp.metrics.fuel_efficiency, 0) / totalVehicles;
        
        const sortedByEfficiency = [...vehiclePerformance].sort((a, b) => 
            b.metrics.fuel_efficiency - a.metrics.fuel_efficiency
        );
        
        return {
            totalVehicles,
            averageEfficiency,
            bestPerformer: sortedByEfficiency[0]?.vehicle?.name || 'N/A',
            worstPerformer: sortedByEfficiency[sortedByEfficiency.length - 1]?.vehicle?.name || 'N/A'
        };
    }

    private calculateVehicleEfficiencyScore(performanceRecords: any[]): number {
        // Calculate efficiency score based on multiple metrics
        const metrics = this.aggregateMetrics(performanceRecords);
        return this.computeEfficiencyScore(metrics);
    }

    private calculateVehicleTrends(performanceRecords: any[]): any {
        const groupedData = this.groupPerformanceRecordsByDate(performanceRecords);
        const dates = Object.keys(groupedData).sort();
        
        if (dates.length < 2) {
            return { improving: false, changePercent: 0 };
        }
        
        const firstHalf = dates.slice(0, Math.floor(dates.length / 2));
        const secondHalf = dates.slice(Math.floor(dates.length / 2));
        
        const firstAvg = this.calculatePeriodAverage(firstHalf, groupedData);
        const secondAvg = this.calculatePeriodAverage(secondHalf, groupedData);
        
        const changePercent = ((secondAvg - firstAvg) / firstAvg) * 100;
        
        return {
            improving: changePercent > 0,
            changePercent: Math.abs(changePercent)
        };
    }

    private calculateRoutePerformance(performanceRecords: any[]): any {
        const totalDistance = performanceRecords
            .filter(r => r.metricName === 'distance_traveled')
            .reduce((sum, r) => sum + r.metricValue, 0);
            
        const averageSpeed = performanceRecords
            .filter(r => r.metricName === 'average_speed')
            .reduce((sum, r) => sum + r.metricValue, 0) / 
            performanceRecords.filter(r => r.metricName === 'average_speed').length || 0;
            
        const completionRate = performanceRecords.length > 0 ? 1.0 : 0; // Simplified
        
        return {
            totalDistance,
            averageSpeed,
            completionRate,
            efficiencyScore: this.computeEfficiencyScore(this.aggregateMetrics(performanceRecords))
        };
    }

    private calculateTimeSeriesTrends(performanceRecords: any[], metricName: string): any {
        const groupedData = this.groupPerformanceRecordsByDate(performanceRecords);
        const dates = Object.keys(groupedData).sort();
        
        if (dates.length < 2) {
            return { direction: 'stable', changePercent: 0 };
        }
        
        const firstHalf = dates.slice(0, Math.floor(dates.length / 2));
        const secondHalf = dates.slice(Math.floor(dates.length / 2));
        
        const firstAvg = this.calculatePeriodAverage(firstHalf, groupedData);
        const secondAvg = this.calculatePeriodAverage(secondHalf, groupedData);
        
        const changePercent = ((secondAvg - firstAvg) / firstAvg) * 100;
        
        return {
            direction: changePercent > 5 ? 'up' : changePercent < -5 ? 'down' : 'stable',
            changePercent: Math.abs(changePercent)
        };
    }

    // Utility methods
    private groupPerformanceRecordsByDate(records: any[]): any {
        const grouped = {};
        records.forEach(record => {
            const date = new Date(record.recordedAt).toISOString().split('T')[0];
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(record);
        });
        return grouped;
    }

    private calculateDailyEfficiency(records: any[]): number {
        const metrics = this.aggregateMetrics(records);
        return this.computeEfficiencyScore(metrics);
    }

    private calculateDailyAverage(records: any[], metricName: string): number {
        const metricRecords = records.filter(r => r.metricName === metricName);
        if (metricRecords.length === 0) return 0;
        
        return metricRecords.reduce((sum, r) => sum + r.metricValue, 0) / metricRecords.length;
    }

    private calculatePeriodAverage(dates: string[], groupedData: any): number {
        const allRecords = dates.flatMap(date => groupedData[date] || []);
        if (allRecords.length === 0) return 0;
        
        return allRecords.reduce((sum, r) => sum + r.metricValue, 0) / allRecords.length;
    }

    private aggregateMetrics(records: any[]): any {
        const metrics = {};
        records.forEach(record => {
            if (!metrics[record.metricName]) {
                metrics[record.metricName] = [];
            }
            metrics[record.metricName].push(record.metricValue);
        });
        
        return Object.keys(metrics).reduce((acc, metric) => {
            acc[metric] = metrics[metric].reduce((sum, val) => sum + val, 0) / metrics[metric].length;
            return acc;
        }, {});
    }

    private computeEfficiencyScore(metrics: any): number {
        // Simplified efficiency calculation
        const fuelEfficiency = metrics.fuel_efficiency || 0;
        const distance = metrics.distance_traveled || 0;
        const speed = metrics.average_speed || 0;
        
        // Normalize and weight the metrics
        const fuelScore = Math.min(fuelEfficiency / 15, 1); // Max 15 mpg = 1.0
        const distanceScore = Math.min(distance / 200, 1); // Max 200 miles = 1.0
        const speedScore = Math.min(speed / 60, 1); // Max 60 mph = 1.0
        
        return (fuelScore * 0.4 + distanceScore * 0.3 + speedScore * 0.3);
    }

    private getMetricLabel(metricName: string): string {
        const labels = {
            'fuel_efficiency': 'Fuel Efficiency',
            'distance_traveled': 'Distance Traveled',
            'average_speed': 'Average Speed',
            'idle_time': 'Idle Time'
        };
        return labels[metricName] || metricName;
    }

    private getMetricUnit(metricName: string): string {
        const units = {
            'fuel_efficiency': 'mpg',
            'distance_traveled': 'miles',
            'average_speed': 'mph',
            'idle_time': 'hours'
        };
        return units[metricName] || 'unknown';
    }

    private getMetricDescription(metricName: string): string {
        const descriptions = {
            'fuel_efficiency': 'Miles per gallon efficiency',
            'distance_traveled': 'Total distance covered',
            'average_speed': 'Average vehicle speed',
            'idle_time': 'Time spent idling'
        };
        return descriptions[metricName] || 'Performance metric';
    }
}

export default ChartService;
