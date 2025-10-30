# 🧭 Docente++ - Navigation Guide

## Overview

Docente++ v1.2.2 includes a comprehensive, accessible navigation system with key improvements:

- **Always-active menu** (NEW): All menu items are accessible from the first launch, no onboarding blocks
- **Mobile-optimized layout** (NEW): Settings moved higher in the mobile menu for easy access
- **Breadcrumb navigation** for clear page hierarchy
- **Back button** with browser history integration
- **Persistent Home button** for quick return to main page
- **Full keyboard accessibility** (Tab navigation, ARIA labels, visible focus)
- **Browser history management** (back/forward button support)

## Key Changes in v1.2.2

### Always-Active Menu

**Previous behavior (v1.2.1 and earlier):**
- Menu items were disabled until onboarding completion
- Lock icons (🔒) indicated blocked features
- Tooltips explained why items were disabled

**New behavior (v1.2.2):**
- ✅ **All menu items are always active and clickable**
- ✅ **No more blocking or disabled states**
- ✅ **Complete exploration from first launch**
- ℹ️ Optional banner suggests profile completion

### Mobile Menu Optimization

**Settings position:**
- **Desktop**: Position unchanged (near bottom of menu)
- **Mobile**: **Moved higher** in the menu (after main content sections)

**Mobile menu order:**
1. Home
2. Lezioni
3. Studenti
4. Classi
5. Attività
6. Valutazioni
7. Orario
8. Agenda
9. Assistente IA
10. Importa Documenti
11. **⚙️ Impostazioni** (moved up for better accessibility)
12. 🔔 Notifiche

**Rationale**: On mobile devices, accessing Settings is crucial for initial configuration. Moving it higher reduces scrolling and improves first-time user experience.

## Navigation Components

### 1. Breadcrumb (Briciole di Pane)

The breadcrumb shows your current location in the app hierarchy and allows quick navigation to parent pages.

**Features:**
- Always shows "Home" as the root
- Current page is highlighted in bold
- Click any breadcrumb link to navigate to that page
- Responsive: scrolls horizontally on small screens
- Fully keyboard accessible with Tab and Enter keys

**Example:**
```
Home / Lezioni
Home / Studenti
Home / Impostazioni
```

**Usage:**
- The breadcrumb automatically updates when you navigate between pages
- Links are generated dynamically based on current page
- Use keyboard Tab to focus on links, Enter to activate

### 2. Back Button

Navigate to the previous page using the browser's history.

**Features:**
- Shows "← Indietro" with clear icon
- Uses browser's native history (works with browser back button)
- Responsive: shows only icon on mobile
- Keyboard accessible: Tab to focus, Enter to activate
- Has clear focus indicator for accessibility

**Fallback Behavior:**
- If no history exists, clicking Back navigates to Home
- This ensures users never get "stuck"

### 3. Home Button

Always visible button to return to the homepage.

**Features:**
- Primary action button (purple/themed color)
- Shows "🏠 Home" text on desktop
- Icon-only on mobile for space efficiency
- Always accessible regardless of navigation state

**Why It's Important:**
- Homepage is the "root" of the app
- Provides a consistent way to "reset" navigation
- Helps users who feel lost or want to start over

## Navigation Bar Layout

```
┌──────────────────────────────────────────────────────────┐
│  [← Indietro]  Home / Current Page  [🏠 Home]           │
└──────────────────────────────────────────────────────────┘
     Back         Breadcrumb            Home
```

The navigation bar is:
- **Sticky**: Stays visible when scrolling
- **Positioned**: Below the main header
- **Responsive**: Adapts to different screen sizes

## Accessibility Features

### Keyboard Navigation
- **Tab**: Move between navigation elements
- **Shift+Tab**: Move backwards
- **Enter/Space**: Activate buttons and links
- **Focus visible**: Clear blue outline when focused

### Screen Readers
- All buttons have `aria-label` attributes
- Navigation bar has `role="navigation"`
- Breadcrumb has descriptive `aria-label`
- Current page marked with `aria-current="page"`

### Visual Accessibility
- **High contrast mode**: Thicker borders and outlines
- **Reduced motion**: Animations disabled for users who prefer less motion
- **Color contrast**: WCAG AAA compliant
- **Focus indicators**: Visible and prominent

## Browser History Integration

The navigation system integrates with the browser's history API:

