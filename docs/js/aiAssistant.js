
import { getVertexAI, getGenerativeModel } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-vertexai.js";

export const setupAIAssistant = () => {
    const aiResponseDiv = document.getElementById('ai-response');
    const queryInput = document.getElementById('ai-query');
    const sendQueryBtn = document.getElementById('send-ai-query');

    if (!aiResponseDiv || !queryInput || !sendQueryBtn) {
        console.error("Elementi dell'Assistente IA non trovati. Inizializzazione interrotta.");
        return;
    }

    const vertex = getVertexAI();
    const model = getGenerativeModel({ model: "gemini-pro" });

    const sendQuery = async () => {
        const query = queryInput.value.trim();
        if (!query) return;

        sendQueryBtn.disabled = true;
        aiResponseDiv.innerHTML = '<p>In elaborazione...</p>';

        try {
            const result = await model.generateContent(query);
            const response = await result.response;
            const text = await response.text();
            aiResponseDiv.innerHTML = `<p>${text}</p>`;
        } catch (error) {
            console.error("Errore durante la generazione dei contenuti:", error);
            aiResponseDiv.innerHTML = '<p style="color: red;">Si è verificato un errore. Controlla la console per i dettagli.</p>';
        }

        sendQueryBtn.disabled = false;
    };

    sendQueryBtn.addEventListener('click', sendQuery);

    // Funzione di cleanup
    return () => {
        sendQueryBtn.removeEventListener('click', sendQuery);
    };
};
