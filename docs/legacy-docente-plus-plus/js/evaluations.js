
// Funzione di setup per la sezione Valutazioni, migrata a Firestore.
const setupEvaluations = () => {

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
    const classSelect = document.getElementById('eval-class-select');
    const studentSelect = document.getElementById('eval-student-select');
    const evaluationListTitle = document.getElementById('evaluation-list-title');
    const evaluationListContainer = document.getElementById('evaluation-list');
    const addEvaluationBtn = document.getElementById('add-evaluation-btn');
    const exportEvaluationsBtn = document.getElementById('export-evaluations-btn');
    const modal = document.getElementById('evaluation-modal');
    const modalTitle = document.getElementById('evaluation-modal-title');
    const closeModalBtn = modal.querySelector('.close-btn');
    const evaluationForm = document.getElementById('evaluation-form');
    // ... (altri input del modale)

    let evaluationsUnsubscribe = null;
    let allStudents = []; // Cache per gli studenti

    // --- FUNZIONI ---

    const populateClasses = async () => {
        const snapshot = await classesRef.orderBy('name').get();
        classSelect.innerHTML = '<option value="">Tutte le classi</option>';
        snapshot.forEach(doc => {
            const option = document.createElement('option');
            option.value = doc.id;
            option.textContent = doc.data().name;
            classSelect.appendChild(option);
        });
    };

    const populateStudents = async (classId) => {
        studentSelect.innerHTML = '<option value="">Tutti gli studenti</option>';
        if (!classId) {
            studentSelect.disabled = true; return;
        }
        studentSelect.disabled = false;
        const snapshot = await studentsRef.where('classId', '==', classId).orderBy('surname').get();
        allStudents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Aggiorna cache
        snapshot.forEach(doc => {
            const s = doc.data();
            const option = document.createElement('option');
            option.value = doc.id;
            option.textContent = `${s.surname} ${s.name}`;
            studentSelect.appendChild(option);
        });
    };

    const renderEvaluations = (snapshot) => {
        evaluationListContainer.innerHTML = '';
        if (snapshot.empty) {
            evaluationListContainer.innerHTML = '<p>Nessuna valutazione trovata.</p>'; return;
        }
        const table = document.createElement('table');
        // ... (crea l'header della tabella come prima)
        const tbody = table.querySelector('tbody');
        snapshot.forEach(doc => {
            const ev = { id: doc.id, ...doc.data() };
            const student = allStudents.find(s => s.id === ev.studentId);
            const tr = document.createElement('tr');
            // ... (crea la riga della tabella come prima, usando 'student')
            tr.querySelector('.btn-edit').addEventListener('click', () => openModal(ev));
            tr.querySelector('.btn-delete').addEventListener('click', () => deleteEvaluation(ev.id));
            tbody.appendChild(tr);
        });
        evaluationListContainer.appendChild(table);
    };

    const createQueryAndListen = () => {
        if (evaluationsUnsubscribe) evaluationsUnsubscribe();

        const classId = classSelect.value;
        const studentId = studentSelect.value;

        addEvaluationBtn.disabled = !studentId;
        exportEvaluationsBtn.disabled = !classId;

        let query = evaluationsRef;
        if (studentId) {
            query = query.where('studentId', '==', studentId);
        } else if (classId) {
            query = query.where('classId', '==', classId);
        }

        evaluationsUnsubscribe = query.orderBy('date', 'desc').onSnapshot(renderEvaluations, console.error);
    };

    const openModal = (evaluation = null) => {
        const studentId = studentSelect.value;
        if (!studentId) { alert("Seleziona uno studente."); return; }
        // ... (logica apertura modale come prima)
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const evaluationId = document.getElementById('evaluation-id-input').value;
        const studentId = document.getElementById('evaluation-student-id-input').value;
        const classId = classSelect.value;

        const evalData = {
            studentId,
            classId, // Denormalizzazione!
            grade: parseFloat(document.getElementById('evaluation-grade-input').value),
            date: document.getElementById('evaluation-date-input').value,
            notes: document.getElementById('evaluation-notes-input').value.trim()
        };

        try {
            if (evaluationId) {
                await evaluationsRef.doc(evaluationId).update(evalData);
            } else {
                await evaluationsRef.add(evalData);
            }
            closeModal();
        } catch (error) {
            console.error("Errore nel salvare la valutazione:", error);
        }
    };

    const deleteEvaluation = async (id) => {
        if (confirm('Confermi di voler eliminare questa valutazione?')) {
            try {
                await evaluationsRef.doc(id).delete();
            } catch (error) {
                console.error("Errore nell'eliminare la valutazione:", error);
            }
        }
    };
    
    // ... (La funzione exportEvaluationsToCSV andrà riscritta per usare le query async di Firestore)

    // --- EVENT LISTENER & INIZIALIZZAZIONE ---
    classSelect.addEventListener('change', async (e) => {
        const classId = e.target.value;
        await populateStudents(classId);
        createQueryAndListen();
    });
    studentSelect.addEventListener('change', createQueryAndListen);
    // ... (altri event listener come prima)

    const init = async () => {
        await populateClasses();
        await populateStudents(classSelect.value);
        createQueryAndListen();
        console.log("Modulo Valutazioni caricato e configurato con Firestore.");
    };

    init();
};