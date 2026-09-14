package com.auditor.backend.scheduler;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.auditor.backend.audit.entity.Audit;
import com.auditor.backend.audit.entity.AuditJob;
import com.auditor.backend.audit.repository.AuditJobRepository;
import com.auditor.backend.audit.service.AuditJobService;

@Component
public class CleanupJob {

    private static final Logger logger =
            LoggerFactory.getLogger(CleanupJob.class);

    private static final String STATUS_RUNNING = "RUNNING";
    private static final String STATUS_FAILED = "FAILED";

    private static final String STALE_JOB_ERROR =
            "Audit execution timed out and was recovered by the cleanup job";

    private final AuditJobRepository auditJobRepository;
    private final AuditJobService auditJobService;

    @Value("${audit.job.stale-timeout-minutes:10}")
    private long staleTimeoutMinutes;

    public CleanupJob(
            AuditJobRepository auditJobRepository,
            AuditJobService auditJobService) {

        this.auditJobRepository = auditJobRepository;
        this.auditJobService = auditJobService;
    }

    @Scheduled(fixedDelay = 300000)
    public void recoverStaleJobs() {
        LocalDateTime cutoff =
                LocalDateTime.now().minusMinutes(staleTimeoutMinutes);

        List<AuditJob> staleJobs =
                auditJobRepository.findStaleRunningJobs(cutoff);

        if (staleJobs.isEmpty()) {
            return;
        }

        logger.warn(
                "Found {} stale audit job(s) older than {} minutes",
                staleJobs.size(),
                staleTimeoutMinutes
        );

        for (AuditJob job : staleJobs) {
            recoverStaleJob(job);
        }
    }

    @Transactional
    protected void recoverStaleJob(AuditJob job) {
        try {
            if (!STATUS_RUNNING.equalsIgnoreCase(job.getStatus())) {
                return;
            }

            Audit audit = job.getAudit();

            auditJobService.failJob(
                    job,
                    STALE_JOB_ERROR
            );

            if (audit != null
                    && STATUS_RUNNING.equalsIgnoreCase(audit.getStatus())) {

                LocalDateTime now = LocalDateTime.now();

                audit.setStatus(STATUS_FAILED);
                audit.setCompletedAt(now);
                audit.setUpdatedAt(now);
            }

            logger.warn(
                    "Recovered stale audit job {} for audit {} after {} minutes",
                    job.getId(),
                    audit != null ? audit.getId() : null,
                    staleTimeoutMinutes
            );

        } catch (Exception exception) {
            logger.error(
                    "Failed to recover stale audit job {}",
                    job.getId(),
                    exception
            );
        }
    }
}