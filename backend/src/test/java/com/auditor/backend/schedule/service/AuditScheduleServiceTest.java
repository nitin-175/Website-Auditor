package com.auditor.backend.schedule.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.auditor.backend.exception.ResourceNotFoundException;
import com.auditor.backend.schedule.dto.AuditScheduleRequest;
import com.auditor.backend.schedule.dto.AuditScheduleResponse;
import com.auditor.backend.schedule.entity.AuditSchedule;
import com.auditor.backend.schedule.repository.AuditScheduleRepository;
import com.auditor.backend.user.entity.User;

@ExtendWith(MockitoExtension.class)
class AuditScheduleServiceTest {

    @Mock
    private AuditScheduleRepository auditScheduleRepository;

    @InjectMocks
    private AuditScheduleService auditScheduleService;

    private User user;
    private AuditScheduleRequest request;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setName("Test User");
        user.setEmail("test@example.com");
        user.setActive(true);
        user.setEmailVerified(true);

        request = new AuditScheduleRequest();
        request.setUrl("https://example.com");
        request.setDevice("desktop");
        request.setFrequency("DAILY");
        request.setNextRunAt(LocalDateTime.now().plusDays(1));
    }

    @Test
    void createScheduleCreatesActiveScheduleForUser() {
        AuditSchedule savedSchedule =
                createSchedule(10L, true);

        when(auditScheduleRepository.save(any(AuditSchedule.class)))
                .thenReturn(savedSchedule);

        AuditScheduleResponse response =
                auditScheduleService.createSchedule(request, user);

        assertNotNull(response);
        assertEquals(10L, response.getId());
        assertEquals("https://example.com", response.getUrl());
        assertEquals("desktop", response.getDevice());
        assertEquals("DAILY", response.getFrequency());
        assertTrue(response.getActive());

        verify(auditScheduleRepository)
                .save(any(AuditSchedule.class));
    }

    @Test
    void getUserSchedulesReturnsUserSchedules() {
        AuditSchedule schedule =
                createSchedule(10L, true);

        when(auditScheduleRepository
                .findByUserOrderByCreatedAtDesc(user))
                .thenReturn(List.of(schedule));

        List<AuditScheduleResponse> result =
                auditScheduleService.getUserSchedules(user);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(10L, result.get(0).getId());

        verify(auditScheduleRepository)
                .findByUserOrderByCreatedAtDesc(user);
    }

    @Test
    void getScheduleReturnsOwnedSchedule() {
        AuditSchedule schedule =
                createSchedule(10L, true);

        when(auditScheduleRepository.findByIdAndUser(10L, user))
                .thenReturn(Optional.of(schedule));

        AuditScheduleResponse response =
                auditScheduleService.getSchedule(10L, user);

        assertNotNull(response);
        assertEquals(10L, response.getId());
        assertEquals("https://example.com", response.getUrl());

        verify(auditScheduleRepository)
                .findByIdAndUser(10L, user);
    }

    @Test
    void getScheduleThrowsWhenScheduleDoesNotBelongToUser() {
        when(auditScheduleRepository.findByIdAndUser(99L, user))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> auditScheduleService.getSchedule(99L, user)
        );
    }

    @Test
    void updateScheduleUpdatesOwnedSchedule() {
        AuditSchedule schedule =
                createSchedule(10L, true);

        request.setUrl("https://updated-example.com");
        request.setDevice("mobile");
        request.setFrequency("WEEKLY");

        when(auditScheduleRepository.findByIdAndUser(10L, user))
                .thenReturn(Optional.of(schedule));

        when(auditScheduleRepository.save(schedule))
                .thenReturn(schedule);

        AuditScheduleResponse response =
                auditScheduleService.updateSchedule(
                        10L,
                        request,
                        user
                );

        assertEquals(
                "https://updated-example.com",
                response.getUrl()
        );
        assertEquals("mobile", response.getDevice());
        assertEquals("WEEKLY", response.getFrequency());

        verify(auditScheduleRepository).save(schedule);
    }

    @Test
    void updateScheduleThrowsWhenScheduleDoesNotBelongToUser() {
        when(auditScheduleRepository.findByIdAndUser(99L, user))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> auditScheduleService.updateSchedule(
                        99L,
                        request,
                        user
                )
        );
    }

    @Test
    void deleteScheduleDeletesOwnedSchedule() {
        AuditSchedule schedule =
                createSchedule(10L, true);

        when(auditScheduleRepository.findByIdAndUser(10L, user))
                .thenReturn(Optional.of(schedule));

        auditScheduleService.deleteSchedule(10L, user);

        verify(auditScheduleRepository).delete(schedule);
    }

    @Test
    void deleteScheduleThrowsWhenScheduleDoesNotBelongToUser() {
        when(auditScheduleRepository.findByIdAndUser(99L, user))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> auditScheduleService.deleteSchedule(99L, user)
        );

        verify(auditScheduleRepository, never())
                .delete(any());
    }

    @Test
    void toggleScheduleChangesActiveState() {
        AuditSchedule schedule =
                createSchedule(10L, true);

        when(auditScheduleRepository.findByIdAndUser(10L, user))
                .thenReturn(Optional.of(schedule));

        when(auditScheduleRepository.save(schedule))
                .thenReturn(schedule);

        AuditScheduleResponse response =
                auditScheduleService.toggleSchedule(10L, user);

        assertFalse(response.getActive());

        verify(auditScheduleRepository)
                .save(schedule);
    }

    @Test
    void toggleScheduleThrowsWhenScheduleDoesNotBelongToUser() {
        when(auditScheduleRepository.findByIdAndUser(99L, user))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> auditScheduleService.toggleSchedule(99L, user)
        );
    }

    private AuditSchedule createSchedule(
            Long id,
            boolean active) {

        AuditSchedule schedule = new AuditSchedule();

        schedule.setId(id);
        schedule.setUser(user);
        schedule.setUrl("https://example.com");
        schedule.setDevice("desktop");
        schedule.setFrequency("DAILY");
        schedule.setNextRunAt(
                LocalDateTime.now().plusDays(1)
        );
        schedule.setActive(active);
        schedule.setCreatedAt(LocalDateTime.now());
        schedule.setUpdatedAt(LocalDateTime.now());

        return schedule;
    }
}