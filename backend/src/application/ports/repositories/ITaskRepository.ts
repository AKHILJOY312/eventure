// src/domain/interfaces/ITaskRepository.ts
import { Task } from "@/entities/Task";

export interface TaskStats {
  todo: number;
  inProgress: number;
  done: number;
  total: number;
}

export interface ITaskRepository {
  create(task: Task): Promise<Task>;
  findById(id: string): Promise<Task | null>;
  findAll(): Promise<Task[]>;
  update(task: Task): Promise<void>;
  delete(taskId: string): Promise<void>;

  // findByStatus(status: TaskStatus): Promise<Task[]>;

  // Dashboard Statistics
  getTaskMetrics(): Promise<TaskStats>;
}
