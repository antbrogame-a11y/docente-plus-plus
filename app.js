
// app.js

import { loadData, saveData, isOnboardingComplete, state } from './js/data.js';
import { createToastContainer, showToast, switchTab, updateActiveClassBadge, showOnboarding, renderLessons, renderActivities } from './js/ui.js';
import { setupEventListeners } from './js/events.js';
import { renderChatMessages, sendMessageToAI } from './js/ai.js';

class DocentePlusPlus {
    constructor() {
        // Constructor remains the same
    }

    init() {
        try {
            // Initialize theme provider first
            themeProvider.initialize();
            
            // Initialize legacy theme system for backwards compatibility
            initializeTheme();
            
            const dataLoaded = loadData();
            if (!dataLoaded) {
                showToast('Dati corrotti rilevati. App ripristinata ai valori predefiniti.', 'warning', 5000);
            }
            
            // Validate and recover onboarding state if needed
            const onboardingState = recoverOnboardingState();
            console.log('Onboarding state:', onboardingState);
            
            // NEW: Always enable all menu items (sidebar always active - no more blocking)
            enableAllMenuItems();
            
            if (onboardingState.needsOnboarding) {
                // NEW: Show banner but don't block menu - user can explore freely
                this.initializeAppUI();
                showOnboardingBanner();
                // Suggest settings but don't force it
                setTimeout(() => {
                    showToast('👋 Benvenuto! Per iniziare, configura il tuo profilo dalle Impostazioni.', 'info', 5000);
                }, 500);
            } else if (onboardingState.needsProfileCompletion) {
                // Onboarding marked complete but profile is incomplete (corrupted data)
                showOnboardingBanner();
                this.initializeAppUI();
                showToast('⚠️ Profilo incompleto rilevato. Completa i dati dalle Impostazioni per un\'esperienza ottimale.', 'info', 6000);
            } else {
                // Everything is OK - profile complete
                hideOnboardingBanner();
                this.initializeAppUI();
                
                // Log success for debugging
                if (onboardingState.reason === 'complete') {
                    console.log('✅ App initialized with complete profile');
                }
            }
            
            setupEventListeners();
            setupThemePicker();
            createToastContainer();
            
            // Initialize AppBar scroll behavior
            initAppBar();
            
            // Initialize Navigation system
            initNavigation();
            
            // Initialize AI Agent FAB
            initAIAgentFAB();
            
            // Initialize Floating AI Assistant Panel
            initFloatingAssistant();
            
            // Initialize notification system
            notificationSystem.startAutoCheck();
            
            console.log("Docente++ v1.2.2 (Always-Visible Sidebar & Unified Settings) initialized.");
        } catch (error) {
            console.error("Error during init:", error);
            // Try to recover by showing a minimal UI
            createToastContainer();
            showToast('Errore durante l\'inizializzazione. Alcune funzionalità potrebbero non essere disponibili.', 'error', 5000);
            setupEventListeners();
        }
        setupEventListeners(this);
        createToastContainer();
        console.log("Docente++ v2.0.0 (UI Refactor) initialized.");
    }

    initializeAppUI() {
        document.querySelector('header')?.classList.add('minimal');
        this.renderAllTabs();
        // updateActiveClassBadge(); // This can be removed if not used in the new UI
        switchTab('home');
        
        // Initialize theme switcher UI
        initThemeSwitcher();
        
        // NEW: Menu is always active - just show/hide banner based on profile status
        if (isProfileComplete()) {
            hideOnboardingBanner();
        } else {
            showOnboardingBanner();
        }
        
        // Ensure all menu items are always enabled
        enableAllMenuItems();
    }
    
    // Public method to switch tabs - used by landing page cards
    switchTab(tabName) {
        switchTab(tabName);
    }
    
    // Open In Classe page - using window.open is acceptable for focused classroom mode
    // This keeps the main app accessible while teacher is in class
    openInClasse() {
        window.open('in-classe.html', '_blank');
    }

