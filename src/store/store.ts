import { configureStore } from "@reduxjs/toolkit";
import chatSlice from "../slice/chatSlice";
import userSlice from "../slice/userSlice";
import utilitySlices from "../slice/utilitySlices";

export function createStore() {
  return configureStore({
    reducer: {
      chats: chatSlice,
      user: userSlice,
      utilitySlices: utilitySlices,
    },
  });
}

export const store = createStore();
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
