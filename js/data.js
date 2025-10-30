
// js/data.js

import { collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { db } from './firebase.js'; // Importa l'istanza db dal modulo firebase

export const state = {
    settings: {},
    classes: [],
    students: [],
    lessons: [],
    activities: [],
    evaluations: [],
    schedule: {}, // Teacher's personal weekly recurring schedule (key: "day-time" e.g., "Lunedì-08:00")
    events: [], // Agenda events
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

export function isProfileComplete() {
    // NEW v1.2.2: Check if the user has completed the essential profile information
    // This is independent of onboarding state - menu is always active
    // This only affects whether the profile completion banner is shown
    return state.settings.teacherName && 
           state.settings.teacherName.trim() !== '';
}

export function completeOnboarding(settings) {
    state.settings = settings;
    localStorage.setItem('onboardingComplete', 'true');
    saveDataToLocalStorage();
    // Salva le impostazioni iniziali anche su Firestore
    saveData();
}

export function skipOnboarding() {
    // Don't allow skipping - user must complete onboarding
    // This ensures we never have an intermediate unclear state
    console.warn('Skipping onboarding is not allowed. User must complete profile setup.');
    return false;
}

export function resetToDefaults() {
    // Reset all state to defaults
    state.settings = {};
    state.classes = [];
    state.students = [];
    state.lessons = [];
    state.activities = [];
    state.evaluations = [];
    state.schedule = {};
    state.chatMessages = [];
    state.activeClass = null;
    
    console.warn('State reset to defaults due to corrupted data');
}

export function clearAllData() {
    // Clear all app data - for troubleshooting
    try {
        localStorage.clear();
        resetToDefaults();
        return true;
    } catch (error) {
        console.error('Error clearing localStorage:', error);
        return false;
    }
}

export function checkStorageHealth() {
    // Check if localStorage is accessible and working
    try {
        const testKey = '__docente_storage_test__';
        localStorage.setItem(testKey, 'test');
        const value = localStorage.getItem(testKey);
        localStorage.removeItem(testKey);
        return value === 'test';
    } catch (error) {
        console.error('localStorage is not available:', error);
        return false;
    }
}

/**
 * Recover from corrupted onboarding state
 * This ensures the app is always in a valid state
 */
export function recoverOnboardingState() {
    const onboardingComplete = isOnboardingComplete();
    const profileComplete = isProfileComplete();
    
    console.log('Checking onboarding state:', { onboardingComplete, profileComplete });
    
    // Case 1: Onboarding marked complete but profile is actually incomplete (corrupted state)
    if (onboardingComplete && !profileComplete) {
        console.warn('Detected corrupted onboarding state. Profile is incomplete despite onboarding flag.');
        // Keep onboarding flag but require profile completion
        return {
            needsOnboarding: false,
            needsProfileCompletion: true,
            reason: 'corrupted_profile'
        };
    }
    
    // Case 2: Normal incomplete onboarding
    if (!onboardingComplete) {
        return {
            needsOnboarding: true,
            needsProfileCompletion: false,
            reason: 'not_started'
        };
    }
    
    // Case 3: Everything is OK
    return {
        needsOnboarding: false,
        needsProfileCompletion: false,
        reason: 'complete'
    };
}

/**
 * Validate and fix onboarding state
 * @returns {boolean} True if state is valid or was fixed
 */
export function validateAndFixOnboardingState() {
    try {
        const recovery = recoverOnboardingState();
        
        if (recovery.reason === 'corrupted_profile') {
            console.log('Attempting to fix corrupted profile state...');
            // Check if we can recover any profile data
            if (state.settings.teacherName && state.settings.teacherName.trim() !== '') {
                console.log('Profile data recovered successfully');
                return true;
            } else {
                // Reset onboarding flag to force re-completion
                console.warn('Cannot recover profile data. Resetting onboarding flag.');
                localStorage.removeItem('onboardingComplete');
                return false;
            }
        }
        
        return recovery.reason === 'complete';
    } catch (error) {
        console.error('Error validating onboarding state:', error);
        return false;
    }
}

