import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import type { UserRoles } from "@/types";
import { PATHS } from "./routeConstant";

export const PublicRoute = () => {
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);

  if (!isAuthenticated) return <Outlet />;

  if (user?.role === "admin") {
    return <Navigate to={PATHS.ADMIN.DASHBOARD} replace />;
  }

  return <Navigate to={PATHS.USER.DASHBOARD} replace />;
};

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={PATHS.AUTH.LOGIN} replace />
  );
};

interface RoleProtectedRouteProps {
  allowedRoles: UserRoles[];
}

export const RoleProtectedRoute = ({
  allowedRoles,
}: RoleProtectedRouteProps) => {
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);

  if (!isAuthenticated || !user)
    return <Navigate to={PATHS.AUTH.LOGIN} replace />;

  if (!allowedRoles.includes(user.role)) {
    if (user.role === "admin") {
      return <Navigate to={PATHS.ADMIN.DASHBOARD} replace />;
    }
    return <Navigate to={PATHS.USER.DASHBOARD} replace />;
  }

  return <Outlet />;
};

export const RootRedirect = () => {
  const { user } = useAppSelector((s) => s.auth);

  if (!user) return <Navigate to={PATHS.AUTH.LOGIN} replace />;

  if (user.role === "admin") {
    return <Navigate to={PATHS.ADMIN.DASHBOARD} replace />;
  }

  return <Navigate to={PATHS.USER.DASHBOARD} replace />;
};
