# 📅 Schedule Component - Quick Start

## Overview

A modern, fully responsive schedule table component for managing weekly class schedules. Built with vanilla JavaScript ES6 modules, this component features a professional blue/cyan/white color palette, Material Symbols icons, and complete mobile responsiveness.

## Features

- ✅ **6 hours/day schedule** (Monday-Friday, 08:00-14:00)
- ✅ **Fully responsive** - Mobile, Tablet, Desktop optimized
- ✅ **Interactive cells** - Click/tap to edit any cell
- ✅ **Modern design** - Blue/cyan/white palette with rounded corners
- ✅ **Material Symbols icons** - Beautiful, consistent iconography
- ✅ **Dark mode support** - Full theme support
- ✅ **Accessibility** - WCAG 2.1 AA compliant, keyboard navigation
- ✅ **Reusable component** - No hardcoded values, fully configurable

## Quick Demo

Visit `schedule-demo.html` to see the component in action with:
- Load example data
- Clear schedule
- Toggle dark mode
- Export to JSON
- Real-time statistics

## File Structure

```
css/
├── schedule-theme.css        # Theme variables (colors, spacing, etc.)
└── schedule-component.css    # Component styles (responsive)

js/
├── schedule-component.js     # Main component logic
└── schedule-example-data.js  # Sample data & helper functions

docs/
└── SCHEDULE_COMPONENT_GUIDE.md  # Complete documentation

schedule-demo.html            # Interactive demo page
```

## Installation

### 1. Include CSS files

```html
<link rel="stylesheet" href="css/schedule-theme.css">
<link rel="stylesheet" href="css/schedule-component.css">
```

### 2. Include Material Symbols

```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">
```

### 3. Import JavaScript module

```javascript
import { 
    renderScheduleTable, 
    showScheduleEditModal 
} from './js/schedule-component.js';
```

## Basic Usage

```javascript
import { renderScheduleTable, showScheduleEditModal } from './js/schedule-component.js';

// Your schedule data
let scheduleData = {
    "Lunedì-08:00": {
        classId: "1A",
        subject: "Matematica",
        activityType: "theory"
    },
    // ... more entries
};

// Get container
const container = document.getElementById('schedule-container');

// Handle cell click
function handleCellClick(dayIndex, time, currentData) {
    showScheduleEditModal(dayIndex, time, currentData, handleSave);
}

// Handle save
function handleSave(dayIndex, time, newData) {
    const days = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì'];
    const key = `${days[dayIndex]}-${time}`;
    
    if (newData === null) {
        delete scheduleData[key];
    } else {
        scheduleData[key] = newData;
    }
    
    // Re-render
    renderScheduleTable(container, scheduleData, handleCellClick);
}

// Initial render
renderScheduleTable(container, scheduleData, handleCellClick);
```

## Activity Types

The component includes 6 predefined activity types with icons:

| Type | Icon | Label | Color |
|------|------|-------|-------|
| `theory` | 📚 `menu_book` | Teoria/Lezione | Blue |
| `practice` | ✏️ `draw` | Disegno/Pratica | Cyan |
| `lab` | 🔬 `science` | Laboratorio | Teal |
| `test` | 📝 `quiz` | Verifica | Purple |
| `group` | 👥 `groups` | Lavoro di Gruppo | Green |
| `other` | ⋯ `more_horiz` | Altro | Gray |

## Customization

### Change Colors

Edit `css/schedule-theme.css`:

```css
:root {
    --schedule-primary: #0277BD;    /* Your primary color */
    --schedule-accent: #00BCD4;     /* Your accent color */
}
```

### Add Custom Activity Type

Edit `js/schedule-component.js`:

```javascript
const ACTIVITY_TYPES = {
    // ... existing types
    custom: {
        label: 'Custom Activity',
        icon: 'star',           // Material Symbol name
        color: '#FF6F00'
    }
};
```

### Change Schedule Hours

Edit `js/schedule-component.js`:

```javascript
const SCHEDULE_CONFIG = {
    hoursPerDay: 8,        // Change to 8 hours
    startHour: 7,          // Start at 7:00
    startMinute: 30,       // Start at :30
    workingDays: [...]     // Add/remove days
};
```

## Responsive Breakpoints

- **Mobile** (< 640px): Compact layout with abbreviated day names
- **Tablet** (640-1024px): Medium layout with full day names
- **Desktop** (> 1024px): Full layout with maximum spacing

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Accessibility

- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ ARIA labels and roles
- ✅ Focus indicators
- ✅ Screen reader support
- ✅ High contrast mode support
- ✅ Reduced motion support

## Data Format

```javascript
{
    "DayName-Time": {
        classId: "string",      // Class identifier
        subject: "string",      // Subject name
        activityType: "string"  // One of: theory, practice, lab, test, group, other
    }
}
```

Example:
```javascript
{
    "Lunedì-08:00": {
        classId: "1A",
        subject: "Matematica",
        activityType: "theory"
    }
}
```

## Helper Functions

### `generateEmptySchedule()`
Creates an empty schedule structure with all time slots.

### `validateScheduleData(scheduleData)`
Validates schedule data format and content.

### `getScheduleForDay(scheduleData, dayName)`
Filters schedule data for a specific day.

### `getScheduleStats(scheduleData)`
Returns statistics (total slots, occupied, empty, occupancy rate).

## Integration with Docente++

This component is designed to integrate seamlessly with the Docente++ app:

1. Uses the same `state` object from `js/data.js`
2. Compatible with existing theme system
3. Follows the same coding patterns and conventions
4. Integrates with existing CRUD operations

## Documentation

For complete documentation, see:
- **Full Guide**: `docs/SCHEDULE_COMPONENT_GUIDE.md`
- **API Reference**: See guide for detailed API documentation
- **Examples**: Check `js/schedule-example-data.js`

## Testing

1. Open `schedule-demo.html` in a browser
2. Try loading example data
3. Click cells to edit
4. Test on different screen sizes
5. Toggle dark mode
6. Test keyboard navigation

## Troubleshooting

### Icons not showing
Ensure Material Symbols are loaded:
```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">
```

### Component not responsive on mobile
Check viewport meta tag:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### Dark mode not working
Ensure `dark-theme` class is applied to body:
```javascript
document.body.classList.add('dark-theme');
```

## License

This component is part of the Docente++ project.

## Support

For issues, questions, or contributions, please refer to the main Docente++ repository.

---

**Version**: 1.0.0  
**Last Updated**: 2025-10-15  
**Author**: Team Docente++
