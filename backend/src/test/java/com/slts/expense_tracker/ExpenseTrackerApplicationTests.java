package com.slts.expense_tracker;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

// Loads the full Spring context to verify app starts correctly
@SpringBootTest
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "jwt.secret=testSecretKeyForTestingPurposesOnly1234567890",
    "jwt.expiration=86400000"
})
class ExpenseTrackerApplicationTests {

    @Test
    void contextLoads() {
        // Verifies the entire Spring Boot context loads without errors
    }
}