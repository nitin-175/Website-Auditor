package com.auditor.backend.config;

import java.util.concurrent.ThreadPoolExecutor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;

@Configuration
public class AuditQueueMetrics {

    @Bean
    public AuditQueueMetricsBinder auditQueueMetricsBinder(
            MeterRegistry meterRegistry,
            ThreadPoolTaskExecutor auditTaskExecutor) {

        return new AuditQueueMetricsBinder(
                meterRegistry,
                auditTaskExecutor
        );
    }

    public static class AuditQueueMetricsBinder {

        public AuditQueueMetricsBinder(
                MeterRegistry meterRegistry,
                ThreadPoolTaskExecutor executor) {

            ThreadPoolExecutor threadPool =
                    executor.getThreadPoolExecutor();

            Gauge.builder(
                    "audit.queue.active",
                    threadPool,
                    ThreadPoolExecutor::getActiveCount
            )
            .description(
                    "Number of audit worker tasks currently executing"
            )
            .register(meterRegistry);

            Gauge.builder(
                    "audit.queue.pool.size",
                    threadPool,
                    ThreadPoolExecutor::getPoolSize
            )
            .description(
                    "Current number of audit worker threads"
            )
            .register(meterRegistry);

            Gauge.builder(
                    "audit.queue.queued",
                    threadPool,
                    pool -> pool.getQueue().size()
            )
            .description(
                    "Number of audit tasks waiting in the queue"
            )
            .register(meterRegistry);

            Gauge.builder(
                    "audit.queue.remaining.capacity",
                    threadPool,
                    pool -> pool.getQueue().remainingCapacity()
            )
            .description(
                    "Remaining capacity available in the audit queue"
            )
            .register(meterRegistry);

            Gauge.builder(
                    "audit.queue.completed",
                    threadPool,
                    ThreadPoolExecutor::getCompletedTaskCount
            )
            .description(
                    "Number of audit tasks completed by workers"
            )
            .register(meterRegistry);
        }
    }
}