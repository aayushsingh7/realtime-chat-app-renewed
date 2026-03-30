import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";
import type {IChat, IChatPopulated} from "../../types/chatType";

interface ChatState {
    chats: (IChat | IChatPopulated)[];
}

const initialState: ChatState = {
    chats: [],
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setChats: (state, action: PayloadAction<(IChat | IChatPopulated)[]>) => {
            state.chats = action.payload;
        },
    },
});

export const {setChats} = chatSlice.actions;
export default chatSlice.reducer;
