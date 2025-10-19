# Epic: Implementazione MVP Pagina "In Classe"

## Panoramica

Questo documento descrive l'Epic e gli Issue proposti per l'implementazione dell'MVP (Minimum Viable Product) della pagina "In Classe" di Docente++. L'obiettivo è creare una vista giornaliera/settimanale con slot cliccabili, overlay di classe, funzionalità di avvio sessione, valutazioni rapide, persistenza dati, sincronizzazione real-time, supporto IA e analytics.

## Epic: Pagina "In Classe" - Vista Sessioni e Gestione Lezioni

**Descrizione**: Implementare una pagina completa per la gestione delle lezioni in tempo reale con funzionalità avanzate di valutazione, registrazione, analytics e supporto IA.

**Valore di Business**: Fornire ai docenti uno strumento completo e intuitivo per gestire le lezioni, registrare attività, valutare studenti e tracciare il progresso in tempo reale.

---

## Issue 1: Vista Calendario Settimanale con Slot Cliccabili
**Priorità**: 🔴 ALTA (Core MVP)  
**Stima**: 5 giorni  
**Label**: `feature`, `frontend`, `core`

### Descrizione
Implementare una vista calendario giornaliero (non c'e' un calendario nellapp non ci wino vincoli quondi il giorno che compare In Classe e' quello del sistema e pertanto compare lorario per quel giorno, che mostri gli slot delle lezioni. Ogni slot deve essere cliccabile per aprire la sessione corrispondente.

### Acceptance Criteria
- [ ] Vista giornaliera con le 6 ore del giorno) e orari
- [ ] Slot lezione visualizzano: classe, materia, orario
- [ ] Clic su slot apre overlay/modal con dettagli lezione
- [ ] Responsive design (mobile-first)
- [ ] Colori distintivi per diverse materie
- [ ] Indicatori visivi per sessioni attive/completate/future
- [ ] Navigazione tra settimane (frecce prev/next)

### Note Tecniche
- Utilizzare grid CSS per layout calendario
- Gestire parametri URL per deeplink diretti: `?lesson=Lunedì-08:00`
- Supportare touch gestures per mobile

---

## Issue 2: Integrazione Database e Persistenza Dati
**Priorità**: 🟡 MEDIA  
**Stima**: 3 giorni  
**Label**: `backend`, `database`

### Descrizione
Configurare sistema di persistenza dati utilizzando localStorage per MVP e preparare struttura per migrazione a database backend.

### Acceptance Criteria
- [ ] Schema dati per lezioni, attività, compiti, valutazioni
- [ ] CRUD operations via localStorage
- [ ] Struttura codice pronta per migrazione a REST API
- [ ] Gestione errori e fallback
- [ ] Pulizia automatica dati vecchi (>30 giorni)

### Note Tecniche
```javascript
// Struttura chiavi localStorage
`inClasse_activities_${lessonKey}`
`inClasse_homework_${lessonKey}`
`inClasse_evaluations_${lessonKey}`
`inClasse_recordings_${lessonKey}`
`inClasse_summary_${lessonKey}`
```

---

## Issue 3: Overlay Classe e Informazioni Sessione
**Priorità**: 🔴 ALTA (Core MVP)  
**Stima**: 3 giorni  
**Label**: `feature`, `frontend`, `core`

### Descrizione
Creare overlay/modal che appare al clic su uno slot lezione, mostrando informazioni dettagliate e opzioni per avviare la sessione.

### Acceptance Criteria
- [ ] Modal responsive con header informazioni lezione
- [ ] Visualizzazione: classe, materia, orario, durata
- [ ] Pulsante "Avvia Sessione" prominente
- [ ] Lista studenti della classe
- [ ] Storico sessioni precedenti (ultimi 5)
- [ ] Chiusura modal (X, ESC, click backdrop)
- [ ] Animazioni smooth (slide-in)

### Note Tecniche
- Implementare come componente riutilizzabile
- Accessibilità: focus trap, ARIA labels
- Lazy loading dati studenti

---

## Issue 4: Avvio Sessione e Interfaccia Lezione
**Priorità**: 🔴 ALTA (Core MVP)  
**Stima**: 8 giorni  
**Label**: `feature`, `frontend`, `core`

### Descrizione
Implementare l'interfaccia principale della sessione lezione con sezioni collapsibili per attività, compiti, valutazioni e sintesi.

### Acceptance Criteria
- [ ] Header sticky con info lezione sempre visibile
- [ ] Sezione Attività: aggiungi, modifica, elimina attività
- [ ] Sezione Compiti: assegna compiti con scadenza
- [ ] Sezione Valutazioni: griglia studenti per valutazione rapida
- [ ] Sezione Sintesi: editor testo per riassunto lezione
- [ ] Tutte le sezioni collapsibili per ottimizzare spazio
- [ ] Navigazione touch-friendly
- [ ] Pulsante "Termina Sessione" con conferma

