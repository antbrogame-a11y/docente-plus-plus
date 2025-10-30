# 🎓 Docente++

**Stato del Progetto: v1.2.4 - In Sviluppo**

**Applicazione web per la gestione completa della didattica, potenziata da un assistente intelligente.**

**Docente++** è un'applicazione web moderna progettata per diventare il braccio destro digitale di ogni insegnante. Semplifica la gestione delle classi, la pianificazione delle lezioni, la valutazione degli studenti e molto altro, tutto in un'unica interfaccia intuitiva e reattiva. Grazie all'assistente IA integrato, l'app non solo organizza, ma suggerisce e supporta attivamente il processo didattico.

## ✨ Funzionalità Principali

La versione 1.2.4 introduce la pagina "In Classe" completa:

- **📚 Pagina "In Classe" Completa (NUOVO)**: Interfaccia dedicata per gestire le lezioni in tempo reale
  - Design mobile-first completamente responsive
  - **Attività**: Gestisci attività della lezione (aggiungi, visualizza, elimina)
  - **Compiti**: Assegna compiti con scadenze e tracking
  - **Valutazioni**: Valuta rapidamente gli studenti
  - **Appunto Vocale**: Registra audio con trascrizione IA (demo)
  - **Analytics**: Dashboard con grafici presenze e performance
  - **Sintesi**: Editor sintesi lezione ed export
  - Vedi [docs/IN_CLASSE_PAGE.md](docs/IN_CLASSE_PAGE.md) per dettagli completi
- **🎯 Menu Sempre Attivo**: Tutte le voci di menu sono sempre accessibili, senza blocchi legati all'onboarding. L'app è completamente esplorabile sin dal primo avvio.
- **📱 UX Mobile Migliorata (NUOVO)**: La voce "Impostazioni" è stata spostata più in alto nel menu mobile per facilitare l'accesso rapido alla configurazione.
- **🎨 Tema Unificato nelle Impostazioni (NUOVO)**: Selezione del tema (Chiaro/Scuro/Automatico) integrata nella pagina Impostazioni per un'esperienza più coerente.
- **🧭 Navigazione Avanzata**: Sistema completo di navigazione con breadcrumb (briciole di pane), pulsante indietro e pulsante Home sempre visibile
- **⌨️ Accessibilità Completa**: Navigazione con tastiera (Tab), etichette ARIA, indicatori di focus visibili e supporto per lettori di schermo
- **🔙 Integrazione History Browser**: I pulsanti avanti/indietro del browser funzionano correttamente, URL aggiornati con hash per ogni pagina
- **🧪 Test Automatici**: Suite di test Jest con 40+ test per onboarding e navigazione, eseguibili localmente senza costi
- **✅ Profilo Consigliato**: Il completamento del profilo è consigliato per un'esperienza ottimale, ma non blocca più l'esplorazione dell'app
- **🟧 Banner Informativo**: Un banner discreto ricorda all'utente di completare il profilo quando necessario
- **🛡️ Gestione Errori Migliorata**: Miglior gestione di localStorage corrotto o non disponibile, con messaggi di errore chiari e procedure di recupero automatiche
- **🎨 Theme Picker Material 3**: Personalizza l'aspetto dell'app con temi Chiaro, Scuro o Automatico (dinamico) che segue le preferenze del sistema. I temi utilizzano Material Design 3 Expressive con palette di colori moderne e Material Symbols per le icone.
- **🏫 Gestione Classi e Studenti**: Crea le tue classi e aggiungi gli studenti. Il sistema tiene traccia di tutto, aggiornando automaticamente i contatori e le associazioni.
- **🗓️ Pianificazione Lezioni e Orario**: Organizza le tue lezioni con dettagli su argomenti, obiettivi e materiali. Le lezioni appaiono automaticamente in un orario settimanale e giornaliero interattivo.
- **📅 Orario Personale del Docente (NUOVO)**: Gestisci il tuo orario settimanale ricorrente:
  - Orario personale del docente, non più basato sulle classi
  - Ogni cella è editabile: inserisci classe e tipo lezione (T, D, L, ECiv, V, P)
  - Imposta il numero di ore al giorno (predefinito: 6 ore)
  - Definisci l'orario di inizio e fine (predefinito: 8:00-14:00)
  - Seleziona i giorni lavorativi (predefinito: Lun-Ven)
  - Tabella oraria interattiva, modificabile con click/tap sulle celle
  - Pulsante "Entra in Classe" disponibile quando classe e tipo lezione sono configurati
  - Tutti gli orari mostrati nell'app derivano dall'orario personale principale
- **⚙️ Configurazione Avanzata**: Personalizza l'app secondo le tue esigenze:
  - Anno scolastico configurabile
  - **📚 Selezione Discipline Insegnate (NUOVO)**: Configura le materie che insegni per filtrare lezioni e orari automaticamente
  - Gestione classi disponibili
  - Chiave API IA per funzionalità avanzate
  - Selezione modello IA (GPT-3.5, GPT-4, Claude, Llama)
  - Selezione tema (Chiaro/Scuro/Automatico) e colore principale
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

3.  **Esplora Liberamente**: Tutte le funzionalità sono accessibili immediatamente. Per un'esperienza ottimale, ti consigliamo di configurare il tuo profilo dalla pagina Impostazioni.

## 📖 Documentazione

- **[Guida Rapida](docs/QUICK_START.md)**: Per iniziare subito
- **[Pagina In Classe](docs/IN_CLASSE_PAGE.md)**: Guida completa alla nuova interfaccia "In Classe" ⭐ NUOVO
- **[Guida Navigazione](docs/NAVIGATION_GUIDE.md)**: Sistema di navigazione, breadcrumb e accessibilità
- **[Guida Orario Personale](docs/PERSONAL_SCHEDULE_GUIDE.md)**: Come usare il sistema orario personale
- **[Guida Testing](docs/TESTING_STRATEGY.md)**: Strategia di test e best practice
- **[Guida Flusso Onboarding](docs/ONBOARDING_FLOW_GUIDE.md)**: Informazioni dettagliate sul flusso di onboarding
- **[Guida Configurazione](docs/CONFIGURATION_GUIDE.md)**: Come configurare orario, classi e impostazioni IA
- **[Guida Utente](docs/user-guide.md)**: Manuale completo
- **[Guida Sviluppatore](docs/dev-guide.md)**: Per chi vuole contribuire
- **[Risoluzione Problemi](docs/TROUBLESHOOTING.md)**: Soluzioni ai problemi comuni

## 🧪 Testing

Docente++ include una suite completa di test automatici:

```bash
# Installa le dipendenze (solo la prima volta)
npm install

# Esegui tutti i test
npm test

# Esegui i test in modalità watch (durante lo sviluppo)
npm run test:watch

# Esegui test specifici
npm run test:navigation
npm run test:onboarding
```

**Nota**: Tutti i test girano localmente senza consumare risorse premium. Vedi [docs/TESTING_STRATEGY.md](docs/TESTING_STRATEGY.md) per dettagli.

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
