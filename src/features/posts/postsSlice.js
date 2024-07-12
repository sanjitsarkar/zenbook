import { createSlice } from "@reduxjs/toolkit";
import {
  createPost,
  deletePost,
  fetchUserFeedPosts,
  fetchUserFeedTrendingPosts,
  updatePost,
} from "../../services/posts/postsService";
import { notify } from "../../utils";

const initialState = {
  status: "idle",
  data: [],
  error: null,
};

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    clearPosts: (state) => {
      state.data = [];
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUserFeedPosts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchUserFeedPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = [...state?.data, ...action.payload?.posts];
      })
      .addCase(fetchUserFeedPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      })
      .addCase(fetchUserFeedTrendingPosts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchUserFeedTrendingPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = [...state.data, ...action.payload?.posts];
      })
      .addCase(fetchUserFeedTrendingPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.data.unshift(action.payload?.post);

        notify("Post added successfully", "success");
      })
      .addCase(createPost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      })

      .addCase(deletePost.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state.data.filter(
          (post) => post?._id !== action.payload?.postId
        );

        notify("Post deleted successfully", "success");
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      })
      .addCase(updatePost.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state.data.map((post) => {
          if (post?._id === action.payload?.post._id) {
            return action.payload?.post;
          }
          return post;
        });
        notify("Post updated successfully", "success");
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      });
  },
});

export const { clearPosts } = postsSlice.actions;

export default postsSlice.reducer;
