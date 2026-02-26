// src/application/use-cases/task/CreateTask.ts
import { injectable, inject } from "inversify";
import { TYPES } from "@/config/di/types";

import { CreateTaskDto, TaskResponseDto } from "@/application/dto/taskDtos";
import { ICreateTask } from "@/application/ports/use-cases/task/interfaces";
import { ITaskRepository } from "@/application/ports/repositories/ITaskRepository";
import { Task } from "@/entities/Task";

@injectable()
export class CreateTask implements ICreateTask {
  constructor(
    @inject(TYPES.TaskRepository) private taskRepo: ITaskRepository,
  ) {}

  async execute(
    dto: CreateTaskDto,
    creatorId: string,
  ): Promise<TaskResponseDto> {
    const task = new Task({
      title: dto.title,
      description: dto.description,
      status: "todo",
      // assignedTo: dto.assignedTo,
      createdBy: creatorId,
    });
    console.log("Creating task with data:");
    const savedTask = await this.taskRepo.create(task);

    return this.mapToDto(savedTask);
  }

  private mapToDto(task: Task): TaskResponseDto {
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
