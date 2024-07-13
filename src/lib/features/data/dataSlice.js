import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchLaunches = createAsyncThunk('data/fetchLaunches', async () => {
  const response = await fetch(`https://api.spacexdata.com/v3/launches?limit=1000`);
  const data = await response.json();
  return data;
});

const dataSlice = createSlice({
  name: 'data',
  initialState: {
    launches: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLaunches.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchLaunches.fulfilled, (state, action) => {
        state.launches = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchLaunches.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default dataSlice.reducer;