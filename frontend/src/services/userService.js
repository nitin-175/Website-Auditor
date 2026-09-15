import api from "./api";

const userService = {
  /*
   * Get current user's profile.
   */
  async getProfile() {
    const response = await api.get("/user/profile");

    return response.data;
  },

  /*
   * Update profile information.
   */
  async updateProfile(data) {
    const response = await api.put("/user/profile", data);

    return response.data;
  },

  /*
   * Change account password.
   */
  async changePassword(data) {
    const response = await api.post(
      "/user/change-password",
      data
    );

    return response.data;
  },

  /*
   * Delete the current account.
   */
  async deleteAccount() {
    const response = await api.delete("/user/profile");

    return response.data;
  },

  /*
   * Get user security information.
   */
  async getSecuritySettings() {
    const response = await api.get(
      "/users/me/security"
    );

    return response.data;
  },
};

export default userService;