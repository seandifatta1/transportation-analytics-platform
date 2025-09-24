// Transportation Analytics Platform - Analytics Router
// Provides fleet performance analytics and insights

const express = require("express");
const {
    getFleetPerformanceSummary,
    getPerformanceDataByTimeRange,
    getAllPerformanceRecords,
    getAllVehicles,
    getAllFleetRoutes,
    getAllRouteSessions
} = require("../database/transportationInterface");

const analyticsRouter = express.Router();

// Get fleet performance summary
analyticsRouter.get("/users/:user/analytics/summary", async (req, res) => {
    try {
        const userId = req.params.user;
        const result = await getFleetPerformanceSummary(userId);
        
        if (result.success) {
            res.status(200).json({
                success: true,
                data: result.data,
                message: "Fleet performance summary retrieved successfully"
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message || "Failed to fetch fleet performance summary"
            });
        }
    } catch (error) {
        console.error("Get fleet performance summary error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Get time-based performance analytics
analyticsRouter.get("/users/:user/analytics/time-series", async (req, res) => {
    try {
        const userId = req.params.user;
        const { startDate, endDate, metricName, vehicleId, routeId } = req.query;
        
        // Calculate date range if not provided
        let start, end;
        if (startDate && endDate) {
            start = new Date(startDate);
            end = new Date(endDate);
        } else {
            // Default to last 30 days
            end = new Date();
            start = new Date(end.getTime() - (30 * 24 * 60 * 60 * 1000));
        }
        
        const result = await getPerformanceDataByTimeRange(
            userId,
            start.toISOString(),
            end.toISOString(),
            metricName
        );
        
        if (result.success) {
            let filteredData = result.data;
            
            // Apply additional filters
            if (vehicleId) {
                filteredData = filteredData.filter(record => record.vehicle_id == vehicleId);
            }
            
            if (routeId) {
                filteredData = filteredData.filter(record => record.route_id == routeId);
            }
            
            // Group by date for time series
            const timeSeriesData = {};
            filteredData.forEach(record => {
                const date = record.recorded_at.split('T')[0];
                if (!timeSeriesData[date]) {
                    timeSeriesData[date] = {};
                }
                if (!timeSeriesData[date][record.metric_name]) {
                    timeSeriesData[date][record.metric_name] = {
                        values: [],
                        unit: record.unit
                    };
                }
                timeSeriesData[date][record.metric_name].values.push(record.metric_value);
            });
            
            // Calculate daily averages
            const processedData = Object.keys(timeSeriesData).map(date => {
                const dayData = { date };
                Object.keys(timeSeriesData[date]).forEach(metric => {
                    const values = timeSeriesData[date][metric].values;
                    dayData[metric] = {
                        average: values.reduce((sum, val) => sum + val, 0) / values.length,
                        min: Math.min(...values),
                        max: Math.max(...values),
                        count: values.length,
                        unit: timeSeriesData[date][metric].unit
                    };
                });
                return dayData;
            });
            
            res.status(200).json({
                success: true,
                data: processedData.sort((a, b) => new Date(a.date) - new Date(b.date)),
                message: "Time series analytics retrieved successfully"
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message || "Failed to fetch time series analytics"
            });
        }
    } catch (error) {
        console.error("Get time series analytics error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Get performance metrics comparison
analyticsRouter.get("/users/:user/analytics/comparison", async (req, res) => {
    try {
        const userId = req.params.user;
        const { metricName, groupBy, startDate, endDate } = req.query;
        
        if (!metricName) {
            return res.status(400).json({
                success: false,
                message: "metricName parameter is required"
            });
        }
        
        const validGroupBy = ['vehicle', 'route', 'session'];
        if (!groupBy || !validGroupBy.includes(groupBy)) {
            return res.status(400).json({
                success: false,
                message: `groupBy must be one of: ${validGroupBy.join(', ')}`
            });
        }
        
        const result = await getAllPerformanceRecords(userId);
        
        if (result.success) {
            let filteredData = result.data.filter(record => record.metric_name === metricName);
            
            // Apply date filters
            if (startDate) {
                filteredData = filteredData.filter(record => 
                    new Date(record.recorded_at) >= new Date(startDate)
                );
            }
            
            if (endDate) {
                filteredData = filteredData.filter(record => 
                    new Date(record.recorded_at) <= new Date(endDate)
                );
            }
            
            // Group data
            const groupedData = {};
            filteredData.forEach(record => {
                let groupKey;
                switch (groupBy) {
                    case 'vehicle':
                        groupKey = record.vehicle_name;
                        break;
                    case 'route':
                        groupKey = record.route_name;
                        break;
                    case 'session':
                        groupKey = record.session_name;
                        break;
                }
                
                if (!groupedData[groupKey]) {
                    groupedData[groupKey] = {
                        values: [],
                        unit: record.unit
                    };
                }
                groupedData[groupKey].values.push(record.metric_value);
            });
            
            // Calculate statistics for each group
            const comparisonData = Object.keys(groupedData).map(group => {
                const values = groupedData[group].values;
                return {
                    group: group,
                    average: values.reduce((sum, val) => sum + val, 0) / values.length,
                    min: Math.min(...values),
                    max: Math.max(...values),
                    count: values.length,
                    unit: groupedData[group].unit
                };
            });
            
            res.status(200).json({
                success: true,
                data: comparisonData.sort((a, b) => b.average - a.average),
                message: "Performance comparison retrieved successfully"
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message || "Failed to fetch performance comparison"
            });
        }
    } catch (error) {
        console.error("Get performance comparison error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Get fleet efficiency metrics
analyticsRouter.get("/users/:user/analytics/efficiency", async (req, res) => {
    try {
        const userId = req.params.user;
        const { startDate, endDate } = req.query;
        
        // Get all performance records
        const recordsResult = await getAllPerformanceRecords(userId);
        const vehiclesResult = await getAllVehicles();
        const routesResult = await getAllFleetRoutes(userId);
        const sessionsResult = await getAllRouteSessions(userId);
        
        if (!recordsResult.success || !vehiclesResult.success || !routesResult.success || !sessionsResult.success) {
            return res.status(400).json({
                success: false,
                message: "Failed to fetch required data"
            });
        }
        
        let records = recordsResult.data;
        const vehicles = vehiclesResult.data;
        const routes = routesResult.data;
        const sessions = sessionsResult.data;
        
        // Apply date filters
        if (startDate) {
            records = records.filter(record => 
                new Date(record.recorded_at) >= new Date(startDate)
            );
        }
        
        if (endDate) {
            records = records.filter(record => 
                new Date(record.recorded_at) <= new Date(endDate)
            );
        }
        
        // Calculate efficiency metrics
        const efficiency = {
            vehicles: {},
            routes: {},
            overall: {
                totalDistance: 0,
                totalFuelUsed: 0,
                averageFuelEfficiency: 0,
                totalSessions: sessions.length,
                completedSessions: sessions.filter(s => s.status === 'COMPLETED').length
            }
        };
        
        // Vehicle efficiency
        vehicles.forEach(vehicle => {
            const vehicleRecords = records.filter(r => r.vehicle_id === vehicle.id);
            const fuelRecords = vehicleRecords.filter(r => r.metric_name === 'fuel_efficiency');
            const distanceRecords = vehicleRecords.filter(r => r.metric_name === 'distance_traveled');
            
            efficiency.vehicles[vehicle.name] = {
                totalDistance: distanceRecords.reduce((sum, r) => sum + r.metric_value, 0),
                averageFuelEfficiency: fuelRecords.length > 0 ? 
                    fuelRecords.reduce((sum, r) => sum + r.metric_value, 0) / fuelRecords.length : 0,
                totalRecords: vehicleRecords.length,
                sessions: vehicleRecords.map(r => r.session_name).filter((v, i, a) => a.indexOf(v) === i).length
            };
            
            efficiency.overall.totalDistance += efficiency.vehicles[vehicle.name].totalDistance;
        });
        
        // Route efficiency
        routes.forEach(route => {
            const routeRecords = records.filter(r => r.route_id === route.id);
            const fuelRecords = routeRecords.filter(r => r.metric_name === 'fuel_efficiency');
            const distanceRecords = routeRecords.filter(r => r.metric_name === 'distance_traveled');
            
            efficiency.routes[route.name] = {
                totalDistance: distanceRecords.reduce((sum, r) => sum + r.metric_value, 0),
                averageFuelEfficiency: fuelRecords.length > 0 ? 
                    fuelRecords.reduce((sum, r) => sum + r.metric_value, 0) / fuelRecords.length : 0,
                totalRecords: routeRecords.length,
                sessions: routeRecords.map(r => r.session_name).filter((v, i, a) => a.indexOf(v) === i).length
            };
        });
        
        // Overall efficiency
        const allFuelRecords = records.filter(r => r.metric_name === 'fuel_efficiency');
        efficiency.overall.averageFuelEfficiency = allFuelRecords.length > 0 ? 
            allFuelRecords.reduce((sum, r) => sum + r.metric_value, 0) / allFuelRecords.length : 0;
        
        res.status(200).json({
            success: true,
            data: efficiency,
            message: "Fleet efficiency metrics retrieved successfully"
        });
    } catch (error) {
        console.error("Get fleet efficiency error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Get performance trends
analyticsRouter.get("/users/:user/analytics/trends", async (req, res) => {
    try {
        const userId = req.params.user;
        const { metricName, period = 'week', limit = 12 } = req.query;
        
        if (!metricName) {
            return res.status(400).json({
                success: false,
                message: "metricName parameter is required"
            });
        }
        
        const result = await getAllPerformanceRecords(userId);
        
        if (result.success) {
            const records = result.data.filter(r => r.metric_name === metricName);
            
            // Group by time period
            const periodMs = period === 'day' ? 24 * 60 * 60 * 1000 : 
                           period === 'week' ? 7 * 24 * 60 * 60 * 1000 : 
                           30 * 24 * 60 * 60 * 1000; // month
            
            const trends = {};
            const now = new Date();
            
            for (let i = 0; i < parseInt(limit); i++) {
                const periodStart = new Date(now.getTime() - (i + 1) * periodMs);
                const periodEnd = new Date(now.getTime() - i * periodMs);
                
                const periodRecords = records.filter(record => {
                    const recordDate = new Date(record.recorded_at);
                    return recordDate >= periodStart && recordDate < periodEnd;
                });
                
                const periodKey = periodStart.toISOString().split('T')[0];
                trends[periodKey] = {
                    average: periodRecords.length > 0 ? 
                        periodRecords.reduce((sum, r) => sum + r.metric_value, 0) / periodRecords.length : 0,
                    count: periodRecords.length,
                    unit: periodRecords.length > 0 ? periodRecords[0].unit : 'unknown'
                };
            }
            
            const trendData = Object.keys(trends).sort().map(period => ({
                period,
                ...trends[period]
            }));
            
            res.status(200).json({
                success: true,
                data: trendData,
                message: "Performance trends retrieved successfully"
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message || "Failed to fetch performance trends"
            });
        }
    } catch (error) {
        console.error("Get performance trends error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

module.exports = {
    analyticsRouter
};
