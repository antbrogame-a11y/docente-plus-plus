/**
 * Floating AI Assistant - JavaScript Module
 * Provides conversational AI interface with voice input support
 * 
 * Features:
 * - Mobile full-screen modal / Desktop right drawer
 * - Text input with send button
 * - Voice recording with mock transcription
 * - Mock AI responses
 * - Accessibility: focus trap, aria-modal, aria-live
 * - ESC key to close
 * 
 * TODO: Integration points for real AI
 * - Replace MOCK_AI flag with real API integration
 * - Implement real speech-to-text (e.g., Web Speech API or external service)
 * - Connect to OpenRouter or other AI service for responses
 */

// Mock AI flag - set to false when integrating real AI
const MOCK_AI = true;

// State
let isRecording = false;
let mediaRecorder = null;
let audioChunks = [];
let conversationHistory = [];

/**
 * Initialize Floating AI Assistant
 */
export function initFloatingAssistant() {
    const fab = document.getElementById('ai-fab');
    const panel = document.getElementById('ai-assistant-panel');
    const backdrop = document.getElementById('ai-assistant-backdrop');
    const closeBtn = document.getElementById('ai-assistant-close');
    const sendBtn = document.getElementById('ai-send-button');
    const micBtn = document.getElementById('ai-mic-button');
    const textInput = document.getElementById('ai-text-input');
    
    if (!fab || !panel) {
        console.warn('Floating AI Assistant elements not found');
        return;
    }
    
    // FAB click - open panel
    fab.addEventListener('click', openPanel);
    
    // Close button
    closeBtn?.addEventListener('click', closePanel);
    
    // Backdrop click (mobile)
    backdrop?.addEventListener('click', closePanel);
    
    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && panel.classList.contains('open')) {
            closePanel();
        }
    });
    
    // Send button
    sendBtn?.addEventListener('click', handleSendMessage);
    
    // Enter key in text input
    textInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });
    
    // Microphone button
    micBtn?.addEventListener('click', handleMicClick);
}

/**
 * Open AI Assistant Panel
 */
function openPanel() {
    const panel = document.getElementById('ai-assistant-panel');
    const backdrop = document.getElementById('ai-assistant-backdrop');
    
    if (!panel) return;
    
    panel.classList.add('open');
    backdrop?.classList.add('open');
    
    // Set aria-modal and focus trap
    panel.setAttribute('aria-modal', 'true');
    
    // Focus first input
    const textInput = document.getElementById('ai-text-input');
    setTimeout(() => textInput?.focus(), 100);
    
    // Trap focus within panel
    setupFocusTrap(panel);
}

/**
 * Close AI Assistant Panel
 */
function closePanel() {
    const panel = document.getElementById('ai-assistant-panel');
    const backdrop = document.getElementById('ai-assistant-backdrop');
    const fab = document.getElementById('ai-fab');
    
    if (!panel) return;
    
    panel.classList.remove('open');
    backdrop?.classList.remove('open');
    
    // Remove aria-modal
    panel.removeAttribute('aria-modal');
    
    // Stop recording if active
    if (isRecording) {
        stopRecording();
    }
    
    // Return focus to FAB
    fab?.focus();
}

/**
 * Setup focus trap within panel
 * @param {HTMLElement} panel - Panel element
 */
function setupFocusTrap(panel) {
    const focusableElements = panel.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleTabKey = (e) => {
        if (e.key !== 'Tab') return;
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    };
    
    panel.addEventListener('keydown', handleTabKey);
}

/**
 * Handle send message
 */
async function handleSendMessage() {
    const textInput = document.getElementById('ai-text-input');
    const message = textInput?.value.trim();
    
    if (!message) return;
    
    // Add user message to UI
    addMessageToUI('user', message);
    
    // Clear input
    textInput.value = '';
    
    // Add to conversation history
    conversationHistory.push({
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
    });
    
    // Get AI response
    const response = await getAIResponse(message);
    
    // Add AI response to UI
    addMessageToUI('assistant', response);
    
    // Add to conversation history
    conversationHistory.push({
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
    });
    
    // Announce to screen readers
    announceToScreenReader(response);
}

/**
 * Get AI response
 * @param {string} message - User message
 * @returns {Promise<string>} AI response
 */
async function getAIResponse(message) {
    if (MOCK_AI) {
        // Mock AI response
        return getMockAIResponse(message);
    } else {
        // TODO: Real AI integration
        // Example:
        // const response = await fetch('/api/ai/chat', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         message,
        //         history: conversationHistory
        //     })
        // });
        // const data = await response.json();
        // return data.response;
        
        return 'AI integration not yet configured. Please set MOCK_AI to true or configure API endpoints.';
    }
}

