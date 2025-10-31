# 🗺️ Roadmap di Sviluppo - DocentEpp

Questa roadmap delinea la visione strategica e i passi operativi per l'evoluzione di DocentEpp. Il nostro obiettivo è procedere per fasi, consolidando le funzionalità prima di passare a quelle successive.

---

### ✅ **Fase 1: Nucleo Funzionale e Architettura SPA (Completata)**

In questa fase cruciale, abbiamo gettato le fondamenta dell'applicazione, trasformandola in una Single Page Application robusta e modulare.

*   **[COMPLETATO]** **Refactoring Architetturale**: Migrazione da un modello a pagine multiple a un'architettura SPA con caricamento dinamico dei contenuti.
*   **[COMPLETATO]** **Gestione Classi**: Implementazione completa delle operazioni CRUD (Create, Read, Update, Delete) per le classi.
*   **[COMPLETATO]** **Gestione Studenti**: Implementazione completa delle operazioni CRUD per gli studenti, con associazione alle classi.
*   **[COMPLETATO]** **Gestione Valutazioni**: Implementazione completa delle operazioni CRUD per le valutazioni, collegate agli studenti.
*   **[COMPLETATO]** **Importazione da CSV**: Creata la funzionalità per importare massivamente studenti da file `.csv`, potenziando la produttività.
*   **[COMPLETATO]** **Integrazione Base Assistente IA**: Collegamento con i modelli di Firebase Vertex AI (Gemini) per l'assistenza contestuale.
*   **[COMPLETATO]** **Dashboard (`Agenda`)**: Creata la schermata principale con una vista riassuntiva.
*   **[COMPLETATO]** **Pagina Statistiche**: Implementata la pagina per il calcolo delle medie numeriche.

---

### ✅ **Fase 2: Potenziamento e Qualità della Vita (Completata)**

L'obiettivo di questa fase è stato arricchire l'esperienza utente e fornire strumenti di visualizzazione e produttività più potenti.

*   **[COMPLETATO]** **Visualizzazione Grafica delle Statistiche**
    *   **Obiettivo**: Trasformare i dati numerici in insight visivi immediati.
    *   **Azioni**: Integrata una libreria per grafici (`Chart.js`) per mostrare l'andamento degli studenti e la distribuzione dei voti.

*   **[COMPLETATO]** **Implementazione dell'Orario Scolastico (`schedule.html`)**
    *   **Obiettivo**: Fornire una vista settimanale chiara delle lezioni.
    *   **Azioni**: Progettata una griglia visiva che permette l'associazione delle classi alle ore.

*   **[COMPLETATO]** **Esportazione Dati e Reportistica**
    *   **Obiettivo**: Permettere ai docenti di salvare e stampare il proprio lavoro.
    *   **Azioni**: Implementata l'esportazione in formato CSV per studenti, valutazioni e orario.

---

### 🔮 **Fase 3: Funzionalità Avanzate e Cloud (Visione a Lungo Termine)**

Ora che la Fase 2 è consolidata, possiamo portare l'applicazione al livello successivo, trasformandola in uno strumento ancora più potente e connesso.

1.  **Sincronizzazione Cloud e Multi-Dispositivo** - **[PROSSIMO PASSO]**
    *   **Obiettivo**: Sostituire `localStorage` con **Firebase Firestore** per il salvataggio dei dati.
    *   **Azioni**: Implementare un sistema di autenticazione (Firebase Auth) per la gestione di account utente sicuri.

2.  **Potenziamento Assistente IA**
    *   **Obiettivo**: Rendere l'IA un co-pilota proattivo per la didattica.
    *   **Azioni**: Addestrare l'IA a generare bozze di lezioni, verifiche e fornire suggerimenti basati sui dati degli studenti.

3.  **Gestione Attività Didattiche**
    *   **Obiettivo**: Completare la sezione `lessons.html` per tracciare piani di lezione e attività svolte.
