# Tests - Docente++

This directory contains automated tests for the Docente++ application.

## Test Infrastructure

The project uses **Playwright** for end-to-end testing. Playwright is already used in the project for PWA verification, so we're using the same framework for consistency.

## Running Tests

### Prerequisites

Install Playwright if not already installed:

```bash
npm install -D @playwright/test
npx playwright install
```

### Run All Tests

```bash
npx playwright test
```

### Run Specific Test File

```bash
npx playwright test tests/navigation.test.js
```

### Run Tests in UI Mode (Interactive)

```bash
npx playwright test --ui
```

### Run Tests with Browser Visible

```bash
npx playwright test --headed
```

### Generate Test Report

```bash
npx playwright test --reporter=html
npx playwright show-report
```

## Test Files

### `navigation.test.js`

Tests for the navigation system including:

- **Onboarding Flow Tests**
  - Onboarding modal display on first visit
  - Menu items disabled before onboarding completion
  - Profile completion enables all features
  - Corrupted data handling

- **Breadcrumb Navigation Tests**
  - Breadcrumb display and updates
  - Clickable breadcrumb links
  - Home navigation via breadcrumb

- **Navigation Features Tests**
  - Home button in header
  - Browser back/forward buttons
  - Keyboard shortcuts (Alt+Left to go back)
  - URL-based navigation
  - Tab switching via menu

- **Accessibility Tests**
  - Keyboard navigation in menu (Arrow keys)
  - ARIA labels and attributes
  - Focus management

## Test Coverage

Current test coverage includes:

- ✅ Onboarding flow and menu unlocking
- ✅ Breadcrumb navigation
- ✅ Browser history management
- ✅ Keyboard navigation
- ✅ Home button functionality
- ✅ URL parameter handling
- ✅ Accessibility features

## Adding New Tests

To add new tests:

1. Create a new test file in the `tests/` directory
2. Follow the Playwright testing patterns used in existing tests
3. Use descriptive test names that explain what is being tested
4. Include both positive and negative test cases
5. Test accessibility features where applicable

Example test structure:

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Feature Name', () => {
    test.beforeEach(async ({ page }) => {
        // Setup code
    });

    test('should do something', async ({ page }) => {
        // Test code
    });
});
```

## Continuous Integration

Tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run Playwright tests
  run: npx playwright test
```

## Test Best Practices

1. **Keep tests isolated** - Each test should be independent
2. **Use meaningful selectors** - Prefer data-testid, role, or label selectors
3. **Test user behavior** - Focus on what users do, not implementation details
4. **Handle async operations** - Use proper waiting strategies
5. **Test accessibility** - Include ARIA attributes and keyboard navigation
6. **Keep tests fast** - Avoid unnecessary waits

## Debugging Tests

### Debug Single Test

```bash
npx playwright test tests/navigation.test.js --debug
```

### Generate Trace

```bash
npx playwright test --trace on
npx playwright show-trace trace.zip
```

### Screenshots on Failure

Tests automatically capture screenshots on failure. Find them in:
```
test-results/
```

## Future Test Additions

Planned test additions:

- [ ] Unit tests for navigation.js module
- [ ] Integration tests for data persistence
- [ ] Performance tests for page load times
- [ ] Cross-browser compatibility tests
- [ ] Mobile responsiveness tests
- [ ] Visual regression tests

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Accessibility Testing with Playwright](https://playwright.dev/docs/accessibility-testing)
