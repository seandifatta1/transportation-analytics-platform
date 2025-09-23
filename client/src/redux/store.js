import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './slices/dataSlice';
import uiReducer from './slices/uiSlice';
import sessionReducer from './slices/sessionSlice';

const store = configureStore({
    reducer: {
        data: dataReducer,
        ui: uiReducer,
        session: sessionReducer,
    },
});

export default store;
