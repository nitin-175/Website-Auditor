package com.auditor.backend.auth.dto;

public class LoginResponse {

    private Long id;
    private String name;
    private String email;
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private String message;

    public LoginResponse() {
    }

    public LoginResponse(
            Long id,
            String name,
            String email,
            String accessToken,
            String refreshToken,
            String tokenType,
            String message) {

        this.id = id;
        this.name = name;
        this.email = email;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.tokenType = tokenType;
        this.message = message;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public String getMessage() {
        return message;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}