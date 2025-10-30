// js/floating-assistant.js
// Enhanced Floating AI Assistant with Drawer Panel and Voice Input

import { showToast } from './ui.js';

/**
 * FloatingAssistant - Manages the AI assistant panel
 */
class FloatingAssistant {
    constructor() {
        this.panel = null;
        this.backdrop = null;
        this.messages = [];
        this.isRecording = false;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.recordingStartTime = null;
        this.focusTrap = null;
    }

    /**
     * Initialize the floating assistant
     */
    init() {
        this.createPanel();
        this.attachEventListeners();
        this.loadMessages();
        console.log('Floating AI Assistant initialized');
    }

    /**
     * Create the assistant panel HTML
     */
    createPanel() {
        // Check if panel already exists
        if (document.getElementById('ai-assistant-panel')) {
            this.panel = document.getElementById('ai-assistant-panel');
            this.backdrop = document.getElementById('ai-assistant-backdrop');
            return;
        }

        // Create backdrop
        this.backdrop = document.createElement('div');
        this.backdrop.id = 'ai-assistant-backdrop';
        this.backdrop.className = 'ai-assistant-backdrop';
        this.backdrop.setAttribute('aria-hidden', 'true');
        document.body.appendChild(this.backdrop);

        // Create panel
        this.panel = document.createElement('div');
        this.panel.id = 'ai-assistant-panel';
        this.panel.className = 'ai-assistant-panel';
        this.panel.setAttribute('role', 'dialog');
        this.panel.setAttribute('aria-modal', 'true');
        this.panel.setAttribute('aria-labelledby', 'ai-assistant-title');
        this.panel.innerHTML = `
            <div class="ai-assistant-header">
                <h2 id="ai-assistant-title">
                    <span class="material-symbols-outlined">smart_toy</span>
                    Assistente IA
                </h2>
                <button class="ai-assistant-close" aria-label="Chiudi assistente IA" title="Chiudi (ESC)">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            
            <div class="ai-assistant-body">
                <!-- Empty State -->
                <div class="ai-empty-state" id="ai-empty-state">
                    <span class="material-symbols-outlined">psychology</span>
                    <h3>Ciao! Come posso aiutarti?</h3>
                    <p>Fai una domanda o usa i suggerimenti qui sotto</p>
                </div>

                <!-- Quick Suggestions -->
                <div class="ai-quick-suggestions" id="ai-quick-suggestions">
                    <!-- Suggestions will be populated here -->
                </div>
                
                <!-- Messages Container -->
                <div class="ai-messages-container" id="ai-messages-container">
                    <!-- Messages will be appended here -->
                </div>
            </div>
            
            <div class="ai-assistant-input-area">
                <!-- Recording Status -->
                <div class="ai-recording-status" id="ai-recording-status">
                    <div class="ai-recording-pulse"></div>
                    <span>Registrazione in corso...</span>
                    <span id="ai-recording-time">0:00</span>
                </div>
                
                <div class="ai-input-wrapper">
                    <div class="ai-text-input-container">
                        <textarea 
                            id="ai-text-input" 
                            class="ai-text-input" 
                            placeholder="Scrivi il tuo messaggio..."
                            rows="1"
                            aria-label="Messaggio per l'assistente IA"></textarea>
                    </div>
                    <button 
                        id="ai-voice-button" 
                        class="ai-voice-button" 
                        aria-label="Registra messaggio vocale"
                        title="Registra messaggio vocale">
                        <span class="material-symbols-outlined">mic</span>
                    </button>
                    <button 
                        id="ai-send-button" 
                        class="ai-send-button" 
                        aria-label="Invia messaggio"
                        title="Invia messaggio"
                        disabled>
                        <span class="material-symbols-outlined">send</span>
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.panel);
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Close button
        const closeBtn = this.panel.querySelector('.ai-assistant-close');
        closeBtn.addEventListener('click', () => this.close());

        // Backdrop click to close (mobile only)
        this.backdrop.addEventListener('click', () => {
            if (window.innerWidth < 769) {
                this.close();
            }
        });

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.panel.classList.contains('open')) {
                this.close();
            }
        });

        // Text input
        const textInput = document.getElementById('ai-text-input');
        textInput.addEventListener('input', () => this.handleTextInput());
        textInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Mobile: Scroll input into view on focus to handle virtual keyboard
        textInput.addEventListener('focus', () => {
            if (window.innerWidth < 769) {
                setTimeout(() => {
                    textInput.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest',
                        inline: 'nearest'
                    });
                }, 300); // Delay to allow keyboard to open
            }
        });

        // Send button
        const sendBtn = document.getElementById('ai-send-button');
        sendBtn.addEventListener('click', () => this.sendMessage());

        // Voice button
        const voiceBtn = document.getElementById('ai-voice-button');
        voiceBtn.addEventListener('click', () => this.toggleRecording());
    }

    /**
     * Open the assistant panel
     */
    open() {
        this.panel.classList.add('open');
        this.backdrop.classList.add('visible');
        
        // Load contextual suggestions
        this.loadContextualSuggestions();
        
        // Focus the text input
        setTimeout(() => {
            const textInput = document.getElementById('ai-text-input');
            textInput.focus();
        }, 300);

        // Setup focus trap
        this.setupFocusTrap();

        // Announce to screen readers
        this.announce('Assistente IA aperto');
    }

    /**
     * Close the assistant panel
     */
    close() {
        this.panel.classList.remove('open');
        this.backdrop.classList.remove('visible');
        
        // Stop recording if active
        if (this.isRecording) {
            this.stopRecording();
        }

        // Remove focus trap
        this.removeFocusTrap();

        // Announce to screen readers
        this.announce('Assistente IA chiuso');
    }

    /**
     * Load contextual suggestions based on current page
     */
    loadContextualSuggestions() {
        const suggestionsContainer = document.getElementById('ai-quick-suggestions');
        suggestionsContainer.innerHTML = '';

        // Get current page context
        const currentPage = this.getCurrentPage();
        const suggestions = this.getSuggestionsForPage(currentPage);

        suggestions.forEach(suggestion => {
            const chip = document.createElement('button');
            chip.className = 'ai-suggestion-chip';
            chip.innerHTML = suggestion.label;
            chip.setAttribute('aria-label', `Suggerimento: ${suggestion.label}`);
            chip.addEventListener('click', () => this.handleSuggestionClick(suggestion));
            suggestionsContainer.appendChild(chip);
        });
    }

    /**
     * Get current page context
     */
    getCurrentPage() {
        if (window.app && window.app.currentActiveTab) {
            return window.app.currentActiveTab;
        }
        return 'home';
    }

    /**
     * Get suggestions for specific page
     */
    getSuggestionsForPage(page) {
        const suggestionMap = {
            home: [
                { label: '📊 Riepilogo giornata', action: 'daily-summary' },
                { label: '📅 Prossimi impegni', action: 'upcoming-tasks' },
                { label: '💡 Suggerimenti', action: 'tips' }
            ],
            schedule: [
                { label: '📅 Orario di oggi', action: 'today-schedule' },
                { label: '⏰ Prossima lezione', action: 'next-lesson' },
                { label: '📝 Preparazione lezione', action: 'lesson-prep' }
            ],
            lessons: [
                { label: '📝 Crea lezione', action: 'create-lesson' },
                { label: '🎯 Obiettivi didattici', action: 'learning-objectives' },
                { label: '📚 Materiali consigliati', action: 'materials' }
            ],
            students: [
                { label: '👥 Panoramica classe', action: 'class-overview' },
                { label: '📈 Andamento studenti', action: 'student-progress' },
                { label: '🎯 Interventi personalizzati', action: 'personalized-interventions' }
            ]
        };

        return suggestionMap[page] || suggestionMap.home;
    }

    /**
     * Handle suggestion chip click
     */
    handleSuggestionClick(suggestion) {
        // Add user message
        this.addMessage('user', suggestion.label);
        
        // Generate AI response (mock for now)
        setTimeout(() => {
            this.generateMockResponse(suggestion.action);
        }, 500);
    }

    /**
     * Handle text input changes
     */
    handleTextInput() {
        const textInput = document.getElementById('ai-text-input');
        const sendBtn = document.getElementById('ai-send-button');
        
        // Enable/disable send button
        sendBtn.disabled = !textInput.value.trim();

        // Auto-resize textarea
        textInput.style.height = 'auto';
        textInput.style.height = textInput.scrollHeight + 'px';
    }

    /**
     * Send message
     */
    sendMessage() {
        const textInput = document.getElementById('ai-text-input');
        const message = textInput.value.trim();
        
        if (!message) return;

        // Add user message
        this.addMessage('user', message);
        
        // Clear input
        textInput.value = '';
        textInput.style.height = 'auto';
        this.handleTextInput();

        // Generate AI response (mock for now)
        setTimeout(() => {
            this.generateMockResponse('general');
        }, 800);
    }

    /**
     * Add message to chat
     */
    addMessage(type, text) {
        const container = document.getElementById('ai-messages-container');
        const emptyState = document.getElementById('ai-empty-state');
        
        // Hide empty state
        if (emptyState) {
            emptyState.style.display = 'none';
        }

        const message = {
            type,
            text,
            timestamp: new Date()
        };

        this.messages.push(message);

        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `ai-message ${type}`;
        messageEl.innerHTML = `
            ${type === 'assistant' ? `
                <div class="ai-message-icon">
                    <span class="material-symbols-outlined">smart_toy</span>
                </div>
            ` : ''}
            <div class="ai-message-content">
                <p class="ai-message-text">${this.escapeHtml(text)}</p>
                <div class="ai-message-time">${this.formatTime(message.timestamp)}</div>
            </div>
        `;

        container.appendChild(messageEl);

        // Scroll to bottom
        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, 100);

        // Save messages
        this.saveMessages();
    }

    /**
     * Add loading message
     */
    addLoadingMessage() {
        const container = document.getElementById('ai-messages-container');
        
        const messageEl = document.createElement('div');
        messageEl.className = 'ai-message assistant loading';
        messageEl.id = 'ai-loading-message';
        messageEl.innerHTML = `
            <div class="ai-message-icon">
                <span class="material-symbols-outlined">smart_toy</span>
            </div>
            <div class="ai-message-content">
                <p class="ai-message-text">
                    <span class="ai-typing-indicator">
                        <span class="ai-typing-dot"></span>
                        <span class="ai-typing-dot"></span>
                        <span class="ai-typing-dot"></span>
                    </span>
                </p>
            </div>
        `;

        container.appendChild(messageEl);

        // Scroll to bottom
        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, 100);
    }

    /**
     * Remove loading message
     */
    removeLoadingMessage() {
        const loadingMsg = document.getElementById('ai-loading-message');
        if (loadingMsg) {
            loadingMsg.remove();
        }
    }

    /**
     * Generate mock AI response
     * TODO: Replace with actual AI API integration
     */
    generateMockResponse(action) {
        this.addLoadingMessage();

        setTimeout(() => {
            this.removeLoadingMessage();

            const responses = {
                'daily-summary': 'Oggi hai 3 lezioni programmate: Matematica con la 3A alle 8:00, Italiano con la 2B alle 10:00, e Storia con la 3A alle 12:00. Hai anche 2 compiti da correggere e 1 riunione alle 15:00.',
                'upcoming-tasks': 'I tuoi prossimi impegni sono: Correzione verifica di Matematica (scadenza domani), Preparazione lezione di Storia (giovedì), Consiglio di classe (venerdì alle 16:00).',
                'tips': 'Suggerimento: Hai molte valutazioni in sospeso per la classe 3A. Considera di dedicare del tempo questa settimana per aggiornare i voti nel registro.',
                'today-schedule': 'Il tuo orario di oggi prevede 5 ore di lezione: 8:00-9:00 Matematica 3A, 9:00-10:00 Pausa, 10:00-11:00 Italiano 2B, 11:00-12:00 Pausa, 12:00-13:00 Storia 3A.',
                'next-lesson': 'La tua prossima lezione è Matematica con la classe 3A tra 15 minuti. Argomento previsto: Equazioni di secondo grado.',
                'general': 'Sono qui per aiutarti! Posso assisterti con la pianificazione delle lezioni, la gestione della classe, suggerimenti didattici e molto altro. Cosa vorresti sapere?'
            };

            const response = responses[action] || responses.general;
            this.addMessage('assistant', response);
        }, 1000);
    }

    /**
     * Toggle voice recording
     */
    async toggleRecording() {
        if (this.isRecording) {
            this.stopRecording();
        } else {
            await this.startRecording();
        }
    }

    /**
     * Start voice recording
     * MOCK IMPLEMENTATION - To be replaced with actual speech-to-text API
     */
    async startRecording() {
        try {
            // Check if browser supports getUserMedia
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                showToast('La registrazione vocale non è supportata dal tuo browser', 'error');
                return;
            }

            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];
            this.recordingStartTime = Date.now();

            this.mediaRecorder.addEventListener('dataavailable', (event) => {
                this.audioChunks.push(event.data);
            });

            this.mediaRecorder.addEventListener('stop', () => {
                this.processRecording();
            });

            this.mediaRecorder.start();
            this.isRecording = true;

            // Update UI
            const voiceBtn = document.getElementById('ai-voice-button');
            const recordingStatus = document.getElementById('ai-recording-status');
            voiceBtn.classList.add('recording');
            voiceBtn.querySelector('.material-symbols-outlined').textContent = 'stop';
            voiceBtn.setAttribute('aria-label', 'Ferma registrazione');
            recordingStatus.classList.add('active');

            // Start recording timer
            this.startRecordingTimer();

            showToast('Registrazione avviata', 'info');

        } catch (error) {
            console.error('Error starting recording:', error);
            showToast('Impossibile accedere al microfono', 'error');
        }
    }

    /**
     * Stop voice recording
     */
    stopRecording() {
        if (!this.mediaRecorder || !this.isRecording) return;

        this.mediaRecorder.stop();
        this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
        this.isRecording = false;

        // Update UI
        const voiceBtn = document.getElementById('ai-voice-button');
        const recordingStatus = document.getElementById('ai-recording-status');
        voiceBtn.classList.remove('recording');
        voiceBtn.querySelector('.material-symbols-outlined').textContent = 'mic';
        voiceBtn.setAttribute('aria-label', 'Registra messaggio vocale');
        recordingStatus.classList.remove('active');

        // Stop recording timer
        this.stopRecordingTimer();

        showToast('Registrazione fermata', 'info');
    }

    /**
     * Start recording timer
     */
    startRecordingTimer() {
        const timeDisplay = document.getElementById('ai-recording-time');
        
        this.recordingTimer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.recordingStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    /**
     * Stop recording timer
     */
    stopRecordingTimer() {
        if (this.recordingTimer) {
            clearInterval(this.recordingTimer);
            this.recordingTimer = null;
        }
    }

    /**
     * Process recorded audio
     * MOCK IMPLEMENTATION - To be replaced with actual speech-to-text API
     */
    processRecording() {
        // Create audio blob
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        
        // Mock transcription
        setTimeout(() => {
            const mockTranscriptions = [
                "Come posso preparare una lezione coinvolgente sulla rivoluzione francese?",
                "Quali strategie posso usare per studenti con difficoltà in matematica?",
                "Suggerisci attività pratiche per insegnare le frazioni",
                "Come posso migliorare la partecipazione degli studenti?",
                "Dammi idee per una verifica di scienze sulla fotosintesi"
            ];
            
            const mockText = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
            
            // Add transcribed message
            this.addMessage('user', `🎤 ${mockText}`);
            
            // Generate AI response
            setTimeout(() => {
                this.generateMockResponse('general');
            }, 800);
            
            showToast('Trascrizione completata (DEMO)', 'success');
        }, 1500);
    }

    /**
     * Setup focus trap for accessibility
     */
    setupFocusTrap() {
        const focusableElements = this.panel.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;

        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        this.focusTrap = (e) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        };

        this.panel.addEventListener('keydown', this.focusTrap);
    }

    /**
     * Remove focus trap
     */
    removeFocusTrap() {
        if (this.focusTrap) {
            this.panel.removeEventListener('keydown', this.focusTrap);
            this.focusTrap = null;
        }
    }

    /**
     * Save messages to localStorage
     */
    saveMessages() {
        try {
            localStorage.setItem('ai-messages', JSON.stringify(this.messages));
        } catch (error) {
            console.warn('Failed to save messages:', error);
        }
    }

    /**
     * Load messages from localStorage
     */
    loadMessages() {
        try {
            const saved = localStorage.getItem('ai-messages');
            if (saved) {
                this.messages = JSON.parse(saved);
                // Don't restore messages on init, keep chat fresh
            }
        } catch (error) {
            console.warn('Failed to load messages:', error);
            this.messages = [];
        }
    }

    /**
     * Announce to screen readers
     */
    announce(message) {
        const announcer = document.getElementById('aria-announcer') || this.createAnnouncer();
        announcer.textContent = message;
    }

    /**
     * Create ARIA announcer
     */
    createAnnouncer() {
        const announcer = document.createElement('div');
        announcer.id = 'aria-announcer';
        announcer.className = 'sr-only';
        announcer.setAttribute('role', 'status');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        document.body.appendChild(announcer);
        return announcer;
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Format timestamp
     */
    formatTime(date) {
        return date.toLocaleTimeString('it-IT', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
}

// Create singleton instance
export const floatingAssistant = new FloatingAssistant();

/**
 * Initialize floating assistant
 */
export function initFloatingAssistant() {
    floatingAssistant.init();
}

/**
 * Open AI assistant panel
 */
export function openAssistantPanel() {
    floatingAssistant.open();
}

/**
 * Close AI assistant panel
 */
export function closeAssistantPanel() {
    floatingAssistant.close();
}

// Make globally accessible for onclick handlers
if (typeof window !== 'undefined') {
    window.floatingAssistant = floatingAssistant;
}
