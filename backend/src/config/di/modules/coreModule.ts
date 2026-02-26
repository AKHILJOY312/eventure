import { ContainerModule } from "inversify";
import { TYPES } from "../types"; // Adjust path if needed

// Repositories
import { UserRepository } from "@/infra/db/mongoose/repositories/UserRepository";

// Services
import { JwtAuthService } from "@/infra/auth/JwtAuthService";
import { NodemailerEmailService } from "@/infra/email/NodemailerEmailService";

// Ports
import { IUserRepository } from "@/application/ports/repositories/IUserRepository";
import { IAuthService } from "@/application/ports/services/IAuthService";
import { IEmailService } from "@/application/ports/services/IEmailService";
import { TaskRepository } from "@/infra/db/mongoose/repositories/TaskRepository";
import { ITaskRepository } from "@/application/ports/repositories/ITaskRepository";
import { IAccessKeyRepository } from "@/application/ports/repositories/IAccessKeyRepository";
import { AccessKeyRepository } from "@/infra/db/mongoose/repositories/AccessKeyRepository";

export const coreModule = new ContainerModule((options) => {
  // Repositories (singletons)
  options
    .bind<IUserRepository>(TYPES.UserRepository)
    .to(UserRepository)
    .inSingletonScope();
  options
    .bind<IAccessKeyRepository>(TYPES.AccessKeyRepository)
    .to(AccessKeyRepository);
  options
    .bind<ITaskRepository>(TYPES.TaskRepository)
    .to(TaskRepository)
    .inSingletonScope();

  options
    .bind<IAuthService>(TYPES.AuthService)
    .to(JwtAuthService)
    .inSingletonScope();
  options
    .bind<IEmailService>(TYPES.EmailService)
    .to(NodemailerEmailService)
    .inSingletonScope();
});
