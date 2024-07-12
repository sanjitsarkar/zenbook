import { createSlice } from "@reduxjs/toolkit";
import { searchUsers } from "../../services/auth/authService";

const initialState = {
  status: "idle",
  data: [],
  error: null,
};

export const searchedUsersSlice = createSlice({
  name: "searchedUsers",
  initialState,
  reducers: {
    clearSearchedUsers: (state) => {
      state.data = [];
    },
  },
  extraReducers(builder) {
    builder
      .addCase(searchUsers.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = [...state?.data, ...action.payload?.users];
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      });
  },
});
export const { clearSearchedUsers } = searchedUsersSlice.actions;
export default searchedUsersSlice.reducer;
