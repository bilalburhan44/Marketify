import { configureStore } from "@reduxjs/toolkit";
import {loadersSlice} from "./loadersSlice"; // Import loadersSlice as default export
import { usersSlice } from "./usersSlice"; // Import usersSlice as default export

const store = configureStore({
    reducer: {
        loaders: loadersSlice.reducer,
        users: usersSlice.reducer,
    },
});

export default store;