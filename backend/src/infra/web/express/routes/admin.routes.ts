import { Router } from "express";
import { Container } from "inversify";
import { TYPES } from "@/config/di/types";
import { AdminController } from "@/interface-adapters/controllers/AdminController";
import { asyncHandler } from "../handler/asyncHandler";
import { createProtectMiddleware } from "../middleware/authentication";

import { UserRole } from "@/entities/User";
import { requireRole } from "../middleware/authorization";
import { AdminRoutes } from "@/config/routes.config";

export function getAdminRoutes(container: Container): Router {
  const router = Router();

  const adminController = container.get<AdminController>(TYPES.AdminController);
  const protect = container.get<ReturnType<typeof createProtectMiddleware>>(
    TYPES.ProtectMiddleware,
  );

  router.use(protect);
  router.use(requireRole(UserRole.ADMIN));

  router
    .route(AdminRoutes.SERVICES)
    .post(asyncHandler(adminController.createService))
    .get(asyncHandler(adminController.listAdminServices));

  router
    .route(AdminRoutes.SERVICE_BY_ID)
    .patch(asyncHandler(adminController.updateService))
    .delete(asyncHandler(adminController.deleteService));

  router
    .route(AdminRoutes.SERVICE_BOOKINGS)
    .get(asyncHandler(adminController.getServiceBookings));

  router
    .route(AdminRoutes.UPDATE_BOOKING_STATUS)
    .patch(asyncHandler(adminController.updateBookingStatus));
  return router;
}
