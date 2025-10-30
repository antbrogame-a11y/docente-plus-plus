
// Funzione di setup per la sezione Valutazioni, caricata dinamicamente.
const setupEvaluations = () => {

    if (typeof loadData !== 'function' || typeof saveData !== 'function') {
        console.error('Le funzioni globali loadData o saveData non sono state trovate.');
        return;
    }

    // --- ELEMENTI DEL DOM ---
    const classSelect = document.getElementById('eval-class-select');
    const studentSelect = document.getElementById('eval-student-select');
    const evaluationListTitle = document.getElementById('evaluation-list-title');
    const evaluationListDiv = document.getElementById('evaluation-list');
    const addEvaluationBtn = document.getElementById('add-evaluation-btn');

    // Elementi del Modale
    const modal = document.getElementById('evaluation-modal');
    const modalTitle = document.getElementById('evaluation-modal-title');
    const closeModalBtn = modal.querySelector('.close-btn');
    const evaluationForm = document.getElementById('evaluation-form');
    const evaluationIdInput = document.getElementById('evaluation-id-input');
    const evaluationStudentIdInput = document.getElementById('evaluation-student-id-input');
    const gradeInput = document.getElementById('evaluation-grade-input');
    const dateInput = document.getElementById('evaluation-date-input');
    const notesInput = document.getElementById('evaluation-notes-input');

    // --- DATI ---
    let classes = loadData('docentepp_classes', []);
    let students = loadData('docentepp_students', []);
    let evaluations = loadData('docentepp_evaluations', []);

    // --- FUNZIONI ---

    const populateClasses = () => {
        classSelect.innerHTML = '<option value="">Seleziona una classe...</option>';
        classes.forEach(c => {
            const option = document.createElement('option');
            option.value = c.id;
            option.textContent = c.name;
            classSelect.appendChild(option);
        });
    };

    const populateStudents = (classId) => {
        studentSelect.innerHTML = '<option value="">Seleziona uno studente...</option>';
        if (!classId) {
            studentSelect.disabled = true;
            return;
        }
        const filteredStudents = students.filter(s => s.classId === Number(classId));
        studentSelect.disabled = filteredStudents.length === 0;
        if(filteredStudents.length === 0) studentSelect.innerHTML = '<option value="">Nessuno studente</option>';

        filteredStudents.forEach(s => {
            const option = document.createElement('option');
            option.value = s.id;
            option.textContent = `${s.name} ${s.surname}`;
            studentSelect.appendChild(option);
        });
    };

    const renderEvaluations = (studentId) => {
        evaluationListDiv.innerHTML = '';
        addEvaluationBtn.disabled = !studentId;
        const selectedStudent = students.find(s => s.id === Number(studentId));

        if (!studentId || !selectedStudent) {
            evaluationListTitle.textContent = 'Valutazioni';
            evaluationListDiv.innerHTML = '<p class="empty-list-message">Seleziona uno studente per vedere le sue valutazioni.</p>';
            return;
        }

        const filteredEvaluations = evaluations.filter(ev => ev.studentId === Number(studentId));
        const average = filteredEvaluations.length > 0 ? (filteredEvaluations.reduce((acc, curr) => acc + Number(curr.grade), 0) / filteredEvaluations.length).toFixed(2) : 'N/A';

        evaluationListTitle.textContent = `Valutazioni di ${selectedStudent.name} ${selectedStudent.surname} (Media: ${average})`;

        if (filteredEvaluations.length === 0) {
            evaluationListDiv.innerHTML = '<p class="empty-list-message">Nessuna valutazione per questo studente.</p>';
            return;
        }
        
        // Ordina per data più recente
        filteredEvaluations.sort((a, b) => new Date(b.date) - new Date(a.date));

        filteredEvaluations.forEach(ev => {
            const evalElement = document.createElement('div');
            evalElement.className = 'list-item';
            evalElement.innerHTML = `
                <div class="list-item-main">
                    <span class="grade-badge">${ev.grade}</span>
                    <div>
                        <span><strong>${new Date(ev.date).toLocaleDateString()}</strong><br>
                        <small>${ev.notes || 'Nessuna nota'}</small></span>
                    </div>
                </div>
                <div class="list-item-actions">
                    <button class="btn-icon btn-edit" data-id="${ev.id}"><span class="material-symbols-outlined">edit</span></button>
                    <button class="btn-icon btn-delete" data-id="${ev.id}"><span class="material-symbols-outlined">delete</span></button>
                </div>
            `;
            evalElement.querySelector('.btn-edit').addEventListener('click', () => openModal(ev.id));
            evalElement.querySelector('.btn-delete').addEventListener('click', () => deleteEvaluation(ev.id));
            evaluationListDiv.appendChild(evalElement);
        });
    };

    const openModal = (evaluationId = null) => {
        const studentId = Number(studentSelect.value);
        if (!studentId) return;

        evaluationForm.reset();
        evaluationStudentIdInput.value = studentId;
        dateInput.valueAsDate = new Date(); // Imposta data odierna di default

        if (evaluationId) {
            // Modal in modalità Modifica
            modalTitle.textContent = 'Modifica Valutazione';
            const evaluation = evaluations.find(ev => ev.id === evaluationId);
            if (evaluation) {
                evaluationIdInput.value = evaluation.id;
                gradeInput.value = evaluation.grade;
                dateInput.value = evaluation.date;
                notesInput.value = evaluation.notes;
            }
        } else {
            // Modal in modalità Aggiungi
            modalTitle.textContent = 'Aggiungi Valutazione';
            evaluationIdInput.value = '';
        }
        modal.style.display = 'flex';
    };

    const closeModal = () => {
        modal.style.display = 'none';
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const evaluationId = Number(evaluationIdInput.value);
        const evalData = {
            studentId: Number(evaluationStudentIdInput.value),
            grade: parseFloat(gradeInput.value),
            date: dateInput.value,
            notes: notesInput.value.trim()
        };

        if (evaluationId) {
            const index = evaluations.findIndex(ev => ev.id === evaluationId);
            if (index !== -1) {
                evaluations[index] = { ...evaluations[index], ...evalData };
            }
        } else {
            evalData.id = Date.now();
            evaluations.push(evalData);
        }

        saveData('docentepp_evaluations', evaluations);
        renderEvaluations(evalData.studentId);
        closeModal();
    };

    const deleteEvaluation = (evaluationId) => {
        if (confirm('Sei sicuro di voler eliminare questa valutazione?')) {
            evaluations = evaluations.filter(ev => ev.id !== evaluationId);
            saveData('docentepp_evaluations', evaluations);
            renderEvaluations(studentSelect.value);
        }
    };

    // --- EVENT LISTENER ---
    classSelect.addEventListener('change', (e) => {
        populateStudents(e.target.value);
        renderEvaluations(null); // Pulisce la lista quando la classe cambia
    });
    studentSelect.addEventListener('change', (e) => renderEvaluations(e.target.value));
    addEvaluationBtn.addEventListener('click', () => openModal());
    closeModalBtn.addEventListener('click', closeModal);
    evaluationForm.addEventListener('submit', handleFormSubmit);
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // --- INIZIALIZZAZIONE ---
    populateClasses();
    populateStudents(null);
    renderEvaluations(null);
};