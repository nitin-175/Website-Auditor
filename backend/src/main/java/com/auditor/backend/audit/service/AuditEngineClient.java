package com.auditor.backend.audit.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class AuditEngineClient {

    private final RestClient restClient;
    private final String auditEngineUrl;
    private final String auditEngineApiKey;

    public AuditEngineClient(
            @Value("${audit.engine.url}") String auditEngineUrl,
            @Value("${audit.engine.api-key}") String auditEngineApiKey) {

        this.auditEngineUrl = auditEngineUrl;
        this.auditEngineApiKey = auditEngineApiKey;

        this.restClient = RestClient.builder()
                .baseUrl(auditEngineUrl)
                .build();
    }

    public String runAudit(String url, String device) {

        AuditEngineRequest request =
                new AuditEngineRequest(url, device);

        return restClient.post()
                .uri("/api/audits")
                .header(
                        "X-Audit-Engine-Key",
                        auditEngineApiKey
                )
                .header(
                        HttpHeaders.CONTENT_TYPE,
                        MediaType.APPLICATION_JSON_VALUE
                )
                .body(request)
                .retrieve()
                .body(String.class);
    }

    private record AuditEngineRequest(
            String url,
            String device
    ) {
    }
}