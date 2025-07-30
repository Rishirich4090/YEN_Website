import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface DataState {
  loading: boolean;
  error: string | null;
  response: any;
}

const initialState: DataState = {
  loading: false,
  error: null,
  response: null,
};

// Async thunk to send dummy data to backend API
export const sendDummyData = createAsyncThunk(
  'data/sendDummyData',
  async (dummyData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/dummy', dummyData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendDummyData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendDummyData.fulfilled, (state, action) => {
        state.loading = false;
        state.response = action.payload;
      })
      .addCase(sendDummyData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default dataSlice.reducer;
