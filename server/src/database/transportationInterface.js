// Transportation Analytics Platform - MySQL Database Interface
// This replaces the Firebase Firestore interface with MySQL operations

const { pool } = require('./mysqlConfig');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Authentication functions
async function authenticateUser(email, password) {
    try {
        const [rows] = await pool.execute(
            'SELECT id, username, email, password_hash, role FROM users WHERE email = ?',
            [email]
        );
        
        if (rows.length === 0) {
            return { success: false, message: 'User not found' };
        }
        
        const user = rows[0];
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!isValidPassword) {
            return { success: false, message: 'Invalid password' };
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'default-secret-key',
            { expiresIn: '24h' }
        );
        
        return {
            success: true,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token
        };
    } catch (error) {
        console.error('Authentication error:', error);
        return { success: false, message: 'Authentication failed' };
    }
}

async function createUser(username, email, password, role = 'DRIVER') {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await pool.execute(
            'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, role]
        );
        
        return {
            success: true,
            userId: result.insertId,
            message: 'User created successfully'
        };
    } catch (error) {
        console.error('User creation error:', error);
        return { success: false, message: 'User creation failed' };
    }
}

async function validateSession(sessionId) {
    try {
        const [rows] = await pool.execute(
            'SELECT s.*, u.username, u.email, u.role FROM auth_sessions s JOIN users u ON s.user_id = u.id WHERE s.session_id = ? AND s.expires_at > NOW()',
            [sessionId]
        );
        
        if (rows.length === 0) {
            return { valid: false };
        }
        
        return {
            valid: true,
            user: {
                id: rows[0].user_id,
                username: rows[0].username,
                email: rows[0].email,
                role: rows[0].role
            }
        };
    } catch (error) {
        console.error('Session validation error:', error);
        return { valid: false };
    }
}

// Vehicle functions
async function getAllVehicles() {
    try {
        const [rows] = await pool.execute('SELECT * FROM vehicles ORDER BY name');
        return { success: true, data: rows };
    } catch (error) {
        console.error('Get vehicles error:', error);
        return { success: false, message: 'Failed to fetch vehicles' };
    }
}

async function getVehicleById(vehicleId) {
    try {
        const [rows] = await pool.execute('SELECT * FROM vehicles WHERE id = ?', [vehicleId]);
        return { success: true, data: rows[0] || null };
    } catch (error) {
        console.error('Get vehicle error:', error);
        return { success: false, message: 'Failed to fetch vehicle' };
    }
}

async function createVehicle(vehicleData) {
    try {
        const { name, type, capacity, year, mileage, status } = vehicleData;
        const [result] = await pool.execute(
            'INSERT INTO vehicles (name, type, capacity, year, mileage, status) VALUES (?, ?, ?, ?, ?, ?)',
            [name, type, capacity, year, mileage, status || 'ACTIVE']
        );
        
        return { success: true, vehicleId: result.insertId };
    } catch (error) {
        console.error('Create vehicle error:', error);
        return { success: false, message: 'Failed to create vehicle' };
    }
}

// Fleet Routes functions (replaces programs)
async function getAllFleetRoutes(userId) {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM fleet_routes WHERE owner_id = ? ORDER BY name',
            [userId]
        );
        return { success: true, data: rows };
    } catch (error) {
        console.error('Get fleet routes error:', error);
        return { success: false, message: 'Failed to fetch fleet routes' };
    }
}

async function getFleetRouteById(routeId) {
    try {
        const [rows] = await pool.execute('SELECT * FROM fleet_routes WHERE id = ?', [routeId]);
        return { success: true, data: rows[0] || null };
    } catch (error) {
        console.error('Get fleet route error:', error);
        return { success: false, message: 'Failed to fetch fleet route' };
    }
}

async function createFleetRoute(routeData) {
    try {
        const { name, description, ownerId, type, averageDistance, averageDuration } = routeData;
        const [result] = await pool.execute(
            'INSERT INTO fleet_routes (name, description, owner_id, type, average_distance, average_duration) VALUES (?, ?, ?, ?, ?, ?)',
            [name, description, ownerId, type, averageDistance, averageDuration]
        );
        
        return { success: true, routeId: result.insertId };
    } catch (error) {
        console.error('Create fleet route error:', error);
        return { success: false, message: 'Failed to create fleet route' };
    }
}

// Route Sessions functions (replaces sessions)
async function getAllRouteSessions(userId) {
    try {
        const [rows] = await pool.execute(`
            SELECT rs.*, fr.name as route_name, fr.type as route_type, u.username as driver_name
            FROM route_sessions rs
            JOIN fleet_routes fr ON rs.route_id = fr.id
            LEFT JOIN users u ON rs.driver_id = u.id
            WHERE fr.owner_id = ?
            ORDER BY rs.route_date DESC, rs.start_time DESC
        `, [userId]);
        
        return { success: true, data: rows };
    } catch (error) {
        console.error('Get route sessions error:', error);
        return { success: false, message: 'Failed to fetch route sessions' };
    }
}

