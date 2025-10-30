STATIC SCHEDULE GRID ENHANCEMENT - PATCH INSTRUCTIONS
=====================================================

OVERVIEW
--------
This enhancement adds a static, accessible weekly schedule grid to in-classe.html with 
keyboard navigation and auto-population from localStorage schedule data.

**AUTO-OPEN SUPPRESSION (Updated):**
The lesson picker modal is now suppressed from auto-opening on page load. All lesson
selection must happen through the static schedule grid on the in-classe page.

COMPONENTS ADDED
----------------
1. js/schedule-enhance.js - Enhancement script with auto-open suppression
2. css/schedule.css - Updated with new styles for static grid
3. in-classe.html - Modified to include static HTML grid and script reference

HOW IT WORKS
------------
The enhancement script (schedule-enhance.js):
- **Suppresses auto-open behavior:**
  - Clears lastOpenedLesson and lastOpenedClassId from localStorage on page load
  - Hides #lesson-picker-modal and sets aria-hidden="true"
  - Overrides window.showLessonPicker() and window.showLessonPickerInline() with no-ops
  - Dispatches 'lesson-picker-suppressed' events when suppressed functions are called
  - Sets window.__disableAutoLessonPicker = true flag
  - Preserves original functions as window.__orig_showLessonPicker and window.__orig_showLessonPickerInline
- Auto-initializes on DOMContentLoaded
- Loads schedule data from multiple localStorage keys (teacherSchedule, schedule, appSchedule, stateSchedule)
- Normalizes different schedule data shapes (slots array or per-day arrays)
- Deduplicates lessons by lessonKey
- Maps lessons to grid cells using data-day and data-time attributes
- Renders lessons as stacked .slot-item elements inside cells
- Adds "Entra" buttons that call window.enterLessonFromSchedule() when available
- Falls back to localStorage (lastOpenedLesson, lastOpenedClassId) + reload if API not available
- Provides keyboard navigation: Arrow keys to move between cells, Enter/Space to activate
- Dispatches custom "open-lesson-list" event when multiple lessons exist in a cell
- Exposes window.initScheduleGrid() for manual re-initialization

LESSON SELECTION FLOW
----------------------
**New Flow (Enforced):**
1. User navigates to in-classe.html from homepage (click "Entra in Classe")
2. Page opens WITHOUT auto-opening the legacy lesson picker modal
3. User sees the static schedule grid populated with their lessons
4. User clicks on a time cell in the grid to view lessons for that slot
5. User clicks "Entra" button on a specific lesson to enter it
6. The lesson opens in the in-classe interface

**Old Flow (Disabled):**
The old behavior of auto-opening a lesson picker modal based on lastOpenedLesson
localStorage entry is now disabled and will not occur.

RESTORING ORIGINAL BEHAVIOR
----------------------------
If you need to restore the original auto-open lesson picker behavior:

1. Call the original functions that were preserved:
   ```javascript
   // Restore original showLessonPicker
   window.showLessonPicker = window.__orig_showLessonPicker;
   
   // Restore original showLessonPickerInline
   window.showLessonPickerInline = window.__orig_showLessonPickerInline;
   
   // Remove the disable flag
   delete window.__disableAutoLessonPicker;
   ```

2. Or, to temporarily bypass suppression for one call:
   ```javascript
   if (window.__orig_showLessonPicker) {
     window.__orig_showLessonPicker();
   }
   ```

3. To permanently restore old behavior, remove the suppression code from
   js/schedule-enhance.js (lines ~7-50) and restore the auto-open code in
   js/in-classe.js (around line 888-893).

KEYBOARD NAVIGATION
-------------------
- Tab: Focus the grid and navigate to first cell
- Arrow keys (Up/Down/Left/Right): Navigate between cells
- Enter or Space: Activate the focused cell
  - If cell has 1 lesson: enters that lesson
  - If cell has multiple lessons: dispatches "open-lesson-list" event
  - If cell is empty: no action

ACCESSIBILITY FEATURES
----------------------
- Semantic HTML table structure with proper role attributes
- ARIA labels for screen readers
- Keyboard navigation fully supported
- Focus indicators visible
- Responsive design for mobile devices
- Dark theme support

HOW TO REVERT
-------------
To remove the static grid enhancement:

1. Remove the static grid HTML from in-classe.html:
   Delete the entire <div class="schedule-table-wrapper"> block (lines ~93-165)

2. Remove the script reference from in-classe.html:
   Delete the line: <script src="js/schedule-enhance.js"></script>

3. Remove or restore css/schedule.css:
   Remove the "Static grid enhancements" section at the end

4. Delete js/schedule-enhance.js file

5. The original schedule-container div will still work with existing schedule-patch.js

HOW TO CUSTOMIZE
----------------

Change grid time slots:
- Edit the static HTML table in in-classe.html
- Add or remove <tr> rows with appropriate data-time attributes
- Ensure data-time values match the format in your schedule data

Change grid days:
- Edit the <th> headers and <td> cells in the table
- Update data-day attributes to match your schedule data
- Update DAY_ORDER array in schedule-enhance.js if needed

Add more storage keys:
- Edit STORAGE_KEYS array in schedule-enhance.js
- Add your custom localStorage key to the array

Customize styling:
- Edit css/schedule.css
- Modify .slot-item, .slot-subject, .slot-class, .slot-enter-btn classes
- Adjust colors, spacing, borders as needed

TESTING NOTES
-------------
To test the enhancement:

1. Clear localStorage entries:
   localStorage.removeItem('lastOpenedLesson');
   localStorage.removeItem('lastOpenedClassId');

2. Load schedule data into localStorage:
   localStorage.setItem('schedule', JSON.stringify({
     slots: [
       { day: 'Lunedì', time: '08:00', subject: 'Math', classId: '3A', lessonKey: 'Lunedì-08:00' },
       { day: 'Martedì', time: '09:00', subject: 'Physics', classId: '3B', lessonKey: 'Martedì-09:00' }
     ]
   }));

3. Open in-classe.html - the grid should populate automatically

4. Test keyboard navigation:
   - Tab to the grid
   - Use arrow keys to navigate
   - Press Enter on a cell with a lesson

COMPATIBILITY
-------------
- Works with existing schedule-patch.js
- Compatible with window.loadScheduleFromStorageOrOpener() API
- Compatible with window.enterLessonFromSchedule() API
- Falls back gracefully when APIs are not available
- Does not break existing app functionality
- Does not auto-open lesson-picker modal on page load

TROUBLESHOOTING
---------------
Grid not populating:
- Check browser console for debug messages
- Verify schedule data exists in localStorage
- Verify data format matches expected structure
- Call window.initScheduleGrid() manually to re-populate

Keyboard navigation not working:
- Verify cells have data-day and data-time attributes
- Verify cells are focusable (tabindex attribute)
- Check for JavaScript errors in console

Buttons not working:
- Verify window.enterLessonFromSchedule() is available
- Check localStorage for lastOpenedLesson key after clicking
- Verify page reloads after clicking (fallback behavior)

SUPPORT
-------
For issues or questions, please check the TECHNICAL_DOC.md and IMPLEMENTATION_IN_CLASSE.md
files in the repository root.
