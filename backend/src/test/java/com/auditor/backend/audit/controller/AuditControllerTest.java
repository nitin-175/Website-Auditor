package com.auditor.backend.audit.controller;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.auditor.backend.audit.dto.AuditResponse;
import com.auditor.backend.audit.dto.AuditStatusResponse;
import com.auditor.backend.audit.dto.AuditSummary;
import com.auditor.backend.audit.dto.CreateAuditRequest;
import com.auditor.backend.audit.service.AuditExecutionWorker;
import com.auditor.backend.audit.service.AuditService;
import com.auditor.backend.user.entity.User;

@SpringBootTest(
        classes = com.auditor.backend.BackendApplication.class,
        properties = "spring.task.scheduling.enabled=false"
)
@AutoConfigureMockMvc
class AuditControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuditService auditService;

    @MockitoBean
    private AuditExecutionWorker auditExecutionWorker;

    private User user;

    private Authentication authentication;

    @BeforeEach
    void setUp() {

        user = new User();

        user.setId(1L);
        user.setName("Test User");
        user.setEmail("test@example.com");
        user.setActive(true);
        user.setEmailVerified(true);

        authentication =
                new UsernamePasswordAuthenticationToken(
                        user,
                        null,
                        user.getAuthorities()
                );
    }

    @Test
    void getAuditHistoryReturnsOk() throws Exception {

        AuditSummary summary =
                new AuditSummary(
                        10L,
                        "https://example.com",
                        "desktop",
                        "COMPLETED",
                        null,
                        null,
                        0
                );

        when(auditService.getUserAudits(user))
                .thenReturn(List.of(summary));

        mockMvc.perform(
                get("/api/v1/audits")
                        .with(authentication(authentication))
        ).andExpect(status().isOk());

        verify(auditService)
                .getUserAudits(user);
    }

    @Test
    void getAuditReturnsOk() throws Exception {

        AuditResponse response =
                createAuditResponse();

        when(auditService.getUserAudit(10L, user))
                .thenReturn(response);

        mockMvc.perform(
                get("/api/v1/audits/10")
                        .with(authentication(authentication))
        ).andExpect(status().isOk());

        verify(auditService)
                .getUserAudit(10L, user);
    }

    @Test
    void getAuditStatusReturnsOk() throws Exception {

        AuditStatusResponse response =
                new AuditStatusResponse(
                        10L,
                        "COMPLETED",
                        null,
                        null
                );

        when(auditService.getAuditStatus(10L, user))
                .thenReturn(response);

        mockMvc.perform(
                get("/api/v1/audits/10/status")
                        .with(authentication(authentication))
        ).andExpect(status().isOk());

        verify(auditService)
                .getAuditStatus(10L, user);
    }

    @Test
    void createAuditCreatesAndQueuesAudit() throws Exception {

        AuditResponse createdAudit =
                mock(AuditResponse.class);

        when(createdAudit.getId())
                .thenReturn(10L);

        when(auditService.createAudit(
                any(CreateAuditRequest.class),
                eq(user)
        )).thenReturn(createdAudit);

        mockMvc.perform(
                post("/api/v1/audits")
                        .with(authentication(authentication))
                        .contentType(
                                MediaType.APPLICATION_JSON
                        )
                        .content("""
                            {
                                "url": "https://example.com",
                                "device": "desktop"
                            }
                            """)
        )
                .andExpect(status().isOk());

        verify(auditService)
                .createAudit(
                        any(CreateAuditRequest.class),
                        eq(user)
                );

        verify(auditExecutionWorker)
                .execute(
                        10L,
                        user
                );
    }

    @Test
    void createAuditRejectsInvalidUrl() throws Exception {

        mockMvc.perform(
                post("/api/v1/audits")
                        .with(authentication(authentication))
                        .contentType(
                                MediaType.APPLICATION_JSON
                        )
                        .content("""
                            {
                                "url": "not-a-valid-url",
                                "device": "desktop"
                            }
                            """)
        ).andExpect(
                status().isBadRequest()
        );
    }

    @Test
    void createAuditRejectsMissingUrl() throws Exception {

        mockMvc.perform(
                post("/api/v1/audits")
                        .with(authentication(authentication))
                        .contentType(
                                MediaType.APPLICATION_JSON
                        )
                        .content("""
                            {
                                "device": "desktop"
                            }
                            """)
        ).andExpect(
                status().isBadRequest()
        );
    }

    @Test
    void controllerPassesAuthenticatedUserToService()
            throws Exception {

        when(auditService.getUserAudits(user))
                .thenReturn(List.of());

        mockMvc.perform(
                get("/api/v1/audits")
                        .with(authentication(authentication))
        ).andExpect(status().isOk());

        verify(auditService)
                .getUserAudits(user);
    }

    private AuditResponse createAuditResponse() {

        return new AuditResponse(
                10L,
                "https://example.com",
                "desktop",
                "COMPLETED",
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                List.of(),
                List.of()
        );
    }
}