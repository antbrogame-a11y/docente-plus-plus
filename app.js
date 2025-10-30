// app.js

import { loadData, saveData, state } from './js/data.js';
import { createToastContainer, showToast, showUndoToast, switchTab } from './js/ui.js';
import { setupEventListeners } from './js/events.js';
import { renderChatMessages } from './js/ai.js';
import { handleFileUpload } from './js/import-pipeline.js';
import { createListSkeleton } from './js/skeletons.js';

// Funzione di utility per il rendering del contenuto con skeleton
function renderContent(containerId, skeleton, content) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = skeleton;
    setTimeout(() => {
        container.innerHTML = content;
    }, 500); // Simula un piccolo ritardo per mostrare lo skeleton
}


class DocentePlusPlus {
    init() {
        console.log("Inizializzazione di Docente++ v2.2 (UI Polish)");
        createToastContainer();
        loadData();
        this.renderAll();
        this.setupEventListeners();
    }

    renderAll() {
        this.renderLessons();
        this.renderActivities();
        renderChatMessages();
    }

    renderLessons() {
        const skeleton = createListSkeleton(3);
        const container = document.getElementById('lessons');
        
        const content = () => {
            if (state.lessons.length === 0) {
                return `
                    <div class="empty-state">
                        <span class="material-icons empty-state-icon">menu_book</span>
                        <h3>Nessuna Lezione Trovata</h3>
                        <p>Non hai ancora creato nessuna lezione. Inizia aggiungendone una!</p>
                        <button class="btn btn-primary" onclick="window.app.showAddLessonForm()">
                            <span class="material-icons">add</span> Aggiungi Lezione
                        </button>
                    </div>`;
            }
            const lessonsList = state.lessons.map(lesson => `
                <div class="list-item">
                    <h4>${lesson.title}</h4>
                    <p>Classe: ${state.classes.find(c => c.id === lesson.classId)?.name || 'N/D'}</p>
                    <p>Data: ${new Date(lesson.date).toLocaleDateString()}</p>
                </div>
            `).join('');
            return `<h2>Lezioni</h2><div class="list-container">${lessonsList}</div>`;
        };

        renderContent('lessons', skeleton, content());
    }

    renderActivities() {
        const skeleton = createListSkeleton(4);
        const container = document.getElementById('activities');

        const content = () => {
            if (state.activities.length === 0) {
                return `
                    <div class="empty-state">
                        <span class="material-icons empty-state-icon">assignment</span>
                        <h3>Nessuna Attività Trovata</h3>
                        <p>Non hai ancora creato nessuna attività. Inizia aggiungendone una!</p>
                        <button class="btn btn-primary" onclick="window.app.showAddActivityForm()">
                            <span class="material-icons">add</span> Aggiungi Attività
                        </button>
                    </div>`;
            }
            const activitiesList = state.activities.map(activity => `
                <div class="list-item">
                    <h4>${activity.title}</h4>
                    <p>Tipo: ${activity.type}</p>
                    <p>Scadenza: ${new Date(activity.dueDate).toLocaleDateString()}</p>
                </div>
            `).join('');
            return `<h2>Attività e Valutazioni</h2><div class="list-container">${activitiesList}</div>`;
        };
        
        renderContent('activities', skeleton, content());
    }
    
    setupEventListeners() {
        document.getElementById('main-nav').addEventListener('click', (e) => {
            if (e.target.matches('.tab-button')) {
                switchTab(e.target.dataset.tab);
            }
        });

        const fileImportInput = document.getElementById('file-import-input');
        if (fileImportInput) {
            fileImportInput.addEventListener('change', handleFileUpload);
        }
    }

    showAddLessonForm() {
        showToast('Funzionalità "Aggiungi Lezione" non ancora implementata.', 'info');
    }

    showAddActivityForm() {
        showToast('Funzionalità "Aggiungi Attività" non ancora implementata.', 'info');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new DocentePlusPlus();
    window.app.init();
});
