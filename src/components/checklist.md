# ✅ Material UI Integration Checklist

This checklist guides the integration and validation of the Material UI post-login components for Docente++.

---

## 📋 Pre-Integration Setup

### Environment Setup

- [ ] **Install Node.js** (v16 or higher)
  ```bash
  node --version  # Should be v16+
  ```

- [ ] **Initialize npm project** (if not already done)
  ```bash
  npm init -y
  ```

- [ ] **Install required dependencies**
  ```bash
  npm install react react-dom @mui/material @emotion/react @emotion/styled @mui/icons-material
  ```

- [ ] **Install development dependencies**
  ```bash
  npm install -D vite @vitejs/plugin-react
  ```

### Project Structure

- [ ] Verify `/src/components/` directory exists
- [ ] Verify all 4 component files are present:
  - [ ] `MainScreen.jsx`
  - [ ] `OrarioGiornaliero.jsx`
  - [ ] `ImpegniGiornalieri.jsx`
  - [ ] `Altro.jsx`
- [ ] Verify `README.md` exists in `/src/components/`

---

## 🔧 Build Configuration

### Vite Configuration

- [ ] **Create `vite.config.js`** in project root:
  ```javascript
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react';
  
  export default defineConfig({
    plugins: [react()],
    root: './',
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: {
          main: './index.html'
        }
      }
    }
  });
  ```

- [ ] **Create entry point** `src/index.jsx`:
  ```jsx
  import React from 'react';
  import ReactDOM from 'react-dom/client';
  import MainScreen from './components/MainScreen';
  
  const root = ReactDOM.createRoot(document.getElementById('app-root'));
  root.render(
    <React.StrictMode>
      <MainScreen />
    </React.StrictMode>
  );
  ```

- [ ] **Update package.json** scripts:
  ```json
  {
    "scripts": {
      "dev": "vite",
      "build": "vite build",
      "preview": "vite preview"
    }
  }
  ```

### HTML Integration

- [ ] **Option A: Create new React-only page** (`app.html`):
  ```html
  <!DOCTYPE html>
  <html lang="it">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Docente++ - App</title>
  </head>
  <body>
    <div id="app-root"></div>
    <script type="module" src="/src/index.jsx"></script>
  </body>
  </html>
  ```

- [ ] **Option B: Integrate into existing index.html**:
  ```html
  <!-- Add to existing index.html -->
  <div id="app-root" style="display:none;"></div>
  <script type="module" src="/src/index.jsx"></script>
  ```

- [ ] **Add conditional rendering logic** in app.js:
  ```javascript
  // Show React app after login
  function showReactApp() {
    document.getElementById('app-container').style.display = 'none';
    document.getElementById('app-root').style.display = 'block';
  }
  ```

---

## 🧪 Component Testing

### MainScreen Component

- [ ] **Run development server**:
  ```bash
  npm run dev
  ```

- [ ] **Visual checks**:
  - [ ] App bar displays correctly
  - [ ] Bottom navigation is visible at bottom
  - [ ] Three navigation items are present (Orario, Impegni, Altro)
  - [ ] Theme colors applied (blue primary, orange secondary)

- [ ] **Functional checks**:
  - [ ] Clicking "Orario" shows OrarioGiornaliero component
  - [ ] Clicking "Impegni" shows ImpegniGiornalieri component
  - [ ] Clicking "Altro" shows Altro component
  - [ ] App bar title updates when switching sections
  - [ ] Navigation state persists when switching tabs

- [ ] **Mobile responsive**:
  - [ ] Test on mobile device or DevTools device emulation
  - [ ] Bottom navigation is thumb-accessible
  - [ ] Content scrolls properly
  - [ ] No horizontal overflow

### OrarioGiornaliero Component

- [ ] **Visual checks**:
  - [ ] Date header displays correctly (in Italian)
  - [ ] Info alert is visible
  - [ ] Placeholder lessons render in list format
  - [ ] Icons and chips display correctly
  - [ ] Hover effect works on list items

- [ ] **Content checks**:
  - [ ] Date is formatted correctly (e.g., "lunedì 8 gennaio 2025")
  - [ ] Each lesson shows: time, subject, class, room
  - [ ] Chips show class names
  - [ ] Empty state displays when no lessons

- [ ] **Future integration points identified**:
  - [ ] TODO comments for data integration are clear
  - [ ] Ready to accept props or context data

### ImpegniGiornalieri Component

