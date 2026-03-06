// src/redux/slice/uiSlice.ts
import type { UiAlertType } from "@/components/atoms/UiAlert";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AlertPayload {
  message: string;
  type: UiAlertType;
}

interface UiState {
  createTaskModalOpen: boolean;
  alert: AlertPayload | null;
}

const initialState: UiState = {
  createTaskModalOpen: false,
  alert: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openCreateTaskModal: (state) => {
      state.createTaskModalOpen = true;
    },
    closeCreateTaskModal: (state) => {
      state.createTaskModalOpen = false;
    },
    showAlert: (state, action: PayloadAction<AlertPayload>) => {
      state.alert = action.payload;
    },
    hideAlert: (state) => {
      state.alert = null;
    },
    // Useful for resetting UI on navigation
    clearUi: (state) => {
      state.alert = null;
      state.createTaskModalOpen = false;
    },
  },
});

export const {
  openCreateTaskModal,
  closeCreateTaskModal,
  showAlert,
  hideAlert,
  clearUi,
} = uiSlice.actions;

export default uiSlice.reducer;
