package com.auditor.backend.schedule.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.auditor.backend.exception.ResourceNotFoundException;
import com.auditor.backend.schedule.dto.AuditScheduleRequest;
import com.auditor.backend.schedule.dto.AuditScheduleResponse;
import com.auditor.backend.schedule.entity.AuditSchedule;
import com.auditor.backend.schedule.repository.AuditScheduleRepository;
import com.auditor.backend.user.entity.User;

@Service
public class AuditScheduleService {

    private final AuditScheduleRepository auditScheduleRepository;

    public AuditScheduleService(
            AuditScheduleRepository auditScheduleRepository) {

        this.auditScheduleRepository = auditScheduleRepository;
    }

    @Transactional
    public AuditScheduleResponse createSchedule(
            AuditScheduleRequest request,
            User user) {

        LocalDateTime now = LocalDateTime.now();

        AuditSchedule schedule = new AuditSchedule();

        schedule.setUser(user);
        schedule.setUrl(request.getUrl().trim());
        schedule.setDevice(request.getDevice().toLowerCase());
        schedule.setFrequency(request.getFrequency().toUpperCase());
        schedule.setNextRunAt(request.getNextRunAt());
        schedule.setActive(true);
        schedule.setCreatedAt(now);
        schedule.setUpdatedAt(now);

        AuditSchedule savedSchedule
                = auditScheduleRepository.save(schedule);

        return toResponse(savedSchedule);
    }

    @Transactional(readOnly = true)
    public List<AuditScheduleResponse> getUserSchedules(
            User user) {

        return auditScheduleRepository
                .findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AuditScheduleResponse getSchedule(
            Long id,
            User user) {

        AuditSchedule schedule
                = auditScheduleRepository
                        .findByIdAndUser(id, user)
                        .orElseThrow(()
                                -> new ResourceNotFoundException(
                                "Schedule not found"
                        ));

        return toResponse(schedule);
    }

    @Transactional
    public AuditScheduleResponse updateSchedule(
            Long id,
            AuditScheduleRequest request,
            User user) {

        AuditSchedule schedule
                = auditScheduleRepository
                        .findByIdAndUser(id, user)
                        .orElseThrow(()
                                -> new ResourceNotFoundException(
                                "Schedule not found"
                        ));

        schedule.setUrl(request.getUrl().trim());
        schedule.setDevice(request.getDevice().toLowerCase());
        schedule.setFrequency(request.getFrequency().toUpperCase());
        schedule.setNextRunAt(request.getNextRunAt());
        schedule.setUpdatedAt(LocalDateTime.now());

        AuditSchedule updatedSchedule
                = auditScheduleRepository.save(schedule);

        return toResponse(updatedSchedule);
    }

    @Transactional
    public void deleteSchedule(
            Long id,
            User user) {

        AuditSchedule schedule
                = auditScheduleRepository
                        .findByIdAndUser(id, user)
                        .orElseThrow(()
                                -> new ResourceNotFoundException(
                                "Schedule not found"
                        ));

        auditScheduleRepository.delete(schedule);
    }

    @Transactional
    public AuditScheduleResponse toggleSchedule(
            Long id,
            User user) {

        AuditSchedule schedule
                = auditScheduleRepository
                        .findByIdAndUser(id, user)
                        .orElseThrow(()
                                -> new ResourceNotFoundException(
                                "Schedule not found"
                        ));

        schedule.setActive(!Boolean.TRUE.equals(
                schedule.getActive()
        ));

        schedule.setUpdatedAt(LocalDateTime.now());

        AuditSchedule updatedSchedule
                = auditScheduleRepository.save(schedule);

        return toResponse(updatedSchedule);
    }

    private AuditScheduleResponse toResponse(
            AuditSchedule schedule) {

        return new AuditScheduleResponse(
                schedule.getId(),
                schedule.getUrl(),
                schedule.getDevice(),
                schedule.getFrequency(),
                schedule.getNextRunAt(),
                schedule.getActive(),
                schedule.getCreatedAt(),
                schedule.getUpdatedAt()
        );
    }
}
