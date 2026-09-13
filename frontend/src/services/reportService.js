import api from "./api";

const reportService = {
  /*
   * Get complete report for an audit.
   */
  async getReport(auditId) {
    const response = await api.get(
      `/reports/${auditId}`
    );

    return response.data;
  },

  /*
   * Get score summary.
   */
  async getScoreSummary(auditId) {
    const response = await api.get(
      `/reports/${auditId}/scores`
    );

    return response.data;
  },

  /*
   * Get Core Web Vitals.
   */
  async getCoreWebVitals(auditId) {
    const response = await api.get(
      `/reports/${auditId}/core-web-vitals`
    );

    return response.data;
  },

  /*
   * Get detected issues.
   */
  async getIssues(auditId, params = {}) {
    const response = await api.get(
      `/reports/${auditId}/issues`,
      {
        params,
      }
    );

    return response.data;
  },

  /*
   * Get recommendations.
   */
  async getRecommendations(auditId) {
    const response = await api.get(
      `/reports/${auditId}/recommendations`
    );

    return response.data;
  },

  /*
   * Export/download a report.
   *
   * Backend can later return PDF or another
   * supported report format.
   */
  async exportReport(auditId, format = "pdf") {
    const response = await api.get(
      `/reports/${auditId}/export`,
      {
        params: {
          format,
        },
        responseType: "blob",
      }
    );

    return response.data;
  },
};

export default reportService;