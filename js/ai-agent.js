
// js/ai-agent.js
// AI Agent FAB (Floating Action Button) and Contextual Suggestions System

import { state, saveData } from './data.js';
import { showToast } from './ui.js';

// Default FAB position (bottom-right)
const DEFAULT_FAB_POSITION = { left: null, top: null, bottom: 30, right: 30 };

// Contextual suggestions for each section
// TODO: Expand with more sophisticated suggestions based on actual data analysis
const CONTEXTUAL_SUGGESTIONS = {
    home: [
        { label: '📊 Riepilogo settimanale', action: 'weekly-summary' },
        { label: '📋 Priorità giornaliere', action: 'daily-priorities' },
        { label: '💡 Consigli didattici', action: 'teaching-tips' }
    ],
    lessons: [
        { label: '📝 Pianifica lezione', action: 'plan-lesson' },
        { label: '🎯 Obiettivi didattici', action: 'lesson-objectives' },
        { label: '⏱️ Gestione tempi', action: 'time-management' }
    ],
    students: [
        { label: '📈 Analizza progressi', action: 'analyze-progress' },
        { label: '🎓 Strategie personalizzate', action: 'personalized-strategies' },
        { label: '📊 Report classe', action: 'class-report' }
    ],
    classes: [
        { label: '👥 Panoramica classi', action: 'class-overview' },
        { label: '📚 Materiali classe', action: 'class-materials' },
        { label: '📊 Statistiche classe', action: 'class-stats' }
    ],
    activities: [
        { label: '✅ Priorità attività', action: 'activity-priorities' },
        { label: '📝 Crea attività', action: 'create-activity' },
        { label: '🎯 Obiettivi attività', action: 'activity-goals' }
    ],
    evaluations: [
        { label: '📊 Analisi voti', action: 'grade-analysis' },
        { label: '🔍 Identifica criticità', action: 'identify-issues' },
        { label: '💡 Suggerimenti valutazione', action: 'evaluation-suggestions' }
    ],
    schedule: [
        { label: '📅 Ottimizza orario', action: 'optimize-schedule' },
        { label: '⏰ Gestione scadenze', action: 'manage-deadlines' },
        { label: '📆 Pianificazione mensile', action: 'monthly-planning' }
    ],
    'ai-assistant': [
        { label: '💬 Chat interattiva', action: 'interactive-chat' },
        { label: '🤖 Configurazione IA', action: 'ai-config' },
        { label: '📚 Guida utilizzo', action: 'usage-guide' }
    ],
    settings: [
        { label: '⚙️ Ottimizza configurazione', action: 'optimize-config' },
        { label: '🔧 Guida impostazioni', action: 'settings-guide' },
        { label: '💾 Backup dati', action: 'data-backup' }
    ],
    'document-import': [
        { label: '📄 Suggerimenti import', action: 'import-tips' },
        { label: '🔍 Analizza documento', action: 'analyze-document' },
        { label: '📊 Estrai dati', action: 'extract-data' }
    ]
};

// Section name mapping for display
const SECTION_NAMES = {
    home: 'Dashboard',
    lessons: 'Lezioni',
    students: 'Studenti',
    classes: 'Classi',
    activities: 'Attività',
    evaluations: 'Valutazioni',
    schedule: 'Orario',
    'ai-assistant': 'Assistente IA',
    settings: 'Impostazioni',
    'document-import': 'Import Documenti'
};

/**
 * Initialize the AI Agent FAB system
 */
export function initAIAgentFAB() {
    const fab = document.getElementById('ai-fab');
    if (!fab) return;

    // Load FAB position from localStorage
    loadFABPosition();

    // Load FAB visibility setting
    const fabEnabled = localStorage.getItem('ai-fab-enabled');
    if (fabEnabled === 'false') {
        fab.classList.add('hidden');
    }

    // Setup FAB drag and drop
    setupFABDragAndDrop(fab);

    // Setup FAB click to open modal
    fab.addEventListener('click', openAIAgentModal);

    console.log('AI Agent FAB initialized');
}

