import { ContainerModule } from "inversify";
import { TYPES } from "../types";

import { AuthController } from "@/interface-adapters/controllers/auth/AuthController";

import { TaskController } from "@/interface-adapters/controllers/task/TaskController";

export const controllerModule = new ContainerModule((options) => {
  options.bind<AuthController>(TYPES.AuthController).to(AuthController);
  options.bind<TaskController>(TYPES.TaskController).to(TaskController);
});
