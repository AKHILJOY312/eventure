import api from "./api";
import { API_ROUTES } from "./apiRoutes.constants";

export const getMyProfile = () => api.get(API_ROUTES.USERS.ME);

export const updateName = (payload: { name: string }) =>
  api.patch(API_ROUTES.USERS.ME, payload);

export const updatePassword = (payload: {
  oldPassword: string;
  newPassword: string;
}) => api.patch(API_ROUTES.USERS.RESET_PASSWORD, payload);

export const deleteAccount = () => api.delete(API_ROUTES.USERS.ME);

export const getUploadUrl = (fileType: string) =>
  api.post(API_ROUTES.USERS.PROFILE_IMAGE, { fileType });

export const saveProfileImage = (fileKey: string) =>
  api.patch(API_ROUTES.USERS.PROFILE_IMAGE, { fileKey });

export const sendOtp = (newEmail: string) =>
  api.post(API_ROUTES.USERS.REQUEST_EMAIL_OTP, { newEmail });

export const verifyAndUpdateEmail = (emailChangeOtp: string) =>
  api.post(API_ROUTES.USERS.VERIFY_EMAIL_OTP, { emailChangeOtp });
