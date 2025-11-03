# Docente++ - Il Tuo Assistente Digitale Potenziato dall'IA

**Docente++** è una Progressive Web App (PWA) moderna che trasforma la gestione della didattica. Progettata per i docenti del futuro, non solo centralizza classi, studenti e valutazioni, ma ora integra un potente **Assistente IA** per fornire analisi pedagogiche approfondite e ridurre drasticamente il tempo di analisi dei dati.

Costruita su un'architettura **Single Page Application (SPA)** e **Firebase**, Docente++ offre un'esperienza fluida, sicura e intelligente.

---

## ✨ Funzionalità Chiave

*   **Gestione Completa**: Amministra classi, studenti e prove di valutazione in un'interfaccia unica e intuitiva.
*   **Importazione Rapida**: Carica intere classi di voti da file CSV in pochi secondi, con convalida automatica dei dati.
*   **Analisi con Intelligenza Artificiale**: 
    *   Ottieni report dettagliati sulle performance delle tue classi, generati da modelli linguistici avanzati.
    *   Identifica cluster di studenti, punti di forza, aree di debolezza e ricevi azioni consigliate concrete.
    *   Configurazione flessibile tramite **OpenRouter**, per permetterti di scegliere il modello IA che preferisci.
*   **Accesso Universale**: Essendo una PWA, è accessibile e installabile su qualsiasi dispositivo (desktop, tablet, smartphone).
*   **Sicurezza**: I tuoi dati sono al sicuro su Firebase e la tua chiave API per l'IA è salvata solo localmente nel tuo browser.

---

## 🛠️ Stack Tecnologico

*   **Frontend**: HTML, CSS, JavaScript (Moduli ES)
*   **Backend & Infrastruttura**: Firebase
    *   **Firebase Hosting**: Per il deploy e la distribuzione dell'app.
    *   **Firebase Authentication**: Per la gestione degli utenti.
    *   **Cloud Firestore**: Come database NoSQL per i dati.
*   **Intelligenza Artificiale**: Integrazione flessibile con provider IA tramite **OpenRouter**.
*   **Strumenti**: Firebase CLI

---

## 🚀 Quick Start (Guida per Sviluppatori)

Per avviare il progetto in locale, segui questi passaggi:

1.  **Installa la Firebase CLI**:
    ```bash
    npm install -g firebase-tools
    ```

2.  **Clona il repository**:
    ```bash
    git clone <URL_DEL_REPOSITORY>
    cd <NOME_DELLA_CARTELLA>
    ```

3.  **Login in Firebase**:
    ```bash
    firebase login
    ```

4.  **Avvia il server di sviluppo locale**:
    ```bash
    firebase serve
    ```
    L'applicazione sarà accessibile all'indirizzo `http://localhost:5000`.

---

## 🗺️ Roadmap di Sviluppo

Abbiamo raggiunto un traguardo fondamentale con l'integrazione dell'IA! Ma non ci fermiamo qui.

Per una visione dettagliata dei prossimi passi, consulta la nostra [**Roadmap completa**](ROADMAP.md).

---

## 🤝 Come Contribuire

Sei uno sviluppatore e vuoi contribuire al progetto? Fantastico! Abbiamo preparato una [**Guida per Sviluppatori**](dev-guide.md) che contiene tutte le informazioni sull'architettura, le convenzioni di codice e le linee guida per iniziare.
