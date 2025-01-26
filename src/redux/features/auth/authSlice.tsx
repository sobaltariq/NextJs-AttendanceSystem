import { AuthReduxState } from "@/types/redux_types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthReduxState = {
  isLoggedIn: false,
  loginToken: null,
  userRole: null,
  username: null,
  userGender: null,
  userId: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData: (
      state,
      action: PayloadAction<{
        isLoggedIn: boolean;
        token: string;
        role: string;
        username: string;
        gender: string;
        id: number;
      }>
    ) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.loginToken = action.payload.token;
      state.userRole = action.payload.role;
      state.username = action.payload.username;
      state.userGender = action.payload.gender;
      state.userId = action.payload.id;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.loginToken = null;
      state.userRole = null;
      state.username = null;
      state.userGender = null;
      state.userId = null;
      localStorage.removeItem("loggedInToken");
      localStorage.removeItem("loggedInUser");
    },
    initializeAuthState: (state) => {
      // This reducer will initialize the auth state on the client side
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("loggedInToken");
        const user = localStorage.getItem("loggedInUser");

        if (token && user) {
          const userObj = JSON.parse(user);
          state.isLoggedIn = true;
          state.loginToken = token;
          state.userRole = userObj.role;
          state.username = userObj.username;
          state.userGender = userObj.gender;
          state.userId = userObj.id;
        } else {
          // If either token or user is not found, reset state to null
          state.isLoggedIn = false;
          state.loginToken = null;
          state.userRole = null;
          state.username = null;
          state.userGender = null;
          state.userId = null;
        }
      }
    },
  },
});

export const { setAuthData, logout, initializeAuthState } = authSlice.actions;
export default authSlice.reducer;
