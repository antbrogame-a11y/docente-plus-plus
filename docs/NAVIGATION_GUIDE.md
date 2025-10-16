# 🧭 Navigation Guide - Docente++

## Overview

Docente++ implements a comprehensive navigation system that follows Material Design guidelines, WCAG accessibility standards, and modern web best practices. The system ensures that users can easily navigate the application through multiple methods, including mouse, keyboard, and touch interactions.

## Navigation Features

### 1. Breadcrumb Navigation

**Location**: Top of the page, below the main header

**Purpose**: Shows the current location in the application hierarchy and provides quick navigation to parent pages.

**Features**:
- ✅ Always visible
- ✅ Shows full navigation path (e.g., Home / Studenti)
- ✅ Clickable links to parent pages
- ✅ ARIA landmark with `role="navigation"` and `aria-label="Breadcrumb"`
- ✅ Current page indicated with `aria-current="page"`
- ✅ Mobile-optimized (icons only on small screens)

**Keyboard Accessibility**:
- Tab to navigate between breadcrumb links
- Enter/Space to activate links
- Focus visible with outline

**Example**:
```
Home / Classi / 3A
 ^       ^       ^
 └─link  └─link  └─current page
```

### 2. Home Button

**Location**: Top-right of the header (always visible)

**Purpose**: Provides a persistent way to return to the home page from anywhere in the application.

**Features**:
- ✅ Always visible and accessible
- ✅ Icon-based for space efficiency
- ✅ Tooltip on hover: "Vai alla Home"
- ✅ ARIA label for screen readers
- ✅ Works even when menu is collapsed on mobile

**Usage**:
- Click/tap to navigate to home
- Keyboard: Tab to focus, Enter to activate

### 3. Back Navigation

Multiple ways to navigate back:

#### a) Breadcrumb Links
Click any parent page in the breadcrumb trail

#### b) Keyboard Shortcut
- **Alt + Left Arrow**: Navigate to previous page in history
- **Escape**: Close modal or navigate back (if no modal open)

#### c) Browser Back Button
Standard browser back button works correctly with proper history management

### 4. Browser History Management

**Features**:
- ✅ Uses `pushState` API for clean URLs
- ✅ URL parameters reflect current tab: `?tab=students`
- ✅ Browser back/forward buttons work correctly
- ✅ Direct URL navigation supported (bookmarkable pages)
- ✅ History stack maintained (up to 10 entries)

**Example URLs**:
```
http://localhost:8000/              # Home
http://localhost:8000/?tab=students # Students page
http://localhost:8000/?tab=classes  # Classes page
```

### 5. Keyboard Navigation

**Global Shortcuts**:
- `Alt + Left Arrow`: Navigate back
- `Alt + H`: Go to Home
- `Escape`: Close modal or go back
- `Tab`: Navigate through interactive elements
- `Shift + Tab`: Navigate backwards

**Menu Navigation**:
- `Arrow Up/Down`: Navigate between menu items
- `Arrow Left/Right`: Also supported for navigation
- `Enter/Space`: Activate selected menu item
- `Tab`: Move focus to next interactive element

### 6. Mobile Navigation

**Features**:
- ✅ Hamburger menu for collapsible sidebar
- ✅ Touch-optimized hit areas (minimum 48x48px)
- ✅ Breadcrumb optimized (icons only, labels hidden)
- ✅ Tap-friendly navigation cards on home page

**Mobile Menu**:
- Tap hamburger icon to open/close menu
- Tap backdrop to close menu
- Menu items stack vertically for easy thumb access

## Navigation Flow

### User Journey: First Time User

```
1. User opens app
   ↓
2. Onboarding modal appears
   ↓
3. Menu items are disabled (with 🔒 icon)
   ↓
4. User completes onboarding
   ↓
5. All menu items become enabled
   ↓
6. User can now navigate freely
```

### User Journey: Returning User

```
1. User opens app
   ↓
2. App loads to Home (or last visited page from URL)
   ↓
3. All navigation features available
   ↓
4. User navigates to different sections
   ↓
5. Breadcrumbs update automatically
   ↓
6. URL stays in sync with navigation
```

### User Journey: Navigation Between Pages

```
1. User on Home page
   ↓
2. Clicks "Studenti" in menu
   ↓
3. Page switches to Students
   ↓
4. Breadcrumb updates: "Home / Studenti"
   ↓
5. URL updates: "?tab=students"
   ↓
6. User clicks "Home" in breadcrumb
   ↓
7. Returns to Home
   ↓
8. URL updates: "?tab=home"
```

## Navigation Accessibility

### WCAG 2.1 Compliance

**Level A**:
- ✅ 2.1.1 Keyboard: All functionality available via keyboard
- ✅ 2.4.1 Bypass Blocks: Skip links and landmarks
- ✅ 2.4.2 Page Titled: Meaningful page titles
- ✅ 2.4.4 Link Purpose: Clear link text and labels

