# Transportation Analytics Platform - API Documentation

This document describes the REST API endpoints for the Transportation Analytics Platform.

## Base URL
```
http://localhost:8081
```

## Authentication
The API uses JWT (JSON Web Token) authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format
All API responses follow this format:
```json
{
    "success": true|false,
    "data": {...},
    "message": "Description of the result"
}
```

## Endpoints

### Authentication

#### POST /users
Create a new user account.

**Request Body:**
```json
{
    "username": "string",
    "email": "string",
    "password": "string",
    "role": "ADMIN|MANAGER|DRIVER"
}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "userId": 123
    },
    "message": "User created successfully"
}
```

### Vehicles

#### GET /vehicles
Get all vehicles with optional filtering.

**Query Parameters:**
- `type` (optional): Filter by vehicle type (DELIVERY, PICKUP, LONG_HAUL, VAN, TRUCK)
- `status` (optional): Filter by status (ACTIVE, MAINTENANCE, INACTIVE)
- `search` (optional): Search by name or type

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "Truck-001",
            "type": "DELIVERY",
            "capacity": "5T",
            "year": 2022,
            "mileage": 45000,
            "status": "ACTIVE",
            "created_at": "2024-01-01T00:00:00Z"
        }
    ],
    "message": "Vehicles retrieved successfully"
}
```

#### GET /vehicles/:vehicleId
Get specific vehicle by ID.

#### POST /vehicles
Create a new vehicle.

**Request Body:**
```json
{
    "name": "Truck-002",
    "type": "DELIVERY",
    "capacity": "5T",
    "year": 2023,
    "mileage": 0,
    "status": "ACTIVE"
}
```

#### GET /vehicles/:vehicleId/performance
Get performance records for a specific vehicle.

**Query Parameters:**
- `startDate` (optional): Filter from date (ISO 8601)
- `endDate` (optional): Filter to date (ISO 8601)
- `metricName` (optional): Filter by metric name

#### GET /vehicles/:vehicleId/summary
Get performance summary for a specific vehicle.

### Fleet Routes

#### GET /users/:user/routes
Get all fleet routes for a user.

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "City Delivery",
            "description": "Urban delivery routes",
            "type": "CITY_ROUTES",
            "average_distance": 45.2,
            "average_duration": 4.5,
            "status": "ACTIVE"
        }
    ],
    "message": "Fleet routes retrieved successfully"
}
```

#### GET /users/:user/routes/:routeId
Get specific fleet route by ID.

#### POST /users/:user/routes
Create a new fleet route.

**Request Body:**
```json
{
    "name": "New Route",
    "description": "Route description",
    "type": "CITY_ROUTES",
    "averageDistance": 50.0,
    "averageDuration": 5.0
}
```

#### GET /users/:user/routes/:routeId/sessions
Get all sessions for a specific route.

#### POST /users/:user/routes/:routeId/sessions
Create a new route session.

**Request Body:**
```json
{
    "name": "Morning Delivery",
    "driverId": 1,
    "routeDate": "2024-01-15",
    "startTime": "08:00",
    "endTime": "12:00",
    "status": "PLANNED"
}
```

#### GET /users/:user/routes/:routeId/performance
Get performance data for a specific route.

### Performance Records

#### GET /users/:user/performance-records
Get all performance records for a user.

**Query Parameters:**
- `vehicleId` (optional): Filter by vehicle ID
- `sessionId` (optional): Filter by session ID
- `metricName` (optional): Filter by metric name
- `startDate` (optional): Filter from date
- `endDate` (optional): Filter to date

#### POST /users/:user/performance-records
Create a new performance record.

**Request Body:**
```json
{
    "sessionId": 1,
    "vehicleId": 1,
    "metricName": "fuel_efficiency",
    "metricValue": 8.5,
    "unit": "mpg",
    "notes": "Good efficiency for city driving"
}
```

#### POST /users/:user/performance-records/batch
Create multiple performance records at once.

**Request Body:**
```json
[
    {
        "sessionId": 1,
        "vehicleId": 1,
        "metricName": "fuel_efficiency",
        "metricValue": 8.5,
        "unit": "mpg"
    },
    {
        "sessionId": 1,
        "vehicleId": 1,
        "metricName": "distance_traveled",
        "metricValue": 42.3,
        "unit": "miles"
    }
]
```

#### GET /users/:user/performance-records/summary
Get performance summary statistics.

### Analytics

#### GET /users/:user/analytics/summary
Get fleet performance summary.

**Response:**
```json
{
    "success": true,
    "data": {
        "total_vehicles": 4,
        "active_vehicles": 3,
        "total_routes": 3,
        "completed_sessions": 15,
        "active_sessions": 2,
        "avg_fuel_efficiency": 8.5,
        "total_distance": 1250.5
    },
    "message": "Fleet performance summary retrieved successfully"
}
```

#### GET /users/:user/analytics/time-series
Get time-based performance analytics.

**Query Parameters:**
- `startDate` (optional): Start date for analysis
- `endDate` (optional): End date for analysis
- `metricName` (optional): Specific metric to analyze
- `vehicleId` (optional): Filter by vehicle
- `routeId` (optional): Filter by route

#### GET /users/:user/analytics/comparison
Get performance comparison between vehicles, routes, or sessions.

**Query Parameters:**
- `metricName` (required): Metric to compare
- `groupBy` (required): Group by 'vehicle', 'route', or 'session'
- `startDate` (optional): Start date filter
- `endDate` (optional): End date filter

#### GET /users/:user/analytics/efficiency
Get fleet efficiency metrics.

#### GET /users/:user/analytics/trends
Get performance trends over time.

**Query Parameters:**
- `metricName` (required): Metric to analyze
- `period` (optional): Time period ('day', 'week', 'month')
- `limit` (optional): Number of periods to analyze (default: 12)

### Legacy Compatibility

The following endpoints maintain backward compatibility with the original fitness tracking API:

#### GET /users/:user/programs
Get fleet routes (legacy programs).

#### GET /users/:user/programs/:program
Get specific fleet route data.

#### POST /users/:user/programs/:program
Create new fleet route.

#### POST /users/:user/programs/:program/sessions/:session/sets
Create performance records (legacy sets).

#### GET /users/:user/data
Get all performance data for a user.

#### GET /users/:user/time
Get time-based performance data with legacy format.

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

Error responses include details:
```json
{
    "success": false,
    "message": "Error description",
    "error": "Detailed error information"
}
```

## Rate Limiting

Currently no rate limiting is implemented, but it's recommended for production use.

## CORS

The API supports CORS for the following origins:
- `http://localhost:3000`
- `http://localhost:8081`
- `https://localhost:3000`
- `https://localhost:8081`

## Health Check

#### GET /health
Check API health status.

**Response:**
```json
{
    "status": "healthy",
    "timestamp": "2024-01-15T10:30:00Z",
    "service": "Transportation Analytics Platform API"
}
```
