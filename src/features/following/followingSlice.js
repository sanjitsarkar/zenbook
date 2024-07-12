import { createSlice } from "@reduxjs/toolkit";
import { getFollowing } from "../../services/auth/authService";

const initialState = {
  status: "idle",
  data: [],
  error: null,
};

export const followingSlice = createSlice({
  name: "following",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getFollowing.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getFollowing.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload?.following?.following;
      })
      .addCase(getFollowing.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      });
  },
});

export default followingSlice.reducer;
