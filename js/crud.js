// js/crud.js
// CRUD operations and modal management for Docente++

import { state, saveData } from './data.js';
import { showToast } from './ui.js';

/**
 * Show a modal dialog
 * @param {string} modalId - ID of the modal element
 */
export function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        // Prevent body scrolling when modal is open
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Hide a modal dialog
 * @param {string} modalId - ID of the modal element
 */
export function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

/**
 * Create a generic modal with form
 * @param {Object} config - Modal configuration
 * @returns {string} Modal HTML
 */
export function createModal(config) {
    const { id, title, fields, onSubmit, submitLabel = 'Salva', cancelLabel = 'Annulla' } = config;
    
    const fieldsHtml = fields.map(field => {
        const { name, label, type = 'text', required = false, options = [], value = '' } = field;
        
        if (type === 'select') {
            return `
                <div class="form-group">
                    <label for="${id}-${name}">${label}${required ? ' *' : ''}</label>
                    <select id="${id}-${name}" name="${name}" ${required ? 'required' : ''}>
                        <option value="">-- Seleziona --</option>
                        ${options.map(opt => `<option value="${opt.value}" ${opt.value === value ? 'selected' : ''}>${opt.label}</option>`).join('')}
                    </select>
                </div>
            `;
        } else if (type === 'textarea') {
            return `
                <div class="form-group">
                    <label for="${id}-${name}">${label}${required ? ' *' : ''}</label>
                    <textarea id="${id}-${name}" name="${name}" rows="4" ${required ? 'required' : ''}>${value}</textarea>
                </div>
            `;
        } else {
            return `
                <div class="form-group">
                    <label for="${id}-${name}">${label}${required ? ' *' : ''}</label>
                    <input type="${type}" id="${id}-${name}" name="${name}" value="${value}" ${required ? 'required' : ''}>
                </div>
            `;
        }
    }).join('');
    
    return `
        <div id="${id}" class="modal" style="display: none;">
            <div class="modal-content">
                <h2>${title}</h2>
                <form id="${id}-form">
                    ${fieldsHtml}
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">${submitLabel}</button>
                        <button type="button" class="btn btn-secondary modal-close">${cancelLabel}</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

// ==================== CLASSES CRUD ====================

/**
 * Get form data as object
 */
function getFormData(formId) {
    const form = document.getElementById(formId);
    const formData = new FormData(form);
    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    return data;
}

/**
 * Create a new class
 */
export function createClass() {
    const data = getFormData('class-modal-form');
    
    if (!data.name || !data.name.trim()) {
        showToast('Il nome della classe è obbligatorio', 'error');
        return;
    }
    
    const newClass = {
        id: `class_${Date.now()}`,
        name: data.name.trim(),
        schoolYear: data.schoolYear || state.settings.schoolYear || '',
        description: data.description || ''
    };
    
    state.classes.push(newClass);
    saveData();
    
    hideModal('class-modal');
    showToast('Classe creata con successo!', 'success');
    window.app.renderClasses();
}

/**
 * Edit an existing class
 */
export function editClass(classId) {
    const classItem = state.classes.find(c => c.id === classId);
    if (!classItem) {
        showToast('Classe non trovata', 'error');
        return;
    }
    
    // Populate form with existing data
    document.getElementById('class-modal-name').value = classItem.name;
    document.getElementById('class-modal-schoolYear').value = classItem.schoolYear;
    document.getElementById('class-modal-description').value = classItem.description || '';
    
    // Change form submit to update instead of create
    const form = document.getElementById('class-modal-form');
    form.onsubmit = (e) => {
        e.preventDefault();
        updateClass(classId);
    };
    
    showModal('class-modal');
}

/**
 * Update an existing class
 */
function updateClass(classId) {
    const data = getFormData('class-modal-form');
    
    const classItem = state.classes.find(c => c.id === classId);
    if (!classItem) {
        showToast('Classe non trovata', 'error');
        return;
    }
    
    classItem.name = data.name.trim();
    classItem.schoolYear = data.schoolYear || '';
    classItem.description = data.description || '';
    
    saveData();
    hideModal('class-modal');
    showToast('Classe aggiornata con successo!', 'success');
    window.app.renderClasses();
}

/**
 * Delete a class
 */
export function deleteClass(classId) {
    const classItem = state.classes.find(c => c.id === classId);
    if (!classItem) {
        showToast('Classe non trovata', 'error');
        return;
    }
    
    // Check if there are students in this class
    const studentsInClass = state.students.filter(s => s.classId === classId);
    
    let confirmMsg = `Sei sicuro di voler eliminare la classe "${classItem.name}"?`;
    if (studentsInClass.length > 0) {
        confirmMsg += `\n\nATTENZIONE: Ci sono ${studentsInClass.length} studenti associati a questa classe. Verranno scollegati dalla classe.`;
    }
    
    if (!confirm(confirmMsg)) {
        return;
    }
    
    // Remove class
    state.classes = state.classes.filter(c => c.id !== classId);
    
    // Unlink students from this class
    state.students.forEach(s => {
        if (s.classId === classId) {
            s.classId = null;
        }
    });
    
    // If this was the active class, reset it
    if (state.activeClass === classId) {
        state.activeClass = null;
    }
    
    saveData();
    showToast('Classe eliminata con successo!', 'success');
    window.app.renderClasses();
}

// ==================== STUDENTS CRUD ====================

/**
 * Create a new student
 */
export function createStudent() {
    const data = getFormData('student-modal-form');
    
    if (!data.firstName || !data.firstName.trim() || !data.lastName || !data.lastName.trim()) {
        showToast('Nome e cognome sono obbligatori', 'error');
        return;
    }
    
    const newStudent = {
        id: `student_${Date.now()}`,
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email || '',
        classId: data.classId || null,
        birthDate: data.birthDate || '',
        notes: data.notes || ''
    };
    
    state.students.push(newStudent);
    saveData();
    
    hideModal('student-modal');
    showToast('Studente aggiunto con successo!', 'success');
    window.app.renderStudents();
}

/**
 * Edit an existing student
 */
export function editStudent(studentId) {
    const student = state.students.find(s => s.id === studentId);
    if (!student) {
        showToast('Studente non trovato', 'error');
        return;
    }
    
    // Populate dropdowns first
    window.app.populateClassDropdowns();
    
    // Populate form
    document.getElementById('student-modal-firstName').value = student.firstName;
    document.getElementById('student-modal-lastName').value = student.lastName;
    document.getElementById('student-modal-email').value = student.email || '';
    document.getElementById('student-modal-classId').value = student.classId || '';
    document.getElementById('student-modal-birthDate').value = student.birthDate || '';
    document.getElementById('student-modal-notes').value = student.notes || '';
    
    // Change form submit to update
    const form = document.getElementById('student-modal-form');
    form.onsubmit = (e) => {
        e.preventDefault();
        updateStudent(studentId);
    };
    
    showModal('student-modal');
}

/**
 * Update an existing student
 */
function updateStudent(studentId) {
    const data = getFormData('student-modal-form');
    
    const student = state.students.find(s => s.id === studentId);
    if (!student) {
        showToast('Studente non trovato', 'error');
        return;
    }
    
    student.firstName = data.firstName.trim();
    student.lastName = data.lastName.trim();
    student.email = data.email || '';
    student.classId = data.classId || null;
    student.birthDate = data.birthDate || '';
    student.notes = data.notes || '';
    
    saveData();
    hideModal('student-modal');
    showToast('Studente aggiornato con successo!', 'success');
    window.app.renderStudents();
}

/**
 * Delete a student
 */
export function deleteStudent(studentId) {
    const student = state.students.find(s => s.id === studentId);
    if (!student) {
        showToast('Studente non trovato', 'error');
        return;
    }
    
    if (!confirm(`Sei sicuro di voler eliminare lo studente "${student.firstName} ${student.lastName}"?\n\nATTENZIONE: Verranno eliminate anche tutte le valutazioni associate.`)) {
        return;
    }
    
    // Remove student
    state.students = state.students.filter(s => s.id !== studentId);
    
    // Remove associated evaluations
    state.evaluations = state.evaluations.filter(e => e.studentId !== studentId);
    
    saveData();
    showToast('Studente eliminato con successo!', 'success');
    window.app.renderStudents();
}

// ==================== LESSONS CRUD ====================

/**
 * Create a new lesson
 */
export function createLesson() {
    const data = getFormData('lesson-modal-form');
    
    if (!data.title || !data.title.trim() || !data.subject || !data.date) {
        showToast('Titolo, materia e data sono obbligatori', 'error');
        return;
    }
    
    const newLesson = {
        id: `lesson_${Date.now()}`,
        title: data.title.trim(),
        subject: data.subject,
        description: data.description || '',
        date: data.date,
        time: data.time || '09:00',
        classId: data.classId || null
    };
    
    state.lessons.push(newLesson);
    saveData();
    
    hideModal('lesson-modal');
    showToast('Lezione creata con successo!', 'success');
    window.app.renderLessons();
}

/**
 * Edit an existing lesson
 */
export function editLesson(lessonId) {
    const lesson = state.lessons.find(l => l.id === lessonId);
    if (!lesson) {
        showToast('Lezione non trovata', 'error');
        return;
    }
    
    // Populate dropdowns first
    window.app.populateClassDropdowns();
    window.app.populateSubjectDropdown();
    
    // Populate form
    document.getElementById('lesson-modal-title').value = lesson.title;
    document.getElementById('lesson-modal-subject').value = lesson.subject;
    document.getElementById('lesson-modal-description').value = lesson.description || '';
    document.getElementById('lesson-modal-date').value = lesson.date;
    document.getElementById('lesson-modal-time').value = lesson.time || '09:00';
    document.getElementById('lesson-modal-classId').value = lesson.classId || '';
    
    // Change form submit to update
    const form = document.getElementById('lesson-modal-form');
    form.onsubmit = (e) => {
        e.preventDefault();
        updateLesson(lessonId);
    };
    
    showModal('lesson-modal');
}

/**
 * Update an existing lesson
 */
function updateLesson(lessonId) {
    const data = getFormData('lesson-modal-form');
    
    const lesson = state.lessons.find(l => l.id === lessonId);
    if (!lesson) {
        showToast('Lezione non trovata', 'error');
        return;
    }
    
    lesson.title = data.title.trim();
    lesson.subject = data.subject;
    lesson.description = data.description || '';
    lesson.date = data.date;
    lesson.time = data.time || '09:00';
    lesson.classId = data.classId || null;
    
    saveData();
    hideModal('lesson-modal');
    showToast('Lezione aggiornata con successo!', 'success');
    window.app.renderLessons();
}

/**
 * Delete a lesson
 */
export function deleteLesson(lessonId) {
    const lesson = state.lessons.find(l => l.id === lessonId);
    if (!lesson) {
        showToast('Lezione non trovata', 'error');
        return;
    }
    
    if (!confirm(`Sei sicuro di voler eliminare la lezione "${lesson.title}"?`)) {
        return;
    }
    
    state.lessons = state.lessons.filter(l => l.id !== lessonId);
    saveData();
    showToast('Lezione eliminata con successo!', 'success');
    window.app.renderLessons();
}

// ==================== ACTIVITIES CRUD ====================

/**
 * Create a new activity
 */
export function createActivity() {
    const data = getFormData('activity-modal-form');
    
    if (!data.title || !data.title.trim() || !data.type || !data.date) {
        showToast('Titolo, tipo e data sono obbligatori', 'error');
        return;
    }
    
    const newActivity = {
        id: `activity_${Date.now()}`,
        title: data.title.trim(),
        type: data.type,
        description: data.description || '',
        date: data.date,
        status: data.status || 'pianificata',
        classId: data.classId || null
    };
    
    state.activities.push(newActivity);
    saveData();
    
    hideModal('activity-modal');
    showToast('Attività creata con successo!', 'success');
    window.app.renderActivities();
}

/**
 * Edit an existing activity
 */
export function editActivity(activityId) {
    const activity = state.activities.find(a => a.id === activityId);
    if (!activity) {
        showToast('Attività non trovata', 'error');
        return;
    }
    
    // Populate dropdowns first
    window.app.populateClassDropdowns();
    
    // Populate form
    document.getElementById('activity-modal-title').value = activity.title;
    document.getElementById('activity-modal-type').value = activity.type;
    document.getElementById('activity-modal-description').value = activity.description || '';
    document.getElementById('activity-modal-date').value = activity.date;
    document.getElementById('activity-modal-status').value = activity.status;
    document.getElementById('activity-modal-classId').value = activity.classId || '';
    
    // Change form submit to update
    const form = document.getElementById('activity-modal-form');
    form.onsubmit = (e) => {
        e.preventDefault();
        updateActivity(activityId);
    };
    
    showModal('activity-modal');
}

/**
 * Update an existing activity
 */
function updateActivity(activityId) {
    const data = getFormData('activity-modal-form');
    
    const activity = state.activities.find(a => a.id === activityId);
    if (!activity) {
        showToast('Attività non trovata', 'error');
        return;
    }
    
    activity.title = data.title.trim();
    activity.type = data.type;
    activity.description = data.description || '';
    activity.date = data.date;
    activity.status = data.status;
    activity.classId = data.classId || null;
    
    saveData();
    hideModal('activity-modal');
    showToast('Attività aggiornata con successo!', 'success');
    window.app.renderActivities();
}

/**
 * Delete an activity
 */
export function deleteActivity(activityId) {
    const activity = state.activities.find(a => a.id === activityId);
    if (!activity) {
        showToast('Attività non trovata', 'error');
        return;
    }
    
    // Check if there are evaluations linked to this activity
    const linkedEvals = state.evaluations.filter(e => e.activityId === activityId);
    
    let confirmMsg = `Sei sicuro di voler eliminare l'attività "${activity.title}"?`;
    if (linkedEvals.length > 0) {
        confirmMsg += `\n\nATTENZIONE: Ci sono ${linkedEvals.length} valutazioni associate a questa attività. Verranno eliminate.`;
    }
    
    if (!confirm(confirmMsg)) {
        return;
    }
    
    state.activities = state.activities.filter(a => a.id !== activityId);
    state.evaluations = state.evaluations.filter(e => e.activityId !== activityId);
    
    saveData();
    showToast('Attività eliminata con successo!', 'success');
    window.app.renderActivities();
}

