
import { db, auth } from './firebase.js';
import {
    collection, query, where, orderBy, onSnapshot, getDocs, addDoc, updateDoc, deleteDoc, doc, writeBatch
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { openModal, closeModal } from './ui.js';

let unsubscribeEvaluations = null;
let localStudents = []; // Cache degli studenti per la classe selezionata

export const cleanupEvaluations = () => {
    if (unsubscribeEvaluations) {
        unsubscribeEvaluations();
        unsubscribeEvaluations = null;
        console.log("Listener delle valutazioni rimosso.");
    }
};

const renderEvaluationsList = (snapshot) => {
    const listContainer = document.getElementById('evaluation-list');
    if (!listContainer) return;

    listContainer.innerHTML = '';
    if (snapshot.empty) {
        listContainer.innerHTML = '<p class="empty-list-message">Nessuna valutazione trovata per i filtri selezionati.</p>';
        return;
    }

    const table = document.createElement('table');
    table.innerHTML = `<thead><tr><th>Studente</th><th>Data</th><th>Voto</th><th>Note</th><th class="actions">Azioni</th></tr></thead><tbody></tbody>`;
    const tbody = table.querySelector('tbody');

    snapshot.forEach(doc => {
        const ev = { id: doc.id, ...doc.data() };
        const student = localStudents.find(s => s.id === ev.studentId);
        const studentName = student ? `${student.surname} ${student.name}` : 'N/D';
        
        const tr = document.createElement('tr');
        tr.dataset.id = ev.id;
        tr.innerHTML = `
            <td>${studentName}</td>
            <td>${new Date(ev.date).toLocaleDateString()}</td>
            <td>${ev.grade.toFixed(2)}</td>
            <td>${ev.notes || '-'}</td>
            <td class="actions">
                <button class="btn-icon btn-edit"><span class="material-symbols-outlined">edit</span></button>
                <button class="btn-icon btn-delete"><span class="material-symbols-outlined">delete</span></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    listContainer.appendChild(table);
};

const createQueryAndListen = () => {
    cleanupEvaluations();

    const user = auth.currentUser;
    if (!user) return;

    const evaluationsRef = collection(db, 'users', user.uid, 'evaluations');
    const classSelect = document.getElementById('eval-class-select');
    const studentSelect = document.getElementById('eval-student-select');
    const title = document.getElementById('evaluation-list-title');

    const classId = classSelect.value;
    const studentId = studentSelect.value;

    let finalQuery;

    if (studentId) {
        title.textContent = `Valutazioni di: ${studentSelect.options[studentSelect.selectedIndex].text}`;
        finalQuery = query(evaluationsRef, where("studentId", "==", studentId), orderBy("date", "desc"));
    } else if (classId) {
        title.textContent = `Tutte le valutazioni in: ${classSelect.options[classSelect.selectedIndex].text}`;
        const studentIds = localStudents.map(s => s.id);
        if (studentIds.length > 0) {
            finalQuery = query(evaluationsRef, where("studentId", "in", studentIds), orderBy("date", "desc"));
        } else {
            renderEvaluationsList({ empty: true });
            return;
        }
    } else {
        title.textContent = 'Seleziona una classe per vedere le valutazioni';
        renderEvaluationsList({ empty: true });
        return;
    }

    unsubscribeEvaluations = onSnapshot(finalQuery, renderEvaluationsList, console.error);
};

const populateSelect = async (selectElement, collectionRef, nameField, surnameField = null) => {
    const q = surnameField ? query(collectionRef, orderBy(surnameField)) : query(collectionRef, orderBy(nameField));
    const snapshot = await getDocs(q);
    selectElement.innerHTML = `<option value="">${selectElement.dataset.default || 'Seleziona...'}</option>`;
    snapshot.forEach(doc => {
        const data = doc.data();
        const name = surnameField ? `${data[surnameField]} ${data[nameField]}` : data[nameField];
        const option = document.createElement('option');
        option.value = doc.id;
        option.textContent = name;
        selectElement.appendChild(option);
    });
};

export const setupEvaluationsUI = () => {
    const user = auth.currentUser;
    if (!user) return;

    const classSelect = document.getElementById('eval-class-select');
    const studentSelect = document.getElementById('eval-student-select');
    const addBtn = document.getElementById('add-evaluation-btn');
    const listContainer = document.getElementById('evaluation-list');
    
    const classesRef = collection(db, 'users', user.uid, 'classes');
    const studentsRef = collection(db, 'users', user.uid, 'students');

    populateSelect(classSelect, classesRef, 'name').then(() => {
        createQueryAndListen();
    });

    classSelect.addEventListener('change', async () => {
        const classId = classSelect.value;
        studentSelect.innerHTML = '<option value="">Tutti gli studenti</option>';
        studentSelect.disabled = true;
        localStudents = [];

        if (classId) {
            const studentQuery = query(studentsRef, where("classId", "==", classId));
            const studentSnapshot = await getDocs(studentQuery);
            localStudents = studentSnapshot.docs.map(d => ({...d.data(), id: d.id}));
            
            studentSnapshot.forEach(doc => {
                const s = doc.data();
                const option = document.createElement('option');
                option.value = doc.id;
                option.textContent = `${s.surname} ${s.name}`;
                studentSelect.appendChild(option);
            });
            studentSelect.disabled = false;
        }
        createQueryAndListen();
    });

    studentSelect.addEventListener('change', createQueryAndListen);

    addBtn.addEventListener('click', () => {
        const classId = classSelect.value;
        if (!classId) {
            alert('Seleziona prima una classe!');
            return;
        }
        openModal('evaluation-modal', { 
            title: 'Aggiungi Valutazione',
            submitText: 'Aggiungi',
            studentList: localStudents,
            preselectedStudent: studentSelect.value
        });
    });
    
    listContainer.addEventListener('click', async (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;

        const tr = btn.closest('tr');
        const evalId = tr.dataset.id;

        if (btn.classList.contains('btn-delete')) {
            if (confirm('Sei sicuro di voler eliminare questa valutazione?')) {
                await deleteDoc(doc(db, 'users', user.uid, 'evaluations', evalId));
            }
        } else if (btn.classList.contains('btn-edit')) {
            const evalDoc = (await getDocs(query(collection(db, 'users', user.uid, 'evaluations'), where(documentId(), '==', evalId)))).docs[0];
            openModal('evaluation-modal', {
                isEdit: true,
                evalId: evalId,
                evaluation: evalDoc.data(),
                studentList: localStudents,
                title: 'Modifica Valutazione',
                submitText: 'Salva Modifiche'
            });
        }
    });

    console.log("Interfaccia Valutazioni inizializzata.");
};
