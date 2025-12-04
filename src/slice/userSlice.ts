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
    starMessages(state, action) {
      state.loggedInUser.starredMessages.push(...action.payload);
    },

    removeStarredMessages(state, action) {
      state.loggedInUser.starredMessages =
        state.loggedInUser.starredMessages.filter(
          (id) => !action.payload.includes(id)
        );
    },
    blockUser(state, action) {
      state.loggedInUser.blockedUsers.push(action.payload.blockedUserId)
    },
    unBlockUser(state, action) {
      state.loggedInUser.blockedUsers = state.loggedInUser.blockedUsers.filter((userId)=> userId != action.payload.blockedUserId)
    },
  },
});

export const { setUser, handleLogout, removeStarredMessages, starMessages, blockUser,unBlockUser } =
  userSlice.actions;

export default userSlice.reducer;
