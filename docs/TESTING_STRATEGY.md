# 🧪 Docente++ Testing Strategy

## Overview

This document outlines the testing strategy for Docente++ v1.2.2, focusing on **local, cost-free testing** that doesn't consume premium resources.

## Recent Changes (v1.2.2)

### Updated Test Scenarios

1. **Menu Accessibility Tests**: 
   - All menu items should be active from first launch
   - No disabled states based on onboarding
   - Profile banner appears but doesn't block functionality

2. **Mobile UX Tests**:
   - Settings accessibility on mobile (position in menu)
   - Theme settings integration in Settings page
   - Responsive behavior of new menu layout

3. **Theme Tests**:
   - Theme mode selection (Chiaro/Scuro/Automatico)
   - Theme color selection
   - Persistence across sessions
   - System preference detection (Auto mode)

## Testing Philosophy

### Core Principles

1. **Local First**: All tests run locally without external dependencies
2. **No Premium Resources**: No cloud testing services or paid APIs
3. **Fast Feedback**: Tests should complete in seconds
4. **Comprehensive Coverage**: Cover critical paths and edge cases
5. **Maintainable**: Tests should be easy to understand and update

### Testing Pyramid

```
         ┌──────────────┐
         │   E2E Tests  │  (Manual/Playwright - Local)
         │   (10-15%)   │
         ├──────────────┤
         │ Integration  │  (Jest - Local)
         │   (25-30%)   │
         ├──────────────┤
         │ Unit Tests   │  (Jest - Local)
         │   (55-65%)   │
         └──────────────┘
```

## Test Framework: Jest

### Why Jest?

- ✅ Runs entirely locally
- ✅ No external dependencies
- ✅ Built-in coverage reports
- ✅ Fast execution
- ✅ Great developer experience
- ✅ Free and open source

### Setup

```bash
# Install dependencies (one-time setup)
npm install

# Run all tests
npm test

# Run tests in watch mode (during development)
npm test:watch

# Run specific test suites
npm run test:unit
npm run test:navigation
npm run test:onboarding

# Generate coverage report
npm test -- --coverage
```

### Coverage Goals

| Category | Target Coverage |
|----------|----------------|
| Statements | ≥ 50% |
| Branches | ≥ 50% |
| Functions | ≥ 50% |
| Lines | ≥ 50% |

**Note**: These are minimum thresholds. Critical modules (onboarding, navigation, data, theme) should aim for 70-80% coverage.

## Test Categories

### 1. Unit Tests

**Purpose**: Test individual functions and modules in isolation

**Coverage**:
- Onboarding state management (now non-blocking)
- Navigation functions
- Data validation
- State recovery
- Browser storage health
- Theme management

**Location**: `tests/unit/`

**Examples**:
```javascript
// tests/unit/onboarding.test.js (UPDATED for v1.2.2)
test('menu should always be enabled regardless of profile state', () => {
  // Profile not complete
  expect(isMenuEnabled()).toBe(true);
  
  // Profile complete
  completeProfile({ teacherName: 'Mario' });
  expect(isMenuEnabled()).toBe(true);
});

// tests/unit/theme.test.js (NEW in v1.2.2)
test('should apply auto theme based on system preference', () => {
  applyTheme('auto');
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  expect(document.body.classList.contains('dark-theme')).toBe(isDark);
});

// tests/unit/navigation.test.js
test('should update breadcrumb when navigating', () => {
  navigateToPage('lessons');
  const breadcrumb = getBreadcrumb();
  expect(breadcrumb).toContain('Home / Lezioni');
});
```

### 2. Integration Tests

**Purpose**: Test how multiple modules work together

**Coverage**:
- Profile completion flow (optional, non-blocking)
- Navigation flow (page change → breadcrumb update → history push)
- Data persistence (save → load → validate)
- Theme application (selection → save → apply)

**Location**: `tests/integration/`

**Examples**:
```javascript
// tests/integration/profile-flow.test.js (UPDATED for v1.2.2)
test('profile completion removes banner but does not enable menu', () => {
  // Menu is already enabled
  expect(isMenuEnabled()).toBe(true);
  
  // Banner is visible
  expect(isBannerVisible()).toBe(true);
  
  // Complete profile
  completeProfile({ teacherName: 'Mario' });
  
  // Menu still enabled (was never disabled)
  expect(isMenuEnabled()).toBe(true);
  
  // Banner should be hidden
  expect(isBannerVisible()).toBe(false);
});
```

