// src/application/use-cases/task/DeleteTask.ts
import { injectable, inject } from "inversify";
import { TYPES } from "@/config/di/types";
import { NotFoundError } from "@/application/error/AppError";
import { IDeleteTask } from "@/application/ports/use-cases/task/interfaces";
import { ITaskRepository } from "@/application/ports/repositories/ITaskRepository";

@injectable()
export class DeleteTask implements IDeleteTask {
  constructor(
    @inject(TYPES.TaskRepository) private taskRepo: ITaskRepository,
  ) {}

  async execute(taskId: string): Promise<void> {
    const task = await this.taskRepo.findById(taskId);
    if (!task) throw new NotFoundError("TASK_NOT_FOUND");

    await this.taskRepo.delete(taskId);
  }
}
