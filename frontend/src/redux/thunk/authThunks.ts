// src/presentation/redux/thunks/authThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { tokenService } from "@/utils/tokenService";
import {
  loadMe,
  login,
  logout,
  register,
  verifyUserEmail,
} from "@/services/auth.service";
import type { User } from "@/types";

// Define a base error interface to replace 'any'
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}
interface LoginResponse {
  accessToken: string;
  user: User;
}
interface RegisterResponse {
  message: string;
  email: string;
}

interface VerifyEmailResponse {
  otp: string;
}
// Resolve singletons

export const loginUser = createAsyncThunk<
  LoginResponse,
  { email: string; password: string },
  { rejectValue: string }
>(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const result = await login(credentials);
      return result.data;
    } catch (e) {
      const error = e as ApiError;
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

export const loadUser = createAsyncThunk<User, void, { rejectValue: string }>(
  "auth/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const result = await loadMe();
      return result.data.user;
    } catch (e) {
      const error = e as ApiError;
      return rejectWithValue(
        error.response?.data?.message || "Not authenticated",
      );
    }
  },
);

export const registerUser = createAsyncThunk<
  RegisterResponse,
  {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  },
  { rejectValue: string }
>(
  "auth/register",
  async (
    data: {
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const result = await register(data);
      return result.data;
    } catch (e) {
      const error = e as ApiError;
      return rejectWithValue(
        error.response?.data?.message || "Registration failed",
      );
    }
  },
);

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logout();
    } catch (e) {
      const error = e as ApiError;
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  },
);

export const verifyEmailOTP = createAsyncThunk<
  VerifyEmailResponse,
  { email: string; otp: string },
  { rejectValue: string }
>("auth/verifyEmail", async ({ email, otp }, { rejectWithValue }) => {
  try {
    const result = await verifyUserEmail({ email, otp });
    return result.data;
  } catch (e) {
    const error = e as ApiError;
    return rejectWithValue(
      error.response?.data?.message || "Verification failed",
    );
  }
});

export const loginSuccess = createAsyncThunk<
  { token: string },
  { token: string }
>("auth/loginSuccess", async (data: { token: string }) => {
  tokenService.setToken(data.token);
  return { token: data.token };
});
