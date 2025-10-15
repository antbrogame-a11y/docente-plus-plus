# 🚀 Quick Start - Design System

## For Developers

### Installation
No installation needed! The design system is already integrated.

### Usage

#### 1. Using Design Tokens in CSS

```css
/* Instead of hardcoded values */
.old-way {
    padding: 24px;
    margin-bottom: 16px;
    color: #6750A4;
    font-size: 14px;
    border-radius: 12px;
}

/* Use design tokens */
.new-way {
    padding: var(--spacing-lg);
    margin-bottom: var(--spacing-md);
    color: var(--md-primary);
    font-size: var(--font-size-sm);
    border-radius: var(--md-radius-medium);
}
```

#### 2. Using Utility Classes in HTML

```html
<!-- Instead of inline styles or custom CSS -->
<div style="padding: 16px; margin-bottom: 24px;">
    <h2 style="font-size: 24px; font-weight: 500;">Title</h2>
</div>

<!-- Use utility classes -->
<div class="p-md mb-lg">
    <h2 class="text-2xl font-medium">Title</h2>
</div>
```

#### 3. Using Icon Component in JavaScript

```javascript
// Instead of manual icon creation
const oldIcon = document.createElement('span');
oldIcon.className = 'material-symbols-outlined';
oldIcon.textContent = 'home';

// Use IconComponent
const newIcon = IconComponent.create('home', {
    size: 'lg',
    title: 'Home'
});

// Create icon buttons easily
const editBtn = IconComponent.createButton('edit', {
    onClick: () => handleEdit(),
    title: 'Edit item'
});

// Icons with labels
const saveBtn = IconComponent.createWithLabel('save', 'Save Changes');
```

## Quick Reference

### Most Used Design Tokens

```css
/* Spacing */
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 16px    /* Most common */
--spacing-lg: 24px
--spacing-xl: 32px

/* Colors */
--md-primary: #6750A4
--md-error: #BA1A1A
--md-success: #4caf50
--md-warning: #ff9800

/* Typography */
--font-size-sm: 0.875rem   /* 14px */
--font-size-base: 1rem     /* 16px - body */
--font-size-lg: 1.125rem   /* 18px */
--font-size-2xl: 1.5rem    /* 24px - titles */

/* Border Radius */
--md-radius-small: 8px     /* Buttons */
--md-radius-medium: 12px   /* Cards */
--md-radius-large: 16px    /* Modals */
```

### Most Used Utility Classes

```html
<!-- Spacing -->
<div class="p-md">Padding medium (16px all sides)</div>
<div class="pt-lg">Padding top large (24px)</div>
<div class="mb-sm">Margin bottom small (8px)</div>
<div class="gap-md">Gap medium (16px) for flex/grid</div>

<!-- Typography -->
<h1 class="text-3xl font-bold">Large bold heading</h1>
<p class="text-base leading-relaxed">Normal paragraph</p>
<span class="text-sm font-medium">Small medium text</span>

<!-- Icons -->
<span class="material-symbols-outlined icon-lg">home</span>
<span class="material-symbols-outlined icon-primary">star</span>
```

### Most Used Icon Component Methods

```javascript
// Simple icon
IconComponent.create('home');
IconComponent.create('save', { size: 'lg', color: 'var(--md-primary)' });

// Icon button
IconComponent.createButton('edit', { 
    onClick: handleEdit,
    title: 'Edit'
});

// Icon with label
IconComponent.createWithLabel('download', 'Download File');

// Icon constants (for consistency)
IconComponent.ICONS.HOME      // 'home'
IconComponent.ICONS.SAVE      // 'save'
IconComponent.ICONS.DELETE    // 'delete'
IconComponent.ICONS.SETTINGS  // 'settings'
```

## Common Patterns

### Pattern 1: Card Component

```html
<div class="p-lg bg-surface-container" style="border-radius: var(--md-radius-medium); box-shadow: var(--md-elevation-1);">
    <div class="mb-md" style="display: flex; align-items: center; gap: var(--spacing-sm);">
        <span class="material-symbols-outlined icon-lg icon-primary">school</span>
        <h3 class="text-xl font-medium">Card Title</h3>
    </div>
    <p class="text-base text-secondary">Card content goes here...</p>
</div>
```

### Pattern 2: Button with Icon

```html
<button class="btn btn-primary gap-sm">
    <span class="material-symbols-outlined icon-sm">save</span>
    <span>Save Changes</span>
</button>
```

Or with JavaScript:

```javascript
const btn = document.createElement('button');
btn.className = 'btn btn-primary gap-sm';
IconComponent.prepend(btn, 'save', { size: 'sm' });
btn.appendChild(document.createTextNode('Save Changes'));
```

### Pattern 3: Status Indicator

```javascript
function showStatus(type, message) {
    const icons = {
        success: { icon: 'check_circle', color: 'var(--md-success)' },
        error: { icon: 'error', color: 'var(--md-error)' },
        warning: { icon: 'warning', color: 'var(--md-warning)' },
        info: { icon: 'info', color: 'var(--md-info)' }
    };
    
    const config = icons[type];
    const icon = IconComponent.create(config.icon, {
        size: 'lg',
        color: config.color
    });
    
    // Use the icon in your status message
}
```

## Resources

### Documentation
- **Full Token Reference**: `docs/DESIGN_TOKENS.md`
- **Icon Component API**: `docs/ICON_COMPONENT.md`
- **Implementation Guide**: `docs/UI_UX_REFACTORING_COMPLETE.md`

### Demo
- **Interactive Demo**: Open `design-tokens-demo.html` in browser
- Shows all tokens, icons, and examples
- Light/Dark theme toggle

### Icon Reference
Browse all available icons at:
- [Material Symbols](https://fonts.google.com/icons)
- Or use `IconComponent.ICONS` constants in code

## Tips

### ✅ DO
- Use design tokens for all new CSS
- Use utility classes for quick styling
- Use IconComponent for all new icons
- Check the demo page for examples
- Use semantic token names

### ❌ DON'T
- Hardcode colors, sizes, or spacing
- Use arbitrary z-index values
- Create icons manually with HTML
- Override token values without reason
- Use inline styles when tokens exist

## Need Help?

1. **Check the demo page**: `design-tokens-demo.html`
2. **Read the docs**: See `docs/` folder
3. **Look at examples**: Check existing components
4. **Ask the team**: Open an issue or discussion

## Migration Checklist

When updating existing code:

- [ ] Replace hardcoded spacing with tokens or utilities
- [ ] Replace hardcoded colors with color tokens
- [ ] Replace hardcoded font sizes with typography tokens
- [ ] Replace manual icon creation with IconComponent
- [ ] Add proper ARIA labels to icons
- [ ] Test in light and dark themes
- [ ] Verify responsive behavior

---

**Quick Start Version**: 1.0.0  
**Last Updated**: 2025-10-15
