package com.auditor.backend.audit.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.auditor.backend.audit.dto.AuditResponse;
import com.auditor.backend.audit.dto.AuditStatusResponse;
import com.auditor.backend.audit.dto.AuditSummary;
import com.auditor.backend.audit.dto.CreateAuditRequest;
import com.auditor.backend.audit.service.AuditExecutionWorker;
import com.auditor.backend.audit.service.AuditService;
import com.auditor.backend.user.entity.User;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/audits")
@Validated
public class AuditController {

    private final AuditService auditService;
    private final AuditExecutionWorker auditExecutionWorker;

    public AuditController(
            AuditService auditService,
            AuditExecutionWorker auditExecutionWorker) {

        this.auditService = auditService;
        this.auditExecutionWorker = auditExecutionWorker;
    }

    @PostMapping
    public ResponseEntity<AuditResponse> createAudit(
            @Valid @RequestBody CreateAuditRequest request,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        AuditResponse created =
                auditService.createAudit(request, user);

        auditExecutionWorker.execute(
                created.getId(),
                user
        );

        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<AuditSummary>> getAuditHistory(
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                auditService.getUserAudits(user)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuditResponse> getAudit(
            @PathVariable Long id,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                auditService.getUserAudit(id, user)
        );
    }

    @GetMapping("/{id}/status")
    public ResponseEntity<AuditStatusResponse> getAuditStatus(
            @PathVariable Long id,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                auditService.getAuditStatus(id, user)
        );
    }
}