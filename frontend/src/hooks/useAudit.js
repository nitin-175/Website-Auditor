import useAuditStore from "../store/auditStore";

function useAudit() {
  const currentAudit = useAuditStore(
    (state) => state.currentAudit
  );

  const currentReport = useAuditStore(
    (state) => state.currentReport
  );

  const audits = useAuditStore(
    (state) => state.audits
  );

  const pagination = useAuditStore(
    (state) => state.pagination
  );

  const auditStatus = useAuditStore(
    (state) => state.auditStatus
  );

  const selectedAuditIds =
    useAuditStore(
      (state) => state.selectedAuditIds
    );

  const isLoading = useAuditStore(
    (state) => state.isLoading
  );

  const isCreating = useAuditStore(
    (state) => state.isCreating
  );

  const isLoadingReport =
    useAuditStore(
      (state) => state.isLoadingReport
    );

  const error = useAuditStore(
    (state) => state.error
  );

  const createAudit = useAuditStore(
    (state) => state.createAudit
  );

  const fetchAudits = useAuditStore(
    (state) => state.fetchAudits
  );

  const fetchAudit = useAuditStore(
    (state) => state.fetchAudit
  );

  const fetchReport = useAuditStore(
    (state) => state.fetchReport
  );

  const fetchAuditStatus =
    useAuditStore(
      (state) => state.fetchAuditStatus
    );

  const selectAudit = useAuditStore(
    (state) => state.selectAudit
  );

  const clearSelectedAudits =
    useAuditStore(
      (state) => state.clearSelectedAudits
    );

  const clearCurrentAudit =
    useAuditStore(
      (state) => state.clearCurrentAudit
    );

  const clearError = useAuditStore(
    (state) => state.clearError
  );

  return {
    currentAudit,
    currentReport,
    audits,
    pagination,
    auditStatus,
    selectedAuditIds,

    isLoading,
    isCreating,
    isLoadingReport,
    error,

    createAudit,
    fetchAudits,
    fetchAudit,
    fetchReport,
    fetchAuditStatus,

    selectAudit,
    clearSelectedAudits,
    clearCurrentAudit,
    clearError,
  };
}

export default useAudit;