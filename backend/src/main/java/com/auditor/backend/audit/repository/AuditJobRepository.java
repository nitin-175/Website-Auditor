package com.auditor.backend.audit.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.auditor.backend.audit.entity.Audit;
import com.auditor.backend.audit.entity.AuditJob;

public interface AuditJobRepository extends JpaRepository<AuditJob, Long> {

    Optional<AuditJob> findByAudit(Audit audit);

}