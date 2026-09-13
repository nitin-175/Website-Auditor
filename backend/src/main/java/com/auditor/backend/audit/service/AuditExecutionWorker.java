package com.auditor.backend.audit.service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.locks.ReentrantLock;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.auditor.backend.audit.entity.Audit;
import com.auditor.backend.audit.entity.AuditJob;
import com.auditor.backend.audit.repository.AuditRepository;
import com.auditor.backend.user.entity.User;

@Service
public class AuditExecutionWorker {

    private static final Logger logger =
            LoggerFactory.getLogger(AuditExecutionWorker.class);

    private final AuditService auditService;
    private final AuditRepository auditRepository;
    private final AuditJobService auditJobService;

    /*
     * One lock per audit ID.
     *
     * This prevents two worker tasks from executing
     * the same audit at the same time while still
     * allowing different audits to execute concurrently.
     */
    private final ConcurrentMap<Long, ReentrantLock> auditLocks =
            new ConcurrentHashMap<>();

    public AuditExecutionWorker(
            AuditService auditService,
            AuditRepository auditRepository,
            AuditJobService auditJobService) {

        this.auditService = auditService;
        this.auditRepository = auditRepository;
        this.auditJobService = auditJobService;
    }

    @Async("auditTaskExecutor")
    public void execute(
            Long auditId,
            User user) {

        if (auditId == null || user == null) {

            logger.warn(
                    "Background audit skipped because audit ID "
                            + "or user was null"
            );

            return;
        }

        ReentrantLock lock = auditLocks.computeIfAbsent(
                auditId,
                id -> new ReentrantLock()
        );

        /*
         * Do not wait for another worker processing
         * the same audit.
         */
        if (!lock.tryLock()) {

            logger.info(
                    "Background audit skipped for audit {} "
                            + "because it is already being processed",
                    auditId
            );

            return;
        }

        try {

            executeLocked(auditId, user);

        } finally {

            lock.unlock();

            /*
             * Remove the lock when nobody is waiting for it.
             * This prevents the map from growing indefinitely.
             */
            if (!lock.hasQueuedThreads()
                    && !lock.isLocked()) {

                auditLocks.remove(auditId, lock);
            }
        }
    }

    private void executeLocked(
            Long auditId,
            User user) {

        try {

            Audit audit = auditRepository
                    .findByIdAndUser(auditId, user)
                    .orElse(null);

            if (audit == null) {

                logger.warn(
                        "Background audit skipped because audit "
                                + "{} was not found",
                        auditId
                );

                return;
            }

            AuditJob job = auditJobService.getJob(audit);

            String status = audit.getStatus();

            if (!"PENDING".equalsIgnoreCase(status)
                    && !"FAILED".equalsIgnoreCase(status)) {

                logger.info(
                        "Background audit skipped for audit {} "
                                + "because its status is {}",
                        auditId,
                        status
                );

                return;
            }

            if ("FAILED".equalsIgnoreCase(status)
                    && !auditJobService.canRetry(job)) {

                logger.warn(
                        "Background audit stopped for audit {} "
                                + "because the maximum number of "
                                + "attempts was reached",
                        auditId
                );

                return;
            }

            int maxAttempts =
                    auditJobService.getMaxAttempts();

            logger.info(
                    "Background audit worker started for audit {} "
                            + "with maximum {} attempts",
                    auditId,
                    maxAttempts
            );

            while (true) {

                try {

                    auditService.executeAudit(
                            auditId,
                            user
                    );

                    logger.info(
                            "Background audit completed successfully "
                                    + "for audit {}",
                            auditId
                    );

                    return;

                } catch (Exception exception) {

                    logger.error(
                            "Background audit execution failed "
                                    + "for audit {}: {}",
                            auditId,
                            exception.getMessage()
                    );

                    Audit latestAudit = auditRepository
                            .findByIdAndUser(
                                    auditId,
                                    user
                            )
                            .orElse(null);

                    if (latestAudit == null) {

                        logger.error(
                                "Background audit recovery stopped "
                                        + "because audit {} could no "
                                        + "longer be found",
                                auditId
                        );

                        return;
                    }

                    AuditJob latestJob =
                            auditJobService.getJob(latestAudit);

                    if (!auditJobService.canRetry(latestJob)) {

                        logger.error(
                                "Background audit permanently failed "
                                        + "for audit {} after {} attempt(s)",
                                auditId,
                                latestJob.getAttempts()
                        );

                        return;
                    }

                    logger.warn(
                            "Retrying background audit {}. "
                                    + "Attempt {} of {}",
                            auditId,
                            latestJob.getAttempts() + 1,
                            maxAttempts
                    );
                }
            }

        } catch (Exception exception) {

            logger.error(
                    "Background audit recovery failed for audit {}",
                    auditId,
                    exception
            );
        }
    }
}