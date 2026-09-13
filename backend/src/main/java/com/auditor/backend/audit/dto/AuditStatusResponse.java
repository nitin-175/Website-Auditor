package com.auditor.backend.audit.dto;

import java.time.LocalDateTime;

public class AuditStatusResponse {

    private Long auditId;
    private String status;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;

    public AuditStatusResponse() {
    }

    public AuditStatusResponse(
            Long auditId,
            String status,
            LocalDateTime startedAt,
            LocalDateTime completedAt) {

        this.auditId = auditId;
        this.status = status;
        this.startedAt = startedAt;
        this.completedAt = completedAt;
    }

    public Long getAuditId() {
        return auditId;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
}