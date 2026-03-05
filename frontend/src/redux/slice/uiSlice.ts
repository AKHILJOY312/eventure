// src/redux/slice/uiSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface UiState {
  createTaskModalOpen: boolean;
}

const initialState: UiState = {
  createTaskModalOpen: false,
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
  },
});

export const { openCreateTaskModal, closeCreateTaskModal } = uiSlice.actions;

export default uiSlice.reducer;
