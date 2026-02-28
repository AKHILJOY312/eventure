import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  loginUser,
  registerUser,
  loadUser,
  logoutUser,
  loginSuccess,
} from "../thunk/authThunks";
import type { AuthState } from "@/types";
import { tokenService } from "@/utils/tokenService";

const initialState: AuthState = {
  user: null,
  accessToken: null,
  loading: false,
  error: null,
  message: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    updateAccessToken(state, action) {
      state.accessToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;

        state.user = {
          id: "",
          name: "",
          email: action.payload.email,
        };
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
        state.isAuthenticated = true;

        tokenService.setToken(action.payload.accessToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loadUser.pending, (state) => {
        state.loading = false;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loadUser.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.loading = false;
      })
      // LOGOUT
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.loading = false;
        tokenService.clearToken();
      })
      .addCase(logoutUser.rejected, (state) => {
        // Force logout even if API fails
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.loading = false;
        tokenService.clearToken();
      })

      .addCase(loginSuccess.fulfilled, (state, action) => {
        state.accessToken = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
        tokenService.setToken(action.payload.token);
      });
  },
});

export const { clearError, clearMessage, setAccessToken, updateAccessToken } =
  authSlice.actions;
export default authSlice.reducer;
