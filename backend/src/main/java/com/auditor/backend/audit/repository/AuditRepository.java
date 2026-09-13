package com.auditor.backend.audit.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.auditor.backend.audit.entity.Audit;
import com.auditor.backend.user.entity.User;

public interface AuditRepository extends JpaRepository<Audit, Long> {

    List<Audit> findByUserOrderByCreatedAtDesc(User user);

    Optional<Audit> findByIdAndUser(Long id, User user);

}