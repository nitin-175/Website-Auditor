package com.auditor.backend.audit.service;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.concurrent.Executors;

import org.junit.jupiter.api.AfterEach;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

class AuditEngineClientTest {

    private HttpServer server;
    private AuditEngineClient auditEngineClient;

    private int port;

    @BeforeEach
    void setUp() throws IOException {
        server = HttpServer.create(
                new InetSocketAddress("localhost", 0),
                0
        );

        port = server.getAddress().getPort();

        server.setExecutor(
                Executors.newCachedThreadPool()
        );

        server.start();

        auditEngineClient = new AuditEngineClient(
                "http://localhost:" + port,
                "test-audit-engine-key"
        );
    }

    @AfterEach
    void tearDown() {
        if (server != null) {
            server.stop(0);
        }
    }

    @Test
    void runAuditReturnsAuditEngineResponse() {

        server.createContext(
                "/api/audits",
                exchange -> {

                    assertEquals(
                            "POST",
                            exchange.getRequestMethod()
                    );

                    assertEquals(
                            "test-audit-engine-key",
                            exchange.getRequestHeaders()
                                    .getFirst("X-Audit-Engine-Key")
                    );

                    assertEquals(
                            "application/json",
                            exchange.getRequestHeaders()
                                    .getFirst("Content-Type")
                    );

                    String response = """
                            {
                                "status": "COMPLETED",
                                "score": 95
                            }
                            """;

                    sendResponse(exchange, 200, response);
                }
        );

        String response = auditEngineClient.runAudit(
                "https://example.com",
                "desktop"
        );

        assertEquals(
                """
                {
                    "status": "COMPLETED",
                    "score": 95
                }
                """,
                response
        );
    }

    @Test
    void runAuditSendsCorrectRequestBody() {

        server.createContext(
                "/api/audits",
                exchange -> {

                    String requestBody =
                            new String(
                                    exchange.getRequestBody().readAllBytes()
                            );

                    assertEquals(
                            "{\"url\":\"https://example.com\",\"device\":\"mobile\"}",
                            requestBody
                    );

                    String response = """
                            {
                                "status": "COMPLETED"
                            }
                            """;

                    sendResponse(exchange, 200, response);
                }
        );

        String response = auditEngineClient.runAudit(
                "https://example.com",
                "mobile"
        );

        assertEquals(
                """
                {
                    "status": "COMPLETED"
                }
                """,
                response
        );
    }

    @Test
    void runAuditThrowsExceptionWhenEngineReturnsServerError() {

        server.createContext(
                "/api/audits",
                exchange -> {

                    String response = """
                            {
                                "error": "Audit engine failed"
                            }
                            """;

                    sendResponse(exchange, 500, response);
                }
        );

        assertThrows(
                Exception.class,
                () -> auditEngineClient.runAudit(
                        "https://example.com",
                        "desktop"
                )
        );
    }

    @Test
    void runAuditThrowsExceptionWhenEngineReturnsBadRequest() {

        server.createContext(
                "/api/audits",
                exchange -> {

                    String response = """
                            {
                                "error": "Invalid URL"
                            }
                            """;

                    sendResponse(exchange, 400, response);
                }
        );

        assertThrows(
                Exception.class,
                () -> auditEngineClient.runAudit(
                        "invalid-url",
                        "desktop"
                )
        );
    }

    @Test
    void runAuditThrowsExceptionWhenEngineIsUnavailable() {

        AuditEngineClient unavailableClient =
                new AuditEngineClient(
                        "http://localhost:1",
                        "test-audit-engine-key"
                );

        assertThrows(
                Exception.class,
                () -> unavailableClient.runAudit(
                        "https://example.com",
                        "desktop"
                )
        );
    }

    private void sendResponse(
            HttpExchange exchange,
            int status,
            String response) throws IOException {

        byte[] responseBytes =
                response.getBytes();

        exchange.getResponseHeaders()
                .set(
                        "Content-Type",
                        "application/json"
                );

        exchange.sendResponseHeaders(
                status,
                responseBytes.length
        );

        exchange.getResponseBody()
                .write(responseBytes);

        exchange.close();
    }
}