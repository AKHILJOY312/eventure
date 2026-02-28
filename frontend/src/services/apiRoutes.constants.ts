export const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    ME: "/auth/me",
    LOGOUT: "/auth/logout",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: "/auth/verify-email",
    VERIFY_RESET_TOKEN: "/auth/verify-reset-token",
  },

  ADMIN: {
    LOGIN: "/admin/auth/login",
    USERS: "/admin/users",
    USER_STATUS: (id: string) => `/admin/users/${id}/status`,
    USER_ROLE: (id: string) => `/admin/users/${id}/role`,
    PLANS: "/admin/plans",
    PLAN_BY_ID: (id: string) => `/admin/plans/${id}`,
    CURRENT_PLAN: "/admin/plans/current",
    PLAN_LIMITS: "/admin/plans/limits",
  },

  PROJECTS: {
    ROOT: "/projects",
    BY_ID: (projectId: string) => `/projects/${projectId}`,
    MEMBERS: (projectId: string) => `/projects/${projectId}/members`,
    MEMBERS_INVITATION: () => `/invite`,
    MEMBER_BY_ID: (projectId: string, memberId: string) =>
      `/projects/${projectId}/members/${memberId}`,
    MEMBER_ROLE: (projectId: string, memberId: string) =>
      `/projects/${projectId}/members/${memberId}/role`,
    CHANNELS: (projectId: string) => `/projects/${projectId}/channels`,
    CHANNEL_BY_ID: (projectId: string, channelId: string) =>
      `/projects/${projectId}/channels/${channelId}`,
    UPLOAD_URL: (projectId: string, channelId: string) =>
      `/projects/${projectId}/channels/${channelId}/upload-url`,
  },
  ATTACHMENT: {
    GET_URL: (attachmentId: string) => `/attachments/${attachmentId}`,
  },

  TASKS: {
    ROOT: (projectId: string) => `/projects/${projectId}/tasks`,
    BY_ID: (taskId: string) => `/projects/tasks/${taskId}`,
    STATUS: (taskId: string) => `/projects/tasks/${taskId}/status`,
    ATTACHMENT_UPLOAD: (projectId: string) =>
      `/projects/${projectId}/tasks/attachments/upload-url`,
    MEMBERS_SEARCH: (projectId: string) =>
      `/projects/${projectId}/tasks/members/search`,
  },

  SUBSCRIPTION: {
    PLANS: "/subscription/plans",
    LIMITS: "/subscription/limits",
    UPGRADE: "/subscription/upgrade",
    RAZORPAY_ORDER: "/subscription/razorpay/order",
    RAZORPAY_CAPTURE: "/subscription/razorpay/capture",
    PAYMENT_HISTORY: "/subscription/history",
  },

  USERS: {
    ME: "/user/me",
    PROFILE_IMAGE: "/user/profile-image",
    RESET_PASSWORD: "/user/change-password",
    REQUEST_EMAIL_OTP: "user/change-email/request",
    VERIFY_EMAIL_OTP: "user/change-email/verify",
  },
} as const;
