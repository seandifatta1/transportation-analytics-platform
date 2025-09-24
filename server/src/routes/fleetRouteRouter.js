// Transportation Analytics Platform - Fleet Route Router
// This replaces the program router with transportation-focused fleet route management

const express = require("express");
const {
    getAllFleetRoutes,
    getFleetRouteById,
    createFleetRoute,
    getAllRouteSessions,
    createRouteSession,
    getAllPerformanceRecords
} = require("../database/transportationInterface");

const fleetRouteRouter = express.Router();

// Get all fleet routes for a user
fleetRouteRouter.get("/users/:user/routes", async (req, res) => {
    try {
        const userId = req.params.user;
        const result = await getAllFleetRoutes(userId);
        
        if (result.success) {
            res.status(200).json({
                success: true,
                data: result.data,
                message: "Fleet routes retrieved successfully"
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message || "Failed to fetch fleet routes"
            });
        }
    } catch (error) {
        console.error("Get fleet routes error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Get specific fleet route by ID
fleetRouteRouter.get("/users/:user/routes/:routeId", async (req, res) => {
    try {
        const { routeId } = req.params;
        const result = await getFleetRouteById(routeId);
        
        if (result.success) {
            if (result.data) {
                res.status(200).json({
                    success: true,
                    data: result.data,
                    message: "Fleet route retrieved successfully"
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "Fleet route not found"
                });
            }
        } else {
            res.status(400).json({
                success: false,
                message: result.message || "Failed to fetch fleet route"
            });
        }
    } catch (error) {
        console.error("Get fleet route error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Create new fleet route
fleetRouteRouter.post("/users/:user/routes", async (req, res) => {
    try {
        const userId = req.params.user;
        const { name, description, type, averageDistance, averageDuration } = req.body;
        
        // Validate required fields
        if (!name || !type) {
            return res.status(400).json({
                success: false,
                message: "Name and type are required fields"
            });
        }
        
        const routeData = {
            name,
            description: description || "",
            ownerId: userId,
            type: type.toUpperCase(),
            averageDistance: averageDistance || 0,
            averageDuration: averageDuration || 0
        };
        
        const result = await createFleetRoute(routeData);
        
        if (result.success) {
            res.status(201).json({
                success: true,
                data: { routeId: result.routeId },
                message: "Fleet route created successfully"
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message || "Failed to create fleet route"
            });
        }
    } catch (error) {
        console.error("Create fleet route error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Update fleet route
fleetRouteRouter.put("/users/:user/routes/:routeId", async (req, res) => {
    try {
        const { routeId } = req.params;
        const { name, description, type, averageDistance, averageDuration, status } = req.body;
        
        // This would require an updateFleetRoute function in the interface
        res.status(501).json({
            success: false,
            message: "Update fleet route functionality not yet implemented"
        });
    } catch (error) {
        console.error("Update fleet route error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Delete fleet route
fleetRouteRouter.delete("/users/:user/routes/:routeId", async (req, res) => {
    try {
        const { routeId } = req.params;
        
        // This would require a deleteFleetRoute function in the interface
        res.status(501).json({
            success: false,
            message: "Delete fleet route functionality not yet implemented"
        });
    } catch (error) {
        console.error("Delete fleet route error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Get route sessions for a specific route
fleetRouteRouter.get("/users/:user/routes/:routeId/sessions", async (req, res) => {
    try {
        const userId = req.params.user;
        const result = await getAllRouteSessions(userId);
        
        if (result.success) {
            // Filter sessions for the specific route
            const routeSessions = result.data.filter(session => 
                session.route_id == req.params.routeId
            );
            
            res.status(200).json({
                success: true,
                data: routeSessions,
                message: "Route sessions retrieved successfully"
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message || "Failed to fetch route sessions"
            });
        }
    } catch (error) {
        console.error("Get route sessions error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Create new route session
fleetRouteRouter.post("/users/:user/routes/:routeId/sessions", async (req, res) => {
    try {
        const { routeId } = req.params;
        const { name, driverId, routeDate, startTime, endTime, status } = req.body;
        
        const sessionData = {
            name: name || `Session ${new Date().toISOString()}`,
            routeId: parseInt(routeId),
            driverId: driverId ? parseInt(driverId) : null,
            routeDate: routeDate || new Date().toISOString().split('T')[0],
            startTime: startTime || null,
            endTime: endTime || null,
            status: status || 'PLANNED'
        };
        
        const result = await createRouteSession(sessionData);
        
        if (result.success) {
            res.status(201).json({
                success: true,
                data: { sessionId: result.sessionId },
                message: "Route session created successfully"
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message || "Failed to create route session"
            });
        }
    } catch (error) {
        console.error("Create route session error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Get performance data for a specific route
fleetRouteRouter.get("/users/:user/routes/:routeId/performance", async (req, res) => {
    try {
        const userId = req.params.user;
        const { routeId } = req.params;
        const { startDate, endDate, metricName } = req.query;
        
        // Get all performance records for the user
        const result = await getAllPerformanceRecords(userId);
        
        if (result.success) {
            // Filter by route and optional date/metric filters
            let filteredData = result.data.filter(record => 
                record.route_id == routeId
            );
            
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
            
            if (metricName) {
                filteredData = filteredData.filter(record => 
                    record.metric_name === metricName
                );
            }
            
            res.status(200).json({
                success: true,
                data: filteredData,
                message: "Route performance data retrieved successfully"
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message || "Failed to fetch route performance data"
            });
        }
    } catch (error) {
        console.error("Get route performance error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Legacy compatibility - map old program endpoints to new route endpoints
fleetRouteRouter.get("/users/:user/programs", async (req, res) => {
    try {
        const userId = req.params.user;
        const result = await getAllFleetRoutes(userId);
        
        if (result.success) {
            // Return just the names for backward compatibility
            const programNames = result.data.map(route => route.name);
            res.status(200).send(programNames);
        } else {
            res.status(400).send({ errorMessage: result.message });
        }
    } catch (error) {
        console.error("Legacy get programs error:", error);
        res.status(500).send({ errorMessage: "Internal server error" });
    }
});

fleetRouteRouter.get("/users/:user/programs/:program", async (req, res) => {
    try {
        const userId = req.params.user;
        const programName = req.params.program;
        
        // Find route by name
        const result = await getAllFleetRoutes(userId);
        
        if (result.success) {
            const route = result.data.find(r => r.name === programName);
            
            if (route) {
                // Get sessions for this route
                const sessionsResult = await getAllRouteSessions(userId);
                const routeSessions = sessionsResult.success ? 
                    sessionsResult.data.filter(s => s.route_id === route.id) : [];
                
                res.status(200).json({
                    metaData: {
                        type: route.type,
                        name: route.name,
                        description: route.description
                    },
                    data: routeSessions
                });
            } else {
                res.status(404).send({ errorMessage: "Program not found" });
            }
        } else {
            res.status(400).send({ errorMessage: result.message });
        }
    } catch (error) {
        console.error("Legacy get program error:", error);
        res.status(500).send({ errorMessage: "Internal server error" });
    }
});

fleetRouteRouter.post("/users/:user/programs/:program", async (req, res) => {
    try {
        const userId = req.params.user;
        const programName = req.params.program;
        const { type, setData } = req.body;
        
        const routeData = {
            name: programName,
            description: `${type || 'CITY_ROUTES'} route`,
            ownerId: userId,
            type: (type || 'CITY_ROUTES').toUpperCase(),
            averageDistance: 0,
            averageDuration: 0
        };
        
        const result = await createFleetRoute(routeData);
        
        if (result.success) {
            res.status(200).send(`Success! ${programName} added`);
        } else {
            res.status(400).send({ errorMessage: result.message });
        }
    } catch (error) {
        console.error("Legacy create program error:", error);
        res.status(500).send({ errorMessage: "Internal server error" });
    }
});

module.exports = {
    fleetRouteRouter
};
