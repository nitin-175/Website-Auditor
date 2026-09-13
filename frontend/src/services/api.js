import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8080/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

/*
 * Attach authentication token to every request.
 *
 * Temporary:
 * We are reading the token from localStorage.
 *
 * Later this will work together with the actual
 * authentication system implemented in Spring Boot.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(
      "accessToken"
    );

    if (token && config.url !== "/auth/refresh") {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/*
 * Central response handling.
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const refreshToken = localStorage.getItem(
      "refreshToken"
    );

    if (
      (status !== 401 && status !== 403) ||
      !refreshToken ||
      originalRequest?._authRetry ||
      originalRequest?.url === "/auth/refresh"
    ) {
      return Promise.reject(error);
    }

    originalRequest._authRetry = true;

    try {
      const refreshResponse = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        { refreshToken },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const {
        accessToken,
        refreshToken: nextRefreshToken,
      } = refreshResponse.data;

      localStorage.setItem(
        "accessToken",
        accessToken
      );

      if (nextRefreshToken) {
        localStorage.setItem(
          "refreshToken",
          nextRefreshToken
        );
      }

      originalRequest.headers.Authorization =
        `Bearer ${accessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("currentUser");

      window.location.assign("/login");

      return Promise.reject(refreshError);
    }
  }
);

export default api;