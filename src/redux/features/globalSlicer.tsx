import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface GlobalInterface {
  appStatus: number;
  appMainLoader: boolean;
  isProfilePicVisible: boolean;
}
const initialState: GlobalInterface = {
  appStatus: 200,
  appMainLoader: true,
  isProfilePicVisible: true,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setAppStatus: (state, action: PayloadAction<number>) => {
      state.appStatus = action.payload;
    },
    setAppMainLoader: (state, action: PayloadAction<boolean>) => {
      state.appMainLoader = action.payload;
    },
    toggleProfilePic: (state, action: PayloadAction<boolean>) => {
      state.isProfilePicVisible = !action.payload;
      localStorage.setItem("profilePicStatus", String(action.payload));
    },
    initialImageToggleCall: (state) => {
      if (typeof window !== "undefined") {
        const profilePicStatus =
          localStorage.getItem("profilePicStatus") !== "false";
        state.isProfilePicVisible = profilePicStatus;
      } else {
        state.isProfilePicVisible = true;
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setAppStatus,
  setAppMainLoader,
  toggleProfilePic,
  initialImageToggleCall,
} = globalSlice.actions;

export default globalSlice.reducer;
