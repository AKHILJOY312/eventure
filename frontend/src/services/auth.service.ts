import api from "./api";

export const login = (credentials: { email: string; password: string }) => {
  const endpoint = "auth/sessions";

  const { ...payload } = credentials;

  return api.post(endpoint, payload);
};

export const register = (data: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => api.post("/auth/users", data);

export const loadMe = () => api.get("/auth/users/me");

export const logout = () => api.delete("/auth/sessions/current");
export const verifyUserEmail = (payload: { email: string; otp: string }) =>
  api.patch("/auth/users/verify-email", payload);
