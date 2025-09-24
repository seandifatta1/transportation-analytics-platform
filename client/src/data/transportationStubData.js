// Transportation Analytics Platform - Stub Data
// This file contains realistic transportation data for development and testing

export const transportationStubData = {
  vehicles: [
    {
      id: "vehicle-001",
      name: "Truck-001",
      type: "DELIVERY",
      capacity: "5T",
      year: 2022,
      mileage: 45000,
      status: "ACTIVE"
    },
    {
      id: "vehicle-002", 
      name: "Van-002",
      type: "PICKUP",
      capacity: "2T",
      year: 2023,
      mileage: 12000,
      status: "ACTIVE"
    },
    {
      id: "vehicle-003",
      name: "Truck-003", 
      type: "LONG_HAUL",
      capacity: "15T",
      year: 2021,
      mileage: 78000,
      status: "ACTIVE"
    },
    {
      id: "vehicle-004",
      name: "Van-004",
      type: "PICKUP", 
      capacity: "1.5T",
      year: 2024,
      mileage: 3500,
      status: "MAINTENANCE"
    }
  ],

  fleetRoutes: [
    {
      id: "route-001",
      name: "City Delivery",
      type: "CITY_ROUTES",
      description: "Urban delivery routes within city limits",
      averageDistance: 45.2,
      averageDuration: 4.5,
      status: "ACTIVE"
    },
    {
      id: "route-002", 
      name: "Long Haul",
      type: "LONG_HAUL",
      description: "Interstate transportation routes",
      averageDistance: 320.8,
      averageDuration: 6.2,
      status: "ACTIVE"
    },
    {
      id: "route-003",
      name: "Local Pickup",
      type: "PICKUP",
      description: "Local pickup and delivery service",
      averageDistance: 18.5,
      averageDuration: 2.8,
      status: "ACTIVE"
    }
  ],

  routeSessions: [
    {
      id: "session-001",
      name: "Morning City Delivery",
      routeId: "route-001",
      date: "2024-01-15",
      startTime: "08:00",
      endTime: "12:30",
      driverId: "driver-001",
      status: "COMPLETED"
    },
    {
      id: "session-002",
      name: "Afternoon City Delivery", 
      routeId: "route-001",
      date: "2024-01-15",
      startTime: "13:00",
      endTime: "17:30",
      driverId: "driver-002",
      status: "COMPLETED"
    },
    {
      id: "session-003",
      name: "Long Haul - East Coast",
      routeId: "route-002",
      date: "2024-01-14",
      startTime: "06:00",
      endTime: "18:00",
      driverId: "driver-003",
      status: "COMPLETED"
    },
    {
      id: "session-004",
      name: "Local Pickup Run",
      routeId: "route-003", 
      date: "2024-01-16",
      startTime: "09:00",
      endTime: "11:45",
      driverId: "driver-001",
      status: "IN_PROGRESS"
    }
  ],

  performanceRecords: [
    // Vehicle-001 (Truck-001) performance records
    {
      id: "record-001",
      sessionId: "session-001",
      vehicleId: "vehicle-001",
      metricName: "fuel_efficiency",
      metricValue: 8.5,
      unit: "mpg",
      timestamp: "2024-01-15T08:00:00Z",
      notes: "Good fuel efficiency for city driving"
    },
    {
      id: "record-002", 
      sessionId: "session-001",
      vehicleId: "vehicle-001",
      metricName: "average_speed",
      metricValue: 28.5,
      unit: "mph",
      timestamp: "2024-01-15T08:15:00Z",
      notes: "Traffic congestion affected speed"
    },
    {
      id: "record-003",
      sessionId: "session-001", 
      vehicleId: "vehicle-001",
      metricName: "distance_traveled",
      metricValue: 42.3,
      unit: "miles",
      timestamp: "2024-01-15T12:30:00Z",
      notes: "Completed 15 deliveries"
    },
    {
      id: "record-004",
      sessionId: "session-001",
      vehicleId: "vehicle-001", 
      metricName: "idle_time",
      metricValue: 0.8,
      unit: "hours",
      timestamp: "2024-01-15T12:30:00Z",
      notes: "Minimal idle time - efficient route"
    },

    // Vehicle-002 (Van-002) performance records
    {
      id: "record-005",
      sessionId: "session-002",
      vehicleId: "vehicle-002",
      metricName: "fuel_efficiency", 
      metricValue: 12.2,
      unit: "mpg",
      timestamp: "2024-01-15T13:00:00Z",
      notes: "Excellent fuel efficiency for van"
    },
    {
      id: "record-006",
      sessionId: "session-002",
      vehicleId: "vehicle-002",
      metricName: "average_speed",
      metricValue: 32.1,
      unit: "mph", 
      timestamp: "2024-01-15T13:15:00Z",
      notes: "Better traffic conditions in afternoon"
    },
    {
      id: "record-007",
      sessionId: "session-002",
      vehicleId: "vehicle-002",
      metricName: "distance_traveled",
      metricValue: 38.7,
      unit: "miles",
      timestamp: "2024-01-15T17:30:00Z",
      notes: "Completed 12 deliveries"
    },

    // Vehicle-003 (Truck-003) performance records - Long Haul
    {
      id: "record-008",
      sessionId: "session-003", 
      vehicleId: "vehicle-003",
      metricName: "fuel_efficiency",
      metricValue: 6.8,
      unit: "mpg",
      timestamp: "2024-01-14T06:00:00Z",
      notes: "Heavy load - expected lower efficiency"
    },
    {
      id: "record-009",
      sessionId: "session-003",
      vehicleId: "vehicle-003",
      metricName: "average_speed",
      metricValue: 58.2,
      unit: "mph",
      timestamp: "2024-01-14T06:15:00Z", 
      notes: "Highway driving - good average speed"
    },
    {
      id: "record-010",
      sessionId: "session-003",
      vehicleId: "vehicle-003",
      metricName: "distance_traveled",
      metricValue: 315.4,
      unit: "miles",
      timestamp: "2024-01-14T18:00:00Z",
      notes: "Long haul completed successfully"
    },
    {
      id: "record-011",
      sessionId: "session-003",
      vehicleId: "vehicle-003",
      metricName: "idle_time",
      metricValue: 0.3,
      unit: "hours",
      timestamp: "2024-01-14T18:00:00Z",
      notes: "Minimal idle time - efficient long haul"
    },

    // Vehicle-004 (Van-004) performance records - Local Pickup
    {
      id: "record-012",
      sessionId: "session-004",
      vehicleId: "vehicle-004", 
      metricName: "fuel_efficiency",
      metricValue: 14.1,
      unit: "mpg",
      timestamp: "2024-01-16T09:00:00Z",
      notes: "New vehicle - excellent efficiency"
    },
    {
      id: "record-013",
      sessionId: "session-004",
      vehicleId: "vehicle-004",
      metricName: "average_speed",
      metricValue: 25.8,
      unit: "mph",
      timestamp: "2024-01-16T09:15:00Z",
      notes: "Local streets - slower but efficient"
    },
    {
      id: "record-014",
      sessionId: "session-004",
      vehicleId: "vehicle-004",
      metricName: "distance_traveled",
      metricValue: 16.2,
      unit: "miles",
      timestamp: "2024-01-16T11:45:00Z",
      notes: "Local pickup route - shorter distance"
    }
  ],

  drivers: [
    {
      id: "driver-001",
      name: "John Smith",
      licenseNumber: "DL123456789",
      experience: "5 years",
      status: "ACTIVE"
    },
    {
      id: "driver-002", 
      name: "Sarah Johnson",
      licenseNumber: "DL987654321",
      experience: "3 years",
      status: "ACTIVE"
    },
    {
      id: "driver-003",
      name: "Mike Wilson",
      licenseNumber: "DL456789123", 
      experience: "8 years",
      status: "ACTIVE"
    }
  ],

  // Helper functions for data manipulation
  getVehicleById: (vehicleId) => {
    return transportationStubData.vehicles.find(v => v.id === vehicleId);
  },

  getRouteById: (routeId) => {
    return transportationStubData.fleetRoutes.find(r => r.id === routeId);
  },

  getSessionById: (sessionId) => {
    return transportationStubData.routeSessions.find(s => s.id === sessionId);
  },

  getPerformanceRecordsByVehicle: (vehicleId) => {
    return transportationStubData.performanceRecords.filter(r => r.vehicleId === vehicleId);
  },

  getPerformanceRecordsBySession: (sessionId) => {
    return transportationStubData.performanceRecords.filter(r => r.sessionId === sessionId);
  },

  getPerformanceRecordsByMetric: (metricName) => {
    return transportationStubData.performanceRecords.filter(r => r.metricName === metricName);
  }
};

export default transportationStubData;
