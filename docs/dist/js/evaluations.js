
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
    const evaluationListContainer = document.getElementById('evaluation-list');
    const addEvaluationBtn = document.getElementById('add-evaluation-btn');
    const exportEvaluationsBtn = document.getElementById('export-evaluations-btn'); // Nuovo

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
        const currentVal = classSelect.value;
        classSelect.innerHTML = '<option value="">Tutte le classi</option>';
        classes.forEach(c => {
            const option = document.createElement('option');
            option.value = c.id;
            option.textContent = c.name;
            classSelect.appendChild(option);
        });
        classSelect.value = currentVal;
    };

    const populateStudents = (classId) => {
        const currentVal = studentSelect.value;
        studentSelect.innerHTML = '<option value="">Tutti gli studenti</option>';
        if (!classId) {
            studentSelect.disabled = true;
            return;
        }
        const filteredStudents = students.filter(s => s.classId === Number(classId));
        studentSelect.disabled = false;
        
        filteredStudents.sort((a,b) => a.surname.localeCompare(b.surname)).forEach(s => {
            const option = document.createElement('option');
            option.value = s.id;
            option.textContent = `${s.surname} ${s.name}`;
            studentSelect.appendChild(option);
        });
        studentSelect.value = currentVal;
    };

    // REFACTOR: Usa una tabella per mostrare le valutazioni
    const renderEvaluations = (classId, studentId) => {
        evaluationListContainer.innerHTML = '';
        addEvaluationBtn.disabled = !studentId;
        exportEvaluationsBtn.disabled = !classId;
        
        let title = 'Valutazioni';
        let filteredEvaluations = evaluations;

        if (classId) {
            const selectedClass = classes.find(c => c.id === Number(classId));
            title += ` della ${selectedClass.name}`;
            // Filtra le valutazioni per gli studenti appartenenti alla classe selezionata
            const studentIdsInClass = students.filter(s => s.classId === Number(classId)).map(s => s.id);
            filteredEvaluations = evaluations.filter(ev => studentIdsInClass.includes(ev.studentId));
        }

        if (studentId) {
            const selectedStudent = students.find(s => s.id === Number(studentId));
            title = `Valutazioni di ${selectedStudent.surname} ${selectedStudent.name}`;
            filteredEvaluations = filteredEvaluations.filter(ev => ev.studentId === Number(studentId));
        }

        evaluationListTitle.textContent = title;

        if (filteredEvaluations.length === 0) {
            evaluationListContainer.innerHTML = '<p>Nessuna valutazione trovata per i filtri selezionati.</p>';
            return;
        }
        
        const table = document.createElement('table');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Data</th>
                    <th>Voto</th>
                    ${!studentId ? '<th>Studente</th>' : ''} <!-- Mostra colonna studente solo se non filtrato per studente -->
                    <th>Note</th>
                    <th>Azioni</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        const tbody = table.querySelector('tbody');

        filteredEvaluations.sort((a, b) => new Date(b.date) - new Date(a.date));

        filteredEvaluations.forEach(ev => {
            const student = students.find(s => s.id === ev.studentId);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${new Date(ev.date).toLocaleDateString()}</td>
                <td><b>${ev.grade}</b></td>
                ${!studentId ? `<td>${student ? `${student.surname} ${student.name}` : 'N/A'}</td>` : ''}
                <td>${ev.notes || '-'}</td>
                <td class="actions">
                    <button class="btn-icon btn-edit" data-id="${ev.id}" title="Modifica"><span class="material-symbols-outlined">edit</span></button>
                    <button class="btn-icon btn-delete" data-id="${ev.id}" title="Elimina"><span class="material-symbols-outlined">delete</span></button>
                </td>
            `;
            tr.querySelector('.btn-edit').addEventListener('click', () => openModal(ev.id));
            tr.querySelector('.btn-delete').addEventListener('click', () => deleteEvaluation(ev.id));
            tbody.appendChild(tr);
        });
        evaluationListContainer.appendChild(table);
    };

    const openModal = (evaluationId = null) => {
        const studentId = Number(studentSelect.value);
        if (!studentId) {
            alert("Seleziona prima uno studente per aggiungere una valutazione.");
            return;
        }

        evaluationForm.reset();
        evaluationStudentIdInput.value = studentId;
        dateInput.valueAsDate = new Date();

        if (evaluationId) {
            modalTitle.textContent = 'Modifica Valutazione';
            const evaluation = evaluations.find(ev => ev.id === evaluationId);
            if (evaluation) {
                evaluationIdInput.value = evaluation.id;
                gradeInput.value = evaluation.grade;
                dateInput.value = evaluation.date;
                notesInput.value = evaluation.notes;
            }
        } else {
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
            if (index !== -1) evaluations[index] = { ...evaluations[index], ...evalData };
        } else {
            evalData.id = Date.now();
            evaluations.push(evalData);
        }

        saveData('docentepp_evaluations', evaluations);
        renderEvaluations(classSelect.value, studentSelect.value);
        closeModal();
    };

    const deleteEvaluation = (evaluationId) => {
        if (confirm('Sei sicuro di voler eliminare questa valutazione?')) {
            evaluations = evaluations.filter(ev => ev.id !== evaluationId);
            saveData('docentepp_evaluations', evaluations);
            renderEvaluations(classSelect.value, studentSelect.value);
        }
    };

    // NUOVA FUNZIONE: Esportazione in CSV
    const exportEvaluationsToCSV = () => {
        const classId = Number(classSelect.value);
        const studentId = Number(studentSelect.value);

        if (!classId) {
            alert("Seleziona almeno una classe per esportare le valutazioni.");
            return;
        }

        const selectedClass = classes.find(c => c.id === classId);
        let studentsInClass = students.filter(s => s.classId === classId);

        let evaluationsToExport = evaluations.filter(ev => studentsInClass.some(s => s.id === ev.studentId));
        let fileName = `valutazioni_${selectedClass.name.replace(/\s+/g, '_')}.csv`;

        // Se è selezionato uno studente specifico, filtra ulteriormente
        if (studentId) {
            const selectedStudent = students.find(s => s.id === studentId);
            evaluationsToExport = evaluationsToExport.filter(ev => ev.studentId === studentId);
            fileName = `valutazioni_${selectedStudent.surname}_${selectedStudent.name}.csv`;
        }
        
        const csvRows = ['"Cognome Studente","Nome Studente","Voto","Data","Note"']; // Intestazione

        evaluationsToExport.forEach(ev => {
            const student = students.find(s => s.id === ev.studentId);
            if (!student) return;

            const row = [
                `"${student.surname}"`,
                `"${student.name}"`,
                `"${ev.grade}"`,
                `"${new Date(ev.date).toLocaleDateString()}"`,
                `"${ev.notes.replace(/"/g, '''')}"` // Sostituisce le virgolette nelle note
            ].join(',');
            csvRows.push(row);
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --- EVENT LISTENER ---
    classSelect.addEventListener('change', (e) => {
        const classId = e.target.value;
        populateStudents(classId);
        renderEvaluations(classId, null);
    });
    studentSelect.addEventListener('change', (e) => {
        renderEvaluations(classSelect.value, e.target.value);
    });
    addEvaluationBtn.addEventListener('click', () => openModal());
    exportEvaluationsBtn.addEventListener('click', exportEvaluationsToCSV); // Nuovo
    closeModalBtn.addEventListener('click', closeModal);
    evaluationForm.addEventListener('submit', handleFormSubmit);
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // --- INIZIALIZZAZIONE ---
    populateClasses();
    populateStudents(null);
    renderEvaluations(null, null);
    studentSelect.disabled = true; // Inizia disabilitato
    exportEvaluationsBtn.disabled = true; // Inizia disabilitato
};
