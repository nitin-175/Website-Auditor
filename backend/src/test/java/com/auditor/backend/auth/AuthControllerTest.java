package com.auditor.backend.auth;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(
        classes = com.auditor.backend.BackendApplication.class,
        properties = "spring.task.scheduling.enabled=false"
)
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void loginWithMissingEmailReturnsBadRequest() throws Exception {
        String request = """
                {
                    "password": "Password123"
                }
                """;

        mockMvc.perform(
                post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(request)
        ).andExpect(status().isBadRequest());
    }

    @Test
    void loginWithInvalidEmailReturnsBadRequest() throws Exception {
        String request = """
                {
                    "email": "invalid-email",
                    "password": "Password123"
                }
                """;

        mockMvc.perform(
                post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(request)
        ).andExpect(status().isBadRequest());
    }

    @Test
    void loginWithMissingPasswordReturnsBadRequest() throws Exception {
        String request = """
                {
                    "email": "test@example.com"
                }
                """;

        mockMvc.perform(
                post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(request)
        ).andExpect(status().isBadRequest());
    }

    @Test
    void registerWithMissingNameReturnsBadRequest() throws Exception {
        String request = """
                {
                    "email": "test@example.com",
                    "password": "Password123"
                }
                """;

        mockMvc.perform(
                post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(request)
        ).andExpect(status().isBadRequest());
    }

    @Test
    void registerWithInvalidEmailReturnsBadRequest() throws Exception {
        String request = """
                {
                    "name": "Test User",
                    "email": "invalid-email",
                    "password": "Password123"
                }
                """;

        mockMvc.perform(
                post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(request)
        ).andExpect(status().isBadRequest());
    }

    @Test
    void registerWithShortPasswordReturnsBadRequest() throws Exception {
        String request = """
                {
                    "name": "Test User",
                    "email": "test@example.com",
                    "password": "1234567"
                }
                """;

        mockMvc.perform(
                post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(request)
        ).andExpect(status().isBadRequest());
    }

    @Test
    void refreshWithMissingTokenReturnsBadRequest() throws Exception {
        String request = """
                {
                    "refreshToken": ""
                }
                """;

        mockMvc.perform(
                post("/api/v1/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(request)
        ).andExpect(status().isBadRequest());
    }

    @Test
    void logoutWithMissingTokenReturnsBadRequest() throws Exception {
        String request = """
                {
                    "refreshToken": ""
                }
                """;

        mockMvc.perform(
                post("/api/v1/auth/logout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(request)
        ).andExpect(status().isBadRequest());
    }
}