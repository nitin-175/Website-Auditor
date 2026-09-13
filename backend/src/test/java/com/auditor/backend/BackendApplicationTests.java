package com.auditor.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(
        classes = BackendApplication.class,
        properties = "spring.task.scheduling.enabled=false"
)
class BackendApplicationTests {

    @Test
    void contextLoads() {
    }
}