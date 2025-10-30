# 📅 Smart Daily Schedule Management - Guida Completa

## Panoramica

Il sistema di gestione intelligente dell'orario giornaliero consente ai docenti di:
- Accedere rapidamente all'orario di oggi dalla dashboard
- Avviare lezioni con selezione guidata delle attività
- Valutare gli studenti durante la lezione con suggerimenti IA
- Registrare osservazioni in itinere personalizzabili

## Flusso Completo

### 1. Dashboard - Accesso Rapido

**Posizione**: Tab Dashboard → Sezione "📅 Orario di Oggi"

**Funzionalità**:
- Visualizza automaticamente tutte le lezioni programmate per oggi
- Mostra orario, classe e tipo di attività (Teoria/Disegno/Laboratorio)
- Pulsante "▶ Avvia" per ogni slot per iniziare immediatamente la lezione
- Pulsante "📋 Vai all'Orario Completo" per accedere alla vista completa

**Screenshot**: Dashboard con orario del giorno

### 2. Selezione Attività (Step 1)

**Trigger**: Click sul pulsante "▶ Avvia" 

**Interfaccia Modale**:
```
🎓 Avvia Lezione
-----------------
[Classe] [Data - Ora] [Badge Tipo Attività]

[Indicatore Step: 1 Seleziona Attività → 2 Valuta Studenti]

[🤖 Suggerimenti IA] (se API key configurata)
- Analisi contestuale del momento migliore per ogni attività
- Suggerimenti basati su: classe, data, ora, giorno settimana, attività disponibili
- Pulsante "🔄 Rigenera Suggerimenti"

📝 Attività In Corso
- [Card attività con titolo, tipo, scadenza, badge "In corso"]

📋 Attività Pianificate  
- [Card attività con titolo, tipo, scadenza, badge "Pianificata"]

[Annulla]
```

**Funzionalità**:
- Attività raggruppate per stato (In corso, Pianificate)
- Click su una card per selezionare l'attività
- Suggerimenti IA contestuali (opzionali)
- Creazione nuova attività se nessuna disponibile

### 3. Valutazione Studenti (Step 2)

**Trigger**: Selezione di un'attività

**Interfaccia Modale**:
```
🎓 Lezione in Corso
-------------------
[Header Gradiente: Classe | Attività | Data/Ora]

👥 Valutazioni Studenti (N)   [🤖 Suggerimenti IA per Tutti]

[Per ogni studente:]
┌─────────────────────────────┐
│ Nome Studente      [🤖 IA]  │
│                              │
│ Voto                         │
│ [4][5][6][7][8][9][10]      │
│                              │
│ Comportamento                │
│ [😊] [😐] [😟]              │
│                              │
│ Osservazioni                 │
│ [Textarea]                   │
│ [Suggerimenti IA cliccabili] │
└─────────────────────────────┘

📝 Note Generali della Lezione
[Textarea per note globali]

[Annulla Lezione] [💾 Salva Progresso] [✅ Termina Lezione]
```

**Funzionalità Valutazione**:

#### Voto (4-10)
- Pulsanti touch-friendly (min 36px)
- Selezione visiva immediata (evidenziazione blu)
- Salvataggio automatico alla selezione

#### Comportamento (Emoji)
- 😊 Positivo
- 😐 Neutro  
- 😟 Negativo
- Selezione visiva con bordo blu

#### Osservazioni
- Textarea per note dettagliate
- Placeholder suggestivo
- Dimensione automatica (min 60px)

#### Suggerimenti IA

**Individuale** (pulsante 🤖 IA per studente):
- Genera 2-3 suggerimenti contestuali
- Basati su: nome studente, classe, attività, data
- Suggerimenti cliccabili che si auto-inseriscono nel textarea
- Formato: brevi osservazioni (max 10 parole ciascuna)

**Tutti** (pulsante in alto):
- Genera suggerimenti per tutti gli studenti
- Delay 500ms tra richieste per evitare rate limiting
- Indicatore di caricamento per ogni studente

**Esempio Suggerimenti**:
```
💡 Suggerimenti IA:
- Ottima comprensione concetti base
- Partecipazione attiva discussione
- Necessita supporto esercizi pratici
```

