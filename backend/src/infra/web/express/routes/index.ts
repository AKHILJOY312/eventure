import { Router } from "express";
import { container } from "@/config/di/container";
import { getAuthRoutes } from "./authRoutes";
import { getTasksRoutes } from "./tasksRoutes";

const router = Router();

router.use((req, res, next) => {
  console.log("req.body:", req.body);
  next();
});

router.use("/auth", getAuthRoutes(container));

router.use("/tasks", getTasksRoutes(container));

export default router;
