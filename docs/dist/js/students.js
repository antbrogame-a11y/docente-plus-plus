
// Funzione di setup per la sezione Studenti, caricata dinamicamente.
const setupStudents = () => {

    if (typeof loadData !== 'function' || typeof saveData !== 'function') {
        console.error('Le funzioni globali loadData o saveData non sono state trovate.');
        return;
    }

    // --- ELEMENTI DEL DOM ---
    const classFilterSelect = document.getElementById('class-filter-select');
    const addStudentBtn = document.getElementById('add-student-btn');
    const studentListDiv = document.getElementById('student-list');
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
        classFilterSelect.innerHTML = '<option value="">Seleziona una classe...</option>';
        if (classes.length === 0) {
            classFilterSelect.innerHTML = '<option value="">Nessuna classe creata</option>';
            addStudentBtn.disabled = true; // Disabilita l'aggiunta se non ci sono classi
        } else {
            addStudentBtn.disabled = false;
            classes.forEach(c => {
                const option = document.createElement('option');
                option.value = c.id;
                option.textContent = c.name;
                classFilterSelect.appendChild(option);
            });
        }
    };

    const renderStudents = (classId) => {
        studentListDiv.innerHTML = '';
        const selectedClass = classes.find(c => c.id === Number(classId));
        
        if (!classId || !selectedClass) {
            studentListTitle.textContent = 'Studenti';
            studentListDiv.innerHTML = '<p class="empty-list-message">Seleziona una classe per vedere i suoi studenti.</p>';
            return;
        }

        studentListTitle.textContent = `Studenti in ${selectedClass.name}`;
        const filteredStudents = students.filter(s => s.classId === Number(classId));

        if (filteredStudents.length === 0) {
            studentListDiv.innerHTML = '<p class="empty-list-message">Nessuno studente in questa classe. Aggiungine uno!</p>';
            return;
        }

        filteredStudents.forEach(s => {
            const studentElement = document.createElement('div');
            studentElement.className = 'list-item';
            studentElement.innerHTML = `
                <div class="list-item-main">
                    <span class="material-symbols-outlined">person</span>
                    <span><strong>${s.name} ${s.surname}</strong><br><small>${s.email || 'Nessuna email'}</small></span>
                </div>
                <div class="list-item-actions">
                    <button class="btn-icon btn-edit" data-id="${s.id}"><span class="material-symbols-outlined">edit</span></button>
                    <button class="btn-icon btn-delete" data-id="${s.id}"><span class="material-symbols-outlined">delete</span></button>
                </div>
            `;
            studentElement.querySelector('.btn-edit').addEventListener('click', () => openModal(s.id));
            studentElement.querySelector('.btn-delete').addEventListener('click', () => deleteStudent(s.id));
            studentListDiv.appendChild(studentElement);
        });
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
            // Modal in modalità Modifica
            modalTitle.textContent = 'Modifica Studente';
            const student = students.find(s => s.id === studentId);
            if (student) {
                studentIdInput.value = student.id;
                studentNameInput.value = student.name;
                studentSurnameInput.value = student.surname;
                studentEmailInput.value = student.email;
            }
        } else {
            // Modal in modalità Aggiungi
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
            // Aggiorna studente esistente
            const index = students.findIndex(s => s.id === studentId);
            if (index !== -1) {
                students[index] = { ...students[index], ...studentData };
            }
        } else {
            // Aggiungi nuovo studente
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

    // --- EVENT LISTENER ---
    classFilterSelect.addEventListener('change', (e) => renderStudents(e.target.value));
    addStudentBtn.addEventListener('click', () => openModal());
    closeModalBtn.addEventListener('click', closeModal);
    studentForm.addEventListener('submit', handleFormSubmit);
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // --- INIZIALIZZAZIONE ---
    populateClassFilter();
    renderStudents(classFilterSelect.value);
};