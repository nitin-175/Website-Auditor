package com.auditor.backend.audit.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "audit_scores")
public class AuditScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "audit_id", nullable = false, unique = true)
    private Audit audit;

    @Column(name = "performance", precision = 5, scale = 2)
    private BigDecimal performance;

    @Column(name = "accessibility", precision = 5, scale = 2)
    private BigDecimal accessibility;

    @Column(name = "best_practices", precision = 5, scale = 2)
    private BigDecimal bestPractices;

    @Column(name = "seo", precision = 5, scale = 2)
    private BigDecimal seo;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public AuditScore() {
    }

    public Long getId() {
        return id;
    }

    public Audit getAudit() {
        return audit;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setAudit(Audit audit) {
        this.audit = audit;
    }

    public void setPerformance(BigDecimal performance) {
        this.performance = performance;
    }

    public void setAccessibility(BigDecimal accessibility) {
        this.accessibility = accessibility;
    }

    public void setBestPractices(BigDecimal bestPractices) {
        this.bestPractices = bestPractices;
    }

    public void setSeo(BigDecimal seo) {
        this.seo = seo;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}