package com.auditor.backend.security;

import java.util.HashSet;
import java.util.Set;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.auditor.backend.user.entity.Role;
import com.auditor.backend.user.entity.User;

@SpringBootTest(
        classes = com.auditor.backend.BackendApplication.class,
        properties = "spring.task.scheduling.enabled=false"
)
@AutoConfigureMockMvc
class AuthorizationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void unauthenticatedAuditRequestReturnsUnauthorized() throws Exception {
        mockMvc.perform(
                get("/api/v1/audits")
        ).andExpect(status().isUnauthorized());
    }

    @Test
    void invalidJwtReturnsUnauthorized() throws Exception {
        mockMvc.perform(
                get("/api/v1/audits")
                        .header("Authorization", "Bearer invalid-token")
        ).andExpect(status().isUnauthorized());
    }

    @Test
    void unauthenticatedScheduleRequestReturnsUnauthorized() throws Exception {
        mockMvc.perform(
                get("/api/v1/schedules")
        ).andExpect(status().isUnauthorized());
    }

    @Test
    void unauthenticatedUserProfileRequestReturnsUnauthorized() throws Exception {
        mockMvc.perform(
                get("/api/v1/user/profile")
        ).andExpect(status().isUnauthorized());
    }

    @Test
    void userCannotAccessAdminEndpoint() throws Exception {
        User user = createUser("USER");

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        user,
                        null,
                        user.getAuthorities()
                );

        mockMvc.perform(
                get("/api/v1/admin/users")
                        .with(authentication(authentication))
        ).andExpect(status().isForbidden());
    }

    @Test
    void userCanAccessUserEndpoint() throws Exception {
        User user = createUser("USER");

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        user,
                        null,
                        user.getAuthorities()
                );

        mockMvc.perform(
                get("/api/v1/user/profile")
                        .with(authentication(authentication))
        ).andExpect(status().isOk());
    }

    @Test
    void adminCanAccessAdminEndpoint() throws Exception {
        User admin = createUser("ADMIN");

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        admin,
                        null,
                        admin.getAuthorities()
                );

        mockMvc.perform(
                get("/api/v1/admin/users")
                        .with(authentication(authentication))
        ).andExpect(status().isOk());
    }

    private User createUser(String roleName) {
        User user = new User();

        user.setId(999L);
        user.setName("Security Test User");
        user.setEmail(
                roleName.toLowerCase() + "-security-test@example.com"
        );
        user.setPasswordHash("test-password");
        user.setEmailVerified(true);
        user.setActive(true);

        Role role = new Role();
        role.setId(roleName.equals("ADMIN") ? 2L : 1L);
        role.setName(roleName);

        Set<Role> roles = new HashSet<>();
        roles.add(role);
        user.setRoles(roles);

        return user;
    }
}