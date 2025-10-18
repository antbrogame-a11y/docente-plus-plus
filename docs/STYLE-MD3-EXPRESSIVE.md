# MD3 Expressive Theme System

This document describes the Material Design 3 (MD3) Expressive theme system for Docente++.

## Overview

The MD3 Expressive theme system provides a consistent, modern, and accessible design language across the application. It supports:

- **Dynamic seed colors**: Generate color palettes from any seed color
- **Light and dark modes**: Automatic theme switching based on user preference
- **Consistent spacing**: Standardized spacing tokens
- **Accessible focus states**: High-contrast focus indicators
- **Expressive shapes**: Rounded corners and modern visual style

## Architecture

### Files

- **design/tokens-md3-expressive.json**: Design token definitions
- **src/styles/theme-md3-expressive.css**: Base theme CSS with utility classes
- **src/styles/generated-md3-expressive.css**: Auto-generated theme variables (light + dark)
- **tools/generate-md3-expressive.js**: Generator for theme CSS from seed color
- **tools/replace-tokens.js**: Migration tool to replace hardcoded values
- **src/js/theme-hook.js**: Runtime theme management

### Color System

The theme uses the MD3 color system with the following roles:

#### Primary Colors
- `--md-sys-color-primary`: Main brand color
- `--md-sys-color-on-primary`: Text on primary
- `--md-sys-color-primary-container`: Lighter primary for containers
- `--md-sys-color-on-primary-container`: Text on primary container

#### Secondary Colors
- `--md-sys-color-secondary`: Supporting color
- `--md-sys-color-on-secondary`: Text on secondary
- `--md-sys-color-secondary-container`: Lighter secondary
- `--md-sys-color-on-secondary-container`: Text on secondary container

#### Tertiary Colors
- `--md-sys-color-tertiary`: Accent color (pink)
- `--md-sys-color-on-tertiary`: Text on tertiary
- `--md-sys-color-tertiary-container`: Lighter tertiary
- `--md-sys-color-on-tertiary-container`: Text on tertiary container

#### Surface Colors
- `--md-sys-color-surface`: Default surface
- `--md-sys-color-on-surface`: Text on surface
- `--md-sys-color-surface-variant`: Variant surface
- `--md-sys-color-on-surface-variant`: Text on surface variant
- `--md-sys-color-surface-container-*`: Container surfaces (lowest to highest)

#### Other Colors
- `--md-sys-color-outline`: Border and divider color
- `--md-sys-color-error`: Error state color
- `--md-sys-color-background`: Page background

### Spacing System

Standard spacing tokens:

- `--md-spacing-xs`: 4px
- `--md-spacing-sm`: 8px
- `--md-spacing-md`: 16px
- `--md-spacing-lg`: 24px

### Shape System

Border radius tokens:

- `--md-shape-small`: 10px
- `--md-shape-medium`: 14px
- `--md-shape-large`: 20px

### Focus System

Focus indicator styles:

- `--md-focus-outline`: Focus color (rgba with seed color)
- `--md-focus-width`: 2px
- `--md-focus-offset`: 2px

## Usage

### Generating Theme CSS

To regenerate the theme CSS with a new seed color:

```bash
node tools/generate-md3-expressive.js --seed=#8657FF
```

This will update `src/styles/generated-md3-expressive.css` with new color palettes.

### Migration Tool

To find hardcoded colors and spacing values in your CSS:

```bash
# Dry run (preview changes)
node tools/replace-tokens.js --dir=./css --dry-run

# Apply changes
node tools/replace-tokens.js --dir=./css --apply

# Single file
node tools/replace-tokens.js --file=css/schedule.css --apply
```

### HTML Integration

Include the theme CSS files in your HTML:

```html
<head>
  <!-- Base theme with utilities -->
  <link rel="stylesheet" href="src/styles/theme-md3-expressive.css">
  
  <!-- Generated color variables -->
  <link rel="stylesheet" href="src/styles/generated-md3-expressive.css">
</head>
```

### Using Theme Variables in CSS

Replace hardcoded colors with theme variables:

```css
/* Before */
.header {
  background: #8657FF;
  color: #FFFFFF;
  padding: 16px;
}

/* After */
.header {
  background: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  padding: var(--md-spacing-md);
}
```

### Utility Classes

The theme provides utility classes:

```html
<!-- Elevated surface -->
<div class="surface-elevated">Content</div>

<!-- Primary button -->
<button class="btn-primary">Action</button>

<!-- Accent pill -->
<span class="pill-accent">Tag</span>

<!-- In-classe header -->
<header class="in-classe-topbar">
  <h1 class="in-classe-header">Title</h1>
</header>
```

### Dark Mode

The theme automatically supports dark mode. Add the `dark-theme` class to `html`, `body`, or `:root`:

```javascript
// Apply dark theme
document.documentElement.classList.add('dark-theme');

// Apply light theme
document.documentElement.classList.remove('dark-theme');
document.documentElement.classList.add('light-theme');
```

## Runtime Theme Switching

The `src/js/theme-hook.js` module provides runtime theme management:

```javascript
import { applyDynamicTheme, setThemeSeed } from './src/js/theme-hook.js';

// Initialize with default seed
applyDynamicTheme();

// Change seed color dynamically
setThemeSeed('#FF5722');

// Listen to theme changes
window.addEventListener('themechange', (e) => {
  console.log('Theme changed:', e.detail);
});
```

## Migration Strategy

### Phase 1: Core Components
1. ✅ Add theme system files
2. ✅ Generate CSS with seed color
3. Apply to high-visibility components:
   - Topbar/header
   - "In Classe" page
   - Schedule grid
   - Primary buttons

### Phase 2: Secondary Components
1. Card components
2. Dialogs and modals
3. Form inputs
4. Navigation elements

### Phase 3: Refinement
1. Test dark mode thoroughly
2. Verify accessibility (contrast ratios)
3. Fine-tune spacing and shapes
4. Document edge cases

## Best Practices

### DO
- ✅ Use theme variables for all colors
- ✅ Use spacing tokens for padding/margin
- ✅ Use shape tokens for border-radius
- ✅ Test in both light and dark modes
- ✅ Use utility classes when available

### DON'T
- ❌ Hardcode hex colors
- ❌ Use arbitrary spacing values
- ❌ Override theme variables without reason
- ❌ Mix old and new systems in same component

## Accessibility

The theme ensures:

- **WCAG AA contrast**: All text meets minimum contrast ratios
- **Focus indicators**: High-contrast, visible focus states
- **Dark mode support**: Proper contrast in both themes
- **Semantic colors**: Error states use red, success uses green

## Future Enhancements

- [ ] Integration with Material Color Utilities library
- [ ] Custom color picker in settings
- [ ] Per-component theme overrides
- [ ] Theme presets (curated palettes)
- [ ] CSS custom properties polyfill for older browsers

## Support

For issues or questions about the theme system:

1. Check this documentation
2. Review `design/tokens-md3-expressive.json`
3. Test with migration tools
4. Open an issue on GitHub

## References

- [Material Design 3](https://m3.material.io/)
- [Material Color System](https://m3.material.io/styles/color/overview)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
