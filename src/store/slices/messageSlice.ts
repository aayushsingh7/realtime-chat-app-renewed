import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";
import type {IMessage} from "../../types/messageType";

interface MessageState {
    messages: IMessage[];
}

const initialState: MessageState = {
    messages: [],
};

const messageSlice = createSlice({
    name: "message",
    initialState,
    reducers: {
        setMessages: (state, action: PayloadAction<IMessage[]>) => {
            state.messages = action.payload;
        },
    },
});

export const {setMessages} = messageSlice.actions;
export default messageSlice.reducer;
