
import { db, auth } from './firebase.js';
import {
    collection, query, where, orderBy, onSnapshot, getDocs, addDoc, updateDoc, deleteDoc, doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { openModal, closeModal } from './ui.js';

let unsubscribeStudents = null;

export const cleanupStudents = () => {
    if (unsubscribeStudents) {
        unsubscribeStudents();
        unsubscribeStudents = null;
        console.log("Listener degli studenti rimosso.");
    }
};

const renderStudentList = (snapshot) => {
    const listContainer = document.getElementById('student-list');
    if (!listContainer) return;

    listContainer.innerHTML = '';
    if (snapshot.empty) {
        listContainer.innerHTML = '<p class="empty-list-message">Nessuno studente trovato per questa classe.</p>';
        return;
    }

    snapshot.forEach(doc => {
        const student = { id: doc.id, ...doc.data() };
        const studentEl = document.createElement('div');
        studentEl.className = 'list-item';
        studentEl.dataset.id = student.id;
        studentEl.innerHTML = `
            <div class="list-item-main">
                <span class="material-symbols-outlined">person</span>
                <span>${student.surname} ${student.name}</span>
            </div>
            <div class="list-item-actions">
                <button class="btn-icon btn-edit"><span class="material-symbols-outlined">edit</span></button>
                <button class="btn-icon btn-delete"><span class="material-symbols-outlined">delete</span></button>
            </div>
        `;
        listContainer.appendChild(studentEl);
    });
};

const createQueryAndListen = () => {
    cleanupStudents();
    const user = auth.currentUser;
    if (!user) return;

    const studentsRef = collection(db, 'users', user.uid, 'students');
    const classFilter = document.getElementById('student-class-filter').value;

    let finalQuery;
    if (classFilter) {
        finalQuery = query(studentsRef, where("classId", "==", classFilter), orderBy("surname"));
    } else {
        finalQuery = query(studentsRef, orderBy("surname"));
    }
    unsubscribeStudents = onSnapshot(finalQuery, renderStudentList, console.error);
};

const populateClassFilter = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const classFilterSelect = document.getElementById('student-class-filter');
    const classesRef = collection(db, 'users', user.uid, 'classes');
    const q = query(classesRef, orderBy("name"));
    const snapshot = await getDocs(q);
    classFilterSelect.innerHTML = '<option value="">Tutte le classi</option>';
    snapshot.forEach(doc => {
        const option = new Option(doc.data().name, doc.id);
        classFilterSelect.add(option);
    });
};

export const setupStudentsUI = () => {
    const user = auth.currentUser;
    if (!user) return;

    populateClassFilter();
    createQueryAndListen();

    document.getElementById('student-class-filter').addEventListener('change', createQueryAndListen);
    document.getElementById('add-student-btn').addEventListener('click', () => {
        openModal('student-modal', { title: 'Aggiungi Studente', submitText: 'Aggiungi' });
    });
    
    // Gestione unificata per edit/delete
    document.getElementById('student-list').addEventListener('click', async e => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const studentId = btn.closest('.list-item').dataset.id;
        const studentDocRef = doc(db, 'users', user.uid, 'students', studentId);

        if (btn.classList.contains('btn-delete')) {
            if (confirm('Sei sicuro di voler eliminare questo studente?')) {
                await deleteDoc(studentDocRef);
            }
        } else if (btn.classList.contains('btn-edit')) {
            const studentSnap = (await getDocs(query(collection(db, 'users', user.uid, 'students'), where(documentId(), '==', studentId)))).docs[0];
            openModal('student-modal', { 
                isEdit: true, 
                studentId: studentId, 
                student: studentSnap.data(),
                title: 'Modifica Studente',
                submitText: 'Salva Modifiche'
            });
        }
    });

    console.log("Interfaccia Studenti inizializzata.");
};
