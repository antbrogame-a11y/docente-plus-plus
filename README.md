# 🎓 Docente++ 

**Progressive Web App per la gestione della didattica dell'insegnante potenziata da IA OpenRouter**

App installabile per un insegnamento basato su IA, evoluzione del progetto docente-plus con interfaccia web completa e supporto PWA.

> **Nota**: Questa è una web app standalone che non richiede installazione di dipendenze. Basta aprire `index.html` in un browser per iniziare!

## 📋 Caratteristiche

- **🎯 Onboarding Guidato** - Configurazione iniziale profilo docente
- **🏫 Gestione Classi** - Crea, modifica ed elimina classi
- **👥 Gestione Studenti** - Organizza studenti con import da CSV/Excel
- **📚 Gestione Lezioni** - Crea lezioni manualmente o genera con IA
- **📅 Orario Didattico** - Orario settimanale interattivo con vista giornaliera/settimanale
- **📋 Gestione Attività** - Pianifica esercitazioni, laboratori, progetti, compiti e verifiche
- **✅ Valutazioni** - Sistema completo per criteri, griglie e valutazioni con supporto IA
- **🔔 Notifiche** - Promemoria automatici per lezioni, scadenze e backup
- **📰 News RSS/Atom** - Aggregazione news con analisi IA contestuale
- **🤖 Assistente IA** - Supporto OpenRouter per pianificazione didattica
- **📂 Import Documenti** - Carica e importa documenti con riconoscimento IA
- **🎙️ Registrazione Audio** - Registra lezioni con contesto automatico
- **💾 Import/Export** - Backup completo in JSON, PDF o Excel
- **📱 PWA** - Installabile su tutti i dispositivi, funziona offline
- **🔐 Privacy** - Tutti i dati salvati solo localmente, nessun server

## 🚀 Avvio Rapido

1. **Clona il repository**:
   ```bash
   git clone https://github.com/antbrogame-a11y/docente-plus-plus.git
   cd docente-plus-plus
   ```

2. **Apri l'applicazione**:
   - Apri il file `index.html` nel tuo browser
   - Oppure usa un server locale:
     ```bash
     # Con Python 3
     python -m http.server 8000
     
     # Con Node.js (http-server)
     npx http-server
     ```
   - Poi naviga su `http://localhost:8000`

