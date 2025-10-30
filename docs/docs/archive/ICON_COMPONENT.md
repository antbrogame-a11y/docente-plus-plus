# 🎭 Icon Component System

## Overview

The Icon Component System provides a centralized, consistent way to manage and render icons throughout the Docente++ application. It uses Material Symbols Outlined by default and offers a comprehensive API for creating, styling, and managing icons.

## Table of Contents

- [Quick Start](#quick-start)
- [Icon Component API](#icon-component-api)
- [Icon Reference](#icon-reference)
- [Usage Examples](#usage-examples)
- [CSS Classes](#css-classes)
- [Best Practices](#best-practices)
- [Accessibility](#accessibility)

---

## Quick Start

### 1. Include the Icon Component

The Icon Component is automatically available in `js/icons.js`:

```html
<script src="js/icons.js"></script>
```

### 2. Basic Usage

```javascript
// Create a simple icon
const icon = IconComponent.create('home');
document.body.appendChild(icon);

// Create an icon with options
const largeIcon = IconComponent.create('settings', {
    size: 'lg',
    color: 'var(--md-primary)',
    title: 'Settings'
});

// Create an icon button
const editBtn = IconComponent.createButton('edit', {
    title: 'Edit item',
    onClick: () => console.log('Edit clicked')
});
```

---

## Icon Component API

### `IconComponent.create(iconName, options)`

Creates an icon element.

**Parameters:**
- `iconName` (string): Icon name from Material Symbols
- `options` (object): Configuration options
  - `size` (string): 'xs', 'sm', 'md' (default), 'lg', 'xl', 'xxl'
  - `color` (string): CSS color value
  - `className` (string): Additional CSS classes
  - `title` (string): Tooltip text
  - `ariaLabel` (string): Accessibility label
  - `library` (string): Icon library (default: 'material-symbols-outlined')

**Returns:** HTMLElement

**Example:**
```javascript
const icon = IconComponent.create('check_circle', {
    size: 'lg',
    color: 'var(--md-success)',
    title: 'Success',
    className: 'success-icon'
});
```

### `IconComponent.createButton(iconName, options)`

Creates an icon button.

**Parameters:**
- `iconName` (string): Icon name
- `options` (object): All options from `create()` plus:
  - `onClick` (function): Click handler
  - `buttonClass` (string): Button CSS class (default: 'icon-btn')
  - `disabled` (boolean): Whether button is disabled

**Returns:** HTMLButtonElement

**Example:**
```javascript
const deleteBtn = IconComponent.createButton('delete', {
    title: 'Delete item',
    buttonClass: 'icon-btn',
    onClick: () => handleDelete(),
    size: 'md'
});
```

### `IconComponent.createWithLabel(iconName, label, options)`

Creates an icon with a text label.

**Parameters:**
- `iconName` (string): Icon name
- `label` (string): Text label
- `options` (object): All options from `create()` plus:
  - `containerClass` (string): Container CSS class (default: 'icon-with-label')

**Returns:** HTMLElement

**Example:**
```javascript
const saveButton = IconComponent.createWithLabel('save', 'Save Changes', {
    size: 'md',
    title: 'Save your changes'
});
```

### `IconComponent.replace(element, iconName, options)`

Replaces element content with an icon.

**Parameters:**
- `element` (HTMLElement): Target element
- `iconName` (string): Icon name
- `options` (object): Icon options

**Example:**
```javascript
const button = document.querySelector('#myButton');
IconComponent.replace(button, 'check', { size: 'sm' });
```

### `IconComponent.prepend(element, iconName, options)`

Prepends an icon to an element.

**Parameters:**
- `element` (HTMLElement): Target element
- `iconName` (string): Icon name
- `options` (object): Icon options

**Example:**
```javascript
const heading = document.querySelector('h2');
IconComponent.prepend(heading, 'school', { size: 'lg' });
```

### `IconComponent.append(element, iconName, options)`

Appends an icon to an element.

**Parameters:**
- `element` (HTMLElement): Target element
- `iconName` (string): Icon name
- `options` (object): Icon options

**Example:**
```javascript
const button = document.querySelector('.submit-btn');
IconComponent.append(button, 'arrow_forward', { size: 'sm' });
```

### `IconComponent.getIcon(context)`

Gets recommended icon for a context.

**Parameters:**
- `context` (string): Context name (e.g., 'save', 'delete', 'edit')

**Returns:** string (icon name)

**Example:**
```javascript
const iconName = IconComponent.getIcon('save');  // Returns 'save'
const editIcon = IconComponent.getIcon('edit');  // Returns 'edit'
```

### `IconComponent.exists(iconName)`

Checks if an icon exists in the reference.

**Parameters:**
- `iconName` (string): Icon name to check

**Returns:** boolean

**Example:**
```javascript
if (IconComponent.exists('custom_icon')) {
    // Use the icon
}
```

---

## Icon Reference

### Navigation Icons

```javascript
IconComponent.ICONS.HOME           // 'home'
IconComponent.ICONS.MENU           // 'menu'
IconComponent.ICONS.CLOSE          // 'close'
IconComponent.ICONS.ARROW_BACK     // 'arrow_back'
IconComponent.ICONS.ARROW_FORWARD  // 'arrow_forward'
IconComponent.ICONS.MORE_VERT      // 'more_vert'
IconComponent.ICONS.MORE_HORIZ     // 'more_horiz'
```

### Action Icons

```javascript
IconComponent.ICONS.ADD       // 'add'
IconComponent.ICONS.EDIT      // 'edit'
IconComponent.ICONS.DELETE    // 'delete'
IconComponent.ICONS.SAVE      // 'save'
IconComponent.ICONS.CANCEL    // 'cancel'
IconComponent.ICONS.REFRESH   // 'refresh'
IconComponent.ICONS.SEARCH    // 'search'
IconComponent.ICONS.FILTER    // 'filter_list'
IconComponent.ICONS.SORT      // 'sort'
```

### File Icons

```javascript
IconComponent.ICONS.UPLOAD     // 'upload_file'
IconComponent.ICONS.DOWNLOAD   // 'download'
IconComponent.ICONS.COPY       // 'content_copy'
IconComponent.ICONS.PASTE      // 'content_paste'
IconComponent.ICONS.FOLDER     // 'folder'
IconComponent.ICONS.FILE       // 'description'
IconComponent.ICONS.ATTACHMENT // 'attach_file'
```

### Education Icons

```javascript
IconComponent.ICONS.BOOK       // 'menu_book'
IconComponent.ICONS.SCHOOL     // 'school'
IconComponent.ICONS.CLASS      // 'group'
IconComponent.ICONS.ASSIGNMENT // 'assignment'
IconComponent.ICONS.GRADE      // 'grade'
IconComponent.ICONS.CALENDAR   // 'calendar_month'
IconComponent.ICONS.SCHEDULE   // 'schedule'
```

### Status Icons

```javascript
IconComponent.ICONS.CHECK        // 'check'
IconComponent.ICONS.CHECK_CIRCLE // 'check_circle'
IconComponent.ICONS.ERROR        // 'error'
IconComponent.ICONS.WARNING      // 'warning'
IconComponent.ICONS.INFO         // 'info'
IconComponent.ICONS.HELP         // 'help'
```

### Settings Icons

```javascript
IconComponent.ICONS.SETTINGS  // 'settings'
IconComponent.ICONS.BACKUP    // 'backup'
IconComponent.ICONS.RESTORE   // 'restore'
```

### Theme Icons

```javascript
IconComponent.ICONS.PALETTE         // 'palette'
IconComponent.ICONS.LIGHT_MODE      // 'light_mode'
IconComponent.ICONS.DARK_MODE       // 'dark_mode'
IconComponent.ICONS.FULLSCREEN      // 'fullscreen'
IconComponent.ICONS.FULLSCREEN_EXIT // 'fullscreen_exit'
```

### User Icons

```javascript
IconComponent.ICONS.PERSON         // 'person'
IconComponent.ICONS.PERSON_ADD     // 'person_add'
IconComponent.ICONS.GROUP          // 'group'
IconComponent.ICONS.ACCOUNT_CIRCLE // 'account_circle'
```

### AI & Analytics Icons

```javascript
IconComponent.ICONS.PSYCHOLOGY // 'psychology'
IconComponent.ICONS.ANALYTICS  // 'bar_chart'
IconComponent.ICONS.INSIGHTS   // 'insights'
```

---

## Usage Examples

### Example 1: Creating Navigation Buttons

```javascript
// Create a home button
const homeBtn = IconComponent.createButton(IconComponent.ICONS.HOME, {
    title: 'Go to Home',
    onClick: () => navigateHome(),
    size: 'md'
});

// Create a menu toggle
const menuBtn = IconComponent.createButton(IconComponent.ICONS.MENU, {
    title: 'Toggle Menu',
    onClick: () => toggleMenu(),
    buttonClass: 'icon-btn menu-toggle'
});
```

### Example 2: Status Indicators

```javascript
// Success indicator
const successIcon = IconComponent.create(IconComponent.ICONS.CHECK_CIRCLE, {
    size: 'lg',
    color: 'var(--md-success)',
    title: 'Success'
});

// Error indicator
const errorIcon = IconComponent.create(IconComponent.ICONS.ERROR, {
    size: 'lg',
    color: 'var(--md-error)',
    title: 'Error occurred'
});

// Warning indicator
const warningIcon = IconComponent.create(IconComponent.ICONS.WARNING, {
    size: 'md',
    color: 'var(--md-warning)',
    title: 'Warning'
});
```

### Example 3: Action Buttons with Labels

```javascript
// Save button with icon and text
const saveBtn = document.createElement('button');
saveBtn.className = 'btn btn-primary';
IconComponent.prepend(saveBtn, IconComponent.ICONS.SAVE, { size: 'sm' });
saveBtn.appendChild(document.createTextNode(' Save Changes'));

// Or use createWithLabel
const downloadBtn = IconComponent.createWithLabel(
    IconComponent.ICONS.DOWNLOAD, 
    'Download',
    { size: 'md' }
);
```

### Example 4: Dynamic Icon Updates

```javascript
// Update icon based on state
function updatePlayPauseButton(isPlaying) {
    const button = document.querySelector('#playPauseBtn');
    const iconName = isPlaying ? 'pause' : 'play_arrow';
    IconComponent.replace(button, iconName, {
        size: 'lg',
        title: isPlaying ? 'Pause' : 'Play'
    });
}
```

### Example 5: Card Headers with Icons

```javascript
// Create a card header with icon
const cardHeader = document.createElement('div');
cardHeader.className = 'card-header p-lg gap-sm';

const icon = IconComponent.create(IconComponent.ICONS.ASSIGNMENT, {
    size: 'lg',
    className: 'icon-primary'
});

const title = document.createElement('h3');
title.className = 'text-xl font-medium';
title.textContent = 'My Assignments';

cardHeader.appendChild(icon);
cardHeader.appendChild(title);
```

### Example 6: Icon Grid/Menu

```javascript
// Create a grid of icon buttons
const iconMenu = document.createElement('div');
iconMenu.className = 'icon-menu gap-md';

const menuItems = [
    { icon: 'home', label: 'Home', action: () => goHome() },
    { icon: 'school', label: 'Classes', action: () => showClasses() },
    { icon: 'assignment', label: 'Tasks', action: () => showTasks() },
    { icon: 'settings', label: 'Settings', action: () => showSettings() }
];

menuItems.forEach(item => {
    const button = IconComponent.createWithLabel(item.icon, item.label, {
        size: 'xl',
        containerClass: 'icon-menu-item'
    });
    button.addEventListener('click', item.action);
    iconMenu.appendChild(button);
});
```

---

## CSS Classes

### Icon Size Classes

Apply these classes directly to icon elements:

```html
<span class="material-symbols-outlined icon-xs">home</span>    <!-- 16px -->
<span class="material-symbols-outlined icon-sm">home</span>    <!-- 20px -->
<span class="material-symbols-outlined icon-md">home</span>    <!-- 24px - default -->
<span class="material-symbols-outlined icon-lg">home</span>    <!-- 32px -->
<span class="material-symbols-outlined icon-xl">home</span>    <!-- 48px -->
<span class="material-symbols-outlined icon-xxl">home</span>   <!-- 64px -->
```

### Icon Color Classes

```html
<span class="material-symbols-outlined icon-primary">star</span>
<span class="material-symbols-outlined icon-secondary">star</span>
<span class="material-symbols-outlined icon-error">error</span>
<span class="material-symbols-outlined icon-success">check</span>
<span class="material-symbols-outlined icon-warning">warning</span>
<span class="material-symbols-outlined icon-info">info</span>
<span class="material-symbols-outlined icon-disabled">block</span>
```

### Icon Button Classes

```html
<!-- Standard icon button -->
<button class="icon-btn">
    <span class="material-symbols-outlined">edit</span>
</button>

<!-- Primary colored icon button -->
<button class="icon-btn icon-btn-primary">
    <span class="material-symbols-outlined">save</span>
</button>
```

### Icon with Label

```html
<span class="icon-with-label">
    <span class="material-symbols-outlined icon-md">save</span>
    <span class="icon-label">Save Changes</span>
</span>
```

---

## Best Practices

### DO ✅

1. **Use the Icon Component for consistency**
   ```javascript
   // Good
   const icon = IconComponent.create('home');
   
   // Avoid
   const icon = document.createElement('span');
   icon.className = 'material-symbols-outlined';
   icon.textContent = 'home';
   ```

2. **Use icon constants for commonly used icons**
   ```javascript
   // Good
   IconComponent.create(IconComponent.ICONS.HOME);
   
   // Less ideal (but still works)
   IconComponent.create('home');
   ```

3. **Always provide accessibility labels**
   ```javascript
   IconComponent.create('delete', {
       title: 'Delete item',
       ariaLabel: 'Delete this item'
   });
   ```

4. **Use semantic icon sizes**
   ```javascript
   // UI icons
   IconComponent.create('menu', { size: 'md' });
   
   // Feature icons
   IconComponent.create('school', { size: 'lg' });
   
   // Hero icons
   IconComponent.create('psychology', { size: 'xxl' });
   ```

5. **Use appropriate colors**
   ```javascript
   // Success
   IconComponent.create('check', { color: 'var(--md-success)' });
   
   // Error
   IconComponent.create('error', { color: 'var(--md-error)' });
   ```

### DON'T ❌

1. **Don't hardcode icon HTML**
   ```html
   <!-- Avoid -->
   <span class="material-symbols-outlined">home</span>
   ```

2. **Don't use inline styles for colors**
   ```javascript
   // Avoid
   IconComponent.create('home', { color: '#6750A4' });
   
   // Use design tokens
   IconComponent.create('home', { color: 'var(--md-primary)' });
   ```

3. **Don't forget accessibility**
   ```javascript
   // Avoid
   IconComponent.create('delete');
   
   // Better
   IconComponent.create('delete', { title: 'Delete', ariaLabel: 'Delete item' });
   ```

4. **Don't use icons without context in critical actions**
   ```javascript
   // Avoid for important actions
   IconComponent.createButton('delete', { onClick: deleteItem });
   
   // Better - add confirmation or label
   IconComponent.createWithLabel('delete', 'Delete Item', { onClick: confirmDelete });
   ```

---

## Accessibility

### ARIA Attributes

The Icon Component automatically adds:
- `role="img"` to all icons
- `aria-label` from the options or title

### Keyboard Navigation

Icon buttons are fully keyboard accessible:
- **Tab**: Navigate to button
- **Enter/Space**: Activate button

### Screen Reader Support

```javascript
// Good: Descriptive label
IconComponent.createButton('edit', {
    title: 'Edit',
    ariaLabel: 'Edit student information'
});

// Better: Context-specific label
IconComponent.createButton('delete', {
    title: 'Delete',
    ariaLabel: `Delete ${studentName} from class`
});
```

### Color Contrast

Ensure icons meet WCAG 2.1 AA standards:
- Use sufficient contrast ratios (4.5:1 for normal text)
- Don't rely solely on color to convey information
- Provide text labels or tooltips for critical actions

---

## Extending the Icon System

### Adding Custom Icons

To add new icon constants:

```javascript
// In icons.js, add to IconComponent.ICONS
static ICONS = {
    // ... existing icons
    CUSTOM_ICON: 'custom_icon_name',
    MY_FEATURE: 'my_feature_icon'
};
```

### Using Different Icon Libraries

The system supports other icon libraries:

```javascript
// Use Material Icons instead of Material Symbols
const icon = IconComponent.create('home', {
    library: IconComponent.LIBRARIES.MATERIAL_ICONS
});
```

---

## Troubleshooting

### Icon Not Displaying

1. **Check if Material Symbols is loaded**
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet">
   ```

2. **Verify icon name is correct**
   ```javascript
   // Check available icons at:
   // https://fonts.google.com/icons
   ```

3. **Ensure CSS is loaded**
   ```html
   <link rel="stylesheet" href="styles.css">
   ```

### Icon Size Not Applying

Make sure you're using the correct size parameter:

```javascript
// Correct
IconComponent.create('home', { size: 'lg' });

// Incorrect
IconComponent.create('home', { size: 'large' });
```

---

## Additional Resources

- [Material Symbols Guide](https://fonts.google.com/icons)
- [Material Design Icons](https://material.io/design/iconography)
- [Design Tokens Documentation](./DESIGN_TOKENS.md)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Last Updated:** 2025-10-15  
**Version:** 1.0.0
