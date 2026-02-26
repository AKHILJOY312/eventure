// src/application/dto/taskDtos.ts
import { TaskStatus } from "@/entities/Task";

export interface CreateTaskDto {
  title: string;
  description: string;
  status?: TaskStatus;
}

export interface UpdateTaskDto {
  id: string;
  title?: string;
  description?: string;
}

export interface MoveTaskPhaseDto {
  taskId: string;
  newStatus: TaskStatus;
}

export interface TaskResponseDto {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  // assignedTo: string;
  createdBy: string;
  createdAt: Date;
}

export interface TaskStatsResponseDto {
  todo: number;
  inProgress: number;
  done: number;
  total: number;
}