/**
 * Get mock AI response
 * @param {string} message - User message
 * @returns {string} Mock response
 */
function getMockAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Simple keyword-based mock responses
    if (lowerMessage.includes('lezione') || lowerMessage.includes('lesson')) {
        return 'Ecco alcuni suggerimenti per pianificare la tua lezione: 1) Definisci obiettivi chiari, 2) Prepara materiali interattivi, 3) Includi momenti di verifica.';
    } else if (lowerMessage.includes('studente') || lowerMessage.includes('student')) {
        return 'Per gestire al meglio i tuoi studenti, ti consiglio di: 1) Tenere traccia dei progressi individuali, 2) Fornire feedback costruttivo, 3) Adattare il metodo di insegnamento alle esigenze della classe.';
    } else if (lowerMessage.includes('valutazione') || lowerMessage.includes('evaluation')) {
        return 'Le valutazioni dovrebbero essere: 1) Chiare e trasparenti, 2) Basate su criteri oggettivi, 3) Accompagnate da feedback costruttivo per aiutare gli studenti a migliorare.';
    } else if (lowerMessage.includes('ciao') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        return 'Ciao! Sono il tuo assistente IA. Come posso aiutarti oggi con la gestione della tua classe?';
    } else {
        return `Ho ricevuto la tua richiesta: "${message}". Questa è una risposta simulata. Per funzionalità complete, configura l'integrazione con un servizio AI reale.`;
    }
}

/**
 * Add message to UI
 * @param {string} role - 'user' or 'assistant'
 * @param {string} content - Message content
 */
function addMessageToUI(role, content) {
    const responsesArea = document.getElementById('ai-responses-area');
    if (!responsesArea) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-response-item ${role}`;
    
    const label = role === 'user' ? '👤 Tu' : '🤖 Assistente IA';
    const time = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        <div class="ai-response-label">${label} • ${time}</div>
        <div class="ai-response-text">${escapeHtml(content)}</div>
    `;
    
    responsesArea.appendChild(messageDiv);
    
    // Scroll to bottom
    responsesArea.scrollTop = responsesArea.scrollHeight;
}

/**
 * Announce message to screen readers
 * @param {string} message - Message to announce
 */
function announceToScreenReader(message) {
    const liveRegion = document.getElementById('ai-live-region');
    if (!liveRegion) return;
    
    liveRegion.textContent = `Assistente IA risponde: ${message}`;
    
    // Clear after a delay
    setTimeout(() => {
        liveRegion.textContent = '';
    }, 1000);
}

/**
 * Handle microphone button click
 */
function handleMicClick() {
    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
}

/**
 * Start voice recording
 */
async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        
        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };
        
        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            
            // Mock transcription
            const transcription = await transcribeAudio(audioBlob);
            
            // Add transcription to input
            const textInput = document.getElementById('ai-text-input');
            if (textInput) {
                textInput.value = transcription;
                textInput.focus();
            }
            
            // Stop all tracks
            stream.getTracks().forEach(track => track.stop());
        };
        
        mediaRecorder.start();
        isRecording = true;
        
        // Update UI
        const micBtn = document.getElementById('ai-mic-button');
        const recordingStatus = document.getElementById('ai-recording-status');
        
        micBtn?.classList.add('recording');
        recordingStatus?.classList.add('active');
        
    } catch (error) {
        console.error('Error accessing microphone:', error);
        alert('Impossibile accedere al microfono. Verifica le autorizzazioni del browser.');
    }
}

/**
 * Stop voice recording
 */
function stopRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        
        // Update UI
        const micBtn = document.getElementById('ai-mic-button');
        const recordingStatus = document.getElementById('ai-recording-status');
        
        micBtn?.classList.remove('recording');
        recordingStatus?.classList.remove('active');
    }
}

/**
 * Transcribe audio (mock implementation)
 * @param {Blob} audioBlob - Audio blob to transcribe
 * @returns {Promise<string>} Transcription
 */
async function transcribeAudio(audioBlob) {
    if (MOCK_AI) {
        // Mock transcription
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return 'Questa è una trascrizione simulata del tuo messaggio vocale. Configura un servizio di speech-to-text reale per la trascrizione effettiva.';
    } else {
        // TODO: Real speech-to-text integration
        // Example:
        // const formData = new FormData();
        // formData.append('audio', audioBlob);
        // const response = await fetch('/api/speech-to-text', {
        //     method: 'POST',
        //     body: formData
        // });
        // const data = await response.json();
        // return data.transcription;
        
        return 'Speech-to-text not configured.';
    }
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFloatingAssistant);
} else {
    initFloatingAssistant();
}

// Export for use in other modules
export { openPanel as openFloatingAssistant, closePanel as closeFloatingAssistant };
