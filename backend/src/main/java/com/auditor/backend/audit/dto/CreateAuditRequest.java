package com.auditor.backend.audit.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class CreateAuditRequest {

    @NotBlank(message = "URL is required")
    @Size(max = 2048, message = "URL must not exceed 2048 characters")
    @Pattern(
            regexp = "^(https?://)([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}(:\\d{1,5})?([/?#].*)?$",
            message = "URL must be a valid HTTP or HTTPS URL"
    )
    private String url;

    @NotBlank(message = "Device is required")
    @Pattern(
            regexp = "^(mobile|desktop)$",
            message = "Device must be either mobile or desktop"
    )
    private String device;

    public CreateAuditRequest() {
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getDevice() {
        return device;
    }

    public void setDevice(String device) {
        this.device = device;
    }
}