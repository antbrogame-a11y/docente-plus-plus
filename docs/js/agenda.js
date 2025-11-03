
import { db, auth } from './firebase.js';
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Assumendo che getRecentEvaluations sia definita in firestore.js e caricata globalmente

// Funzione di cleanup per i listener di questa pagina
let unsubscribeClassStats = null;
let unsubscribeStudentStats = null;
let unsubscribeRecentEvaluations = null; // Listener specifico per le valutazioni recenti

export const cleanupAgenda = () => {
    if (unsubscribeClassStats) unsubscribeClassStats();
    if (unsubscribeStudentStats) unsubscribeStudentStats();
    if (unsubscribeRecentEvaluations) unsubscribeRecentEvaluations(); // Cleanup del nuovo listener
    console.log("Listener della Dashboard (Agenda) rimossi.");
};

// Funzione di setup per l'interfaccia dell'agenda
export const setupAgendaUI = () => {
    const user = auth.currentUser;
    if (!user) return;

    const userId = user.uid;
    const classesRef = collection(db, 'users', userId, 'classes');
    const studentsRef = collection(db, 'users', userId, 'students');
    
    // Elementi del DOM
    const statsClassCount = document.getElementById('stats-class-count');
    const statsStudentCount = document.getElementById('stats-student-count');
    const latestEvaluationsList = document.getElementById('latest-evaluations-list');
    const dailyScheduleList = document.getElementById('daily-schedule-list');
    
    const quickAddClassBtn = document.getElementById('quick-add-class');
    const quickAddStudentBtn = document.getElementById('quick-add-student');
    const quickAddEvaluationBtn = document.getElementById('quick-add-evaluation');

    // STATISTICHE
    unsubscribeClassStats = onSnapshot(classesRef, snapshot => {
        if (statsClassCount) statsClassCount.textContent = snapshot.size;
    });
    unsubscribeStudentStats = onSnapshot(studentsRef, snapshot => {
        if (statsStudentCount) statsStudentCount.textContent = snapshot.size;
    });

    // ULTIME VALUTAZIONI INSERITE (Logica Aggiornata)
    const displayRecentEvaluations = async () => {
        if (!latestEvaluationsList) return;
        
        try {
            // Utilizziamo la nuova funzione per ottenere le valutazioni più recenti
            const recentEvaluations = await getRecentEvaluations(5); // definita in firestore.js

            latestEvaluationsList.innerHTML = ''; // Pulisce la lista

            if (recentEvaluations.length === 0) {
                latestEvaluationsList.innerHTML = '<p class="empty-list-message">Nessuna valutazione con voti inseriti di recente.</p>';
                return;
            }

            recentEvaluations.forEach(evaluation => {
                const listItem = document.createElement('div');
                listItem.className = 'list-item';
                
                const date = evaluation.lastUpdated?.toDate ? evaluation.lastUpdated.toDate() : new Date();
                const formattedDate = date.toLocaleDateString('it-IT', { day: '2-digit', month: 'short' });

                listItem.innerHTML = `
                    <div class="list-item-main">
                        <span class="material-symbols-outlined">history_edu</span>
                        <span><strong>${evaluation.name || 'Valutazione senza nome'}</strong></span>
                    </div>
                    <div class="list-item-details">
                        <span>Aggiornata: <strong>${formattedDate}</strong></span>
                    </div>
                `;
                latestEvaluationsList.appendChild(listItem);
            });

        } catch (error) {
            console.error("Errore nel visualizzare le valutazioni recenti:", error);
            latestEvaluationsList.innerHTML = '<p class="error-message">Impossibile caricare le valutazioni.</p>';
        }
    };

    // Si potrebbe usare onSnapshot sulla collection evaluations per aggiornamenti in tempo reale,
    // ma per semplicità e per coerenza con la nuova funzione, facciamo un fetch singolo.
    // Per renderlo dinamico, potremmo usare un listener qui.
    displayRecentEvaluations();

    // ORARIO GIORNALIERO (Placeholder)
    if (dailyScheduleList) {
        dailyScheduleList.innerHTML = `
            <div class="wip-icon">
                <span class="material-symbols-outlined">construction</span>
                <p>La funzione Orario sarà implementata prossimamente.</p>
            </div>`;
    }

    // AZIONI RAPIDE
    const setupQuickAddAction = (button, page, action) => {
        if (button) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.hash = `${page}?action=${action}`;
            });
        }
    };
    
    setupQuickAddAction(quickAddClassBtn, 'classes', 'add');
    setupQuickAddAction(quickAddStudentBtn, 'students', 'add');
    setupQuickAddAction(quickAddEvaluationBtn, 'evaluations', 'add');

    console.log("Dashboard (Agenda) caricata e configurata con la nuova logica per le valutazioni.");
};