# Guida per Sviluppatori - Docente++

Questa guida fornisce dettagli tecnici sull'architettura e le convenzioni di codice per contribuire allo sviluppo di Docente++.

---

## 🏛️ Architettura Generale

Docente++ è una **Single Page Application (SPA)** costruita con JavaScript vanilla (moduli ES6), HTML5 e CSS. Non utilizza framework esterni (come React o Vue) per mantenere il codice leggero e trasparente.

*   **Entry Point**: `index.html` è la shell principale.
*   **Router**: `app.js` contiene la logica di routing basata su hash (`#pagina`). Carica dinamicamente i template HTML delle pagine in `main#main-content` e associa i rispettivi moduli JavaScript.
*   **Moduli di Pagina**: La logica per ogni pagina è contenuta in file dedicati nella cartella `js/` (es. `js/classes.js`, `js/students.js`). Ogni modulo espone tipicamente una funzione `setup...` per inizializzare la pagina e una funzione `cleanup...` per rimuovere eventuali listener.
*   **Moduli di Servizio**: Funzionalità trasversali (es. `js/auth.js`, `js/firestore.js`) espongono funzioni helper riutilizzabili in tutta l'applicazione.
*   **Stato**: L'applicazione è stateless. Lo stato persistente è gestito interamente da **Cloud Firestore**. Le impostazioni locali dell'utente (come le chiavi API) sono salvate nel **`localStorage`** del browser.

---

## 🧠 Integrazione con l'Intelligenza Artificiale (OpenRouter)

Una delle funzionalità più potenti di Docente++ è l'analisi delle valutazioni tramite IA. L'integrazione è stata progettata per essere flessibile e sicura, utilizzando **OpenRouter** come gateway per accedere a diversi modelli linguistici.

### Flusso Logico dell'Analisi IA

1.  **Configurazione Utente (`settings.html` e `js/settings.js`)**:
    *   L'utente inserisce la propria **API Key di OpenRouter** e il **nome del modello** desiderato (es. `google/gemini-pro`).
    *   Cliccando su "Testa e Salva", viene effettuata una chiamata API reale per validare le credenziali.
    *   Se il test ha successo, la chiave (`or_api_key`) e il modello (`or_model_name`) vengono salvati nel `localStorage` del browser. **La chiave non lascia mai il client se non per le chiamate dirette a OpenRouter.**

2.  **Avvio dell'Analisi (`analysis.html` e `js/analysis.js`)**:
    *   L'utente seleziona una valutazione dal menu a discesa.
    *   Al click su "Analizza con IA", lo script `js/analysis.js` recupera la chiave e il modello dal `localStorage`.
    *   Viene chiamata la funzione `getGradesForEvaluation(evaluationId)` da `js/firestore.js` per ottenere l'elenco dei voti, arricchito con i nomi degli studenti.

3.  **Generazione del Prompt e Chiamata API**:
    *   La funzione `generateAIReport` costruisce un **prompt dettagliato** che istruisce l'IA sul suo ruolo (assistente pedagogico), sul formato di output richiesto (Markdown strutturato) e fornisce i dati della valutazione in formato JSON.
    *   Viene effettuata una `fetch` `POST` all'endpoint di OpenRouter: `https://openrouter.ai/api/v1/chat/completions`.
    *   Il corpo della richiesta contiene il modello e il prompt.

4.  **Rendering del Report**:
    *   La risposta Markdown dell'IA viene ricevuta e parsata dalla funzione `markdownToHtml` in `js/analysis.js` per una visualizzazione formattata nella pagina.

### Modifica del Prompt o del Rendering

*   Per cambiare le istruzioni fornite all'IA, modifica la stringa `prompt` all'interno della funzione `generateAIReport` in `js/analysis.js`.
*   Per migliorare la visualizzazione del report, aggiorna la funzione `markdownToHtml` per supportare più sintassi Markdown.

---

## 🔥 Setup Sviluppo con Firebase

1.  **Installa la Firebase CLI**: `npm install -g firebase-tools`
2.  **Clona il repository**: `git clone <URL_REPO>`
3.  **Login**: `firebase login`
4.  **Avvia il server locale**: `firebase serve` (emula Hosting e Functions)

---

## ✅ Testing

- Testa le funzionalità cross-browser (Chrome, Firefox, Safari).
- Verifica il layout e l'usabilità su dispositivi mobili tramite i DevTools del browser.
- Assicurati che tutte le interazioni con Firestore (letture, scritture) si riflettano correttamente nell'UI.
