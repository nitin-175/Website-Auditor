package com.auditor.backend.config;

import java.util.concurrent.Executor;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@SpringBootTest(
        classes = AsyncConfig.class
)
class AsyncConfigTest {

    @Autowired
    private Executor auditTaskExecutor;

    @Test
    void auditTaskExecutorIsConfigured() {

        assertNotNull(auditTaskExecutor);

        assertTrue(
                auditTaskExecutor
                        instanceof ThreadPoolTaskExecutor
        );
    }

    @Test
    void auditTaskExecutorHasExpectedPoolConfiguration() {

        ThreadPoolTaskExecutor executor =
                (ThreadPoolTaskExecutor) auditTaskExecutor;

        assertEquals(
                2,
                executor.getCorePoolSize()
        );

        assertEquals(
                2,
                executor.getMaxPoolSize()
        );

        assertEquals(
                10,
                executor.getQueueCapacity()
        );
    }

    @Test
    void auditTaskExecutorUsesExpectedThreadPrefix() {

        ThreadPoolTaskExecutor executor =
                (ThreadPoolTaskExecutor) auditTaskExecutor;

        assertTrue(
                executor.getThreadNamePrefix()
                        .startsWith("audit-worker-")
        );
    }
}