/**
 * Floating AI Assistant - JavaScript Module
 * Responsive panel with voice input and mock AI responses
 * Implements focus trap and aria-live regions for accessibility
 */

/**
 * Floating Assistant Manager
 * Handles panel open/close, voice recording, and mock AI responses
 */
class FloatingAssistantManager {
  constructor() {
    this.isOpen = false;
    this.isRecording = false;
    this.responses = [];
    this.focusableElements = [];
    this.lastFocusedElement = null;
    
    // Feature flag for mock vs real integration
    this.MOCK_AI = true; // TODO: Set to false when integrating real AI API
    
    // Elements
    this.fab = null;
    this.overlay = null;
    this.panel = null;
    this.closeBtn = null;
    this.inputField = null;
    this.micBtn = null;
    this.sendBtn = null;
    this.responsesContainer = null;
    this.liveRegion = null;
    
    // MediaRecorder for voice input
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  /**
   * Initialize the floating assistant
   */
  init() {
    this.createElements();
    this.attachEventListeners();
    console.log('Floating Assistant initialized');
  }

  /**
   * Create DOM elements for the assistant
   */
  createElements() {
    // Create FAB
    this.fab = document.createElement('button');
    this.fab.id = 'floating-assistant-fab';
    this.fab.className = 'floating-assistant__fab';
    this.fab.setAttribute('aria-label', 'Apri Assistente IA');
    this.fab.innerHTML = '<span class="material-symbols-outlined floating-assistant__fab-icon">psychology</span>';
    document.body.appendChild(this.fab);

    // Create overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'floating-assistant__overlay';
    this.overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(this.overlay);

    // Create panel
    this.panel = document.createElement('div');
    this.panel.className = 'floating-assistant__panel';
    this.panel.setAttribute('role', 'dialog');
    this.panel.setAttribute('aria-modal', 'true');
    this.panel.setAttribute('aria-labelledby', 'floating-assistant-title');
    
    this.panel.innerHTML = `
      <div class="floating-assistant__header">
        <h2 id="floating-assistant-title" class="floating-assistant__title">Assistente IA</h2>
        <button class="floating-assistant__close" aria-label="Chiudi assistente">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <div class="floating-assistant__body">
        <div class="floating-assistant__responses" id="floating-assistant-responses" aria-live="polite" aria-relevant="additions">
          <div class="floating-assistant__empty">
            <span class="material-symbols-outlined floating-assistant__empty-icon">smart_toy</span>
            <p class="floating-assistant__empty-text">Ciao! Come posso aiutarti oggi?</p>
          </div>
        </div>
        <div class="floating-assistant__input-area">
          <div class="floating-assistant__input-container">
            <div class="floating-assistant__input-wrapper">
              <textarea 
                id="floating-assistant-input" 
                class="floating-assistant__input" 
                placeholder="Scrivi un messaggio o usa il microfono..."
                rows="1"
                aria-label="Messaggio per l'assistente IA"
              ></textarea>
            </div>
            <button 
              id="floating-assistant-mic" 
              class="floating-assistant__mic-btn" 
              aria-label="Registra messaggio vocale"
              title="Registra messaggio vocale"
            >
              <span class="material-symbols-outlined">mic</span>
            </button>
          </div>
        </div>
      </div>
      <div class="sr-only" role="status" aria-live="assertive" id="floating-assistant-live-region"></div>
    `;
    
    document.body.appendChild(this.panel);

    // Get element references
    this.closeBtn = this.panel.querySelector('.floating-assistant__close');
    this.inputField = document.getElementById('floating-assistant-input');
    this.micBtn = document.getElementById('floating-assistant-mic');
    this.sendBtn = document.getElementById('floating-assistant-send');
    this.responsesContainer = document.getElementById('floating-assistant-responses');
    this.liveRegion = document.getElementById('floating-assistant-live-region');
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // FAB click - open panel
    this.fab.addEventListener('click', () => this.open());

    // Close button click
    this.closeBtn.addEventListener('click', () => this.close());

    // Overlay click - close panel
    this.overlay.addEventListener('click', () => this.close());

    // ESC key - close panel
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Mic button - toggle recording
    this.micBtn.addEventListener('click', () => this.toggleRecording());

    // Input field - send on Enter (without Shift)
    this.inputField.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Input changes - auto-resize
    this.inputField.addEventListener('input', () => {
      this.autoResizeInput();
    });
  }

  /**
   * Open the assistant panel
   */
  open() {
    if (this.isOpen) return;

    this.isOpen = true;
    this.lastFocusedElement = document.activeElement;

    // Show overlay and panel
    this.overlay.classList.add('floating-assistant__overlay--active');
    this.panel.classList.add('floating-assistant__panel--active');

    // Set up focus trap
    setTimeout(() => {
      this.setupFocusTrap();
      this.closeBtn.focus();
    }, 100);

    // Announce to screen readers
    this.liveRegion.textContent = 'Assistente IA aperto';
  }

  /**
   * Close the assistant panel
   */
  close() {
    if (!this.isOpen) return;

    this.isOpen = false;

    // Stop recording if active
    if (this.isRecording) {
      this.stopRecording();
    }

    // Hide overlay and panel
    this.overlay.classList.remove('floating-assistant__overlay--active');
    this.panel.classList.remove('floating-assistant__panel--active');

    // Restore focus
    if (this.lastFocusedElement) {
      this.lastFocusedElement.focus();
    }

    // Announce to screen readers
    this.liveRegion.textContent = 'Assistente IA chiuso';
  }

  /**
   * Set up focus trap within the panel
   */
  setupFocusTrap() {
    // Get all focusable elements within the panel
    this.focusableElements = this.panel.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (this.focusableElements.length === 0) return;

    const firstElement = this.focusableElements[0];
    const lastElement = this.focusableElements[this.focusableElements.length - 1];

    // Trap focus within panel
    this.panel.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
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
   */
  async startRecording() {
    try {
      // TODO: Integrate with real speech-to-text API
      // For now, using mock implementation
      
      if (this.MOCK_AI) {
        this.mockStartRecording();
        return;
      }

      // Real implementation (commented out for now)
      /*
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      
      this.audioChunks = [];
      
      this.mediaRecorder.addEventListener('dataavailable', (event) => {
        this.audioChunks.push(event.data);
      });
      
      this.mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.processAudioBlob(audioBlob);
      });
      
      this.mediaRecorder.start();
      this.isRecording = true;
      this.micBtn.classList.add('floating-assistant__mic-btn--recording');
      this.liveRegion.textContent = 'Registrazione in corso';
      */
      
    } catch (error) {
      console.error('Error starting recording:', error);
      this.liveRegion.textContent = 'Errore durante l\'avvio della registrazione';
    }
  }

  /**
   * Mock start recording (for testing)
   */
  mockStartRecording() {
    this.isRecording = true;
    this.micBtn.classList.add('floating-assistant__mic-btn--recording');
    this.micBtn.setAttribute('aria-label', 'Interrompi registrazione');
    this.liveRegion.textContent = 'Registrazione in corso';
    
    // Mock recording indicator
    const recordingTime = document.createElement('span');
    recordingTime.className = 'recording-time';
    recordingTime.textContent = '00:00';
    recordingTime.style.cssText = 'position: absolute; top: -20px; right: 0; font-size: 12px; color: #f44336;';
    this.micBtn.parentElement.style.position = 'relative';
    this.micBtn.parentElement.appendChild(recordingTime);
    
    let seconds = 0;
    this.recordingInterval = setInterval(() => {
      seconds++;
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      recordingTime.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
  }

  /**
   * Stop voice recording
   */
  stopRecording() {
    if (this.MOCK_AI) {
      this.mockStopRecording();
      return;
    }

    // Real implementation
    /*
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
    */
    
    this.isRecording = false;
    this.micBtn.classList.remove('floating-assistant__mic-btn--recording');
    this.micBtn.setAttribute('aria-label', 'Registra messaggio vocale');
    this.liveRegion.textContent = 'Registrazione completata';
  }

  /**
   * Mock stop recording
   */
  mockStopRecording() {
    this.isRecording = false;
    this.micBtn.classList.remove('floating-assistant__mic-btn--recording');
    this.micBtn.setAttribute('aria-label', 'Registra messaggio vocale');
    
    // Clear recording interval
    if (this.recordingInterval) {
      clearInterval(this.recordingInterval);
    }
    
    // Remove recording time indicator
    const recordingTime = this.micBtn.parentElement.querySelector('.recording-time');
    if (recordingTime) {
      recordingTime.remove();
    }
    
    // Mock transcription
    const mockTranscriptions = [
      'Come posso pianificare una lezione efficace?',
      'Suggeriscimi delle attività per la classe terza',
      'Aiutami a creare un piano didattico per questa settimana',
      'Quali sono le migliori strategie per gestire una classe difficile?'
    ];
    
    const transcription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
    this.inputField.value = transcription;
    this.liveRegion.textContent = `Trascrizione: ${transcription}`;
    
    // Auto-send after a short delay
    setTimeout(() => {
      this.sendMessage();
    }, 500);
  }

  /**
   * Process audio blob (for real implementation)
   * TODO: Integrate with speech-to-text API
   */
  async processAudioBlob(audioBlob) {
    // TODO: Send to speech-to-text API
    console.log('Processing audio blob:', audioBlob);
    
    // Mock response
    this.inputField.value = 'Trascrizione del messaggio vocale...';
  }

  /**
   * Send message to AI
   */
  async sendMessage() {
    const message = this.inputField.value.trim();
    
    if (!message) return;

    // Clear input
    this.inputField.value = '';
    this.autoResizeInput();

    // Add user message to responses
    this.addResponse('user', message);

    // Show typing indicator
    const typingId = this.showTypingIndicator();

    // Get AI response
    if (this.MOCK_AI) {
      setTimeout(() => {
        this.removeTypingIndicator(typingId);
        this.getMockAIResponse(message);
      }, 1000 + Math.random() * 1000);
    } else {
      // TODO: Call real AI API
      /*
      try {
        const response = await this.callAIAPI(message);
        this.removeTypingIndicator(typingId);
        this.addResponse('assistant', response);
      } catch (error) {
        console.error('Error calling AI API:', error);
        this.removeTypingIndicator(typingId);
        this.addResponse('assistant', 'Mi dispiace, si è verificato un errore. Riprova più tardi.');
      }
      */
    }
  }

  /**
   * Add a response to the responses area
   */
  addResponse(type, text) {
    // Remove empty state if present
    const emptyState = this.responsesContainer.querySelector('.floating-assistant__empty');
    if (emptyState) {
      emptyState.remove();
    }

    const responseItem = document.createElement('div');
    responseItem.className = 'floating-assistant__response-item';
    
    const label = type === 'user' ? 'Tu' : 'Assistente IA';
    
    responseItem.innerHTML = `
      <div class="floating-assistant__response-label">${label}</div>
      <div class="floating-assistant__response-text">${this.escapeHtml(text)}</div>
    `;
    
    this.responsesContainer.appendChild(responseItem);
    
    // Scroll to bottom
    this.responsesContainer.scrollTop = this.responsesContainer.scrollHeight;
    
    // Announce to screen readers
    this.liveRegion.textContent = `${label}: ${text}`;
    
    this.responses.push({ type, text, timestamp: new Date() });
  }

  /**
   * Show typing indicator
   */
  showTypingIndicator() {
    const typingId = 'typing-' + Date.now();
    const typing = document.createElement('div');
    typing.id = typingId;
    typing.className = 'floating-assistant__response-item';
    typing.innerHTML = `
      <div class="floating-assistant__response-label">Assistente IA</div>
      <div class="floating-assistant__response-text">
        <span style="opacity: 0.5;">Sta scrivendo...</span>
      </div>
    `;
    
    this.responsesContainer.appendChild(typing);
    this.responsesContainer.scrollTop = this.responsesContainer.scrollHeight;
    
    return typingId;
  }

  /**
   * Remove typing indicator
   */
  removeTypingIndicator(typingId) {
    const typing = document.getElementById(typingId);
    if (typing) {
      typing.remove();
    }
  }

  /**
   * Get mock AI response
   */
  getMockAIResponse(userMessage) {
    const mockResponses = [
      'Ottima domanda! Per pianificare una lezione efficace, ti consiglio di seguire questi passaggi:\n1. Definisci gli obiettivi di apprendimento\n2. Prepara attività coinvolgenti\n3. Prevedi momenti di verifica\n4. Lascia spazio per domande e discussioni',
      'Ecco alcuni suggerimenti personalizzati basati sul tuo contesto:\n• Usa metodologie attive come il problem-based learning\n• Integra strumenti digitali per rendere la lezione più interattiva\n• Pianifica pause strategiche per mantenere l\'attenzione',
      'Ho analizzato i tuoi dati e posso suggerirti:\n• Focalizzati su attività collaborative per migliorare l\'engagement\n• Considera di utilizzare materiali multimediali\n• Prevedi momenti di feedback immediato',
      'Perfetto! Posso aiutarti a creare un piano didattico. Quali sono gli argomenti principali che vuoi trattare questa settimana?'
    ];
    
    const response = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    this.addResponse('assistant', response);
  }

  /**
   * Call real AI API
   * TODO: Implement real API integration
   */
  async callAIAPI(message) {
    // TODO: Replace with real API call
    /*
    const response = await fetch('https://api.your-ai-service.com/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY'
      },
      body: JSON.stringify({
        message: message,
        context: this.getContext()
      })
    });
    
    const data = await response.json();
    return data.response;
    */
    
    throw new Error('Real AI API not implemented yet');
  }

  /**
   * Get context for AI (current page, user data, etc.)
   */
  getContext() {
    return {
      page: window.location.pathname,
      timestamp: new Date().toISOString(),
      // Add more context as needed
    };
  }

  /**
   * Auto-resize input field
   */
  autoResizeInput() {
    this.inputField.style.height = 'auto';
    this.inputField.style.height = Math.min(this.inputField.scrollHeight, 120) + 'px';
  }

  /**
   * Escape HTML
   */
  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML.replace(/\n/g, '<br>');
  }
}

// Export singleton instance
let floatingAssistantInstance = null;

/**
 * Initialize floating assistant
 */
export function initFloatingAssistant() {
  if (!floatingAssistantInstance) {
    floatingAssistantInstance = new FloatingAssistantManager();
    floatingAssistantInstance.init();
  }
  return floatingAssistantInstance;
}

/**
 * Get floating assistant instance
 */
export function getFloatingAssistant() {
  return floatingAssistantInstance;
}

// Make available globally
if (typeof window !== 'undefined') {
  window.FloatingAssistantManager = FloatingAssistantManager;
  window.initFloatingAssistant = initFloatingAssistant;
  window.getFloatingAssistant = getFloatingAssistant;
}
