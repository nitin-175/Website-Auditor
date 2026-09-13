package com.auditor.backend.notification.service;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import org.mockito.MockitoAnnotations;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;

import com.auditor.backend.user.entity.User;

class AuditNotificationServiceTest {

    @Mock
    private JavaMailSender mailSender;

    private AuditNotificationService notificationService;

    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        notificationService =
                new AuditNotificationService(mailSender);

        ReflectionTestUtils.setField(
                notificationService,
                "from",
                "noreply@example.com"
        );

        ReflectionTestUtils.setField(
                notificationService,
                "frontendUrl",
                "http://localhost:5173"
        );

        user = new User();
        user.setId(1L);
        user.setName("Test User");
        user.setEmail("test@example.com");
    }

    @Test
    void sendAuditCompletedEmailSendsCorrectEmail() {

        notificationService.sendAuditCompletedEmail(
                user,
                10L,
                "https://example.com",
                "desktop",
                new BigDecimal("95.50")
        );

        ArgumentCaptor<SimpleMailMessage> captor =
                ArgumentCaptor.forClass(SimpleMailMessage.class);

        verify(mailSender).send(captor.capture());

        SimpleMailMessage message = captor.getValue();

        assertEquals(
                "noreply@example.com",
                message.getFrom()
        );

        assertEquals(
                "test@example.com",
                message.getTo()[0]
        );

        assertEquals(
                "Website Audit Completed",
                message.getSubject()
        );

        assertTrue(
                message.getText().contains(
                        "https://example.com"
                )
        );

        assertTrue(
                message.getText().contains(
                        "desktop"
                )
        );

        assertTrue(
                message.getText().contains(
                        "95.50"
                )
        );

        assertTrue(
                message.getText().contains(
                        "http://localhost:5173/app/report/10"
                )
        );
    }

    @Test
    void sendAuditCompletedEmailUsesNAWhenScoreIsNull() {

        notificationService.sendAuditCompletedEmail(
                user,
                10L,
                "https://example.com",
                "desktop",
                null
        );

        ArgumentCaptor<SimpleMailMessage> captor =
                ArgumentCaptor.forClass(SimpleMailMessage.class);

        verify(mailSender).send(captor.capture());

        SimpleMailMessage message = captor.getValue();

        assertTrue(
                message.getText().contains(
                        "Overall Score: N/A"
                )
        );
    }

    @Test
    void sendAuditCompletedEmailDoesNothingWhenUserIsNull() {

        notificationService.sendAuditCompletedEmail(
                null,
                10L,
                "https://example.com",
                "desktop",
                new BigDecimal("95")
        );

        verify(mailSender, never())
                .send(org.mockito.ArgumentMatchers.any(SimpleMailMessage.class));
    }

    @Test
    void sendAuditCompletedEmailDoesNothingWhenUserEmailIsNull() {

        user.setEmail(null);

        notificationService.sendAuditCompletedEmail(
                user,
                10L,
                "https://example.com",
                "desktop",
                new BigDecimal("95")
        );

        verify(mailSender, never())
                .send(org.mockito.ArgumentMatchers.any(SimpleMailMessage.class));
    }

    @Test
    void sendAuditFailedEmailSendsCorrectEmail() {

        notificationService.sendAuditFailedEmail(
                user,
                "https://example.com",
                "Audit execution failed"
        );

        ArgumentCaptor<SimpleMailMessage> captor =
                ArgumentCaptor.forClass(SimpleMailMessage.class);

        verify(mailSender).send(captor.capture());

        SimpleMailMessage message = captor.getValue();

        assertEquals(
                "noreply@example.com",
                message.getFrom()
        );

        assertEquals(
                "test@example.com",
                message.getTo()[0]
        );

        assertEquals(
                "Website Audit Failed",
                message.getSubject()
        );

        assertTrue(
                message.getText().contains(
                        "https://example.com"
                )
        );

        assertTrue(
                message.getText().contains(
                        "Audit execution failed"
                )
        );
    }

    @Test
    void sendAuditFailedEmailUsesUnknownErrorWhenReasonIsNull() {

        notificationService.sendAuditFailedEmail(
                user,
                "https://example.com",
                null
        );

        ArgumentCaptor<SimpleMailMessage> captor =
                ArgumentCaptor.forClass(SimpleMailMessage.class);

        verify(mailSender).send(captor.capture());

        SimpleMailMessage message = captor.getValue();

        assertTrue(
                message.getText().contains(
                        "Reason: Unknown error"
                )
        );
    }

    @Test
    void sendAuditFailedEmailDoesNothingWhenUserIsNull() {

        notificationService.sendAuditFailedEmail(
                null,
                "https://example.com",
                "Failure"
        );

        verify(mailSender, never())
                .send(org.mockito.ArgumentMatchers.any(SimpleMailMessage.class));
    }

    @Test
    void sendAuditFailedEmailDoesNothingWhenUserEmailIsNull() {

        user.setEmail(null);

        notificationService.sendAuditFailedEmail(
                user,
                "https://example.com",
                "Failure"
        );

        verify(mailSender, never())
                .send(org.mockito.ArgumentMatchers.any(SimpleMailMessage.class));
    }
}