// ==================== EVALUATIONS CRUD ====================

/**
 * Create a new evaluation
 */
export function createEvaluation() {
    const data = getFormData('evaluation-modal-form');
    
    if (!data.studentId || !data.activityId) {
        showToast('Studente e attività sono obbligatori', 'error');
        return;
    }
    
    const newEvaluation = {
        id: `eval_${Date.now()}`,
        studentId: data.studentId,
        activityId: data.activityId,
        grade: data.grade || '',
        comment: data.comment || '',
        date: data.date || new Date().toISOString().split('T')[0]
    };
    
    state.evaluations.push(newEvaluation);
    saveData();
    
    hideModal('evaluation-modal');
    showToast('Valutazione inserita con successo!', 'success');
    window.app.renderEvaluations();
}

/**
 * Edit an existing evaluation
 */
export function editEvaluation(evaluationId) {
    const evaluation = state.evaluations.find(e => e.id === evaluationId);
    if (!evaluation) {
        showToast('Valutazione non trovata', 'error');
        return;
    }
    
    // Populate dropdowns first
    window.app.populateStudentDropdown();
    window.app.populateActivityDropdown();
    
    // Populate form
    document.getElementById('evaluation-modal-studentId').value = evaluation.studentId;
    document.getElementById('evaluation-modal-activityId').value = evaluation.activityId;
    document.getElementById('evaluation-modal-grade').value = evaluation.grade || '';
    document.getElementById('evaluation-modal-comment').value = evaluation.comment || '';
    document.getElementById('evaluation-modal-date').value = evaluation.date;
    
    // Change form submit to update
    const form = document.getElementById('evaluation-modal-form');
    form.onsubmit = (e) => {
        e.preventDefault();
        updateEvaluation(evaluationId);
    };
    
    showModal('evaluation-modal');
}