- [ ] **Visual checks**:
  - [ ] Date header with secondary color (orange)
  - [ ] Task list displays correctly
  - [ ] Status icons render (✓ completed, ⏳ in-progress)
  - [ ] Priority chips show correct colors (red/orange/gray)
  - [ ] Progress bars display for in-progress tasks

- [ ] **Content checks**:
  - [ ] Each task shows: title, status, priority, due date
  - [ ] Progress percentage displays correctly
  - [ ] Edit icon button is visible
  - [ ] Completed tasks have strikethrough text

- [ ] **Interactive checks**:
  - [ ] Edit button is clickable (currently no action)
  - [ ] Hover effects work

### Altro Component

- [ ] **Visual checks**:
  - [ ] Info alert explains usage-based ordering
  - [ ] All 8 features are listed
  - [ ] Icons display correctly for each feature
  - [ ] Descriptions are visible
  - [ ] Usage count chips appear (initially none)

- [ ] **Functional checks**:
  - [ ] Clicking a feature increments its counter
  - [ ] Counter chip appears after first click
  - [ ] Features reorder after usage changes
  - [ ] Most-used features move to top

- [ ] **localStorage checks**:
  - [ ] Open DevTools → Application → Local Storage
  - [ ] Verify `altroUsage` key exists
  - [ ] Click features and verify JSON updates
  - [ ] Refresh page and verify order persists
  - [ ] Clear localStorage and verify reset

- [ ] **Testing script**:
  ```javascript
  // Run in browser console
  // 1. Clear data
  localStorage.removeItem('altroUsage');
  
  // 2. Manually set usage
  localStorage.setItem('altroUsage', JSON.stringify({
    'stats': 10,
    'settings': 5,
    'help': 2
  }));
  
  // 3. Refresh and verify order: stats > settings > help > others
  ```

---

## 🔗 Data Integration

### Connect to app.js Data

- [ ] **Pass data via props** (recommended):
  ```javascript
  // In app.js or parent
  const appData = {
    lessons: app.lessons,
    activities: app.activities,
    settings: app.settings
  };
  
  root.render(<MainScreen data={appData} />);
  ```

- [ ] **Use Context API**:
  ```jsx
  // Create AppContext.jsx
  export const AppContext = React.createContext();
  
  // Wrap MainScreen
  <AppContext.Provider value={appData}>
    <MainScreen />
  </AppContext.Provider>
  ```

- [ ] **Update components to use real data**:
  - [ ] OrarioGiornaliero: Replace `placeholderLessons`
  - [ ] ImpegniGiornalieri: Replace `placeholderTasks`
  - [ ] Test with real data from app.js

### localStorage Integration

- [ ] Verify Altro usage data doesn't conflict with existing keys
- [ ] Test localStorage persistence across browser sessions
- [ ] Add error handling for localStorage quota exceeded

---

## 🌐 Backend Preparation (Future)

### Altro Component Backend Sync

- [ ] **Review backend extension points** in `Altro.jsx`:
  - [ ] `syncUsageDataToBackend()` function
  - [ ] `fetchUsageDataFromBackend()` function

- [ ] **API endpoint planning**:
  - [ ] Define endpoint: `POST /api/user/feature-usage`
  - [ ] Define schema for usage data
  - [ ] Plan authentication (JWT, OAuth, etc.)

- [ ] **When ready to implement**:
  - [ ] Uncomment sync functions in Altro.jsx
  - [ ] Add authentication tokens
  - [ ] Test with backend API
  - [ ] Handle sync errors gracefully

---

## 📱 Mobile & Responsive Testing

### Device Testing

- [ ] **iPhone/iOS Safari**:
  - [ ] Bottom navigation accessible
  - [ ] No zoom on input focus
  - [ ] Touch targets are 44px minimum
  - [ ] Scrolling is smooth

- [ ] **Android/Chrome**:
  - [ ] Bottom navigation works
  - [ ] Material Design guidelines followed
  - [ ] Back button navigation (if applicable)

- [ ] **Tablet**:
  - [ ] Layout adapts appropriately
  - [ ] Content uses available space
  - [ ] Bottom nav still makes sense

### Browser Testing

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (macOS/iOS)
- [ ] Test in incognito/private mode

---

## 🎨 Styling & Theme

### Theme Customization

- [ ] Review default theme colors in `MainScreen.jsx`
- [ ] Adjust primary color if needed: `#4a90e2` → `#yourcolor`
- [ ] Adjust secondary color if needed: `#f39c12` → `#yourcolor`
- [ ] Test theme changes across all components

