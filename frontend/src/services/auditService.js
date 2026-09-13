import api from "./api";

const auditService = {
  /*
   * Start a new website audit.
   */
  async createAudit(data) {
    const response = await api.post(
      "/audits",
      data
    );

    return response.data;
  },

  /*
   * Get a single audit.
   */
  async getAudit(auditId) {
    const response = await api.get(
      `/audits/${auditId}`
    );

    return response.data;
  },

  /*
   * Get the user's audit history.
   */
  async getAudits(params = {}) {
    const response = await api.get(
      "/audits",
      {
        params,
      }
    );

    return response.data;
  },

  /*
   * Get audit status.
   *
   * Useful while Lighthouse is running.
   */
  async getAuditStatus(auditId) {
    const response = await api.get(
      `/audits/${auditId}/status`
    );

    return response.data;
  },

  /*
   * Cancel a running audit.
   */
  async cancelAudit(auditId) {
    const response = await api.post(
      `/audits/${auditId}/cancel`
    );

    return response.data;
  },

  /*
   * Delete an audit.
   */
  async deleteAudit(auditId) {
    const response = await api.delete(
      `/audits/${auditId}`
    );

    return response.data;
  },

  /*
   * Get audit history with filters.
   */
  async getHistory({
    page = 0,
    size = 10,
    search = "",
    score = "all",
    status = "all",
  } = {}) {
    const response = await api.get(
      "/audits",
      {
        params: {
          page,
          size,
          search: search || undefined,
          score:
            score !== "all"
              ? score
              : undefined,
          status:
            status !== "all"
              ? status
              : undefined,
        },
      }
    );

    return response.data;
  },
};

export default auditService;