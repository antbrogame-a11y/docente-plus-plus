
import { db, auth } from '../firebase-config.js';
import { collection, getDocs, query, where, orderBy, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, getDoc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
import { generateLessonPlan } from './ai.js';

let classSelector, addLessonBtn, lessonsListContainer, lessonsPlaceholder;
let lessonModal, modalTitle, closeModalBtn, lessonForm, lessonIdInput, deleteLessonBtn, absencesChecklist, generateLessonBtn;
let topicInput, assignmentsInput;

let eventListeners = [];

// --- Funzioni di Utilità ---
const showToast = (message) => {
    const toast = document.createElement('div');
    toast.className = 'toast show';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
};

// --- Gestione Modale e Dati ---
const populateAbsencesChecklist = async (classId, absentStudentNames = []) => {
    absencesChecklist.innerHTML = '<div class="loader"></div>';
    const studentsRef = collection(db, 'students');
    const q = query(studentsRef, where("ownerId", "==", auth.currentUser.uid), where("classId", "==", classId), orderBy("surname"));
    
    try {
        const querySnapshot = await getDocs(q);
        absencesChecklist.innerHTML = '';
        if (querySnapshot.empty) {
            absencesChecklist.innerHTML = '<p class="checklist-placeholder">Nessuno studente trovato in questa classe.</p>';
            return;
        }

        querySnapshot.forEach(doc => {
            const student = doc.data();
            const studentName = `${student.surname} ${student.name}`;
            const isChecked = absentStudentNames.includes(studentName);

            const itemDiv = document.createElement('div');
            itemDiv.className = 'checklist-item';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `absent-${doc.id}`;
            checkbox.value = studentName;
            checkbox.checked = isChecked;
            const label = document.createElement('label');
            label.htmlFor = `absent-${doc.id}`;
            label.textContent = studentName;
            itemDiv.appendChild(checkbox);
            itemDiv.appendChild(label);
            absencesChecklist.appendChild(itemDiv);
        });
    } catch (error) {
        console.error("Errore nel caricare gli studenti per la checklist:", error);
        absencesChecklist.innerHTML = '<p class="error-message">Impossibile caricare gli studenti.</p>';
    }
};

const openModal = async (lesson = null) => {
    const classId = classSelector.value;
    if (!classId) {
        showToast("Per favore, seleziona prima una classe.");
        return;
    }
    lessonForm.reset();

    let absentNames = [];
    if (lesson) {
        modalTitle.textContent = "Modifica Lezione";
        lessonIdInput.value = lesson.id;
        document.getElementById('lesson-date-input').value = lesson.date;
        topicInput.value = lesson.topic;
        assignmentsInput.value = lesson.assignments || '';
        if(lesson.absences) absentNames = lesson.absences.split(',').map(s => s.trim());
        deleteLessonBtn.style.display = 'block';
    } else {
        modalTitle.textContent = "Aggiungi Lezione";
        lessonIdInput.value = '';
        document.getElementById('lesson-date-input').value = new Date().toISOString().split('T')[0];
        deleteLessonBtn.style.display = 'none';
    }

    await populateAbsencesChecklist(classId, absentNames);
    
    lessonModal.style.display = 'block';
    setTimeout(() => topicInput.focus(), 150);
};

const closeModal = () => {
    lessonModal.style.display = 'none';
};

const populateClassSelector = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const classesRef = collection(db, 'classes');
    const q = query(classesRef, where("ownerId", "==", user.uid), orderBy("name"));
    const querySnapshot = await getDocs(q);

    const selectedClassId = classSelector.value;
    classSelector.innerHTML = '<option value="">Seleziona una classe...</option>';
    querySnapshot.forEach((doc) => {
        const classData = doc.data();
        const option = document.createElement('option');
        option.value = doc.id;
        option.textContent = classData.name;
        // Aggiungiamo la descrizione come data attribute per l'IA
        option.dataset.description = classData.description || '';
        classSelector.appendChild(option);
    });
    if(selectedClassId) classSelector.value = selectedClassId;
};

// --- Rendering e Caricamento Lezioni ---
const renderLesson = (lesson) => {
    const lessonDiv = document.createElement('div');
    lessonDiv.className = 'list-item';
    
    let absencesHTML = '';
    if (lesson.absences) {
        absencesHTML = `<p class="list-item-extra-info"><b>Assenti:</b> ${lesson.absences}</p>`;
    }

    // Sostituisce i newline con <br> per la visualizzazione nell'HTML
    const formattedTopic = lesson.topic.replace(/\n/g, '<br>');

    lessonDiv.innerHTML = `
        <div class="list-item-main">
            <p class="list-item-title">${new Date(lesson.date + 'T00:00:00').toLocaleDateString()}</p>
            <div class="list-item-subtitle">${formattedTopic}</div>
            ${absencesHTML}
        </div>
        <div class="list-item-actions">
            <button class="btn-icon"><span class="material-symbols-outlined">edit</span></button>
        </div>
    `;
    const editBtn = lessonDiv.querySelector('.btn-icon');
    editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal(lesson);
    });

    return lessonDiv;
};

