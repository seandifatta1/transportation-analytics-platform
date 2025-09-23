import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isActive: false, // Indicates if the session is active
    userSessionData: null, // Any additional session data (e.g., user ID, token, etc.)
};

const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        startSession: (state, action) => {
            state.isActive = true;
            state.userSessionData = action.payload; // Set any additional session data
        },
        endSession: (state) => {
            state.isActive = false;
            state.userSessionData = null; // Clear session data
        },
        refreshSession: (state, action) => {
            state.userSessionData = action.payload; // Update session data if needed
        },
    },
});

export const { startSession, endSession, refreshSession } = sessionSlice.actions;
export default sessionSlice.reducer;
