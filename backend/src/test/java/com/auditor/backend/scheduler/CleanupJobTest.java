package com.auditor.backend.scheduler;

import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.auditor.backend.audit.entity.Audit;
import com.auditor.backend.audit.entity.AuditJob;
import com.auditor.backend.audit.repository.AuditJobRepository;
import com.auditor.backend.audit.service.AuditJobService;

@ExtendWith(MockitoExtension.class)
class CleanupJobTest {

    @Mock
    private AuditJobRepository auditJobRepository;

    @Mock
    private AuditJobService auditJobService;

    @InjectMocks
    private CleanupJob cleanupJob;

    @BeforeEach
    void setUp() {
        cleanupJob = new CleanupJob(
                auditJobRepository,
                auditJobService
        );
    }

    @Test
    void recoverStaleJobsRecoversStaleRunningJob() {
        Audit audit = createAudit("RUNNING");

        AuditJob job = createJob(
                audit,
                "RUNNING",
                LocalDateTime.now().minusMinutes(20)
        );

        when(auditJobRepository.findStaleRunningJobs(any(LocalDateTime.class)))
                .thenReturn(List.of(job));

        when(auditJobService.failJob(
                eq(job),
                anyString()
        )).thenAnswer(invocation -> {
            job.setStatus("FAILED");
            return job;
        });

        cleanupJob.recoverStaleJobs();

        verify(auditJobRepository)
                .findStaleRunningJobs(any(LocalDateTime.class));

        verify(auditJobService)
                .failJob(
                        eq(job),
                        eq("Audit execution timed out and was recovered by the cleanup job")
                );

        org.junit.jupiter.api.Assertions.assertEquals(
                "FAILED",
                audit.getStatus()
        );
    }

    @Test
    void recoverStaleJobsDoesNothingWhenNoStaleJobsExist() {
        when(auditJobRepository.findStaleRunningJobs(any(LocalDateTime.class)))
                .thenReturn(List.of());

        cleanupJob.recoverStaleJobs();

        verify(auditJobRepository)
                .findStaleRunningJobs(any(LocalDateTime.class));

        verifyNoInteractions(auditJobService);
    }

    @Test
    void recoverStaleJobsProcessesMultipleJobs() {
        Audit auditOne = createAudit("RUNNING");
        Audit auditTwo = createAudit("RUNNING");

        AuditJob jobOne = createJob(
                auditOne,
                "RUNNING",
                LocalDateTime.now().minusMinutes(20)
        );

        AuditJob jobTwo = createJob(
                auditTwo,
                "RUNNING",
                LocalDateTime.now().minusMinutes(30)
        );

        when(auditJobRepository.findStaleRunningJobs(any(LocalDateTime.class)))
                .thenReturn(List.of(jobOne, jobTwo));

        when(auditJobService.failJob(
                any(AuditJob.class),
                anyString()
        )).thenAnswer(invocation -> {
            AuditJob job = invocation.getArgument(0);
            job.setStatus("FAILED");
            return job;
        });

        cleanupJob.recoverStaleJobs();

        verify(auditJobService)
                .failJob(
                        eq(jobOne),
                        anyString()
                );

        verify(auditJobService)
                .failJob(
                        eq(jobTwo),
                        anyString()
                );

        org.junit.jupiter.api.Assertions.assertEquals(
                "FAILED",
                auditOne.getStatus()
        );

        org.junit.jupiter.api.Assertions.assertEquals(
                "FAILED",
                auditTwo.getStatus()
        );
    }

    @Test
    void recoverStaleJobsContinuesWhenOneJobFails() {
        Audit auditOne = createAudit("RUNNING");
        Audit auditTwo = createAudit("RUNNING");

        AuditJob jobOne = createJob(
                auditOne,
                "RUNNING",
                LocalDateTime.now().minusMinutes(20)
        );

        AuditJob jobTwo = createJob(
                auditTwo,
                "RUNNING",
                LocalDateTime.now().minusMinutes(20)
        );

        when(auditJobRepository.findStaleRunningJobs(any(LocalDateTime.class)))
                .thenReturn(List.of(jobOne, jobTwo));

        when(auditJobService.failJob(
                eq(jobOne),
                anyString()
        )).thenThrow(new RuntimeException("Recovery failure"));

        when(auditJobService.failJob(
                eq(jobTwo),
                anyString()
        )).thenAnswer(invocation -> {
            jobTwo.setStatus("FAILED");
            return jobTwo;
        });

        cleanupJob.recoverStaleJobs();

        verify(auditJobService)
                .failJob(eq(jobOne), anyString());

        verify(auditJobService)
                .failJob(eq(jobTwo), anyString());

        org.junit.jupiter.api.Assertions.assertEquals(
                "RUNNING",
                auditOne.getStatus()
        );

        org.junit.jupiter.api.Assertions.assertEquals(
                "FAILED",
                auditTwo.getStatus()
        );
    }

    @Test
    void recoverStaleJobIgnoresNonRunningJob() {
        Audit audit = createAudit("COMPLETED");

        AuditJob job = createJob(
                audit,
                "COMPLETED",
                LocalDateTime.now().minusMinutes(20)
        );

        cleanupJob.recoverStaleJob(job);

        verifyNoInteractions(auditJobService);
    }

    private Audit createAudit(String status) {
        Audit audit = new Audit();
        audit.setId(1L);
        audit.setStatus(status);
        audit.setUpdatedAt(LocalDateTime.now());
        return audit;
    }

    private AuditJob createJob(
            Audit audit,
            String status,
            LocalDateTime startedAt) {

        AuditJob job = new AuditJob();

        job.setId(1L);
        job.setAudit(audit);
        job.setStatus(status);
        job.setAttempts(1);
        job.setStartedAt(startedAt);
        job.setCreatedAt(startedAt);
        job.setUpdatedAt(startedAt);

        return job;
    }
}
