import { createSlice } from "@reduxjs/toolkit";
import { fetchUserCreatedPosts } from "../../services/posts/postsService";
import { updatePostsContent } from "../../utils";

const initialState = {
  status: "idle",
  data: [],
  error: null,
};

export const userCreatedPostsSlice = createSlice({
  name: "userCreatedPosts",
  initialState,
  reducers: {
    updateUserCreatedPosts: (state, action) => {
      updatePostsContent(state, action);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUserCreatedPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserCreatedPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = [...state?.data, ...action.payload?.posts];
      })
      .addCase(fetchUserCreatedPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      });
  },
});

export const { updateUserCreatedPosts } = userCreatedPostsSlice.actions;
export default userCreatedPostsSlice.reducer;
