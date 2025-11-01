
// Funzione di setup per la sezione Assistente AI, caricata dinamicamente.
const setupAiAssistant = () => {

    // Tenta di accedere agli oggetti globali di Firebase/Vertex
    if (typeof model === 'undefined') {
        console.error('Il modello AI (Gemini) non è inizializzato. Controlla la configurazione di Firebase in app.js.');
        // Opzionalmente, mostra un messaggio di errore all'utente nell'interfaccia.
        const chatWindow = document.getElementById('ai-chat-window');
        if (chatWindow) {
            chatWindow.innerHTML = '<div class="chat-message ai-error-message">Impossibile comunicare con l\'assistente AI. La configurazione di Firebase non è stata caricata correttamente.</div>';
        }
        return;
    }

    // --- ELEMENTI DEL DOM ---
    const chatWindow = document.getElementById('ai-chat-window');
    const inputForm = document.getElementById('ai-input-form');
    const promptInput = document.getElementById('ai-prompt-input');
    const suggestionButtons = document.querySelectorAll('.btn-suggestion');

    // --- FUNZIONI ---

    const addMessageToChat = (message, sender) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message chat-message-${sender}`;
        
        // Semplice parsing per grassetto e liste
        let formattedMessage = message.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>');
        formattedMessage = formattedMessage.replace(/\* (.*)/g, '<ul><li>$1</li></ul>').replace(/<li>(.*)\n/g, '<li>$1</li>');

        messageDiv.innerHTML = `<p>${formattedMessage}</p>`;
        chatWindow.appendChild(messageDiv);

        // Scrolla fino in fondo alla finestra della chat
        chatWindow.scrollTop = chatWindow.scrollHeight;
    };

    const sendPrompt = async (e) => {
        e.preventDefault();
        const promptText = promptInput.value.trim();
        if (!promptText) return;

        addMessageToChat(promptText, 'user');
        promptInput.value = '';

        // Mostra l'indicatore di "sta pensando"
        const thinkingIndicator = document.createElement('div');
        thinkingIndicator.className = 'chat-message chat-message-ai thinking';
        thinkingIndicator.innerHTML = '<p>...</p>';
        chatWindow.appendChild(thinkingIndicator);
        chatWindow.scrollTop = chatWindow.scrollHeight;

        try {
            const result = await model.generateContent(promptText);
            const response = await result.response;
            const text = await response.text();

            // Rimuovi l'indicatore e aggiungi la risposta
            chatWindow.removeChild(thinkingIndicator);
            addMessageToChat(text, 'ai');

        } catch (error) {
            console.error("Errore durante la generazione dei contenuti dall'IA:", error);
            chatWindow.removeChild(thinkingIndicator);
            addMessageToChat('Spiacente, si è verificato un errore. Riprova più tardi.', 'ai-error-message');
        }
    };
    
    // --- EVENT LISTENER ---
    inputForm.addEventListener('submit', sendPrompt);

    suggestionButtons.forEach(button => {
        button.addEventListener('click', () => {
            promptInput.value = button.textContent;
            promptInput.focus();
        });
    });

};