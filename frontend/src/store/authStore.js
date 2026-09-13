import { create } from "zustand";
import authService from "../services/authService";

const storedUser =
  authService.getStoredUser();

const storedToken =
  localStorage.getItem("accessToken");

const useAuthStore = create((set) => ({
  /*
   * State
   */
  user: storedUser,
  accessToken: storedToken,
  isAuthenticated: Boolean(storedToken),
  isLoading: false,
  error: null,

  /*
   * Login
   */
  login: async (credentials) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const data =
        await authService.login(credentials);

      set({
        user: data.user || null,
        accessToken:
          data.accessToken || null,
        isAuthenticated:
          Boolean(data.accessToken),
        isLoading: false,
        error: null,
      });

      return data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Login failed.";

      set({
        isLoading: false,
        error: message,
      });

      throw error;
    }
  },

  /*
   * Register
   */
  register: async (userData) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const data =
        await authService.register(
          userData
        );

      set({
        isLoading: false,
        error: null,
      });

      return data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Registration failed.";

      set({
        isLoading: false,
        error: message,
      });

      throw error;
    }
  },

  /*
   * Logout
   */
  logout: async () => {
    set({
      isLoading: true,
    });

    try {
      await authService.logout();
    } finally {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  /*
   * Get current user from backend
   */
  fetchCurrentUser: async () => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const user =
        await authService.getCurrentUser();

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return user;
    } catch (error) {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
        error:
          error.response?.data?.message ||
          "Unable to load user.",
      });

      return null;
    }
  },

  /*
   * Clear authentication error
   */
  clearError: () => {
    set({
      error: null,
    });
  },

  /*
   * Clear complete authentication state
   */
  clearAuth: () => {
    localStorage.removeItem(
      "accessToken"
    );

    localStorage.removeItem(
      "refreshToken"
    );

    localStorage.removeItem(
      "currentUser"
    );

    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },
}));

export default useAuthStore;