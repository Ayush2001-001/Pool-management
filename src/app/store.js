"use client";

import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./features/slice"; 
export const store = configureStore({
  reducer: {
    app: usersReducer, 
  },
});
