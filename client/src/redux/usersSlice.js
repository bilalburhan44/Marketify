import { createSlice } from '@reduxjs/toolkit';

export const usersSlice = createSlice({
    name: 'users',
    initialState: {
        user: null,
    },
    reducers: {
        setUser: (state, action) => {
           state.user = action.payload // This mutates the state directly
        },
    },
});

export const { setUser } = usersSlice.actions;

