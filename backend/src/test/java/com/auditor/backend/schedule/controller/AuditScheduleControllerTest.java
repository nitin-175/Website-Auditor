package com.auditor.backend.schedule.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.auditor.backend.schedule.dto.AuditScheduleRequest;
import com.auditor.backend.schedule.dto.AuditScheduleResponse;
import com.auditor.backend.schedule.service.AuditScheduleService;
import com.auditor.backend.user.entity.User;

@SpringBootTest(
        classes = com.auditor.backend.BackendApplication.class,
        properties = "spring.task.scheduling.enabled=false"
)
@AutoConfigureMockMvc
class AuditScheduleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuditScheduleService auditScheduleService;

    private User user;

    private org.springframework.security.core.Authentication authentication;

    @BeforeEach
    void setUp() {
        user = new User();

        user.setId(1L);
        user.setName("Test User");
        user.setEmail("test@example.com");
        user.setActive(true);
        user.setEmailVerified(true);

        authentication =
                new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                        user,
                        null,
                        user.getAuthorities()
                );
    }

    @Test
    void getSchedulesReturnsOk() throws Exception {
        when(auditScheduleService.getUserSchedules(user))
                .thenReturn(List.of());

        mockMvc.perform(
                get("/api/v1/schedules")
                        .with(authentication(authentication))
        ).andExpect(status().isOk());

        verify(auditScheduleService)
                .getUserSchedules(user);
    }

    @Test
    void getScheduleReturnsOk() throws Exception {
        AuditScheduleResponse response =
                createScheduleResponse();

        when(auditScheduleService.getSchedule(10L, user))
                .thenReturn(response);

        mockMvc.perform(
                get("/api/v1/schedules/10")
                        .with(authentication(authentication))
        ).andExpect(status().isOk());

        verify(auditScheduleService)
                .getSchedule(10L, user);
    }

    @Test
    void createScheduleReturnsOk() throws Exception {
        AuditScheduleResponse response =
                createScheduleResponse();

        when(auditScheduleService.createSchedule(
                any(AuditScheduleRequest.class),
                eq(user)
        )).thenReturn(response);

        mockMvc.perform(
                post("/api/v1/schedules")
                        .with(authentication(authentication))
                        .contentType("application/json")
                        .content("""
                                {
                                    "url": "https://example.com",
                                    "device": "desktop",
                                    "frequency": "DAILY",
                                    "nextRunAt": "2030-01-01T10:00:00"
                                }
                                """)
        ).andExpect(status().isOk());

        verify(auditScheduleService)
                .createSchedule(
                        any(AuditScheduleRequest.class),
                        eq(user)
                );
    }

    @Test
    void createScheduleRejectsInvalidUrl() throws Exception {
        mockMvc.perform(
                post("/api/v1/schedules")
                        .with(authentication(authentication))
                        .contentType("application/json")
                        .content("""
                                {
                                    "url": "invalid-url",
                                    "device": "desktop",
                                    "frequency": "DAILY",
                                    "nextRunAt": "2030-01-01T10:00:00"
                                }
                                """)
        ).andExpect(status().isBadRequest());
    }

    @Test
    void createScheduleRejectsInvalidFrequency() throws Exception {
        mockMvc.perform(
                post("/api/v1/schedules")
                        .with(authentication(authentication))
                        .contentType("application/json")
                        .content("""
                                {
                                    "url": "https://example.com",
                                    "device": "desktop",
                                    "frequency": "YEARLY",
                                    "nextRunAt": "2030-01-01T10:00:00"
                                }
                                """)
        ).andExpect(status().isBadRequest());
    }

    @Test
    void updateScheduleReturnsOk() throws Exception {
        AuditScheduleResponse response =
                createScheduleResponse();

        when(auditScheduleService.updateSchedule(
                eq(10L),
                any(AuditScheduleRequest.class),
                eq(user)
        )).thenReturn(response);

        mockMvc.perform(
                put("/api/v1/schedules/10")
                        .with(authentication(authentication))
                        .contentType("application/json")
                        .content("""
                                {
                                    "url": "https://updated-example.com",
                                    "device": "mobile",
                                    "frequency": "WEEKLY",
                                    "nextRunAt": "2030-01-08T10:00:00"
                                }
                                """)
        ).andExpect(status().isOk());

        verify(auditScheduleService)
                .updateSchedule(
                        eq(10L),
                        any(AuditScheduleRequest.class),
                        eq(user)
                );
    }

    @Test
    void deleteScheduleReturnsNoContent() throws Exception {
        mockMvc.perform(
                delete("/api/v1/schedules/10")
                        .with(authentication(authentication))
        ).andExpect(status().isNoContent());

        verify(auditScheduleService)
                .deleteSchedule(10L, user);
    }

    @Test
    void toggleScheduleReturnsOk() throws Exception {
        AuditScheduleResponse response =
                createScheduleResponse();

        when(auditScheduleService.toggleSchedule(10L, user))
                .thenReturn(response);

        mockMvc.perform(
                patch("/api/v1/schedules/10/toggle")
                        .with(authentication(authentication))
        ).andExpect(status().isOk());

        verify(auditScheduleService)
                .toggleSchedule(10L, user);
    }

    @Test
    void controllerPassesAuthenticatedUserToScheduleService()
            throws Exception {

        when(auditScheduleService.getUserSchedules(user))
                .thenReturn(List.of());

        mockMvc.perform(
                get("/api/v1/schedules")
                        .with(authentication(authentication))
        ).andExpect(status().isOk());

        verify(auditScheduleService)
                .getUserSchedules(user);
    }

    private AuditScheduleResponse createScheduleResponse() {
        return new AuditScheduleResponse(
                10L,
                "https://example.com",
                "desktop",
                "DAILY",
                LocalDateTime.of(2030, 1, 1, 10, 0),
                true,
                LocalDateTime.now(),
                LocalDateTime.now()
        );
    }
}