### Componenti
1. **Activities Manager**: Form aggiunta attività con tipo (Lezione/Esercitazione/Discussione/Laboratorio)
2. **Homework Manager**: Form compiti con data scadenza
3. **Evaluations Grid**: Card studenti con input voto e note
4. **Summary Editor**: Textarea con next steps checklist

### Note Tecniche
- Utilizzare Web Components o moduli ES6+
- Salvare automaticamente ogni modifica (debounce 2s)
- Gestire stati: idle, saving, saved, error

---

## Issue 5: Sistema Valutazioni Rapide
**Priorità**: 🔴 ALTA (Core MVP)  
**Stima**: 4 giorni  
**Label**: `feature`, `frontend`, `core`

### Descrizione
Implementare sistema di valutazione rapida studenti durante la lezione con griglia responsive e storico valutazioni.

### Acceptance Criteria
- [ ] Griglia responsive: 1 col (mobile), 2 col (tablet), 3 col (desktop)
- [ ] Card studente con avatar, nome, ultima valutazione
- [ ] Input numerico voto (1-10) o voto personalizzato
- [ ] Campo note opzionale per ogni valutazione
- [ ] Timestamp automatico per ogni valutazione
- [ ] Visualizzazione storico valutazioni per studente (modal)
- [ ] Indicatori visivi per studenti non ancora valutati
- [ ] Filtri: tutti/valutati/non valutati

### Note Tecniche
- Salvare valutazioni in tempo reale
- Calcolare media voti automaticamente
- Supportare scale valutazione personalizzate (future)

---

## Issue 6: Registratore Vocale e Appunti Audio
**Priorità**: 🟡 MEDIA  
**Stima**: 5 giorni  
**Label**: `feature`, `audio`, `AI`

### Descrizione
Implementare registratore vocale per appunti audio durante la lezione con interfaccia intuitiva.

### Acceptance Criteria
- [ ] Pulsante Record/Stop con feedback visivo
- [ ] Indicatore durata registrazione in tempo reale
- [ ] Lista registrazioni con timestamp e durata
- [ ] Player audio per riproduzione
- [ ] Eliminazione registrazioni
- [ ] Download registrazioni come file .webm/.mp3
- [ ] Gestione permessi microfono
- [ ] Placeholder per trascrizione IA (future)

### Note Tecniche
- Utilizzare Web Audio API
- MediaRecorder API per registrazione
- Salvare blob audio in localStorage (limite dimensioni)
- Preparare integrazione OpenAI Whisper / Google Speech-to-Text

```javascript
// Esempio implementazione
class AudioRecorder {
    async start() { /* ... */ }
    async stop() { return { blob, url, duration }; }
    isRecording() { /* ... */ }
}
```

---

## Issue 7: Trascrizione IA e Integrazione API
**Priorità**: 🟢 BASSA  
**Stima**: 6 giorni  
**Label**: `feature`, `AI`, `backend`

### Descrizione
Integrare servizi di trascrizione automatica (OpenAI Whisper o Google Speech-to-Text) per convertire registrazioni audio in testo.

### Acceptance Criteria
- [ ] Endpoint backend per upload audio
- [ ] Integrazione API trascrizione (Whisper/Google)
- [ ] Visualizzazione testo trascritto sotto ogni registrazione
- [ ] Modifica manuale trascrizione
- [ ] Export trascrizioni (TXT, PDF)
- [ ] Gestione errori API
- [ ] Rate limiting e caching

### Note Tecniche
- Valutare costi API trascrizione
- Implementare queue per elaborazione asincrona
- Considerare elaborazione locale con modelli ML (future)

---

## Issue 8: Analytics e Grafici Sessione
**Priorità**: 🟡 MEDIA  
**Stima**: 4 giorni  
**Label**: `feature`, `analytics`, `charts`

### Descrizione
Implementare sezione analytics con grafici per visualizzare statistiche della lezione e andamento studenti.

### Acceptance Criteria
- [ ] Grafico presenze (presenti/assenti)
- [ ] Grafico performance (distribuzione voti)
- [ ] Andamento classe nel tempo (line chart)
- [ ] Statistiche aggregate: media voti, partecipazione
- [ ] Grafici responsive
- [ ] Export grafici come immagini PNG

### Note Tecniche
- Integrare Chart.js o similar library
- Generare dati mock per demo/testing
- Lazy loading: caricare chart solo quando sezione aperta
- Preparare endpoint API per dati real-time

