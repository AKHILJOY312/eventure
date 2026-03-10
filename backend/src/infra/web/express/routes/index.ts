import { Router } from "express";
import { container } from "@/config/di/container";
import { getAuthRoutes } from "./auth.routes";
import { getAdminRoutes } from "./admin.routes";
import { getBookingRoutes } from "./booking.routes";
import { getDiscoverRoutes } from "./discover.routes";

const router = Router();

router.use("/auth", getAuthRoutes(container));
router.use("/admin", getAdminRoutes(container));
router.use("/bookings", getBookingRoutes(container));
router.use("/discover", getDiscoverRoutes(container));

export default router;
