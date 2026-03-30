import {configureStore} from "@reduxjs/toolkit";
import user from "./slices/userSlice";
import chat from "./slices/chatSlice";
import message from "./slices/messageSlice";

export const store = configureStore({
    reducer: {
        user,chat,message
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
