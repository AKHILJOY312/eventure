import { Router } from "express";
import { Container } from "inversify";
import { TYPES } from "@/config/di/types";
import { AuthController } from "@/interface-adapters/controllers/AuthController";
import { asyncHandler } from "../handler/asyncHandler";
import { createProtectMiddleware } from "../middleware/authentication";
import { AuthRoutes } from "@/config/routes.config";

export function getAuthRoutes(container: Container): Router {
  const router = Router();

  const authController = container.get<AuthController>(TYPES.AuthController);

  const protect = container.get<ReturnType<typeof createProtectMiddleware>>(
    TYPES.ProtectMiddleware,
  );

  // -------- Users --------

  router.route(AuthRoutes.USERS).post(asyncHandler(authController.register));

  router
    .route(AuthRoutes.VERIFY_EMAIL)
    .patch(asyncHandler(authController.verifyEmail));

  router.route(AuthRoutes.ME).get(protect, asyncHandler(authController.me));

  // -------- Sessions --------

  router.route(AuthRoutes.SESSIONS).post(asyncHandler(authController.login));

  router
    .route(AuthRoutes.CURRENT_SESSION)
    .put(asyncHandler(authController.refreshToken))
    .delete(protect, asyncHandler(authController.logout));

  return router;
}
