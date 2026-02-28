import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

export const PublicRoute = () => {
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  return isAuthenticated ? <Navigate to="/tasks" replace /> : <Outlet />;
};

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
