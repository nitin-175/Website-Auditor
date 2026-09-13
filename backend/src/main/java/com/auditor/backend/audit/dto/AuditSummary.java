package com.auditor.backend.audit.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AuditSummary {

    private Long id;
    private String url;
    private String device;
    private String status;
    private BigDecimal overallScore;
    private LocalDateTime createdAt;
    private Integer issues;

    public AuditSummary() {
    }

    public AuditSummary(
            Long id,
            String url,
            String device,
            String status,
            BigDecimal overallScore,
            LocalDateTime createdAt,
            Integer issues) {

        this.id = id;
        this.url = url;
        this.device = device;
        this.status = status;
        this.overallScore = overallScore;
        this.createdAt = createdAt;
        this.issues = issues;
    }

    public Long getId() {
        return id;
    }

    public String getUrl() {
        return url;
    }

    public String getDevice() {
        return device;
    }

    public String getStatus() {
        return status;
    }

    public BigDecimal getOverallScore() {
        return overallScore;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Integer getIssues() {
        return issues;
    }
}