import { Router } from "express";
import { Container } from "inversify";
import { TYPES } from "@/config/di/types";
import { DiscoverController } from "@/interface-adapters/controllers/DiscoverController";
import { asyncHandler } from "../handler/asyncHandler";

export function getDiscoverRoutes(container: Container): Router {
  const router = Router();

  const controller = container.get<DiscoverController>(
    TYPES.DiscoverController,
  );

  router.route("/services").get(asyncHandler(controller.search));

  router
    .route("/services/availability")
    .get(asyncHandler(controller.filterByAvailability));

  router
    .route("/services/:serviceId")
    .get(asyncHandler(controller.getServiceDetails));

  return router;
}
