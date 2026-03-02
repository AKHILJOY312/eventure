// src/routes/paths.ts
export const PATHS = {
  HOME: "/",

  AUTH: {
    REGISTER: "/register",
    LOGIN: "/login",
    VERIFY_EMAIL: "/verify-email",
  },

  USER: {
    DASHBOARD: "/bookings",
    DISCOVER: "/discover",
  },

  ADMIN: {
    DASHBOARD: "/admin",
  },
} as const;

export type AppPaths = typeof PATHS;
