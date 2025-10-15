# 📝 CRUD Implementation Guide - Docente++

## Overview

This document describes the complete CRUD (Create, Read, Update, Delete) implementation for all entities in Docente++.

## Implemented Modules

### 1. 🏫 Classes Management (Gestione Classi)

**Features:**
- Create new classes with name, school year, and description
- Edit existing classes
- Delete classes (with warning if students are associated)
- View student count per class

**Usage:**
1. Navigate to "Classi" tab
2. Click "➕ Nuova Classe"
3. Fill in the form and click "Salva"

**API:**
- `window.app.newClass()` - Open create modal
- `window.app.editClass(id)` - Edit class
- `window.app.deleteClass(id)` - Delete class

### 2. 👥 Students Management (Gestione Studenti)

**Features:**
- Create students with name, surname, email, class, birth date, notes
- Edit student information
- Delete students (cascades to evaluations)
- **CSV Import**: Import students from CSV file
- **CSV Export**: Export all students to CSV

**CSV Format:**
```csv
Nome,Cognome,Email,Classe,Data di Nascita,Note
Mario,Rossi,mario@example.com,3A,2005-01-15,Student notes
```

**Supported CSV Columns:**
- `Nome`, `nome`, `firstName`
- `Cognome`, `cognome`, `lastName`
- `Email`, `email`
- `Classe`, `classe`, `class`
- `Data di Nascita`, `data_nascita`, `birthDate`
- `Note`, `note`, `notes`

**Usage:**
1. Navigate to "Studenti" tab
2. Click "➕ Nuovo Studente"
3. Fill form and select class from dropdown
4. Click "Salva"

**Import/Export:**
- Click "📤 Importa CSV" to select and import CSV file
- Click "📥 Esporta CSV" to download all students

**API:**
- `window.app.newStudent()` - Open create modal
- `window.app.editStudent(id)` - Edit student
- `window.app.deleteStudent(id)` - Delete student
- `window.app.exportStudentsCSV()` - Export to CSV
- `window.app.importStudentsCSV(file)` - Import from CSV

### 3. 📚 Lessons Management (Gestione Lezioni)

**Features:**
- Create lessons with title, subject, date, time, class, description
- Edit lesson details
- Delete lessons
- Subject dropdown from preset list
- Sorted by date (newest first)

**Preset Subjects:**
- Italiano, Storia, Geografia, Matematica, Scienze
- Inglese, Arte e Immagine, Musica, Educazione Fisica

**Usage:**
1. Navigate to "Lezioni" tab
2. Click "➕ Nuova Lezione"
3. Fill form (title, subject, date required)
4. Click "Salva"

**API:**
- `window.app.newLesson()` - Open create modal
- `window.app.editLesson(id)` - Edit lesson
- `window.app.deleteLesson(id)` - Delete lesson

### 4. ✍️ Activities Management (Gestione Attività)

**Features:**
- Create activities with title, type, date, status, class, description
- Edit activity details
- Delete activities (cascades to evaluations)
- Activity types: Compito, Verifica, Progetto, Laboratorio, Esercitazione
- Status tracking: pianificata, in corso, completata
- Color-coded status display

**Usage:**
1. Navigate to "Attività" tab
2. Click "➕ Nuova Attività"
3. Fill form (title, type, date required)
4. Select status and optional class
5. Click "Salva"

**API:**
- `window.app.newActivity()` - Open create modal
- `window.app.editActivity(id)` - Edit activity
- `window.app.deleteActivity(id)` - Delete activity

### 5. 📊 Evaluations Management (Gestione Valutazioni)

**Features:**
- Create evaluations linking student + activity
- Edit evaluation grade and comments
- Delete evaluations
- View student name and activity title
- Date tracking

**Usage:**
1. Navigate to "Valutazioni" tab
2. Click "➕ Nuova Valutazione"
3. Select student and activity from dropdowns
4. Enter grade (text field, can be numeric or descriptive)
5. Add optional comment
6. Click "Salva"

**API:**
- `window.app.newEvaluation()` - Open create modal
- `window.app.editEvaluation(id)` - Edit evaluation
- `window.app.deleteEvaluation(id)` - Delete evaluation

## Technical Architecture

### File Structure

```
js/
├── crud.js          # CRUD operations module (700+ lines)
├── data.js          # State management & localStorage
├── ui.js            # UI utilities (modals, toasts)
└── events.js        # Event listeners

app.js               # Main application class
index.html           # HTML with modals
styles.css           # Material Design 3 styles
```

### State Management

All data is stored in `state` object from `js/data.js`:

```javascript
const state = {
    classes: [],      // Array of class objects
    students: [],     // Array of student objects
    lessons: [],      // Array of lesson objects
    activities: [],   // Array of activity objects
    evaluations: []   // Array of evaluation objects
};
```

### Data Persistence

