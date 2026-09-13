package com.auditor.backend.audit.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.auditor.backend.audit.dto.AuditResponse;
import com.auditor.backend.audit.dto.AuditStatusResponse;
import com.auditor.backend.audit.dto.CreateAuditRequest;
import com.auditor.backend.audit.entity.Audit;
import com.auditor.backend.audit.repository.AuditIssueRepository;
import com.auditor.backend.audit.repository.AuditRepository;
import com.auditor.backend.audit.repository.AuditScoreRepository;
import com.auditor.backend.audit.repository.CoreWebVitalRepository;
import com.auditor.backend.exception.ResourceNotFoundException;
import com.auditor.backend.user.entity.User;
import com.fasterxml.jackson.databind.ObjectMapper;

@ExtendWith(MockitoExtension.class)
class AuditServiceTest {

    @Mock
    private AuditRepository auditRepository;

    @Mock
    private AuditScoreRepository auditScoreRepository;

    @Mock
    private AuditIssueRepository auditIssueRepository;

    @Mock
    private CoreWebVitalRepository coreWebVitalRepository;

    @Mock
    private AuditJobService auditJobService;

    @Mock
    private AuditEngineClient auditEngineClient;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private AuditService auditService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setName("Test User");
        user.setEmail("test@example.com");
        user.setActive(true);
        user.setEmailVerified(true);
    }

    @Test
    void createAuditCreatesPendingAuditForUser() {
        CreateAuditRequest request = new CreateAuditRequest();
        request.setUrl("https://example.com");
        request.setDevice("desktop");

        Audit savedAudit = createAudit(
                10L,
                "https://example.com",
                "desktop"
        );

        when(auditRepository.save(any(Audit.class)))
                .thenReturn(savedAudit);

        when(auditScoreRepository.findByAudit(savedAudit))
                .thenReturn(Optional.empty());

        when(coreWebVitalRepository.findByAudit(savedAudit))
                .thenReturn(Optional.empty());

        when(auditIssueRepository.findByAudit(savedAudit))
                .thenReturn(List.of());

        AuditResponse response
                = auditService.createAudit(request, user);

        assertNotNull(response);
        assertEquals(10L, response.getId());
        assertEquals(
                "https://example.com",
                response.getUrl()
        );
        assertEquals("desktop", response.getDevice());
        assertEquals("PENDING", response.getStatus());

        verify(auditRepository).save(any(Audit.class));
        verify(auditJobService).createJob(savedAudit);
    }

    @Test
    void getUserAuditsReturnsUserAudits() {
        Audit audit = createAudit(
                10L,
                "https://example.com",
                "desktop"
        );

        when(auditRepository
                .findByUserOrderByCreatedAtDesc(user))
                .thenReturn(List.of(audit));

        when(auditIssueRepository.countByAuditIds(anyList()))
                .thenReturn(List.of());

        List<?> result
                = auditService.getUserAudits(user);

        assertNotNull(result);
        assertEquals(1, result.size());

        verify(auditRepository)
                .findByUserOrderByCreatedAtDesc(user);
    }

    @Test
    void getUserAuditReturnsOwnedAudit() {

        Audit audit = createAudit(
                10L,
                "https://example.com",
                "desktop"
        );

        when(auditRepository.findByIdAndUser(10L, user))
                .thenReturn(Optional.of(audit));

        when(auditScoreRepository.findByAudit(audit))
                .thenReturn(Optional.empty());

        when(coreWebVitalRepository.findByAudit(audit))
                .thenReturn(Optional.empty());

        when(auditIssueRepository.findByAudit(audit))
                .thenReturn(List.of());

        AuditResponse response
                = auditService.getUserAudit(10L, user);

        assertNotNull(response);

        assertEquals(10L, response.getId());

        assertEquals(
                "https://example.com",
                response.getUrl()
        );

        verify(auditRepository)
                .findByIdAndUser(10L, user);
    }

    @Test
    void getUserAuditThrowsWhenAuditDoesNotBelongToUser() {
        when(auditRepository.findByIdAndUser(99L, user))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> auditService.getUserAudit(99L, user)
        );

        verify(auditRepository)
                .findByIdAndUser(99L, user);
    }

    @Test
    void getAuditStatusReturnsOwnedAuditStatus() {
        Audit audit = createAudit(
                20L,
                "https://example.com",
                "mobile"
        );

        audit.setStatus("COMPLETED");

        when(auditRepository.findByIdAndUser(20L, user))
                .thenReturn(Optional.of(audit));

        AuditStatusResponse response
                = auditService.getAuditStatus(20L, user);

        assertNotNull(response);
        assertEquals(20L, response.getAuditId());
        assertEquals("COMPLETED", response.getStatus());

        verify(auditRepository)
                .findByIdAndUser(20L, user);
    }

    @Test
    void getAuditStatusThrowsWhenAuditDoesNotBelongToUser() {
        when(auditRepository.findByIdAndUser(99L, user))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> auditService.getAuditStatus(99L, user)
        );
    }

    private Audit createAudit(
            Long id,
            String url,
            String device) {

        Audit audit = new Audit();

        audit.setId(id);
        audit.setUser(user);
        audit.setUrl(url);
        audit.setDevice(device);
        audit.setStatus("PENDING");
        audit.setCreatedAt(LocalDateTime.now());
        audit.setUpdatedAt(LocalDateTime.now());

        return audit;
    }
}
