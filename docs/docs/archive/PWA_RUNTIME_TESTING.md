# 🧪 PWA Runtime Testing Guide

## Overview

This guide provides step-by-step instructions for testing the PWA functionality of Docente++ in a runtime environment. These tests complement the automated static analysis tests.

---

## Prerequisites

- Modern web browser (Chrome, Edge, Firefox, or Safari)
- Local web server (Python, Node.js, or similar)
- Internet connection (for CDN resources)

---

## Test Setup

### Option 1: Python HTTP Server (Recommended for Quick Testing)

```bash
cd /path/to/docente-plus-plus
python3 -m http.server 8000
```

Then open: `http://localhost:8000`

### Option 2: Node.js HTTP Server

```bash
cd /path/to/docente-plus-plus
npx http-server -p 8000
```

Then open: `http://localhost:8000`

### Option 3: PHP Built-in Server

```bash
cd /path/to/docente-plus-plus
php -S localhost:8000
```

Then open: `http://localhost:8000`

---

## Test Suite

### Test 1: Service Worker Registration ✅

**Objective**: Verify that the Service Worker registers successfully

**Steps**:
1. Start local server
2. Open `http://localhost:8000` in Chrome/Edge
3. Open DevTools (F12 or Ctrl+Shift+I)
4. Go to **Application** tab → **Service Workers**

**Expected Results**:
- ✅ Service Worker shown as "activated and is running"
- ✅ Source: `/sw.js`
- ✅ Status: `#activated`
- ✅ No errors in console

**Screenshot Required**: Yes

**Pass Criteria**:
```
Service Worker Status: Activated
Errors: None
```

---

### Test 2: Manifest Loading ✅

**Objective**: Verify that manifest.json loads correctly and all properties are visible

**Steps**:
1. With local server running, open app
2. DevTools → **Application** tab → **Manifest**

**Expected Results**:
- ✅ Identity:
  - Name: "Docente++ - Gestione Didattica con IA"
  - Short name: "Docente++"
- ✅ Presentation:
  - Start URL: `/`
  - Theme color: `#4a90e2` (blue)
  - Background color: `#ffffff` (white)
  - Display: `standalone`
  - Orientation: `portrait-primary`
- ✅ Icons:
  - 192x192 icon visible (preview shown)
  - 512x512 icon visible (preview shown)
  - Both with "any maskable" purpose

**Screenshot Required**: Yes

**Pass Criteria**:
```
Manifest loaded: Yes
All fields present: Yes
Icons displayed: Yes (2 icons)
```

---

### Test 3: Cache Storage ✅

**Objective**: Verify that static assets are cached during Service Worker installation

**Steps**:
1. With local server running, open app
2. DevTools → **Application** tab → **Cache Storage**
3. Expand cache entries

**Expected Results**:
- ✅ Cache `docente-static-v1` exists
- ✅ Contains:
  - `/` or `/index.html`
  - `/styles.css`
  - `/app.js`
  - `/manifest.json`
  - `/icons/icon-192x192.png`
  - `/icons/icon-512x512.png`
- ✅ Cache `docente-dynamic-v1` exists (may be empty initially)

**Screenshot Required**: Yes

**Pass Criteria**:
```
Static cache present: Yes
Minimum 6 files cached: Yes
```

---

### Test 4: Offline Functionality ✅

**Objective**: Verify that the app works when offline

**Steps**:
1. With app loaded online, ensure all resources cached
2. DevTools → **Network** tab
3. Select **Offline** from throttling dropdown
4. Reload the page (Ctrl+R or F5)
5. Try navigating the app

**Expected Results**:
- ✅ Page loads successfully from cache
- ✅ UI is fully visible and interactive
- ✅ LocalStorage data is accessible
- ✅ No broken images or missing resources
- ✅ Console shows "[SW] Serving from cache" messages

**Screenshot Required**: Yes

**Pass Criteria**:
```
Offline load successful: Yes
UI fully functional: Yes
Console errors: None related to resources
```

---

### Test 5: Install Prompt (Desktop) ✅

**Objective**: Verify that the install prompt appears on desktop browsers

**Steps**:
1. Open app in Chrome/Edge (not in incognito mode)
2. Look for install icon in address bar (usually a ⊕ or computer icon)
3. Alternatively: Browser menu → "Install Docente++"

**Expected Results**:
- ✅ Install icon visible in address bar OR
- ✅ Install option in browser menu
- ✅ Clicking shows install dialog with:
  - App name: "Docente++"
  - App icon (192x192)
  - Install and Cancel buttons

**Screenshot Required**: Yes

