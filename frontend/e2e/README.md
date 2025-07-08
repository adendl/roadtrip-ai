# E2E Test Suite

This directory contains comprehensive end-to-end tests for the Roadtrip.ai application using Playwright.

## Test Organization

The E2E tests are organized into the following files:

### Core Test Files

- **`auth.spec.ts`** - Authentication flows (signup, login, logout)
- **`homepage.spec.ts`** - Homepage functionality and user interactions
- **`trip-creation.spec.ts`** - Trip creation scenarios from both home page and dashboard
- **`trip-management.spec.ts`** - Trip management features (viewing, deleting, navigating)
- **`navigation.spec.ts`** - Navigation flows and UI interactions
- **`edge-cases.spec.ts`** - Edge cases and error scenarios

### Configuration

- **`test-config.ts`** - Shared test utilities, data, and fixtures
- **`playwright.config.ts`** - Playwright configuration (in parent directory)

## Test Scenarios Covered

### Authentication (`auth.spec.ts`)
- ✅ User signup with valid credentials
- ✅ User login with valid credentials
- ✅ User logout functionality
- ✅ Form validation for invalid inputs
- ✅ Error handling for duplicate registrations
- ✅ Session management

### Homepage (`homepage.spec.ts`)
- ✅ Homepage loads with all sections
- ✅ Trip form works for logged out users
- ✅ Trip form works for logged in users
- ✅ Form validation and error handling
- ✅ Round trip toggle functionality
- ✅ Days increment/decrement
- ✅ Interest selection
- ✅ Navigation links
- ✅ Responsive design
- ✅ Features section display
- ✅ Testimonials section
- ✅ Newsletter signup
- ✅ Loading states

### Trip Creation (`trip-creation.spec.ts`)
- ✅ Creating trips from home page
- ✅ Creating trips from dashboard
- ✅ Simple one-way trips
- ✅ Complex round-trips with multiple interests
- ✅ Form validation
- ✅ Loading states and progress messages
- ✅ Trip data persistence
- ✅ Form reset after successful creation

### Trip Management (`trip-management.spec.ts`)
- ✅ Viewing trip details
- ✅ Navigating between trip cards
- ✅ Deleting trips
- ✅ Viewing day details
- ✅ Navigation between trip overview and day details
- ✅ Trip card information display
- ✅ Empty state handling
- ✅ Error handling for failed operations

### Navigation (`navigation.spec.ts`)
- ✅ Page navigation flows
- ✅ Access control (dashboard protection)
- ✅ Header navigation
- ✅ Browser back/forward navigation
- ✅ Responsive design testing
- ✅ Form interactions
- ✅ Loading states during authentication
- ✅ Error handling for invalid routes

### Edge Cases (`edge-cases.spec.ts`)
- ✅ Network failures
- ✅ Slow network conditions
- ✅ Invalid email formats
- ✅ Weak passwords
- ✅ Duplicate registrations
- ✅ Invalid login credentials
- ✅ Empty form submissions
- ✅ Very long input values
- ✅ Special characters in inputs
- ✅ Boundary values in trip forms
- ✅ Rapid form submissions
- ✅ Browser refresh during operations
- ✅ Session expiration
- ✅ Malformed API responses
- ✅ Server errors (500, 404)

## Running the Tests

### Prerequisites
- Node.js and npm installed
- Frontend development server running on `http://localhost:5173`
- Backend server running and accessible

### Commands

```bash
# Run all E2E tests
npm run test:e2e

# Run tests against local development server
npm run test:e2e:local

# Run specific test file
npx playwright test auth.spec.ts

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run tests in debug mode
npx playwright test --debug

# Run tests with specific browser
npx playwright test --project=chromium

# Generate test report
npx playwright show-report
```

### Test Configuration

The tests are configured to run against:
- **Local development**: `http://localhost:5173`
- **Deployed environment**: Configured in `playwright.config.ts`

## Test Data Management

### User Management
- Each test suite creates its own test users with unique timestamps
- Users are created in `beforeAll` hooks where needed
- Test users follow naming conventions for easy identification

### Trip Data
- Test trips are created with realistic data
- Different trip configurations are tested (simple, complex, short)
- Trip data is cleaned up between tests

### Utilities
The `test-config.ts` file provides:
- Shared test data constants
- Utility functions for common operations
- Custom test fixtures for authenticated pages
- Helper functions for trip creation and form management

## Test Patterns

### Page Object Model
Tests use Playwright's built-in page object model:
- Locators are defined using semantic selectors
- Actions are performed through page methods
- Assertions verify expected behavior

### Test Isolation
- Each test is independent
- Test data is created fresh for each test
- No shared state between tests

### Error Handling
- Tests include proper error handling
- Network failures are simulated and tested
- API error responses are mocked and verified

### Responsive Testing
- Tests run on multiple viewport sizes
- Mobile, tablet, and desktop layouts are verified
- Touch interactions are tested where applicable

## Debugging Tests

### Common Issues
1. **Selector Changes**: If UI elements change, update selectors in tests
2. **Timing Issues**: Use appropriate wait conditions and timeouts
3. **Network Issues**: Ensure backend is running and accessible
4. **State Issues**: Clear browser state between tests if needed

### Debug Commands
```bash
# Run single test with debug
npx playwright test --debug auth.spec.ts

# Run with trace
npx playwright test --trace on

# Show trace viewer
npx playwright show-trace trace.zip
```

### Logging
- Tests include console.log statements for debugging
- Network requests are logged
- Error messages are captured and logged

## Continuous Integration

The tests are designed to run in CI/CD pipelines:
- Headless mode by default
- Proper exit codes for pass/fail
- Artifact collection for failed tests
- Parallel execution support

## Maintenance

### Adding New Tests
1. Create new test file following naming convention
2. Use shared utilities from `test-config.ts`
3. Follow existing test patterns
4. Add appropriate documentation

### Updating Tests
1. Update selectors when UI changes
2. Adjust timeouts for slower operations
3. Update test data as needed
4. Verify all scenarios still work

### Test Data Cleanup
- Consider implementing cleanup scripts for test data
- Monitor database size in test environments
- Clean up test users periodically

## Performance Considerations

- Tests use appropriate timeouts
- Network requests are optimized
- Parallel execution is supported
- Resource cleanup is implemented

## Best Practices

1. **Use semantic selectors** (text, placeholder, role) over CSS classes
2. **Wait for elements** before interacting with them
3. **Handle async operations** properly
4. **Test error scenarios** not just happy paths
5. **Keep tests independent** and isolated
6. **Use descriptive test names** that explain the scenario
7. **Group related tests** in describe blocks
8. **Clean up test data** after tests complete 