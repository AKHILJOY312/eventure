import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(5),
  status: z.enum(["todo", "in-progress", "done"] as const).optional(),
});

export const updateTaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3).optional(),
  description: z.string().min(5).optional(),
});

export const moveTaskSchema = z.object({
  taskId: z.string(),
  newStatus: z.enum(["todo", "in-progress", "done"] as const, {
    message: "INVALID_PHASE_SIGNAL",
  }),
});
