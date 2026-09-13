package com.auditor.backend.audit.service;

import java.util.Optional;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.auditor.backend.audit.entity.Audit;
import com.auditor.backend.audit.entity.AuditJob;
import com.auditor.backend.audit.repository.AuditRepository;
import com.auditor.backend.user.entity.User;

@ExtendWith(MockitoExtension.class)
class AuditExecutionWorkerTest {

    @Mock
    private AuditService auditService;

    @Mock
    private AuditRepository auditRepository;

    @Mock
    private AuditJobService auditJobService;

    @Mock
    private User user;

    @InjectMocks
    private AuditExecutionWorker auditExecutionWorker;

    private Audit audit;
    private AuditJob job;

    @BeforeEach
    void setUp() {

        audit = new Audit();
        audit.setId(1L);
        audit.setStatus("PENDING");

        job = new AuditJob();
        job.setAudit(audit);
        job.setStatus("PENDING");
        job.setAttempts(0);
    }

    @Test
    void pendingAuditExecutesSuccessfully() {

        when(auditRepository.findByIdAndUser(1L, user))
                .thenReturn(Optional.of(audit));

        when(auditJobService.getJob(audit))
                .thenReturn(job);

        assertDoesNotThrow(
                () -> auditExecutionWorker.execute(1L, user)
        );

        verify(auditService)
                .executeAudit(1L, user);
    }

    @Test
    void completedAuditIsSkipped() {

        audit.setStatus("COMPLETED");

        when(auditRepository.findByIdAndUser(1L, user))
                .thenReturn(Optional.of(audit));

        assertDoesNotThrow(
                () -> auditExecutionWorker.execute(1L, user)
        );

        verify(auditService, never())
                .executeAudit(1L, user);
    }

    @Test
    void runningAuditIsSkipped() {

        audit.setStatus("RUNNING");

        when(auditRepository.findByIdAndUser(1L, user))
                .thenReturn(Optional.of(audit));

        assertDoesNotThrow(
                () -> auditExecutionWorker.execute(1L, user)
        );

        verify(auditService, never())
                .executeAudit(1L, user);
    }

    @Test
    void missingAuditIsSkipped() {

        when(auditRepository.findByIdAndUser(1L, user))
                .thenReturn(Optional.empty());

        assertDoesNotThrow(
                () -> auditExecutionWorker.execute(1L, user)
        );

        verify(auditService, never())
                .executeAudit(1L, user);
    }

    @Test
    void failedAuditRetriesWhenAttemptsRemain() {

        audit.setStatus("FAILED");

        job.setStatus("FAILED");
        job.setAttempts(1);

        when(auditRepository.findByIdAndUser(1L, user))
                .thenReturn(Optional.of(audit));

        when(auditJobService.getJob(audit))
                .thenReturn(job);

        when(auditJobService.canRetry(job))
                .thenReturn(true);

        assertDoesNotThrow(
                () -> auditExecutionWorker.execute(1L, user)
        );

        verify(auditService)
                .executeAudit(1L, user);
    }

    @Test
    void failedAuditIsSkippedAtMaximumAttempts() {

        audit.setStatus("FAILED");

        job.setStatus("FAILED");
        job.setAttempts(3);

        when(auditRepository.findByIdAndUser(1L, user))
                .thenReturn(Optional.of(audit));

        when(auditJobService.getJob(audit))
                .thenReturn(job);

        when(auditJobService.canRetry(job))
                .thenReturn(false);

        assertDoesNotThrow(
                () -> auditExecutionWorker.execute(1L, user)
        );

        verify(auditService, never())
                .executeAudit(1L, user);
    }

    @Test
    void nullAuditIdIsSkipped() {

        assertDoesNotThrow(
                () -> auditExecutionWorker.execute(null, user)
        );

        verify(auditRepository, never())
                .findByIdAndUser(
                        org.mockito.ArgumentMatchers.anyLong(),
                        org.mockito.ArgumentMatchers.any()
                );
    }

    @Test
    void nullUserIsSkipped() {

        assertDoesNotThrow(
                () -> auditExecutionWorker.execute(1L, null)
        );

        verify(auditRepository, never())
                .findByIdAndUser(
                        org.mockito.ArgumentMatchers.anyLong(),
                        org.mockito.ArgumentMatchers.any()
                );
    }

    @Test
    void duplicateExecutionForSameAuditIsPrevented()
            throws InterruptedException {

        when(auditRepository.findByIdAndUser(1L, user))
                .thenReturn(Optional.of(audit));

        when(auditJobService.getJob(audit))
                .thenReturn(job);

        CountDownLatch executionStarted =
                new CountDownLatch(1);

        CountDownLatch releaseExecution =
                new CountDownLatch(1);

        org.mockito.Mockito.doAnswer(invocation -> {

            executionStarted.countDown();

            releaseExecution.await(
                    5,
                    TimeUnit.SECONDS
            );

            return null;

        }).when(auditService).executeAudit(1L, user);

        Thread firstWorker = new Thread(
                () -> auditExecutionWorker.execute(1L, user)
        );

        firstWorker.start();

        executionStarted.await(
                5,
                TimeUnit.SECONDS
        );

        auditExecutionWorker.execute(1L, user);

        verify(auditService)
                .executeAudit(1L, user);

        releaseExecution.countDown();

        firstWorker.join(5000);
    }
}