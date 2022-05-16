import { createSlice } from "@reduxjs/toolkit";
import {
  followUser,
  login,
  signup,
  unfollowUser,
} from "../../services/auth/authService";
import { notify } from "../../utils";

const initialState = {
  status: "idle",
  user: JSON.parse(localStorage?.getItem("user")) ?? [],
  isLoggedIn: JSON.parse(localStorage?.getItem("isLoggedIn")) || false,
  error: null,
};
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      notify(`Goodbye, ${state.user.name}`, "success");
      state.status = "loggedOut";
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");
      state.user = null;
      state.error = null;
      state.isLoggedIn = false;
    },
    updateUser: (state, action) => {
      state.user = action.payload?.user;
      localStorage.setItem("user", JSON.stringify(action.payload?.user));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.user = action.payload?.user;
      state.isLoggedIn = true;
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("user", JSON.stringify(action.payload?.user));
      notify(`Welcome, ${state.user.name}`);
    });
    builder.addCase(login.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error;
      notify("Email or Password is wrong", "error");
    });
    builder.addCase(signup.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(signup.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.user = action.payload?.user;
      state.isLoggedIn = true;
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("user", JSON.stringify(action.payload?.user));
      notify(`Welcome, ${state.user.name}`);
    });
    builder
      .addCase(signup.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
        notify("Email is already taken", "error");
      })

      .addCase(followUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state?.user?.following?.unshift(action.payload?.followingId);
        localStorage.setItem("user", JSON.stringify(state?.user));
        notify(`Followed successfully`);
      })
      .addCase(followUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
        notify("Something went wrong", "error");
      })

      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user.following = state.user?.following?.filter(
          (id) => id !== action?.payload?.followingId
        );
        localStorage.setItem("user", JSON.stringify(state?.user));
        notify(`Unfollowed successfully`);
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
        notify("Something went wrong", "error");
      });
  },
});

export const { logout, updateUser } = authSlice.actions;

export default authSlice.reducer;
