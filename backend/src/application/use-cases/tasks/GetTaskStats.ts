// src/application/use-cases/task/GetTaskStats.ts
import { injectable, inject } from "inversify";
import { TYPES } from "@/config/di/types";
import { TaskStatsResponseDto } from "@/application/dto/taskDtos";
import { IGetTaskStats } from "@/application/ports/use-cases/task/interfaces";
import { ITaskRepository } from "@/application/ports/repositories/ITaskRepository";

@injectable()
export class GetTaskStats implements IGetTaskStats {
  constructor(
    @inject(TYPES.TaskRepository) private taskRepo: ITaskRepository,
  ) {}

  async execute(): Promise<TaskStatsResponseDto> {
    const stats = await this.taskRepo.getTaskMetrics();

    return {
      todo: stats.todo,
      inProgress: stats.inProgress,
      done: stats.done,
      total: stats.total,
    };
  }
}
