import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import { taskGateway } from "@/services/gateway/TaskGateway";
import type { Task, TaskStatus } from "@/types/index";

import {
  setTasks,
  createTask,
  deleteTask,
  updateTask,
  updateTaskStatus,
} from "@/redux/slice/taskSlice";

import { listTasks } from "@/services/task.service";

export function useTasks() {
  const boardId = useAppSelector((s) => s.board.currentBoardId);
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((s) => s.task.tasks);

  useEffect(() => {
    if (!boardId) return;

    listTasks().then((res) => {
      dispatch(setTasks(res.data.data));
    });

    taskGateway.joinBoard(boardId);

    const unsubscribe = taskGateway.subscribe({
      onCreated: (task: Task) => dispatch(createTask(task)),
      onUpdated: (task: Task) => dispatch(updateTask(task)),
      onDeleted: (taskId: string) => dispatch(deleteTask(taskId)),
      onStatus: ({ taskId, status }) =>
        dispatch(updateTaskStatus({ taskId, newStatus: status })),
    });

    return () => {
      unsubscribe?.();
      taskGateway.leaveBoard(boardId);
    };
  }, [boardId, dispatch]);

  const addTask = (data: Partial<Task>) => {
    taskGateway.createTask(data);
  };

  const editTask = (task: Task) => {
    taskGateway.updateTask(task);
  };

  const removeTask = (taskId: string) => {
    console.log("Removing task with ID:", taskId);
    taskGateway.deleteTask(taskId);
  };

  const changeStatus = (taskId: string, status: TaskStatus) => {
    taskGateway.moveTask(taskId, status);
  };

  return {
    tasks,
    addTask,
    editTask,
    removeTask,
    changeStatus,
  };
}
