import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  verify: true,
  showUploadOptions: false,
  showPreview: false,
  showProfile: false,
  showSettings: false,
  showAdminOptions: false,
  isError: false,
  askPermission: false,
  showLoading: false,
  viewReactions: false,
  discardFileUpload: false,
  viewFile: false,
};

const utilitySlices = createSlice({
  name: "utilitySlice",
  initialState: initialState,
  reducers: {
    setVerify(state, action) {
      state.verify = action.payload;
    },
    handleShowUploadOption(state, action) {
      state.showUploadOptions = action.payload;
    },
    handleShowPreview(state, action) {
      state.showPreview = action.payload;
    },
    handleShowProfile(state, action) {
      state.showProfile = action.payload;
    },
    handleShowSettings(state, action) {
      state.showSettings = action.payload;
    },
    handleShowAdminOptions(state, action) {
      state.showAdminOptions = action.payload;
    },
    setIsError(state, action) {
      state.isError = action.payload;
    },
    handleAskPermission(state, action) {
      state.askPermission = action.payload;
    },
    handleLoading(state, action) {
      state.showLoading = action.payload;
    },
    handleViewReaction(state, action) {
      state.viewReactions = action.payload;
    },
    handleDiscardFileUpload(state, action) {
      state.discardFileUpload = action.payload;
    },
    handleViewFile(state, action) {
      state.viewFile = action.payload;
    },
  },
});

export const {
  handleShowProfile,
  setVerify,
  handleShowUploadOption,
  handleShowPreview,
  handleShowSettings,
  handleShowAdminOptions,
  setIsError,
  handleAskPermission,
  handleLoading,
  handleViewReaction,
  handleDiscardFileUpload,
  handleViewFile,
} = utilitySlices.actions;
export default utilitySlices.reducer;
