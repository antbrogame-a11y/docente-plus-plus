## 🗺️ Roadmap di Sviluppo - DocentEpp

### **Fase 0: Refactoring Architetturale e Stabilità (Completata)**

*   **Obiettivo:** Ristrutturare la codebase per garantire stabilità, manutenibilità e performance.
*   **Azioni:**
    *   **[COMPLETATO]** Eseguito un "deep debug" completo del codice esistente.
    *   **[COMPLETATO]** **Modularizzazione del Codice**: Trasformato il monolitico `app.js` in un'architettura a moduli dinamici (`agenda.js`, `classes.js`, `statistiche.js`, `aiAssistant.js`).
    *   **[COMPLETATO]** **Implementazione del Caricamento Dinamico**: Il router principale (`app.js`) ora carica le risorse solo quando necessario, migliorando le performance.
    *   **[COMPLETATO]** **Refactoring Anti-`innerHTML`**: Sostituito l'uso insicuro di `innerHTML` con metodi del DOM per prevenire vulnerabilità XSS.
    *   **[COMPLETATO]** **Ricostruzione della Logica di Base**: Ricostruita e consolidata la logica per le sezioni Agenda, Classi e Assistente AI.

### **Fase 1: Implementazione del Nucleo Funzionale (In Corso)**

*   **Gestione Classi (`classes.html`)**
    *   **[COMPLETATO]** Implementato il form per aggiungere una nuova classe.
    *   **[COMPLETATO]** Visualizzate le classi create in una lista.
    *   **[COMPLETATO]** Aggiunti pulsanti per modificare ed eliminare classi.
    *   **[COMPLETATO]** Salvataggio dati in `localStorage`.
*   **Potenziamento Assistente IA (`aiAssistant.html`)**
    *   **[COMPLETATO]** Collegato a vere API di intelligenza artificiale (Firebase Vertex AI - Gemini Pro).
    *   **[COMPLETATO]** Implementata l'interfaccia di chat per interagire con l'IA.
    *   **Obiettivo Futuro**: Addestrare o fornire prompt specifici per generare contenuti didattici strutturati.
*   **Introduzione di Grafici e Statistiche (`statistiche.html`)**
    *   **[COMPLETATO]** Creata una pagina dedicata alle statistiche.
    *   **[COMPLETATO]** Implementato un report generale e uno specifico per classe.
    *   **[COMPLETATO]** Calcolo delle medie e conteggio di studenti/valutazioni.
    *   **Obiettivo Futuro**: Integrare una libreria per grafici (es. Chart.js) per visualizzazioni avanzate.
*   **Gestione Studenti (`students.html`)** - **[NON INIZIATO]**
*   **Gestione Valutazioni (`evaluations.html`)** - **[NON INIZIATO]**

### **Fase 2: Potenziamento degli Strumenti (Da Iniziare)**

*   **Completamento Importazione Documenti (`documentImport.html`)** - **[NON INIZIATO]**
*   **Gestione Lezioni e Attività (`lessons.html`, `activities.html`)** - **[NON INIZIATO]**

### **Fase 3: Rifinitura e Qualità della Vita (Da Iniziare)**

*   **Temi e Personalizzazione (`settings.html`)** - **[NON INIZIATO]**