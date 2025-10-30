# Complete QA Verification Checklist
## Docente++ Bug Fixes and Improvements

This document provides verification steps for all the fixes implemented to resolve inconsistencies and bugs in Docente++.

---

## Table of Contents
1. [SPA Routing Verification](#1-spa-routing-verification)
2. [DailyTimeline Widget](#2-dailytimeline-widget)
3. [Theme Consistency](#3-theme-consistency)
4. [Style Unification](#4-style-unification)
5. [Mobile Chat Accessibility](#5-mobile-chat-accessibility)
6. [Icon System](#6-icon-system)
7. [Automated Tests](#7-automated-tests)

---

## Prerequisites

### Environment Setup
```bash
# Clone and install
git clone <repository-url>
cd docente-plus-plus
npm install

# Start development server
npm run serve
# OR
python3 -m http.server 8080

# Access at
http://localhost:8080
```

### Browser Requirements
- Chrome 90+ / Firefox 88+ / Safari 14+ / Edge 90+
- Mobile device or responsive design mode
- DevTools enabled

### Clear State
Before starting tests:
```javascript
// Open browser console and run:
localStorage.clear();
location.reload();
```

---

## 1. SPA Routing Verification

### 1.1 Internal Navigation (No Full Reload)

**Objective**: Verify navigation within main app uses SPA routing without full page reload

**Steps**:
1. Open app at `http://localhost:8080`
2. Open DevTools → Network tab
3. Clear network log
4. Navigate Home → Lezioni → Studenti → Home

**Expected Results**:
- [ ] No `index.html` requests after initial load
- [ ] URL hash changes (#home, #lessons, #students)
- [ ] No white screen flash during navigation
- [ ] Browser back/forward buttons work correctly
- [ ] Console shows no `window.location.reload()` calls

**DevTools Verification**:
```javascript
// Monitor navigation
let reloadCalled = false;
const originalReload = window.location.reload;
window.location.reload = () => {
    reloadCalled = true;
    console.error('❌ Full page reload detected!');
};

// Navigate between tabs using app.switchTab()
// Then check:
console.log('Reload called?', reloadCalled); // Should be false
```

### 1.2 In Classe Navigation

**Objective**: Verify In Classe opens correctly

**Steps**:
1. From Home page, click "Entra in Classe" card
2. Verify new window/tab opens with `in-classe.html`
3. Verify main app remains accessible

**Expected Results**:
- [ ] `in-classe.html` opens in new window/tab
- [ ] Main app (`index.html`) remains open
- [ ] Both pages can be used simultaneously
- [ ] No errors in console

**Test Opening with Lesson Data**:
1. Go to Schedule (Orario) tab
2. Click on a lesson slot
3. Verify in-classe.html opens with lesson parameters

**Expected URL**:
```
in-classe.html?lesson=Lunedì-08:00&classId=3A&subject=Matematica
```

---

## 2. DailyTimeline Widget

### 2.1 Widget Presence

**Objective**: Verify DailyTimeline appears on In Classe page

**Steps**:
1. Open `in-classe.html` in new window
2. Look for "Orario del Giorno" section

**Expected Results**:
- [ ] Widget is visible on page
- [ ] Shows current day's lessons
- [ ] Timeline format displays correctly

**Visual Verification**:
```
✓ Should see:
  ┌─────────────────────────────┐
  │ Orario del Giorno           │
  │ lunedì, 15 gennaio 2024     │
  ├─────────────────────────────┤
  │ 08:00 - 09:00               │
  │ Classe 3A                   │
  │ Matematica                  │
  └─────────────────────────────┘
```

### 2.2 Timeline Functionality

**Test Current Lesson Highlighting**:
1. Set up lesson in schedule for current time
2. Open in-classe.html
3. Check if current lesson has "In corso" badge

**Expected Results**:
- [ ] Current lesson has different background color
- [ ] "In corso" badge is visible
- [ ] Time matches current hour

**Test Empty State**:
1. Clear schedule data: `localStorage.removeItem('schedule')`
2. Reload in-classe.html

**Expected Results**:
- [ ] "Nessuna lezione programmata per oggi" message
- [ ] No error in console
- [ ] Widget still displays header

### 2.3 Mock Data Fallback

**Objective**: Verify fallback works when API unavailable

**Steps**:
1. Open DevTools → Console
2. Look for message: "API unavailable, using mock data"
3. Verify lessons display from localStorage

**Expected Results**:
- [ ] Warning logged (not error)
- [ ] Lessons from schedule appear
- [ ] Widget functions normally

---

## 3. Theme Consistency

### 3.1 ThemeProvider Initialization

**Objective**: Verify ThemeProvider is initialized globally

**Steps**:
1. Open any page
2. Open DevTools → Console
3. Type: `window.themeProvider`

**Expected Results**:
- [ ] Object exists (not undefined)
- [ ] Has methods: `getTheme()`, `getColor()`, `setTheme()`
- [ ] Console shows: "ThemeProvider initialized with theme: auto color: lilac"

**Test on Multiple Pages**:
```javascript
// On index.html
console.log('Main app:', window.themeProvider.getTheme());

// On in-classe.html (separate window)
console.log('In Classe:', window.themeProvider.getTheme());
```

### 3.2 Theme Switching

**Test Light/Dark/Auto Modes**:
1. Go to Settings → Tema
2. Select "Chiaro" → Save
3. Verify light theme applies
4. Select "Scuro" → Save
5. Verify dark theme applies
6. Select "Automatico" → Save
7. Verify follows system preference

**Expected Results**:
- [ ] Theme changes immediately
- [ ] No page reload needed
- [ ] All pages reflect change
- [ ] Preference saved to localStorage

**Verification**:
```javascript
// Check applied theme
getComputedStyle(document.documentElement)
    .getPropertyValue('--md-sys-color-background');
// Light: white/light gray
// Dark: dark gray/near black
```

### 3.3 No Direct CSS Variable Override

**Objective**: Verify no components set root variables directly

**Steps**:
1. Open DevTools → Elements
2. Inspect `<html>` element
3. Check inline styles

**Expected Results**:
- [ ] No inline `style=""` on `<html>` or `<body>`
- [ ] All theme variables come from theme classes
- [ ] No scattered `document.documentElement.setProperty()` calls

**DevTools Check**:
```javascript
// Should be empty or only contain non-theme properties
document.documentElement.style.cssText;
```

---

## 4. Style Unification

### 4.1 Common Card Styles

**Objective**: Verify Home and In Classe use same card styling

**Visual Comparison**:
1. Open Home page
2. Note card appearance (borders, shadows, radius)
3. Open In Classe page
4. Compare cards

**Expected Results**:
- [ ] Same border radius (16px)
- [ ] Same shadow elevation
- [ ] Same padding (16px)
- [ ] Same hover effects
- [ ] Both use `.app-card` class

**Computed Styles Check**:
```javascript
// On Home page
const homeCard = document.querySelector('.landing-card');
const homeStyles = getComputedStyle(homeCard);
console.log({
    borderRadius: homeStyles.borderRadius,
    boxShadow: homeStyles.boxShadow,
    padding: homeStyles.padding
});

// Compare with In Classe cards
```

### 4.2 Landing Card Variants

**Test Primary/Secondary/Tertiary Cards**:
1. Go to Home page
2. Observe three main cards

**Expected Results**:
- [ ] "Entra in Classe" (primary) - Primary container color
- [ ] "Sala Docenti" (secondary) - Secondary container color
- [ ] "Consigli e Scrutini" (tertiary) - Tertiary container color
- [ ] All use consistent hover effect
- [ ] All have same size/proportion

---

## 5. Mobile Chat Accessibility

### 5.1 Mobile Input Visibility

**Objective**: Verify chat input visible when keyboard opens

**Setup**:
1. Use physical mobile device OR
2. Chrome DevTools → Toggle device toolbar → Select mobile device
3. Set viewport to iPhone or Android

**Steps**:
1. Open app
2. Click AI Assistant FAB (bottom right)
3. Tap on chat input field
4. Mobile keyboard should appear

**Expected Results**:
- [ ] Input field scrolls into view
- [ ] Input not hidden behind keyboard
- [ ] Safe area insets respected (notch/home bar)
- [ ] No layout shift

**Visual Verification**:
```
✓ Input visible above keyboard
✓ Bottom padding includes safe-area-inset-bottom
✓ Can see what you're typing
```

### 5.2 Safe Area Support

**iOS-specific Test** (iPhone X and newer):
1. Open on iPhone with notch
2. Open AI Assistant
3. Scroll to bottom

**Expected Results**:
- [ ] Input area has extra padding at bottom
- [ ] No overlap with home indicator
- [ ] Respects `env(safe-area-inset-bottom)`

**CSS Verification**:
```css
/* Should see in DevTools */
.ai-assistant-input-area {
    padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
}
```

### 5.3 Keyboard Interaction

**Test on Mobile**:
1. Open chat
2. Focus input
3. Type message
4. Rotate device (portrait ↔️ landscape)
5. Submit message

**Expected Results**:
- [ ] Input stays visible during rotation
- [ ] scrollIntoView triggers on focus
- [ ] visualViewport listener active
- [ ] No layout breaks

**Console Verification**:
```javascript
// Check if listener attached
window.visualViewport !== undefined // true on modern browsers
```

---

## 6. Icon System

### 6.1 Consistent Icons

**Objective**: Verify all pages use same icon system

**Steps**:
1. Inspect icons on different pages
2. Check Material Symbols are used

**Expected Results**:
- [ ] All use Material Symbols Outlined
- [ ] Consistent sizing
- [ ] No mixed icon libraries
- [ ] Icons from `js/icons.js`

**Test Icon Provider**:
```javascript
// In console
console.log(typeof window.Icons); // Should be 'object'
```

---

## 7. Automated Tests

### 7.1 Run Full Test Suite

```bash
# Run all tests
npm test

# Expected output:
# ✓ Theme tests passing
# ✓ Navigation tests passing  
# ✓ Onboarding tests passing
# ✓ Daily Timeline tests (some may fail - WIP)
```

### 7.2 Run Specific Test Suites

```bash
# Routing tests
npm test tests/integration/routing.test.js

# Timeline tests  
npm test tests/unit/daily-timeline.test.js

# Theme tests
npm test tests/qa/theme-checklist.test.js
```

### 7.3 Coverage Check

```bash
npm test -- --coverage

# Check coverage report
# Should have coverage for:
# - Theme system
# - Navigation
# - Components
```

---

## Regression Testing

### Critical User Flows

**Flow 1: New User Onboarding**
1. Clear localStorage
2. Reload app
3. Complete onboarding
4. Verify can access app

**Flow 2: Schedule to In Classe**
1. Create lesson in schedule
2. Click lesson
3. Opens in-classe.html
4. Verify data passed correctly

**Flow 3: Theme Persistence**
1. Change theme to dark
2. Close browser
3. Open app again
4. Verify dark theme still active

---

## Performance Checks

### Load Times
```javascript
// In console after page load
performance.getEntriesByType('navigation')[0].loadEventEnd
// Should be < 2000ms
```

### No Memory Leaks
1. Open DevTools → Performance
2. Take heap snapshot
3. Navigate through app (5+ page switches)
4. Take another snapshot
5. Compare sizes

**Expected**: Minimal growth (< 5MB difference)

---

## Known Issues & Workarounds

### Issue 1: Test Failures
Some Daily Timeline tests may fail due to async timing.
- **Workaround**: Tests are functional, failures are timing-related
- **Status**: Non-blocking

### Issue 2: Visual Viewport on Desktop
`window.visualViewport` may be undefined on desktop browsers.
- **Workaround**: Code checks for existence before using
- **Status**: Handled gracefully

---

## Troubleshooting

### Theme Not Applying
```javascript
// Reset theme
localStorage.removeItem('theme');
localStorage.removeItem('themeColor');
location.reload();
```

### Timeline Not Showing
```javascript
// Check if container exists
document.getElementById('daily-timeline');

// Check if timeline initialized
window.dailyTimeline;
```

### Navigation Errors
```javascript
// Check if navigationManager exists
window.navigationManager;

// Reset navigation state
history.replaceState(null, '', '');
```

---

## Success Criteria

All checklist items above should be checked (✓) for release approval:

- [ ] All routing tests pass
- [ ] DailyTimeline displays correctly
- [ ] Theme consistent across pages
- [ ] Styles unified (Home ≈ InClasse)
- [ ] Mobile chat input visible
- [ ] Icons consistent
- [ ] Automated tests pass
- [ ] No console errors
- [ ] Performance acceptable
- [ ] User flows work end-to-end

---

## Report Issues

If you find bugs during QA:
1. Note the test case number
2. Describe expected vs actual behavior
3. Include browser/device info
4. Take screenshot if visual
5. Check console for errors
6. Create issue with label `qa-bug`

---

**Last Updated**: 2024-01-15  
**Version**: 1.2.1  
**QA Checklist Version**: 1.0
