# 🎨 Theme System QA Testing Guide

## Overview

This document provides comprehensive QA testing instructions for verifying theme consistency across all pages and components of Docente++. Use this guide to ensure the theme system works correctly after updates or changes.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Testing Environment Setup](#testing-environment-setup)
- [Core Theme Functionality Tests](#core-theme-functionality-tests)
- [Cross-Page Consistency Tests](#cross-page-consistency-tests)
- [Color Palette Tests](#color-palette-tests)
- [Auto Mode Tests](#auto-mode-tests)
- [Edge Cases and Regression Tests](#edge-cases-and-regression-tests)
- [Accessibility Tests](#accessibility-tests)
- [Performance Tests](#performance-tests)
- [Known Issues](#known-issues)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Browser DevTools
- Screen reader (NVDA, JAWS, or VoiceOver) for accessibility testing
- Color contrast analyzer tool

### Test Environment
- Local development server running (`npm run serve`)
- Clean browser profile (or incognito/private mode)
- Clear localStorage before starting tests

### Setup Commands
```bash
# Start local server
npm run serve

# Run automated tests
npm test

# Run only theme tests
npm test -- tests/unit/theme.test.js
```

---

## Core Theme Functionality Tests

### Test 1: Light Mode Application

**Objective**: Verify light mode applies correctly across all pages

**Steps**:
1. Open the app at `http://localhost:8080`
2. Open Settings → Tema section
3. Select "Chiaro" (Light) mode
4. Click "Salva Tema"

**Expected Results**:
- [ ] Page background is light (white/off-white)
- [ ] Text is dark and readable
- [ ] Header uses primary color with light theme variant
- [ ] Cards and surfaces have light backgrounds
- [ ] `<html>` and `<body>` elements have `light-theme` class
- [ ] No `dark-theme` class present

**Verification**:
```javascript
// Open browser console and run:
document.documentElement.classList.contains('light-theme') // should be true
document.body.classList.contains('light-theme') // should be true
document.documentElement.classList.contains('dark-theme') // should be false
```

---

### Test 2: Dark Mode Application

**Objective**: Verify dark mode applies correctly across all pages

**Steps**:
1. Open the app
2. Open Settings → Tema section
3. Select "Scuro" (Dark) mode
4. Click "Salva Tema"

**Expected Results**:
- [ ] Page background is dark (#1C1B1F or similar)
- [ ] Text is light and readable
- [ ] Header uses primary color with dark theme variant
- [ ] Cards and surfaces have dark backgrounds
- [ ] `<html>` and `<body>` elements have `dark-theme` class
- [ ] No `light-theme` class present

**Verification**:
```javascript
// Open browser console and run:
document.documentElement.classList.contains('dark-theme') // should be true
document.body.classList.contains('dark-theme') // should be true
document.documentElement.classList.contains('light-theme') // should be false
```

---

### Test 3: Auto Mode (Dynamic Theme)

**Objective**: Verify auto mode follows system preferences

**Steps**:
1. Set system to light mode (OS preferences)
2. Open the app
3. Open Settings → Tema section
4. Select "Automatico (Dinamico)" mode
5. Click "Salva Tema"
6. Verify light theme is applied
7. Change system to dark mode
8. Wait a moment or reload the page

**Expected Results**:
- [ ] App starts in light mode when system is light
- [ ] App switches to dark mode when system changes to dark
- [ ] Theme updates automatically (may require reload)
- [ ] Correct theme classes are applied

**Note**: Some browsers may require page reload for system preference changes to take effect.

---

## Cross-Page Consistency Tests

### Test 4: Main App Theme Consistency

**Objective**: Ensure theme is consistent across all main app tabs

**Steps**:
1. Set theme to Dark mode with Blue color
2. Navigate through all tabs:
   - Home
   - Lezioni
   - Studenti
   - Classi
   - Attività
   - Valutazioni
   - Orario
   - Agenda
   - Assistente IA
   - Importa Documenti
   - Impostazioni

**Expected Results**:
- [ ] All pages use dark theme
- [ ] Blue primary color is visible on all pages
- [ ] Navigation sidebar maintains consistent theming
- [ ] Header maintains consistent theming
- [ ] All modals use dark theme
- [ ] No pages revert to light theme

---

### Test 5: In Classe Page Theme Consistency

**Objective**: Verify "In Classe" page has same theme as main app

**Steps**:
1. In main app, set theme to Dark mode with Teal color
2. Navigate to Orario tab
3. Click any lesson to enter "In Classe" page
4. Verify theme consistency

**Expected Results**:
- [ ] In Classe page opens with dark theme
- [ ] Teal color palette is applied
- [ ] Header uses correct theme colors
- [ ] All sections use dark theme
- [ ] Activities, homework, evaluations sections use dark theme
- [ ] Voice recording section uses dark theme
- [ ] Analytics section uses dark theme

**Critical Verification**:
```javascript
// On In Classe page, open console:
document.documentElement.classList.contains('dark-theme') // should be true
getComputedStyle(document.documentElement).getPropertyValue('--md-sys-color-primary') // should show teal color
```

---

### Test 6: Theme Persistence Across Pages

**Objective**: Verify theme persists when navigating between pages

**Steps**:
1. On main app, set theme to Light mode with Orange color
2. Open "In Classe" page (new window/tab)
3. Return to main app
4. Change theme to Dark mode with Pink color
5. Reload "In Classe" page
6. Return to main app and reload

**Expected Results**:
- [ ] Main app maintains theme across page reloads
- [ ] In Classe page loads with correct theme initially
- [ ] In Classe page updates to new theme after reload
- [ ] No theme flickering or FOUC (Flash of Unstyled Content)
- [ ] localStorage stores theme correctly

**Verification**:
```javascript
// Check localStorage
localStorage.getItem('docente-plus-plus-theme') // should be 'dark'
localStorage.getItem('docente-plus-plus-theme-color') // should be 'pink'
```

---

## Color Palette Tests

### Test 7: All Color Palettes (Light Mode)

**Objective**: Verify all 9 color palettes work in light mode

**Steps**:
For each color palette (purple, lilla, blue, teal, green, orange, pink, red, indigo):
1. Open Settings → Tema
2. Select "Chiaro" mode
3. Select the color palette
4. Click "Salva Tema"
5. Navigate to different pages

**Expected Results** (for each palette):
- [ ] Primary color changes to the selected palette
- [ ] Color is visible in header
- [ ] Color is visible in buttons
- [ ] Color is visible in active navigation items
- [ ] Color is visible in links
- [ ] Meta theme-color updates in browser bar
- [ ] Preview shows correct colors before applying

---

### Test 8: All Color Palettes (Dark Mode)

**Objective**: Verify all 9 color palettes work in dark mode

**Steps**:
Same as Test 7, but with "Scuro" mode selected

**Expected Results**:
- [ ] All palettes have appropriate dark mode variants
- [ ] Colors are lighter/desaturated compared to light mode
- [ ] Contrast ratios are sufficient for accessibility
- [ ] No colors are too bright or harsh
- [ ] All interactive elements are visible

---

### Test 9: Color Palette Switching

**Objective**: Verify smooth switching between color palettes

**Steps**:
1. Set theme to Dark mode
2. Switch rapidly between different colors:
   - Purple → Blue → Green → Orange → Red → Purple
3. Verify no visual glitches
4. Check that each color applies correctly

**Expected Results**:
- [ ] Color changes are immediate
- [ ] No flickering or visual artifacts
- [ ] CSS variables update correctly
- [ ] No console errors
- [ ] Previous color is fully replaced

---

## Auto Mode Tests

### Test 10: System Preference Detection

**Objective**: Verify system preference detection works correctly

**Steps**:
1. Clear localStorage
2. Set OS to light mode
3. Open app for the first time
4. Note the theme
5. Close app
6. Set OS to dark mode
7. Open app again

**Expected Results**:
- [ ] App defaults to "auto" mode on first launch
- [ ] App detects system light mode correctly
- [ ] App detects system dark mode correctly
- [ ] Preference is saved to localStorage

---

### Test 11: Auto Mode Switching

**Objective**: Verify auto mode responds to system changes

**Steps**:
1. Set theme to "Automatico (Dinamico)"
2. With OS in light mode, verify app is light
3. Change OS to dark mode
4. Wait or reload page
5. Change OS back to light mode

**Expected Results**:
- [ ] App switches to dark when OS goes dark
- [ ] App switches to light when OS goes light
- [ ] mediaQuery listener is active (check DevTools)
- [ ] Transitions are smooth

**Note**: Some browsers may require page reload for immediate effect.

---

## Edge Cases and Regression Tests

### Test 12: Multiple Window Synchronization

**Objective**: Verify theme changes sync across multiple windows

**Steps**:
1. Open main app in window A
2. Open main app in window B (separate window/tab)
3. In window A, change theme to Dark with Green
4. Check window B

**Expected Results**:
- [ ] Window B updates to match window A (may require reload)
- [ ] localStorage event propagates changes
- [ ] Both windows show identical theme

**Note**: Automatic sync across tabs requires storage event listeners. Manual reload may be needed.

---

### Test 13: Browser Compatibility

**Objective**: Test theme system across different browsers

**Browsers to Test**:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari (macOS/iOS)
- [ ] Edge
- [ ] Mobile browsers (Android, iOS)

**Expected Results**:
- [ ] Theme system works in all browsers
- [ ] CSS variables are supported
- [ ] localStorage works correctly
- [ ] matchMedia API works (for auto mode)
- [ ] No browser-specific issues

---

### Test 14: Rapid Theme Switching Stress Test

**Objective**: Ensure theme system handles rapid changes gracefully

**Steps**:
1. Open theme settings
2. Rapidly click different theme modes (light/dark/auto)
3. Rapidly click different color palettes
4. Switch between pages while changing themes

**Expected Results**:
- [ ] No JavaScript errors in console
- [ ] No memory leaks
- [ ] UI remains responsive
- [ ] Theme applies correctly after rapid changes
- [ ] No visual glitches or artifacts

---

### Test 15: localStorage Corruption Recovery

**Objective**: Verify graceful handling of corrupted theme data

**Steps**:
1. Open browser DevTools console
2. Corrupt theme data: `localStorage.setItem('docente-plus-plus-theme', 'invalid')`
3. Reload the page
4. Observe behavior

**Expected Results**:
- [ ] App falls back to default theme (auto mode, purple color)
- [ ] No JavaScript errors
- [ ] User can still change theme
- [ ] Invalid data is overwritten with valid values

---

## Accessibility Tests

### Test 16: Color Contrast Ratios

**Objective**: Verify WCAG AA compliance for all theme/color combinations

**Tools**: Use browser DevTools Accessibility panel or external contrast checker

**Steps**:
1. For each color palette in light mode:
   - Check text on background contrast
   - Check text on primary color contrast
   - Check interactive element contrast
2. Repeat for dark mode
3. Document any failures

**Expected Results**:
- [ ] All text has at least 4.5:1 contrast ratio (WCAG AA)
- [ ] Large text (18pt+) has at least 3:1 contrast
- [ ] Interactive elements have sufficient contrast
- [ ] Focus indicators are visible in all themes

**Reference**: [WCAG 2.1 Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

### Test 17: Screen Reader Compatibility

**Objective**: Ensure screen readers work with theme system

**Steps**:
1. Enable screen reader (NVDA, JAWS, VoiceOver)
2. Navigate to theme settings
3. Change theme mode
4. Change color palette
5. Verify announcements

**Expected Results**:
- [ ] Theme settings are announced correctly
- [ ] Radio buttons are accessible
- [ ] Changes are announced
- [ ] No hidden elements interfere with navigation

---

### Test 18: Keyboard Navigation

**Objective**: Verify theme settings are fully keyboard accessible

**Steps**:
1. Use only keyboard (Tab, Shift+Tab, Arrow keys, Enter, Space)
2. Navigate to Settings → Tema
3. Change theme mode using keyboard
4. Change color palette using keyboard
5. Save changes using keyboard

**Expected Results**:
- [ ] All controls are reachable via keyboard
- [ ] Focus indicators are visible
- [ ] Radio buttons work with arrow keys
- [ ] Enter/Space activates buttons
- [ ] No keyboard traps

---

## Performance Tests

### Test 19: Theme Application Performance

**Objective**: Measure theme switching performance

**Steps**:
1. Open browser DevTools Performance tab
2. Start recording
3. Change theme from light to dark
4. Stop recording
5. Analyze results

**Expected Results**:
- [ ] Theme change completes in < 100ms
- [ ] No layout thrashing
- [ ] No forced synchronous layouts
- [ ] CSS variable updates are efficient

---

### Test 20: Initial Load Performance

**Objective**: Ensure theme initialization doesn't slow page load

**Steps**:
1. Open browser DevTools Network tab
2. Clear cache
3. Load app
4. Check DOMContentLoaded and Load times

**Expected Results**:
- [ ] Theme initializes before first paint
- [ ] No FOUC (Flash of Unstyled Content)
- [ ] Page loads in < 2 seconds on fast connection
- [ ] theme.js loads and executes quickly

---

## Known Issues

### Issue 1: Theme Flicker on Page Load
**Description**: Brief flash of wrong theme when page loads  
**Workaround**: Theme is initialized as early as possible in the load sequence  
**Status**: Mitigated

### Issue 2: Auto Mode Requires Reload
**Description**: System theme changes require page reload to take effect in some browsers  
**Workaround**: Use manual theme switching for immediate feedback  
**Status**: Browser limitation

### Issue 3: Third-Party Components
**Description**: Some third-party components may not respect theme colors  
**Workaround**: Wrap components with theme-aware containers  
**Status**: By design

---

## Troubleshooting

### Theme Not Applying

**Symptoms**: Theme doesn't change when selected

**Checklist**:
- [ ] Check browser console for JavaScript errors
- [ ] Verify theme.js is loaded (check Network tab)
- [ ] Check localStorage is enabled (not in private mode)
- [ ] Clear browser cache and reload
- [ ] Try in incognito/private mode

**Debug Commands**:
```javascript
// Check if theme module is loaded
import('./js/theme.js').then(theme => {
  console.log('Theme module:', theme);
  console.log('Current theme:', theme.getThemePreference());
  console.log('Current color:', theme.getThemeColorPreference());
});

// Check DOM classes
console.log('HTML classes:', document.documentElement.className);
console.log('Body classes:', document.body.className);

// Check CSS variables
const primary = getComputedStyle(document.documentElement)
  .getPropertyValue('--md-sys-color-primary');
console.log('Primary color:', primary);
```

---

### Colors Look Wrong

**Symptoms**: Colors don't match selected palette

**Checklist**:
- [ ] Verify correct palette is saved in localStorage
- [ ] Check if CSS variables are defined
- [ ] Look for inline styles overriding colors
- [ ] Check for conflicting CSS
- [ ] Clear browser cache

**Debug Commands**:
```javascript
// Check all color variables
const colors = [
  '--md-sys-color-primary',
  '--md-sys-color-primary-container',
  '--md-sys-color-on-primary',
  '--md-sys-color-on-primary-container'
];

colors.forEach(color => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(color);
  console.log(`${color}: ${value}`);
});
```

---

### Theme Not Persisting

**Symptoms**: Theme resets on page reload

**Checklist**:
- [ ] Check if localStorage is enabled
- [ ] Verify not in private/incognito mode
- [ ] Check for localStorage quotas
- [ ] Look for conflicting scripts clearing storage

**Debug Commands**:
```javascript
// Check localStorage
console.log('Theme:', localStorage.getItem('docente-plus-plus-theme'));
console.log('Color:', localStorage.getItem('docente-plus-plus-theme-color'));

// Test localStorage
try {
  localStorage.setItem('test', 'test');
  console.log('localStorage is working');
  localStorage.removeItem('test');
} catch (e) {
  console.error('localStorage error:', e);
}
```

---

## Test Report Template

Use this template to document your QA test results:

```markdown
# Theme QA Test Report

**Date**: YYYY-MM-DD  
**Tester**: [Name]  
**Browser**: [Browser name and version]  
**OS**: [Operating system]

## Test Results Summary

- **Total Tests**: 20
- **Passed**: __
- **Failed**: __
- **Skipped**: __

## Failed Tests

### Test X: [Test Name]
**Status**: Failed  
**Expected**: [Description]  
**Actual**: [What happened]  
**Steps to Reproduce**: [Steps]  
**Screenshots**: [Attach if applicable]  
**Console Errors**: [Copy any errors]

## Recommendations

[List any recommended fixes or improvements]

## Sign-off

- [ ] All critical tests passed
- [ ] Theme system is production-ready
- [ ] Documentation is accurate

**Tester Signature**: __________  
**Date**: __________
```

---

## Quick Test Checklist

Use this abbreviated checklist for smoke testing:

- [ ] Light mode works on main app
- [ ] Dark mode works on main app
- [ ] Light mode works on In Classe page
- [ ] Dark mode works on In Classe page
- [ ] At least 3 color palettes work correctly
- [ ] Theme persists across page reloads
- [ ] Auto mode follows system preference
- [ ] No console errors when switching themes
- [ ] Theme picker UI works correctly
- [ ] Keyboard navigation works
- [ ] Basic contrast ratios are acceptable

---

## Additional Resources

- [Theme System Documentation](./theme.md)
- [Material Design 3 Guidelines](https://m3.material.io/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Chrome DevTools Accessibility](https://developer.chrome.com/docs/devtools/accessibility/)

---

**Last Updated**: 2025-10-19  
**Version**: 1.0.0  
**Maintainers**: Docente++ Team
