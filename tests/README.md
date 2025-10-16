# Tests - Docente++

This directory contains test documentation and manual testing procedures for the Docente++ application.

## Test Infrastructure

The project uses **manual testing** procedures that don't require any external dependencies or npm packages. All tests can be performed using just a web browser.

## Running the Application

### Start the Development Server

No npm or node dependencies required. Just use Python's built-in HTTP server:

```bash
# Navigate to the project directory
cd /path/to/docente-plus-plus

# Start the server on port 8000
python3 -m http.server 8000

# Or on Windows
python -m http.server 8000
```

Then open your browser to: http://localhost:8000

## Manual Testing Procedures

### Test 1: Onboarding Flow

**Objective**: Verify that onboarding modal appears on first visit and menu items are locked

**Steps**:
1. Open browser DevTools (F12)
2. Go to Application/Storage → Local Storage
3. Clear all data for localhost:8000
4. Reload the page (Ctrl+R or Cmd+R)
5. **Expected**: Onboarding modal appears with form fields
6. **Expected**: Menu items show lock icon (🔒) and are disabled
7. **Expected**: Orange banner shows "Configurazione incompleta"

**Pass Criteria**:
- ✅ Modal displays "Benvenuto in Docente++"
- ✅ Name field is required (marked with *)
- ✅ Lock icons visible on menu items
- ✅ Clicking disabled menu items shows warning toast

### Test 2: Profile Completion

**Objective**: Verify menu unlocks after completing onboarding

**Steps**:
1. In the onboarding modal, enter "Test" in the Name field
2. Optionally fill Last Name and School Year
3. Click "Inizia ad Usare Docente++"
4. **Expected**: Modal closes
5. **Expected**: All menu items become enabled (no lock icons)
6. **Expected**: Orange banner disappears
7. **Expected**: Success toast appears

**Pass Criteria**:
- ✅ Modal closes successfully
- ✅ No lock icons on menu items
- ✅ Toast: "Profilo configurato! Benvenuto in Docente++."
- ✅ Can navigate to all sections

### Test 3: Breadcrumb Navigation

**Objective**: Verify breadcrumbs update and work correctly

**Steps**:
1. Complete onboarding if not already done
2. Observe breadcrumb shows: "Home"
3. Click "Studenti" in the menu
4. **Expected**: Breadcrumb updates to "Home / Studenti"
5. **Expected**: URL shows "?tab=students"
6. Click "Home" in the breadcrumb
7. **Expected**: Returns to home page
8. **Expected**: Breadcrumb shows only "Home"

**Pass Criteria**:
- ✅ Breadcrumbs visible at top of page
- ✅ Current page shown in breadcrumb trail
- ✅ Breadcrumb links are clickable
- ✅ Clicking breadcrumb navigates correctly

### Test 4: Home Button

**Objective**: Verify Home button is always accessible

**Steps**:
1. Navigate to any section (e.g., Classi, Lezioni, etc.)
2. Look for Home icon button in top-right of header
3. Click the Home button
4. **Expected**: Returns to home page
5. **Expected**: URL updates to "?tab=home"

**Pass Criteria**:
- ✅ Home button visible in header
- ✅ Home button has house icon
- ✅ Tooltip shows "Vai alla Home"
- ✅ Click navigates to home

### Test 5: Keyboard Navigation - Back

**Objective**: Verify Alt+Left arrow goes back

**Steps**:
1. Navigate to "Studenti" section
2. Then navigate to "Classi" section
3. Press `Alt + Left Arrow`
4. **Expected**: Goes back to "Studenti"
5. Press `Alt + Left Arrow` again
6. **Expected**: Goes back to "Home"

**Pass Criteria**:
- ✅ Alt+Left navigates back
- ✅ Breadcrumbs update correctly
- ✅ URL updates correctly

### Test 6: Keyboard Navigation - Home

**Objective**: Verify Alt+H goes to home

**Steps**:
1. Navigate to any section (e.g., "Agenda")
2. Press `Alt + H`
3. **Expected**: Returns to home page immediately

**Pass Criteria**:
- ✅ Alt+H navigates to home
- ✅ Works from any page

### Test 7: Browser Back/Forward

**Objective**: Verify browser buttons work

**Steps**:
1. Navigate through several sections: Home → Studenti → Classi → Lezioni
2. Click browser Back button
3. **Expected**: Goes back to "Classi"
4. Click browser Back button again
5. **Expected**: Goes back to "Studenti"
6. Click browser Forward button
7. **Expected**: Goes forward to "Classi"

**Pass Criteria**:
- ✅ Browser back button works
- ✅ Browser forward button works
- ✅ Navigation history maintained
- ✅ Breadcrumbs update with history

### Test 8: Direct URL Navigation

**Objective**: Verify URLs are bookmarkable

**Steps**:
1. Manually type in URL: http://localhost:8000/?tab=students
2. **Expected**: Opens directly to Students page
3. **Expected**: Breadcrumb shows "Home / Studenti"
4. Try another URL: http://localhost:8000/?tab=classes
5. **Expected**: Opens directly to Classes page

**Pass Criteria**:
- ✅ URLs with ?tab parameter work
- ✅ Correct page loads
- ✅ Breadcrumbs match current page

### Test 9: Menu Keyboard Navigation

**Objective**: Verify arrow keys navigate menu

**Steps**:
1. Click on first menu item to focus
2. Press `Arrow Down` or `Arrow Right`
3. **Expected**: Focus moves to next menu item
4. Press `Arrow Up` or `Arrow Left`
5. **Expected**: Focus moves to previous menu item
6. Press `Enter` on focused item
7. **Expected**: Navigates to that section

**Pass Criteria**:
- ✅ Arrow keys move focus
- ✅ Focus indicator visible
- ✅ Enter activates focused item

### Test 10: Corrupted Data Handling

**Objective**: Verify app handles corrupted localStorage

**Steps**:
1. Open DevTools → Application → Local Storage
2. Set `onboardingComplete` to `true`
3. Delete or clear `settings` key
4. Reload page
5. **Expected**: Orange banner appears
6. **Expected**: Menu items locked with 🔒
7. **Expected**: Toast: "Profilo incompleto. Completa i dati mancanti..."

**Pass Criteria**:
- ✅ App doesn't crash
- ✅ Clear guidance shown to user
- ✅ Can complete profile to fix issue

### Test 11: Mobile Responsiveness

**Objective**: Verify navigation works on mobile

**Steps**:
1. Open DevTools → Device Toolbar (Ctrl+Shift+M)
2. Select "iPhone 12" or similar mobile device
3. **Expected**: Hamburger menu icon visible
4. Click hamburger menu
5. **Expected**: Sidebar menu opens
6. **Expected**: Breadcrumb shows icons only (no text labels except current)
7. Navigate to a section
8. **Expected**: Menu auto-closes after selection

**Pass Criteria**:
- ✅ Mobile layout activates
- ✅ Hamburger menu works
- ✅ Touch targets ≥ 48x48px
- ✅ Breadcrumb optimized for mobile

### Test 12: Accessibility - Screen Reader

**Objective**: Verify screen reader compatibility

**Steps**:
1. Enable screen reader (NVDA on Windows, VoiceOver on Mac)
2. Navigate through page with Tab key
3. **Expected**: All interactive elements are announced
4. Navigate to breadcrumb
5. **Expected**: Announced as "Breadcrumb navigation"
6. Navigate to menu items
7. **Expected**: Each item announced with role and state

**Pass Criteria**:
- ✅ ARIA labels present
- ✅ Landmarks announced
- ✅ Focus order logical
- ✅ Disabled state announced

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
