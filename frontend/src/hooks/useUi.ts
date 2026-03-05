// src/presentation/hooks/useUi.ts
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  closeCreateTaskModal,
  openCreateTaskModal,
} from "@/redux/slice/uiSlice";

export const useUi = () => {
  const dispatch = useAppDispatch();

  const { createTaskModalOpen } = useAppSelector((state) => state.ui);

  const openCreateTask = useCallback(
    () => dispatch(openCreateTaskModal()),
    [dispatch],
  );

  const closeCreateTask = useCallback(
    () => dispatch(closeCreateTaskModal()),
    [dispatch],
  );

  return {
    createTaskModalOpen,
    openCreateTask,
    closeCreateTask,
  };
};