/**
 * Update an existing evaluation
 */
function updateEvaluation(evaluationId) {
    const data = getFormData('evaluation-modal-form');
    
    const evaluation = state.evaluations.find(e => e.id === evaluationId);
    if (!evaluation) {
        showToast('Valutazione non trovata', 'error');
        return;
    }
    
    evaluation.studentId = data.studentId;
    evaluation.activityId = data.activityId;
    evaluation.grade = data.grade || '';
    evaluation.comment = data.comment || '';
    evaluation.date = data.date;
    
    saveData();
    hideModal('evaluation-modal');
    showToast('Valutazione aggiornata con successo!', 'success');
    window.app.renderEvaluations();
}

/**
 * Delete an evaluation
 */
export function deleteEvaluation(evaluationId) {
    const evaluation = state.evaluations.find(e => e.id === evaluationId);
    if (!evaluation) {
        showToast('Valutazione non trovata', 'error');
        return;
    }
    
    if (!confirm('Sei sicuro di voler eliminare questa valutazione?')) {
        return;
    }
    
    state.evaluations = state.evaluations.filter(e => e.id !== evaluationId);
    saveData();
    showToast('Valutazione eliminata con successo!', 'success');
    window.app.renderEvaluations();
}

// ==================== CSV IMPORT/EXPORT ====================

