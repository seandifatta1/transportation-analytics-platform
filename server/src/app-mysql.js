// Transportation Analytics Platform - Express App with MySQL
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Import MySQL database interface
const {
    authenticateUser,
    createUser,
    validateSession,
    getAllVehicles,
    getAllFleetRoutes,
    getAllRouteSessions,
    getAllPerformanceRecords,
    getFleetPerformanceSummary,
    getPerformanceDataByTimeRange,
    // Legacy compatibility
    getAllPrograms,
    getProgram,
    postNewProgram,
    postNewSet
} = require('./database/transportationInterface');

// Import new routers
const { fleetRouteRouter } = require('./routes/fleetRouteRouter');
const { performanceRecordRouter } = require('./routes/performanceRecordRouter');
const { vehicleRouter } = require('./routes/vehicleRouter');
const { analyticsRouter } = require('./routes/analyticsRouter');

const {toJSON, DataFrame} = require("danfojs-node");
const {filterByDate, getHistograms, makeid} = require("./dataUtils");
const _ = require("lodash");

const app = express();

// CORS configuration
app.use(cors({
    origin: [
        'http://localhost:8081',
        'https://localhost:8081',
        'http://localhost:3000',
        'https://localhost:3000'
    ],
    credentials: true,
}));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(cookieParser());
app.use(express.json({limit: "200kb"}));
app.use(express.urlencoded({extended: true}));

// JWT Authentication Middleware
async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ errorMessage: 'Access token required' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret-key');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ errorMessage: 'Invalid or expired token' });
    }
}

// Legacy authentication middleware for gradual migration
async function manageAuthentication(req) {
    try {
        // Check for JWT token first
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret-key');
            return {
                validSession: true,
                user: decoded.userId,
                email: decoded.email,
                sessionID: token
            };
        }
        
        // Fallback to email/password authentication
        if (req.body.email && req.body.password) {
            const authResult = await authenticateUser(req.body.email, req.body.password);
            if (authResult.success) {
                return {
                    validSession: true,
                    user: authResult.user.id,
                    email: authResult.user.email,
                    sessionID: authResult.token
                };
            }
        }
        
        return { validSession: false };
    } catch (error) {
        console.error('Authentication error:', error);
        return { validSession: false };
    }
}

// Apply authentication middleware
app.use(async (req, res, next) => {
    try {
        // Skip authentication for certain routes
        if (req.url === "/health") {
            return next();
        }
        
        if (req.method === "POST" && req.url === "/users") {
            return next();
        }
        
        if (req.method === "POST" && req.url === "/" && req.body.email === undefined && req.body.password === undefined) {
            return next();
        }
        
        const authenticationStatus = await manageAuthentication(req);
        
        if (authenticationStatus.validSession) {
            req.user = {
                id: authenticationStatus.user,
                email: authenticationStatus.email
            };
            return next();
        }
        
        throw new Error("Invalid login credentials");
    } catch (e) {
        res.status(400).send({
            errorMessage: e.message
        });
    }
});

// Root endpoint
app.all("/", (req, res) => {
    if (req.method === "POST" && req.url === "/" && req.body.email === undefined && req.body.password === undefined) {
        res.status(400).send("Need to authenticate");
    } else {
        res.status(200).send("Welcome to the Transportation Analytics Platform backend! \n\n You are logged in and all middleware has been passed successfully");
    }
});

// User management endpoints
app.get("/users", async (req, res) => {
    res.status(200).send("User management endpoint - functionality moved to specific routes");
});

app.post("/users", async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        
        if (!username || !email || !password) {
            return res.status(400).send({
                errorMessage: "Username, email, and password are required"
            });
        }
        
        const result = await createUser(username, email, password, role);
        
        if (result.success) {
            res.status(200).send({
                message: "User created successfully",
                userId: result.userId
            });
        } else {
            res.status(409).send({
                errorMessage: result.message
            });
        }
    } catch (e) {
        res.status(500).send({
            errorMessage: "User creation failed"
        });
    }
});

// Get user data (vehicles, routes, sessions, performance records)
app.get("/users/:user/data", async (req, res) => {
    try {
        const userId = req.params.user;
        const result = await getAllPerformanceRecords(userId);
        
        if (result.success) {
            res.status(200).send(result.data);
        } else {
            res.status(400).send({ errorMessage: result.message });
        }
    } catch (e) {
        res.status(400).send({ errorMessage: "Failed to fetch user data" });
    }
});

// Get vehicles
app.get("/users/:user/vehicles", async (req, res) => {
    try {
        const result = await getAllVehicles();
        
        if (result.success) {
            res.status(200).send(result.data);
        } else {
            res.status(400).send({ errorMessage: result.message });
        }
    } catch (e) {
        res.status(400).send({ errorMessage: "Failed to fetch vehicles" });
    }
});

// Get route sessions
app.get("/users/:user/sessions", async (req, res) => {
    try {
        const userId = req.params.user;
        const result = await getAllRouteSessions(userId);
        
        if (result.success) {
            res.status(200).send(result.data);
        } else {
            res.status(400).send({ errorMessage: result.message });
        }
    } catch (e) {
        res.status(400).send({ errorMessage: "Failed to fetch sessions" });
    }
});

