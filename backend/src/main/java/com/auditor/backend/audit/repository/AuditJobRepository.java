package com.auditor.backend.audit.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.auditor.backend.audit.entity.Audit;
import com.auditor.backend.audit.entity.AuditJob;

public interface AuditJobRepository extends JpaRepository<AuditJob, Long> {

    Optional<AuditJob> findByAudit(Audit audit);

    @Query("""
            SELECT job
            FROM AuditJob job
            WHERE UPPER(job.status) = 'RUNNING'
              AND job.startedAt <= :cutoff
            """)
    List<AuditJob> findStaleRunningJobs(
            @Param("cutoff") LocalDateTime cutoff
    );
}