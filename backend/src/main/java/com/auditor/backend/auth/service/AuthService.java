package com.auditor.backend.auth.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;

import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.auditor.backend.auth.dto.LoginRequest;
import com.auditor.backend.auth.dto.LoginResponse;
import com.auditor.backend.auth.dto.RegisterRequest;
import com.auditor.backend.auth.dto.RegisterResponse;
import com.auditor.backend.auth.entity.PasswordResetToken;
import com.auditor.backend.auth.repository.PasswordResetTokenRepository;
import com.auditor.backend.security.JwtService;
import com.auditor.backend.token.entity.RefreshToken;
import com.auditor.backend.token.repository.RefreshTokenRepository;
import com.auditor.backend.user.entity.Role;
import com.auditor.backend.user.entity.User;
import com.auditor.backend.user.repository.RoleRepository;
import com.auditor.backend.user.repository.UserRepository;
import com.auditor.backend.verification.entity.EmailVerificationToken;
import com.auditor.backend.verification.repository.EmailVerificationTokenRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;

    private final SecureRandom secureRandom = new SecureRandom();

    private final JavaMailSender mailSender;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    public AuthService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            RefreshTokenRepository refreshTokenRepository,
            EmailVerificationTokenRepository emailVerificationTokenRepository,
            JavaMailSender mailSender,
            PasswordResetTokenRepository passwordResetTokenRepository) {

        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.refreshTokenRepository = refreshTokenRepository;
        this.emailVerificationTokenRepository
                = emailVerificationTokenRepository;
        this.mailSender = mailSender;
        this.passwordResetTokenRepository
                = passwordResetTokenRepository;
    }

        @Transactional(noRollbackFor = MailException.class)
    public RegisterResponse register(RegisterRequest request) {

        String email = request.getEmail()
                .trim()
                .toLowerCase(Locale.ROOT);

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email is already registered");
        }

        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(()
                        -> new IllegalStateException("Default USER role not found"));

        User user = new User();

        user.setName(request.getName().trim());
        user.setEmail(email);
        user.setPasswordHash(
                passwordEncoder.encode(request.getPassword())
        );
        user.setEmailVerified(false);
        user.setActive(true);

        LocalDateTime now = LocalDateTime.now();

        user.setCreatedAt(now);
        user.setUpdatedAt(now);

        Set<Role> roles = new HashSet<>();
        roles.add(userRole);

        user.setRoles(roles);

        User savedUser = userRepository.save(user);

        String verificationToken
                = generateVerificationToken();

        String verificationTokenHash
                = jwtService.hashRefreshToken(verificationToken);

        EmailVerificationToken emailVerificationToken
                = new EmailVerificationToken();

        emailVerificationToken.setUser(savedUser);

        emailVerificationToken.setTokenHash(
                verificationTokenHash
        );

        emailVerificationToken.setCreatedAt(
                LocalDateTime.now()
        );

        emailVerificationToken.setExpiresAt(
                LocalDateTime.now().plusHours(24)
        );

        emailVerificationTokenRepository.save(
                emailVerificationToken
        );

        sendVerificationEmail(
                savedUser.getEmail(),
                savedUser.getName(),
                verificationToken
        );

        return new RegisterResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                "Registration successful"
        );
    }

    @Transactional
    public void resendVerificationEmail(String emailValue) {

        String email = emailValue.trim().toLowerCase(Locale.ROOT);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException(
                        "No account exists for this email"
                ));

        if (user.isEmailVerified()) {
            throw new IllegalArgumentException(
                    "Email is already verified"
            );
        }

        String verificationToken = generateVerificationToken();

        EmailVerificationToken token = new EmailVerificationToken();
        token.setUser(user);
        token.setTokenHash(
                jwtService.hashRefreshToken(verificationToken)
        );
        token.setCreatedAt(LocalDateTime.now());
        token.setExpiresAt(LocalDateTime.now().plusHours(24));

        emailVerificationTokenRepository.save(token);

        sendVerificationEmail(
                user.getEmail(),
                user.getName(),
                verificationToken
        );
    }

    public LoginResponse login(LoginRequest request) {

        String email = request.getEmail()
                .trim()
                .toLowerCase(Locale.ROOT);

        Authentication authentication
                = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                email,
                                request.getPassword()
                        )
                );

        User user = (User) authentication.getPrincipal();

        if (!user.isEmailVerified()) {
            throw new IllegalStateException(
                    "Please verify your email before logging in"
            );
        }

        String accessToken
                = jwtService.generateAccessToken(user);

        String refreshTokenValue
                = jwtService.generateRefreshToken();

        String refreshTokenHash
                = jwtService.hashRefreshToken(refreshTokenValue);

        RefreshToken refreshToken
                = new RefreshToken();

        refreshToken.setUser(user);
        refreshToken.setTokenHash(refreshTokenHash);
        refreshToken.setCreatedAt(LocalDateTime.now());
        refreshToken.setExpiresAt(
                LocalDateTime.now().plusDays(7)
        );

        refreshTokenRepository.save(refreshToken);

        return new LoginResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                accessToken,
                refreshTokenValue,
                "Bearer",
                "Login successful"
        );
    }

    @Transactional
    public LoginResponse refreshAccessToken(String refreshTokenValue) {

        String refreshTokenHash
                = jwtService.hashRefreshToken(refreshTokenValue);

        RefreshToken refreshToken
                = refreshTokenRepository
                        .findByTokenHash(refreshTokenHash)
                        .orElseThrow(()
                                -> new IllegalArgumentException(
                                "Invalid refresh token"
                        ));

        if (refreshToken.getRevokedAt() != null) {

            throw new IllegalArgumentException(
                    "Refresh token has been revoked"
            );
        }

        if (refreshToken.getExpiresAt()
                .isBefore(LocalDateTime.now())) {

            throw new IllegalArgumentException(
                    "Refresh token has expired"
            );
        }

        User user = refreshToken.getUser();

        /*
     * Revoke the old refresh token.
         */
        refreshToken.setRevokedAt(
                LocalDateTime.now()
        );

        refreshTokenRepository.save(refreshToken);

        /*
     * Generate new tokens.
         */
        String newAccessToken
                = jwtService.generateAccessToken(user);

        String newRefreshTokenValue
                = jwtService.generateRefreshToken();

        String newRefreshTokenHash
                = jwtService.hashRefreshToken(
                        newRefreshTokenValue
                );

        RefreshToken newRefreshToken
                = new RefreshToken();

        newRefreshToken.setUser(user);
        newRefreshToken.setTokenHash(
                newRefreshTokenHash
        );

        newRefreshToken.setCreatedAt(
                LocalDateTime.now()
        );

        newRefreshToken.setExpiresAt(
                LocalDateTime.now().plusDays(7)
        );

        refreshTokenRepository.save(newRefreshToken);

        return new LoginResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                newAccessToken,
                newRefreshTokenValue,
                "Bearer",
                "Token refreshed successfully"
        );
    }

    @Transactional
    public void logout(String refreshTokenValue) {

        String refreshTokenHash
                = jwtService.hashRefreshToken(refreshTokenValue);

        RefreshToken refreshToken
                = refreshTokenRepository
                        .findByTokenHash(refreshTokenHash)
                        .orElseThrow(()
                                -> new IllegalArgumentException(
                                "Invalid refresh token"
                        ));

        if (refreshToken.getRevokedAt() != null) {
            return;
        }

        refreshToken.setRevokedAt(
                LocalDateTime.now()
        );

        refreshTokenRepository.save(refreshToken);
    }

    private String generateVerificationToken() {

        byte[] randomBytes = new byte[64];

        secureRandom.nextBytes(randomBytes);

        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(randomBytes);
    }

    @Transactional
    public void verifyEmail(String tokenValue) {

        String tokenHash
                = jwtService.hashRefreshToken(tokenValue);

        EmailVerificationToken token
                = emailVerificationTokenRepository
                        .findByTokenHash(tokenHash)
                        .orElseThrow(()
                                -> new IllegalArgumentException(
                                "Invalid verification token"
                        ));

        if (token.getVerifiedAt() != null) {
            throw new IllegalArgumentException(
                    "Email is already verified"
            );
        }

        if (token.getExpiresAt()
                .isBefore(LocalDateTime.now())) {

            throw new IllegalArgumentException(
                    "Verification token has expired"
            );
        }

        User user = token.getUser();

        user.setEmailVerified(true);

        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);

        token.setVerifiedAt(LocalDateTime.now());

        emailVerificationTokenRepository.save(token);
    }

    private void sendVerificationEmail(
            String email,
            String name,
            String verificationToken) {

        String verificationLink
                = "http://localhost:5173/verify-email?token="
                + verificationToken;

        SimpleMailMessage message
                = new SimpleMailMessage();

        message.setTo(email);

        message.setSubject(
                "Verify your Website Auditor account"
        );

        message.setText(
                "Hello " + name + ",\n\n"
                + "Thank you for registering with Website Auditor.\n\n"
                + "Please verify your email by clicking the link below:\n\n"
                + verificationLink
                + "\n\n"
                + "This verification link expires in 24 hours.\n\n"
                + "If you did not create this account, please ignore this email."
        );

        mailSender.send(message);
    }

    private String generatePasswordResetToken() {

        byte[] randomBytes = new byte[64];

        secureRandom.nextBytes(randomBytes);

        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(randomBytes);
    }

    @Transactional
    public void forgotPassword(String emailValue) {

        String email = emailValue
                .trim()
                .toLowerCase(Locale.ROOT);

        /*
     * Do not reveal whether the email exists.
         */
        User user = userRepository
                .findByEmail(email)
                .orElse(null);

        if (user == null) {
            return;
        }

        String resetToken
                = generatePasswordResetToken();

        String resetTokenHash
                = jwtService.hashRefreshToken(resetToken);

        PasswordResetToken passwordResetToken
                = new PasswordResetToken();

        passwordResetToken.setUser(user);

        passwordResetToken.setTokenHash(
                resetTokenHash
        );

        passwordResetToken.setCreatedAt(
                LocalDateTime.now()
        );

        passwordResetToken.setExpiresAt(
                LocalDateTime.now().plusMinutes(30)
        );

        passwordResetTokenRepository.save(
                passwordResetToken
        );

        sendPasswordResetEmail(
                user.getEmail(),
                user.getName(),
                resetToken
        );
    }

    private void sendPasswordResetEmail(
            String email,
            String name,
            String resetToken) {

        String resetLink
                = "http://localhost:5173/reset-password?token="
                + resetToken;

        SimpleMailMessage message
                = new SimpleMailMessage();

        message.setTo(email);

        message.setSubject(
                "Reset your Website Auditor password"
        );

        message.setText(
                "Hello " + name + ",\n\n"
                + "We received a request to reset your password.\n\n"
                + "Reset your password using the link below:\n\n"
                + resetLink
                + "\n\n"
                + "This link expires in 30 minutes.\n\n"
                + "If you did not request a password reset, "
                + "please ignore this email."
        );

        mailSender.send(message);
    }

    @Transactional
    public void resetPassword(
            String tokenValue,
            String newPassword) {

        String tokenHash
                = jwtService.hashRefreshToken(tokenValue);

        PasswordResetToken resetToken
                = passwordResetTokenRepository
                        .findByTokenHash(tokenHash)
                        .orElseThrow(()
                                -> new IllegalArgumentException(
                                "Invalid password reset token"
                        ));

        if (resetToken.getUsedAt() != null) {

            throw new IllegalArgumentException(
                    "Password reset token has already been used"
            );
        }

        if (resetToken.getExpiresAt()
                .isBefore(LocalDateTime.now())) {

            throw new IllegalArgumentException(
                    "Password reset token has expired"
            );
        }

        User user = resetToken.getUser();

        user.setPasswordHash(
                passwordEncoder.encode(newPassword)
        );

        user.setUpdatedAt(
                LocalDateTime.now()
        );

        userRepository.save(user);

        resetToken.setUsedAt(
                LocalDateTime.now()
        );

        passwordResetTokenRepository.save(
                resetToken
        );

        /*
     * Revoke all existing refresh tokens.
     * This forces the user to authenticate again
     * on other sessions after changing the password.
         */
        refreshTokenRepository
                .findAll()
                .stream()
                .filter(token
                        -> token.getUser()
                        .getId()
                        .equals(user.getId()))
                .forEach(token
                        -> token.setRevokedAt(
                        LocalDateTime.now()
                ));

        refreshTokenRepository.flush();
    }

}
