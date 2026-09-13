package com.auditor.backend.scheduler;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.ArgumentCaptor;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.Mock;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;

import com.auditor.backend.audit.dto.AuditResponse;
import com.auditor.backend.audit.service.AuditExecutionWorker;
import com.auditor.backend.audit.service.AuditService;
import com.auditor.backend.notification.service.AuditNotificationService;
import com.auditor.backend.schedule.entity.AuditSchedule;
import com.auditor.backend.schedule.repository.AuditScheduleRepository;
import com.auditor.backend.user.entity.User;

class ScheduledAuditJobTest {

    @Mock
    private AuditScheduleRepository auditScheduleRepository;

    @Mock
    private AuditService auditService;

    @Mock
    private AuditExecutionWorker auditExecutionWorker;

    @Mock
    private AuditNotificationService auditNotificationService;

    private ScheduledAuditJob scheduledAuditJob;

    private User user;

    @BeforeEach
    void setUp() {

        MockitoAnnotations.openMocks(this);

        scheduledAuditJob = new ScheduledAuditJob(
                auditScheduleRepository,
                auditService,
                auditExecutionWorker,
                auditNotificationService
        );

        user = new User();
        user.setId(1L);
        user.setName("Test User");
        user.setEmail("test@example.com");
    }

    @Test
    void executeDueSchedulesProcessesDueActiveSchedule() {

        AuditSchedule schedule = createSchedule(
                "DAILY",
                LocalDateTime.now().minusMinutes(5)
        );

        AuditResponse createdAudit =
                org.mockito.Mockito.mock(AuditResponse.class);

        when(createdAudit.getId()).thenReturn(10L);

        when(auditScheduleRepository
                .findByActiveTrueAndNextRunAtLessThanEqual(
                        any(LocalDateTime.class)))
                .thenReturn(List.of(schedule));

        when(auditService.createAudit(
                any(),
                eq(user)
        )).thenReturn(createdAudit);

        scheduledAuditJob.executeDueSchedules();

        verify(auditService).createAudit(
                any(),
                eq(user)
        );

        verify(auditExecutionWorker).execute(
                10L,
                user
        );

        verify(auditNotificationService, never())
                .sendAuditCompletedEmail(
                        any(),
                        any(),
                        any(),
                        any(),
                        any()
                );

        verify(auditScheduleRepository).save(schedule);

        assertTrue(
                schedule.getNextRunAt()
                        .isAfter(LocalDateTime.now())
        );
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "DAILY",
            "WEEKLY",
            "MONTHLY"
    })
    void executeDueSchedulesAdvancesNextRunForSupportedFrequency(
            String frequency) {

        LocalDateTime originalRun =
                LocalDateTime.now().minusMinutes(5);

        AuditSchedule schedule =
                createSchedule(
                        frequency,
                        originalRun
                );

        AuditResponse createdAudit =
                org.mockito.Mockito.mock(AuditResponse.class);

        when(createdAudit.getId()).thenReturn(20L);

        when(auditScheduleRepository
                .findByActiveTrueAndNextRunAtLessThanEqual(
                        any(LocalDateTime.class)))
                .thenReturn(List.of(schedule));

        when(auditService.createAudit(
                any(),
                eq(user)
        )).thenReturn(createdAudit);

        scheduledAuditJob.executeDueSchedules();

        verify(auditExecutionWorker).execute(
                20L,
                user
        );

        ArgumentCaptor<AuditSchedule> scheduleCaptor =
                ArgumentCaptor.forClass(
                        AuditSchedule.class
                );

        verify(auditScheduleRepository)
                .save(scheduleCaptor.capture());

        AuditSchedule savedSchedule =
                scheduleCaptor.getValue();

        LocalDateTime nextRun =
                savedSchedule.getNextRunAt();

        if ("DAILY".equals(frequency)) {

            assertTrue(
                    nextRun.isAfter(
                            originalRun.plusDays(1)
                    )
                    || nextRun.isEqual(
                            originalRun.plusDays(1)
                    )
            );
        }

        if ("WEEKLY".equals(frequency)) {

            assertTrue(
                    nextRun.isAfter(
                            originalRun.plusWeeks(1)
                    )
                    || nextRun.isEqual(
                            originalRun.plusWeeks(1)
                    )
            );
        }

        if ("MONTHLY".equals(frequency)) {

            assertTrue(
                    nextRun.isAfter(
                            originalRun.plusMonths(1)
                    )
                    || nextRun.isEqual(
                            originalRun.plusMonths(1)
                    )
            );
        }
    }

    @Test
    void executeDueSchedulesSendsFailureNotificationWhenAuditCreationFails() {

        AuditSchedule schedule = createSchedule(
                "DAILY",
                LocalDateTime.now().minusMinutes(5)
        );

        when(auditScheduleRepository
                .findByActiveTrueAndNextRunAtLessThanEqual(
                        any(LocalDateTime.class)))
                .thenReturn(List.of(schedule));

        when(auditService.createAudit(
                any(),
                eq(user)
        )).thenThrow(
                new RuntimeException(
                        "Audit execution failed"
                )
        );

        scheduledAuditJob.executeDueSchedules();

        verify(auditService).createAudit(
                any(),
                eq(user)
        );

        verify(auditExecutionWorker, never())
                .execute(any(), any());

        verify(auditNotificationService)
                .sendAuditFailedEmail(
                        user,
                        "https://example.com",
                        "Audit execution failed"
                );

        verify(auditScheduleRepository)
                .save(schedule);

        assertTrue(
                schedule.getNextRunAt()
                        .isAfter(LocalDateTime.now())
        );
    }

    @Test
    void executeDueSchedulesContinuesWhenFailureEmailFails() {

        AuditSchedule schedule = createSchedule(
                "DAILY",
                LocalDateTime.now().minusMinutes(5)
        );

        when(auditScheduleRepository
                .findByActiveTrueAndNextRunAtLessThanEqual(
                        any(LocalDateTime.class)))
                .thenReturn(List.of(schedule));

        when(auditService.createAudit(
                any(),
                eq(user)
        )).thenThrow(
                new RuntimeException(
                        "Audit execution failed"
                )
        );

        doThrow(
                new RuntimeException(
                        "Mail server unavailable"
                )
        ).when(auditNotificationService)
                .sendAuditFailedEmail(
                        eq(user),
                        eq("https://example.com"),
                        eq("Audit execution failed")
                );

        scheduledAuditJob.executeDueSchedules();

        verify(auditNotificationService)
                .sendAuditFailedEmail(
                        user,
                        "https://example.com",
                        "Audit execution failed"
                );

        verify(auditExecutionWorker, never())
                .execute(any(), any());

        verify(auditScheduleRepository)
                .save(schedule);

        assertTrue(
                schedule.getNextRunAt()
                        .isAfter(LocalDateTime.now())
        );
    }

    @Test
    void executeDueSchedulesIgnoresWhenNoDueSchedulesExist() {

        when(auditScheduleRepository
                .findByActiveTrueAndNextRunAtLessThanEqual(
                        any(LocalDateTime.class)))
                .thenReturn(List.of());

        scheduledAuditJob.executeDueSchedules();

        verify(auditService, never())
                .createAudit(any(), any());

        verify(auditExecutionWorker, never())
                .execute(any(), any());

        verify(auditNotificationService, never())
                .sendAuditCompletedEmail(
                        any(),
                        any(),
                        any(),
                        any(),
                        any()
                );

        verify(auditNotificationService, never())
                .sendAuditFailedEmail(
                        any(),
                        any(),
                        any()
                );

        verify(auditScheduleRepository, never())
                .save(any(AuditSchedule.class));
    }

    private AuditSchedule createSchedule(
            String frequency,
            LocalDateTime nextRunAt) {

        AuditSchedule schedule =
                new AuditSchedule();

        schedule.setId(1L);
        schedule.setUser(user);
        schedule.setUrl("https://example.com");
        schedule.setDevice("desktop");
        schedule.setFrequency(frequency);
        schedule.setNextRunAt(nextRunAt);
        schedule.setActive(true);
        schedule.setCreatedAt(
                LocalDateTime.now().minusDays(1)
        );
        schedule.setUpdatedAt(
                LocalDateTime.now().minusDays(1)
        );

        return schedule;
    }
}