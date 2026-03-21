import { Router } from "express";
import { container } from "@/config/di/container";
import { getAuthRoutes } from "./auth.routes";
import { getAdminRoutes } from "./admin.routes";
import { getBookingRoutes } from "./booking.routes";
import { getDiscoverRoutes } from "./discover.routes";
import { RootRoutes } from "@/config/routes.config";

const router = Router();

router.use(RootRoutes.AUTH, getAuthRoutes(container));
router.use(RootRoutes.ADMIN, getAdminRoutes(container));
router.use(RootRoutes.BOOKINGS, getBookingRoutes(container));
router.use(RootRoutes.DISCOVER, getDiscoverRoutes(container));

export default router;
