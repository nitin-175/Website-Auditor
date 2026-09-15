import api from "./api";

const authService = {
  async login(credentials) {
    const response = await api.post(
      "/auth/login",
      credentials
    );

    const {
      accessToken,
      refreshToken,
      id,
      name,
      email,
    } = response.data;

    const user = id
      ? { id, name, email }
      : null;

    if (accessToken) {
      localStorage.setItem(
        "accessToken",
        accessToken
      );
    }

    if (refreshToken) {
      localStorage.setItem(
        "refreshToken",
        refreshToken
      );
    }

    if (user) {
      localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
      );
    }

    return response.data;
  },

  async register(userData) {
    const response = await api.post(
      "/auth/register",
      userData
    );

    return response.data;
  },

  async logout() {
    const refreshToken = localStorage.getItem(
      "refreshToken"
    );

    try {
      if (refreshToken) {
        await api.post("/auth/logout", {
          refreshToken,
        });
      }
    } catch {
      return;
    } finally {
      localStorage.removeItem(
        "accessToken"
      );

      localStorage.removeItem(
        "refreshToken"
      );

      localStorage.removeItem(
        "currentUser"
      );
    }
  },

  async refreshToken(refreshToken) {
    const response = await api.post(
      "/auth/refresh",
      {
        refreshToken,
      }
    );

    const {
      accessToken,
      refreshToken: nextRefreshToken,
    } = response.data;

    if (accessToken) {
      localStorage.setItem(
        "accessToken",
        accessToken
      );
    }

    if (nextRefreshToken) {
      localStorage.setItem(
        "refreshToken",
        nextRefreshToken
      );
    }

    return response.data;
  },

  async forgotPassword(email) {
    const response = await api.post(
      "/auth/forgot-password",
      {
        email,
      }
    );

    return response.data;
  },

  async resetPassword(data) {
    const response = await api.post(
      "/auth/reset-password",
      data
    );

    return response.data;
  },

  async verifyEmail(token) {
    const response = await api.get(
      "/auth/verify-email",
      {
        params: { token },
      }
    );

    return response.data;
  },

  async resendVerification(email) {
    const response = await api.post(
      "/auth/resend-verification",
      { email }
    );

    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get("/user/profile");

    const user = response.data;

    localStorage.setItem(
      "currentUser",
      JSON.stringify(user)
    );

    return user;
  },

  getStoredUser() {
    const storedUser =
      localStorage.getItem(
        "currentUser"
      );

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch {
      localStorage.removeItem(
        "currentUser"
      );

      return null;
    }
  },

  isAuthenticated() {
    return Boolean(
      localStorage.getItem(
        "accessToken"
      )
    );
  },
};

export default authService;