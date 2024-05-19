import { createSlice } from "@reduxjs/toolkit";
import { user } from "../models/user";

const initialState = {
  loggedInUser: user,
  confirmLogout: false,
};

const userSlice = createSlice({
  name: "userSlice",
  initialState: initialState,
  reducers: {
    setUser(state, action) {
      state.loggedInUser = action.payload;
    },
    handleLogout(state, action) {
      state.confirmLogout = action.payload;
    },
  },
});

export const { setUser, handleLogout } = userSlice.actions;

export default userSlice.reducer;
