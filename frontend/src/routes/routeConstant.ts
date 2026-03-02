// src/routes/paths.ts
export const PATHS = {
  HOME: "/",

  AUTH: {
    REGISTER: "/register",
    LOGIN: "/login",
    VERIFY_EMAIL: "/verify-email",
  },

  USER: {
    DASHBOARD: "/dashboard",
    STATS: "/stats",
  },

  ADMIN: {
    DASHBOARD: "/admin",
  },
} as const;

export type AppPaths = typeof PATHS;
