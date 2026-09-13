package com.auditor.backend.audit.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.auditor.backend.audit.entity.Audit;
import com.auditor.backend.audit.entity.AuditJob;
import com.auditor.backend.audit.repository.AuditJobRepository;

@Service
public class AuditJobService {

    private static final String STATUS_PENDING = "PENDING";
    private static final String STATUS_RUNNING = "RUNNING";
    private static final String STATUS_COMPLETED = "COMPLETED";
    private static final String STATUS_FAILED = "FAILED";

    private static final int MAX_ATTEMPTS = 3;

    private final AuditJobRepository auditJobRepository;

    public AuditJobService(AuditJobRepository auditJobRepository) {
        this.auditJobRepository = auditJobRepository;
    }

    @Transactional
    public AuditJob createJob(Audit audit) {

        AuditJob job = new AuditJob();

        job.setAudit(audit);
        job.setStatus(STATUS_PENDING);
        job.setAttempts(0);
        job.setStartedAt(null);
        job.setCompletedAt(null);
        job.setErrorMessage(null);

        LocalDateTime now = LocalDateTime.now();

        job.setCreatedAt(now);
        job.setUpdatedAt(now);

        return auditJobRepository.save(job);
    }

    @Transactional
    public AuditJob startJob(AuditJob job) {

        String currentStatus = normalizeStatus(job.getStatus());

        if (!STATUS_PENDING.equals(currentStatus)
                && !STATUS_FAILED.equals(currentStatus)) {

            throw new IllegalStateException(
                    "Job cannot be started from status: "
                            + job.getStatus()
            );
        }

        if (STATUS_FAILED.equals(currentStatus)
                && !canRetry(job)) {

            throw new IllegalStateException(
                    "Job has reached the maximum number of attempts"
            );
        }

        LocalDateTime now = LocalDateTime.now();

        job.setStatus(STATUS_RUNNING);
        job.setAttempts(job.getAttempts() + 1);
        job.setStartedAt(now);

        // Clear information from the previous execution.
        job.setCompletedAt(null);
        job.setErrorMessage(null);

        job.setUpdatedAt(now);

        return auditJobRepository.save(job);
    }

    @Transactional
    public AuditJob completeJob(AuditJob job) {

        String currentStatus = normalizeStatus(job.getStatus());

        if (!STATUS_RUNNING.equals(currentStatus)) {

            throw new IllegalStateException(
                    "Job cannot be completed from status: "
                            + job.getStatus()
            );
        }

        LocalDateTime now = LocalDateTime.now();

        job.setStatus(STATUS_COMPLETED);
        job.setCompletedAt(now);
        job.setUpdatedAt(now);

        return auditJobRepository.save(job);
    }

    @Transactional
    public AuditJob failJob(
            AuditJob job,
            String errorMessage) {

        String currentStatus = normalizeStatus(job.getStatus());

        if (!STATUS_RUNNING.equals(currentStatus)) {

            throw new IllegalStateException(
                    "Job cannot be failed from status: "
                            + job.getStatus()
            );
        }

        LocalDateTime now = LocalDateTime.now();

        job.setStatus(STATUS_FAILED);
        job.setErrorMessage(errorMessage);
        job.setCompletedAt(now);
        job.setUpdatedAt(now);

        return auditJobRepository.save(job);
    }

    @Transactional(readOnly = true)
    public AuditJob getJob(Audit audit) {

        return auditJobRepository.findByAudit(audit)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Audit job not found"
                        ));
    }

    public boolean canRetry(AuditJob job) {

        if (job == null) {
            return false;
        }

        String status = normalizeStatus(job.getStatus());

        return STATUS_FAILED.equals(status)
                && job.getAttempts() < MAX_ATTEMPTS;
    }

    public boolean hasReachedMaxAttempts(AuditJob job) {

        if (job == null) {
            return false;
        }

        return job.getAttempts() >= MAX_ATTEMPTS;
    }

    public int getMaxAttempts() {
        return MAX_ATTEMPTS;
    }

    private String normalizeStatus(String status) {

        if (status == null) {
            throw new IllegalStateException(
                    "Job status cannot be null"
            );
        }

        return status.trim().toUpperCase();
    }
}