### 3. Manual E2E Tests

**Purpose**: Verify complete user workflows in real browser

**Coverage**:
- Full profile setup flow (optional)
- Navigation across all pages
- Browser back/forward buttons
- Keyboard navigation (Tab, Enter, Escape)
- Screen reader announcements
- Theme switching (Chiaro/Scuro/Auto)
- Mobile menu accessibility (Settings position)

**Location**: `tests/manual/`

**Checklist**: See "Manual Testing Checklist" section below

## Running Tests Locally

### Prerequisites

```bash
# Node.js and npm (should be installed)
node --version  # v18+ recommended
npm --version   # v9+ recommended
```

### First-Time Setup

```bash
# Install test dependencies
cd /path/to/docente-plus-plus
npm install

# Verify installation
npm test -- --version
```

### Daily Development Workflow

```bash
# 1. Start development server (terminal 1)
npm run serve

# 2. Run tests in watch mode (terminal 2)
npm run test:watch

# 3. Make code changes
# Tests automatically re-run on save

# 4. Check coverage before committing
npm test -- --coverage
```

### Continuous Integration (Optional)

For GitHub Actions or similar (still runs locally on CI server):

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test -- --coverage
```

## Test Structure

### Naming Conventions

```
tests/
├── unit/
│   ├── onboarding.test.js      # Onboarding state tests
│   ├── navigation.test.js      # Navigation tests
│   ├── data.test.js           # Data management tests
│   └── accessibility.test.js   # A11y attribute tests
├── integration/
│   ├── onboarding-flow.test.js
│   ├── navigation-flow.test.js
│   └── data-persistence.test.js
├── manual/
│   └── e2e-checklist.md       # Manual testing checklist
├── __mocks__/
│   ├── styleMock.js           # Mock CSS imports
│   └── localStorage.js        # Mock localStorage
└── setup.js                    # Jest configuration
```

### Test File Template

```javascript
// tests/unit/example.test.js
import { describe, test, expect, beforeEach } from '@jest/globals';