// Create performance record
app.post("/users/:user/sets", async (req, res) => {
    try {
        const { Program, Session, Vehicle, MetricName, MetricValue, Unit, Notes } = req.body;
        
        // Find route ID by name
        const routesResult = await getAllFleetRoutes(req.params.user);
        const route = routesResult.data.find(r => r.name === Program);
        
        if (!route) {
            return res.status(400).send({ errorMessage: "Route not found" });
        }
        
        // Find or create session
        const sessionsResult = await getAllRouteSessions(req.params.user);
        let session = sessionsResult.data.find(s => s.name === Session && s.route_id === route.id);
        
        if (!session) {
            // Create new session
            const sessionResult = await createRouteSession({
                name: Session,
                routeId: route.id,
                routeDate: new Date().toISOString().split('T')[0],
                status: 'COMPLETED'
            });
            
            if (!sessionResult.success) {
                return res.status(400).send({ errorMessage: "Failed to create session" });
            }
            
            session = { id: sessionResult.sessionId };
        }
        
        // Create performance record
        const recordResult = await createPerformanceRecord({
            sessionId: session.id,
            vehicleId: Vehicle || 1, // Default vehicle
            metricName: MetricName || 'unknown',
            metricValue: MetricValue || 0,
            unit: Unit || 'unknown',
            notes: Notes || ''
        });
        
        if (recordResult.success) {
            res.status(200).send({ message: "Performance record created successfully" });
        } else {
            res.status(400).send({ errorMessage: recordResult.message });
        }
    } catch (e) {
        res.status(400).send({ errorMessage: "Failed to create performance record" });
    }
});

// Get fleet routes (programs)
app.get("/users/:user/programs", async (req, res) => {
    try {
        const userId = req.params.user;
        const result = await getAllFleetRoutes(userId);
        
        if (result.success) {
            // Return just the names for compatibility
            const programNames = result.data.map(route => route.name);
            res.status(200).send(programNames);
        } else {
            res.status(400).send({ errorMessage: result.message });
        }
    } catch (e) {
        res.status(400).send({ errorMessage: "Failed to fetch programs" });
    }
});

// Create fleet route (program)
app.post("/users/:user/programs/:program", async (req, res) => {
    try {
        const { type, setData } = req.body;
        const result = await postNewProgram({
            user: req.params.user,
            program: req.params.program,
            type: type || 'CITY_ROUTES',
            setData: setData || []
        });
        
        if (result.success) {
            res.status(200).send({ message: "Fleet route created successfully" });
        } else {
            res.status(400).send({ errorMessage: result.message });
        }
    } catch (e) {
        res.status(400).send({ errorMessage: "Failed to create fleet route" });
    }
});

// Get time-based performance data
app.get("/users/:user/time", async (req, res) => {
    try {
        const { unitOfTime, amount, from } = req.query;
        const userId = req.params.user;
        
        // Calculate date range
        const now = new Date();
        let startDate, endDate;
        
        if (unitOfTime === 'week') {
            const weeksAgo = amount || 1;
            startDate = new Date(now.getTime() - (weeksAgo * 7 * 24 * 60 * 60 * 1000));
            endDate = now;
        } else if (unitOfTime === 'month') {
            const monthsAgo = amount || 1;
            startDate = new Date(now.getFullYear(), now.getMonth() - monthsAgo, now.getDate());
            endDate = now;
        } else {
            startDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000)); // Default to 1 week
            endDate = now;
        }
        
        const result = await getPerformanceDataByTimeRange(
            userId,
            startDate.toISOString(),
            endDate.toISOString()
        );
        
        if (result.success) {
            // Process data for compatibility with existing frontend
            const processedData = {
                lifting: {
                    rawData: result.data.map(record => ({
                        Exercise: record.vehicle_name,
                        Weight: record.metric_value,
                        Reps: 1, // Default for compatibility
                        Time: record.recorded_at,
                        Day: record.session_name,
                        Notes: record.notes
                    })),
                    statistics: {
                        max: result.data.reduce((max, record) => 
                            Math.max(max, record.metric_value), 0
                        )
                    }
                },
                running: {}
            };
            
            res.status(200).send(processedData);
        } else {
            res.status(400).send({ errorMessage: result.message });
        }
    } catch (e) {
        res.status(400).send({ errorMessage: "Failed to fetch time-based data" });
    }
});

// Get fleet performance summary
app.get("/users/:user/summary", async (req, res) => {
    try {
        const userId = req.params.user;
        const result = await getFleetPerformanceSummary(userId);
        
        if (result.success) {
            res.status(200).send(result.data);
        } else {
            res.status(400).send({ errorMessage: result.message });
        }
    } catch (e) {
        res.status(400).send({ errorMessage: "Failed to fetch fleet summary" });
    }
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        service: "Transportation Analytics Platform API"
    });
});

// Use new routers
app.use('/', fleetRouteRouter);
app.use('/', performanceRecordRouter);
app.use('/', vehicleRouter);
app.use('/', analyticsRouter);

// Start server if this file is run directly
if (require.main === module) {
    const PORT = process.env.PORT || 8081;
    app.listen(PORT, () => {
        console.log(`🚀 Transportation Analytics Platform API running on port ${PORT}`);
        console.log(`📊 Health check: http://localhost:${PORT}/health`);
        console.log(`🔧 API Documentation: See README.md for endpoint details`);
    });
}

module.exports = { app };
