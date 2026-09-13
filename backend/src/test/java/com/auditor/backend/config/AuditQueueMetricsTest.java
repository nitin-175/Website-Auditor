package com.auditor.backend.config;

import java.util.concurrent.ThreadPoolExecutor;

import org.junit.jupiter.api.AfterEach;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import io.micrometer.core.instrument.simple.SimpleMeterRegistry;

class AuditQueueMetricsTest {

    private SimpleMeterRegistry meterRegistry;

    private ThreadPoolTaskExecutor auditTaskExecutor;

    @BeforeEach
    void setUp() {

        meterRegistry = new SimpleMeterRegistry();

        auditTaskExecutor =
                new ThreadPoolTaskExecutor();

        auditTaskExecutor.setCorePoolSize(2);
        auditTaskExecutor.setMaxPoolSize(2);
        auditTaskExecutor.setQueueCapacity(10);
        auditTaskExecutor.setThreadNamePrefix(
                "audit-worker-"
        );

        auditTaskExecutor.initialize();

        new AuditQueueMetrics.AuditQueueMetricsBinder(
                meterRegistry,
                auditTaskExecutor
        );
    }

    @AfterEach
    void tearDown() {

        auditTaskExecutor.shutdown();
        meterRegistry.close();
    }

    @Test
    void auditQueueMetricsAreRegistered() {

        assertNotNull(
                meterRegistry
                        .find("audit.queue.active")
                        .gauge()
        );

        assertNotNull(
                meterRegistry
                        .find("audit.queue.pool.size")
                        .gauge()
        );

        assertNotNull(
                meterRegistry
                        .find("audit.queue.queued")
                        .gauge()
        );

        assertNotNull(
                meterRegistry
                        .find("audit.queue.remaining.capacity")
                        .gauge()
        );

        assertNotNull(
                meterRegistry
                        .find("audit.queue.completed")
                        .gauge()
        );
    }

    @Test
    void auditQueueMetricsReflectExecutorState() {

        ThreadPoolExecutor executor =
                auditTaskExecutor.getThreadPoolExecutor();

        double active =
                meterRegistry
                        .get("audit.queue.active")
                        .gauge()
                        .value();

        double queued =
                meterRegistry
                        .get("audit.queue.queued")
                        .gauge()
                        .value();

        double remainingCapacity =
                meterRegistry
                        .get("audit.queue.remaining.capacity")
                        .gauge()
                        .value();

        double completed =
                meterRegistry
                        .get("audit.queue.completed")
                        .gauge()
                        .value();

        assertTrue(active >= 0);
        assertTrue(queued >= 0);
        assertTrue(remainingCapacity >= 0);
        assertTrue(completed >= 0);

        assertTrue(
                remainingCapacity
                        <= executor.getQueue()
                                .remainingCapacity()
        );
    }
}