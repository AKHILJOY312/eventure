// src/infra/web/socket/handlers/TaskHandler.ts
import { Server } from "socket.io";
import { AuthenticatedSocket, BaseSocketHandler } from "./BaseSocketHandler";

import { TYPES } from "@/config/di/types";
import { Container } from "inversify";

import { ValidationError, BadRequestError } from "@/application/error/AppError";

import {
  createTaskSchema,
  updateTaskSchema,
  moveTaskSchema,
} from "@/interface-adapters/http/validators/taskValidators";

import {
  ICreateTask,
  IUpdateTask,
  IMoveTaskPhase,
  IDeleteTask,
} from "@/application/ports/use-cases/task/interfaces";

export class TaskHandler extends BaseSocketHandler {
  constructor(
    socket: AuthenticatedSocket,
    private io: Server,
    private container: Container,
  ) {
    super(socket);
  }

  handle(): void {
    const createTaskUC = this.container.get<ICreateTask>(TYPES.CreateTask);
    const updateTaskUC = this.container.get<IUpdateTask>(TYPES.UpdateTask);
    const moveTaskUC = this.container.get<IMoveTaskPhase>(TYPES.MoveTaskPhase);
    const deleteTaskUC = this.container.get<IDeleteTask>(TYPES.DeleteTask);

    /**
     * CREATE
     */
    this.socket.on("task:create", async (payload) => {
      try {
        console.log("Received task:create with payload:", payload);
        const validated = createTaskSchema.safeParse(payload);

        if (!validated.success) {
          throw new ValidationError(validated.error.issues[0].message);
        }

        const creatorId = this.socket.data.user.id;

        const result = await createTaskUC.execute(validated.data, creatorId);

        this.io.emit("task:created", result);
      } catch (err) {
        this.emitError(err);
      }
    });

    /**
     * UPDATE
     */
    this.socket.on("task:update", async (payload) => {
      try {
        const validated = updateTaskSchema.safeParse(payload);

        if (!validated.success) {
          throw new ValidationError(validated.error.issues[0].message);
        }

        const result = await updateTaskUC.execute(validated.data);

        this.io.emit("task:updated", result);
      } catch (err) {
        this.emitError(err);
      }
    });

    /**
     * MOVE PHASE / STATUS
     */
    this.socket.on("task:move", async (payload) => {
      try {
        const validated = moveTaskSchema.safeParse(payload);

        if (!validated.success) {
          console.error(
            "Validation failed for task:move payload:",
            validated.error.issues,
          );
          throw new ValidationError(validated.error.issues[0].message);
        }

        const userId = this.socket.data.user.id;

        const result = await moveTaskUC.execute(validated.data, userId);

        this.io.emit("task:moved", result);
      } catch (err) {
        this.emitError(err);
      }
    });

    /**
     * DELETE
     */
    this.socket.on("task:delete", async (taskId: string) => {
      try {
        if (!taskId) {
          throw new BadRequestError("Task id required");
        }
        await deleteTaskUC.execute(taskId);

        this.io.emit("task:deleted", taskId);
      } catch (err) {
        this.emitError(err);
      }
    });
  }

  private emitError(err: unknown) {
    const message =
      err instanceof ValidationError || err instanceof BadRequestError
        ? err.message
        : "Task operation failed";

    this.socket.emit("task:error", message);
  }
}
