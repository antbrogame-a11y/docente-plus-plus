
import { getGenerativeModel } from "./firebase.js";

// Funzione per mostrare un loader specifico per l'IA
const showAILoader = (message) => {
    const loader = document.createElement('div');
    loader.id = 'ai-loader';
    loader.className = 'ai-loader';
    loader.innerHTML = `
        <div class="ai-loader-content">
            <div class="spinner"></div>
            <p>${message}</p>
        </div>`;
    document.body.appendChild(loader);
};

// Funzione per nascondere il loader
const hideAILoader = () => {
    const loader = document.getElementById('ai-loader');
    if (loader) {
        loader.remove();
    }
};

export const generateLessonPlan = async (topic, className, classDescription) => {
    if (!topic) {
        alert("Per favore, fornisci un argomento per la lezione.");
        return null;
    }

    showAILoader(`Sto generando un piano di lezione per "${topic}"...`);

    try {
        const model = getGenerativeModel();
        const prompt = `
            Sei un assistente per un docente di scuola superiore in Italia.
            Il tuo compito è creare un piano di lezione strutturato e conciso.

            **Contesto:**
            - **Classe:** ${className || 'non specificata'}
            - **Descrizione della classe:** ${classDescription || 'non specificata'}
            - **Argomento richiesto:** ${topic}

            **Formato di Output (JSON):**
            Crea una risposta in formato JSON con due chiavi principali: "lessonTopic" e "suggestedAssignments".

            1.  **"lessonTopic"**: Un testo che descriva l'argomento della lezione in modo dettagliato ma schematico. Organizza il contenuto in sezioni chiare usando la sintassi Markdown. Ad esempio:
                - Introduzione (breve e coinvolgente)
                - Corpo Principale (diviso in 2-3 sotto-punti chiave con spiegazioni)
                - Conclusione (riepilogo e possibili collegamenti futuri)

            2.  **"suggestedAssignments"**: Un testo che elenchi 2-3 compiti o attività pratiche correlate alla lezione. Sii specifico e creativo. Esempio: "Ricerca e presentazione su...", "Risolvere gli esercizi a pagina...", "Scrivere un breve saggio su...".

            **Esempio di output JSON atteso:**
            {
              "lessonTopic": "### Introduzione alla Seconda Guerra Mondiale\n- Contesto storico e cause principali (Trattato di Versailles, crisi del '29).\n### Fasi chiave del conflitto\n- L'ascesa dell'Asse e le prime campagne (1939-1941).\n- La globalizzazione del conflitto (Pearl Harbor, Stalingrado).\n- La controffensiva Alleata e la fine della guerra (D-Day, caduta di Berlino).\n### Conclusioni\n- Eredità della guerra e la nascita dell'ONU.",
              "suggestedAssignments": "- Creare una timeline interattiva degli eventi principali del 1941.\n- Leggere l'approfondimento a pag. 85 sul ruolo della propaganda.\n- Scrivere un breve testo di riflessione sulle conseguenze civili del conflitto."
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Pulisce e fa il parse del JSON dalla risposta
        const jsonString = text.replace(/```json|```/g, '').trim();
        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Errore durante la generazione della lezione con IA:", error);
        alert("Si è verificato un errore durante la generazione della lezione. Controlla la console per maggiori dettagli.");
        return null;
    } finally {
        hideAILoader();
    }
};
