// src/application/use-cases/task/ListTasks.ts
import { injectable, inject } from "inversify";
import { TYPES } from "@/config/di/types";
import { TaskResponseDto } from "@/application/dto/taskDtos";
import { ITaskRepository } from "@/application/ports/repositories/ITaskRepository";
import { IListTasks } from "@/application/ports/use-cases/task/interfaces";

@injectable()
export class ListTasks implements IListTasks {
  constructor(
    @inject(TYPES.TaskRepository) private taskRepo: ITaskRepository,
  ) {}

  async execute(): Promise<TaskResponseDto[]> {
    const tasks = await this.taskRepo.findAll();

    return tasks.map((task) => ({
      id: task.id!,
      title: task.title,
      description: task.description,
      status: task.status,
      // assignedTo: task.assignedTo,
      createdBy: task.createdBy,
      createdAt: task.createdAt,
    }));
  }
}
