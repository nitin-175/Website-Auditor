package com.auditor.backend.schedule.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.auditor.backend.schedule.dto.AuditScheduleRequest;
import com.auditor.backend.schedule.dto.AuditScheduleResponse;
import com.auditor.backend.schedule.service.AuditScheduleService;
import com.auditor.backend.user.entity.User;

import jakarta.validation.Valid;

import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/v1/schedules")
@Validated
public class AuditScheduleController {

    private final AuditScheduleService auditScheduleService;

    public AuditScheduleController(
            AuditScheduleService auditScheduleService) {

        this.auditScheduleService = auditScheduleService;
    }

    @PostMapping
    public ResponseEntity<AuditScheduleResponse> createSchedule(
            @Valid @RequestBody AuditScheduleRequest request,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        AuditScheduleResponse response =
                auditScheduleService.createSchedule(
                        request,
                        user
                );

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<AuditScheduleResponse>> getSchedules(
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                auditScheduleService.getUserSchedules(user)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuditScheduleResponse> getSchedule(
            @PathVariable Long id,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                auditScheduleService.getSchedule(id, user)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<AuditScheduleResponse> updateSchedule(
            @PathVariable Long id,
            @Valid @RequestBody AuditScheduleRequest request,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                auditScheduleService.updateSchedule(
                        id,
                        request,
                        user
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSchedule(
            @PathVariable Long id,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        auditScheduleService.deleteSchedule(id, user);

        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<AuditScheduleResponse> toggleSchedule(
            @PathVariable Long id,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                auditScheduleService.toggleSchedule(id, user)
        );
    }
}