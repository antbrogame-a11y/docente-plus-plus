
// Logica per la pagina delle Impostazioni (settings.html)

const setupSettingsPage = () => {
    // --- ELEMENTI DEL DOM ---
    const apiKeyInput = document.getElementById('or-api-key');
    const modelNameInput = document.getElementById('or-model-name');
    const saveBtn = document.getElementById('save-settings-btn');
    const clearBtn = document.getElementById('clear-settings-btn');
    const feedbackDiv = document.getElementById('settings-feedback');

    // --- FUNZIONI ---

    // Carica le impostazioni salvate all'avvio della pagina
    const loadSavedSettings = () => {
        const apiKey = localStorage.getItem('or_api_key');
        const modelName = localStorage.getItem('or_model_name');
        if (apiKey) apiKeyInput.value = apiKey;
        if (modelName) modelNameInput.value = modelName;
        console.log("Impostazioni IA caricate dal localStorage.");
    };

    // Funzione per testare la chiave API e il modello, poi salvare
    const handleTestAndSave = async () => {
        const apiKey = apiKeyInput.value.trim();
        const modelName = modelNameInput.value.trim();

        if (!apiKey || !modelName) {
            showFeedback('Compila entrambi i campi: API Key e Modello IA.', 'error');
            return;
        }

        saveBtn.disabled = true;
        saveBtn.innerHTML = '<span class="spinner"></span> Test in corso...';
        showFeedback('Verifica delle credenziali in corso...', 'info');

        try {
            // OpenRouter usa l'endpoint di OpenAI per la compatibilità. 
            // Eseguiamo una chiamata a basso costo (es. recupero modelli) per validare la chiave.
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "model": modelName,
                    "messages": [{"role": "user", "content": "Ciao!"}],
                    "max_tokens": 5 // Minimo indispensabile per il test
                })
            });

            const data = await response.json();

            if (response.ok) {
                // La chiave e il modello sono validi
                localStorage.setItem('or_api_key', apiKey);
                localStorage.setItem('or_model_name', modelName);
                showFeedback(`Test superato con successo! Impostazioni salvate per il modello: ${modelName}.`, 'success');
            } else {
                // Errore dall'API (chiave non valida, modello non trovato, etc.)
                const errorMessage = data.error?.message || `Errore ${response.status}: ${response.statusText}`;
                showFeedback(`Test fallito: ${errorMessage}`, 'error');
            }

        } catch (error) {
            console.error("Errore di rete durante il test delle impostazioni:", error);
            showFeedback('Test fallito: impossibile contattare i server di OpenRouter. Controlla la tua connessione.', 'error');
        } finally {
            saveBtn.disabled = false;
            saveBtn.innerHTML = '<span class="material-symbols-outlined">save</span> Testa e Salva';
        }
    };

    // Rimuove le impostazioni dal localStorage
    const handleClearSettings = () => {
        localStorage.removeItem('or_api_key');
        localStorage.removeItem('or_model_name');
        apiKeyInput.value = '';
        modelNameInput.value = '';
        showFeedback('Impostazioni IA rimosse con successo.', 'info');
        console.log("Impostazioni IA cancellate.");
    };

    // Mostra un messaggio di feedback all'utente
    const showFeedback = (message, type = 'info') => {
        feedbackDiv.innerHTML = `<p class="${type}">${message}</p>`;
    };

    // --- AGGANCIO EVENTI ---
    saveBtn.addEventListener('click', handleTestAndSave);
    clearBtn.addEventListener('click', handleClearSettings);

    // --- INIZIALIZZAZIONE ---
    loadSavedSettings();
    console.log("Pagina Impostazioni configurata.");
};
