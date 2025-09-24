#!/usr/bin/env node
// Database Initialization Script for Transportation Analytics Platform

const { testConnection, initializeDatabase, insertInitialData } = require('../database/mysqlConfig');

async function main() {
    console.log('🚀 Initializing Transportation Analytics Platform Database...\n');
    
    // Test database connection
    console.log('1. Testing database connection...');
    const connectionTest = await testConnection();
    if (!connectionTest) {
        console.error('❌ Database connection failed. Please check your MySQL configuration.');
        process.exit(1);
    }
    
    // Initialize database schema
    console.log('\n2. Creating database schema...');
    const schemaInit = await initializeDatabase();
    if (!schemaInit) {
        console.error('❌ Database schema initialization failed.');
        process.exit(1);
    }
    
    // Insert initial data
    console.log('\n3. Inserting initial data...');
    const dataInit = await insertInitialData();
    if (!dataInit) {
        console.error('❌ Initial data insertion failed.');
        process.exit(1);
    }
    
    console.log('\n✅ Database initialization completed successfully!');
    console.log('\n📊 Database Summary:');
    console.log('   - Users table: Created with sample users');
    console.log('   - Vehicles table: Created with sample vehicles');
    console.log('   - Fleet Routes table: Created with sample routes');
    console.log('   - Route Sessions table: Created');
    console.log('   - Performance Records table: Created');
    console.log('   - Drivers table: Created with sample driver');
    console.log('   - Auth Sessions table: Created for JWT authentication');
    
    console.log('\n🔑 Sample Login Credentials:');
    console.log('   Admin: admin@transportation.com / password123');
    console.log('   Manager: manager@transportation.com / password123');
    console.log('   Driver: driver@transportation.com / password123');
    
    console.log('\n🚀 You can now start the server with: npm start');
    process.exit(0);
}

// Handle errors
process.on('unhandledRejection', (error) => {
    console.error('❌ Unhandled error:', error);
    process.exit(1);
});

// Run the initialization
main().catch((error) => {
    console.error('❌ Initialization failed:', error);
    process.exit(1);
});
