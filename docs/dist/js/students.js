
// Funzione di setup per la sezione Studenti, caricata dinamicamente.
const setupStudents = () => {

    if (typeof loadData !== 'function' || typeof saveData !== 'function') {
        console.error('Le funzioni globali loadData o saveData non sono state trovate.');
        return;
    }

    // --- ELEMENTI DEL DOM ---
    const classFilterSelect = document.getElementById('class-filter-select');
    const addStudentBtn = document.getElementById('add-student-btn');
    const exportStudentsBtn = document.getElementById('export-students-btn'); // Nuovo pulsante
    const studentListContainer = document.getElementById('student-list');
    const studentListTitle = document.getElementById('student-list-title');
    
    // Elementi del Modale
    const modal = document.getElementById('student-modal');
    const modalTitle = document.getElementById('student-modal-title');
    const closeModalBtn = modal.querySelector('.close-btn');
    const studentForm = document.getElementById('student-form');
    const studentIdInput = document.getElementById('student-id-input');
    const studentClassIdInput = document.getElementById('student-class-id-input');
    const studentNameInput = document.getElementById('student-name-input');
    const studentSurnameInput = document.getElementById('student-surname-input');
    const studentEmailInput = document.getElementById('student-email-input');

    // --- DATI ---
    let classes = loadData('docentepp_classes', []);
    let students = loadData('docentepp_students', []);

    // --- FUNZIONI ---

    const populateClassFilter = () => {
        const currentVal = classFilterSelect.value;
        classFilterSelect.innerHTML = '<option value="">Seleziona una classe...</option>';
        if (classes.length === 0) {
            classFilterSelect.innerHTML = '<option value="">Nessuna classe creata</option>';
            addStudentBtn.disabled = true;
            exportStudentsBtn.disabled = true;
        } else {
            addStudentBtn.disabled = false;
            exportStudentsBtn.disabled = false;
            classes.forEach(c => {
                const option = document.createElement('option');
                option.value = c.id;
                option.textContent = c.name;
                classFilterSelect.appendChild(option);
            });
        }
        classFilterSelect.value = currentVal;
    };

    // REFACTOR: Usa una tabella per mostrare gli studenti
    const renderStudents = (classId) => {
        studentListContainer.innerHTML = '';
        const selectedClass = classes.find(c => c.id === Number(classId));
        
        if (!classId || !selectedClass) {
            studentListTitle.textContent = 'Studenti';
            studentListContainer.innerHTML = '<p>Seleziona una classe per vedere i suoi studenti.</p>';
            exportStudentsBtn.disabled = true;
            return;
        }

        studentListTitle.textContent = `Studenti in ${selectedClass.name}`;
        exportStudentsBtn.disabled = false;
        const filteredStudents = students.filter(s => s.classId === Number(classId));

        if (filteredStudents.length === 0) {
            studentListContainer.innerHTML = '<p>Nessuno studente in questa classe. Aggiungine uno!</p>';
            return;
        }

        const table = document.createElement('table');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Cognome</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Azioni</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `;
        const tbody = table.querySelector('tbody');
        filteredStudents.sort((a, b) => a.surname.localeCompare(b.surname)).forEach(s => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${s.surname}</td>
                <td>${s.name}</td>
                <td>${s.email || '-'}</td>
                <td class="actions">
                    <button class="btn-icon btn-edit" data-id="${s.id}" title="Modifica"><span class="material-symbols-outlined">edit</span></button>
                    <button class="btn-icon btn-delete" data-id="${s.id}" title="Elimina"><span class="material-symbols-outlined">delete</span></button>
                </td>
            `;
            tr.querySelector('.btn-edit').addEventListener('click', () => openModal(s.id));
            tr.querySelector('.btn-delete').addEventListener('click', () => deleteStudent(s.id));
            tbody.appendChild(tr);
        });
        studentListContainer.appendChild(table);
    };
    
    const openModal = (studentId = null) => {
        const classId = Number(classFilterSelect.value);
        if (!classId) {
            alert('Per favore, seleziona prima una classe!');
            return;
        }
        
        studentForm.reset();
        studentClassIdInput.value = classId;

        if (studentId) {
            modalTitle.textContent = 'Modifica Studente';
            const student = students.find(s => s.id === studentId);
            if (student) {
                studentIdInput.value = student.id;
                studentNameInput.value = student.name;
                studentSurnameInput.value = student.surname;
                studentEmailInput.value = student.email;
            }
        } else {
            modalTitle.textContent = 'Aggiungi Studente';
            studentIdInput.value = '';
        }
        modal.style.display = 'flex';
    };

    const closeModal = () => {
        modal.style.display = 'none';
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const studentId = Number(studentIdInput.value);
        const studentData = {
            classId: Number(studentClassIdInput.value),
            name: studentNameInput.value.trim(),
            surname: studentSurnameInput.value.trim(),
            email: studentEmailInput.value.trim()
        };

        if (studentId) {
            const index = students.findIndex(s => s.id === studentId);
            if (index !== -1) students[index] = { ...students[index], ...studentData };
        } else {
            studentData.id = Date.now();
            students.push(studentData);
        }
        
        saveData('docentepp_students', students);
        renderStudents(studentData.classId);
        closeModal();
    };

    const deleteStudent = (studentId) => {
        if (confirm('Sei sicuro di voler eliminare questo studente? Verranno eliminate anche tutte le sue valutazioni.')) {
            let evaluations = loadData('docentepp_evaluations', []);
            evaluations = evaluations.filter(ev => ev.studentId !== studentId);
            saveData('docentepp_evaluations', evaluations);

            students = students.filter(s => s.id !== studentId);
            saveData('docentepp_students', students);
            renderStudents(classFilterSelect.value);
        }
    };

    // NUOVA FUNZIONE: Esportazione in CSV
    const exportStudentsToCSV = () => {
        const classId = Number(classFilterSelect.value);
        const selectedClass = classes.find(c => c.id === classId);
        if (!selectedClass) {
            alert("Seleziona una classe prima di esportare.");
            return;
        }

        const studentsToExport = students.filter(s => s.classId === classId);
        const evaluations = loadData('docentepp_evaluations', []);

        const csvRows = [
            '"Cognome","Nome","Email","Media Voti"' // Intestazione CSV
        ];

        studentsToExport.sort((a,b) => a.surname.localeCompare(b.surname)).forEach(student => {
            const studentEvaluations = evaluations.filter(ev => ev.studentId === student.id && !isNaN(parseFloat(ev.grade)));
            let average = 0;
            if (studentEvaluations.length > 0) {
                const sum = studentEvaluations.reduce((acc, ev) => acc + parseFloat(ev.grade), 0);
                average = (sum / studentEvaluations.length).toFixed(2);
            }
            
            // Crea la riga per il CSV, gestendo i valori con le virgolette
            const row = [
                `"${student.surname}"`,
                `"${student.name}"`,
                `"${student.email || ''}"`,
                `"${average}"`
            ].join(',');
            csvRows.push(row);
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        const fileName = `studenti_${selectedClass.name.replace(/\s+/g, '_')}.csv`;
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --- EVENT LISTENER ---
    classFilterSelect.addEventListener('change', (e) => renderStudents(e.target.value));
    addStudentBtn.addEventListener('click', () => openModal());
    exportStudentsBtn.addEventListener('click', exportStudentsToCSV); // Nuovo listener
    closeModalBtn.addEventListener('click', closeModal);
    studentForm.addEventListener('submit', handleFormSubmit);
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // --- INIZIALIZZAZIONE ---
    populateClassFilter();
    renderStudents(classFilterSelect.value);
};