**Level AA**:
- ✅ 2.4.5 Multiple Ways: Multiple navigation methods available
- ✅ 2.4.6 Headings and Labels: Descriptive headings
- ✅ 2.4.7 Focus Visible: Focus indicators visible

### ARIA Attributes

**Breadcrumb**:
```html
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="#">Home</a></li>
    <li aria-current="page">Studenti</li>
  </ol>
</nav>
```

**Navigation Menu**:
```html
<nav aria-label="Menu principale">
  <button data-tab="home" aria-label="Vai alla Home">Home</button>
  <button data-tab="students" aria-label="Vai a Studenti">Studenti</button>
</nav>
```

**Home Button**:
```html
<button id="home-button" aria-label="Vai alla Home" title="Vai alla Home">
  <span class="material-symbols-outlined">home</span>
</button>
```

### Screen Reader Support

**Announcements**:
- Page changes announced: "Navigato a: Studenti"
- Breadcrumb path announced: "Sei qui: Home, Studenti"
- Disabled items announced with reason

**Focus Management**:
- Focus moves logically through navigation
- Focus visible with 2px outline
- Focus returns to appropriate element after modal close

## Material Design Compliance

**Principles Applied**:

1. **Navigation Drawer**: Persistent sidebar with elevation
2. **Top App Bar**: Fixed header with actions
3. **Breadcrumbs**: Material 3 style with rounded buttons
4. **Touch Targets**: Minimum 48x48dp
5. **Transitions**: 280ms cubic-bezier easing
6. **Elevation**: Level 2 for navigation drawer
7. **Typography**: Roboto font family
8. **Colors**: Primary color for active states

**Material Components Used**:
- Navigation Drawer (sidebar)
- Top App Bar (header)
- Icon Buttons
- List Items
- Dividers

## Technical Implementation

### Navigation Stack

The navigation system maintains a history stack:

```javascript
// Example navigation history
const history = [
  'home',
  'students', 
  'classes',
  'students' // current page
];
```

**Stack Operations**:
- Push: When navigating to new page
- Pop: When going back
- Limit: Maximum 10 items

### URL Synchronization

```javascript
// URL updates automatically
switchTab('students');
// URL becomes: /?tab=students

// URL can be used directly
navigateTo('/?tab=classes');
// Loads classes tab
```

### Event Flow

```
User Action
    ↓
Click Handler / Keyboard Handler
    ↓
app.switchTab()
    ↓
├─ pushToHistory()
├─ pushState() (browser history)
├─ updateBreadcrumbs()
└─ switchTab() (UI update)
```

## Best Practices for Developers

### Adding New Pages

1. **Add breadcrumb configuration**:
```javascript
breadcrumbConfig.newPage = [
  { label: 'Home', tab: 'home', icon: 'home' },
  { label: 'New Page', tab: 'newPage', icon: 'icon_name' }
];
```

2. **Add menu item**:
```html
<button class="nav-item" data-tab="newPage">
  <span class="material-symbols-outlined">icon_name</span>
  <span class="nav-label">New Page</span>
</button>
```

3. **Handle in switchTab**:
```javascript
case 'newPage':
  renderNewPage();
  break;
```

### Handling Deep Links

For pages with parameters (e.g., viewing a specific student):

```javascript
// Add to breadcrumb config
breadcrumbConfig.studentDetail = (studentId) => [
  { label: 'Home', tab: 'home', icon: 'home' },
  { label: 'Studenti', tab: 'students', icon: 'group' },
  { label: student.name, tab: null, icon: 'person' }
];
```

### Testing Navigation

See `tests/navigation.test.js` for comprehensive test examples.

## Troubleshooting

### Issue: Breadcrumbs not updating
**Solution**: Ensure `updateBreadcrumbs()` is called in tab switch

### Issue: Back button not working
**Solution**: Check that `pushToHistory()` is called before navigation

### Issue: URL not updating
**Solution**: Verify `pushState()` is called with correct parameters

### Issue: Keyboard navigation not working
**Solution**: Check that elements have proper `tabindex` and event listeners

## Future Enhancements

Planned improvements:

- [ ] Animation between page transitions
- [ ] Breadcrumb overflow handling (many levels)
- [ ] Navigation analytics tracking
- [ ] Gesture support for mobile (swipe back)
- [ ] Smart breadcrumb truncation
- [ ] Navigation preloading for faster transitions
- [ ] Voice navigation support

## References

- [Material Design Navigation](https://m3.material.io/components/navigation-drawer)
- [WCAG 2.1 Navigation Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/multiple-ways.html)
- [ARIA Breadcrumb Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/)
- [Keyboard Navigation Best Practices](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)

---

**Version**: 1.0  
**Last Updated**: 2025-10-16  
**Maintained By**: Docente++ Team
