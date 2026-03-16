import { Router } from "express";
import { Container } from "inversify";
import { TYPES } from "@/config/di/types";
import { BookingController } from "@/interface-adapters/controllers/BookingController";
import { asyncHandler } from "../handler/asyncHandler";
import { createProtectMiddleware } from "../middleware/authentication";

export function getBookingRoutes(container: Container): Router {
  const router = Router();

  const bookingController = container.get<BookingController>(
    TYPES.BookingController,
  );
  const protect = container.get<ReturnType<typeof createProtectMiddleware>>(
    TYPES.ProtectMiddleware,
  );

  router.use(protect);

  router.route("/").post(asyncHandler(bookingController.createBooking));

  router.route("/me").get(asyncHandler(bookingController.getMyBookings));

  router
    .route("/price/calculate")
    .get(asyncHandler(bookingController.calculatePrice));

  router
    .route("/cancel")
    .patch(asyncHandler(bookingController.cancelBooking));

  return router;
}
