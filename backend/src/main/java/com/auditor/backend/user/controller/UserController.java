package com.auditor.backend.user.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.auditor.backend.user.dto.ChangePasswordRequest;
import com.auditor.backend.user.dto.UpdateProfileRequest;
import com.auditor.backend.user.dto.UserResponse;
import com.auditor.backend.user.entity.User;
import com.auditor.backend.user.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getProfile(
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                userService.getUserResponse(user)
        );
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        UserResponse response
                = userService.updateProfile(user, request.getName());

        return ResponseEntity.ok(response);
    }

        @DeleteMapping("/profile")
        public ResponseEntity<Void> deleteProfile(
                        Authentication authentication) {

                User user = (User) authentication.getPrincipal();

                userService.deleteUser(user);

                return ResponseEntity.noContent().build();
        }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        try {
            userService.changePassword(
                    user,
                    request.getCurrentPassword(),
                    request.getNewPassword()
            );

            return ResponseEntity.ok(
                    "Password changed successfully"
            );

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401)
                    .body("Current password is incorrect");
        }
    }

    @GetMapping("/admin/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {

        return ResponseEntity.ok(
                userService.getAllUsers()
        );
    }

    @GetMapping("/admin/users/{id}")
    public ResponseEntity<UserResponse> getUserById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                userService.getUserById(id)
        );
    }

    @PutMapping("/admin/users/{id}/activate")
    public ResponseEntity<UserResponse> activateUser(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                userService.activateUser(id)
        );
    }

    @PutMapping("/admin/users/{id}/deactivate")
    public ResponseEntity<UserResponse> deactivateUser(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                userService.deactivateUser(id)
        );
    }
}