```javascript
// Esempio Chart.js
import Chart from 'chart.js/auto';
new Chart(ctx, {
    type: 'bar',
    data: analyticsData,
    options: chartOptions
});
```

---

## Issue 9: Sincronizzazione Real-time (WebSocket)
**Priorità**: 🟢 BASSA  
**Stima**: 8 giorni  
**Label**: `feature`, `backend`, `realtime`

### Descrizione
Implementare sincronizzazione real-time tra dispositivi per modalità collaborativa e aggiornamenti live.

### Acceptance Criteria
- [ ] Setup server WebSocket (Socket.io / native WebSocket)
- [ ] Broadcast modifiche attività a tutti i client connessi
- [ ] Sincronizzazione valutazioni in tempo reale
- [ ] Indicatore "typing" per note collaborative
- [ ] Gestione disconnessioni e riconnessioni automatiche
- [ ] Conflict resolution per modifiche simultanee
- [ ] Presenza utenti connessi (avatars)

### Note Tecniche
- Backend Node.js con Socket.io
- Room per ogni lezione: `lesson_${lessonKey}`
- Event types: `activity_added`, `evaluation_updated`, etc.
- Fallback a polling se WebSocket non disponibile

---

## Issue 10: Export e Condivisione Sintesi Lezione
**Priorità**: 🟡 MEDIA  
**Stima**: 3 giorni  
**Label**: `feature`, `export`

### Descrizione
Implementare funzionalità di export della sintesi lezione in vari formati per condivisione e archiviazione.

### Acceptance Criteria
- [ ] Export testo plain (.txt)
- [ ] Export PDF formattato (jsPDF)
- [ ] Export DOCX (future)
- [ ] Preview prima dell'export
- [ ] Inclusione: attività, compiti, valutazioni, sintesi
- [ ] Template personalizzabile
- [ ] Invio via email (future)
- [ ] Condivisione link pubblico (future)

### Note Tecniche
- Utilizzare jsPDF per generazione PDF
- Template HTML per struttura documento
- Supportare logo istituto e personalizzazioni
- Preparare integrazione con Google Drive / OneDrive

---

## Roadmap Implementazione

### 🚀 Fase 1: Core MVP (Sprint 1-2, ~3 settimane)
**Obiettivo**: Funzionalità minime per utilizzare la pagina "In Classe"

**Issue da implementare**:
- **Issue 1**: Vista Calendario Settimanale ⭐
- **Issue 3**: Overlay Classe ⭐
- **Issue 4**: Interfaccia Sessione Lezione ⭐
- **Issue 5**: Sistema Valutazioni Rapide ⭐

**Deliverable**: Pagina funzionante con calendario, avvio sessione, gestione attività/compiti/valutazioni, persistenza localStorage.

---

### 📊 Fase 2: Analytics e Audio (Sprint 3-4, ~3 settimane)
**Obiettivo**: Aggiungere analytics e registrazione audio

**Issue da implementare**:
- **Issue 2**: Integrazione Database
- **Issue 6**: Registratore Vocale
- **Issue 8**: Analytics e Grafici
- **Issue 10**: Export Sintesi

**Deliverable**: Analytics visibili, registrazioni audio funzionanti, export PDF.

---

### 🤖 Fase 3: IA e Real-time (Sprint 5-6, ~4 settimane)
**Obiettivo**: Funzionalità avanzate con IA e sincronizzazione

**Issue da implementare**:
- **Issue 7**: Trascrizione IA
- **Issue 9**: Sincronizzazione Real-time

**Deliverable**: Trascrizioni automatiche, modalità collaborativa con sync real-time.

---

## Note Aggiuntive

### Testing
- Scrivere test per ogni issue (unit + integration)
- Test manuale su device reali (mobile, tablet, desktop)
- Test accessibilità (WCAG 2.1 AA)
- Test performance (Lighthouse score >90)

### Tecnologie
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Backend**: Node.js + Express (future)
- **Database**: localStorage (MVP), PostgreSQL/MongoDB (produzione)
- **Real-time**: Socket.io
- **AI**: OpenAI Whisper / Google Speech-to-Text
- **Charts**: Chart.js
- **Export**: jsPDF

### Metriche di Successo
- Time to Interactive < 3.5s
- Lighthouse Performance > 90
- Accessibilità WCAG 2.1 AA compliance
- Adozione: 80% docenti utilizzano la funzionalità entro 3 mesi

---

## Link e Risorse

- **Documento Completo**: [IN_CLASSE_PAGE.md](./IN_CLASSE_PAGE.md)
- **Implementazione Corrente**: [in-classe.html](/in-classe.html)
- **API Docs**: [TBD]
- **Design Figma**: [TBD]

---

**Versione**: 1.0  
**Data Creazione**: 2025-10-18  
**Autore**: Docente++ Team
