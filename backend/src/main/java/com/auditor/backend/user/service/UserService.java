package com.auditor.backend.user.service;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.auditor.backend.token.entity.RefreshToken;
import com.auditor.backend.token.repository.RefreshTokenRepository;
import com.auditor.backend.user.dto.UserResponse;
import com.auditor.backend.user.entity.Role;
import com.auditor.backend.user.entity.User;
import com.auditor.backend.user.repository.RoleRepository;
import com.auditor.backend.user.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenRepository refreshTokenRepository;
    private final RoleRepository roleRepository;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            RefreshTokenRepository refreshTokenRepository,
            RoleRepository roleRepository) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.refreshTokenRepository = refreshTokenRepository;
        this.roleRepository = roleRepository;
    }

    @Transactional
    public UserResponse updateProfile(User user, String name) {

        user.setName(name.trim());
        user.setUpdatedAt(LocalDateTime.now());

        User updatedUser = userRepository.save(user);

        return toUserResponse(updatedUser);
    }

    @Transactional
    public void deleteUser(User user) {
        userRepository.delete(user);
    }

    @Transactional
    public void changePassword(
            User user,
            String currentPassword,
            String newPassword) {

        if (!passwordEncoder.matches(
                currentPassword,
                user.getPasswordHash())) {

            throw new BadCredentialsException(
                    "Current password is incorrect");
        }

        if (passwordEncoder.matches(
                newPassword,
                user.getPasswordHash())) {

            throw new IllegalArgumentException(
                    "New password must be different from current password");
        }

        user.setPasswordHash(
                passwordEncoder.encode(newPassword));

        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);

        revokeRefreshTokens(user);
    }

    private void revokeRefreshTokens(User user) {

        LocalDateTime now = LocalDateTime.now();

        for (RefreshToken refreshToken : refreshTokenRepository.findAll()) {

            if (refreshToken.getUser().getId().equals(user.getId())
                    && refreshToken.getRevokedAt() == null) {

                refreshToken.setRevokedAt(now);
            }
        }

        refreshTokenRepository.flush();
    }

    private UserResponse toUserResponse(User user) {

        Set<String> roles = user.getRoles()
                .stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.isEmailVerified(),
                user.isActive(),
                roles,
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }

    public UserResponse getUserResponse(User user) {
        return toUserResponse(user);
    }

    @Transactional(readOnly = true)
    public java.util.List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::toUserResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(()
                        -> new IllegalArgumentException("User not found"));

        return toUserResponse(user);
    }

    @Transactional
    public UserResponse activateUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(()
                        -> new IllegalArgumentException("User not found"));

        user.setActive(true);
        user.setUpdatedAt(LocalDateTime.now());

        return toUserResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse deactivateUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(()
                        -> new IllegalArgumentException("User not found"));

        user.setActive(false);
        user.setUpdatedAt(LocalDateTime.now());

        return toUserResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse changeUserRole(Long id, String roleName) {

        User user = userRepository.findById(id)
                .orElseThrow(()
                        -> new IllegalArgumentException("User not found"));

        Role role = roleRepository.findByName(roleName.toUpperCase())
                .orElseThrow(()
                        -> new IllegalArgumentException("Role not found"));

        user.getRoles().clear();
        user.getRoles().add(role);
        user.setUpdatedAt(LocalDateTime.now());

        return toUserResponse(userRepository.save(user));
    }

}
