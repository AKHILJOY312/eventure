import { Router } from "express";
import { Container } from "inversify";
import { TYPES } from "@/config/di/types";
import { AuthController } from "@/interface-adapters/controllers/auth/AuthController";
import { asyncHandler } from "../handler/asyncHandler";
import { createProtectMiddleware } from "../middleware/protect";

export function getAuthRoutes(container: Container): Router {
  const router = Router();

  const authController = container.get<AuthController>(TYPES.AuthController);

  const protect = container.get<ReturnType<typeof createProtectMiddleware>>(
    TYPES.ProtectMiddleware,
  );

  // -------- Users --------

  router.route("/users").post(asyncHandler(authController.register)); // create user

  router
    .route("/users/verify-email")
    .patch(asyncHandler(authController.verifyEmail)); // update verification state

  router.route("/users/me").get(protect, asyncHandler(authController.me)); // current user

  // -------- Sessions --------

  router.route("/sessions").post(asyncHandler(authController.login)); // login (create session)

  router
    .route("/sessions/current")
    .put(asyncHandler(authController.refreshToken)) // refresh token
    .delete(protect, asyncHandler(authController.logout)); // logout

  return router;
}
