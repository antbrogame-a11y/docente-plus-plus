# 📚 Discipline Selection Feature - Implementation Summary

## Overview

This document describes the implementation of the discipline selection feature that allows teachers to configure which subjects they teach and automatically filter lessons and schedules based on their selections.

## Feature Scope

### What was implemented:

1. **Settings UI**
   - New section "📚 Discipline Insegnate" in the profile settings
   - 20 predefined disciplines (Italiano, Storia, Geografia, Matematica, Scienze, Inglese, Francese, Spagnolo, Tedesco, Arte e Immagine, Musica, Educazione Fisica, Tecnologia, Religione, Informatica, Fisica, Chimica, Filosofia, Latino, Greco)
   - Checkbox selection interface
   - Save button to persist selections

2. **Data Model**
   - Added `state.settings.teacherDisciplines` array to store selected disciplines
   - Persisted in `localStorage`
   - Backward compatible (if no disciplines selected, all are available)

3. **Filtering Logic**
   - **Lessons Page**: Shows only lessons for selected disciplines
   - **Schedule View**: Displays only schedule slots for selected disciplines
   - **Lesson Modal**: Subject dropdown limited to selected disciplines

4. **Schedule Enhancement**
   - Added `subject` field to schedule slots
   - Schedule slot editor now includes a "Materia" dropdown
   - Schedule display shows the subject for each slot

## Files Modified

### Frontend Files
- `index.html` - Added discipline selection UI
- `app.js` - Added methods for saving/loading disciplines, filtering logic
- `js/events.js` - Added event handler for disciplines form

### Documentation
- `docs/user-guide.md` - Added user instructions
- `docs/CONFIGURATION_GUIDE.md` - Added technical configuration guide
- `README.md` - Updated feature list

## Technical Details

### Key Methods Added

#### `saveDisciplinesSettings()`
Saves selected disciplines to `state.settings.teacherDisciplines` and updates the subject dropdown.

```javascript
saveDisciplinesSettings() {
    const selectedDisciplines = [];
    document.querySelectorAll('.discipline-checkbox:checked').forEach(checkbox => {
        selectedDisciplines.push(checkbox.value);
    });
    state.settings.teacherDisciplines = selectedDisciplines;
    saveData();
    showToast('Discipline salvate!', 'success');
    this.populateSubjectDropdown();
    this.renderSettings();
}
```

#### `loadDisciplinesSettingsForm()`
Loads saved disciplines and checks appropriate checkboxes.

```javascript
loadDisciplinesSettingsForm() {
    const teacherDisciplines = state.settings.teacherDisciplines || [];
    document.querySelectorAll('.discipline-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
    teacherDisciplines.forEach(discipline => {
        const checkbox = document.querySelector(`.discipline-checkbox[value="${discipline}"]`);
        if (checkbox) {
            checkbox.checked = true;
        }
    });
}
```

#### `getTeacherSubjects()`
Helper method to get the list of subjects to display.

```javascript
getTeacherSubjects() {
    const teacherDisciplines = state.settings.teacherDisciplines;
    return (teacherDisciplines && teacherDisciplines.length > 0) 
        ? teacherDisciplines 
        : this.subjectsPreset;
}
```

#### `shouldDisplaySubject(subject)`
Determines if a subject should be displayed based on teacher's selections.

```javascript
shouldDisplaySubject(subject) {
    const teacherDisciplines = state.settings.teacherDisciplines;
    if (!teacherDisciplines || teacherDisciplines.length === 0) {
        return true; // Show all if none selected
    }
    return teacherDisciplines.includes(subject);
}
```

### Filtering Implementation

#### Lessons Filtering
```javascript
renderLessons() {
    // ... existing code ...
    
    // Filter lessons by teacher's disciplines
    const filteredLessons = sortedLessons.filter(lesson => 
        !lesson.subject || this.shouldDisplaySubject(lesson.subject)
    );
    
    if (filteredLessons.length === 0) {
        list.innerHTML = '<p>Nessuna lezione per le discipline selezionate. Verifica le tue discipline nelle <a href="#" onclick="window.app.switchTab(\'settings\'); return false;">Impostazioni</a>.</p>';
        return;
    }
    // ... render filtered lessons ...
}
```

#### Schedule Filtering
```javascript
// In renderWeeklySchedule() and renderDailySchedule()
if (slot && slot.classId) {
    // Filter by teacher's disciplines if a subject is set
    if (slot.subject && !this.shouldDisplaySubject(slot.subject)) {
        tableHtml += '<div class="schedule-slot-empty">+ Aggiungi</div>';
    } else {
        // Display slot with subject
        tableHtml += `
            <div class="schedule-slot-content">
                <div class="schedule-class-name">${classObj ? classObj.name : 'Classe N/A'}</div>
                ${slot.subject ? `<div class="schedule-subject">${slot.subject}</div>` : ''}
                // ... rest of slot content ...
            </div>
        `;
    }
}
```

## User Guide

### How to Use

1. Navigate to **Settings** > **Profilo Docente**
2. Scroll to **📚 Discipline Insegnate** section
3. Select the disciplines you teach
4. Click **Salva Discipline**

### Effects

- Lessons page will only show lessons for your selected disciplines
- Personal schedule will only show slots for your selected disciplines
- When creating a new lesson, only your disciplines will be available in the subject dropdown

### Default Behavior

If no disciplines are selected, all disciplines remain available. This ensures backward compatibility with existing data.

## Testing

- All existing tests pass (70/70)
- Manual testing confirmed:
  - Disciplines can be selected and saved
  - Lessons are filtered correctly
  - Schedule is filtered correctly
  - Subject dropdown is limited correctly

## Future Enhancements

Potential improvements for future versions:

1. **Custom Disciplines**: Allow teachers to add custom disciplines beyond the 20 predefined ones
2. **Discipline Grouping**: Group related disciplines (e.g., Sciences, Languages)
3. **Export/Import**: Include discipline selection in backup/restore functionality
4. **Statistics**: Show statistics per discipline (number of lessons, hours taught, etc.)
5. **Color Coding**: Assign colors to disciplines for better visual identification in schedules

## Migration Notes

This feature is fully backward compatible:
- Existing installations without discipline selection will show all disciplines (default behavior)
- Existing lessons and schedule slots without a subject field will still be displayed
- No database migration required

## Support

For questions or issues related to this feature, refer to:
- User documentation: `docs/user-guide.md`
- Technical documentation: `docs/CONFIGURATION_GUIDE.md`
- Configuration examples in this document