**Pass Criteria**:
```
Install prompt available: Yes
App details correct: Yes
```

**Notes**:
- Install prompt may not appear if already installed
- Requires HTTPS in production (localhost is OK for testing)

---

### Test 6: Installation Process (Desktop) ✅

**Objective**: Test the full installation and uninstallation process

**Steps**:
1. Click Install button from Test 5
2. Confirm installation
3. Close browser tab
4. Open installed app from:
   - Windows: Start menu or Desktop shortcut
   - Mac: Applications folder or Dock
   - Linux: Application menu

**Expected Results**:
- ✅ App installs successfully
- ✅ Standalone window opens (no browser UI)
- ✅ App icon visible in system app list
- ✅ App works identically to browser version
- ✅ Service Worker active in installed app

**Uninstall Test**:
1. Browser settings → Installed Apps
2. Find "Docente++"
3. Uninstall

**Screenshot Required**: Yes (installed app window)

**Pass Criteria**:
```
Installation successful: Yes
Standalone mode: Yes
Uninstall successful: Yes
```

---

### Test 7: Service Worker Update Mechanism ✅

**Objective**: Verify that Service Worker updates are detected and applied

**Steps**:
1. With app running, modify `sw.js` (change version comment)
2. Save the file
3. Wait 30 minutes OR force update:
   - DevTools → Application → Service Workers
   - Click "Update" button
4. Observe console and UI

**Expected Results**:
- ✅ New Service Worker detected (status: "waiting")
- ✅ Update prompt appears (confirm dialog)
- ✅ After confirmation, page reloads
- ✅ New Service Worker activated
- ✅ Old caches removed

**Screenshot Required**: Yes (update prompt)

**Pass Criteria**:
```
Update detected: Yes
User prompted: Yes
Update applied: Yes
```

---

### Test 8: Network Strategies ✅

**Objective**: Verify that different resource types use correct caching strategies

**Steps**:
1. Clear all caches
2. Load app online
3. Check Network tab (keep DevTools open)
4. Reload page
5. Check where resources load from

**Expected Results**:

**First Load (Online)**:
- All resources from network
- Status codes: 200 (from server)

**Second Load (Online)**:
- Static assets from Service Worker (cache)
- Status shows: "Service Worker" or (from ServiceWorker)
- Console logs: "[SW] Serving from cache"

**Third Load (Offline)**:
- All cached resources from Service Worker
- No network requests for cached items

**Screenshot Required**: Yes (Network tab showing cache hits)

**Pass Criteria**:
```
Cache-first working: Yes
Offline fallback working: Yes
```

---

### Test 9: Console Error Check ✅

**Objective**: Ensure no JavaScript errors or warnings in console

**Steps**:
1. Open app with console visible
2. Perform various actions:
   - Navigate tabs
   - Add/edit/delete data
   - Export data
   - Import data
3. Monitor console for errors

**Expected Results**:
- ✅ No uncaught exceptions
- ✅ No Service Worker errors
- ✅ No manifest errors
- ⚠️ Info/log messages OK (e.g., "[SW] Installing Service Worker")

**Screenshot Required**: Yes (clean console or with only info messages)

**Pass Criteria**:
```
Critical errors: None
Service Worker errors: None
Manifest errors: None
```

---

### Test 10: Theme Color Application ✅

**Objective**: Verify that the theme color is applied to browser UI

**Steps**:
1. Install app (or open in browser)
2. Observe browser/system UI:
   - Address bar color (mobile)
   - Title bar color (desktop PWA)
   - Task switcher preview (mobile)

**Expected Results**:
- ✅ Theme color is `#4a90e2` (blue)
- ✅ Applied to:
  - Browser address bar (mobile Chrome/Edge)
  - Standalone app title bar (desktop)
  - App preview in task switcher (mobile)

**Screenshot Required**: Yes

**Pass Criteria**:
```
Theme color visible: Yes
Color matches #4a90e2: Yes
```

---

## Mobile Testing (Optional but Recommended)

### Test 11: Android Installation (Chrome) 📱

**Steps**:
1. Deploy app to HTTPS server or use ngrok/localtunnel
2. Open in Chrome on Android
3. Wait for install banner OR tap Menu (⋮) → "Install app"
4. Confirm installation
5. Open from home screen

**Expected Results**:
- ✅ Install banner appears (may require multiple visits)
- ✅ App installs to home screen
- ✅ Icon shows correctly (192x192 or 512x512)
- ✅ Opens in standalone mode (no browser UI)
- ✅ Works offline after first load

---

### Test 12: iOS Installation (Safari) 🍎

