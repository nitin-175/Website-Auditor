import api from "./api";

const comparisonService = {
  /*
   * Get audits that can be compared.
   */
  async getAvailableAudits() {
    const response = await api.get(
      "/comparisons/audits"
    );

    return response.data;
  },

  /*
   * Compare two audits.
   */
  async compareAudits(
    firstAuditId,
    secondAuditId
  ) {
    const response = await api.get(
      "/comparisons",
      {
        params: {
          firstAuditId,
          secondAuditId,
        },
      }
    );

    return response.data;
  },

  /*
   * Get score comparison.
   */
  async getScoreComparison(
    firstAuditId,
    secondAuditId
  ) {
    const response = await api.get(
      "/comparisons/scores",
      {
        params: {
          firstAuditId,
          secondAuditId,
        },
      }
    );

    return response.data;
  },
};

export default comparisonService;