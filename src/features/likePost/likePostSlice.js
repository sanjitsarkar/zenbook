import { createSlice } from "@reduxjs/toolkit";
import { notify } from "../../utils";

const initialState = {
  status: "idle",
  data: [],
  error: null,
};

export const likePostSlice = createSlice({
  name: "likePost",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(likePost.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(likePost.fulfilled, (state, action) => {
        notify("Post liked successfully");
        state.status = "succeeded";
      })
      .addCase(likePost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      })
      .addCase(dislikePost.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(dislikePost.fulfilled, (state, action) => {
        notify("Post disliked successfully");
        state.status = "succeeded";
      })
      .addCase(dislikePost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      });
  },
});

export default likePostSlice.reducer;