### 4. Completamento Lezione

**Salva Progresso**:
- Salva tutti i dati inseriti
- Mantiene la sessione attiva
- Permette di continuare dopo

**Termina Lezione**:
- Salva tutti i dati
- Crea valutazioni nel sistema
- Chiude la sessione
- Mostra riepilogo: "✅ Lezione terminata! N studenti valutati"
- Torna alla dashboard

**Annulla Lezione**:
- Richiede conferma
- Elimina la sessione
- Non salva i dati
- Torna alla dashboard

## Strutture Dati

### Lesson Session
```javascript
{
  id: timestamp,
  date: ISO date string,
  hour: number (8-13),
  classId: number,
  className: string,
  activityId: number,
  activityTitle: string,
  activityType: string,
  startTime: ISO timestamp,
  endTime: ISO timestamp | null,
  studentEvaluations: [StudentEvaluation],
  notes: string,
  status: 'active' | 'completed'
}
```

### Student Evaluation
```javascript
{
  studentId: number,
  grade: number | null (4-10),
  behavior: 'positivo' | 'neutro' | 'negativo' | null,
  observations: string,
  aiSuggestion: string | null
}
```

### Schedule Slot
```javascript
{
  classId: number,
  activityType: 'theory' | 'drawing' | 'lab'
}
```

## Integrazione IA

### API: OpenRouter

**Requisiti**:
- API Key configurata in Impostazioni
- Modello: alibaba/tongyi-deepresearch-30b-a3b (o altro compatibile)

### Chiamate IA

#### 1. Suggerimenti Attività
```javascript
Prompt:
- Contesto: classe, data, ora, giorno settimana
- Attività disponibili con stati e scadenze
- Output: 2-3 righe con raccomandazione

Esempio risposta:
"Consiglio di svolgere 'Equazioni di Primo Grado' (pianificata) 
poiché è martedì mattina, ideale per argomenti teorici. 
Considerare anche la scadenza prossima della verifica."
```

#### 2. Suggerimenti Osservazioni
```javascript
Prompt:
- Studente: nome
- Contesto: classe, attività, tipo, data
- Output: 2-3 punti (max 10 parole ciascuno)

Esempio risposta:
"- Ottima comprensione concetti base
 - Partecipazione attiva discussione
 - Necessita supporto esercizi pratici"
```

## Design Mobile-First

### Responsive Breakpoints

**Mobile (< 768px)**:
- Modal a schermo intero
- Pulsanti min 44px (iOS standard)
- Layout verticale singola colonna
- Font-size 16px per evitare zoom iOS

**Tablet (769-1024px)**:
- Griglia 2 colonne per card studenti
- Modal max-width 900px

**Desktop (> 1025px)**:
- Griglia 3 colonne per card studenti
- Modal max-width 900px

### Touch-Friendly

- Pulsanti min 36px altezza
- Spacing adeguato tra elementi (8-12px)
- Hover effects solo su dispositivi con mouse
- Active states per feedback tattile
- Smooth transitions (0.2s)

## Testing

### Test Manuali

#### 1. Dashboard Preview
- [ ] Verifica visualizzazione slot oggi
- [ ] Click "Avvia" apre modal
- [ ] "Vai all'Orario Completo" naviga correttamente
- [ ] Aggiornamento automatico dopo modifica schedule

#### 2. Selezione Attività
- [ ] Modal mostra classe, data, ora corretti
- [ ] Step indicator corretto (Step 1 attivo)
- [ ] Attività raggruppate per stato
- [ ] Click su attività procede a Step 2
- [ ] Pulsante Annulla chiude modal

#### 3. Valutazione Studenti  
- [ ] Header mostra info lezione
- [ ] Card per ogni studente
- [ ] Selezione voto funziona
- [ ] Selezione comportamento funziona
- [ ] Textarea osservazioni funziona
- [ ] Salva Progresso salva dati
- [ ] Termina Lezione completa e salva
- [ ] Annulla chiede conferma