async function getRouteSessionById(sessionId) {
    try {
        const [rows] = await pool.execute(`
            SELECT rs.*, fr.name as route_name, fr.type as route_type, u.username as driver_name
            FROM route_sessions rs
            JOIN fleet_routes fr ON rs.route_id = fr.id
            LEFT JOIN users u ON rs.driver_id = u.id
            WHERE rs.id = ?
        `, [sessionId]);
        
        return { success: true, data: rows[0] || null };
    } catch (error) {
        console.error('Get route session error:', error);
        return { success: false, message: 'Failed to fetch route session' };
    }
}

async function createRouteSession(sessionData) {
    try {
        const { name, routeId, driverId, routeDate, startTime, endTime, status } = sessionData;
        const [result] = await pool.execute(
            'INSERT INTO route_sessions (name, route_id, driver_id, route_date, start_time, end_time, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, routeId, driverId, routeDate, startTime, endTime, status || 'PLANNED']
        );
        
        return { success: true, sessionId: result.insertId };
    } catch (error) {
        console.error('Create route session error:', error);
        return { success: false, message: 'Failed to create route session' };
    }
}

// Performance Records functions (replaces sets)
async function getAllPerformanceRecords(userId) {
    try {
        const [rows] = await pool.execute(`
            SELECT pr.*, v.name as vehicle_name, v.type as vehicle_type, rs.name as session_name, fr.name as route_name
            FROM performance_records pr
            JOIN route_sessions rs ON pr.session_id = rs.id
            JOIN fleet_routes fr ON rs.route_id = fr.id
            JOIN vehicles v ON pr.vehicle_id = v.id
            WHERE fr.owner_id = ?
            ORDER BY pr.recorded_at DESC
        `, [userId]);
        
        return { success: true, data: rows };
    } catch (error) {
        console.error('Get performance records error:', error);
        return { success: false, message: 'Failed to fetch performance records' };
    }
}

async function getPerformanceRecordsBySession(sessionId) {
    try {
        const [rows] = await pool.execute(`
            SELECT pr.*, v.name as vehicle_name, v.type as vehicle_type
            FROM performance_records pr
            JOIN vehicles v ON pr.vehicle_id = v.id
            WHERE pr.session_id = ?
            ORDER BY pr.recorded_at
        `, [sessionId]);
        
        return { success: true, data: rows };
    } catch (error) {
        console.error('Get performance records by session error:', error);
        return { success: false, message: 'Failed to fetch performance records' };
    }
}

async function getPerformanceRecordsByVehicle(vehicleId) {
    try {
        const [rows] = await pool.execute(`
            SELECT pr.*, rs.name as session_name, fr.name as route_name
            FROM performance_records pr
            JOIN route_sessions rs ON pr.session_id = rs.id
            JOIN fleet_routes fr ON rs.route_id = fr.id
            WHERE pr.vehicle_id = ?
            ORDER BY pr.recorded_at DESC
        `, [vehicleId]);
        
        return { success: true, data: rows };
    } catch (error) {
        console.error('Get performance records by vehicle error:', error);
        return { success: false, message: 'Failed to fetch performance records' };
    }
}

async function createPerformanceRecord(recordData) {
    try {
        const { sessionId, vehicleId, metricName, metricValue, unit, notes } = recordData;
        const [result] = await pool.execute(
            'INSERT INTO performance_records (session_id, vehicle_id, metric_name, metric_value, unit, notes) VALUES (?, ?, ?, ?, ?, ?)',
            [sessionId, vehicleId, metricName, metricValue, unit, notes]
        );
        
        return { success: true, recordId: result.insertId };
    } catch (error) {
        console.error('Create performance record error:', error);
        return { success: false, message: 'Failed to create performance record' };
    }
}

// Analytics functions
async function getFleetPerformanceSummary(userId) {
    try {
        const [summary] = await pool.execute(`
            SELECT 
                COUNT(DISTINCT v.id) as total_vehicles,
                COUNT(DISTINCT CASE WHEN v.status = 'ACTIVE' THEN v.id END) as active_vehicles,
                COUNT(DISTINCT fr.id) as total_routes,
                COUNT(DISTINCT CASE WHEN rs.status = 'COMPLETED' THEN rs.id END) as completed_sessions,
                COUNT(DISTINCT CASE WHEN rs.status = 'IN_PROGRESS' THEN rs.id END) as active_sessions,
                AVG(CASE WHEN pr.metric_name = 'fuel_efficiency' THEN pr.metric_value END) as avg_fuel_efficiency,
                SUM(CASE WHEN pr.metric_name = 'distance_traveled' THEN pr.metric_value ELSE 0 END) as total_distance
            FROM vehicles v
            LEFT JOIN fleet_routes fr ON fr.owner_id = ?
            LEFT JOIN route_sessions rs ON rs.route_id = fr.id
            LEFT JOIN performance_records pr ON pr.session_id = rs.id
        `, [userId]);
        
        return { success: true, data: summary[0] };
    } catch (error) {
        console.error('Get fleet performance summary error:', error);
        return { success: false, message: 'Failed to fetch fleet performance summary' };
    }
}

