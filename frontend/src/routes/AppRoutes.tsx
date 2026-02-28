// src/routes/AppRoutes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { PublicRoute, ProtectedRoute } from "@/routes/RouteGuards";

import Layout from "@/components/templates/Layout";
import AuthLayout from "@/components/templates/AuthLayout";

import LoginPage from "@/components/pages/Auth/LoginPage";
import RegisterPage from "@/components/pages/Auth/RegisterPage";
import VerifyOTPPage from "@/components/pages/Auth/VerifyOTPPage";

import BoardPage from "@/components/pages/BoardPage";
import StatsPage from "@/components/pages/StatsPage";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyOTPPage />} />
        </Route>
      </Route>

      {/* PROTECTED */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<BoardPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
