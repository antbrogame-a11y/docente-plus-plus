# 🎨 Design Tokens Reference

## Overview

This document provides a comprehensive reference for all design tokens (CSS custom properties) used in the Docente++ application. These tokens ensure consistency, maintainability, and ease of theming across the entire application.

## Table of Contents

- [Color System](#color-system)
- [Spacing System](#spacing-system)
- [Typography System](#typography-system)
- [Border Radius](#border-radius)
- [Elevation & Shadows](#elevation--shadows)
- [Transitions](#transitions)
- [Icon Sizes](#icon-sizes)
- [Z-Index Scale](#z-index-scale)
- [Usage Examples](#usage-examples)

---

## Color System

### Primary Colors
Material Design 3 expressive color palette.

#### Light Theme
```css
--md-primary: #6750A4              /* Purple - Primary brand color */
--md-primary-container: #EADDFF     /* Light purple container */
--md-on-primary: #FFFFFF            /* Text on primary */
--md-on-primary-container: #21005D  /* Text on primary container */
```

#### Dark Theme
```css
--md-primary: #D0BCFF              /* Light purple for dark mode */
--md-primary-container: #4F378B     /* Dark purple container */
--md-on-primary: #371E73            /* Text on primary */
--md-on-primary-container: #EADDFF  /* Text on primary container */
```

### Secondary Colors

#### Light Theme
```css
--md-secondary: #625B71
--md-secondary-container: #E8DEF8
--md-on-secondary: #FFFFFF
--md-on-secondary-container: #1D192B
```

### Tertiary Colors

#### Light Theme
```css
--md-tertiary: #7D5260
--md-tertiary-container: #FFD8E4
--md-on-tertiary: #FFFFFF
--md-on-tertiary-container: #31111D
```

### Semantic Colors

```css
--md-error: #BA1A1A      /* Error state */
--md-success: #4caf50    /* Success state */
--md-warning: #ff9800    /* Warning state */
--md-info: #2196f3       /* Information */
```

### Surface Colors

#### Light Theme
```css
--md-surface: #FEF7FF                      /* Main background */
--md-surface-container-lowest: #FFFFFF     /* Lowest elevation */
--md-surface-container-low: #F7F2FA        /* Low elevation */
--md-surface-container: #F3EDF7            /* Standard elevation */
--md-surface-container-high: #ECE6F0       /* High elevation */
--md-surface-container-highest: #E6E0E9    /* Highest elevation */
--md-card-bg: var(--md-surface-container-low) /* Card backgrounds */
```

### Text Colors

```css
--md-text-primary: rgba(28, 27, 31, 1)     /* Primary text - 100% opacity */
--md-text-secondary: rgba(73, 69, 79, 1)   /* Secondary text */
--md-text-disabled: rgba(28, 27, 31, 0.38) /* Disabled text - 38% opacity */
--md-text-on-primary: #FFFFFF              /* Text on primary color */
```

### Border & Divider Colors

```css
--md-border: var(--md-on-surface-variant)  /* Border color */
--md-divider: rgba(28, 27, 31, 0.12)       /* Divider lines - 12% opacity */
```

---

## Spacing System

Based on Material Design's 8px grid system.

```css
--spacing-xs: 4px       /* 0.5 unit - Minimal spacing */
--spacing-sm: 8px       /* 1 unit - Small spacing */
--spacing-md: 16px      /* 2 units - Medium spacing (default) */
--spacing-lg: 24px      /* 3 units - Large spacing */
--spacing-xl: 32px      /* 4 units - Extra large spacing */
--spacing-xxl: 48px     /* 6 units - Double extra large */
--spacing-xxxl: 64px    /* 8 units - Maximum spacing */
```

### Usage Guidelines

- **xs (4px)**: Icon gaps, tight layouts, inline elements
- **sm (8px)**: Button padding, small gaps between related elements
- **md (16px)**: Standard padding/margin, form field spacing
- **lg (24px)**: Section spacing, card padding
- **xl (32px)**: Large section separation
- **xxl (48px)**: Major section breaks
- **xxxl (64px)**: Page-level spacing

### Utility Classes

Spacing utility classes follow this pattern:
- `p-*`: padding (all sides)
- `pt-*`, `pr-*`, `pb-*`, `pl-*`: padding (specific side)
- `m-*`: margin (all sides)
- `mt-*`, `mr-*`, `mb-*`, `ml-*`: margin (specific side)
- `gap-*`: flexbox/grid gap

**Example:**
```html
<div class="p-md mt-lg">Content with medium padding and large top margin</div>
<div class="gap-sm">Flex container with small gap</div>
```

---

## Typography System

### Font Families

```css
--font-family-primary: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
--font-family-monospace: 'Roboto Mono', 'Courier New', monospace;
```

### Font Sizes

Type scale based on Material Design 3:

```css
--font-size-xs: 0.75rem      /* 12px - Captions, overline text */
--font-size-sm: 0.875rem     /* 14px - Body small, labels */
--font-size-base: 1rem       /* 16px - Body text (default) */
--font-size-lg: 1.125rem     /* 18px - Subtitles */
--font-size-xl: 1.25rem      /* 20px - Small titles */
--font-size-2xl: 1.5rem      /* 24px - Medium titles */
--font-size-3xl: 2rem        /* 32px - Large titles */
--font-size-4xl: 2.5rem      /* 40px - Small headlines */
--font-size-5xl: 3rem        /* 48px - Medium headlines */
--font-size-6xl: 3.5rem      /* 56px - Large headlines */
```

### Font Weights

```css
--font-weight-light: 300       /* Light text (sparingly used) */
--font-weight-regular: 400     /* Regular body text */
--font-weight-medium: 500      /* Emphasized text, buttons, labels */
--font-weight-semibold: 600    /* Strong emphasis */
--font-weight-bold: 700        /* Bold headings (sparingly used) */
```

### Line Heights

```css
--line-height-tight: 1.2       /* Headlines, tight layouts */
--line-height-normal: 1.5      /* Body text (default) */
--line-height-relaxed: 1.6     /* Comfortable reading */
--line-height-loose: 2         /* Extra spacing for emphasis */
```

### Letter Spacing

Material Design 3 specific values:

```css
--letter-spacing-tight: -0.02em             /* Tight tracking */
--letter-spacing-normal: 0                  /* Default */
--letter-spacing-wide: 0.01em               /* Wide tracking */
--letter-spacing-button: 0.0892857143em     /* Buttons (Material spec) */
--letter-spacing-headline: 0.0125em         /* Headlines */
--letter-spacing-body: 0.0094em             /* Body text */
--letter-spacing-label: 0.0333333333em      /* Labels and captions */
```

### Typography Utility Classes

**Font Size:**
```html
<p class="text-xs">Extra small text</p>
<p class="text-sm">Small text</p>
<p class="text-base">Base text (default)</p>
<h3 class="text-2xl">Large title</h3>
```

**Font Weight:**
```html
<p class="font-light">Light text</p>
<p class="font-regular">Regular text</p>
<p class="font-medium">Medium emphasis</p>
<p class="font-bold">Bold text</p>
```

**Line Height:**
```html
<p class="leading-tight">Tight line height</p>
<p class="leading-normal">Normal line height</p>
<p class="leading-relaxed">Relaxed line height</p>
```

**Letter Spacing:**
```html
<p class="tracking-tight">Tight tracking</p>
<p class="tracking-normal">Normal tracking</p>
<p class="tracking-wide">Wide tracking</p>
```

---

## Border Radius

Material Design 3 Expressive theme uses larger border radii:

```css
--md-radius-small: 8px          /* Buttons, chips, small elements */
--md-radius-medium: 12px        /* Cards, input fields */
--md-radius-large: 16px         /* Large cards, dialogs */
--md-radius-extra-large: 28px   /* Badges, FABs, special elements */
```

### Usage Guidelines

- **Small (8px)**: Standard buttons, small chips, tags
- **Medium (12px)**: Input fields, standard cards, containers
- **Large (16px)**: Large cards, modal dialogs, panels
- **Extra Large (28px)**: Floating action buttons, badges, decorative elements

---

## Elevation & Shadows

Material Design elevation system for creating depth:

```css
--md-elevation-0: none                      /* Flat, no shadow */
--md-elevation-1: 0 1px 2px rgba(0,0,0,0.3), 0 1px 3px 1px rgba(0,0,0,0.15)
--md-elevation-2: 0 1px 2px rgba(0,0,0,0.3), 0 2px 6px 2px rgba(0,0,0,0.15)
--md-elevation-3: 0 4px 8px 3px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.3)
--md-elevation-4: 0 6px 10px 4px rgba(0,0,0,0.15), 0 2px 3px rgba(0,0,0,0.3)
--md-elevation-5: 0 8px 12px 6px rgba(0,0,0,0.15), 0 4px 4px rgba(0,0,0,0.3)
```

### Elevation Guidelines

- **Level 0**: Flat surfaces, text on background
- **Level 1**: Cards, raised buttons, standard surfaces
- **Level 2**: App bars, navigation bars, FABs (resting state)
- **Level 3**: Dropdown menus, search bars, tooltips
- **Level 4**: Navigation drawers, modal dialogs
- **Level 5**: Full-screen modals, highest priority overlays

---

## Transitions

Standard Material Design motion:

```css
--md-transition-duration: 280ms                        /* Standard duration */
--md-transition-timing: cubic-bezier(0.4, 0, 0.2, 1)  /* Standard easing */
```

### Usage

```css
/* Smooth color transition */
.button {
    transition: background-color var(--md-transition-duration) var(--md-transition-timing);
}

/* Multiple properties */
.card {
    transition: 
        box-shadow var(--md-transition-duration) var(--md-transition-timing),
        transform var(--md-transition-duration) var(--md-transition-timing);
}
```

---

## Icon Sizes

Standardized icon sizes for consistency:

```css
--icon-size-xs: 16px       /* Extra small icons */
--icon-size-sm: 20px       /* Small icons */
--icon-size-md: 24px       /* Default Material Icons size */
--icon-size-lg: 32px       /* Large icons */
--icon-size-xl: 48px       /* Extra large icons */
--icon-size-xxl: 64px      /* Display icons */
```

### Usage with Icon Component

```javascript
// Using IconComponent with size
const icon = IconComponent.create('home', { size: 'lg' });

// Or with CSS classes
<span class="material-symbols-outlined icon-lg">home</span>
```

---

## Z-Index Scale

Layering system for overlapping elements:

```css
--z-index-dropdown: 1000        /* Dropdown menus */
--z-index-sticky: 1020          /* Sticky headers */
--z-index-fixed: 1030           /* Fixed elements */
--z-index-modal-backdrop: 1040  /* Modal backdrop */
--z-index-modal: 1050           /* Modal dialogs */
--z-index-popover: 1060         /* Popovers */
--z-index-tooltip: 1070         /* Tooltips (highest) */
```

### Usage Guidelines

Use these values to maintain consistent layering across the application. Never use arbitrary z-index values.

```css
.modal-backdrop {
    z-index: var(--z-index-modal-backdrop);
}

.modal {
    z-index: var(--z-index-modal);
}
```

---

## Usage Examples

### Example 1: Creating a Card Component

```html
<div class="card">
    <div class="card-header p-lg gap-sm">
        <span class="material-symbols-outlined icon-lg icon-primary">info</span>
        <h3 class="text-xl font-medium">Card Title</h3>
    </div>
    <div class="card-content p-md">
        <p class="text-base leading-relaxed">Card content goes here</p>
    </div>
</div>
```

```css
.card {
    background: var(--md-card-bg);
    border-radius: var(--md-radius-medium);
    box-shadow: var(--md-elevation-1);
    transition: box-shadow var(--md-transition-duration) var(--md-transition-timing);
}

.card:hover {
    box-shadow: var(--md-elevation-2);
}

.card-header {
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--md-divider);
}
```

### Example 2: Creating a Button

```html
<button class="btn btn-primary p-md gap-sm">
    <span class="material-symbols-outlined icon-md">save</span>
    <span class="text-sm font-medium tracking-wide">Save Changes</span>
</button>
```

```css
.btn-primary {
    background: var(--md-primary);
    color: var(--md-on-primary);
    border-radius: var(--md-radius-small);
    box-shadow: var(--md-elevation-1);
    transition: 
        background-color var(--md-transition-duration) var(--md-transition-timing),
        box-shadow var(--md-transition-duration) var(--md-transition-timing);
}

.btn-primary:hover {
    background: var(--md-primary-container);
    box-shadow: var(--md-elevation-2);
}
```

### Example 3: Using the Icon Component

```javascript
// Create a simple icon
const homeIcon = IconComponent.create('home', {
    size: 'lg',
    color: 'var(--md-primary)',
    title: 'Home'
});

// Create an icon button
const editButton = IconComponent.createButton('edit', {
    size: 'md',
    title: 'Edit',
    onClick: () => console.log('Edit clicked'),
    buttonClass: 'icon-btn icon-btn-primary'
});

// Create icon with label
const saveButton = IconComponent.createWithLabel('save', 'Save Changes', {
    size: 'md',
    title: 'Save your changes'
});
```

---

## Best Practices

### DO ✅

- Always use design tokens instead of hardcoded values
- Use semantic token names (e.g., `--md-primary` instead of `#6750A4`)
- Apply spacing consistently using the 8px grid system
- Use elevation to create visual hierarchy
- Follow Material Design 3 guidelines for color combinations

### DON'T ❌

- Don't hardcode colors, sizes, or spacing values
- Don't use arbitrary z-index values
- Don't mix token systems (stay consistent)
- Don't override token values inline without good reason
- Don't create custom spacing values outside the system

---

## Migration Guide

### Converting Existing Code

**Before:**
```css
.my-card {
    padding: 24px;
    margin-bottom: 16px;
    font-size: 14px;
    color: #6750A4;
    border-radius: 12px;
}
```

**After:**
```css
.my-card {
    padding: var(--spacing-lg);
    margin-bottom: var(--spacing-md);
    font-size: var(--font-size-sm);
    color: var(--md-primary);
    border-radius: var(--md-radius-medium);
}
```

Or use utility classes:
```html
<div class="my-card p-lg mb-md text-sm">Content</div>
```

---

## Additional Resources

- [Material Design 3 Guidelines](https://m3.material.io/)
- [Material Design Color System](https://m3.material.io/styles/color/overview)
- [Material Design Typography](https://m3.material.io/styles/typography/overview)
- [Icon Component Documentation](./ICON_COMPONENT.md)

---

**Last Updated:** 2025-10-15  
**Version:** 1.0.0
