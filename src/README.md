# Source Directory Structure

This directory contains modular, reusable components and features organized by function.

## Directory Organization

```
src/
├── components/          # Reusable UI components
│   └── breadcrumbs/    # Breadcrumb navigation component
├── pages/              # Page-specific modules
│   └── orario/        # Schedule/timetable module
├── ui/                 # UI feature modules
│   └── floating-assistant/  # Floating AI assistant
└── mock/              # Mock data for development and testing
```

## Components (`src/components/`)

### Breadcrumbs Component
Location: `src/components/breadcrumbs/`

**Purpose**: Provides hierarchical navigation context across pages.

**Features**:
- Dynamic breadcrumb generation
- Page-specific configurations
- Back and home button integration
- Mobile-responsive design
- Accessible with ARIA attributes

**Usage**:
```javascript
import { breadcrumbsInstance } from './src/components/breadcrumbs/breadcrumbs.js';

// Initialize
breadcrumbsInstance.init({
    homeUrl: 'index.html',
    homeLabel: 'Home'
});

// Set breadcrumbs for current page
breadcrumbsInstance.updateForPage('in-classe', { title: 'Classe 3A' });

// Setup button handlers
breadcrumbsInstance.setupBackButton();
breadcrumbsInstance.setupHomeButton();
```

**Files**:
- `breadcrumbs.js` - Component logic (ES6 module)
- `breadcrumbs.css` - Component styles

## Pages (`src/pages/`)

### Orario (Schedule) Module
Location: `src/pages/orario/`

**Purpose**: Grid-based timetable rendering with collision detection.

**Features**:
- CSS Grid-based layout
- Multi-hour slot support
- Collision detection
- Responsive design (mobile/tablet/desktop)
- Time and day mapping utilities
- Click handlers for slot interaction
- Accessibility with ARIA attributes

**Core Functions**:
```javascript
import { 
    normalizeTime,
    dayToColumnIndex,
    timeToRowIndex,
    calculateDuration,
    detectCollision,
    renderSlotToGrid,
    initializeScheduleGrid,
    loadScheduleData
} from './src/pages/orario/orario.js';

// Load and render schedule
const data = await loadScheduleData('/src/mock/orario-mock.json');
const container = document.getElementById('schedule-container');
initializeScheduleGrid(data.schedule, container, {
    startTime: '08:00',
    collisionDetection: true,
    onSlotClick: (slot) => {
        console.log('Clicked:', slot);
    }
});
```

**Utility Functions**:
- `normalizeTime(time)` - Convert time strings to HH:MM format
- `dayToColumnIndex(day)` - Map day names to grid columns (1-7)
- `timeToRowIndex(time, startTime)` - Map time to grid row
- `calculateDuration(start, end)` - Calculate time span in hours
- `detectCollision(slot1, slot2)` - Check if two slots overlap
- `renderSlotToGrid(slot, container, options)` - Render single slot
- `initializeScheduleGrid(slots, container, options)` - Render full schedule

**Files**:
- `orario.js` - Schedule rendering logic (ES6 module)
- `orario.css` - Grid layout and responsive styles

## UI Features (`src/ui/`)

### Floating Assistant
Location: `src/ui/floating-assistant/`

**Purpose**: Enhanced floating AI assistant with accessibility features.

**Features**:
- Modal dialog with backdrop
- Focus trap (Tab/Shift+Tab cycling)
- ESC key to close
- aria-live announcements
- MOCK_AI feature flag
- Mock voice recording
- Message persistence (localStorage)
- Quick suggestion buttons

**Usage**:
```javascript
import { floatingAssistantUI } from './src/ui/floating-assistant/floating-assistant.js';

// Initialize (auto-initializes on DOMContentLoaded)
floatingAssistantUI.init();

// Open programmatically
floatingAssistantUI.open();

// Close programmatically
floatingAssistantUI.close();

// Toggle
floatingAssistantUI.toggle();
```

**Configuration**:
- Set `MOCK_AI = true` for development/testing
- Set `MOCK_AI = false` when connecting to real AI API

**Files**:
- `floating-assistant.js` - Assistant UI logic (ES6 module)

## Mock Data (`src/mock/`)

### Orario Mock Data
Location: `src/mock/orario-mock.json`

**Purpose**: Sample schedule data for testing and development.

**Structure**:
```json
{
  "schedule": [
    {
      "id": "slot-1",
      "day": "Lunedì",
      "startTime": "08:00",
      "endTime": "09:00",
      "subject": "Matematica",
      "class": "3A",
      "room": "Aula 12",
      "type": "Teoria",
      "color": "#4CAF50",
      "multiHour": false
    }
  ],
  "timeSlots": ["08:00", "09:00", ...],
  "days": ["Lunedì", "Martedì", ...]
}
```

**Features**:
- 11 sample schedule slots
- Multi-hour time spans (2-3 hour blocks)
- Multiple subjects and classes
- Color coding for subjects
- Italian day names

## Integration with Existing Code

The `src/` directory complements the existing structure:

```
Root/
├── js/                 # Legacy/existing JavaScript
│   ├── in-classe.js   # Uses InClasseDataManager (SessionManager)
│   ├── floating-assistant.js  # Original floating assistant
│   └── ...
├── css/               # Existing styles
│   ├── in-classe.css
│   └── ...
├── src/               # NEW: Modular components and features
│   ├── components/
│   ├── pages/
│   ├── ui/
│   └── mock/
└── tests/            # Test files
    └── unit/
        └── orario.test.js  # Tests for orario module
```

## Development Guidelines

### Adding New Components

1. Create directory under `src/components/[component-name]/`
2. Include both `.js` and `.css` files
3. Use ES6 module exports
4. Document usage in component JSDoc
5. Add unit tests in `tests/unit/`

### Naming Conventions

- **Files**: kebab-case (e.g., `floating-assistant.js`)
- **Classes**: PascalCase (e.g., `FloatingAssistantUI`)
- **Functions**: camelCase (e.g., `normalizeTime`)
- **CSS classes**: kebab-case (e.g., `.breadcrumb-link`)

### Accessibility Requirements

All components must include:
- ARIA roles and labels
- Keyboard navigation support
- Focus indicators
- Screen reader announcements (aria-live)
- High contrast mode support
- Reduced motion support

### Testing

- Write unit tests for all utility functions
- Test edge cases and error conditions
- Verify accessibility with screen readers
- Test responsive behavior at all breakpoints

## Demo Pages

- `orario-demo.html` - Interactive demo of schedule grid
- `in-classe.html` - Example of breadcrumb integration
- `schedule-demo.html` - Existing schedule demo

## Related Documentation

- `docs/PR-128-UPDATES.md` - Implementation notes and QA checklist
- `tests/unit/orario.test.js` - Test suite for orario module
- Inline JSDoc comments in all modules

## Browser Support

- Modern browsers with ES6 module support
- CSS Grid support required
- CSS custom properties (variables) required

## Future Enhancements

Potential improvements to consider:
- TypeScript migration
- Build system integration (webpack, vite)
- Tree-shaking optimization
- Component library documentation
- Storybook integration
- E2E test coverage
