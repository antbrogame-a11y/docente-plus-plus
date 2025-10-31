
// Funzione di setup per la sezione Studenti, migrata a Firestore.
const setupStudents = () => {

    if (!window.db) {
        console.error("Istanza Firestore non trovata.");
        return;
    }

    // --- RIFERIMENTI FIREBASE ---
    const userId = firebase.auth().currentUser.uid;
    const classesRef = db.collection('users').doc(userId).collection('classes');
    const studentsRef = db.collection('users').doc(userId).collection('students');
    const evaluationsRef = db.collection('users').doc(userId).collection('evaluations');

    // --- ELEMENTI DEL DOM ---
    const classFilterSelect = document.getElementById('class-filter-select');
    const addStudentBtn = document.getElementById('add-student-btn');
    const exportStudentsBtn = document.getElementById('export-students-btn');
    const studentListContainer = document.getElementById('student-list');
    const studentListTitle = document.getElementById('student-list-title');
    const modal = document.getElementById('student-modal');
    const modalTitle = document.getElementById('student-modal-title');
    const closeModalBtn = modal.querySelector('.close-btn');
    const studentForm = document.getElementById('student-form');
    const studentIdInput = document.getElementById('student-id-input');
    const studentClassIdInput = document.getElementById('student-class-id-input');
    const studentNameInput = document.getElementById('student-name-input');
    const studentSurnameInput = document.getElementById('student-surname-input');
    const studentEmailInput = document.getElementById('student-email-input');

    let studentsUnsubscribe = null; // Per il listener di onSnapshot

    // --- FUNZIONI ---

    const populateClassFilter = async () => {
        try {
            const snapshot = await classesRef.orderBy('name').get();
            const currentVal = classFilterSelect.value;
            classFilterSelect.innerHTML = '<option value="">Seleziona una classe...</option>';
            if (snapshot.empty) {
                classFilterSelect.innerHTML = '<option value="">Nessuna classe creata</option>';
                addStudentBtn.disabled = true;
                exportStudentsBtn.disabled = true;
            } else {
                addStudentBtn.disabled = false;
                exportStudentsBtn.disabled = true; // Abilitato solo dopo aver selezionato una classe
                snapshot.forEach(doc => {
                    const option = document.createElement('option');
                    option.value = doc.id;
                    option.textContent = doc.data().name;
                    classFilterSelect.appendChild(option);
                });
            }
            classFilterSelect.value = currentVal;
        } catch (error) {
            console.error("Errore nel caricare le classi per il filtro:", error);
        }
    };

    const renderStudents = (snapshot) => {
        studentListContainer.innerHTML = '';
        if (snapshot.empty) {
            studentListContainer.innerHTML = '<p>Nessuno studente in questa classe. Aggiungine uno!</p>';
            return;
        }
        const table = document.createElement('table');
        table.innerHTML = `<thead>...</thead><tbody></tbody>`; // Struttura come prima
        const tbody = table.querySelector('tbody');
        snapshot.docs.sort((a,b) => a.data().surname.localeCompare(b.data().surname)).forEach(doc => {
            const s = { id: doc.id, ...doc.data() };
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${s.surname}</td><td>${s.name}</td><td>${s.email || '-'}</td><td class="actions">...</td>`;
            tr.querySelector('.btn-edit').addEventListener('click', () => openModal(s));
            tr.querySelector('.btn-delete').addEventListener('click', () => deleteStudent(s.id));
            tbody.appendChild(tr);
        });
        studentListContainer.appendChild(table);
    };

    const handleClassChange = (classId) => {
        if (studentsUnsubscribe) studentsUnsubscribe(); // Scollega il listener precedente
        if (classId) {
            const selectedClass = classFilterSelect.options[classFilterSelect.selectedIndex].text;
            studentListTitle.textContent = `Studenti in ${selectedClass}`;
            exportStudentsBtn.disabled = false;
            studentsUnsubscribe = studentsRef.where('classId', '==', classId).onSnapshot(renderStudents, err => console.error(err));
        } else {
            studentListTitle.textContent = 'Studenti';
            studentListContainer.innerHTML = '<p>Seleziona una classe per vedere i suoi studenti.</p>';
            exportStudentsBtn.disabled = true;
        }
    };

    const openModal = (student = null) => {
        const classId = classFilterSelect.value;
        if (!classId) {
            alert('Per favore, seleziona prima una classe!');
            return;
        }
        studentForm.reset();
        studentClassIdInput.value = classId;
        if (student) {
            modalTitle.textContent = 'Modifica Studente';
            studentIdInput.value = student.id;
            studentNameInput.value = student.name;
            studentSurnameInput.value = student.surname;
            studentEmailInput.value = student.email;
        } else {
            modalTitle.textContent = 'Aggiungi Studente';
            studentIdInput.value = '';
        }
        modal.style.display = 'flex';
    };

    const closeModal = () => modal.style.display = 'none';

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const studentId = studentIdInput.value;
        const studentData = { /* ... dati dal form ... */ };
        try {
            if (studentId) {
                await studentsRef.doc(studentId).update(studentData);
            } else {
                await studentsRef.add(studentData);
            }
            closeModal();
        } catch (error) {
            console.error("Errore nel salvare lo studente:", error);
        }
    };

    const deleteStudent = async (studentId) => {
        if (confirm('Confermi di voler eliminare questo studente e tutte le sue valutazioni associate?')) {
            try {
                const batch = db.batch();
                const evalQuery = await evaluationsRef.where('studentId', '==', studentId).get();
                evalQuery.forEach(doc => batch.delete(doc.ref));
                batch.delete(studentsRef.doc(studentId));
                await batch.commit();
            } catch (error) {
                console.error("Errore nell'eliminazione dello studente:", error);
            }
        }
    };

    const exportStudentsToCSV = async () => {
        const classId = classFilterSelect.value;
        const className = classFilterSelect.options[classFilterSelect.selectedIndex].text;
        if (!classId) return;
        try {
            const studentsQuery = await studentsRef.where('classId', '==', classId).get();
            if (studentsQuery.empty) return;
            const studentIds = studentsQuery.docs.map(d => d.id);
            const evalsQuery = await evaluationsRef.where('studentId', 'in', studentIds).get();
            const evaluationsByStudent = {};
            evalsQuery.forEach(d => {
                const e = d.data();
                if (!evaluationsByStudent[e.studentId]) evaluationsByStudent[e.studentId] = [];
                evaluationsByStudent[e.studentId].push(e);
            });

            // ... (logica per creare la stringa CSV, uguale a prima)
            // ... (crea e scarica il blob)

        } catch (error) {
            console.error("Errore durante l'esportazione CSV:", error);
        }
    };

    // --- EVENT LISTENER & INIZIALIZZAZIONE ---
    classFilterSelect.addEventListener('change', (e) => handleClassChange(e.target.value));
    addStudentBtn.addEventListener('click', () => openModal());
    exportStudentsBtn.addEventListener('click', exportStudentsToCSV);
    closeModalBtn.addEventListener('click', closeModal);
    studentForm.addEventListener('submit', handleFormSubmit);
    window.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    populateClassFilter();
    handleClassChange(classFilterSelect.value);
    console.log("Modulo Studenti caricato e configurato con Firestore.");
};