    renderAllTabs() {
        this.renderHome();
        renderLessons();
        renderActivities();
        // renderStudents();
        // renderClasses();
        // renderSchedule();
        renderChatMessages();
    }

    renderHome() {
        this.renderTodaysSchedule();
        this.renderTodoList();
        this.refreshAISuggestions();
    }

    renderTodaysSchedule() {
        const scheduleContainer = document.getElementById('home-today-schedule');
        if (!scheduleContainer) return;

        const today = new Date().toISOString().split('T')[0];
        const todaysLessons = state.lessons.filter(l => l.date === today);
        const todaysActivities = state.activities.filter(a => a.date === today);

        const events = [
            ...todaysLessons.map(l => ({ ...l, type: 'Lezione' })),
            ...todaysActivities.map(a => ({ ...a, type: 'Attività' }))
        ].sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99'));

        if (events.length === 0) {
            scheduleContainer.innerHTML = '<p class="placeholder">Nessun evento in programma per oggi. Goditi il relax!</p>';
            return;
        }

        scheduleContainer.innerHTML = events.map(event => `
            <div class="schedule-item">
                <span class="schedule-item-time">${event.time || 'Tutto il giorno'}</span>
                <span class="schedule-item-title">${event.title}</span>
                <span class="schedule-item-type ${event.type.toLowerCase()}">${event.type}</span>
            </div>
        `).join('');
    }

    renderTodoList() {
        const todoContainer = document.getElementById('home-todo-list');
        if (!todoContainer) return;

        const upcomingActivities = state.activities
            .filter(a => a.status !== 'completed' && new Date(a.date) >= new Date())
            .sort((a,b) => new Date(a.date) - new Date(b.date))
            .slice(0, 5);

        if (upcomingActivities.length === 0) {
            todoContainer.innerHTML = '<p class="placeholder">Nessuna attività imminente. Ottimo lavoro!</p>';
            return;
        }

        todoContainer.innerHTML = upcomingActivities.map(act => `
            <div class="todo-item" onclick="app.switchTab('activities')">
                <span class="todo-item-title">Valutare: <strong>${act.title}</strong></span>
                <span class="todo-item-date">Scadenza: ${new Date(act.date).toLocaleDateString()}</span>
            </div>
        `).join('');
    }

    refreshAISuggestions() {
        const suggestionsContainer = document.getElementById('home-ai-suggestions');
        if (!suggestionsContainer) return;

        const suggestions = [
            'Crea una lezione sulla "Fotosintesi Clorofilliana" per la prossima settimana.',
            'Prepara una verifica a sorpresa per la classe 3A.',
            'Suggerisci un\'attività di laboratorio sul "Ciclo dell\'Acqua".',
            'Importa un PDF sul sistema solare per creare una nuova lezione.',
        ];
        const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];

        suggestionsContainer.innerHTML = `
            <div class="ai-suggestion-item" onclick="app.useAISuggestion('${randomSuggestion}')">
                <span class="suggestion-icon">💡</span>
                <span class="suggestion-text">${randomSuggestion}</span>
            </div>
        `;
    }

    useAISuggestion(suggestionText) {
        this.switchTab('ai-assistant');
        const chatInput = document.getElementById('ai-chat-input');
        if(chatInput){
            chatInput.value = suggestionText;
            showToast('Suggerimento pronto! Clicca Invia per chiedere all\'IA.');
        }
    }

    // Methods for showing/hiding forms, etc. remain, but might need updates
    // For example, they are no longer part of the DocentePlusPlus class in the new structure

}

document.addEventListener('DOMContentLoaded', () => {
    try {
        window.app = new DocentePlusPlus();
        window.app.init();
        // Expose showToast globally for theme picker
        window.showToast = showToast;
    } catch (error) {
        console.error("Fatal error during app initialization:", error);
        document.body.innerHTML = '<div style="text-align:center;padding:20px;"><h1>Errore Critico</h1><p>L\'applicazione non è riuscita a caricarsi. Controlla la console per i dettagli.</p></div>';
    }
});
