package com.auditor.backend.schedule.dto;

import java.time.LocalDateTime;

public class AuditScheduleResponse {

    private Long id;
    private String url;
    private String device;
    private String frequency;
    private LocalDateTime nextRunAt;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public AuditScheduleResponse() {
    }

    public AuditScheduleResponse(
            Long id,
            String url,
            String device,
            String frequency,
            LocalDateTime nextRunAt,
            Boolean active,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {

        this.id = id;
        this.url = url;
        this.device = device;
        this.frequency = frequency;
        this.nextRunAt = nextRunAt;
        this.active = active;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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

    public String getFrequency() {
        return frequency;
    }

    public LocalDateTime getNextRunAt() {
        return nextRunAt;
    }

    public Boolean getActive() {
        return active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}