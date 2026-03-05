// src/presentation/hooks/useAuth.ts
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { loginUser, loadUser, logoutUser } from "../redux/thunk/authThunks";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading, error, accessToken, message } =
    useAppSelector((s) => s.auth);

  const login = (email: string, password: string) =>
    dispatch(loginUser({ email, password }));

  const load = () => dispatch(loadUser());
  const logout = () => dispatch(logoutUser());

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    load,
    logout,

    message,
    accessToken,
  };
};
