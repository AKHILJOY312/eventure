import { Router } from "express";
import { Container } from "inversify";
import { TYPES } from "@/config/di/types";
import { AdminController } from "@/interface-adapters/controllers/AdminController";
import { asyncHandler } from "../handler/asyncHandler";
import { createProtectMiddleware } from "../middleware/authentication";

import { UserRole } from "@/entities/User";
import { requireRole } from "../middleware/authorization";

export function getAdminRoutes(container: Container): Router {
  const router = Router();

  const adminController = container.get<AdminController>(TYPES.AdminController);
  const protect = container.get<ReturnType<typeof createProtectMiddleware>>(
    TYPES.ProtectMiddleware,
  );

  router.use(protect);
  router.use(requireRole(UserRole.ADMIN));

  router
    .route("/services")
    .post(asyncHandler(adminController.createService))
    .get(asyncHandler(adminController.listAdminServices));

  router
    .route("/services/:serviceId")
    .patch(asyncHandler(adminController.updateService))
    .delete(asyncHandler(adminController.deleteService));

  router
    .route("/services/:serviceId/bookings")
    .get(asyncHandler(adminController.getServiceBookings));
  return router;
}
