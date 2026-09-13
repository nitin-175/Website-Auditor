package com.auditor.backend.audit.service;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.auditor.backend.audit.entity.Audit;
import com.auditor.backend.audit.entity.AuditJob;
import com.auditor.backend.audit.repository.AuditJobRepository;

@ExtendWith(MockitoExtension.class)
class AuditJobServiceTest {

    @Mock
    private AuditJobRepository auditJobRepository;

    @InjectMocks
    private AuditJobService auditJobService;

    private Audit audit;

    @BeforeEach
    void setUp() {

        audit = new Audit();
        audit.setId(1L);
    }

    @Test
    void createJobCreatesPendingJob() {

        when(auditJobRepository.save(
                org.mockito.ArgumentMatchers.any(AuditJob.class)))
                .thenAnswer(invocation ->
                        invocation.getArgument(0));

        AuditJob result =
                auditJobService.createJob(audit);

        assertNotNull(result);
        assertEquals(audit, result.getAudit());
        assertEquals("PENDING", result.getStatus());
        assertEquals(0, result.getAttempts());
        assertNull(result.getStartedAt());
        assertNull(result.getCompletedAt());
        assertNull(result.getErrorMessage());
        assertNotNull(result.getCreatedAt());
        assertNotNull(result.getUpdatedAt());

        verify(auditJobRepository).save(result);
    }

    @Test
    void startJobAllowsPendingJob() {

        AuditJob job = createJob("PENDING", 0);

        when(auditJobRepository.save(job))
                .thenReturn(job);

        AuditJob result =
                auditJobService.startJob(job);

        assertEquals("RUNNING", result.getStatus());
        assertEquals(1, result.getAttempts());
        assertNotNull(result.getStartedAt());
        assertNull(result.getCompletedAt());
        assertNull(result.getErrorMessage());

        verify(auditJobRepository).save(job);
    }

    @Test
    void startJobAllowsFailedJobAsRetry() {

        AuditJob job = createJob("FAILED", 1);

        job.setCompletedAt(LocalDateTime.now());
        job.setErrorMessage("Previous execution failed");

        when(auditJobRepository.save(job))
                .thenReturn(job);

        AuditJob result =
                auditJobService.startJob(job);

        assertEquals("RUNNING", result.getStatus());
        assertEquals(2, result.getAttempts());
        assertNotNull(result.getStartedAt());

        assertNull(result.getCompletedAt());
        assertNull(result.getErrorMessage());

        verify(auditJobRepository).save(job);
    }

    @Test
    void startJobRejectsFailedJobAtMaximumAttempts() {

        AuditJob job = createJob("FAILED", 3);

        assertThrows(
                IllegalStateException.class,
                () -> auditJobService.startJob(job)
        );
    }

    @Test
    void startJobRejectsRunningJob() {

        AuditJob job = createJob("RUNNING", 1);

        assertThrows(
                IllegalStateException.class,
                () -> auditJobService.startJob(job)
        );
    }

    @Test
    void startJobRejectsCompletedJob() {

        AuditJob job = createJob("COMPLETED", 1);

        assertThrows(
                IllegalStateException.class,
                () -> auditJobService.startJob(job)
        );
    }

    @Test
    void completeJobCompletesRunningJob() {

        AuditJob job = createJob("RUNNING", 1);

        when(auditJobRepository.save(job))
                .thenReturn(job);

        AuditJob result =
                auditJobService.completeJob(job);

        assertEquals("COMPLETED", result.getStatus());
        assertNotNull(result.getCompletedAt());
        assertNotNull(result.getUpdatedAt());

        verify(auditJobRepository).save(job);
    }

    @Test
    void completeJobRejectsPendingJob() {

        AuditJob job = createJob("PENDING", 0);

        assertThrows(
                IllegalStateException.class,
                () -> auditJobService.completeJob(job)
        );
    }

