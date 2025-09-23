import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    screen: 'home', // Default screen (can be changed based on your app's structure)
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setScreen: (state, action) => {
            state.screen = action.payload;
        },
        resetScreen: (state) => {
            state.screen = 'home'; // Resets to default screen
        },
    },
});

export const { setScreen, resetScreen } = uiSlice.actions;
export default uiSlice.reducer;
