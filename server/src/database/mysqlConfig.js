// MySQL Database Configuration for Transportation Analytics Platform
const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || '127.0.0.1', // Use IPv4 instead of localhost
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD === 'your_mysql_password' ? '' : (process.env.DB_PASSWORD || ''),
    database: process.env.DB_NAME || 'transportation_analytics',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ MySQL database connected successfully');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ MySQL database connection failed:', error.message);
        return false;
    }
}

// Initialize database schema
async function initializeDatabase() {
    try {
        const connection = await pool.getConnection();
        
        // Create database if it doesn't exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
        await connection.query(`USE ${dbConfig.database}`);
        
        // Create users table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id BIGINT PRIMARY KEY AUTO_INCREMENT,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role ENUM('ADMIN', 'MANAGER', 'DRIVER') DEFAULT 'DRIVER',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        
        // Create vehicles table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS vehicles (
                id BIGINT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL,
                type ENUM('DELIVERY', 'PICKUP', 'LONG_HAUL', 'VAN', 'TRUCK') NOT NULL,
                capacity VARCHAR(20),
                year INT,
                mileage BIGINT DEFAULT 0,
                status ENUM('ACTIVE', 'MAINTENANCE', 'INACTIVE') DEFAULT 'ACTIVE',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        
        // Create fleet_routes table (replaces programs)
        await connection.query(`
            CREATE TABLE IF NOT EXISTS fleet_routes (
                id BIGINT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                owner_id BIGINT NOT NULL,
                type ENUM('CITY_ROUTES', 'LONG_HAUL', 'PICKUP', 'DELIVERY') DEFAULT 'CITY_ROUTES',
                average_distance DECIMAL(10,2),
                average_duration DECIMAL(5,2),
                status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        
        // Create route_sessions table (replaces sessions)
        await connection.query(`
            CREATE TABLE IF NOT EXISTS route_sessions (
                id BIGINT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL,
                route_id BIGINT NOT NULL,
                driver_id BIGINT,
                route_date DATE NOT NULL,
                start_time TIME,
                end_time TIME,
                status ENUM('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') DEFAULT 'PLANNED',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (route_id) REFERENCES fleet_routes(id) ON DELETE CASCADE,
                FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE SET NULL
            )
        `);
        
        // Create performance_records table (replaces sets)
        await connection.query(`
            CREATE TABLE IF NOT EXISTS performance_records (
                id BIGINT PRIMARY KEY AUTO_INCREMENT,
                session_id BIGINT NOT NULL,
                vehicle_id BIGINT NOT NULL,
                metric_name VARCHAR(100) NOT NULL,
                metric_value DECIMAL(10,2) NOT NULL,
                unit VARCHAR(20) NOT NULL,
                notes TEXT,
                recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (session_id) REFERENCES route_sessions(id) ON DELETE CASCADE,
                FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
            )
        `);
        
        // Create drivers table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS drivers (
                id BIGINT PRIMARY KEY AUTO_INCREMENT,
                user_id BIGINT NOT NULL,
                license_number VARCHAR(50) UNIQUE,
                experience_years INT DEFAULT 0,
                status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') DEFAULT 'ACTIVE',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        
        // Create sessions table for authentication (replaces Firebase sessions)
        await connection.query(`
            CREATE TABLE IF NOT EXISTS auth_sessions (
                id BIGINT PRIMARY KEY AUTO_INCREMENT,
                user_id BIGINT NOT NULL,
                session_id VARCHAR(100) UNIQUE NOT NULL,
                email VARCHAR(255) NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        
        // Create indexes for better performance (MySQL doesn't support IF NOT EXISTS for indexes)
        try {
            await connection.query(`CREATE INDEX idx_vehicles_type ON vehicles(type)`);
        } catch (e) { /* Index already exists */ }
        
        try {
            await connection.query(`CREATE INDEX idx_vehicles_status ON vehicles(status)`);
        } catch (e) { /* Index already exists */ }
        
        try {
            await connection.query(`CREATE INDEX idx_routes_owner ON fleet_routes(owner_id)`);
        } catch (e) { /* Index already exists */ }
        
        try {
            await connection.query(`CREATE INDEX idx_routes_type ON fleet_routes(type)`);
        } catch (e) { /* Index already exists */ }
        
        try {
            await connection.query(`CREATE INDEX idx_sessions_route ON route_sessions(route_id)`);
        } catch (e) { /* Index already exists */ }
        
        try {
            await connection.query(`CREATE INDEX idx_sessions_date ON route_sessions(route_date)`);
        } catch (e) { /* Index already exists */ }
        
        try {
            await connection.query(`CREATE INDEX idx_performance_session ON performance_records(session_id)`);
        } catch (e) { /* Index already exists */ }
        
        try {
            await connection.query(`CREATE INDEX idx_performance_vehicle ON performance_records(vehicle_id)`);
        } catch (e) { /* Index already exists */ }
        
        try {
            await connection.query(`CREATE INDEX idx_performance_metric ON performance_records(metric_name)`);
        } catch (e) { /* Index already exists */ }
        
        try {
            await connection.query(`CREATE INDEX idx_performance_recorded_at ON performance_records(recorded_at)`);
        } catch (e) { /* Index already exists */ }
        
        try {
            await connection.query(`CREATE INDEX idx_auth_sessions_user ON auth_sessions(user_id)`);
        } catch (e) { /* Index already exists */ }
        
        try {
            await connection.query(`CREATE INDEX idx_auth_sessions_expires ON auth_sessions(expires_at)`);
        } catch (e) { /* Index already exists */ }
        
        connection.release();
        console.log('✅ Database schema initialized successfully');
        return true;
        
    } catch (error) {
        console.error('❌ Database initialization failed:', error.message);
        return false;
    }
}

// Insert initial data
async function insertInitialData() {
    try {
        const connection = await pool.getConnection();
        
        // Check if data already exists
        const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
        if (users[0].count > 0) {
            console.log('📊 Initial data already exists, skipping...');
            connection.release();
            return true;
        }
        
        // Insert sample vehicles
        await connection.query(`
            INSERT INTO vehicles (name, type, capacity, year, mileage, status) VALUES
            ('Truck-001', 'DELIVERY', '5T', 2022, 45000, 'ACTIVE'),
            ('Van-002', 'PICKUP', '2T', 2023, 12000, 'ACTIVE'),
            ('Truck-003', 'LONG_HAUL', '15T', 2021, 78000, 'ACTIVE'),
            ('Van-004', 'PICKUP', '1.5T', 2024, 3500, 'MAINTENANCE')
        `);
        
        // Insert sample user (for testing)
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        await connection.query(`
            INSERT INTO users (username, email, password_hash, role) VALUES
            ('admin', 'admin@transportation.com', ?, 'ADMIN'),
            ('manager1', 'manager@transportation.com', ?, 'MANAGER'),
            ('driver1', 'driver@transportation.com', ?, 'DRIVER')
        `, [hashedPassword, hashedPassword, hashedPassword]);
        
        // Insert sample fleet routes
        await connection.query(`
            INSERT INTO fleet_routes (name, description, owner_id, type, average_distance, average_duration) VALUES
            ('City Delivery', 'Urban delivery routes within city limits', 1, 'CITY_ROUTES', 45.2, 4.5),
            ('Long Haul', 'Interstate transportation routes', 1, 'LONG_HAUL', 320.8, 6.2),
            ('Local Pickup', 'Local pickup and delivery service', 1, 'PICKUP', 18.5, 2.8)
        `);
        
        // Insert sample drivers
        await connection.query(`
            INSERT INTO drivers (user_id, license_number, experience_years, status) VALUES
            (3, 'DL123456789', 5, 'ACTIVE')
        `);
        
        connection.release();
        console.log('✅ Initial data inserted successfully');
        return true;
        
    } catch (error) {
        console.error('❌ Initial data insertion failed:', error.message);
        return false;
    }
}

module.exports = {
    pool,
    testConnection,
    initializeDatabase,
    insertInitialData
};