3. **Configura l'API Key** (opzionale, per usare l'IA):
   - Vai nella sezione "Impostazioni"
   - Inserisci la tua OpenRouter API Key (ottenibile su [openrouter.ai](https://openrouter.ai))
   - Salva le impostazioni

4. **Inizia ad usare l'app**:
   - Completa l'onboarding iniziale con i tuoi dati
   - Crea le tue classi
   - Aggiungi studenti e lezioni
   - Usa l'assistente IA per generare contenuti

📖 **Per una guida completa**: vedi [Guida Rapida](docs/QUICK_START.md)

## 📊 Funzionalità Principali

- ✅ **Assistente IA OpenRouter** - Supporto intelligente per pianificazione didattica e creazione materiali
- ✅ **Gestione Completa** - Classi, studenti, lezioni, orario didattico e valutazioni
- ✅ **Attività Didattiche** - Pianificazione e monitoraggio con scadenze e notifiche automatiche
- ✅ **Import/Export Avanzato** - Backup e ripristino in formati multipli (JSON, PDF, Excel)
- ✅ **Importazione Documenti** - Sistema IA per importare documenti didattici e anagrafici (CSV, XLSX, PDF, TXT)
- ✅ **Registrazione Audio** - Registra e gestisci le lezioni con contesto automatico
- ✅ **News RSS/Atom** - Aggregazione news con analisi IA contestuale
- ✅ **Notifiche e Promemoria** - Sistema completo di notifiche automatiche personalizzabili
- ✅ **PWA** - Installabile come app su smartphone, tablet e desktop, funziona offline
- ✅ **Privacy** - Tutti i dati solo in locale, nessun server esterno

## 📋 Cose da Fare (To Do)

Funzionalità pianificate per le prossime versioni:

- [ ] **Importazione Materiali Didattici** - Caricamento e classificazione automatica materiali didattici
- [ ] **Trascrizione Audio con IA** - Trascrizione automatica registrazioni audio lezioni
- [ ] **Analisi Predittiva** - Analisi progressi studenti e suggerimenti IA
- [ ] **Backup cloud opzionale** - Sincronizzazione e ripristino dati tramite Google Drive/Dropbox
- [ ] **Accessibilità estesa** - Navigazione da tastiera, testo alternativo, modalità contrasto elevato
- [ ] **Condivisione Programmazioni** - Esportazione e condivisione programmazioni didattiche
- [ ] **Integrazione Registro Elettronico** - Sincronizzazione con registri elettronici principali
- [ ] **Statistiche Avanzate** - Dashboard con grafici e analisi dettagliate

> **Nota**: Per richiedere una nuova funzionalità o discutere le priorità, apri una [nuova issue](https://github.com/antbrogame-a11y/docente-plus-plus/issues) su GitHub.

## 📖 Guida all'Uso

### Primo Accesso
Al primo avvio, l'app ti guiderà attraverso l'onboarding con configurazione di profilo, classi, discipline e anno scolastico.

### Funzionalità Principali

- **Dashboard** - Panoramica rapida con statistiche di lezioni, studenti e attività
- **Classi e Studenti** - Gestisci classi e anagrafica studenti, importa da CSV/Excel
- **Lezioni** - Crea lezioni manualmente o genera con l'IA
- **Orario Didattico** - Gestisci l'orario settimanale con vista giornaliera e settimanale
- **Attività** - Pianifica e monitora esercitazioni, laboratori, progetti, compiti e verifiche
- **Valutazioni** - Sistema completo per criteri, griglie e valutazioni personalizzate
- **Notifiche** - Promemoria automatici per lezioni, scadenze e backup
- **News RSS** - Aggrega news da fonti esterne con analisi IA contestuale
- **Assistente IA** - Chat intelligente per supporto didattico
- **Import/Export** - Backup completo in JSON, PDF o Excel

Per istruzioni dettagliate su ogni funzionalità, consulta la [📚 Documentazione Aggiuntiva](#-documentazione-aggiuntiva) qui sotto.

## 🏗️ Struttura del Progetto

```
docente-plus-plus/
├── index.html          # Interfaccia principale dell'app
├── styles.css          # Stili e design dell'applicazione
├── app.js              # Logica applicativa e integrazione IA
├── manifest.json       # Configurazione PWA
├── sw.js               # Service Worker per funzionamento offline
├── icons/              # Icone per PWA
├── docs/               # Documentazione dettagliata
└── README.md           # Questa documentazione
```

## 🔧 Tecnologie Utilizzate

- **HTML5, CSS3, JavaScript (ES6+)** - Frontend moderno e responsive
- **LocalStorage API** - Persistenza dati lato client
- **OpenRouter API** - Intelligenza artificiale
- **PWA + Service Worker** - Installabile e funzionante offline

## 📱 Installazione PWA (Progressive Web App)

Docente++ può essere installato come app su smartphone, tablet e desktop!

### Come Installare

- **📱 Android**: Menu (⋮) → "Installa app"
- **🍎 iOS**: Condividi → "Aggiungi a Home"
- **💻 Desktop**: Icona "Installa" (⊕) nella barra degli indirizzi

L'app installata funziona anche offline! 

📖 **Guida completa**: [Installazione PWA](docs/PWA_INSTALLATION.md) | [Quick Start PWA](docs/PWA_QUICK_START.md)
## 🔐 Privacy e Sicurezza

- **Dati Locali** - Tutti i dati salvati solo nel browser
- **API Key Sicura** - Chiave API memorizzata localmente e mai condivisa
- **Nessun Server** - L'app funziona completamente lato client
- **HTTPS Consigliato** - Per chiamate API sicure a OpenRouter

## 📝 Licenza

Questo progetto è rilasciato sotto licenza MIT. Vedi il file LICENSE per i dettagli.

## 🤝 Contributi

I contributi sono benvenuti! Puoi contribuire in diversi modi:

- 🐛 **[Segnala un Bug](https://github.com/antbrogame-a11y/docente-plus-plus/issues/new?template=bug_report.md)** - Hai trovato un problema? Aiutaci a risolverlo!
- ✨ **[Richiedi una Funzionalità](https://github.com/antbrogame-a11y/docente-plus-plus/issues/new?template=feature_request.md)** - Hai un'idea? Condividila!
- 🎨 **[Suggerisci Miglioramenti UX/UI](https://github.com/antbrogame-a11y/docente-plus-plus/issues/new?template=ux_improvement.md)** - L'interfaccia potrebbe essere migliore? Diccelo!
- 💬 **[Condividi Feedback](https://github.com/antbrogame-a11y/docente-plus-plus/issues/new?template=feedback.md)** - La tua esperienza è preziosa!
- 💻 **Contribuisci al Codice** - Leggi la [Guida ai Contributi](CONTRIBUTING.md) per iniziare

Per informazioni dettagliate su come contribuire, consulta la **[📚 Guida ai Contributi](CONTRIBUTING.md)**.

## 🐛 Segnalazione Bug e Feedback

Vogliamo rendere Docente++ sempre migliore! Il tuo feedback è prezioso:

- **🐛 Segnala un Bug:** [Apri Bug Report](https://github.com/antbrogame-a11y/docente-plus-plus/issues/new?template=bug_report.md)
- **💡 Condividi Feedback:** [Invia Suggerimenti](https://github.com/antbrogame-a11y/docente-plus-plus/issues/new?template=feedback.md)
- **📋 Vedi Feedback Raccolti:** [Documento Feedback Utente](docs/FEEDBACK_UTENTE.md)
- **🧪 Piano Test Beta:** [Piano Test Completo](docs/BETA_TEST_PLAN.md)

## 👨‍💻 Autore

Progetto sviluppato per migliorare la gestione didattica degli insegnanti attraverso l'intelligenza artificiale.

## 📚 Documentazione Aggiuntiva

### Guide Rapide e Installazione

- **[🚀 Quick Start](docs/QUICK_START.md)** - Guida rapida per iniziare in 5 minuti
- **[📱 Installazione PWA](docs/PWA_INSTALLATION.md)** - Guida completa installazione su smartphone, tablet e desktop
- **[⚡ PWA Quick Start](docs/PWA_QUICK_START.md)** - Test rapido funzionalità PWA

### Funzionalità Specifiche

- **[📋 Importazione Attività da PDF](docs/PDF_ACTIVITIES_IMPORT.md)** - Estrazione automatica attività da PDF
- **[📰 Modulo News RSS/Atom](docs/NEWS_RSS_MODULE.md)** - Aggregazione news con analisi IA
- **[📂 Importazione Documenti](docs/DOCUMENT_IMPORT_MODULE.md)** - Sistema import documenti didattici

### Architettura e Riferimenti Tecnici

- **[🏗️ Architettura News](docs/NEWS_ARCHITECTURE.md)** - Architettura tecnica modulo News
- **[📅 Implementazione Orario](docs/SCHEDULE_IMPLEMENTATION.md)** - Dettagli implementazione orario didattico
- **[🔧 OpenRouter API](docs/OPENROUTER_API_EXAMPLE.md)** - Esempi e guida API OpenRouter

### Report di Implementazione e Test

- **[✅ Riepilogo Implementazione PDF](docs/RIEPILOGO_IMPLEMENTAZIONE.md)** - Report implementazione import PDF
- **[📊 Test Results](docs/IMPLEMENTATION_TEST_RESULTS.md)** - Risultati test implementazione
- **[📝 Implementation Summary](docs/IMPLEMENTATION_SUMMARY.md)** - Sommario generale implementazioni
- **[🧪 News Testing Guide](docs/NEWS_TESTING_GUIDE.md)** - Guida test modulo News
- **[🧪 Piano Test Beta](docs/BETA_TEST_PLAN.md)** - Piano completo test per release Beta 1.0
- **[📝 Feedback Utente](docs/FEEDBACK_UTENTE.md)** - Raccolta feedback utenti e roadmap miglioramenti
- **[🗺️ Roadmap Operativa](docs/ROADMAP.md)** - Roadmap incrementale sviluppo per macro-temi

### Documentazione PWA

- **[✅ PWA Verification Summary](docs/PWA_VERIFICATION_SUMMARY.md)** - Riepilogo verifica PWA
- **[📋 PWA Review Checklist](docs/PWA_REVIEW_CHECKLIST.md)** - Checklist revisione PWA
- **[🔬 PWA Verification Report](docs/PWA_VERIFICATION_REPORT.md)** - Report tecnico completo
- **[⚙️ PWA Runtime Testing](docs/PWA_RUNTIME_TESTING.md)** - Procedure test runtime
- **[📊 PWA Implementation Summary](docs/PWA_IMPLEMENTATION_SUMMARY.md)** - Sommario implementazione PWA
- **[📝 PWA Verification Overview](docs/PWA_VERIFICATION_OVERVIEW.md)** - Panoramica verifica tecnica
- **[📄 PWA Test Log](docs/PWA_TEST_LOG.md)** - Log test PWA

### Migrazione e Implementazioni News

- **[🔄 Migration Summary](docs/MIGRATION_SUMMARY.md)** - Sommario migrazioni sistema
- **[📰 News Implementation Summary](docs/NEWS_IMPLEMENTATION_SUMMARY.md)** - Sommario implementazione News

### Risorse Esterne Utili

- [Documentazione OpenRouter API](https://openrouter.ai/docs)
- [Guida HTML5](https://developer.mozilla.org/it/docs/Web/HTML)
- [Guida CSS3](https://developer.mozilla.org/it/docs/Web/CSS)
- [Guida JavaScript](https://developer.mozilla.org/it/docs/Web/JavaScript)

---

**🎯 Docente++** - L'assistente intelligente per la gestione didattica moderna