    @Test
    void completeJobRejectsFailedJob() {

        AuditJob job = createJob("FAILED", 1);

        assertThrows(
                IllegalStateException.class,
                () -> auditJobService.completeJob(job)
        );
    }

    @Test
    void failJobFailsRunningJob() {

        AuditJob job = createJob("RUNNING", 1);

        when(auditJobRepository.save(job))
                .thenReturn(job);

        AuditJob result =
                auditJobService.failJob(
                        job,
                        "Lighthouse execution failed"
                );

        assertEquals("FAILED", result.getStatus());
        assertEquals(
                "Lighthouse execution failed",
                result.getErrorMessage()
        );
        assertNotNull(result.getCompletedAt());
        assertNotNull(result.getUpdatedAt());

        verify(auditJobRepository).save(job);
    }

    @Test
    void failJobRejectsPendingJob() {

        AuditJob job = createJob("PENDING", 0);

        assertThrows(
                IllegalStateException.class,
                () -> auditJobService.failJob(
                        job,
                        "Execution failed"
                )
        );
    }

    @Test
    void failJobRejectsCompletedJob() {

        AuditJob job = createJob("COMPLETED", 1);

        assertThrows(
                IllegalStateException.class,
                () -> auditJobService.failJob(
                        job,
                        "Execution failed"
                )
        );
    }

    @Test
    void canRetryReturnsTrueForFailedJobBelowMaximum() {

        AuditJob job = createJob("FAILED", 1);

        assertTrue(
                auditJobService.canRetry(job)
        );
    }

    @Test
    void canRetryReturnsTrueForSecondFailedAttempt() {

        AuditJob job = createJob("FAILED", 2);

        assertTrue(
                auditJobService.canRetry(job)
        );
    }

    @Test
    void canRetryReturnsFalseAtMaximumAttempts() {

        AuditJob job = createJob("FAILED", 3);

        assertFalse(
                auditJobService.canRetry(job)
        );
    }

    @Test
    void canRetryReturnsFalseForPendingJob() {

        AuditJob job = createJob("PENDING", 0);

        assertFalse(
                auditJobService.canRetry(job)
        );
    }

    @Test
    void canRetryReturnsFalseForCompletedJob() {

        AuditJob job = createJob("COMPLETED", 1);

        assertFalse(
                auditJobService.canRetry(job)
        );
    }

    @Test
    void hasReachedMaxAttemptsReturnsTrueAtMaximum() {

        AuditJob job = createJob("FAILED", 3);

        assertTrue(
                auditJobService.hasReachedMaxAttempts(job)
        );
    }

    @Test
    void hasReachedMaxAttemptsReturnsFalseBelowMaximum() {

        AuditJob job = createJob("FAILED", 2);

        assertFalse(
                auditJobService.hasReachedMaxAttempts(job)
        );
    }

    @Test
    void getMaxAttemptsReturnsThree() {

        assertEquals(
                3,
                auditJobService.getMaxAttempts()
        );
    }

    @Test
    void getJobReturnsExistingJob() {

        AuditJob job = createJob("PENDING", 0);

        when(auditJobRepository.findByAudit(audit))
                .thenReturn(Optional.of(job));

        AuditJob result =
                auditJobService.getJob(audit);

        assertEquals(job, result);

        verify(auditJobRepository)
                .findByAudit(audit);
    }

    @Test
    void getJobThrowsWhenJobDoesNotExist() {

        when(auditJobRepository.findByAudit(audit))
                .thenReturn(Optional.empty());

        assertThrows(
                IllegalArgumentException.class,
                () -> auditJobService.getJob(audit)
        );
    }

    @Test
    void startJobRejectsNullStatus() {

        AuditJob job = createJob(null, 0);

        assertThrows(
                IllegalStateException.class,
                () -> auditJobService.startJob(job)
        );
    }

    private AuditJob createJob(
            String status,
            int attempts) {

        AuditJob job = new AuditJob();

        job.setAudit(audit);
        job.setStatus(status);
        job.setAttempts(attempts);

        return job;
    }
}