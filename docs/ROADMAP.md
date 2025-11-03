# 🗺️ Roadmap di Sviluppo - Docente++

Questa roadmap è la nostra memoria condivisa e la fonte di verità per lo stato del progetto. Ogni volta che riprenderemo a lavorare, partiremo da qui per ristabilire il contesto.

---

### ✅ **Fase 1: Nucleo Funzionale e Architettura SPA (Completata)**

Fondamenta dell'applicazione come Single Page Application robusta e modulare.

*   **[COMPLETATO]** Refactoring Architetturale a SPA.
*   **[COMPLETATO]** Gestione CRUD: Classi, Studenti, Valutazioni.
*   **[COMPLETATO]** Importazione massiva di studenti da CSV.
*   **[COMPLETATO]** Pagine di Base: Dashboard (`Agenda`) e Statistiche.

---

### ✅ **Fase 2: Potenziamento e Qualità della Vita (Completata)**

Arricchimento dell'esperienza utente e strumenti di produttività.

*   **[COMPLETATO]** Visualizzazione Grafica delle Statistiche (`Chart.js`).
*   **[COMPLETATO]** Implementazione dell'Orario Scolastico interattivo.
*   **[COMPLETATO]** Esportazione Dati e Reportistica in formato CSV.
*   **[COMPLETATO]** Sincronizzazione Cloud (Firebase Auth & Firestore) per tutte le funzionalità principali.

---

### ✅ **Fase 3: Funzionalità Didattiche Intelligenti (Completata)**

Questa fase ha trasformato l'applicazione in un assistente didattico proattivo, automatizzando compiti ad alto valore aggiunto e fornendo insight pedagogici.

1.  **Gestione Attività Didattiche e Piano di Lezione** - **[COMPLETATO]**
    *   **Obiettivo Raggiunto**: Implementata la sezione `lessons.html` per tracciare le attività didattiche con un flusso di lavoro migliorato.

2.  **Potenziamento Assistente IA: L'Analista dei Risultati** - **[COMPLETATO]**
    *   **Obiettivo Strategico Raggiunto**: È stata creata una nuova funzionalità di **Analisi Valutazioni con IA**, che trasforma i dati grezzi dei voti in report pedagogici azionabili.
    *   **Visione d'Implementazione Realizzata**:
        *   **Pagina di Analisi Dedicata**: Creata la pagina `analysis.html` come centro di controllo per l'analisi IA.
        *   **Integrazione Flessibile con OpenRouter**: Invece di vincolarsi a un singolo provider, è stata implementata una pagina di **Impostazioni** (`settings.html`) che permette all'utente di configurare la propria API Key di OpenRouter e di scegliere qualsiasi modello supportato. La chiave è salvata in modo sicuro nel `localStorage` del browser.
        *   **Analisi IA Avanzata**: Al click di un pulsante, l'applicazione:
            1.  Recupera i voti e i nomi degli studenti associati a una valutazione.
            2.  Costruisce un **prompt ingegnerizzato** per istruire l'IA a agire come un assistente pedagogico.
            3.  Invia i dati al modello scelto tramite OpenRouter.
            4.  Riceve e visualizza un report completo in Markdown, includendo: Sintesi, Analisi Statistica, Cluster di Studenti, Punti di Forza, Aree di Miglioramento e Azioni Consigliate.

---

### 🚀 **Fase 4: Prossimi Passi e Visione Futura (Da Definire)**

Ora che il nucleo intelligente dell'applicazione è completo e robusto, possiamo esplorare nuove direzioni.

*   **[PROSSIMO PASSO]** **Definire la prossima grande funzionalità**: Quale area della vita di un docente possiamo ancora migliorare? (Es. Comunicazioni con famiglie, gestione progetti di gruppo, gamification, etc.).
*   **[PROSSIMO PASSO]** **Miglioramento continuo**: Raccogliere feedback e affinare le funzionalità esistenti.

---

### 💡 **Filosofia di Accesso (Promemoria)**

*   **Principio Guida: Gratuito per i Docenti**: Docente++ sarà **sempre gratuita** per l'utilizzo da parte di docenti individuali, sfruttando il piano gratuito "Spark" di Firebase.
*   **Sostenibilità a Lungo Termine**: In futuro, potranno essere introdotte funzionalità *premium* opzionali o piani per istituti per garantire la longevità e l'evoluzione del progetto, mantenendo il nucleo dell'app gratuito.
