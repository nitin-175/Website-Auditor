package com.auditor.backend.schedule.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.auditor.backend.schedule.entity.AuditSchedule;
import com.auditor.backend.user.entity.User;

public interface AuditScheduleRepository
        extends JpaRepository<AuditSchedule, Long> {

    List<AuditSchedule> findByUserOrderByCreatedAtDesc(
            User user
    );

    Optional<AuditSchedule> findByIdAndUser(
            Long id,
            User user
    );

    List<AuditSchedule> findByActiveTrueAndNextRunAtLessThanEqual(
            LocalDateTime dateTime
    );
}