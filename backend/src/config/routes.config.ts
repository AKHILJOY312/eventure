export enum RootRoutes {
  AUTH = "/auth",
  ADMIN = "/admin",
  BOOKINGS = "/bookings",
  DISCOVER = "/discover",
}

export enum AuthRoutes {
  ROOT = "/",

  // Users
  USERS = "/users",
  VERIFY_EMAIL = "/users/verify-email",
  ME = "/users/me",

  // Sessions
  SESSIONS = "/sessions",
  CURRENT_SESSION = "/sessions/current",
}

export enum BookingRoutes {
  ROOT = "/",
  ME = "/me",
  CALCULATE_PRICE = "/price/calculate",
  CANCEL = "/cancel",
}
export enum DiscoverRoutes {
  ROOT = "/",
  SERVICES = "/services",
  AVAILABILITY = "/services/availability",
  SERVICE_DETAILS = "/services/:serviceId",
}

export enum AdminRoutes {
  ROOT = "/",
  SERVICES = "/services",
  SERVICE_BY_ID = "/services/:serviceId",
  SERVICE_BOOKINGS = "/services/:serviceId/bookings",
  UPDATE_BOOKING_STATUS = "/services/:serviceId/bookings/:bookingId/status",
}
