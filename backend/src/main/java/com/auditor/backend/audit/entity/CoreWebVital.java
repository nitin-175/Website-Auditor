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
@Table(name = "core_web_vitals")
public class CoreWebVital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "audit_id", nullable = false, unique = true)
    private Audit audit;

    @Column(name = "lcp_ms", precision = 10, scale = 2)
    private BigDecimal lcpMs;

    @Column(name = "inp_ms", precision = 10, scale = 2)
    private BigDecimal inpMs;

    @Column(name = "cls", precision = 10, scale = 4)
    private BigDecimal cls;

    @Column(name = "fcp_ms", precision = 10, scale = 2)
    private BigDecimal fcpMs;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public CoreWebVital() {
    }

    public Long getId() {
        return id;
    }

    public Audit getAudit() {
        return audit;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setAudit(Audit audit) {
        this.audit = audit;
    }

    public void setLcpMs(BigDecimal lcpMs) {
        this.lcpMs = lcpMs;
    }

    public void setInpMs(BigDecimal inpMs) {
        this.inpMs = inpMs;
    }

    public void setCls(BigDecimal cls) {
        this.cls = cls;
    }

    public void setFcpMs(BigDecimal fcpMs) {
        this.fcpMs = fcpMs;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}