- **Automatic Save**: All CRUD operations automatically call `saveData()`
- **localStorage**: Data persisted in browser localStorage
- **Format**: JSON serialization
- **Keys**: 'classes', 'students', 'lessons', 'activities', 'evaluations'

### Modal System

Modals are created in HTML with unique IDs:
- `class-modal`
- `student-modal`
- `lesson-modal`
- `activity-modal`
- `evaluation-modal`

**Modal Functions:**
- `showModal(modalId)` - Display modal
- `hideModal(modalId)` - Hide modal
- Form submission handled by dynamically set `onsubmit` handlers

### Form Handling

```javascript
// Create mode
form.onsubmit = (e) => {
    e.preventDefault();
    createEntity();
};

// Edit mode
form.onsubmit = (e) => {
    e.preventDefault();
    updateEntity(id);
};
```

### Notifications

**Toast Messages:**
- Success: Green toast with checkmark
- Error: Red toast with X
- Info: Blue toast with i
- Duration: 3000ms (default)

**Confirmation Dialogs:**
- Delete operations show native `confirm()` dialog
- Warns about cascading deletes
- Returns if user cancels

## Data Relationships

### Cascade Delete Rules

**Deleting a Class:**
- ❌ Does NOT delete students
- ✅ Unlinks students from the class (sets classId to null)
- ⚠️ Warns user if students are associated

**Deleting a Student:**
- ✅ Deletes all associated evaluations
- ⚠️ Warns user about evaluation deletion

**Deleting an Activity:**
- ✅ Deletes all associated evaluations
- ⚠️ Warns user about evaluation deletion

### Foreign Key Relationships

```
Class
  └─ has many Students (via student.classId)
  └─ has many Lessons (via lesson.classId)
  └─ has many Activities (via activity.classId)

Student
  └─ belongs to Class (student.classId)
  └─ has many Evaluations (via evaluation.studentId)

Activity
  └─ belongs to Class (activity.classId)
  └─ has many Evaluations (via evaluation.activityId)

Evaluation
  └─ belongs to Student (evaluation.studentId)
  └─ belongs to Activity (evaluation.activityId)
```

## Validation

### Required Fields

**Class:**
- ✅ name (required)

**Student:**
- ✅ firstName (required)
- ✅ lastName (required)

**Lesson:**
- ✅ title (required)
- ✅ subject (required)
- ✅ date (required)

**Activity:**
- ✅ title (required)
- ✅ type (required)
- ✅ date (required)

**Evaluation:**
- ✅ studentId (required)
- ✅ activityId (required)

### Data Integrity

- Unique IDs generated using timestamp + random string
- Class names can be duplicated (real-world scenario)
- Student emails not enforced unique (optional field)
- Orphaned records prevented by cascade deletes

## CSV Import/Export Details

### CSV Export

**Function:** `exportStudentsCSV()`

**Process:**
1. Creates CSV header row
2. Iterates through all students
3. Looks up class name by classId
4. Formats each row with quoted values
5. Creates Blob and downloads file

**Filename:** `studenti_YYYY-MM-DD.csv`

### CSV Import

**Function:** `importStudentsCSV(file)`

**Process:**
1. Reads file using FileReader
2. Parses CSV with PapaParse (if available) or simple parser
3. Maps flexible column names
4. Checks for duplicate students (by name)
5. Updates existing or creates new students
6. Matches class by name
7. Saves data and shows summary

**Smart Features:**
- Flexible column name matching
- Duplicate detection and update
- Class name matching
- Validation for required fields
- Summary: "X new students, Y updated"

## Browser Compatibility

**ES6 Modules:**
- Chrome 61+
- Firefox 60+
- Safari 11+
- Edge 79+

**localStorage:**
- All modern browsers
- 5-10MB storage limit

**CSV Features:**
- FileReader API (all modern browsers)
- Blob API (all modern browsers)
- PapaParse library (optional, enhances CSV parsing)

## Troubleshooting

### Modal doesn't open
- Check `window.app` exists in console
- Verify modal HTML is in index.html
- Check browser console for errors

### Data not saving
- Check localStorage is enabled
- Verify no quota exceeded errors
- Check `saveData()` returns true

### CSV import fails
- Verify CSV encoding is UTF-8
- Check required columns exist
- Ensure PapaParse loaded (check console)

### Strict mode error
- Avoid using `eval` as variable name
- Avoid using `arguments` as variable name
- These are reserved in ES6 modules

## Future Enhancements

**Possible additions:**
- [ ] Bulk operations (select multiple, delete/edit)
- [ ] Search and filter functionality
- [ ] Sorting by different columns
- [ ] Pagination for large datasets
- [ ] CSV export for other entities (lessons, activities)
- [ ] Excel import/export
- [ ] PDF export with custom templates
- [ ] Undo/redo functionality
- [ ] Audit log of changes

## References

- [Material Design 3](https://m3.material.io/)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [PapaParse Documentation](https://www.papaparse.com/docs)
- [ES6 Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
