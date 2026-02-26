// src/application/ports/use-cases/task/ITaskUseCases.ts
import {
  CreateTaskDto,
  UpdateTaskDto,
  MoveTaskPhaseDto,
  TaskResponseDto,
  TaskStatsResponseDto,
} from "@/application/dto/taskDtos";

export interface ICreateTask {
  execute(dto: CreateTaskDto, creatorId: string): Promise<TaskResponseDto>;
}

export interface IUpdateTask {
  execute(dto: UpdateTaskDto): Promise<TaskResponseDto>;
}

export interface IMoveTaskPhase {
  execute(dto: MoveTaskPhaseDto, userId: string): Promise<TaskResponseDto>;
}

export interface IDeleteTask {
  execute(taskId: string): Promise<void>;
}

export interface IListTasks {
  execute(): Promise<TaskResponseDto[]>;
}

export interface IGetTaskStats {
  execute(): Promise<TaskStatsResponseDto>;
}
