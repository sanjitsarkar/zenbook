import { createSlice } from "@reduxjs/toolkit";
import { getFollowers } from "../../services/auth/authService";

const initialState = {
  status: "idle",
  data: [],
  error: null,
};

export const followersSlice = createSlice({
  name: "followers",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getFollowers.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getFollowers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload?.followers?.followers;
      })
      .addCase(getFollowers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      });
  },
});

export default followersSlice.reducer;
