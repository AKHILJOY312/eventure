// src/interface-adapters/controllers/task/TaskController.ts
import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "@/config/di/types";
import { HTTP_STATUS } from "../../http/constants/httpStatus";
import { ValidationError } from "@/application/error/AppError";

// Assume you have these validators defined
import {
  createTaskSchema,
  updateTaskSchema,
  // moveTaskSchema,
} from "@/interface-adapters/http/validators/taskValidators";
import {
  ICreateTask,
  IUpdateTask,
  // IMoveTaskPhase,
  IDeleteTask,
  IListTasks,
  IGetTaskStats,
} from "@/application/ports/use-cases/task/interfaces";

@injectable()
export class TaskController {
  constructor(
    @inject(TYPES.CreateTask) private createTaskUC: ICreateTask,
    @inject(TYPES.UpdateTask) private updateTaskUC: IUpdateTask,
    // @inject(TYPES.MoveTaskPhase) private moveTaskUC: IMoveTaskPhase,
    @inject(TYPES.DeleteTask) private deleteTaskUC: IDeleteTask,
    @inject(TYPES.ListTasks) private listTasksUC: IListTasks,
    @inject(TYPES.GetTaskStats) private getStatsUC: IGetTaskStats,
  ) {}

  create = async (req: Request, res: Response) => {
    const validatedData = createTaskSchema.safeParse(req.body);
    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.issues[0].message);
    }

    // @ts-expect-error - set by auth middleware
    const creatorId = req.user.id;
    const result = await this.createTaskUC.execute(
      validatedData.data,
      creatorId,
    );
    res.status(HTTP_STATUS.CREATED).json(result);
  };

  list = async (_req: Request, res: Response) => {
    const result = await this.listTasksUC.execute();
    res.json({ data: result });
  };

  update = async (req: Request, res: Response) => {
    const validatedData = updateTaskSchema.safeParse({
      ...req.body,
      id: req.params.id,
    });
    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.issues[0].message);
    }

    const result = await this.updateTaskUC.execute(validatedData.data);
    res.json(result);
  };

  // movePhase = async (req: Request, res: Response) => {
  //   const validatedData = moveTaskSchema.safeParse({
  //     ...req.body,
  //     id: req.params.id,
  //   });
  //   if (!validatedData.success) {
  //     throw new ValidationError(validatedData.error.issues[0].message);
  //   }

  //   // @ts-expect-error - current operator ID
  //   const userId = req.user.id;
  //   // The use case handles the permission check (Assigned user only)
  //   const result = await this.moveTaskUC.execute(validatedData.data, userId);
  //   res.json(result);
  // };

  delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.deleteTaskUC.execute(id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  };

  getStats = async (_req: Request, res: Response) => {
    const result = await this.getStatsUC.execute();
    res.json(result);
  };
}
