import useAuthStore from "../store/authStore";

function useAuth() {
  const user = useAuthStore(
    (state) => state.user
  );

  const accessToken = useAuthStore(
    (state) => state.accessToken
  );

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const isLoading = useAuthStore(
    (state) => state.isLoading
  );

  const error = useAuthStore(
    (state) => state.error
  );

  const login = useAuthStore(
    (state) => state.login
  );

  const register = useAuthStore(
    (state) => state.register
  );

  const logout = useAuthStore(
    (state) => state.logout
  );

  const fetchCurrentUser = useAuthStore(
    (state) => state.fetchCurrentUser
  );

  const clearError = useAuthStore(
    (state) => state.clearError
  );

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    error,

    login,
    register,
    logout,
    fetchCurrentUser,
    clearError,
  };
}

export default useAuth;