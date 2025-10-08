# 📱 Material UI Post-Login Components

This directory contains the Material UI components for the post-login experience of Docente++.

## 🏗️ Architecture Overview

The post-login interface is built using **Material UI** (MUI) with a mobile-first approach, featuring a bottom navigation pattern for easy access to three main sections.

### Component Structure

```
src/components/
├── MainScreen.jsx          # Main container with BottomNavigation
├── OrarioGiornaliero.jsx   # Daily schedule view
├── ImpegniGiornalieri.jsx  # Daily tasks/commitments view
└── Altro.jsx               # Adaptive section with usage-based ordering
```

## 📦 Components

### 1. MainScreen.jsx

**Purpose**: Main container component that handles navigation between sections.

**Features**:
- Material UI **BottomNavigation** for mobile-friendly navigation
- Three sections: Orario Giornaliero, Impegni Giornalieri, Altro
- App bar showing current section title
- Material UI theming with custom color palette
- Responsive container layout

**Usage**:
```jsx
import MainScreen from './components/MainScreen';

function App() {
  return <MainScreen />;
}
```

**Theme Configuration**:
- Primary Color: `#4a90e2` (blue)
- Secondary Color: `#f39c12` (orange)
- Background: `#f5f5f5` (light gray)

---

### 2. OrarioGiornaliero.jsx

**Purpose**: Displays the daily schedule for the teacher.

**Features**:
- Current date display header
- List of daily lessons with time slots
- Subject, class, and room information
- Material UI components (List, Card, Alert, Chip)
- Hover effects for better UX
- Empty state handling

**Placeholder Data**:
Currently displays sample lessons. To integrate with real data:

1. **Option 1: Props**
   ```jsx
   <OrarioGiornaliero lessons={lessonsData} />
   ```

2. **Option 2: Context API**
   ```jsx
   const { lessons } = useContext(AppContext);
   ```

3. **Option 3: Backend API**
   ```jsx
   useEffect(() => {
     fetch('/api/schedule/today')
       .then(res => res.json())
       .then(data => setLessons(data));
   }, []);
   ```

**Future Extensions**:
- Day navigation (previous/next)
- Quick action buttons (start lesson, take attendance)
- Real-time schedule updates
- Lesson detail modal

---

### 3. ImpegniGiornalieri.jsx

**Purpose**: Displays daily tasks and commitments.

**Features**:
- Task list with status indicators
- Priority levels (high, medium, low)
- Progress tracking for in-progress tasks
- Status icons (completed, in-progress, pending)
- Edit button for each task
- Material UI components (List, LinearProgress, Chip)

**Task Status Types**:
- `pending`: Not started
- `in-progress`: Currently working on it
- `completed`: Finished

**Priority Levels**:
- `high`: Red chip (error color)
- `medium`: Orange chip (warning color)
- `low`: Gray chip (default color)

**Data Integration**:
Replace `placeholderTasks` with real data from app.js activities:

```jsx
// In app.js or parent component
const tasks = app.activities.filter(a => 
  a.status === 'planned' || a.status === 'in-progress'
);

// Pass to component
<ImpegniGiornalieri tasks={tasks} />
```

**Future Extensions**:
- FAB (Floating Action Button) for task creation
- Task filtering by status/priority
- Task completion toggle
- Backend API sync
- Drag-and-drop reordering

---

### 4. Altro.jsx

**Purpose**: Adaptive section with usage-based feature ordering.

**Key Features**:
- ✅ **Usage-based ordering**: Most used features appear first
- ✅ **localStorage persistence**: Usage counters saved locally
- ✅ **Backend sync ready**: Extension points for API integration
- ✅ **Visual usage indicators**: Usage count chips
- ✅ **Material UI components**: List, ListItemButton, Chip

**How It Works**:

1. **Usage Tracking**:
   - Each feature click increments a counter
   - Counters stored in localStorage with key `altroUsage`
   - Format: `{ "settings": 5, "stats": 3, "help": 1 }`

2. **Automatic Reordering**:
   - Features sorted by usage count (descending)
   - Updates in real-time when usage changes
   - Most used features appear at the top

3. **localStorage Schema**:
   ```json
   {
     "altroUsage": {
       "settings": 10,
       "history": 7,
       "stats": 5,
       "support": 3,
       "profile": 2,
       "backup": 1,
       "notifications": 1,
       "about": 0
     }
   }
   ```

**Backend Synchronization (Extension Point)**:

The component includes placeholders for backend sync:

