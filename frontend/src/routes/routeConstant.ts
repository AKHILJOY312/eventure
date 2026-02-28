export const PATHS = {
  HOME: "/",

  AUTH: {
    SIGN_UP: "/register",
    LOGIN: "/login",
    VERIFY_EMAIL: "/verify-email",
    FORGOT_PASSWORD: "/forget-password",
    RESET_PASSWORD: "/reset-password",
    AUTH_SUCCESS: "/success",
  },

  //Task
  TASK: {
    LIST_TASK: "/projects/:projectId/task",
    DETAIL_TASK: "/projects/:projectId/task/:taskId",
  },
} as const;
