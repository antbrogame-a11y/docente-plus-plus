
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Controlla che firebaseConfig sia stato caricato
        if (typeof firebaseConfig === 'undefined') {
            console.error("Errore: La configurazione di Firebase (firebaseConfig) non è stata trovata. Assicurati che il file 'firebase-config.js' sia caricato correttamente prima di 'firebase-init.js'.");
            return;
        }

        // Inizializza Firebase
        const app = firebase.initializeApp(firebaseConfig);
        console.log("Firebase inizializzato con successo.");

        // Rende disponibili globalmente le istanze di Firebase necessarie
        window.firebaseApp = app;
        window.db = firebase.firestore();
        console.log("Istanza di Firestore pronta.");

        // --- NUOVA AGGIUNTA: INIZIALIZZAZIONE DI VERTEX AI (GEMINI) ---
        try {
            const vertex = firebase.vertexAI();
            // Impostazioni per il modello
            const generationConfig = {
                maxOutputTokens: 2048,
                temperature: 0.4,
                topP: 0.95,
                topK: 40
            };
            // Crea e rende disponibile globalmente il modello
            window.model = vertex.getGenerativeModel({ 
                model: 'gemini-1.0-pro-vision-latest',
                generationConfig
            });
            console.log("Modello AI (Gemini) inizializzato con successo.");
        } catch (e) {
            console.error("Errore durante l'inizializzazione di Vertex AI:", e);
        }
        // --- FINE NUOVA AGGIUNTA ---

        // Controlla che la funzione setupAuth esista prima di chiamarla
        if (typeof window.setupAuth === 'function') {
            // Avvia la configurazione dell'autenticazione
            window.setupAuth(app);
            console.log("Setup dell'autenticazione avviato.");
        } else {
            console.error("Errore: La funzione setupAuth non è stata trovata. Assicurati che 'auth.js' sia caricato correttamente.");
        }

    } catch (error) {
        console.error("Errore critico durante l'inizializzazione di Firebase:", error);
    }
});