```javascript
// In Altro.jsx - Uncomment and configure

const syncUsageDataToBackend = async (usageData) => {
  try {
    const response = await fetch('/api/user/feature-usage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getUserToken()}`
      },
      body: JSON.stringify({
        userId: getCurrentUserId(),
        usageData: usageData,
        timestamp: new Date().toISOString()
      })
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Sync failed:', error);
    return null;
  }
};
```

**Drag & Drop Extension (Planned)**:

To add manual reordering via drag-and-drop:

1. Install library:
   ```bash
   npm install react-beautiful-dnd
   # or
   npm install @dnd-kit/core @dnd-kit/sortable
   ```

2. Wrap list with DragDropContext:
   ```jsx
   import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
   
   <DragDropContext onDragEnd={handleDragEnd}>
     <Droppable droppableId="features">
       {(provided) => (
         <List {...provided.droppableProps} ref={provided.innerRef}>
           {orderedFeatures.map((feature, index) => (
             <Draggable key={feature.key} draggableId={feature.key} index={index}>
               {(provided) => (
                 <ListItem
                   ref={provided.innerRef}
                   {...provided.draggableProps}
                   {...provided.dragHandleProps}
                 >
                   {/* ... */}
                 </ListItem>
               )}
             </Draggable>
           ))}
         </List>
       )}
     </Droppable>
   </DragDropContext>
   ```

3. Implement `handleDragEnd` function (placeholder already exists in code)

**Available Features**:
- Settings (Impostazioni)
- History (Storico)
- Statistics (Statistiche)
- Support (Assistenza)
- Profile (Profilo)
- Backup (Backup)
- Notifications (Notifiche)
- About (Info App)

---

## 🎨 Material UI Theme

All components use a centralized theme defined in `MainScreen.jsx`:

```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: '#4a90e2',  // Blue
    },
    secondary: {
      main: '#f39c12',  // Orange
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", ...',
  },
});
```

### Customizing the Theme

To modify colors or typography:

1. Edit `MainScreen.jsx` theme object
2. Add custom palette colors:
   ```javascript
   palette: {
     primary: { main: '#your-color' },
     success: { main: '#green' },
     error: { main: '#red' },
   }
   ```
3. Customize typography:
   ```javascript
   typography: {
     h1: { fontSize: '2rem' },
     button: { textTransform: 'none' },
   }
   ```

---

## 📲 Mobile-First Design

All components follow mobile-first principles:

- **BottomNavigation**: Easy thumb access on mobile
- **Touch-friendly**: Buttons min 44px (iOS standard)
- **Responsive layout**: Container adapts to screen size
- **Material Design**: Follows Google's Material Design guidelines

### Responsive Breakpoints

Material UI default breakpoints:
- **xs**: 0px - 600px (mobile)
- **sm**: 600px - 960px (tablet)
- **md**: 960px - 1280px (desktop)
- **lg**: 1280px - 1920px (large desktop)

Example responsive styling:
```jsx
<Box sx={{
  p: { xs: 1, sm: 2, md: 3 },  // Padding scales with screen size
  fontSize: { xs: '0.875rem', md: '1rem' }
}}>
```

---

## 🔌 Integration with Existing App

### Option 1: Replace Current Interface (Recommended)

Replace the current vanilla JS interface with Material UI components:

1. **Add React and Material UI dependencies**:
   ```bash
   npm install react react-dom @mui/material @emotion/react @emotion/styled @mui/icons-material
   ```

2. **Create entry point** (`src/index.jsx`):
   ```jsx
   import React from 'react';
   import ReactDOM from 'react-dom/client';
   import MainScreen from './components/MainScreen';
   
   const root = ReactDOM.createRoot(document.getElementById('app-root'));
   root.render(<MainScreen />);
   ```

3. **Update index.html**:
   ```html
   <div id="app-root"></div>
   <script type="module" src="/src/index.jsx"></script>
   ```

4. **Add bundler** (Vite recommended):
   ```bash
   npm install -D vite @vitejs/plugin-react
   ```

### Option 2: Hybrid Approach

Keep existing app.js and mount React components in specific sections:

```javascript
// In app.js
import ReactDOM from 'react-dom/client';
import MainScreen from './components/MainScreen';

// After user logs in
showTab('react-interface'); // Custom tab
const root = ReactDOM.createRoot(document.getElementById('react-root'));
root.render(<MainScreen />);
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Bottom navigation switches between sections
- [ ] All three sections render correctly
- [ ] Orario Giornaliero shows placeholder lessons
- [ ] Impegni Giornalieri shows tasks with progress
- [ ] Altro section shows all features
- [ ] Clicking features in Altro increments usage counter
- [ ] Usage counters persist after page reload
- [ ] Features reorder based on usage
- [ ] Mobile responsive (test on phone or DevTools)
- [ ] Theme colors applied correctly

### Testing Usage-Based Ordering (Altro)

1. Open DevTools Console
2. Clear usage data:
   ```javascript
   localStorage.removeItem('altroUsage');
   ```
3. Click different features multiple times
4. Observe reordering in real-time
5. Refresh page and verify order persists

---

## 🚀 Future Enhancements

### Planned Features

1. **Data Integration**:
   - Connect OrarioGiornaliero to app.js schedule
   - Connect ImpegniGiornalieri to app.js activities
   - Real-time updates

2. **Backend Sync**:
   - User authentication
   - Cloud storage for usage data
   - Multi-device synchronization

3. **Advanced UI**:
   - Dark mode support
   - Custom themes per user
   - Animations and transitions

4. **Functionality**:
   - Drag-and-drop reordering
   - Quick actions (FAB buttons)
   - Notifications integration
   - Calendar view

5. **Accessibility**:
   - Screen reader support
   - Keyboard navigation
   - High contrast mode

---

## 📚 Dependencies

Required npm packages:

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@mui/material": "^5.14.0",
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0",
    "@mui/icons-material": "^5.14.0"
  }
}
```

Optional (for future extensions):
```json
{
  "devDependencies": {
    "react-beautiful-dnd": "^13.1.1",
    "@dnd-kit/core": "^6.0.0",
    "@dnd-kit/sortable": "^7.0.0"
  }
}
```

---

## 🤝 Contributing

When extending these components:

1. **Follow Material UI patterns**: Use MUI components consistently
2. **Add TODO comments**: Mark extension points clearly
3. **Document props**: Use JSDoc for component props
4. **Keep it modular**: Components should be reusable
5. **Mobile-first**: Test on mobile devices
6. **Accessibility**: Add ARIA labels where needed

---

## 📝 License

Part of Docente++ project. See main LICENSE file for details.

---

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Check the main README.md
- Review the checklist.md for integration steps

---

**Last Updated**: 2025-01-XX  
**Version**: 1.0.0  
**Author**: Docente++ Development Team
