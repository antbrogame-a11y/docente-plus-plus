# QA Theme and Navigation Checklist

## Overview

This document provides a comprehensive QA checklist for verifying theme consistency, routing, agent/chat functionality, and icon usage across the Docente++ application.

## Table of Contents

1. [Theme Consistency](#theme-consistency)
2. [Routing and Navigation](#routing-and-navigation)
3. [InClasse Timeline](#inclasse-timeline)
4. [Agent and Chat](#agent-and-chat)
5. [Icon Unification](#icon-unification)
6. [Reproduction Steps](#reproduction-steps)

---

## Theme Consistency

### Global ThemeProvider

**Objective:** Verify that ThemeProvider is the single source of truth for all theme settings.

#### Checklist

- [ ] **ThemeProvider Initialization**
  - [ ] ThemeProvider is initialized in `app.js` on app startup
  - [ ] No duplicate theme initialization in other files
  - [ ] Theme preference is loaded from localStorage
  
- [ ] **Theme Variables**
  - [ ] All MD3 CSS variables are set on `:root`
  - [ ] Variables use consistent naming: `--md-sys-color-*`
  - [ ] No hardcoded colors in inline styles
  - [ ] No `document.documentElement.setProperty()` calls outside ThemeProvider

- [ ] **Theme Classes**
  - [ ] `light-theme` or `dark-theme` class is applied to `<html>` element
  - [ ] Theme class updates when theme is changed
  - [ ] No conflicting theme classes on other elements

- [ ] **Page-Level Theme**
  - [ ] Home page uses global theme
  - [ ] InClasse page uses global theme (no local overrides)
  - [ ] All modals use global theme
  - [ ] Settings page reflects current theme

### Style Consistency: Home vs InClasse

**Objective:** Ensure Home and InClasse pages use identical styling tokens.

#### Visual Checklist

- [ ] **Cards**
  - [ ] Same border-radius on both pages
  - [ ] Same box-shadow on both pages
  - [ ] Same background color
  - [ ] Same text color
  - [ ] Same padding

- [ ] **Buttons**
  - [ ] Primary buttons have same color
  - [ ] Secondary buttons have same color
  - [ ] Same border-radius
  - [ ] Same hover effects
  - [ ] Same active states

- [ ] **Typography**
  - [ ] Same font family
  - [ ] Same font sizes for headings
  - [ ] Same font weights
  - [ ] Same line heights
  - [ ] Same text colors

- [ ] **Spacing**
  - [ ] Same margin values
  - [ ] Same padding values
  - [ ] Same gap between elements

### Runtime Warnings

**Objective:** Verify development warnings for theme violations.

#### Checklist

- [ ] **Console Warnings**
  - [ ] Warning shown when component tries to override theme
  - [ ] Warning shown when hardcoded color is detected
  - [ ] Warning includes component name and violation type
  - [ ] Warnings only appear in development mode

- [ ] **Validation**
  - [ ] `validateThemeVariables()` runs on page load
  - [ ] Validation errors logged to console
  - [ ] Validation can be disabled in production

---

## Routing and Navigation

### SPA Navigation

**Objective:** Ensure all internal navigation uses pushState without page reloads.

#### Checklist

- [ ] **Internal Links**
  - [ ] No `<a href="page.html">` links for internal pages
  - [ ] All navigation uses `switchTab()` or navigation API
  - [ ] No `window.location.assign()` for internal routes
  - [ ] No `window.open()` for internal routes

- [ ] **Browser History**
  - [ ] `history.pushState` is used for navigation
  - [ ] Browser back button works correctly
  - [ ] Browser forward button works correctly
  - [ ] URL hash updates correctly

- [ ] **State Preservation**
  - [ ] Navigation state is preserved in history
  - [ ] Query parameters are maintained
  - [ ] Page doesn't reload when navigating

### Home to InClasse Navigation

**Objective:** Verify seamless navigation from Home to InClasse.

#### Test Steps

1. **Start on Home Page**
   - [ ] Load application
   - [ ] Verify you're on Home tab
   - [ ] Check URL is `#home`

2. **Navigate to InClasse**
   - [ ] Click "Entra in Classe" card
   - [ ] Verify no page reload (check network tab)
   - [ ] Verify URL changes to `#inClasse`
   - [ ] Verify InClasse content loads

3. **Navigate Back**
   - [ ] Click browser back button
   - [ ] Verify return to Home
   - [ ] Verify no page reload
   - [ ] URL changes back to `#home`

4. **Direct Navigation**
   - [ ] Type `#inClasse` in URL
   - [ ] Press Enter
   - [ ] Verify InClasse loads
   - [ ] No page reload

---

## InClasse Timeline

### Daily Timeline Display

**Objective:** Verify daily lessons are displayed correctly in InClasse.

#### Checklist

- [ ] **Timeline Rendering**
  - [ ] Timeline component is visible in InClasse
  - [ ] Current day's lessons are displayed
  - [ ] Lessons are ordered by time
  - [ ] Each lesson shows: title, time, subject, teacher

- [ ] **API Integration**
  - [ ] `fetchLessons(currentDay)` is called on page load
  - [ ] Lessons are fetched for correct date
  - [ ] Loading state is shown while fetching
  - [ ] Error state is shown on API failure

- [ ] **Fallback Mock Data**
  - [ ] Mock data is available when API is offline
  - [ ] Mock data structure matches real API
  - [ ] Development mode uses mock data
  - [ ] Mock data is documented

### Test Scenarios

#### Scenario 1: Lessons Exist

1. [ ] Navigate to InClasse
2. [ ] Verify timeline shows lessons
3. [ ] Check lessons are for current day
4. [ ] Verify lessons are chronologically ordered

#### Scenario 2: No Lessons

1. [ ] Navigate to InClasse on day with no lessons
2. [ ] Verify empty state is shown
3. [ ] Message says "No lessons today"
4. [ ] Suggests creating a lesson

#### Scenario 3: API Error

1. [ ] Simulate API failure
2. [ ] Verify error message is shown
3. [ ] Fallback mock data is used
4. [ ] User can retry

---

## Agent and Chat

### Global Agent Availability

**Objective:** Ensure Agent component is accessible from all pages.

#### Checklist

- [ ] **Agent FAB**
  - [ ] FAB is visible on Home page
  - [ ] FAB is visible on InClasse page
  - [ ] FAB is visible on all other pages
  - [ ] FAB maintains position when switching pages

- [ ] **Chat Modal**
  - [ ] Clicking FAB opens chat modal
  - [ ] Modal appears on top of all content
  - [ ] Modal can be closed with X button
  - [ ] Modal can be closed with Escape key

### Mobile Chat Visibility

**Objective:** Ensure chat input is visible and accessible on mobile.

#### Mobile Checklist (< 768px)

- [ ] **Chat Container**
  - [ ] Chat takes full viewport height
  - [ ] Safe area insets are respected
  - [ ] Bottom padding includes `env(safe-area-inset-bottom)`
  - [ ] No content hidden by browser chrome

- [ ] **Input Focus**
  - [ ] Input field is visible when focused
  - [ ] `scrollIntoView()` is called on focus
  - [ ] Virtual keyboard doesn't hide input
  - [ ] Input stays in view while typing

- [ ] **Virtual Keyboard**
  - [ ] Keyboard opening doesn't hide input
  - [ ] Viewport adjusts when keyboard opens
  - [ ] Send button remains accessible
  - [ ] Keyboard closes on send

### Test Steps: Mobile Chat

1. **Open Chat on Mobile**
   - [ ] Open app on mobile device or emulator (< 768px)
   - [ ] Click Agent FAB
   - [ ] Verify chat modal opens

2. **Focus Input**
   - [ ] Tap on chat input field
   - [ ] Virtual keyboard appears
   - [ ] Input field is still visible
   - [ ] Send button is accessible

3. **Type and Send**
   - [ ] Type a message
   - [ ] Input field stays in view
   - [ ] Click Send button
   - [ ] Message appears in chat
   - [ ] Input clears

4. **Landscape Mode**
   - [ ] Rotate device to landscape
   - [ ] Chat is still usable
   - [ ] Input is visible
   - [ ] Can send messages

---

## Icon Unification

### IconProvider Usage

**Objective:** Ensure all icons use the centralized IconProvider.

#### Checklist

- [ ] **Icon Import**
  - [ ] No local icon font imports in pages
  - [ ] All icons use Material Symbols
  - [ ] IconProvider is imported where needed
  - [ ] No duplicate icon libraries loaded

- [ ] **Icon Creation**
  - [ ] Icons created using `iconProvider.create()`
  - [ ] Or using `iconProvider.createHTML()`
  - [ ] Consistent icon sizes across app
  - [ ] Accessibility attributes are set

- [ ] **Icon Set**
  - [ ] Single icon set used (Material Symbols)
  - [ ] No mixing of icon libraries
  - [ ] Icon names are consistent
  - [ ] All icons render correctly

### Visual Verification

- [ ] **Check Each Page**
  - [ ] Home page icons match design
  - [ ] InClasse page icons match design
  - [ ] Navigation icons are consistent
  - [ ] Button icons are consistent
  - [ ] Modal icons are consistent

---

## Reproduction Steps

### Theme Override Detection

**Steps to reproduce theme override warning:**

1. Open browser DevTools
2. Navigate to any page
3. Open Console tab
4. Look for warnings like:
   ```
   ⚠️ [ThemeValidator] Component "MyComponent" is trying to override theme
   ```
5. Verify warning includes:
   - Component name
   - Override type
   - Suggested fix

### Navigation Without Reload

**Steps to verify SPA navigation:**

1. Open browser DevTools
2. Go to Network tab
3. Click "Entra in Classe" on Home page
4. Verify:
   - No new HTML document loaded
   - URL changes to `#inClasse`
   - Only XHR/Fetch requests for data

### Timeline Display

**Steps to verify timeline:**

1. Navigate to InClasse page
2. Verify timeline component visible
3. Check console for `fetchLessons()` call
4. Verify lessons for current day displayed
5. Check lessons are ordered by time

### Mobile Chat Test

**Steps to verify mobile chat:**

1. Open DevTools
2. Toggle device toolbar (mobile view)
3. Set viewport to 375x667 (iPhone SE)
4. Open Agent chat
5. Click input field
6. Verify:
   - Input field visible
   - Send button accessible
   - No layout shift issues

---

## Automated Tests

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm test -- routing.spec.js
npm test -- inclasse-timeline.spec.js
npm test -- theme-consistency.spec.js
npm test -- chat-visibility.spec.js

# Run integration tests only
npm run test:integration
```

### Expected Results

All tests should pass:
- ✅ Routing tests (15 tests)
- ✅ Timeline tests (20 tests)
- ✅ Theme tests (93 tests)
- ✅ Chat tests (12 tests)

---

## Sign-Off Checklist

Before marking this PR as ready:

- [ ] All automated tests pass
- [ ] Manual QA checklist completed
- [ ] No console errors in production mode
- [ ] Theme warnings only in development
- [ ] Documentation updated
- [ ] Screenshots captured for visual changes

---

## Known Issues

Document any known issues that don't block release:

1. **Issue:** Description
   - **Impact:** Low/Medium/High
   - **Workaround:** Temporary solution
   - **Fix planned:** Future milestone

---

## Contact

For questions about this QA process:
- Create an issue in the repository
- Tag with `qa` label
- Assign to QA team member