/**
 * Load FAB position from localStorage
 */
function loadFABPosition() {
    const fab = document.getElementById('ai-fab');
    if (!fab) return;

    const savedPosition = localStorage.getItem('ai-fab-position');
    if (savedPosition) {
        try {
            const position = JSON.parse(savedPosition);
            // Apply saved position
            if (position.left !== null) {
                fab.style.left = position.left + 'px';
                fab.style.right = 'auto';
            }
            if (position.top !== null) {
                fab.style.top = position.top + 'px';
                fab.style.bottom = 'auto';
            }
        } catch (error) {
            console.warn('Failed to load FAB position:', error);
            resetFABPosition();
        }
    }
}

/**
 * Save FAB position to localStorage
 */
function saveFABPosition(left, top) {
    const position = { left, top, bottom: null, right: null };
    localStorage.setItem('ai-fab-position', JSON.stringify(position));
}

/**
 * Reset FAB position to default (bottom-right)
 */
export function resetFABPosition() {
    const fab = document.getElementById('ai-fab');
    if (!fab) return;

    fab.style.left = 'auto';
    fab.style.top = 'auto';
    fab.style.right = DEFAULT_FAB_POSITION.right + 'px';
    fab.style.bottom = DEFAULT_FAB_POSITION.bottom + 'px';

    // Clear saved position
    localStorage.removeItem('ai-fab-position');
    
    showToast('Posizione Agente IA ripristinata', 'success');
}

/**
 * Toggle FAB visibility
 */
export function toggleFABVisibility(enabled) {
    const fab = document.getElementById('ai-fab');
    if (!fab) return;

    if (enabled) {
        fab.classList.remove('hidden');
        localStorage.setItem('ai-fab-enabled', 'true');
    } else {
        fab.classList.add('hidden');
        localStorage.setItem('ai-fab-enabled', 'false');
    }
}

/**
 * Setup FAB drag and drop functionality with touch support
 */
function setupFABDragAndDrop(fab) {
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    // Mouse events
    fab.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);

    // Touch events
    fab.addEventListener('touchstart', startDragTouch, { passive: false });
    document.addEventListener('touchmove', dragTouch, { passive: false });
    document.addEventListener('touchend', endDragTouch);

    function startDrag(e) {
        if (e.button !== 0) return; // Only left mouse button
        isDragging = true;
        fab.classList.add('dragging');

        const rect = fab.getBoundingClientRect();
        startX = e.clientX;
        startY = e.clientY;
        initialLeft = rect.left;
        initialTop = rect.top;

        e.preventDefault();
    }

    function startDragTouch(e) {
        if (e.touches.length !== 1) return;
        isDragging = true;
        fab.classList.add('dragging');

        const rect = fab.getBoundingClientRect();
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        initialLeft = rect.left;
        initialTop = rect.top;

        e.preventDefault();
    }

    function drag(e) {
        if (!isDragging) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        let newLeft = initialLeft + deltaX;
        let newTop = initialTop + deltaY;

        // Boundary checking to keep FAB on screen
        const fabWidth = fab.offsetWidth;
        const fabHeight = fab.offsetHeight;
        const maxLeft = window.innerWidth - fabWidth;
        const maxTop = window.innerHeight - fabHeight;

        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
        newTop = Math.max(0, Math.min(newTop, maxTop));

        fab.style.left = newLeft + 'px';
        fab.style.top = newTop + 'px';
        fab.style.right = 'auto';
        fab.style.bottom = 'auto';

        e.preventDefault();
    }

    function dragTouch(e) {
        if (!isDragging || e.touches.length !== 1) return;

        const touch = e.touches[0];
        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;

        let newLeft = initialLeft + deltaX;
        let newTop = initialTop + deltaY;

        // Boundary checking
        const fabWidth = fab.offsetWidth;
        const fabHeight = fab.offsetHeight;
        const maxLeft = window.innerWidth - fabWidth;
        const maxTop = window.innerHeight - fabHeight;

        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
        newTop = Math.max(0, Math.min(newTop, maxTop));

        fab.style.left = newLeft + 'px';
        fab.style.top = newTop + 'px';
        fab.style.right = 'auto';
        fab.style.bottom = 'auto';

        e.preventDefault();
    }

    function endDrag(e) {
        if (!isDragging) return;
        isDragging = false;
        fab.classList.remove('dragging');

        // Save position
        const rect = fab.getBoundingClientRect();
        saveFABPosition(rect.left, rect.top);

        e.preventDefault();
    }

    function endDragTouch(e) {
        if (!isDragging) return;
        isDragging = false;
        fab.classList.remove('dragging');

        // Save position
        const rect = fab.getBoundingClientRect();
        saveFABPosition(rect.left, rect.top);

        e.preventDefault();
    }
}

