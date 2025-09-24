// Transportation Analytics Platform - Performance Record Router
// This replaces the set router with transportation-focused performance record management

const express = require("express");
const {
    getAllPerformanceRecords,
    getPerformanceRecordsBySession,
    getPerformanceRecordsByVehicle,
    createPerformanceRecord,
    getAllVehicles
} = require("../database/transportationInterface");

const performanceRecordRouter = express.Router();

// Get all performance records for a user
performanceRecordRouter.get("/users/:user/performance-records", async (req, res) => {
    try {
        const userId = req.params.user;
        const { vehicleId, sessionId, metricName, startDate, endDate } = req.query;
        
        const result = await getAllPerformanceRecords(userId);
        
        if (result.success) {
            let filteredData = result.data;
            
            // Apply filters
            if (vehicleId) {
                filteredData = filteredData.filter(record => record.vehicle_id == vehicleId);
            }
            
            if (sessionId) {
                filteredData = filteredData.filter(record => record.session_id == sessionId);
            }
            
            if (metricName) {
                filteredData = filteredData.filter(record => record.metric_name === metricName);
            }
            
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
            
            res.status(200).json({
                success: true,
                data: filteredData,
                message: "Performance records retrieved successfully"
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message || "Failed to fetch performance records"
            });
        }
    } catch (error) {
        console.error("Get performance records error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Get performance records by session
performanceRecordRouter.get("/users/:user/sessions/:sessionId/performance-records", async (req, res) => {
    try {
        const { sessionId } = req.params;
        const result = await getPerformanceRecordsBySession(sessionId);
        
        if (result.success) {
            res.status(200).json({
                success: true,
                data: result.data,
                message: "Session performance records retrieved successfully"
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message || "Failed to fetch session performance records"
            });
        }
    } catch (error) {
        console.error("Get session performance records error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Get performance records by vehicle
performanceRecordRouter.get("/users/:user/vehicles/:vehicleId/performance-records", async (req, res) => {
    try {
        const { vehicleId } = req.params;
        const result = await getPerformanceRecordsByVehicle(vehicleId);
        
        if (result.success) {
            res.status(200).json({
                success: true,
                data: result.data,
                message: "Vehicle performance records retrieved successfully"
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message || "Failed to fetch vehicle performance records"
            });
        }
    } catch (error) {
        console.error("Get vehicle performance records error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Create new performance record
performanceRecordRouter.post("/users/:user/performance-records", async (req, res) => {
    try {
        const userId = req.params.user;
        const { sessionId, vehicleId, metricName, metricValue, unit, notes } = req.body;
        
        // Validate required fields
        if (!sessionId || !vehicleId || !metricName || metricValue === undefined) {
            return res.status(400).json({
                success: false,
                message: "sessionId, vehicleId, metricName, and metricValue are required"
            });
        }
        
        const recordData = {
            sessionId: parseInt(sessionId),
            vehicleId: parseInt(vehicleId),
            metricName,
            metricValue: parseFloat(metricValue),
            unit: unit || "unknown",
            notes: notes || ""
        };
        
        const result = await createPerformanceRecord(recordData);
        
        if (result.success) {
            res.status(201).json({
                success: true,
                data: { recordId: result.recordId },
                message: "Performance record created successfully"
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message || "Failed to create performance record"
            });
        }
    } catch (error) {
        console.error("Create performance record error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Create multiple performance records (batch operation)
performanceRecordRouter.post("/users/:user/performance-records/batch", async (req, res) => {
    try {
        const userId = req.params.user;
        const records = req.body;
        
        if (!Array.isArray(records) || records.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Request body must be a non-empty array of performance records"
            });
        }
        
        const results = [];
        const errors = [];
        
        for (let i = 0; i < records.length; i++) {
            const record = records[i];
            const { sessionId, vehicleId, metricName, metricValue, unit, notes } = record;
            
            if (!sessionId || !vehicleId || !metricName || metricValue === undefined) {
                errors.push({
                    index: i,
                    error: "sessionId, vehicleId, metricName, and metricValue are required"
                });
                continue;
            }
            
            const recordData = {
                sessionId: parseInt(sessionId),
                vehicleId: parseInt(vehicleId),
                metricName,
                metricValue: parseFloat(metricValue),
                unit: unit || "unknown",
                notes: notes || ""
            };
            
            const result = await createPerformanceRecord(recordData);
            
            if (result.success) {
                results.push({ index: i, recordId: result.recordId });
            } else {
                errors.push({ index: i, error: result.message });
            }
        }
        
        res.status(201).json({
            success: true,
            data: {
                created: results,
                errors: errors
            },
            message: `Created ${results.length} performance records, ${errors.length} errors`
        });
    } catch (error) {
        console.error("Batch create performance records error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Get performance metrics summary
performanceRecordRouter.get("/users/:user/performance-records/summary", async (req, res) => {
    try {
        const userId = req.params.user;
        const { metricName, startDate, endDate } = req.query;
        
        const result = await getAllPerformanceRecords(userId);
        
        if (result.success) {
            let filteredData = result.data;
            
            if (metricName) {
                filteredData = filteredData.filter(record => record.metric_name === metricName);
            }
            
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
                vehicles: {},
                sessions: {}
            };
            
            // Group by metric name
            const metrics = {};
            const vehicles = {};
            const sessions = {};
            
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
                
                // Vehicle statistics
                if (!vehicles[record.vehicle_name]) {
                    vehicles[record.vehicle_name] = 0;
                }
                vehicles[record.vehicle_name]++;
                
                // Session statistics
                if (!sessions[record.session_name]) {
                    sessions[record.session_name] = 0;
                }
                sessions[record.session_name]++;
            });
            
            // Calculate averages
            Object.keys(metrics).forEach(metricName => {
                const metric = metrics[metricName];
                metric.average = metric.sum / metric.count;
                metric.min = metric.min === Infinity ? 0 : metric.min;
                metric.max = metric.max === -Infinity ? 0 : metric.max;
            });
            
            summary.metrics = metrics;
            summary.vehicles = vehicles;
            summary.sessions = sessions;
            
            res.status(200).json({
                success: true,
                data: summary,
                message: "Performance summary retrieved successfully"
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message || "Failed to fetch performance summary"
            });
        }
    } catch (error) {
        console.error("Get performance summary error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Legacy compatibility - map old set endpoints to new performance record endpoints
performanceRecordRouter.post("/users/:user/programs/:program/sessions/:session/sets", async (req, res) => {
    try {
        const userId = req.params.user;
        const programName = req.params.program;
        const sessionName = req.params.session;
        const sets = req.body;
        
        if (!Array.isArray(sets)) {
            return res.status(400).send({ errorMessage: "Request body must be an array of sets" });
        }
        
        // Get vehicles to map exercise names to vehicle IDs
        const vehiclesResult = await getAllVehicles();
        const vehicles = vehiclesResult.success ? vehiclesResult.data : [];
        
        // Find or create a default vehicle if needed
        let defaultVehicleId = 1;
        if (vehicles.length > 0) {
            defaultVehicleId = vehicles[0].id;
        }
        
        // Create performance records for each set
        const results = [];
        const errors = [];
        
        for (let i = 0; i < sets.length; i++) {
            const set = sets[i];
            
            // Map fitness data to transportation data
            const recordData = {
                sessionId: 1, // Default session ID - would need proper session lookup
                vehicleId: defaultVehicleId,
                metricName: set.Exercise || 'unknown',
                metricValue: set.Weight || 0,
                unit: 'lbs', // Default unit for legacy compatibility
                notes: set.Notes || ''
            };
            
            const result = await createPerformanceRecord(recordData);
            
            if (result.success) {
                results.push({ index: i, recordId: result.recordId });
            } else {
                errors.push({ index: i, error: result.message });
            }
        }
        
        res.status(200).send({
            message: `Processed ${results.length} sets, ${errors.length} errors`,
            results: results,
            errors: errors
        });
    } catch (error) {
        console.error("Legacy create sets error:", error);
        res.status(500).send({ errorMessage: "Internal server error" });
    }
});

module.exports = {
    performanceRecordRouter
};
