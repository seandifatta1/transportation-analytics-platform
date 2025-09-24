// Transportation Analytics Platform - Vehicle Router
// Manages fleet vehicles and their performance data

const express = require("express");
const {
    getAllVehicles,
    getVehicleById,
    createVehicle,
    getPerformanceRecordsByVehicle
} = require("../database/transportationInterface");

const vehicleRouter = express.Router();

// Get all vehicles
vehicleRouter.get("/vehicles", async (req, res) => {
    try {
        const { type, status, search } = req.query;
        
        const result = await getAllVehicles();
        
        if (result.success) {
            let filteredData = result.data;
            
            // Apply filters
            if (type) {
                filteredData = filteredData.filter(vehicle => vehicle.type === type.toUpperCase());
            }
            
            if (status) {
                filteredData = filteredData.filter(vehicle => vehicle.status === status.toUpperCase());
            }
            
            if (search) {
                const searchLower = search.toLowerCase();
                filteredData = filteredData.filter(vehicle => 
                    vehicle.name.toLowerCase().includes(searchLower) ||
                    vehicle.type.toLowerCase().includes(searchLower)
                );
            }
            
            res.status(200).json({
                success: true,
                data: filteredData,
                message: "Vehicles retrieved successfully"
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message || "Failed to fetch vehicles"
            });
        }
    } catch (error) {
        console.error("Get vehicles error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Get specific vehicle by ID
vehicleRouter.get("/vehicles/:vehicleId", async (req, res) => {
    try {
        const { vehicleId } = req.params;
        const result = await getVehicleById(vehicleId);
        
        if (result.success) {
            if (result.data) {
                res.status(200).json({
                    success: true,
                    data: result.data,
                    message: "Vehicle retrieved successfully"
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "Vehicle not found"
                });
            }
        } else {
            res.status(400).json({
                success: false,
                message: result.message || "Failed to fetch vehicle"
            });
        }
    } catch (error) {
        console.error("Get vehicle error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Create new vehicle
vehicleRouter.post("/vehicles", async (req, res) => {
    try {
        const { name, type, capacity, year, mileage, status } = req.body;
        
        // Validate required fields
        if (!name || !type) {
            return res.status(400).json({
                success: false,
                message: "Name and type are required fields"
            });
        }
        
        // Validate type
        const validTypes = ['DELIVERY', 'PICKUP', 'LONG_HAUL', 'VAN', 'TRUCK'];
        if (!validTypes.includes(type.toUpperCase())) {
            return res.status(400).json({
                success: false,
                message: `Type must be one of: ${validTypes.join(', ')}`
            });
        }
        
        const vehicleData = {
            name,
            type: type.toUpperCase(),
            capacity: capacity || null,
            year: year ? parseInt(year) : null,
            mileage: mileage ? parseInt(mileage) : 0,
            status: status ? status.toUpperCase() : 'ACTIVE'
        };
        
        const result = await createVehicle(vehicleData);
        
        if (result.success) {
            res.status(201).json({
                success: true,
                data: { vehicleId: result.vehicleId },
                message: "Vehicle created successfully"
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message || "Failed to create vehicle"
            });
        }
    } catch (error) {
        console.error("Create vehicle error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Update vehicle
vehicleRouter.put("/vehicles/:vehicleId", async (req, res) => {
    try {
        const { vehicleId } = req.params;
        
        // This would require an updateVehicle function in the interface
        res.status(501).json({
            success: false,
            message: "Update vehicle functionality not yet implemented"
        });
    } catch (error) {
        console.error("Update vehicle error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Delete vehicle
vehicleRouter.delete("/vehicles/:vehicleId", async (req, res) => {
    try {
        const { vehicleId } = req.params;
        
        // This would require a deleteVehicle function in the interface
        res.status(501).json({
            success: false,
            message: "Delete vehicle functionality not yet implemented"
        });
    } catch (error) {
        console.error("Delete vehicle error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Get vehicle performance records
vehicleRouter.get("/vehicles/:vehicleId/performance", async (req, res) => {
    try {
        const { vehicleId } = req.params;
        const { startDate, endDate, metricName } = req.query;
        
        const result = await getPerformanceRecordsByVehicle(vehicleId);
        
        if (result.success) {
            let filteredData = result.data;
            
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
            
            // Apply metric filter
            if (metricName) {
                filteredData = filteredData.filter(record => 
                    record.metric_name === metricName
                );
            }
            
            res.status(200).json({
                success: true,
                data: filteredData,
                message: "Vehicle performance records retrieved successfully"
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message || "Failed to fetch vehicle performance records"
            });
        }
    } catch (error) {
        console.error("Get vehicle performance error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Get vehicle performance summary
vehicleRouter.get("/vehicles/:vehicleId/summary", async (req, res) => {
    try {
        const { vehicleId } = req.params;
        const { startDate, endDate } = req.query;
        
        const result = await getPerformanceRecordsByVehicle(vehicleId);
        
        if (result.success) {
            let filteredData = result.data;
            
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
            
            // Calculate summary statistics
            const summary = {
                totalRecords: filteredData.length,
                metrics: {},
                sessions: {},
                routes: {}
            };
            
            // Group by metric name
            const metrics = {};
            const sessions = {};
            const routes = {};
            
            filteredData.forEach(record => {
                // Metric statistics
                if (!metrics[record.metric_name]) {
                    metrics[record.metric_name] = {
                        count: 0,
                        sum: 0,
                        min: Infinity,
                        max: -Infinity,
                        unit: record.unit
                    };
                }
                
                const metric = metrics[record.metric_name];
                metric.count++;
                metric.sum += record.metric_value;
                metric.min = Math.min(metric.min, record.metric_value);
                metric.max = Math.max(metric.max, record.metric_value);
                
                // Session statistics
                if (!sessions[record.session_name]) {
                    sessions[record.session_name] = 0;
                }
                sessions[record.session_name]++;
                
                // Route statistics
                if (!routes[record.route_name]) {
                    routes[record.route_name] = 0;
                }
                routes[record.route_name]++;
            });
            
            // Calculate averages
            Object.keys(metrics).forEach(metricName => {
                const metric = metrics[metricName];
                metric.average = metric.sum / metric.count;
                metric.min = metric.min === Infinity ? 0 : metric.min;
                metric.max = metric.max === -Infinity ? 0 : metric.max;
            });
            
            summary.metrics = metrics;
            summary.sessions = sessions;
            summary.routes = routes;
            
            res.status(200).json({
                success: true,
                data: summary,
                message: "Vehicle performance summary retrieved successfully"
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message || "Failed to fetch vehicle performance summary"
            });
        }
    } catch (error) {
        console.error("Get vehicle performance summary error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Get vehicle types
vehicleRouter.get("/vehicles/types", (req, res) => {
    const vehicleTypes = [
        { value: 'DELIVERY', label: 'Delivery Truck' },
        { value: 'PICKUP', label: 'Pickup Truck' },
        { value: 'LONG_HAUL', label: 'Long Haul Truck' },
        { value: 'VAN', label: 'Van' },
        { value: 'TRUCK', label: 'General Truck' }
    ];
    
    res.status(200).json({
        success: true,
        data: vehicleTypes,
        message: "Vehicle types retrieved successfully"
    });
});

// Get vehicle statuses
vehicleRouter.get("/vehicles/statuses", (req, res) => {
    const vehicleStatuses = [
        { value: 'ACTIVE', label: 'Active' },
        { value: 'MAINTENANCE', label: 'Maintenance' },
        { value: 'INACTIVE', label: 'Inactive' }
    ];
    
    res.status(200).json({
        success: true,
        data: vehicleStatuses,
        message: "Vehicle statuses retrieved successfully"
    });
});

module.exports = {
    vehicleRouter
};