/**
 * Export students to CSV
 */
export function exportStudentsCSV() {
    if (state.students.length === 0) {
        showToast('Nessuno studente da esportare', 'info');
        return;
    }
    
    // Create CSV header
    const headers = ['Nome', 'Cognome', 'Email', 'Classe', 'Data di Nascita', 'Note'];
    const rows = [headers];
    
    // Add student data
    state.students.forEach(student => {
        const classObj = state.classes.find(c => c.id === student.classId);
        const className = classObj ? classObj.name : '';
        
        rows.push([
            student.firstName,
            student.lastName,
            student.email || '',
            className,
            student.birthDate || '',
            student.notes || ''
        ]);
    });
    
    // Convert to CSV string
    const csvContent = rows.map(row => 
        row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `studenti_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    showToast('File CSV esportato con successo!', 'success');
}

/**
 * Import students from CSV file
 */
export function importStudentsCSV(file) {
    if (!file) {
        showToast('Nessun file selezionato', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const csvText = e.target.result;
            
            // Use PapaParse if available, otherwise simple parsing
            if (typeof Papa !== 'undefined') {
                const results = Papa.parse(csvText, { header: true, skipEmptyLines: true });
                processCSVData(results.data);
            } else {
                // Simple CSV parsing fallback
                const lines = csvText.split('\n');
                const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
                const data = [];
                
                for (let i = 1; i < lines.length; i++) {
                    if (lines[i].trim()) {
                        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
                        const row = {};
                        headers.forEach((h, idx) => {
                            row[h] = values[idx] || '';
                        });
                        data.push(row);
                    }
                }
                processCSVData(data);
            }
        } catch (error) {
            console.error('Error parsing CSV:', error);
            showToast('Errore nella lettura del file CSV', 'error');
        }
    };
    reader.readAsText(file);
}

/**
 * Process parsed CSV data
 */
function processCSVData(data) {
    let imported = 0;
    let updated = 0;
    
    data.forEach(row => {
        const firstName = row['Nome'] || row['nome'] || row['firstName'] || '';
        const lastName = row['Cognome'] || row['cognome'] || row['lastName'] || '';
        
        if (!firstName.trim() || !lastName.trim()) {
            return; // Skip invalid rows
        }
        
        // Check if student already exists
        const existing = state.students.find(s => 
            s.firstName.toLowerCase() === firstName.trim().toLowerCase() &&
            s.lastName.toLowerCase() === lastName.trim().toLowerCase()
        );
        
        if (existing) {
            // Update existing student
            existing.email = row['Email'] || row['email'] || existing.email;
            existing.birthDate = row['Data di Nascita'] || row['data_nascita'] || row['birthDate'] || existing.birthDate;
            existing.notes = row['Note'] || row['note'] || row['notes'] || existing.notes;
            
            // Try to match class by name
            const className = row['Classe'] || row['classe'] || row['class'] || '';
            if (className) {
                const classObj = state.classes.find(c => c.name.toLowerCase() === className.toLowerCase());
                if (classObj) {
                    existing.classId = classObj.id;
                }
            }
            updated++;
        } else {
            // Create new student
            const newStudent = {
                id: `student_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: row['Email'] || row['email'] || '',
                birthDate: row['Data di Nascita'] || row['data_nascita'] || row['birthDate'] || '',
                notes: row['Note'] || row['note'] || row['notes'] || '',
                classId: null
            };
            
            // Try to match class by name
            const className = row['Classe'] || row['classe'] || row['class'] || '';
            if (className) {
                const classObj = state.classes.find(c => c.name.toLowerCase() === className.toLowerCase());
                if (classObj) {
                    newStudent.classId = classObj.id;
                }
            }
            
            state.students.push(newStudent);
            imported++;
        }
    });
    
    saveData();
    showToast(`Import completato: ${imported} nuovi studenti, ${updated} aggiornati`, 'success');
    window.app.renderStudents();
}