### CSS Conflicts

- [ ] Check for conflicts with existing `styles.css`
- [ ] Verify Material UI styles take precedence
- [ ] Test component isolation (no style bleeding)

---

## ♿ Accessibility

- [ ] **Keyboard navigation**:
  - [ ] Tab through all interactive elements
  - [ ] Enter/Space activates buttons
  - [ ] Arrow keys navigate bottom nav (if applicable)

- [ ] **Screen reader**:
  - [ ] ARIA labels present on navigation items
  - [ ] Section changes announced
  - [ ] Lists are properly structured

- [ ] **Color contrast**:
  - [ ] Text meets WCAG AA standards (4.5:1)
  - [ ] Focus indicators visible
  - [ ] Status colors distinguishable

---

## 🚀 Performance

- [ ] **Bundle size**:
  ```bash
  npm run build
  # Check dist/ folder size
  ```

- [ ] **Load time**:
  - [ ] Initial load < 3s on 3G
  - [ ] Navigation between sections is instant
  - [ ] No layout shifts

- [ ] **Optimization**:
  - [ ] Lazy load components if needed
  - [ ] Tree-shake unused MUI components
  - [ ] Compress production build

---

## 📦 Production Build

- [ ] **Build for production**:
  ```bash
  npm run build
  ```

- [ ] **Verify build output**:
  - [ ] Check `dist/` folder
  - [ ] Test with `npm run preview`
  - [ ] Verify all assets bundled

- [ ] **Deploy checklist**:
  - [ ] Update Service Worker cache (sw.js)
  - [ ] Test offline functionality
  - [ ] Verify PWA still works

---

## 📝 Documentation

- [ ] **Component README**:
  - [ ] Review `/src/components/README.md`
  - [ ] Update with any customizations
  - [ ] Add integration notes

- [ ] **Main README**:
  - [ ] Update project structure section
  - [ ] Add React/MUI to tech stack
  - [ ] Document new features

- [ ] **Code comments**:
  - [ ] Verify TODO comments are clear
  - [ ] Extension points documented
  - [ ] Complex logic explained

---

## 🐛 Bug Tracking

### Known Issues

- [ ] Document any issues found during testing
- [ ] Create GitHub issues for bugs
- [ ] Prioritize critical vs nice-to-have fixes

### Issue Template

```markdown
**Component**: [MainScreen/OrarioGiornaliero/ImpegniGiornalieri/Altro]
**Issue**: [Brief description]
**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
**Expected**: [What should happen]
**Actual**: [What actually happens]
**Browser/Device**: [e.g., Chrome 120 on Android 14]
```

---

## ✨ Final Validation

### Pre-Launch Checklist

- [ ] All components render without errors
- [ ] No console errors or warnings
- [ ] localStorage usage works correctly
- [ ] Responsive on mobile, tablet, desktop
- [ ] Accessible via keyboard and screen reader
- [ ] Performance is acceptable
- [ ] Documentation is complete
- [ ] Code is clean and commented

### User Acceptance Testing

- [ ] Demo to stakeholders
- [ ] Gather feedback
- [ ] Make adjustments based on feedback
- [ ] Final review and approval

---

## 🎯 Post-Launch

### Monitoring

- [ ] Track usage analytics (if implemented)
- [ ] Monitor for JavaScript errors
- [ ] Collect user feedback

### Future Enhancements

- [ ] Review TODO comments in code
- [ ] Prioritize feature additions:
  - [ ] Backend sync for Altro usage
  - [ ] Drag-and-drop reordering
  - [ ] Real data integration
  - [ ] Dark mode
  - [ ] Custom themes

---

## 📞 Support & Resources

- **Component README**: `/src/components/README.md`
- **Material UI Docs**: https://mui.com/material-ui/getting-started/
- **React Docs**: https://react.dev/
- **GitHub Issues**: [Repository Issues](https://github.com/antbrogame-a11y/docente-plus-plus/issues)

---

## ✅ Sign-Off

- [ ] Developer: Components implemented and tested
- [ ] Code Review: Code reviewed and approved
- [ ] QA: Testing complete, no critical bugs
- [ ] Product Owner: Features meet requirements
- [ ] Deploy: Ready for production deployment

---

**Checklist Version**: 1.0.0  
**Last Updated**: 2025-01-XX  
**Maintained By**: Docente++ Development Team
