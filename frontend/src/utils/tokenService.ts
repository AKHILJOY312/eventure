// tokenService.ts
const USER_TOKEN_KEY = "userAccessToken";

export const tokenService = {
  getToken: (): string | null => localStorage.getItem(USER_TOKEN_KEY),
  setToken: (token: string | null) => {
    if (token) {
      localStorage.setItem(USER_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(USER_TOKEN_KEY);
    }
  },
  clearToken: () => localStorage.removeItem(USER_TOKEN_KEY),

  // Admin-specific
  getAdminToken: () => localStorage.getItem("adminToken"),
  setAdminToken: (token: string) => localStorage.setItem("adminToken", token),
  clearAdminToken: () => localStorage.removeItem("adminToken"),
};
