package com.auditor.backend.scheduler;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.auditor.backend.audit.dto.AuditResponse;
import com.auditor.backend.audit.dto.CreateAuditRequest;
import com.auditor.backend.audit.service.AuditExecutionWorker;
import com.auditor.backend.audit.service.AuditService;
import com.auditor.backend.notification.service.AuditNotificationService;
import com.auditor.backend.schedule.entity.AuditSchedule;
import com.auditor.backend.schedule.repository.AuditScheduleRepository;

@Component
public class ScheduledAuditJob {

    private static final Logger logger =
            LoggerFactory.getLogger(ScheduledAuditJob.class);

    private final AuditScheduleRepository auditScheduleRepository;
    private final AuditService auditService;
    private final AuditExecutionWorker auditExecutionWorker;
    private final AuditNotificationService auditNotificationService;

    public ScheduledAuditJob(
            AuditScheduleRepository auditScheduleRepository,
            AuditService auditService,
            AuditExecutionWorker auditExecutionWorker,
            AuditNotificationService auditNotificationService) {

        this.auditScheduleRepository = auditScheduleRepository;
        this.auditService = auditService;
        this.auditExecutionWorker = auditExecutionWorker;
        this.auditNotificationService = auditNotificationService;
    }

    @Scheduled(fixedDelay = 60000)
    public void executeDueSchedules() {

        LocalDateTime now = LocalDateTime.now();

        List<AuditSchedule> schedules =
                auditScheduleRepository
                        .findByActiveTrueAndNextRunAtLessThanEqual(now);

        for (AuditSchedule schedule : schedules) {
            executeSchedule(schedule);
        }
    }

    private void executeSchedule(AuditSchedule schedule) {

        try {
            CreateAuditRequest request =
                    new CreateAuditRequest();

            request.setUrl(schedule.getUrl());
            request.setDevice(schedule.getDevice());

            AuditResponse createdAudit =
                    auditService.createAudit(
                            request,
                            schedule.getUser()
                    );

            /*
             * Submit the audit to the background worker.
             * The scheduler does not wait for Lighthouse.
             */
            auditExecutionWorker.execute(
                    createdAudit.getId(),
                    schedule.getUser()
            );

            /*
             * Move the schedule forward immediately so the same
             * schedule cannot be picked up again on the next tick.
             */
            schedule.setNextRunAt(
                    calculateNextRun(
                            schedule.getNextRunAt(),
                            schedule.getFrequency()
                    )
            );

            schedule.setUpdatedAt(
                    LocalDateTime.now()
            );

            auditScheduleRepository.save(schedule);

            logger.info(
                    "Scheduled audit queued successfully for schedule {}",
                    schedule.getId()
            );

        } catch (Exception exception) {

            logger.error(
                    "Scheduled audit failed for schedule {}: {}",
                    schedule.getId(),
                    exception.getMessage(),
                    exception
            );

            try {
                auditNotificationService.sendAuditFailedEmail(
                        schedule.getUser(),
                        schedule.getUrl(),
                        exception.getMessage()
                );
            } catch (Exception mailException) {

                logger.error(
                        "Failed to send audit failure email for schedule {}",
                        schedule.getId(),
                        mailException
                );
            }

            /*
             * Always advance the schedule after a scheduler-level
             * failure so the same failed schedule is not retried
             * every 60 seconds.
             */
            try {
                schedule.setNextRunAt(
                        calculateNextRun(
                                schedule.getNextRunAt(),
                                schedule.getFrequency()
                        )
                );

                schedule.setUpdatedAt(
                        LocalDateTime.now()
                );

                auditScheduleRepository.save(schedule);

            } catch (Exception scheduleException) {

                logger.error(
                        "Failed to update next run for schedule {}",
                        schedule.getId(),
                        scheduleException
                );
            }
        }
    }

    private LocalDateTime calculateNextRun(
            LocalDateTime currentRun,
            String frequency) {

        LocalDateTime nextRun;

        switch (frequency) {

            case "DAILY":
                nextRun = currentRun.plusDays(1);
                break;

            case "WEEKLY":
                nextRun = currentRun.plusWeeks(1);
                break;

            case "MONTHLY":
                nextRun = currentRun.plusMonths(1);
                break;

            default:
                throw new IllegalArgumentException(
                        "Unsupported schedule frequency: "
                                + frequency
                );
        }

        LocalDateTime now = LocalDateTime.now();

        /*
         * If the application was down for multiple schedule periods,
         * skip directly to the next future occurrence rather than
         * executing every missed occurrence.
         */
        while (!nextRun.isAfter(now)) {

            switch (frequency) {

                case "DAILY":
                    nextRun = nextRun.plusDays(1);
                    break;

                case "WEEKLY":
                    nextRun = nextRun.plusWeeks(1);
                    break;

                case "MONTHLY":
                    nextRun = nextRun.plusMonths(1);
                    break;

                default:
                    throw new IllegalArgumentException(
                            "Unsupported schedule frequency: "
                                    + frequency
                    );
            }
        }

        return nextRun;
    }
}