#### 4. Suggerimenti IA
- [ ] Pulsante IA singolo genera suggerimenti
- [ ] Suggerimenti cliccabili si inseriscono
- [ ] Pulsante "Tutti" genera per tutti
- [ ] Loading indicator durante generazione
- [ ] Gestione errori API

#### 5. Mobile
- [ ] Layout responsive
- [ ] Pulsanti facilmente toccabili
- [ ] Scroll fluido in modal
- [ ] Textarea non causa zoom iOS
- [ ] Transizioni smooth

### Test Scenari

#### Scenario 1: Lezione Completa
1. Aprire dashboard
2. Click "▶ Avvia" su uno slot
3. Selezionare attività
4. Valutare tutti gli studenti (voto + comportamento + note)
5. Aggiungere note generali
6. Click "Termina Lezione"
7. Verificare salvataggio in tab Valutazioni

#### Scenario 2: Salvataggio Intermedio
1. Avviare lezione
2. Valutare alcuni studenti
3. Click "Salva Progresso"
4. Chiudere browser
5. Riaprire app
6. Verificare dati salvati

#### Scenario 3: Suggerimenti IA
1. Configurare API key
2. Avviare lezione
3. Click "🤖 IA" su uno studente
4. Verificare suggerimenti generati
5. Click su un suggerimento
6. Verificare inserimento in textarea

## File Modificati

### app.js
- `lessonSessions` array
- `currentLessonSession` object
- `renderTodaySchedulePreview()`
- `goToTodaySchedule()`
- `startLessonSession()`
- `showSmartActivitySelectionModal()`
- `generateActivitySuggestions()`
- `selectActivityForSession()`
- `createLessonSession()`
- `showStudentEvaluationInterface()`
- `renderStudentEvaluationCard()`
- `setStudentGrade()`
- `setStudentBehavior()`
- `generateEvaluationSuggestion()`
- `applySuggestion()`
- `generateAllEvaluationSuggestions()`
- `saveLessonSessionProgress()`
- `endLessonSession()`
- `cancelLessonSession()`
- `closeSmartActivityModal()`

### index.html
- Dashboard: sezione "Orario di Oggi"
- Container `today-schedule-preview`
- Pulsante "Vai all'Orario Completo"

### styles.css
- `.today-schedule-section`
- `.today-schedule-list`
- `.today-schedule-item`
- `.lesson-session-modal`
- `.student-evaluation-modal`
- `.lesson-session-header`
- `.student-eval-card`
- `.grade-btn`, `.behavior-btn`
- `.step-indicator`
- `.ai-suggestion-section`
- Media queries responsive

## Limitazioni Note

1. **IA Opzionale**: Tutte le funzionalità IA richiedono API key configurata
2. **Rate Limiting**: Suggerimenti bulk hanno delay 500ms tra richieste
3. **Browser LocalStorage**: Dati salvati solo in locale
4. **Orario Fisso**: Slot dalle 8:00 alle 14:00, lun-ven
5. **Attività Prerequisito**: Serve almeno un'attività creata per la classe

## Sviluppi Futuri

- [ ] Export sessioni lezione in PDF/Excel
- [ ] Template osservazioni personalizzabili
- [ ] Confronto prestazioni studenti nel tempo
- [ ] Notifiche push per lezioni imminenti
- [ ] Sincronizzazione cloud opzionale
- [ ] Supporto registrazione audio osservazioni
- [ ] Grafici avanzamento studenti
- [ ] Import/export valutazioni bulk

## FAQ

**Q: I suggerimenti IA non funzionano**
A: Verifica che la API key OpenRouter sia configurata in Impostazioni

**Q: Non vedo le lezioni di oggi**
A: Assicurati di aver creato slot nell'orario per la data odierna

**Q: Come modifico una valutazione?**
A: Le valutazioni sono registrate al termine lezione. Modificale nel tab Valutazioni

**Q: Posso valutare solo alcuni studenti?**
A: Sì, compila solo le card desiderate. Gli altri non saranno salvati

**Q: Come funziona "Salva Progresso"?**
A: Salva i dati correnti ma mantiene la sessione attiva per continuare dopo

---

**Versione**: 1.0
**Data**: Ottobre 2025
**Autore**: Docente++ Team
