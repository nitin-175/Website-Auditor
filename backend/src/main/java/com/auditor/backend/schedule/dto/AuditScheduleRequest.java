package com.auditor.backend.schedule.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class AuditScheduleRequest {

    @NotBlank(message = "URL is required")
    @Size(max = 2048, message = "URL must not exceed 2048 characters")
    @Pattern(
            regexp = "^(https?://)([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}(:\\d{1,5})?([/?#].*)?$",
            message = "URL must be a valid HTTP or HTTPS URL"
    )
    private String url;

    @NotBlank(message = "Device is required")
    @Pattern(
            regexp = "desktop|mobile",
            message = "Device must be either desktop or mobile"
    )
    private String device;

    @NotBlank(message = "Frequency is required")
    @Pattern(
            regexp = "DAILY|WEEKLY|MONTHLY",
            message = "Frequency must be DAILY, WEEKLY, or MONTHLY"
    )
    private String frequency;

    @NotNull(message = "Next run time is required")
    @Future(message = "Next run time must be in the future")
    private LocalDateTime nextRunAt;

    public AuditScheduleRequest() {
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

    public void setUrl(String url) {
        this.url = url;
    }

    public void setDevice(String device) {
        this.device = device;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }

    public void setNextRunAt(LocalDateTime nextRunAt) {
        this.nextRunAt = nextRunAt;
    }
}
