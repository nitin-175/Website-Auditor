package com.auditor.backend.audit.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.auditor.backend.audit.entity.Audit;
import com.auditor.backend.audit.entity.AuditIssue;

public interface AuditIssueRepository extends JpaRepository<AuditIssue, Long> {

    List<AuditIssue> findByAudit(Audit audit);

    List<AuditIssue> findByAuditOrderByIdAsc(Audit audit);

    long countByAudit(Audit audit);

    @Query("""
            SELECT ai.audit.id, COUNT(ai.id)
            FROM AuditIssue ai
            WHERE ai.audit.id IN :auditIds
            GROUP BY ai.audit.id
            """)
    List<Object[]> countByAuditIds(
            @Param("auditIds") List<Long> auditIds
    );
}