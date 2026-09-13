package com.auditor.backend.config;

import java.util.concurrent.ThreadPoolExecutor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@Configuration
@EnableAsync
public class AsyncConfig {

    private static final Logger logger =
            LoggerFactory.getLogger(AsyncConfig.class);

    @Bean(name = "auditTaskExecutor")
    public ThreadPoolTaskExecutor auditTaskExecutor() {

        ThreadPoolTaskExecutor executor =
                new ThreadPoolTaskExecutor();

        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(2);
        executor.setQueueCapacity(10);

        executor.setThreadNamePrefix(
                "audit-worker-"
        );

        executor.setRejectedExecutionHandler(
                new ThreadPoolExecutor.CallerRunsPolicy()
        );

        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setAwaitTerminationSeconds(30);

        executor.initialize();

        logger.info(
                "Audit task executor initialized with "
                        + "2 worker threads, queue capacity 10 "
                        + "and 30 second shutdown timeout"
        );

        return executor;
    }
}