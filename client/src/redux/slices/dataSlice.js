import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    exerciseData: [], // Holds all sets of exercise data
    exercises: [],    // Unique list of exercises
    sessions: [],     // Unique list of sessions
    programs: [],     // Unique list of programs
};

const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        setExerciseData: (state, action) => {
            state.exerciseData = action.payload;
            // Update unique lists based on the new exerciseData
            state.exercises = Array.from(new Set(action.payload.map(set => set.exercise)));
            state.sessions = Array.from(new Set(action.payload.map(set => set.session)));
            state.programs = Array.from(new Set(action.payload.map(set => set.program)));
        },
        addEntry: (state, action) => {
            const newEntry = action.payload;
            state.exerciseData.push(newEntry);

            // Check and add to unique lists if not already present
            if (!state.exercises.includes(newEntry.exercise)) {
                state.exercises.push(newEntry.exercise);
            }
            if (!state.sessions.includes(newEntry.session)) {
                state.sessions.push(newEntry.session);
            }
            if (!state.programs.includes(newEntry.program)) {
                state.programs.push(newEntry.program);
            }
        },
    },
});

export const { setExerciseData, addEntry } = dataSlice.actions;
export default dataSlice.reducer;
