// src/routes/AppRoutes.tsx
import { Routes, Route } from "react-router-dom";
import {
  PublicRoute,
  ProtectedRoute,
  RoleProtectedRoute,
  RootRedirect,
} from "@/routes/RouteGuards";

import Layout from "@/components/templates/Layout";
import AuthLayout from "@/components/templates/AuthLayout";

import LoginPage from "@/components/pages/Auth/LoginPage";
import RegisterPage from "@/components/pages/Auth/RegisterPage";
import VerifyOTPPage from "@/components/pages/Auth/VerifyOTPPage";
import AdminPage from "@/components/pages/AdminPage";
import NotFoundPage from "@/components/pages/NotFoundPage";
import { PATHS } from "./routeConstant";
import BookingsPage from "@/components/pages/BookingsPage";
import DiscoverPage from "@/components/pages/DiscoverPage";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path={PATHS.AUTH.LOGIN} element={<LoginPage />} />
          <Route path={PATHS.AUTH.REGISTER} element={<RegisterPage />} />
          <Route path={PATHS.AUTH.VERIFY_EMAIL} element={<VerifyOTPPage />} />
        </Route>
      </Route>
      <Route path={PATHS.HOME} element={<RootRedirect />} />

      {/* PROTECTED */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          {/* USER ROUTES */}
          <Route element={<RoleProtectedRoute allowedRoles={["user"]} />}>
            <Route path={PATHS.USER.DASHBOARD} element={<BookingsPage />} />
            <Route path={PATHS.USER.DISCOVER} element={<DiscoverPage />} />
          </Route>

          {/* ADMIN ROUTES */}
          <Route element={<RoleProtectedRoute allowedRoles={["admin"]} />}>
            <Route path={PATHS.ADMIN.DASHBOARD} element={<AdminPage />} />
          </Route>
        </Route>
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
