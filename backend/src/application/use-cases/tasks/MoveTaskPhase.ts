// src/application/use-cases/task/MoveTaskPhase.ts
import { injectable, inject } from "inversify";
import { TYPES } from "@/config/di/types";
import { MoveTaskPhaseDto, TaskResponseDto } from "@/application/dto/taskDtos";
import { ForbiddenError, NotFoundError } from "@/application/error/AppError";
import { ITaskRepository } from "@/application/ports/repositories/ITaskRepository";
import { IMoveTaskPhase } from "@/application/ports/use-cases/task/interfaces";

@injectable()
export class MoveTaskPhase implements IMoveTaskPhase {
  constructor(
    @inject(TYPES.TaskRepository) private taskRepo: ITaskRepository,
  ) {}

  async execute(
    dto: MoveTaskPhaseDto,
    // userId: string,
  ): Promise<TaskResponseDto> {
    const task = await this.taskRepo.findById(dto.taskId);

    if (!task) throw new NotFoundError("TASK_NOT_FOUND");

    try {
      task.moveToPhase(dto.newStatus);
    } catch (error: any) {
      throw new ForbiddenError(error.message);
    }

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