/**
 * Open AI Agent Modal with contextual suggestions
 * Now uses the new floating assistant panel
 */
export function openAIAgentModal() {
    // Use the new floating assistant panel instead
    if (window.floatingAssistant) {
        window.floatingAssistant.open();
    } else {
        // Fallback to old modal if floating assistant not available
        const modal = document.getElementById('ai-agent-modal');
        if (!modal) return;

        // Get current active tab/section
        const currentSection = getCurrentSection();
        
        // Update context info
        updateContextInfo(currentSection);
        
        // Load contextual suggestions
        loadContextualSuggestions(currentSection);
        
        // Clear previous output
        clearAIOutput();
        
        // Show modal
        modal.style.display = 'flex';

        // Setup event listeners
        setupModalEventListeners();
    }
}

/**
 * Close AI Agent Modal
 */
export function closeAIAgentModal() {
    const modal = document.getElementById('ai-agent-modal');
    if (!modal) return;
    modal.style.display = 'none';
}

/**
 * Get current active section/tab
 */
function getCurrentSection() {
    // Check if app has currentActiveTab property
    if (window.app && window.app.currentActiveTab) {
        return window.app.currentActiveTab;
    }

    // Fallback: detect from visible tab content
    const tabs = document.querySelectorAll('.tab-content');
    for (const tab of tabs) {
        if (tab.classList.contains('active') || window.getComputedStyle(tab).display !== 'none') {
            return tab.id;
        }
    }

    return 'home'; // Default fallback
}

/**
 * Update context info display
 */
function updateContextInfo(section) {
    const sectionElement = document.getElementById('ai-current-section');
    if (sectionElement) {
        const sectionName = SECTION_NAMES[section] || section;
        sectionElement.textContent = sectionName;
    }
}

/**
 * Load contextual suggestions based on current section
 */
function loadContextualSuggestions(section) {
    const suggestionsContainer = document.getElementById('ai-suggestions-buttons');
    if (!suggestionsContainer) return;

    // Get suggestions for current section
    const suggestions = CONTEXTUAL_SUGGESTIONS[section] || CONTEXTUAL_SUGGESTIONS.home;

    // Clear existing suggestions
    suggestionsContainer.innerHTML = '';

    // Create suggestion buttons
    suggestions.forEach(suggestion => {
        const button = document.createElement('button');
        button.className = 'btn btn-secondary';
        button.textContent = suggestion.label;
        button.onclick = () => handleSuggestionClick(suggestion.action, suggestion.label);
        suggestionsContainer.appendChild(button);
    });
}

/**
 * Handle suggestion button click
 * TODO: Implement actual AI processing and API integration
 */
function handleSuggestionClick(action, label) {
    const outputSection = document.getElementById('ai-output-section');
    const outputContent = document.getElementById('ai-agent-results-content');

    if (!outputSection || !outputContent) return;

    // Show output section
    outputSection.style.display = 'block';

    // Generate mock response (stub)
    // TODO: Replace with actual AI API call
    const mockResponse = generateMockResponse(action, label);
    outputContent.innerHTML = mockResponse;

    showToast('Suggerimento caricato (modalità demo)', 'info');
}