async function getPerformanceDataByTimeRange(userId, startDate, endDate, metricName = null) {
    try {
        let query = `
            SELECT pr.*, v.name as vehicle_name, rs.name as session_name, fr.name as route_name
            FROM performance_records pr
            JOIN route_sessions rs ON pr.session_id = rs.id
            JOIN fleet_routes fr ON rs.route_id = fr.id
            JOIN vehicles v ON pr.vehicle_id = v.id
            WHERE fr.owner_id = ? AND pr.recorded_at BETWEEN ? AND ?
        `;
        
        const params = [userId, startDate, endDate];
        
        if (metricName) {
            query += ' AND pr.metric_name = ?';
            params.push(metricName);
        }
        
        query += ' ORDER BY pr.recorded_at';
        
        const [rows] = await pool.execute(query, params);
        return { success: true, data: rows };
    } catch (error) {
        console.error('Get performance data by time range error:', error);
        return { success: false, message: 'Failed to fetch performance data' };
    }
}

// Legacy compatibility functions (for gradual migration)
async function getAllPrograms(userId) {
    return await getAllFleetRoutes(userId);
}

async function getProgram(userId, programName) {
    const [rows] = await pool.execute(
        'SELECT * FROM fleet_routes WHERE owner_id = ? AND name = ?',
        [userId, programName]
    );
    
    if (rows.length === 0) {
        return { success: false, message: 'Program not found' };
    }
    
    const route = rows[0];
    const sessionsResult = await getAllRouteSessions(userId);
    const sessions = sessionsResult.data.filter(s => s.route_id === route.id);
    
    return {
        success: true,
        data: {
            type: route.type,
            setData: sessions // Map sessions to setData for compatibility
        }
    };
}

async function postNewProgram(programData) {
    const { user, program, type, setData } = programData;
    return await createFleetRoute({
        name: program,
        description: `${type} route`,
        ownerId: user,
        type: type.toUpperCase(),
        averageDistance: 0,
        averageDuration: 0
    });
}

async function postNewSet(setData) {
    const { user, program, session, setData: records } = setData;
    
    // Find the route ID by name
    const [routeRows] = await pool.execute(
        'SELECT id FROM fleet_routes WHERE owner_id = ? AND name = ?',
        [user, program]
    );
    
    if (routeRows.length === 0) {
        return { success: false, message: 'Route not found' };
    }
    
    const routeId = routeRows[0].id;
    
    // Find or create session
    let [sessionRows] = await pool.execute(
        'SELECT id FROM route_sessions WHERE route_id = ? AND name = ?',
        [routeId, session]
    );
    
    let sessionId;
    if (sessionRows.length === 0) {
        const sessionResult = await createRouteSession({
            name: session,
            routeId: routeId,
            routeDate: new Date().toISOString().split('T')[0],
            status: 'COMPLETED'
        });
        sessionId = sessionResult.sessionId;
    } else {
        sessionId = sessionRows[0].id;
    }
    
    // Create performance records
    for (const record of records) {
        await createPerformanceRecord({
            sessionId: sessionId,
            vehicleId: 1, // Default vehicle for now
            metricName: record.Exercise || 'unknown',
            metricValue: record.Weight || 0,
            unit: 'lbs',
            notes: record.Notes || ''
        });
    }
    
    return { success: true };
}

module.exports = {
    // Authentication
    authenticateUser,
    createUser,
    validateSession,
    
    // Vehicles
    getAllVehicles,
    getVehicleById,
    createVehicle,
    
    // Fleet Routes
    getAllFleetRoutes,
    getFleetRouteById,
    createFleetRoute,
    
    // Route Sessions
    getAllRouteSessions,
    getRouteSessionById,
    createRouteSession,
    
    // Performance Records
    getAllPerformanceRecords,
    getPerformanceRecordsBySession,
    getPerformanceRecordsByVehicle,
    createPerformanceRecord,
    
    // Analytics
    getFleetPerformanceSummary,
    getPerformanceDataByTimeRange,
    
    // Legacy compatibility
    getAllPrograms,
    getProgram,
    postNewProgram,
    postNewSet
};
