
import { initializeAuth } from './js/auth.js';
import { setupAgendaUI, cleanupAgenda } from './js/agenda.js';
import { setupClassUI, cleanupClasses } from './js/classes.js';
import { setupStudentsUI, cleanupStudents } from './js/students.js';
import { setupEvaluationsUI, cleanupEvaluations } from './js/evaluations.js';
import { setupLessonsUI, cleanupLessons } from './js/lessons.js';
import { setupScheduleUI, cleanupSchedule } from './js/schedule.js';
import { setupSettingsUI, cleanupSettings } from './js/settings.js';

const mainContent = document.getElementById('main-content');
const appStatus = document.getElementById('app-status');
const navLinks = document.querySelectorAll('nav a');

const showStatus = (message) => {
    if (appStatus) appStatus.textContent = message;
};

const pageModules = {
    'agenda': { setup: setupAgendaUI, cleanup: cleanupAgenda, path: 'templates/agenda.html' },
    'classes': { setup: setupClassUI, cleanup: cleanupClasses, path: 'templates/classes.html' },
    'students': { setup: setupStudentsUI, cleanup: cleanupStudents, path: 'templates/students.html' },
    'evaluations': { setup: setupEvaluationsUI, cleanup: cleanupEvaluations, path: 'templates/evaluations.html' },
    'lessons': { setup: setupLessonsUI, cleanup: cleanupLessons, path: 'templates/lessons.html' },
    'schedule': { setup: setupScheduleUI, cleanup: cleanupSchedule, path: 'templates/schedule.html' },
    'settings': { setup: setupSettingsUI, cleanup: cleanupSettings, path: 'templates/settings.html' },
};

let currentPageCleanup = null;

const loadPage = async (pageIdWithParams) => {
    if (currentPageCleanup) {
        currentPageCleanup();
        currentPageCleanup = null;
    }

    const [pageId, paramsString] = pageIdWithParams.split('?');
    const params = new URLSearchParams(paramsString);
    const action = params.get('action');
    
    const module = pageModules[pageId];
    if (!module) {
        console.warn(`Pagina non trovata: ${pageId}. Reindirizzamento alla dashboard.`);
        window.location.hash = 'agenda'; // Questo triggera il router di nuovo
        return;
    }

    showStatus('Caricamento...');
    try {
        const response = await fetch(module.path);
        if (!response.ok) {
            console.error(`Errore nel caricamento del template: ${module.path}`);
            mainContent.innerHTML = `<p class="error-message">Impossibile caricare il contenuto della pagina.</p>`;
            showStatus('Errore di caricamento');
            return;
        }
        mainContent.innerHTML = await response.text();
        document.title = `Docente++ | ${pageId.charAt(0).toUpperCase() + pageId.slice(1)}`;

        if (module.setup) {
            module.setup();
            currentPageCleanup = module.cleanup;
        }

        if (action === 'add') {
            const addButton = document.getElementById(`add-${pageId.slice(0, -1)}-btn`);
            if (addButton) {
                addButton.click();
            } else {
                console.warn(`Azione 'add' richiesta, ma pulsante non trovato per ${pageId}`);
            }
        }

        showStatus('');
    } catch (error) {
        console.error(`Errore fatale nel caricamento di ${pageId}:`, error);
        mainContent.innerHTML = `<p class="error-message">C'è stato un errore critico. Ricarica la pagina o contatta il supporto.</p>`;
        showStatus('Errore critico');
    }
};

const router = () => {
    const hash = window.location.hash.substring(1) || 'agenda';
    const pageId = hash.split('?')[0];
    loadPage(pageId);
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-page') === pageId);
    });
};

const startApp = (user) => {
    if (user) {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const pageId = e.currentTarget.getAttribute('data-page');
                if (pageId && !e.currentTarget.classList.contains('disabled')) {
                    e.preventDefault();
                    if (window.location.hash.substring(1) !== pageId) {
                        window.location.hash = pageId;
                    } else {
                        // Se la pagina è già quella corrente, ricarica
                        loadPage(pageId);
                    }
                }
            });
        });

        window.addEventListener('hashchange', router);
        router(); // Carica la pagina iniziale
        showStatus('');
        console.log("Applicazione avviata, routing configurato.");
    } else {
        mainContent.innerHTML = `
            <div class="welcome-container">
                <h2>Benvenuto in Docente++</h2>
                <p>La tua super-app per la gestione della didattica.</p>
                <p>Effettua il login per iniziare.</p>
            </div>
        `;
        showStatus('Pronto per il login');
    }
};

showStatus('Avvio in corso...');
initializeAuth(startApp);
