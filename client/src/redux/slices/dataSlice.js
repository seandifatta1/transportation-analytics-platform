import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    // Transportation data entities
    vehicles: [],              // Fleet vehicles
    fleetRoutes: [],           // Route categories (City Delivery, Long Haul, etc.)
    routeSessions: [],         // Specific route runs
    performanceRecords: [],    // Individual performance measurements
    drivers: [],               // Fleet drivers
    
    // Derived data for easy access
    vehicleTypes: [],          // Unique vehicle types
    routeTypes: [],            // Unique route types
    metricTypes: [],           // Unique performance metrics
    activeSessions: [],        // Currently active route sessions
};

const dataSlice = createSlice({
    name: 'fleetData',
    initialState,
    reducers: {
        // Set all performance records and derive unique lists
        setPerformanceRecords: (state, action) => {
            state.performanceRecords = action.payload;
            // Update derived lists based on performance records
            state.metricTypes = Array.from(new Set(action.payload.map(record => record.metricName)));
        },
        
        // Set all vehicles
        setVehicles: (state, action) => {
            state.vehicles = action.payload;
            state.vehicleTypes = Array.from(new Set(action.payload.map(vehicle => vehicle.type)));
        },
        
        // Set all fleet routes
        setFleetRoutes: (state, action) => {
            state.fleetRoutes = action.payload;
            state.routeTypes = Array.from(new Set(action.payload.map(route => route.type)));
        },
        
        // Set all route sessions
        setRouteSessions: (state, action) => {
            state.routeSessions = action.payload;
            state.activeSessions = action.payload.filter(session => session.status === 'IN_PROGRESS');
        },
        
        // Set all drivers
        setDrivers: (state, action) => {
            state.drivers = action.payload;
        },
        
        // Add a new performance record
        addPerformanceRecord: (state, action) => {
            const newRecord = action.payload;
            state.performanceRecords.push(newRecord);
            
            // Update derived lists if needed
            if (!state.metricTypes.includes(newRecord.metricName)) {
                state.metricTypes.push(newRecord.metricName);
            }
        },
        
        // Add a new vehicle
        addVehicle: (state, action) => {
            const newVehicle = action.payload;
            state.vehicles.push(newVehicle);
            
            if (!state.vehicleTypes.includes(newVehicle.type)) {
                state.vehicleTypes.push(newVehicle.type);
            }
        },
        
        // Add a new fleet route
        addFleetRoute: (state, action) => {
            const newRoute = action.payload;
            state.fleetRoutes.push(newRoute);
            
            if (!state.routeTypes.includes(newRoute.type)) {
                state.routeTypes.push(newRoute.type);
            }
        },
        
        // Add a new route session
        addRouteSession: (state, action) => {
            const newSession = action.payload;
            state.routeSessions.push(newSession);
            
            if (newSession.status === 'IN_PROGRESS') {
                state.activeSessions.push(newSession);
            }
        },
        
        // Update session status (e.g., from IN_PROGRESS to COMPLETED)
        updateSessionStatus: (state, action) => {
            const { sessionId, status } = action.payload;
            const session = state.routeSessions.find(s => s.id === sessionId);
            if (session) {
                session.status = status;
                
                // Update active sessions list
                if (status === 'IN_PROGRESS') {
                    if (!state.activeSessions.find(s => s.id === sessionId)) {
                        state.activeSessions.push(session);
                    }
                } else {
                    state.activeSessions = state.activeSessions.filter(s => s.id !== sessionId);
                }
            }
        },
        
        // Legacy compatibility - map old fitness actions to new transportation actions
        setExerciseData: (state, action) => {
            // Map old fitness data to transportation data if needed
            console.warn('setExerciseData is deprecated. Use setPerformanceRecords instead.');
            state.performanceRecords = action.payload;
        },
        
        addEntry: (state, action) => {
            // Map old fitness entry to transportation record
            console.warn('addEntry is deprecated. Use addPerformanceRecord instead.');
            state.performanceRecords.push(action.payload);
        }
    },
});

export const { 
    setPerformanceRecords,
    setVehicles,
    setFleetRoutes, 
    setRouteSessions,
    setDrivers,
    addPerformanceRecord,
    addVehicle,
    addFleetRoute,
    addRouteSession,
    updateSessionStatus,
    // Legacy exports for compatibility
    setExerciseData,
    addEntry
} = dataSlice.actions;

export default dataSlice.reducer;
