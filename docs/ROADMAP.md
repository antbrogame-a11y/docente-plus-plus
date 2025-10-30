## 🗺️ Roadmap di Sviluppo - DocentEpp

### **Fase 1: Implementazione del Nucleo Funzionale (Versione 1.1)**

L'obiettivo di questa fase è rendere operative le sezioni principali dell'applicazione, trasformando i prototipi in moduli funzionanti per la gestione quotidiana della didattica.

1.  **Gestione Classi (`classes.html`)**
    *   **Obiettivo:** Creare, modificare ed eliminare classi.
    *   **Azioni:**
        *   Implementare il form per aggiungere una nuova classe.
        *   Visualizzare le classi create in una lista o griglia.
        *   Aggiungere pulsanti per modificare il nome o eliminare una classe (conferma richiesta).
        *   Salvare i dati in `localStorage`.

2.  **Gestione Studenti (`students.html`)**
    *   **Obiettivo:** Associare studenti a ogni classe.
    *   **Azioni:**
        *   Creare un selettore per scegliere una classe.
        *   Implementare il form per aggiungere uno studente alla classe selezionata.
        *   Visualizzare l'elenco degli studenti per la classe scelta.
        *   Permettere la modifica e l'eliminazione di studenti.

3.  **Gestione Valutazioni (`evaluations.html`)**
    *   **Obiettivo:** Registrare e visualizzare i voti degli studenti.
    *   **Azioni:**
        *   Creare un'interfaccia per selezionare una classe e uno studente.
        *   Aggiungere un form per inserire una nuova valutazione (voto, data, descrizione).
        *   Visualizzare la cronologia delle valutazioni per studente.
        *   Calcolare e mostrare la media dei voti per materia (futuro).

### **Fase 2: Potenziamento degli Strumenti (Versione 1.2)**

Una volta che il nucleo è stabile, ci concentreremo sul migliorare gli strumenti di produttività e automazione.

1.  **Potenziamento Assistente IA (`aiAssistant.html`)**
    *   **Obiettivo:** Rendere l'assistente IA realmente utile.
    *   **Azioni:**
        *   Collegarlo a vere API di intelligenza artificiale.
        *   Addestrarlo a generare bozze di piani di lezione, idee per attività o quiz a scelta multipla sulla base di input dell'utente.

2.  **Completamento Importazione Documenti (`documentImport.html`)**
    *   **Obiettivo:** Rendere funzionante l'importazione di file.
    *   **Azioni:**
        *   Implementare il parsing di file `.csv` o `.xlsx` per importare in blocco elenchi di studenti, evitando l'inserimento manuale.

3.  **Gestione Lezioni e Attività (`lessons.html`, `activities.html`)**
    *   **Obiettivo:** Strutturare la pianificazione didattica.
    *   **Azioni:**
        *   Creare interfacce per definire piani di lezione, allegare materiali (link) e tracciare le attività svolte in classe.

### **Fase 3: Rifinitura e Qualità della Vita (Versione 1.3+)**

In questa fase, l'attenzione si sposterà sul migliorare l'esperienza utente e aggiungere funzionalità avanzate.

1.  **Temi e Personalizzazione (`settings.html`)**
    *   **Obiettivo:** Permettere all'utente di personalizzare l'aspetto dell'app.
    *   **Azioni:**
        *   Aggiungere un selettore per un tema scuro (`dark mode`).
        *   Permettere di cambiare il colore principale dell'interfaccia.

2.  **Introduzione di Grafici e Statistiche**
    *   **Obiettivo:** Fornire visualizzazioni chiare dell'andamento degli studenti.
    *   **Azioni:**
        *   Integrare una libreria per grafici (es. Chart.js) per mostrare l'andamento dei voti nel tempo.
