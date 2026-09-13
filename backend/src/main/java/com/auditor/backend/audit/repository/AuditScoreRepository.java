package com.auditor.backend.audit.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.auditor.backend.audit.entity.Audit;
import com.auditor.backend.audit.entity.AuditScore;

public interface AuditScoreRepository extends JpaRepository<AuditScore, Long> {

    Optional<AuditScore> findByAudit(Audit audit);
}