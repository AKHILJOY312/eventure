import { ContainerModule } from "inversify";
import { TYPES } from "../types";

import { AuthController } from "@/interface-adapters/controllers/AuthController";
import { AdminController } from "@/interface-adapters/controllers/AdminController";
import { BookingController } from "@/interface-adapters/controllers/BookingController";
import { DiscoverController } from "@/interface-adapters/controllers/DiscoverController";

// import { TaskController } from "@/interface-adapters/controllers/task/TaskController";

export const controllerModule = new ContainerModule((options) => {
  options.bind<AuthController>(TYPES.AuthController).to(AuthController);
  options.bind<AdminController>(TYPES.AdminController).to(AdminController);
  options
    .bind<BookingController>(TYPES.BookingController)
    .to(BookingController);
  options
    .bind<DiscoverController>(TYPES.DiscoverController)
    .to(DiscoverController);
});
