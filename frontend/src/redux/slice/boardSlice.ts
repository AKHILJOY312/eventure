import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface BoardState {
  currentBoardId: string | null;
}

const initialState: BoardState = {
  currentBoardId: "default-board-id",
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    setCurrentBoardId: (state, action: PayloadAction<string | null>) => {
      state.currentBoardId = action.payload;
    },
  },
});

export const { setCurrentBoardId } = boardSlice.actions;
export default boardSlice.reducer;
