import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

interface UiState {
    isReplyMode: boolean;
    isSelectionMode: boolean;
    isGroupCreatorOpen: boolean;
    isChatInfoOpen: boolean;
    isPopupVisible: boolean;
    isStarredMessagesOpen: boolean;
    isAttachmentPanelOpen: boolean;
}

const initialState: UiState = {
    isReplyMode: false,
    isSelectionMode: false,
    isGroupCreatorOpen: false,
    isChatInfoOpen: false,
    isPopupVisible: false,
    isStarredMessagesOpen: false,
    isAttachmentPanelOpen: false,
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        setReplyMode: (state, action: PayloadAction<boolean>) => {
            state.isReplyMode = action.payload;
        },
        setSelectionMode: (state, action: PayloadAction<boolean>) => {
            state.isSelectionMode = action.payload;
        },
        setGroupCreatorOpen: (state, action: PayloadAction<boolean>) => {
            state.isGroupCreatorOpen = action.payload;
        },
        setChatInfoOpen: (state, action: PayloadAction<boolean>) => {
            state.isChatInfoOpen = action.payload;
        },
        setPopupVisible: (state, action: PayloadAction<boolean>) => {
            state.isPopupVisible = action.payload;
        },
        setStarredMessagesOpen: (state, action: PayloadAction<boolean>) => {
            state.isStarredMessagesOpen = action.payload;
        },
        setAttachmentPanelOpen: (state, action:PayloadAction<boolean>) => {
            state.isAttachmentPanelOpen = action.payload;
        }
     },
});

export const {
    setReplyMode,
    setSelectionMode,
    setGroupCreatorOpen,
    setChatInfoOpen,
    setPopupVisible,
    setStarredMessagesOpen,
    setAttachmentPanelOpen,
} = uiSlice.actions;

export default uiSlice.reducer;
