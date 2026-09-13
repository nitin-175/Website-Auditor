import { create } from "zustand";

import auditService from "../services/auditService";
import reportService from "../services/reportService";

const useAuditStore = create((set) => ({
  /*
   * Current audit
   */
  currentAudit: null,

  /*
   * Audit report
   */
  currentReport: null,

  /*
   * History
   */
  audits: [],

  /*
   * Pagination
   */
  pagination: {
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  },

  /*
   * Audit status
   */
  auditStatus: null,

  /*
   * Selected audit IDs
   */
  selectedAuditIds: [],

  /*
   * Loading states
   */
  isLoading: false,
  isCreating: false,
  isLoadingReport: false,

  /*
   * Error
   */
  error: null,

  /*
   * Create audit
   */
  createAudit: async (data) => {
    set({
      isCreating: true,
      error: null,
    });

    try {
      const audit =
        await auditService.createAudit(data);

      set({
        currentAudit: audit,
        isCreating: false,
        error: null,
      });

      return audit;
    } catch (error) {
      set({
        isCreating: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Unable to create audit.",
      });

      throw error;
    }
  },

  /*
   * Load audit history
   */
  fetchAudits: async (params = {}) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const data =
        await auditService.getAudits(
          params
        );

      /*
       * Spring Boot can later return:
       *
       * {
       *   content: [],
       *   number: 0,
       *   size: 10,
       *   totalElements: 50,
       *   totalPages: 5
       * }
       */

      set({
        audits:
          data.content ||
          data.audits ||
          data ||
          [],

        pagination: {
          page:
            data.number ??
            params.page ??
            0,

          size:
            data.size ??
            params.size ??
            10,

          totalElements:
            data.totalElements ??
            data.audits?.length ??
            0,

          totalPages:
            data.totalPages ??
            1,
        },

        isLoading: false,
        error: null,
      });

      return data;
    } catch (error) {
      set({
        audits: [],
        isLoading: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Unable to load audits.",
      });

      throw error;
    }
  },

  /*
   * Load a single audit
   */
  fetchAudit: async (auditId) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const audit =
        await auditService.getAudit(
          auditId
        );

      set({
        currentAudit: audit,
        isLoading: false,
        error: null,
      });

      return audit;
    } catch (error) {
      set({
        currentAudit: null,
        isLoading: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Unable to load audit.",
      });

      throw error;
    }
  },

  /*
   * Load report
   */
  fetchReport: async (auditId) => {
    set({
      isLoadingReport: true,
      error: null,
    });

    try {
      const report =
        await reportService.getReport(
          auditId
        );

      set({
        currentReport: report,
        isLoadingReport: false,
        error: null,
      });

      return report;
    } catch (error) {
      set({
        currentReport: null,
        isLoadingReport: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Unable to load report.",
      });

      throw error;
    }
  },

  /*
   * Check running audit status
   */
  fetchAuditStatus: async (auditId) => {
    try {
      const status =
        await auditService.getAuditStatus(
          auditId
        );

      set({
        auditStatus: status,
      });

      return status;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          error.message ||
          "Unable to get audit status.",
      });

      throw error;
    }
  },

  /*
   * Select audit for comparison
   */
  selectAudit: (auditId) => {
    set((state) => {
      if (
        state.selectedAuditIds.includes(
          auditId
        )
      ) {
        return {
          selectedAuditIds:
            state.selectedAuditIds.filter(
              (id) => id !== auditId
            ),
        };
      }

      if (
        state.selectedAuditIds.length >= 2
      ) {
        return state;
      }

      return {
        selectedAuditIds: [
          ...state.selectedAuditIds,
          auditId,
        ],
      };
    });
  },

  /*
   * Clear selected audits
   */
  clearSelectedAudits: () => {
    set({
      selectedAuditIds: [],
    });
  },

  /*
   * Clear current audit
   */
  clearCurrentAudit: () => {
    set({
      currentAudit: null,
      currentReport: null,
      auditStatus: null,
      error: null,
    });
  },

  /*
   * Clear errors
   */
  clearError: () => {
    set({
      error: null,
    });
  },
}));

export default useAuditStore;