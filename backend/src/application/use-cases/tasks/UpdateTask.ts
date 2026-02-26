// src/application/use-cases/task/UpdateTask.ts
import { injectable, inject } from "inversify";
import { TYPES } from "@/config/di/types";
import { UpdateTaskDto, TaskResponseDto } from "@/application/dto/taskDtos";
import { NotFoundError } from "@/application/error/AppError";
import { IUpdateTask } from "@/application/ports/use-cases/task/interfaces";
import { ITaskRepository } from "@/application/ports/repositories/ITaskRepository";

@injectable()
export class UpdateTask implements IUpdateTask {
  constructor(
    @inject(TYPES.TaskRepository) private taskRepo: ITaskRepository,
  ) {}

  async execute(dto: UpdateTaskDto): Promise<TaskResponseDto> {
    const task = await this.taskRepo.findById(dto.id);
    if (!task) throw new NotFoundError("TASK_NOT_FOUND");

    // Update only allowed fields
    task.updateDetails(
      dto.title ?? task.title,
      dto.description ?? task.description,
    );

    await this.taskRepo.update(task);

    return {
      id: task.id!,
      title: task.title,
      description: task.description,
      status: task.status,
      // assignedTo: task.assignedTo,
      createdBy: task.createdBy,
      createdAt: task.createdAt,
    };
  }
}
