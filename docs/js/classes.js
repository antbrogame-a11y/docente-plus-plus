
import { db, auth } from './firebase.js';
import {
    collection, addDoc, onSnapshot, query, orderBy, doc, deleteDoc, updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// --- Funzioni Core Riutilizzabili (esportate per essere usate altrove) ---

export const addClass = async (className) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Utente non autenticato.");
    if (!className || className.trim() === '') throw new Error("Il nome della classe è obbligatorio.");

    const classesRef = collection(db, 'users', user.uid, 'classes');
    return await addDoc(classesRef, { 
        name: className.trim(), 
        createdAt: new Date() 
    });
};

export const updateClass = async (classId, newName) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Utente non autenticato.");
    if (!newName || newName.trim() === '') throw new Error("Il nuovo nome non può essere vuoto.");

    const classDocRef = doc(db, 'users', user.uid, 'classes', classId);
    return await updateDoc(classDocRef, { name: newName.trim() });
};

export const deleteClass = async (classId) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Utente non autenticato.");

    const classDocRef = doc(db, 'users', user.uid, 'classes', classId);
    return await deleteDoc(classDocRef);
};


// --- Logica di Rendering e Gestione dell'Interfaccia ---

// Variabile per tenere traccia della funzione di unsubscribe del listener
let unsubscribeFromClasses;

// Funzione per fermare l'ascolto degli aggiornamenti
export const cleanupClasses = () => {
    if (unsubscribeFromClasses) {
        unsubscribeFromClasses();
        unsubscribeFromClasses = null;
        console.log("Listener delle classi rimosso.");
    }
};

// Funzione per avviare il rendering e la gestione della UI
export const setupClassUI = () => {
    cleanupClasses(); // Pulisce listener precedenti per evitare duplicati

    const user = auth.currentUser;
    const classListDiv = document.getElementById('class-list');
    
    if (!user) {
        if (classListDiv) classListDiv.innerHTML = '<p>Fai il login per vedere le tue classi.</p>';
        return;
    }

    if (!classListDiv) {
        // Se non c'è un elenco di classi in questa pagina, non fa nulla.
        console.log("Nessun elemento #class-list trovato in questa pagina. Rendering saltato.");
        return;
    }

    const classesRef = collection(db, 'users', user.uid, 'classes');
    const q = query(classesRef, orderBy("name"));

    // Listener per aggiornamenti in tempo reale
    unsubscribeFromClasses = onSnapshot(q, (snapshot) => {
        classListDiv.innerHTML = ''; // Pulisce la lista
        if (snapshot.empty) {
            classListDiv.innerHTML = '<p class="empty-list-message">Nessuna classe trovata. Inizia aggiungendone una!</p>';
            return;
        }

        snapshot.forEach(doc => {
            const c = { id: doc.id, ...doc.data() };
            const classElement = document.createElement('div');
            classElement.className = 'list-item';
            classElement.innerHTML = `
                <div class="list-item-main">
                    <span class="material-symbols-outlined">school</span>
                    <span>${c.name}</span>
                </div>
                <div class="list-item-actions">
                    <button class="btn-icon btn-edit" data-id="${c.id}" data-name="${c.name}"><span class="material-symbols-outlined">edit</span></button>
                    <button class="btn-icon btn-delete" data-id="${c.id}"><span class="material-symbols-outlined">delete</span></button>
                </div>
            `;
            classListDiv.appendChild(classElement);
        });

    }, (error) => {
        console.error("Errore nel listener di Firestore:", error);
        classListDiv.innerHTML = '<p class="error-message">Errore nel caricamento delle classi.</p>';
    });

    console.log("Interfaccia Classi inizializzata.");
};
