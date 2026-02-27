// src/infrastructure/repositories/TaskRepository.ts
import { HydratedDocument } from "mongoose";

import { TaskDoc, TaskModel, toTaskEntity } from "../models/TaskModel";
import { ITaskRepository } from "@/application/ports/repositories/ITaskRepository";
import { Task } from "@/entities/Task";

export class TaskRepository implements ITaskRepository {
  private toDomain(doc: HydratedDocument<TaskDoc>): Task {
    return toTaskEntity(doc);
  }

  private toPersistence(task: Task): Partial<TaskDoc> {
    return {
      title: task.title,
      description: task.description,
      status: task.status,
      // assignedTo: task.assignedTo,
      createdBy: task.createdBy,
    };
  }

  async create(task: Task): Promise<Task> {
    const doc = await TaskModel.create(this.toPersistence(task));
    return this.toDomain(doc);
  }

  async update(task: Task): Promise<void> {
    await TaskModel.updateOne(
      { _id: task.id, isDeleted: false },
      { $set: this.toPersistence(task) },
    );
  }

  async findById(id: string): Promise<Task | null> {
    const doc = await TaskModel.findOne({ _id: id, isDeleted: false });
    return doc ? this.toDomain(doc) : null;
  }

  async findAll(): Promise<Task[]> {
    const docs = await TaskModel.find({ isDeleted: false }).sort({
      createdAt: -1,
    });
    return docs.map((d) => this.toDomain(d));
  }

  async delete(id: string): Promise<void> {
    await TaskModel.updateOne(
      { _id: id },
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      },
    );
  }

  async getTaskMetrics(): Promise<{
    todo: number;
    inProgress: number;
    done: number;
    total: number;
  }> {
    const stats = await TaskModel.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const result = { todo: 0, inProgress: 0, done: 0, total: 0 };

    stats.forEach((s) => {
      if (s._id === "todo") result.todo = s.count;
      if (s._id === "in-progress") result.inProgress = s.count;
      if (s._id === "done") result.done = s.count;
      result.total += s.count;
    });

    return result;
  }
}
