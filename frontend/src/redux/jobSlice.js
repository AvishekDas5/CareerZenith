import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchJobs } from "../services/jobService";
import { fetchRecommendedJobs } from "../services/jobRecommendationService";

// Async thunk to fetch jobs
export const getJobs = createAsyncThunk(
  "jobs/getJobs",
  async ({ keyword, location, salary, isRemote }) => {
    return await fetchJobs(keyword, location, salary, isRemote);
  }
);

// Async thunk to fetch job recommendations
export const getRecommendedJobs = createAsyncThunk(
  "jobs/getRecommendedJobs",
  async (userId) => {
    return await fetchRecommendedJobs(userId);
  }
);

const jobsSlice = createSlice({
  name: "jobs",
  initialState: {
    jobList: [],
    recommendedJobs: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobList = action.payload;
      })
      .addCase(getJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getRecommendedJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRecommendedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendedJobs = action.payload;
      })
      .addCase(getRecommendedJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default jobsSlice.reducer;
