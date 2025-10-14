
// js/data.js

import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const db = getFirestore();

export const state = {
    settings: {},
    classes: [],
    students: [],
    lessons: [],
    activities: [],
    evaluations: [],
    schedule: {},
    chatMessages: [],
    activeClass: null,
};

export async function loadData() {
    console.log("Inizio caricamento dati da Firestore...");
    try {
        const settingsCollection = await getDocs(collection(db, "settings"));
        state.settings = settingsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }))[0] || {};
        console.log("Impostazioni caricate:", state.settings);

        const classesCollection = await getDocs(collection(db, "classes"));
        state.classes = classesCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Classi caricate:", state.classes);

        const studentsCollection = await getDocs(collection(db, "students"));
        state.students = studentsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Studenti caricati:", state.students);

        const lessonsCollection = await getDocs(collection(db, "lessons"));
        state.lessons = lessonsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Lezioni caricate:", state.lessons);

        const activitiesCollection = await getDocs(collection(db, "activities"));
        state.activities = activitiesCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Attività caricate:", state.activities);

        const evaluationsCollection = await getDocs(collection(db, "evaluations"));
        state.evaluations = evaluationsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Valutazioni caricate:", state.evaluations);

        const scheduleCollection = await getDocs(collection(db, "schedule"));
        state.schedule = scheduleCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }))[0] || {};
        console.log("Orario caricato:", state.schedule);

        console.log("Caricamento dati da Firestore completato.");
    } catch (error) {
        console.error("Errore durante il caricamento dei dati da Firestore:", error);
        console.log("Caricamento dati da localStorage come fallback.");
        loadDataFromLocalStorage();
    }
}

export async function saveData() {
    console.log("Inizio salvataggio dati su Firestore...");
    try {
        // Esempio di salvataggio per le nuove attività
        for (const activity of state.activities) {
            if (!activity.id) { // Salva solo le nuove attività
                const docRef = await addDoc(collection(db, "activities"), activity);
                activity.id = docRef.id;
                console.log("Attività salvata con ID:", docRef.id);
            }
        }
        // Implementare logica di salvataggio simile per le altre raccolte
        console.log("Salvataggio dati su Firestore completato.");
    } catch (error) {
        console.error("Errore durante il salvataggio dei dati su Firestore:", error);
    }
}

function loadDataFromLocalStorage() {
    state.settings = JSON.parse(localStorage.getItem('settings')) || {};
    state.classes = JSON.parse(localStorage.getItem('classes')) || [];
    state.students = JSON.parse(localStorage.getItem('students')) || [];
    state.lessons = JSON.parse(localStorage.getItem('lessons')) || [];
    state.activities = JSON.parse(localStorage.getItem('activities')) || [];
    state.evaluations = JSON.parse(localStorage.getItem('evaluations')) || [];
    state.schedule = JSON.parse(localStorage.getItem('schedule')) || {};
    state.chatMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    state.activeClass = localStorage.getItem('activeClass') || null;
}

export function saveDataToLocalStorage() {
    localStorage.setItem('settings', JSON.stringify(state.settings));
    localStorage.setItem('classes', JSON.stringify(state.classes));
    localStorage.setItem('students', JSON.stringify(state.students));
    localStorage.setItem('lessons', JSON.stringify(state.lessons));
    localStorage.setItem('activities', JSON.stringify(state.activities));
    localStorage.setItem('evaluations', JSON.stringify(state.evaluations));
    localStorage.setItem('schedule', JSON.stringify(state.schedule));
    localStorage.setItem('chatMessages', JSON.stringify(state.chatMessages));
    localStorage.setItem('activeClass', state.activeClass);
}

export function isOnboardingComplete() {
    return localStorage.getItem('onboardingComplete') === 'true';
}

export function completeOnboarding(settings) {
    state.settings = settings;
    localStorage.setItem('onboardingComplete', 'true');
    saveDataToLocalStorage();
    // Salva le impostazioni iniziali anche su Firestore
    saveData();
}
