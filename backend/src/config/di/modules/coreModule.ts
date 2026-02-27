import { ContainerModule } from "inversify";
import { TYPES } from "../types"; // Adjust path if needed

// Repositories
import { UserRepository } from "@/infra/db/mongoose/repositories/UserRepository";
import { OtpRepository } from "@/infra/db/mongoose/repositories/OtpRepository";
import { BookingRepository } from "@/infra/db/mongoose/repositories/BookingRepository";
import { ServiceRepository } from "@/infra/db/mongoose/repositories/ServiceRepository";

// Services
import { JwtAuthService } from "@/infra/auth/JwtAuthService";
import { NodemailerEmailService } from "@/infra/email/NodemailerEmailService";

// Ports
import { IUserRepository } from "@/application/ports/repositories/IUserRepository";
import { IAuthService } from "@/application/ports/services/IAuthService";
import { IEmailService } from "@/application/ports/services/IEmailService";
import { IOtpRepository } from "@/application/ports/repositories/IOtpRepository";
import { IBookingRepository } from "@/application/ports/repositories/IBookingRepository";
import { IServiceRepository } from "@/application/ports/repositories/IServiceRepository";

export const coreModule = new ContainerModule((options) => {
  // Repositories (singletons)
  options
    .bind<IUserRepository>(TYPES.UserRepository)
    .to(UserRepository)
    .inSingletonScope();
  options
    .bind<IOtpRepository>(TYPES.OtpRepository)
    .to(OtpRepository)
    .inSingletonScope();
  options
    .bind<IBookingRepository>(TYPES.BookingRepository)
    .to(BookingRepository)
    .inSingletonScope();
  options
    .bind<IServiceRepository>(TYPES.ServiceRepository)
    .to(ServiceRepository)
    .inSingletonScope();

  //services
  options
    .bind<IAuthService>(TYPES.AuthService)
    .to(JwtAuthService)
    .inSingletonScope();
  options
    .bind<IEmailService>(TYPES.EmailService)
    .to(NodemailerEmailService)
    .inSingletonScope();
});