const loadLessons = async () => {
    const classId = classSelector.value;
    if (!classId) {
        lessonsListContainer.innerHTML = '';
        lessonsPlaceholder.style.display = 'block';
        return;
    }

    lessonsPlaceholder.style.display = 'none';
    lessonsListContainer.innerHTML = '<div class="loader"></div>';

    const lessonsRef = collection(db, 'lessons');
    const q = query(lessonsRef, where("classId", "==", classId), orderBy("date", "desc"));
    
    try {
        const querySnapshot = await getDocs(q);
        lessonsListContainer.innerHTML = '';
        if (querySnapshot.empty) {
            lessonsListContainer.innerHTML = '<p>Nessuna lezione trovata per questa classe.</p>';
        } else {
            querySnapshot.forEach((doc) => {
                const lesson = { id: doc.id, ...doc.data() };
                lessonsListContainer.appendChild(renderLesson(lesson));
            });
        }
    } catch (error) {
        console.error("Errore nel caricamento delle lezioni: ", error);
        lessonsListContainer.innerHTML = '<p class="error-message">Impossibile caricare lezioni.</p>';
    }
};

// --- Gestione Azioni Utente ---
const handleAIGenerate = async () => {
    const topic = prompt("Qual è l'argomento centrale della lezione che vuoi generare?");
    if (!topic) return;

    const selectedOption = classSelector.options[classSelector.selectedIndex];
    const className = selectedOption.textContent;
    const classDescription = selectedOption.dataset.description;

    const result = await generateLessonPlan(topic, className, classDescription);

    if (result) {
        topicInput.value = result.lessonTopic || '';
        assignmentsInput.value = result.suggestedAssignments || '';
        showToast("Bozza della lezione generata con successo!");
    }
};

const handleFormSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    const classId = classSelector.value;
    if (!user || !classId) return;

    const checkedAbsences = [...absencesChecklist.querySelectorAll('input[type="checkbox"]:checked')].map(cb => cb.value);

    const lessonId = lessonIdInput.value;
    const lessonData = {
        classId: classId,
        ownerId: user.uid,
        date: document.getElementById('lesson-date-input').value,
        topic: topicInput.value.trim(),
        assignments: assignmentsInput.value.trim(),
        absences: checkedAbsences.join(', '),
        lastUpdated: serverTimestamp()
    };

    try {
        if (lessonId) {
            const lessonRef = doc(db, 'lessons', lessonId);
            await updateDoc(lessonRef, lessonData);
            showToast("Lezione aggiornata con successo!");
        } else {
            lessonData.createdAt = serverTimestamp();
            await addDoc(collection(db, 'lessons'), lessonData);
            showToast("Lezione salvata con successo!");
        }
        closeModal();
        await loadLessons();
    } catch (error) {
        console.error("Errore nel salvataggio: ", error);
        showToast("Si è verificato un errore durante il salvataggio.");
    }
};

const handleDelete = async () => {
    const lessonId = lessonIdInput.value;
    if (!lessonId || !confirm("Sei sicuro di voler eliminare questa lezione?")) return;

    try {
        await deleteDoc(doc(db, 'lessons', lessonId));
        showToast("Lezione eliminata.");
        closeModal();
        await loadLessons();
    } catch (error) {
        console.error("Errore eliminazione: ", error);
        showToast("Impossibile eliminare la lezione.");
    }
};

// --- Setup e Cleanup ---
const addListener = (element, type, listener) => {
    eventListeners.push({ element, type, listener });
    element.addEventListener(type, listener);
};

export const setupLessonsUI = () => {
    classSelector = document.getElementById('lesson-class-selector');
    addLessonBtn = document.getElementById('add-lesson-btn');
    lessonsListContainer = document.getElementById('lessons-list-container');
    lessonsPlaceholder = document.getElementById('lessons-placeholder');
    lessonModal = document.getElementById('lesson-modal');
    modalTitle = document.getElementById('lesson-modal-title');
    closeModalBtn = lessonModal.querySelector('.close-btn');
    lessonForm = document.getElementById('lesson-form');
    lessonIdInput = document.getElementById('lesson-id-input');
    deleteLessonBtn = document.getElementById('delete-lesson-btn');
    absencesChecklist = document.getElementById('lesson-absences-checklist');
    generateLessonBtn = document.getElementById('generate-lesson-ai-btn');
    topicInput = document.getElementById('lesson-topic-input');
    assignmentsInput = document.getElementById('lesson-assignments-input');
    
    populateClassSelector();

    addListener(classSelector, 'change', loadLessons);
    addListener(addLessonBtn, 'click', () => openModal());
    addListener(closeModalBtn, 'click', closeModal);
    addListener(lessonForm, 'submit', handleFormSubmit);
    addListener(deleteLessonBtn, 'click', handleDelete);
    addListener(generateLessonBtn, 'click', handleAIGenerate);
    addListener(window, 'click', (e) => {
        if (e.target === lessonModal) closeModal();
    });
    
    console.log("Pagina Lezioni configurata con IA.");
};

export const cleanupLessons = () => {
    console.log("Pulizia pagina Lezioni...");
    eventListeners.forEach(({ element, type, listener }) => {
        element.removeEventListener(type, listener);
    });
    eventListeners = [];
};
