# Testing Documentation

This document provides comprehensive information about the testing setup for the Travel Journal AI backend application.

## Table of Contents

1. [Test Structure](#test-structure)
2. [Test Types](#test-types)
3. [Running Tests](#running-tests)
4. [Test Configuration](#test-configuration)
5. [Test Utilities](#test-utilities)
6. [Best Practices](#best-practices)
7. [Test Coverage](#test-coverage)

## Test Structure

```
src/test/
├── java/com/adendl/traveljournalai/
│   ├── config/
│   │   └── TestConfig.java                 # Test configuration
│   ├── controller/
│   │   ├── TripControllerTest.java         # Controller unit tests
│   │   └── UserControllerTest.java         # Controller unit tests
│   ├── service/
│   │   ├── TripServiceTest.java            # Service unit tests
│   │   └── UserServiceTest.java            # Service unit tests
│   ├── repository/
│   │   └── TripRepositoryTest.java         # Repository integration tests
│   ├── integration/
│   │   └── TripIntegrationTest.java        # Full stack integration tests
│   ├── utils/
│   │   └── TestUtils.java                  # Test utilities and helpers
│   └── TraveljournalaiApplicationTests.java # Application context test
└── resources/
    └── application-test.properties         # Test-specific properties
```

## Test Types

### 1. Unit Tests
- **Purpose**: Test individual components in isolation
- **Location**: `controller/`, `service/` packages
- **Framework**: JUnit 5 + Mockito
- **Scope**: Single class/method testing with mocked dependencies

**Examples**:
- `TripControllerTest`: Tests controller endpoints with mocked services
- `UserServiceTest`: Tests business logic with mocked repositories

### 2. Integration Tests
- **Purpose**: Test component interactions and database operations
- **Location**: `repository/` package
- **Framework**: JUnit 5 + Spring Boot Test + H2 Database
- **Scope**: Database operations and component integration

**Examples**:
- `TripRepositoryTest`: Tests database operations with real H2 database

### 3. Full Stack Integration Tests
- **Purpose**: Test complete request-response cycles
- **Location**: `integration/` package
- **Framework**: JUnit 5 + Spring Boot Test + MockMvc
- **Scope**: End-to-end API testing with authentication

**Examples**:
- `TripIntegrationTest`: Tests complete API flows with JWT authentication

### 4. Application Context Tests
- **Purpose**: Verify Spring application context loads correctly
- **Location**: Root test package
- **Framework**: Spring Boot Test
- **Scope**: Application startup and configuration

## Running Tests

### Run All Tests
```bash
# From backend directory
./gradlew test
```

### Run Specific Test Classes
```bash
# Run only controller tests
./gradlew test --tests "*ControllerTest"

# Run only service tests
./gradlew test --tests "*ServiceTest"

# Run only integration tests
./gradlew test --tests "*IntegrationTest"
```

### Run Tests with Coverage
```bash
./gradlew test jacocoTestReport
```

### Run Tests in IDE
- Right-click on test class or method
- Select "Run Test" or "Debug Test"
- Use keyboard shortcuts (Ctrl+Shift+F10 in IntelliJ)

## Test Configuration

### Test Properties (`application-test.properties`)
```properties
# H2 In-Memory Database
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driver-class-name=org.h2.Driver
spring.jpa.hibernate.ddl-auto=create-drop

# JWT Configuration
jwt.secret=test-secret-key-for-junit-tests-only

# Logging
logging.level.com.adendl.traveljournalai=DEBUG
```

### Test Configuration Class (`TestConfig.java`)
Provides test-specific beans:
- `BCryptPasswordEncoder`: For password hashing
- `RestTemplate`: For HTTP client operations

## Test Utilities

### TestUtils Class
Provides common test data and helper methods:

```java
// Create test entities
User testUser = TestUtils.createTestUser();
Trip testTrip = TestUtils.createTestTrip();

// Create JWT tokens
String jwtToken = TestUtils.createTestJwtToken("username");

// Create JSON request bodies
String requestJson = TestUtils.createTripRequestJson("Sydney", "Melbourne", true, 5, interests);

// Helper methods for authenticated requests
TestUtils.performAuthenticatedRequest(mockMvc, request, username);
```

### Test Data Patterns
- **Consistent Test Data**: All tests use the same base test data
- **Isolated Test Data**: Each test creates its own data to avoid conflicts
- **Realistic Data**: Test data represents real-world scenarios

## Best Practices

### 1. Test Naming Convention
```java
@Test
void methodName_Scenario_ExpectedResult() {
    // test implementation
}

// Examples:
void createTrip_Success()
void createTrip_InvalidJwtToken()
void getUserTrips_UserNotFound()
```

### 2. Test Structure (AAA Pattern)
```java
@Test
void createTrip_Success() {
    // Arrange (Given)
    String jwtToken = TestUtils.createTestJwtToken(TestUtils.TEST_USERNAME);
    when(userRepository.findByUsername(TestUtils.TEST_USERNAME))
            .thenReturn(Optional.of(testUser));

    // Act (When)
    Trip result = tripService.createTrip(jwtToken, "Sydney", "Melbourne", true, 5, interests, 800.0);

    // Assert (Then)
    assertNotNull(result);
    assertEquals("Sydney", result.getFromCity());
    verify(tripRepository).save(any(Trip.class));
}
```

### 3. Mocking Guidelines
- Mock external dependencies (databases, APIs)
- Don't mock the class under test
- Use `@Mock` and `@InjectMocks` for clean dependency injection
- Verify important interactions with `verify()`

### 4. Assertion Best Practices
- Use specific assertions (`assertEquals`, `assertNotNull`)
- Test both positive and negative scenarios
- Verify side effects (database saves, API calls)
- Use descriptive assertion messages

### 5. Test Isolation
- Each test should be independent
- Use `@Transactional` for database tests
- Clean up test data in `@AfterEach` if needed
- Use unique identifiers for test data

## Test Coverage

### Current Coverage Areas
- **Controllers**: HTTP endpoints, request/response handling, authentication
- **Services**: Business logic, external API integration, error handling
- **Repositories**: Database operations, CRUD functionality
- **Integration**: End-to-end API flows, JWT authentication

### Coverage Goals
- **Unit Tests**: 80%+ line coverage
- **Integration Tests**: All critical paths
- **API Tests**: All public endpoints

### Running Coverage Reports
```bash
./gradlew jacocoTestReport
```
Reports are generated in `build/reports/jacoco/test/html/index.html`

## Common Test Scenarios

### Authentication Tests
```java
@Test
void endpoint_ValidJwtToken_Success()
@Test
void endpoint_InvalidJwtToken_Unauthorized()
@Test
void endpoint_NoAuthentication_Unauthorized()
```

### Error Handling Tests
```java
@Test
void method_ValidInput_Success()
@Test
void method_InvalidInput_ThrowsException()
@Test
void method_ServiceException_HandledGracefully()
```

### Database Tests
```java
@Test
void save_ValidEntity_SavedToDatabase()
@Test
void findById_ExistingId_ReturnsEntity()
@Test
void findById_NonExistentId_ReturnsEmpty()
@Test
void delete_ExistingEntity_RemovedFromDatabase()
```

## Troubleshooting

### Common Issues

1. **Test Database Connection**
   - Ensure H2 dependency is included
   - Check `application-test.properties` configuration

2. **JWT Token Issues**
   - Verify JWT secret is consistent between test and main config
   - Check token expiration times

3. **Mock Configuration**
   - Ensure all dependencies are properly mocked
   - Check `@Mock` and `@InjectMocks` annotations

4. **Transaction Issues**
   - Use `@Transactional` for database tests
   - Ensure proper cleanup in `@AfterEach`

### Debug Tips
- Use `@DirtiesContext` to reset application context
- Add logging to understand test flow
- Use debugger to step through complex scenarios
- Check test logs for detailed error information

## Continuous Integration

### GitHub Actions Integration
Tests are automatically run on:
- Pull requests
- Push to main branch
- Scheduled runs

### Test Reports
- Test results are published as artifacts
- Coverage reports are generated
- Failed tests block merge requests

## Future Enhancements

### Planned Improvements
1. **Performance Tests**: Load testing for API endpoints
2. **Security Tests**: Penetration testing for authentication
3. **Contract Tests**: API contract validation
4. **Mutation Tests**: Code mutation testing for better coverage

### Test Maintenance
- Regular review of test coverage
- Update tests when API changes
- Remove obsolete tests
- Refactor test utilities as needed 