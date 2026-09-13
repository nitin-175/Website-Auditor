package com.auditor.backend.notification.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.auditor.backend.user.entity.User;

@Service
public class AuditNotificationService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String from;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public AuditNotificationService(
            JavaMailSender mailSender) {

        this.mailSender = mailSender;
    }

    public void sendAuditCompletedEmail(
            User user,
            Long auditId,
            String url,
            String device,
            Object overallScore) {

        if (user == null ||
                user.getEmail() == null) {
            return;
        }

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setFrom(from);
        message.setTo(user.getEmail());

        message.setSubject(
                "Website Audit Completed"
        );

        String reportUrl =
                frontendUrl
                        + "/app/report/"
                        + auditId;

        String score =
                overallScore != null
                        ? overallScore.toString()
                        : "N/A";

        String body =
                "Hello "
                        + user.getName()
                        + ",\n\n"
                        + "Your scheduled website audit has been completed successfully.\n\n"
                        + "Website: "
                        + url
                        + "\n"
                        + "Device: "
                        + device
                        + "\n"
                        + "Overall Score: "
                        + score
                        + "\n\n"
                        + "View your complete audit report:\n"
                        + reportUrl
                        + "\n\n"
                        + "Regards,\n"
                        + "Website Auditor";

        message.setText(body);

        mailSender.send(message);
    }

    public void sendAuditFailedEmail(
            User user,
            String url,
            String reason) {

        if (user == null ||
                user.getEmail() == null) {
            return;
        }

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setFrom(from);
        message.setTo(user.getEmail());

        message.setSubject(
                "Website Audit Failed"
        );

        String body =
                "Hello "
                        + user.getName()
                        + ",\n\n"
                        + "Your scheduled website audit could not be completed.\n\n"
                        + "Website: "
                        + url
                        + "\n"
                        + "Reason: "
                        + (reason != null
                                ? reason
                                : "Unknown error")
                        + "\n\n"
                        + "Please try again later.\n\n"
                        + "Regards,\n"
                        + "Website Auditor";

        message.setText(body);

        mailSender.send(message);
    }
}