describe('Feature Name', () => {
  beforeEach(() => {
    // Reset state before each test
    localStorage.clear();
  });

  describe('Specific Behavior', () => {
    test('should do something specific', () => {
      // Arrange
      const input = 'test';
      
      // Act
      const result = functionToTest(input);
      
      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

## Manual Testing Checklist

### Onboarding & Menu States

- [ ] **Fresh install**: Menu is disabled, onboarding modal shown
- [ ] **Complete onboarding**: Enter name, submit → Menu enables
- [ ] **Corrupted state**: Manually set `onboardingComplete=true` but empty profile → Banner shown, menu disabled except Home/Settings
- [ ] **Profile recovery**: Complete profile from banner → Menu enables
- [ ] **Storage failure**: Disable localStorage → Error message shown

### Navigation

- [ ] **Breadcrumb updates**: Navigate to different pages → Breadcrumb reflects current path
- [ ] **Back button**: Click back → Returns to previous page
- [ ] **Home button**: Click home from any page → Returns to home
- [ ] **Browser back**: Use browser back button → Navigation works correctly
- [ ] **Browser forward**: Use browser forward button → Navigation works correctly
- [ ] **URL updates**: Check address bar → Hash updates (#lessons, #students, etc.)
- [ ] **Direct URL**: Enter `/#lessons` → Navigates to lessons page
- [ ] **Refresh**: Reload page → Stays on same page

### Keyboard Accessibility

- [ ] **Tab navigation**: Press Tab repeatedly → Focus moves through all interactive elements
- [ ] **Focus visible**: Focused elements have clear visual indicator
- [ ] **Enter activation**: Press Enter on focused button/link → Activates
- [ ] **Escape closes**: Press Escape in modal → Modal closes
- [ ] **Skip links**: Tab shows skip navigation links (if implemented)

### Screen Reader (Optional)

- [ ] **ARIA labels**: Screen reader announces button labels
- [ ] **Navigation role**: Navigation bar announced as navigation
- [ ] **Current page**: Current breadcrumb announced as "current page"
- [ ] **Form labels**: All form inputs have associated labels

## Best Practices

### DO ✅

- **Write tests first** (TDD) when fixing bugs
- **Test behavior, not implementation**
- **Use descriptive test names**: "should disable menu when onboarding incomplete"
- **Test edge cases**: empty strings, null values, corrupted data
- **Keep tests independent**: Each test should run in isolation
- **Mock external dependencies**: localStorage, fetch, etc.
- **Run tests before committing**

### DON'T ❌

- **Don't test implementation details**: Internal variable names, private functions
- **Don't skip error cases**: Always test failure paths
- **Don't use real APIs**: Mock all external services
- **Don't commit failing tests**: Fix or skip with `test.skip()`
- **Don't test third-party code**: Trust that libraries work
- **Don't write flaky tests**: Tests should be deterministic

## Debugging Tests

### Common Issues

**Issue**: Test fails locally but not in CI
```bash
# Solution: Check for environment differences
npm test -- --verbose
```

**Issue**: localStorage mock not working
```javascript
// Solution: Ensure setup.js is loaded
// Check jest.config in package.json has setupFilesAfterEnv
```

**Issue**: Module not found
```bash
# Solution: Check import paths are correct
# Use relative paths: import { x } from './file.js'
```

**Issue**: Timeout errors
```javascript
// Solution: Increase timeout for slow tests
test('slow operation', async () => {
  // ...
}, 10000); // 10 second timeout
```

### Debug Mode

```bash
# Run single test file
npm test -- tests/unit/navigation.test.js

# Run tests matching pattern
npm test -- --testNamePattern="breadcrumb"

# Run with debugging
node --inspect-brk node_modules/.bin/jest --runInBand

# Then open chrome://inspect in Chrome
```

## Cost Analysis

### Local Testing (FREE) ✅

| Activity | Cost | Time |
|----------|------|------|
| Jest unit tests | $0 | 2-5 seconds |
| Jest integration tests | $0 | 5-10 seconds |
| Manual browser testing | $0 | 5-10 minutes |
| Coverage reports | $0 | 1 second |
| **Total** | **$0** | **< 15 minutes** |

### Cloud Testing (AVOID) ❌

| Service | Cost | Notes |
|---------|------|-------|
| BrowserStack | ~$29/month | NOT needed - use local |
| Sauce Labs | ~$39/month | NOT needed - use local |
| Percy | ~$29/month | NOT needed - use local |
| **Total** | **~$97/month** | **UNNECESSARY** |

**Recommendation**: Stick with local testing. It's free, fast, and sufficient for this project.

## Future Enhancements

### Potential Additions (Optional)

1. **Playwright E2E Tests** (Still local and free)
   ```bash
   npm install -D @playwright/test
   npx playwright test
   ```

2. **Visual Regression Tests** (Free with Playwright)
   ```javascript
   await expect(page).toHaveScreenshot('page.png');
   ```

3. **Lighthouse CI** (Free, local performance testing)
   ```bash
   npm install -D @lhci/cli
   lhci autorun
   ```

4. **ESLint + Prettier** (Free, improves code quality)
   ```bash
   npm install -D eslint prettier
   ```

All of these run locally and are free to use.

## Resources

### Documentation
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/docs/)
- [Playwright](https://playwright.dev/)

### Learning
- [Kent C. Dodds - Testing JavaScript](https://testingjavascript.com/) (Free intro)
- [Jest Cheat Sheet](https://github.com/sapegin/jest-cheat-sheet)

### Tools
- [Jest VS Code Extension](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest)
- [Wallaby.js](https://wallabyjs.com/) (Live testing in editor)

## Conclusion

This testing strategy provides:

✅ **Zero cost** - No premium services needed  
✅ **Fast feedback** - Tests run in seconds  
✅ **Good coverage** - Critical paths protected  
✅ **Easy maintenance** - Clear structure and conventions  
✅ **Local development** - No internet required  

Start with unit tests for critical features (onboarding, navigation), add integration tests for workflows, and use manual testing for final verification.

**Remember**: Perfect is the enemy of good. Start with basic tests and improve over time.

---

**Version:** 1.0  
**Last Updated:** October 2025  
**Author:** Docente++ Team
