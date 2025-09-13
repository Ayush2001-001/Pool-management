"use client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


export const getAllData = createAsyncThunk("userSlice",async (args, { rejectWithValue }) => {
    try {
      const responce = await fetch("https://jsonplaceholder.typicode.com/posts");
      const result = await responce.json(); 
      return result;
    } catch (error) {
      return rejectWithValue("oops found an error");
    }
  }
);
export const data = createSlice({
    name : "data",
    initialState :{
        users:[],
        loading:false,
        error:null
    },
    reducers: {}, 
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
export default data.reducer;