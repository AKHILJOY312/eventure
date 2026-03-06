// src/presentation/hooks/useUi.ts
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  closeCreateTaskModal,
  openCreateTaskModal,
} from "@/redux/slice/uiSlice";
import type { UiAlertType } from "@/components/atoms/UiAlert";
import { showAlert, hideAlert } from "@/redux/slice/uiSlice";

export const useUi = () => {
  const dispatch = useAppDispatch();

  const { alert, createTaskModalOpen } = useAppSelector((state) => state.ui);

  const openCreateTask = useCallback(
    () => dispatch(openCreateTaskModal()),
    [dispatch],
  );

  const closeCreateTask = useCallback(
    () => dispatch(closeCreateTaskModal()),
    [dispatch],
  );
  const triggerAlert = useCallback(
    (message: string, type: UiAlertType = "info") => {
      dispatch(showAlert({ message, type }));
    },
    [dispatch],
  );

  const closeAlert = useCallback(() => dispatch(hideAlert()), [dispatch]);
  return {
    alert,
    triggerAlert,
    closeAlert,
    createTaskModalOpen,
    openCreateTask,
    closeCreateTask,
  };
};