**What This Means:**
- Browser's back/forward buttons work correctly
- URLs update to reflect current page (#lessons, #students, etc.)
- Bookmarking specific pages works
- Refresh preserves your current page

**Technical Details:**
- Uses `history.pushState()` to add history entries
- Listens to `popstate` events for back/forward buttons
- Maintains internal navigation state for consistency

## Usage Examples

### For Users

**Example 1: Navigate to a page and back**
1. Click "Lezioni" in sidebar → Breadcrumb shows "Home / Lezioni"
2. Click "← Indietro" → Returns to Home
3. Browser's back button also works!

**Example 2: Quick return to home**
1. Navigate through several pages
2. Click "🏠 Home" button at any time
3. Instantly return to homepage

**Example 3: Keyboard navigation**
1. Press Tab repeatedly to move through navigation elements
2. Press Enter on any focused element to activate it
3. Use Shift+Tab to go backwards

### For Developers

**Navigate programmatically:**
```javascript
import { navigateToPage, goBack, goHome } from './js/navigation.js';

// Navigate to a specific page
navigateToPage('lessons');
navigateToPage('students', { classId: '123' }); // with params

// Go back
goBack();

// Go to home
goHome();
```

**Access navigation manager:**
```javascript
// Navigation manager is globally accessible
window.navigationManager.navigateToPage('settings');
window.navigationManager.goBack();
window.navigationManager.navigateToHome();
```

**Listen for navigation changes:**
```javascript
// The navigation system automatically updates breadcrumb and triggers page switches
// No additional listeners needed - it integrates with existing switchTab() function
```

## Responsive Behavior

### Desktop (> 768px)
- Full navigation bar with text labels
- "← Indietro" and "🏠 Home" show text
- Breadcrumb shows full path

### Mobile (≤ 768px)
- Compact navigation bar
- Icons only for back/home buttons
- Breadcrumb with smaller text, scrollable if needed
- Touch-friendly button sizes (min 36px)

## Best Practices

### For Users
1. **Use breadcrumbs** to understand where you are
2. **Use Home button** when you want to start over
3. **Use Back button** to retrace your steps
4. **Browser buttons work** - don't worry about breaking navigation

### For Developers
1. **Always use navigateToPage()** instead of direct switchTab()
2. **Update page titles** when adding new pages to breadcrumb
3. **Test keyboard navigation** on all new pages
4. **Maintain URL sync** with page state

## Troubleshooting

### Navigation doesn't work
- Check browser console for errors
- Ensure `navigation.js` is loaded
- Verify `initNavigation()` is called during app init

### Breadcrumb doesn't update
- Check if `updateBreadcrumb()` is called
- Verify navigation bar container exists in DOM
- Check console for JavaScript errors

### Back button goes to wrong page
- This uses browser history - if history is cleared, it goes to Home
- This is expected behavior and provides a safe fallback

### Focus indicators not visible
- Check if custom CSS is overriding focus styles
- Verify user doesn't have custom browser extensions affecting focus
- Test in different browsers

## Future Enhancements

Planned improvements for future versions:

1. **Detail page navigation** - Breadcrumbs for viewing specific items (e.g., Home / Students / Mario Rossi)
2. **Recent pages** - Quick access to recently visited pages
3. **Favorites** - Pin frequently used pages
4. **Search navigation** - Jump to pages by name
5. **Navigation shortcuts** - Keyboard shortcuts for common pages (e.g., Ctrl+H for Home)

## Technical Architecture

### Files
- `js/navigation.js` - Navigation manager and utilities
- `styles.css` - Navigation component styles (added at end)
- `app.js` - Integration and initialization

### Key Classes
- `NavigationManager` - Main navigation state manager
- Singleton instance exported as `navigationManager`

### Integration Points
- Integrates with existing `switchTab()` function
- Works with browser history API
- Updates on all page changes

## Accessibility Standards

This navigation system complies with:
- **WCAG 2.1 Level AAA** for color contrast
- **WCAG 2.1 Level AA** for keyboard navigation
- **ARIA 1.2** for semantic markup
- **Section 508** standards

## Support

For questions or issues with navigation:
1. Check this guide
2. Review `docs/TROUBLESHOOTING.md`
3. Check browser console for errors
4. Open an issue on GitHub

---

**Version:** 1.2.1  
**Last Updated:** October 2025  
**Status:** ✅ Complete and Tested
