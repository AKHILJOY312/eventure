import { ContainerModule } from "inversify";
import { TYPES } from "../types";

import { IUserRepository } from "@/application/ports/repositories/IUserRepository";

import { createProtectMiddleware } from "@/infra/web/express/middleware/protect";

export const middlewareModule = new ContainerModule((options) => {
  options
    .bind(TYPES.ProtectMiddleware)
    .toDynamicValue((context) => {
      const userRepo = context.get<IUserRepository>(TYPES.UserRepository);

      return createProtectMiddleware(userRepo);
    })
    .inSingletonScope();
});
