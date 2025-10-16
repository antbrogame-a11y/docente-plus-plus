# 🎓 Docente++

**Stato del Progetto: v1.2.0 - In Sviluppo**

**Applicazione web per la gestione completa della didattica, potenziata da un assistente intelligente.**

**Docente++** è un'applicazione web moderna progettata per diventare il braccio destro digitale di ogni insegnante. Semplifica la gestione delle classi, la pianificazione delle lezioni, la valutazione degli studenti e molto altro, tutto in un'unica interfaccia intuitiva e reattiva. Grazie all'assistente IA integrato, l'app non solo organizza, ma suggerisce e supporta attivamente il processo didattico.

## ✨ Funzionalità Principali

La versione 1.2.0 introduce miglioramenti significativi al flusso di onboarding e alla gestione degli errori:

- **✅ Onboarding Obbligatorio (NUOVO)**: Il completamento del profilo è ora obbligatorio per accedere a tutte le funzionalità. Questo previene stati intermedi non chiari e garantisce un'esperienza utente migliore. Non è più possibile saltare l'onboarding.
- **🔒 Gestione Intelligente dei Permessi (NUOVO)**: Le voci di menu sono disabilitate finché il profilo non è completo, con indicatori visivi chiari (icona lucchetto 🔒) e feedback informativo.
- **🟧 Banner Guida (NUOVO)**: Un banner persistente guida l'utente a completare il profilo quando necessario, con un pulsante di accesso rapido alla configurazione.
- **🛡️ Gestione Errori Migliorata (NUOVO)**: Miglior gestione di localStorage corrotto o non disponibile, con messaggi di errore chiari e procedure di recupero automatiche.
- **🎨 Theme Picker Material 3**: Personalizza l'aspetto dell'app con temi Chiaro, Scuro o Automatico (dinamico) che segue le preferenze del sistema. I temi utilizzano Material Design 3 Expressive con palette di colori moderne e Material Symbols per le icone.
- **🏫 Gestione Classi e Studenti**: Crea le tue classi e aggiungi gli studenti. Il sistema tiene traccia di tutto, aggiornando automaticamente i contatori e le associazioni.
- **🗓️ Pianificazione Lezioni e Orario**: Organizza le tue lezioni con dettagli su argomenti, obiettivi e materiali. Le lezioni appaiono automaticamente in un orario settimanale e giornaliero interattivo.
- **📅 Orario Settimanale Modificabile**: Configura l'orario delle lezioni secondo le tue esigenze:
  - Imposta il numero di ore al giorno (predefinito: 6 ore)
  - Definisci l'orario di inizio e fine (predefinito: 8:00-14:00)
  - Seleziona i giorni lavorativi (predefinito: Lun-Ven)
  - Tabella oraria interattiva, modificabile con click/tap sulle celle
- **⚙️ Configurazione Avanzata**: Personalizza l'app secondo le tue esigenze:
  - Anno scolastico configurabile
  - Gestione classi disponibili
  - Chiave API IA per funzionalità avanzate
  - Selezione modello IA (GPT-3.5, GPT-4, Claude, Llama)
  - Tutte le impostazioni persistono tra le sessioni
- **✍️ Creazione di Attività e Valutazioni**: Assegna compiti, verifiche o progetti alle classi. Registra i voti e i giudizi per ogni studente, costruendo uno storico delle performance.
- **📊 Dashboard Dinamica**: Una schermata principale che ti offre una panoramica immediata delle prossime scadenze e delle ultime valutazioni inserite.
- **🤖 Assistente IA (Simulato)**: Un assistente virtuale sempre a disposizione. Chiedigli di creare una bozza di lezione, suggerire idee per un'attività o aiutarti a trovare informazioni.
- **📄 Importazione da Documenti (Simulato)**: Carica un file (es. un PDF o un documento Word) e lascia che l'IA ne estragga i punti salienti per creare automaticamente una bozza di lezione.
- **💾 Salvataggio Locale**: Tutti i tuoi dati sono al sicuro nel tuo browser. Nessuna registrazione richiesta, puoi iniziare a lavorare immediatamente.
- **📱 Design Reattivo**: Utilizza Docente++ su computer, tablet o smartphone senza perdere funzionalità.

## 🚀 Come Iniziare

Docente++ è progettato per funzionare senza un backend complesso. Puoi eseguirlo localmente con un semplice server web.

1.  **Apri `index.html`**: Il modo più semplice per iniziare è aprire il file `index.html` direttamente nel tuo browser.
    
2.  **Usa un Server Locale (Consigliato)**: Per un'esperienza più stabile, specialmente se intendi modificare il codice, avvia un semplice server web nella cartella del progetto. Se hai Python installato, puoi usare questo comando:
    ```bash
    python -m http.server
    ```
    Successivamente, apri il browser all'indirizzo `http://localhost:8000`.

3.  **Completa l'Onboarding**: Al primo avvio, dovrai completare un breve onboarding inserendo almeno il tuo nome. Questo è necessario per accedere a tutte le funzionalità dell'applicazione.

## 📖 Documentazione

- **[Guida Rapida](docs/QUICK_START.md)**: Per iniziare subito
- **[Guida Flusso Onboarding](docs/ONBOARDING_FLOW_GUIDE.md)**: Informazioni dettagliate sul nuovo flusso di onboarding ⭐ NUOVO
- **[Guida Navigazione](docs/NAVIGATION_GUIDE.md)**: Sistema di navigazione con breadcrumb, scorciatoie da tastiera e accessibilità ⭐ NUOVO
- **[Guida Configurazione](docs/CONFIGURATION_GUIDE.md)**: Come configurare orario, classi e impostazioni IA
- **[Guida Utente](docs/user-guide.md)**: Manuale completo
- **[Guida Sviluppatore](docs/dev-guide.md)**: Per chi vuole contribuire
- **[Test Automatici](tests/README.md)**: Come eseguire e scrivere test ⭐ NUOVO
- **[Risoluzione Problemi](docs/TROUBLESHOOTING.md)**: Soluzioni ai problemi comuni

## 🔮 Roadmap Funzionalità Future

Le seguenti funzionalità sono pianificate per prossime versioni:

- 🔄 **Pipeline Auto-Pianificante**: Ripianificazione automatica delle attività quando cambiano le impostazioni
- 📅 **Integrazione Calendario Esterno**: Sync con Google Calendar/Outlook
- 🔔 **Notifiche Push Avanzate**: Promemoria personalizzati
- 🤝 **Modalità Collaborativa**: Condivisione con colleghi
- 📊 **Import/Export API**: Integrazione con registro elettronico
- ☁️ **Backup Cloud**: Sincronizzazione automatica
- 🧠 **IA Avanzata**: Suggerimenti automatici e ottimizzazione

Consulta la sezione "Impostazioni Avanzate" nell'app per maggiori dettagli sulle funzionalità future.

## 🛠️ Contribuire

Questo progetto è in continua evoluzione. Se vuoi contribuire, consulta il file `CONTRIBUTING.md` per le linee guida e il `CHANGELOG.md` per vedere su cosa stiamo lavorando.
