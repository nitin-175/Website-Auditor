package com.auditor.backend.audit.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class AuditResponse {

    private Long id;
    private String url;
    private String device;
    private String status;
    private BigDecimal overallScore;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private ScoreResponse scores;
    private VitalsResponse vitals;
    private List<IssueResponse> issues;
    private List<RecommendationResponse> recommendations;

    public AuditResponse() {
    }

    public AuditResponse(
            Long id,
            String url,
            String device,
            String status,
            BigDecimal overallScore,
            LocalDateTime startedAt,
            LocalDateTime completedAt,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {

        this.id = id;
        this.url = url;
        this.device = device;
        this.status = status;
        this.overallScore = overallScore;
        this.startedAt = startedAt;
        this.completedAt = completedAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public AuditResponse(
            Long id,
            String url,
            String device,
            String status,
            BigDecimal overallScore,
            LocalDateTime startedAt,
            LocalDateTime completedAt,
            LocalDateTime createdAt,
            LocalDateTime updatedAt,
            ScoreResponse scores,
            VitalsResponse vitals,
            List<IssueResponse> issues,
            List<RecommendationResponse> recommendations) {

        this.id = id;
        this.url = url;
        this.device = device;
        this.status = status;
        this.overallScore = overallScore;
        this.startedAt = startedAt;
        this.completedAt = completedAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.scores = scores;
        this.vitals = vitals;
        this.issues = issues;
        this.recommendations = recommendations;
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

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public ScoreResponse getScores() {
        return scores;
    }

    public VitalsResponse getVitals() {
        return vitals;
    }

    public List<IssueResponse> getIssues() {
        return issues;
    }

    public List<RecommendationResponse> getRecommendations() {
        return recommendations;
    }

    public static class ScoreResponse {

        private BigDecimal performance;
        private BigDecimal accessibility;
        private BigDecimal bestPractices;
        private BigDecimal seo;

        public ScoreResponse() {
        }

        public ScoreResponse(
                BigDecimal performance,
                BigDecimal accessibility,
                BigDecimal bestPractices,
                BigDecimal seo) {

            this.performance = performance;
            this.accessibility = accessibility;
            this.bestPractices = bestPractices;
            this.seo = seo;
        }

        public BigDecimal getPerformance() {
            return performance;
        }

        public BigDecimal getAccessibility() {
            return accessibility;
        }

        public BigDecimal getBestPractices() {
            return bestPractices;
        }

        public BigDecimal getSeo() {
            return seo;
        }
    }

    public static class VitalsResponse {

        private BigDecimal lcpMs;
        private BigDecimal inpMs;
        private BigDecimal cls;
        private BigDecimal fcpMs;

        public VitalsResponse() {
        }

        public VitalsResponse(
                BigDecimal lcpMs,
                BigDecimal inpMs,
                BigDecimal cls,
                BigDecimal fcpMs) {

            this.lcpMs = lcpMs;
            this.inpMs = inpMs;
            this.cls = cls;
            this.fcpMs = fcpMs;
        }

        public BigDecimal getLcpMs() {
            return lcpMs;
        }

        public BigDecimal getInpMs() {
            return inpMs;
        }

        public BigDecimal getCls() {
            return cls;
        }

        public BigDecimal getFcpMs() {
            return fcpMs;
        }
    }

    public static class IssueResponse {

        private Long id;
        private String category;
        private String severity;
        private String title;
        private String description;
        private String recommendation;

        public IssueResponse() {
        }

        public IssueResponse(
                Long id,
                String category,
                String severity,
                String title,
                String description,
                String recommendation) {

            this.id = id;
            this.category = category;
            this.severity = severity;
            this.title = title;
            this.description = description;
            this.recommendation = recommendation;
        }

        public Long getId() {
            return id;
        }

        public String getCategory() {
            return category;
        }

        public String getSeverity() {
            return severity;
        }

        public String getTitle() {
            return title;
        }

        public String getDescription() {
            return description;
        }

        public String getRecommendation() {
            return recommendation;
        }
    }

    public static class RecommendationResponse {

        private Long id;
        private String title;
        private String description;
        private String priority;

        public RecommendationResponse() {
        }

        public RecommendationResponse(
                Long id,
                String title,
                String description,
                String priority) {

            this.id = id;
            this.title = title;
            this.description = description;
            this.priority = priority;
        }

        public Long getId() {
            return id;
        }

        public String getTitle() {
            return title;
        }

        public String getDescription() {
            return description;
        }

        public String getPriority() {
            return priority;
        }
    }
}