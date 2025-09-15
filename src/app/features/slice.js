"use client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getAllData = createAsyncThunk("userSlice", async (args, { rejectWithValue }) => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const result = await response.json();
    return result;
  } catch (error) {
    return rejectWithValue("oops found an error");
  }
});

export const data = createSlice({
  name: "data",
  initialState: {
    users: [],
    loading: false,
    error: null
  },
  reducers: {
    deleteUser: (state, action) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    },
    editUser: (state, action) => {
      const { id, newTitle, newBody } = action.payload;
      const user = state.users.find(user => user.id === id);
      if (user) {
        if (newTitle !== undefined) user.title = newTitle;
        if (newBody !== undefined) user.body = newBody;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllData.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getAllData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { deleteUser, editUser } = data.actions;
export default data.reducer;