**Steps**:
1. Deploy app to HTTPS server
2. Open in Safari on iOS
3. Tap Share button (↗️)
4. Select "Add to Home Screen"
5. Confirm
6. Open from home screen

**Expected Results**:
- ✅ "Add to Home Screen" option available
- ✅ App icon visible in preview
- ✅ Custom name: "Docente++"
- ✅ Installs successfully
- ✅ Opens in standalone mode
- ⚠️ Note: iOS doesn't support Service Workers in all contexts

---

## Test Results Template

### Test Execution Log

**Date**: [Date]  
**Tester**: [Name]  
**Browser**: [Chrome/Edge/Firefox/Safari] [Version]  
**OS**: [Windows/Mac/Linux/Android/iOS] [Version]

| Test # | Test Name | Status | Notes |
|--------|-----------|--------|-------|
| 1 | Service Worker Registration | ⬜ Pass / ⬜ Fail | |
| 2 | Manifest Loading | ⬜ Pass / ⬜ Fail | |
| 3 | Cache Storage | ⬜ Pass / ⬜ Fail | |
| 4 | Offline Functionality | ⬜ Pass / ⬜ Fail | |
| 5 | Install Prompt | ⬜ Pass / ⬜ Fail | |
| 6 | Installation Process | ⬜ Pass / ⬜ Fail | |
| 7 | Update Mechanism | ⬜ Pass / ⬜ Fail | |
| 8 | Network Strategies | ⬜ Pass / ⬜ Fail | |
| 9 | Console Errors | ⬜ Pass / ⬜ Fail | |
| 10 | Theme Color | ⬜ Pass / ⬜ Fail | |
| 11 | Android Install | ⬜ Pass / ⬜ Fail / ⬜ N/A | |
| 12 | iOS Install | ⬜ Pass / ⬜ Fail / ⬜ N/A | |

**Overall Result**: ⬜ Pass / ⬜ Fail

**Issues Found**: 
- [List any issues or unexpected behavior]

**Screenshots Attached**: ⬜ Yes / ⬜ No

---

## Automated Testing Script

Run the automated static analysis tests:

```bash
node pwa-verification-test.js
```

This will test:
- File existence
- JSON syntax
- Service Worker code structure
- HTML integration
- Icon files
- Documentation

**Expected Output**: `🎉 All critical tests passed!`

---

## Troubleshooting Common Issues

### Issue: Service Worker Not Registering

**Symptoms**: No Service Worker in DevTools Application tab

**Solutions**:
1. Check browser console for errors
2. Verify app is served over HTTP/HTTPS (not file://)
3. Check for JavaScript syntax errors in sw.js
4. Try clearing browser cache and reloading

### Issue: Install Prompt Not Appearing

**Symptoms**: No install icon in address bar

**Solutions**:
1. Ensure app is served over HTTPS (localhost OK for testing)
2. Verify manifest.json is valid and linked
3. Check that Service Worker is registered
4. Try in a new incognito window
5. Ensure app meets PWA installability criteria

### Issue: Offline Mode Not Working

**Symptoms**: App fails when offline

**Solutions**:
1. Verify Service Worker is activated
2. Check Cache Storage has files
3. Wait for initial cache population
4. Check browser console for fetch errors
5. Try clearing caches and reloading online first

### Issue: Icons Not Showing

**Symptoms**: Default icons appear instead of custom ones

**Solutions**:
1. Verify icon files exist in `/icons/` directory
2. Check manifest.json icon paths are correct
3. Clear browser cache and reinstall app
4. Verify icon files are valid PNG format

---

## Success Criteria

For PWA verification to be considered successful:

- ✅ All static analysis tests pass (42/42)
- ✅ Service Worker registers without errors
- ✅ Manifest loads correctly
- ✅ App works offline
- ✅ App is installable
- ✅ No console errors
- ✅ Theme color applied
- ✅ Update mechanism functional

---

## Next Steps After Verification

1. **Deploy to Production**
   - Configure HTTPS (required for PWA in production)
   - Deploy to hosting (GitHub Pages, Netlify, Vercel, etc.)

2. **Run Lighthouse Audit**
   - DevTools → Lighthouse tab
   - Select "Progressive Web App"
   - Target score: ≥ 90/100

3. **Test on Real Devices**
   - Android: Chrome, Edge, Firefox
   - iOS: Safari
   - Desktop: Chrome, Edge, Firefox

4. **Monitor Performance**
   - Check cache sizes
   - Monitor Service Worker updates
   - Track installation rates

---

**Last Updated**: 2024
**Version**: 1.0
