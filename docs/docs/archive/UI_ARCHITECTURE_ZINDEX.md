# UI Architecture - Z-Index Layer Management

## Overview

This document describes the z-index layer management system used in Docente++ to ensure proper stacking context and interaction between UI elements, particularly the sidebar menu and backdrop overlay.

## Z-Index Hierarchy

The application uses a carefully structured z-index system defined in `styles.css`:

### Global Z-Index Scale (CSS Variables)

```css
:root {
    --z-index-dropdown: 1000;
    --z-index-sticky: 1020;
    --z-index-fixed: 1030;
    --z-index-modal-backdrop: 1040;
    --z-index-modal: 1050;
    --z-index-popover: 1060;
    --z-index-tooltip: 1070;
}
```

### Sidebar and Backdrop Configuration

#### Problem Statement
The sidebar menu and menu backdrop needed to be properly layered to ensure:
1. The backdrop appears behind the sidebar
2. The sidebar menu items remain clickable and interactive
3. Consistent behavior across desktop and mobile viewports

#### Solution

**Menu Backdrop** (`.menu-backdrop`):
- **z-index: 999**
- Position: fixed
- Purpose: Semi-transparent overlay that covers the content when menu is open on mobile
- Behavior: Clicking backdrop closes the menu

**Sidebar** (`.sidebar`):
- **z-index: 1050**
- Position: fixed
- Purpose: Navigation menu container
- Behavior: Always interactive and clickable, positioned above the backdrop

#### Implementation Details

```css
/* Sidebar - Always above backdrop */
.sidebar {
    position: fixed;
    left: 0;
    top: 64px;
    bottom: 0;
    width: 280px;
    z-index: 1050;  /* Above backdrop */
    /* ... other styles ... */
}

/* Menu Backdrop - Behind sidebar */
@media (max-width: 768px) {
    .menu-backdrop {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;  /* Behind sidebar */
        /* ... other styles ... */
    }
    
    .menu-backdrop.active {
        display: block;
        opacity: 1;
    }
}
```

### Mobile Menu Behavior

On mobile devices (viewport width ≤ 768px):

1. **Closed State**:
   - Sidebar is translated off-screen: `transform: translateX(-100%)`
   - Backdrop is hidden: `display: none`

2. **Open State**:
   - Sidebar slides in: `.sidebar.mobile-open` → `transform: translateX(0)`
   - Backdrop appears: `.menu-backdrop.active` → `display: block; opacity: 1`
   - Sidebar (z-index: 1050) is above backdrop (z-index: 999)
   - Menu items remain fully interactive

3. **Closing**:
   - Clicking backdrop triggers menu toggle
   - Both sidebar and backdrop animations reverse

### Desktop Behavior

On desktop (viewport width > 768px):
- Sidebar is always visible: `margin-left: 280px` on main content
- No backdrop needed
- Z-index still maintained for consistency

## Testing

The z-index configuration is validated by automated tests in `tests/unit/z-index.test.js`:

### Key Test Cases

1. **Sidebar z-index verification**: Ensures `.sidebar` has z-index: 1050
2. **Backdrop z-index verification**: Ensures `.menu-backdrop` has z-index: 999
3. **Hierarchy validation**: Confirms sidebar z-index > backdrop z-index
4. **Mobile state testing**: Verifies z-index remains correct with `.mobile-open` and `.active` classes
5. **Interaction testing**: Confirms sidebar nav items have no `pointer-events: none`

## Best Practices

When adding new UI layers:

1. **Use CSS variables**: Reference existing z-index variables from `:root`
2. **Document the layer**: Add to this documentation
3. **Test interactions**: Ensure clickable elements aren't blocked
4. **Consider mobile**: Test on both desktop and mobile viewports
5. **Maintain hierarchy**: Keep related elements close in z-index values

## Troubleshooting

### Common Issues

**Issue**: Sidebar menu items not clickable on mobile
- **Cause**: Backdrop z-index higher than sidebar
- **Solution**: Ensure sidebar z-index (1050) > backdrop z-index (999)

**Issue**: Backdrop doesn't cover content
- **Cause**: Content has higher z-index
- **Solution**: Keep main content z-index below backdrop (999)

**Issue**: Modal appears behind sidebar
- **Cause**: Modal z-index too low
- **Solution**: Use `--z-index-modal` (1050) or higher for modals

## Version History

- **v1.2.1** (2025-01-16): Fixed inconsistent z-index values for sidebar and backdrop
  - Standardized `.menu-backdrop` to z-index: 999 across all media queries
  - Set `.sidebar` to z-index: 1050 for proper layering
  - Added comprehensive z-index tests
  - Documented z-index architecture

## See Also

- `styles.css` - CSS implementation
- `tests/unit/z-index.test.js` - Z-index validation tests
- `js/events.js` - Menu toggle interaction logic