/**
 * Generate mock response for suggestions (stub)
 * TODO: Replace with actual AI API integration
 */
function generateMockResponse(action, label) {
    return `
        <p><strong>Hai selezionato:</strong> ${label}</p>
        <p><em>⚠️ Modalità Demo: Questa è una risposta di esempio.</em></p>
        <p>TODO: Integrare con API IA (OpenRouter o altro provider) per generare risposte reali basate sul contesto applicativo.</p>
        <p>Azione richiesta: <code>${action}</code></p>
        <hr>
        <p><strong>Esempio di risposta:</strong></p>
        <ul>
            <li>Analisi del contesto corrente</li>
            <li>Suggerimenti personalizzati</li>
            <li>Azioni proposte</li>
        </ul>
    `;
}

/**
 * Clear AI output area
 */
function clearAIOutput() {
    const outputSection = document.getElementById('ai-output-section');
    const outputContent = document.getElementById('ai-agent-results-content');

    if (outputSection) {
        outputSection.style.display = 'none';
    }
    if (outputContent) {
        outputContent.innerHTML = '';
    }
}

/**
 * Setup modal event listeners
 */
function setupModalEventListeners() {
    const submitButton = document.getElementById('ai-submit-prompt');
    const promptInput = document.getElementById('ai-prompt-input');

    if (submitButton && !submitButton.dataset.listenerAttached) {
        submitButton.addEventListener('click', handleUserPromptSubmit);
        submitButton.dataset.listenerAttached = 'true';
    }

    if (promptInput && !promptInput.dataset.listenerAttached) {
        promptInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                handleUserPromptSubmit();
            }
        });
        promptInput.dataset.listenerAttached = 'true';
    }
}

/**
 * Handle user prompt submission
 * TODO: Implement actual AI processing with OpenRouter API or similar
 */
function handleUserPromptSubmit() {
    const promptInput = document.getElementById('ai-prompt-input');
    const outputSection = document.getElementById('ai-output-section');
    const outputContent = document.getElementById('ai-agent-results-content');

    if (!promptInput || !outputSection || !outputContent) return;

    const userPrompt = promptInput.value.trim();
    if (!userPrompt) {
        showToast('Inserisci una richiesta', 'warning');
        return;
    }

    // Show output section
    outputSection.style.display = 'block';

    // Generate mock response (stub)
    // TODO: Replace with actual AI API call
    const mockResponse = `
        <p><strong>Tua richiesta:</strong> "${userPrompt}"</p>
        <p><em>⚠️ Modalità Demo: Questa è una risposta di esempio.</em></p>
        <p>TODO: Implementare parsing della richiesta e chiamata API IA per generare risposte contestuali intelligenti.</p>
        <hr>
        <p><strong>Esempio di elaborazione:</strong></p>
        <ol>
            <li>Analisi del prompt utente</li>
            <li>Estrazione intent e parametri</li>
            <li>Costruzione context applicativo</li>
            <li>Chiamata API IA con context arricchito</li>
            <li>Parsing e presentazione risposta</li>
            <li>Proposta azioni automatiche (se applicabile)</li>
        </ol>
    `;
    
    outputContent.innerHTML = mockResponse;
    
    // Clear input
    promptInput.value = '';

    showToast('Richiesta inviata (modalità demo)', 'info');
}

/**
 * Parse user request and extract intent (stub)
 * TODO: Implement sophisticated NLP parsing
 */
function parseUserRequest(prompt) {
    // Stub implementation
    // TODO: Add intent detection, entity extraction, context building
    return {
        intent: 'general_query',
        entities: [],
        context: getCurrentSection()
    };
}

/**
 * Add context-aware suggestions to settings page
 * This extends the contextual suggester for the settings section
 * Example of how to extend the system for specific sections
 */
export function addSettingsSuggestions() {
    // Example extension point
    // Developers can add more sophisticated suggestions here
    // based on user's actual settings and usage patterns
}
