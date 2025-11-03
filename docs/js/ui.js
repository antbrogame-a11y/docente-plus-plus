
import { db, auth } from './firebase.js';
import { collection, doc, addDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Mappa per le configurazioni dei modali
const modalConfigs = {
    'class-modal': { 
        collectionName: 'classes', 
        formId: 'class-form', 
        fields: ['name', 'description'] 
    },
    'student-modal': { 
        collectionName: 'students', 
        formId: 'student-form', 
        fields: ['name', 'surname', 'classId'],
        async onOpen(data) {
            // Popola il select delle classi
            const classSelect = document.getElementById('student-class-select-modal');
            if (!classSelect) return;
            classSelect.innerHTML = '<option value="">Seleziona classe...</option>';
            const classesRef = collection(db, 'users', auth.currentUser.uid, 'classes');
            const snapshot = await getDocs(query(classesRef, orderBy('name')));
            snapshot.forEach(doc => {
                classSelect.add(new Option(doc.data().name, doc.id));
            });
            // Se stiamo modificando, preselezioniamo la classe
            if (data.student) {
                 classSelect.value = data.student.classId;
            }
        }
    },
    'evaluation-modal': {
        collectionName: 'evaluations',
        formId: 'evaluation-form',
        fields: ['studentId', 'grade', 'date', 'notes'],
        async onOpen(data) {
            const studentSelect = document.getElementById('evaluation-student-select-modal');
            if (!studentSelect) return;
            studentSelect.innerHTML = '<option value="">Seleziona studente...</option>';
            
            // Popola con la lista di studenti passata (localStudents dalla pagina evaluations)
            if (data.studentList) {
                data.studentList.forEach(s => {
                    studentSelect.add(new Option(`${s.surname} ${s.name}`, s.id));
                });
            }
            // Preseleziona lo studente se disponibile
            if(data.preselectedStudent) {
                studentSelect.value = data.preselectedStudent;
            }
             if (data.evaluation) {
                studentSelect.value = data.evaluation.studentId;
            }
            // Imposta la data di oggi di default se non stiamo modificando
            if (!data.isEdit) {
                document.getElementById('evaluation-date-input').valueAsDate = new Date();
            }
        }
    }
};

let activeModal = null;
let currentFormHandler = null;

export const openModal = async (modalId, data = {}) => {
    activeModal = document.getElementById(modalId);
    if (!activeModal) {
        console.error(`Modale con ID ${modalId} non trovato.`);
        return;
    }

    const config = modalConfigs[modalId];
    if (!config) {
        console.error(`Configurazione non trovata per il modale ${modalId}.`);
        return;
    }

    const form = activeModal.querySelector(`#${config.formId}`);
    const title = activeModal.querySelector('.modal-title'); // Usa una classe generica
    const submitButton = form.querySelector('button[type="submit"]');

    // Reset e preparazione del form
    form.reset();
    form.dataset.id = data.isEdit ? (data.studentId || data.classId || data.evalId) : '';
    title.textContent = data.title || 'Nuovo Inserimento';
    submitButton.textContent = data.submitText || 'Salva';

    // Esegui la funzione onOpen se esiste
    if (config.onOpen) {
        await config.onOpen(data);
    }

    // Popola i campi del form se siamo in modalità modifica
    if (data.isEdit) {
        const record = data.student || data.class || data.evaluation;
        config.fields.forEach(field => {
            const input = form.querySelector(`[name="${field}"]`);
            if (input) {
                input.value = record[field];
            }
        });
    }

    // Gestore del submit
    currentFormHandler = async (e) => {
        e.preventDefault();
        submitButton.disabled = true;
        const formData = new FormData(form);
        const recordData = {};
        config.fields.forEach(field => {
            recordData[field] = formData.get(field);
        });

        // Conversione tipi se necessario (es. grade)
        if (recordData.grade) recordData.grade = parseFloat(recordData.grade);

        try {
            const collectionRef = collection(db, 'users', auth.currentUser.uid, config.collectionName);
            if (form.dataset.id) {
                await updateDoc(doc(collectionRef, form.dataset.id), recordData);
            } else {
                await addDoc(collectionRef, recordData);
            }
            closeModal();
        } catch (error) {
            console.error("Errore nel salvataggio:", error);
            alert("Si è verificato un errore. Controlla la console.");
        } finally {
            submitButton.disabled = false;
        }
    };
    
    form.addEventListener('submit', currentFormHandler);
    activeModal.style.display = 'flex';
};

export const closeModal = () => {
    if (!activeModal) return;
    const form = activeModal.querySelector('form');
    if (form && currentFormHandler) {
        form.removeEventListener('submit', currentFormHandler);
    }
    activeModal.style.display = 'none';
    activeModal = null;
    currentFormHandler = null;
};

// Aggiungi un listener globale per chiudere il modale
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal') || e.target.classList.contains('close-btn')) {
        closeModal();
    }
});
