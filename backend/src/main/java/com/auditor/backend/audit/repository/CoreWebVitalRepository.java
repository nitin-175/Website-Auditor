package com.auditor.backend.audit.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.auditor.backend.audit.entity.Audit;
import com.auditor.backend.audit.entity.CoreWebVital;

public interface CoreWebVitalRepository extends JpaRepository<CoreWebVital, Long> {

    Optional<CoreWebVital> findByAudit(Audit audit);

}