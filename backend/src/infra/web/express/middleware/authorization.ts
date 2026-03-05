import { Request, Response, NextFunction } from "express";
import { UserRole } from "@/entities/User";
import {
  UnauthorizedError,
  ForbiddenError,
} from "@/application/error/AppError";

export const requireRole = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError("Not authenticated.");
    }

    if (!roles.includes(req.user.role as UserRole)) {
      throw new ForbiddenError("Not authorized.");
    }

    next();
  };
};
