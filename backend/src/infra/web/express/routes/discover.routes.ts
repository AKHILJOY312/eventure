import { Router } from "express";
import { Container } from "inversify";
import { TYPES } from "@/config/di/types";
import { DiscoverController } from "@/interface-adapters/controllers/DiscoverController";
import { asyncHandler } from "../handler/asyncHandler";
import { DiscoverRoutes } from "@/config/routes.config";

export function getDiscoverRoutes(container: Container): Router {
  const router = Router();

  const controller = container.get<DiscoverController>(
    TYPES.DiscoverController,
  );

  router.route(DiscoverRoutes.SERVICES).get(asyncHandler(controller.search));

  router
    .route(DiscoverRoutes.AVAILABILITY)
    .get(asyncHandler(controller.filterByAvailability));

  router
    .route(DiscoverRoutes.SERVICE_DETAILS)
    .get(asyncHandler(controller.getServiceDetails));

  return router;
}
