# Database Migration Guide: Firebase → MySQL

This guide explains how to migrate from Firebase Firestore to MySQL for the Transportation Analytics Platform.

## Overview

The application has been migrated from Firebase Firestore to MySQL to better support the transportation analytics requirements. This migration provides:

- **Better Performance**: MySQL is optimized for relational data queries
- **ACID Compliance**: Better data consistency and reliability
- **Cost Efficiency**: More predictable pricing for enterprise use
- **SQL Standard**: Easier integration with existing business intelligence tools

## Migration Steps

### 1. Prerequisites

- MySQL 8.0+ installed and running
- Node.js 16+ and npm
- Access to the transportation analytics platform codebase

### 2. Install Dependencies

```bash
cd server
npm install
```

### 3. Configure Environment

Copy the environment template and configure your database:

```bash
cp env.example .env
```

Edit `.env` with your MySQL configuration:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=transportation_analytics
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=8081
NODE_ENV=development
```

### 4. Initialize Database

Run the database initialization script:

```bash
npm run init-db
```

This will:
- Create the database if it doesn't exist
- Create all necessary tables
- Insert sample data for testing
- Set up indexes for optimal performance

### 5. Start the Server

Start the server with MySQL support:

```bash
npm run start:mysql
```

## Database Schema

### Tables Created

1. **users** - User accounts and authentication
2. **vehicles** - Fleet vehicles
3. **fleet_routes** - Route categories (replaces programs)
4. **route_sessions** - Specific route runs (replaces sessions)
5. **performance_records** - Performance measurements (replaces sets)
6. **drivers** - Driver information
7. **auth_sessions** - JWT session management

### Data Mapping

| Firebase Collection | MySQL Table | Description |
|-------------------|-------------|-------------|
| `users/{userId}` | `users` | User accounts |
| `users/{userId}/programs/{programId}` | `fleet_routes` | Fleet routes |
| `users/{userId}/programs/{programId}/sessions/{sessionId}` | `route_sessions` | Route sessions |
| `users/{userId}/programs/{programId}/sessions/{sessionId}/sets/{setId}` | `performance_records` | Performance data |

## API Changes

### Authentication

- **Before**: Firebase Auth with session cookies
- **After**: JWT tokens with MySQL session storage

### Endpoints

Most endpoints remain the same for backward compatibility:

- `GET /users/:user/data` - Get all performance data
- `GET /users/:user/vehicles` - Get fleet vehicles
- `GET /users/:user/sessions` - Get route sessions
- `POST /users/:user/sets` - Create performance records
- `GET /users/:user/programs` - Get fleet routes
- `GET /users/:user/time` - Get time-based analytics

### New Endpoints

- `GET /users/:user/summary` - Fleet performance summary
- `GET /health` - Health check

## Sample Data

The initialization script creates sample data:

### Users
- **Admin**: admin@transportation.com / password123
- **Manager**: manager@transportation.com / password123  
- **Driver**: driver@transportation.com / password123

### Vehicles
- Truck-001 (Delivery, 5T, 2022)
- Van-002 (Pickup, 2T, 2023)
- Truck-003 (Long Haul, 15T, 2021)
- Van-004 (Pickup, 1.5T, 2024)

### Fleet Routes
- City Delivery (CITY_ROUTES)
- Long Haul (LONG_HAUL)
- Local Pickup (PICKUP)

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Ensure MySQL is running
   - Check host/port configuration
   - Verify credentials

2. **Permission Denied**
   - Ensure user has CREATE/DROP privileges
   - Check database name permissions

3. **JWT Errors**
   - Verify JWT_SECRET is set
   - Check token expiration

### Logs

Check server logs for detailed error messages:

```bash
npm run start:mysql 2>&1 | tee server.log
```

## Rollback Plan

If you need to rollback to Firebase:

1. Stop the MySQL server
2. Start the original Firebase server: `npm start`
3. The original Firebase configuration is preserved

## Performance Considerations

### Indexes

The migration includes optimized indexes for:
- Vehicle lookups by type and status
- Route queries by owner and type
- Performance record searches by date and metric
- Session queries by route and date

### Query Optimization

- Use prepared statements for security
- Implement connection pooling
- Consider read replicas for analytics queries

## Support

For issues with the migration:

1. Check the troubleshooting section
2. Review server logs
3. Verify database connectivity
4. Ensure all dependencies are installed

## Next Steps

After successful migration:

1. Update frontend to use new endpoints
2. Implement real-time updates with WebSockets
3. Add advanced analytics features
4. Set up monitoring and alerting
