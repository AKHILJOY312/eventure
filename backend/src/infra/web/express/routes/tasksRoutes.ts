import { Router } from "express";
import { Container } from "inversify";
import { TYPES } from "@/config/di/types";
import { asyncHandler } from "../handler/asyncHandler";
import { TaskController } from "@/interface-adapters/controllers/task/TaskController";
import { createProtectMiddleware } from "@/infra/web/express/middleware/protect";

export function getTasksRoutes(container: Container): Router {
  const router = Router();

  const taskController = container.get<TaskController>(TYPES.TaskController);

  const protect = container.get<ReturnType<typeof createProtectMiddleware>>(
    TYPES.ProtectMiddleware,
  );
  router.use(protect);

  // --- Collection Resource ---
  router
    .route("/")
    .get(asyncHandler(taskController.list))
    .post(asyncHandler(taskController.create));

  // --- Specialized Aggregated Resource ---
  router.route("/stats").get(asyncHandler(taskController.getStats));

  // --- Individual Resource ---
  router
    .route("/:id")
    .patch(asyncHandler(taskController.update)) // For title/description updates
    .delete(asyncHandler(taskController.delete));

  // --- Sub-Resource for State Transitions ---
  // router.route("/:id/phase").patch(asyncHandler(taskController.movePhase));

  return router;
}
