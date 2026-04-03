import {configureStore} from "@reduxjs/toolkit";
import user from "./slices/userSlice";
import chat from "./slices/chatSlice";
import message from "./slices/messageSlice";
import ui from "./slices/uiSlice"

export const store = configureStore({
    reducer: {
        user,chat,message,ui
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
