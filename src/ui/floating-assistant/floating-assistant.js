/**
 * Floating AI Assistant UI Component
 * Enhanced version with drawer panel, voice input, and focus trap
 * Uses MOCK_AI feature flag for mock behavior
 */

import { showToast } from '../../js/ui.js';

const MOCK_AI = true; // Feature flag for mock AI behavior

/**
 * FloatingAssistantUI - Enhanced floating assistant with accessibility
 */
export class FloatingAssistantUI {
  constructor() {
    this.panel = null;
    this.backdrop = null;
    this.isOpen = false;
    this.messages = [];
    this.isRecording = false;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.recordingStartTime = null;
    this.focusTrap = null;
    this.previouslyFocusedElement = null;
  }

  /**
   * Initialize the floating assistant
   */
  init() {
    this.createPanel();
    this.attachEventListeners();
    this.loadMessages();
    this.setupFocusTrap();
    console.log('Floating AI Assistant UI initialized');
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
    this.panel.setAttribute('aria-describedby', 'ai-assistant-description');
    
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
        <p id="ai-assistant-description" class="sr-only">Assistente intelligente per supporto didattico</p>
        
        <!-- Live region for announcements -->
        <div id="ai-live-region" class="sr-only" aria-live="polite" aria-atomic="true"></div>
        
        <!-- Empty State -->
        <div class="ai-empty-state" id="ai-empty-state">
          <span class="material-symbols-outlined">psychology</span>
          <h3>Ciao! Come posso aiutarti?</h3>
          <p>Fai una domanda o usa i suggerimenti qui sotto</p>
        </div>

        <!-- Quick Suggestions -->
        <div class="ai-quick-suggestions" id="ai-quick-suggestions">
          <button class="ai-suggestion-btn" data-prompt="Suggerisci attività per la prossima lezione">
            <span class="material-symbols-outlined">lightbulb</span>
            Suggerisci attività
          </button>
          <button class="ai-suggestion-btn" data-prompt="Aiutami a pianificare la settimana">
            <span class="material-symbols-outlined">calendar_month</span>
            Pianifica settimana
          </button>
          <button class="ai-suggestion-btn" data-prompt="Genera domande di verifica">
            <span class="material-symbols-outlined">quiz</span>
            Genera quiz
          </button>
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
              aria-label="Messaggio per l'assistente"
            ></textarea>
          </div>
          
          <div class="ai-input-actions">
            <button 
              id="ai-voice-btn" 
              class="ai-voice-btn" 
              aria-label="Attiva registrazione vocale"
              title="Registrazione vocale (mock)"
            >
              <span class="material-symbols-outlined">mic</span>
            </button>
            <button 
              id="ai-send-btn" 
              class="ai-send-btn" 
              aria-label="Invia messaggio"
              title="Invia"
            >
              <span class="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.panel);
  }

