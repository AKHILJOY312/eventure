// src/redux/slices/taskSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Task, TaskStatus } from "@/types";

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  activeTask: Task | null;
  activeTaskId: string | null;
  boardId: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  activeTask: null,
  activeTaskId: null,
  boardId: null,
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },

    // Simplified: No userId check, anyone can trigger this
    updateTaskStatus: (
      state,
      action: PayloadAction<{
        taskId: string;
        newStatus: TaskStatus;
      }>,
    ) => {
      const { taskId, newStatus } = action.payload;
      const task = state.tasks.find((t) => t.id === taskId);

      if (task) {
        task.status = newStatus;

        // Sync activeTask if it's the one being updated
        if (state.activeTask?.id === taskId) {
          state.activeTask.status = newStatus;
        }
      }
    },
    setBoardId: (state, action: PayloadAction<string | null>) => {
      state.boardId = action.payload;
    },
    setActiveTask: (state, action: PayloadAction<string | null>) => {
      state.activeTaskId = action.payload;
      state.activeTask =
        state.tasks.find((t) => t.id === action.payload) || null;
    },

    createTask: (state, action: PayloadAction<Task>) => {
      const exists = state.tasks.some((t) => t.id === action.payload.id);
      if (!exists) {
        state.tasks.push(action.payload);
      }
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }

      if (state.activeTask?.id === action.payload.id) {
        state.activeTask = action.payload;
      }
    },

    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      // Clean up if the deleted task was the active one
      if (state.activeTaskId === action.payload) {
        state.activeTask = null;
        state.activeTaskId = null;
      }
    },
  },
});

export const {
  setTasks,
  updateTaskStatus,
  setActiveTask,
  createTask,
  deleteTask,
  updateTask,
} = taskSlice.actions;

export default taskSlice.reducer;
