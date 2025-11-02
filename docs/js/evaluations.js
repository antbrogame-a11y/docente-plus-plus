
// Funzione di setup per la sezione Valutazioni, migrata a Firestore.
const setupEvaluations = () => {

    if (!window.db || !firebase.auth().currentUser) {
        console.error("Istanza Firestore o utente non disponibili. Impossibile inizializzare il modulo Valutazioni.");
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
    const evaluationIdInput = document.getElementById('evaluation-id-input');
    const evaluationStudentIdInput = document.getElementById('evaluation-student-id-input');
    const evaluationGradeInput = document.getElementById('evaluation-grade-input');
    const evaluationDateInput = document.getElementById('evaluation-date-input');
    const evaluationNotesInput = document.getElementById('evaluation-notes-input');

    let evaluationsUnsubscribe = null;
    let localStudents = []; // Cache locale degli studenti della classe selezionata

    // --- FUNZIONI ---

    const populateClasses = async () => {
        const snapshot = await classesRef.orderBy('name').get();
        classSelect.innerHTML = '<option value="">Seleziona una classe...</option>';
        if(snapshot.empty){
             classSelect.innerHTML = '<option value="">Nessuna classe creata</option>';
        }
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
            studentSelect.disabled = true; 
            localStudents = [];
            return;
        }
        studentSelect.disabled = false;
        const snapshot = await studentsRef.where('classId', '==', classId).orderBy('surname').get();
        localStudents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
            evaluationListContainer.innerHTML = '<p>Nessuna valutazione trovata per i filtri selezionati.</p>'; 
            return;
        }
        const table = document.createElement('table');
        table.innerHTML = `<thead><tr><th>Data</th><th>Voto</th><th>Note</th><th class="actions">Azioni</th></tr></thead><tbody></tbody>`;
        const tbody = table.querySelector('tbody');
        snapshot.docs.forEach(doc => {
            const ev = { id: doc.id, ...doc.data() };
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${new Date(ev.date).toLocaleDateString()}</td><td>${ev.grade.toFixed(2)}</td><td>${ev.notes || '-'}</td><td class="actions"><button class="btn-icon btn-edit"><span class="material-symbols-outlined">edit</span></button><button class="btn-icon btn-delete"><span class="material-symbols-outlined">delete</span></button></td>`;
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
            evaluationListTitle.textContent = `Valutazioni di ${studentSelect.options[studentSelect.selectedIndex].text}`;
            query = query.where('studentId', '==', studentId);
        } else if (classId) {
            const studentIds = localStudents.map(s => s.id);
             evaluationListTitle.textContent = `Valutazioni in ${classSelect.options[classSelect.selectedIndex].text}`;
            if (studentIds.length > 0) {
                 query = query.where('studentId', 'in', studentIds);
            } else {
                renderEvaluations({ empty: true, docs: [] });
                return;
            }
        } else {
             evaluationListTitle.textContent = 'Seleziona una classe e uno studente';
             renderEvaluations({ empty: true, docs: [] });
             return;
        }

        evaluationsUnsubscribe = query.orderBy('date', 'desc').onSnapshot(renderEvaluations, console.error);
    };

    const openModal = (evaluation = null) => {
        const studentId = studentSelect.value;
        if (!studentId) { alert("Seleziona uno studente prima di aggiungere una valutazione."); return; }
        
        evaluationForm.reset();
        evaluationStudentIdInput.value = studentId;
        evaluationDateInput.valueAsDate = new Date(); // Imposta la data odierna di default
        
        if (evaluation) {
            evaluationModalTitle.textContent = 'Modifica Valutazione';
            evaluationIdInput.value = evaluation.id;
            evaluationGradeInput.value = evaluation.grade;
            evaluationDateInput.value = evaluation.date;
            evaluationNotesInput.value = evaluation.notes;
        } else {
            evaluationModalTitle.textContent = 'Aggiungi Valutazione';
            evaluationIdInput.value = '';
        }
        modal.style.display = 'flex';
    };

    const closeModal = () => modal.style.display = 'none';

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const evaluationId = evaluationIdInput.value;
        const studentId = evaluationStudentIdInput.value;
        const evalData = {
            studentId,
            grade: parseFloat(evaluationGradeInput.value),
            date: evaluationDateInput.value,
            notes: evaluationNotesInput.value.trim()
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
            alert('Errore nel salvataggio della valutazione.');
        }
    };

    const deleteEvaluation = async (id) => {
        if (confirm('Confermi di voler eliminare questa valutazione?')) {
            try {
                await evaluationsRef.doc(id).delete();
            } catch (error) {
                console.error("Errore nell'eliminare la valutazione:", error);
                alert('Errore nell\'eliminazione della valutazione.');
            }
        }
    };
    
    const exportEvaluationsToCSV = async () => {
        const classId = classSelect.value;
        if (!classId) return;
        
        const studentId = studentSelect.value;

        let query = evaluationsRef;
        if (studentId) {
            query = query.where('studentId', '==', studentId)
        } else {
            const studentIds = localStudents.map(s => s.id);
            if (studentIds.length === 0) { alert('Nessun dato da esportare.'); return; }
            query = query.where('studentId', 'in', studentIds);
        }

        try {
            const snapshot = await query.orderBy('date', 'desc').get();
            if (snapshot.empty) { alert('Nessun dato da esportare.'); return; }

            let csvContent = '"Studente","Data","Voto","Note"\n';
            snapshot.forEach(doc => {
                const ev = doc.data();
                const student = localStudents.find(s => s.id === ev.studentId);
                const studentName = student ? `${student.surname} ${student.name}` : 'N/D';
                csvContent += `"${studentName}","${ev.date}","${ev.grade}","${ev.notes.replace(/"/g, '''''''')}"\n`;
            });

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'valutazioni.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch(err) {
            console.error("Errore esportazione CSV: ", err);
            alert('Errore durante l\'esportazione.');
        }
    };

    // --- EVENT LISTENER & INIZIALIZZAZIONE ---
    classSelect.addEventListener('change', async (e) => {
        const classId = e.target.value;
        await populateStudents(classId);
        createQueryAndListen();
    });
    studentSelect.addEventListener('change', createQueryAndListen);
    addEvaluationBtn.addEventListener('click', () => openModal());
    exportEvaluationsBtn.addEventListener('click', exportEvaluationsToCSV);
    closeModalBtn.addEventListener('click', closeModal);
    evaluationForm.addEventListener('submit', handleFormSubmit);
    window.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    const init = async () => {
        await populateClasses();
        await populateStudents(classSelect.value);
        createQueryAndListen();
        console.log("Modulo Valutazioni caricato e configurato con Firestore.");
    };

    init();
};

setupEvaluations();