  /**
   * Setup focus trap for accessibility
   */
  setupFocusTrap() {
    if (!this.panel) return;

    const focusableElements = this.panel.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length > 0) {
      this.firstFocusableElement = focusableElements[0];
      this.lastFocusableElement = focusableElements[focusableElements.length - 1];
    }
  }

  /**
   * Handle focus trap on Tab key
   */
  handleFocusTrap(e) {
    if (!this.isOpen) return;

    if (e.key === 'Tab') {
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === this.firstFocusableElement) {
          e.preventDefault();
          this.lastFocusableElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === this.lastFocusableElement) {
          e.preventDefault();
          this.firstFocusableElement?.focus();
        }
      }
    } else if (e.key === 'Escape') {
      this.close();
    }
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Close button
    const closeBtn = this.panel?.querySelector('.ai-assistant-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    // Backdrop click to close
    if (this.backdrop) {
      this.backdrop.addEventListener('click', () => this.close());
    }

    // Send button
    const sendBtn = document.getElementById('ai-send-btn');
    if (sendBtn) {
      sendBtn.addEventListener('click', () => this.sendMessage());
    }

    // Voice button
    const voiceBtn = document.getElementById('ai-voice-btn');
    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => this.toggleRecording());
    }

    // Text input - Enter to send
    const textInput = document.getElementById('ai-text-input');
    if (textInput) {
      textInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });

      // Auto-resize textarea
      textInput.addEventListener('input', () => {
        textInput.style.height = 'auto';
        textInput.style.height = textInput.scrollHeight + 'px';
      });
    }

    // Quick suggestion buttons
    const suggestionBtns = document.querySelectorAll('.ai-suggestion-btn');
    suggestionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const prompt = btn.dataset.prompt;
        if (prompt) {
          this.sendMessage(prompt);
        }
      });
    });

    // Focus trap
    document.addEventListener('keydown', (e) => this.handleFocusTrap(e));

    // Listen for floating assistant button clicks
    document.addEventListener('click', (e) => {
      if (e.target.closest('#floating-ai-btn, .floating-assistant-trigger')) {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  /**
   * Open the assistant panel
   */
  open() {
    if (this.isOpen) return;

    this.isOpen = true;
    this.previouslyFocusedElement = document.activeElement;

    this.panel?.classList.add('open');
    this.backdrop?.classList.add('visible');

    // Set aria attributes
    this.panel?.setAttribute('aria-hidden', 'false');
    this.backdrop?.setAttribute('aria-hidden', 'false');

    // Focus first focusable element
    setTimeout(() => {
      this.firstFocusableElement?.focus();
    }, 100);

    // Announce to screen readers
    this.announce('Assistente IA aperto');

    console.log('Floating assistant opened');
  }

  /**
   * Close the assistant panel
   */
  close() {
    if (!this.isOpen) return;

    this.isOpen = false;

    this.panel?.classList.remove('open');
    this.backdrop?.classList.remove('visible');

    // Set aria attributes
    this.panel?.setAttribute('aria-hidden', 'true');
    this.backdrop?.setAttribute('aria-hidden', 'true');

    // Restore focus
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus();
      this.previouslyFocusedElement = null;
    }

    // Announce to screen readers
    this.announce('Assistente IA chiuso');

    console.log('Floating assistant closed');
  }

  /**
   * Toggle the assistant panel
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Announce message to screen readers via aria-live
   */
  announce(message) {
    const liveRegion = document.getElementById('ai-live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
      // Clear after announcement
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  }

  /**
   * Send a message
   */
  async sendMessage(messageText = null) {
    const textInput = document.getElementById('ai-text-input');
    const text = messageText || textInput?.value.trim();

    if (!text) return;

    // Add user message
    this.addMessage({
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    });

    // Clear input
    if (textInput) {
      textInput.value = '';
      textInput.style.height = 'auto';
    }

    // Hide empty state
    this.hideEmptyState();

    // Announce to screen readers
    this.announce('Messaggio inviato');

    // Mock AI response (MOCK_AI flag)
    if (MOCK_AI) {
      setTimeout(() => {
        this.addMessage({
          role: 'assistant',
          content: this.getMockResponse(text),
          timestamp: new Date().toISOString()
        });
        this.announce('Risposta ricevuta');
      }, 1000);
    } else {
      // TODO: Call actual AI API when available
      console.log('AI API call would go here');
    }
  }

  /**
   * Get mock AI response (for testing)
   */
  getMockResponse(userMessage) {
    const responses = [
      'Certo! Posso aiutarti con questo. Ecco alcuni suggerimenti basati sulla tua richiesta.',
      'Ottima domanda! Basandomi sulla tua situazione, ti consiglio di considerare questi aspetti.',
      'Ho capito. Per rispondere alla tua richiesta, ecco cosa ti propongo.',
      'Interessante! Ecco alcune idee che potrebbero esserti utili.'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  /**
   * Add a message to the conversation
   */
  addMessage(message) {
    this.messages.push(message);
    this.renderMessage(message);
    this.saveMessages();
    this.scrollToBottom();
  }

  /**
   * Render a single message
   */
  renderMessage(message) {
    const container = document.getElementById('ai-messages-container');
    if (!container) return;

    const messageElement = document.createElement('div');
    messageElement.className = `ai-message ai-message-${message.role}`;
    messageElement.setAttribute('role', 'article');
    messageElement.setAttribute('aria-label', `${message.role === 'user' ? 'Tuo messaggio' : 'Risposta assistente'}`);

    const time = new Date(message.timestamp).toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit'
    });

    messageElement.innerHTML = `
      <div class="ai-message-avatar">
        <span class="material-symbols-outlined">
          ${message.role === 'user' ? 'person' : 'smart_toy'}
        </span>
      </div>
      <div class="ai-message-content">
        <div class="ai-message-text">${message.content}</div>
        <div class="ai-message-time">${time}</div>
      </div>
    `;

    container.appendChild(messageElement);
  }

  /**
   * Toggle voice recording (mock)
   */
  toggleRecording() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }

  /**
   * Start voice recording (mock)
   */
  startRecording() {
    if (!MOCK_AI) {
      console.log('Real voice recording would start here');
      return;
    }

    this.isRecording = true;
    this.recordingStartTime = Date.now();

    const recordingStatus = document.getElementById('ai-recording-status');
    const voiceBtn = document.getElementById('ai-voice-btn');

    if (recordingStatus) {
      recordingStatus.classList.add('active');
    }

    if (voiceBtn) {
      voiceBtn.classList.add('recording');
      voiceBtn.setAttribute('aria-label', 'Ferma registrazione vocale');
    }

    // Update timer
    this.recordingTimer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.recordingStartTime) / 1000);
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      const timeElement = document.getElementById('ai-recording-time');
      if (timeElement) {
        timeElement.textContent = `${minutes}:${String(seconds).padStart(2, '0')}`;
      }
    }, 1000);

    this.announce('Registrazione vocale avviata');
    console.log('Mock recording started');
  }

  /**
   * Stop voice recording (mock)
   */
  stopRecording() {
    this.isRecording = false;

    const recordingStatus = document.getElementById('ai-recording-status');
    const voiceBtn = document.getElementById('ai-voice-btn');

    if (recordingStatus) {
      recordingStatus.classList.remove('active');
    }

    if (voiceBtn) {
      voiceBtn.classList.remove('recording');
      voiceBtn.setAttribute('aria-label', 'Attiva registrazione vocale');
    }

    if (this.recordingTimer) {
      clearInterval(this.recordingTimer);
      this.recordingTimer = null;
    }

    // Mock: Add recorded message
    if (MOCK_AI) {
      const mockTranscription = 'Questo è un messaggio di esempio trascritto dalla registrazione vocale mock.';
      this.sendMessage(mockTranscription);
    }

    this.announce('Registrazione vocale terminata');
    console.log('Mock recording stopped');
  }

  /**
   * Hide empty state
   */
  hideEmptyState() {
    const emptyState = document.getElementById('ai-empty-state');
    const suggestions = document.getElementById('ai-quick-suggestions');
    
    if (emptyState) {
      emptyState.style.display = 'none';
    }
    if (suggestions) {
      suggestions.style.display = 'none';
    }
  }

  /**
   * Scroll messages container to bottom
   */
  scrollToBottom() {
    const container = document.getElementById('ai-messages-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  /**
   * Load messages from localStorage
   */
  loadMessages() {
    try {
      const stored = localStorage.getItem('ai-assistant-messages');
      if (stored) {
        this.messages = JSON.parse(stored);
        this.messages.forEach(msg => this.renderMessage(msg));
        if (this.messages.length > 0) {
          this.hideEmptyState();
        }
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }

  /**
   * Save messages to localStorage
   */
  saveMessages() {
    try {
      localStorage.setItem('ai-assistant-messages', JSON.stringify(this.messages));
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  }

  /**
   * Clear all messages
   */
  clearMessages() {
    this.messages = [];
    const container = document.getElementById('ai-messages-container');
    if (container) {
      container.innerHTML = '';
    }
    localStorage.removeItem('ai-assistant-messages');
    
    // Show empty state again
    const emptyState = document.getElementById('ai-empty-state');
    const suggestions = document.getElementById('ai-quick-suggestions');
    if (emptyState) emptyState.style.display = 'block';
    if (suggestions) suggestions.style.display = 'flex';
  }
}

// Export singleton instance
export const floatingAssistantUI = new FloatingAssistantUI();

// Auto-initialize if DOM is ready
if (typeof window !== 'undefined' && document.readyState !== 'loading') {
  floatingAssistantUI.init();
} else if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    floatingAssistantUI.init();
  });
}
