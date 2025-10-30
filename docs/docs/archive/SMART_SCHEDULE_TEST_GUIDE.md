# 🧪 Smart Daily Schedule - Test Guide

<div class="summary-box">
<h3><span class="material-icons">info</span> In questa guida troverai:</h3>
<ul>
<li>Test rapidi per verificare Smart Daily Schedule</li>
<li>Scenari di test passo-passo</li>
<li>Validazione delle nuove funzionalità di usabilità</li>
<li>Checklist completa di verifica</li>
<li>Test per progress bar, sticky headers e validazione inline</li>
</ul>
</div>

## Quick Start Testing

### Prerequisites
1. Open `index.html` in a browser
2. Complete onboarding if first time
3. Create at least:
   - 1 Class (e.g., "1A")
   - 1 Student in that class (e.g., "Luca Bianchi")
   - 1 Activity assigned to that class (e.g., "Matematica: Equazioni")

### Test Scenario 1: Complete Lesson Flow (5 min)

#### Step 1: Create Schedule Slot
1. Go to **Orario** tab
2. Click on a cell for **today's date** at 9:00
3. Select class "1A"
4. Select activity type "Teoria"
5. Click "Salva"
6. ✅ Verify: Cell shows "1A" with blue "T" badge and "Avvia" button

#### Step 2: Access from Dashboard
1. Go to **Dashboard** tab
2. Scroll to "📅 Orario di Oggi" section
3. ✅ Verify: Shows "9:00 - 1A - Teoria" with "▶ Avvia" button

#### Step 3: Start Lesson
1. Click "▶ Avvia" button
2. ✅ Verify modal opens with:
   - Header: "🎓 Avvia Lezione"
   - Info: Class 1A, today's date, 9:00
   - Badge: "Teoria" in blue
   - Step indicator: Step 1 active, Step 2 greyed
   - Activity card: "Matematica: Equazioni" with "Pianificata" badge

#### Step 4: Select Activity
1. Click on the activity card
2. ✅ Verify: Modal changes to evaluation interface
3. ✅ Verify:
   - Header gradient (purple) with "🎓 Lezione in Corso"
   - Shows: 1A, activity name, date, time (9:00 - 10:00)
   - Section: "👥 Valutazioni Studenti (1)"
   - Student card for "Luca Bianchi"

#### Step 5: Evaluate Student
1. Click grade button "8"
   - ✅ Verify: Button becomes blue/highlighted
2. Click behavior emoji "😊"
   - ✅ Verify: Emoji button has blue border
3. Type in observations: "Ottima partecipazione"
   - ✅ Verify: Text appears in textarea

#### Step 6: Add General Notes
1. Scroll to "📝 Note Generali della Lezione"
2. Type: "Spiegati concetti base equazioni"
3. ✅ Verify: Text appears in textarea

#### Step 7: End Lesson
1. Click "✅ Termina Lezione"
2. ✅ Verify alert: "✅ Progresso salvato con successo!"
3. Click OK
4. ✅ Verify alert: "✅ Lezione terminata! 1 studenti valutati"
5. Click OK
6. ✅ Verify: Modal closes, back to dashboard

#### Step 8: Verify Saved Data
1. Go to **Valutazioni** tab
2. ✅ Verify evaluation exists:
   - Student: Luca Bianchi
   - Grade: 8/10
   - Notes: "Ottima partecipazione"
   - Date: today
3. ✅ Verify in statistics:
   - Average: 8.00/10

**Expected Time**: 3-5 minutes
**Result**: ✅ PASS / ❌ FAIL

---

### Test Scenario 2: AI Suggestions (Optional - requires API key)

#### Prerequisites
1. Configure OpenRouter API key in **Impostazioni**
2. Complete Steps 1-4 from Scenario 1

#### Test Individual Suggestion
1. In evaluation modal, click "🤖 IA" button on student card
2. ✅ Verify: Loading indicator "🤖 Generazione suggerimento..."
3. ✅ Wait for response (5-10 seconds)
4. ✅ Verify: 2-3 suggestion boxes appear
5. Click on one suggestion
6. ✅ Verify: Text inserted into observations textarea
7. ✅ Verify: Textarea background flashes green briefly

#### Test Bulk Suggestions
1. Click "🤖 Suggerimenti IA per Tutti" button
2. ✅ Verify: Each student card shows loading
3. ✅ Verify: Suggestions appear sequentially (500ms delay)
4. ✅ Verify: All students have suggestions after completion

**Expected Time**: 1-2 minutes
**Result**: ✅ PASS / ❌ FAIL

---

### Test Scenario 3: Mobile Responsive (2 min)

#### Desktop → Mobile Transition
1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select "iPhone 12 Pro" or similar
4. Repeat Scenario 1 steps
5. ✅ Verify on mobile:
   - Dashboard preview stacks vertically
   - Modal is full-screen
   - Grade buttons are large (min 44px)
   - Emoji buttons are large
   - All text readable
   - No horizontal scroll
   - Buttons easy to tap

**Expected Time**: 2 minutes
**Result**: ✅ PASS / ❌ FAIL

---

### Test Scenario 4: Save Progress (3 min)

#### Intermediate Save
1. Start lesson (Steps 1-4 from Scenario 1)
2. Evaluate one student partially (only grade, no notes)
3. Click "💾 Salva Progresso"
4. ✅ Verify alert: "✅ Progresso salvato con successo!"
5. Click "Annulla Lezione" → Cancel (stay in lesson)
6. ✅ Verify: Modal still open
7. ✅ Verify: Student grade still selected
8. Add observations now
9. Click "✅ Termina Lezione"
10. ✅ Verify: Data saved correctly in Valutazioni

**Expected Time**: 3 minutes
**Result**: ✅ PASS / ❌ FAIL

---

### Test Scenario 5: Cancel Lesson (1 min)

#### Abort Flow
1. Start lesson (Steps 1-4 from Scenario 1)
2. Evaluate a student
3. Click "Annulla Lezione"
4. ✅ Verify confirm dialog: "Sei sicuro di voler annullare..."
5. Click "OK"
6. ✅ Verify: Modal closes
7. ✅ Verify: Back to dashboard
8. Go to **Valutazioni** tab
9. ✅ Verify: No new evaluation created

**Expected Time**: 1 minute
**Result**: ✅ PASS / ❌ FAIL

---

## Regression Tests

### Existing Features Still Work

#### Schedule Module
- [ ] Weekly view displays correctly
- [ ] Daily view displays correctly
- [ ] Toggle view works
- [ ] Edit slot works
- [ ] Clear slot works
- [ ] "Avvia" button in Orario tab works

#### Dashboard
- [ ] Statistics display correctly
- [ ] Active class selector works
- [ ] Other sections render

#### Activities
- [ ] Create activity works
- [ ] Edit activity works
- [ ] Status change works

#### Evaluations
- [ ] Manual evaluation creation works
- [ ] Evaluation display works
- [ ] Statistics calculate correctly

---

## Edge Cases

### No Students in Class
1. Create class without students
2. Create schedule slot for that class
3. Start lesson → Select activity
4. ✅ Verify: Shows "Nessuno studente trovato"
5. ✅ Verify: Button to add students
6. ✅ Verify: Can still end lesson (no evaluations created)

### No Activities for Class
1. Create schedule slot
2. Start lesson
3. ✅ Verify: Shows "Nessuna attività disponibile"
4. ✅ Verify: Button to create new activity
5. ✅ Verify: Modal can be closed

### Multiple Students
1. Add 5+ students to class
2. Start lesson
3. ✅ Verify: All student cards render
4. ✅ Verify: Scroll works in modal
5. Evaluate some students (not all)
6. End lesson
7. ✅ Verify: Only evaluated students saved

### Today's Schedule Empty
1. Remove all schedule slots for today
2. Go to dashboard
3. ✅ Verify: Shows "Nessuna lezione programmata per oggi"
4. ✅ Verify: "Vai all'Orario Completo" button still works

---

## Performance Tests

### Large Class (20+ students)
1. Create class with 20 students
2. Start lesson
3. ✅ Verify: Modal renders in < 2 seconds
4. ✅ Verify: Scroll is smooth
5. ✅ Verify: Button clicks responsive
6. Click "Suggerimenti IA per Tutti"
7. ✅ Verify: Completes in < 15 seconds (with delays)

### Data Persistence
1. Complete lesson with evaluations
2. Close browser completely
3. Reopen app
4. ✅ Verify: Dashboard shows correct evaluation count
5. ✅ Verify: Evaluation data intact in Valutazioni tab
6. ✅ Verify: Lesson session no longer "active"

---

## Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

---

## Accessibility

### Keyboard Navigation
- [ ] Tab through modal elements
- [ ] Enter selects buttons
- [ ] Esc closes modal
- [ ] All interactive elements focusable

### Screen Reader
- [ ] Headings read in order
- [ ] Button labels meaningful
- [ ] Form fields have labels
- [ ] Modal announces when opened

---

## Checklist Summary

### Must Pass (Critical)
- [ ] Scenario 1: Complete Lesson Flow
- [ ] Scenario 3: Mobile Responsive
- [ ] Edge Case: No Students
- [ ] Regression: All existing features work
- [ ] Data saves correctly
- [ ] Modal closes properly

### Should Pass (Important)
- [ ] Scenario 2: AI Suggestions (if API key available)
- [ ] Scenario 4: Save Progress
- [ ] Scenario 5: Cancel Lesson
- [ ] Performance: Large class
- [ ] Browser compatibility

### Nice to Have
- [ ] Accessibility tests
- [ ] All edge cases
- [ ] Performance optimization

---

## Bug Reporting Template

If you find a bug:

```
**Bug Title**: [Short description]

**Steps to Reproduce**:
1. 
2. 
3. 

**Expected Result**:

**Actual Result**:

**Screenshots**: [If applicable]

**Browser**: [e.g., Chrome 120]
**Device**: [e.g., Desktop / iPhone 12]
**Date**: [YYYY-MM-DD]
```

---

## Success Criteria

✅ **Ready for Production** if:
- All "Must Pass" scenarios work
- No critical bugs
- Mobile experience smooth
- Data saves correctly
- Performance acceptable

🔄 **Needs Iteration** if:
- Critical scenario fails
- Data loss occurs
- Mobile experience poor
- Major browser incompatibilities

❌ **Not Ready** if:
- Cannot complete basic flow
- Data corruption
- App crashes
- Unusable on mobile

---

## 🎨 Test Nuove Funzionalità Usabilità

### Test Progress Bar

**Obiettivo:** Verificare visualizzazione e aggiornamento della progress bar multi-step

**Test:**
1. Avviare una lezione dal dashboard
2. Verificare presenza progress bar in cima alla modale
3. Osservare indicatori step:
   - Step corrente evidenziato in blu
   - Step completati in verde
   - Step futuri in grigio
4. Procedere tra gli step
5. Verificare aggiornamento progress bar

**Risultato Atteso:**
- ✅ Progress bar sempre visibile
- ✅ Percentuale progresso accurata
- ✅ Indicatori step colorati correttamente
- ✅ Animazione smooth tra i passaggi

---

### Test Sticky Header Mobile

**Obiettivo:** Verificare header fisso durante scroll su dispositivi mobili

**Test:**
1. Aprire DevTools, modalità mobile (iPhone/Android)
2. Avviare una lezione
3. Scrollare contenuto modale verso il basso
4. Verificare che header rimanga visibile in cima
5. Testare su più dimensioni viewport

**Risultato Atteso:**
- ✅ Header rimane fisso durante scroll
- ✅ Titolo e informazioni lezione sempre visibili
- ✅ Pulsante chiudi sempre accessibile
- ✅ Nessun overlap con contenuto

---

### Test Validazione Inline

**Obiettivo:** Verificare feedback localizzato nei campi di valutazione

**Test:**
1. Durante valutazione studente, inserire dati invalidi
2. Osservare feedback immediato accanto ai campi
3. Correggere i dati
4. Verificare cambio feedback a positivo

**Risultato Atteso:**
- ✅ Messaggio errore appare sotto il campo specifico
- ✅ Icona rossa + testo rosso per errore
- ✅ Icona verde + testo verde per validazione OK
- ✅ Bordo campo cambia colore in base a validità

---

### Test Autofocus Form

**Obiettivo:** Verificare navigazione rapida con tastiera

**Test:**
1. Aprire form di valutazione studente
2. Compilare primo campo
3. Premere Invio
4. Verificare passaggio automatico al campo successivo
5. Continuare fino alla fine del form

**Risultato Atteso:**
- ✅ Invio sposta al campo successivo
- ✅ Focus visibile chiaramente
- ✅ Tab continua a funzionare normalmente
- ✅ Non va al submit prematuramente

---

### Test Collapsible Sections (FAQ)

**Obiettivo:** Verificare sezioni espandibili nella documentazione

**Test:**
1. Navigare in una pagina con sezioni collapsibili
2. Cliccare sull'header di una sezione
3. Osservare espansione contenuto
4. Cliccare nuovamente sull'header
5. Osservare collasso contenuto

**Risultato Atteso:**
- ✅ Contenuto si espande/collassa con animazione fluida
- ✅ Icona freccia ruota di 180° quando espansa
- ✅ Multipli pannelli funzionano indipendentemente
- ✅ Nessun scatto o jump improvvisi

---

### Test Back to Top Button

**Obiettivo:** Verificare pulsante "Torna su" durante scroll

**Test:**
1. Aprire una pagina lunga (Dashboard con molti dati)
2. Scrollare verso il basso oltre 300px
3. Osservare apparizione pulsante floating in basso a destra
4. Cliccare sul pulsante
5. Verificare scroll smooth verso l'alto

**Risultato Atteso:**
- ✅ Pulsante appare solo dopo 300px di scroll
- ✅ Icona freccia verso l'alto visibile
- ✅ Click riporta in cima con animazione smooth
- ✅ Su mobile: pulsante 44x44px minimo
- ✅ Hover effect funziona su desktop

---

## 📋 Checklist Usabilità Completa

### Progress Bar
- [ ] Visualizzata in tutte le modali multi-step
- [ ] Step corrente evidenziato correttamente
- [ ] Step completati mostrati in verde
- [ ] Percentuale progresso accurata
- [ ] Animazioni fluide

### Mobile Optimization
- [ ] Sticky header funziona su mobile
- [ ] Touch targets 44x44px minimo
- [ ] Layout responsive si adatta
- [ ] Autofocus campi attivo
- [ ] Scroll smooth su mobile

### Validazione e Feedback
- [ ] Validazione inline attiva
- [ ] Messaggi localizzati accanto ai campi
- [ ] Icone colorate (verde/rosso)
- [ ] Bordi campo cambiano colore
- [ ] Toast conferma operazioni

### Navigazione e Ricerca
- [ ] Back to Top appare dopo scroll
- [ ] Scroll smooth al click
- [ ] Sezioni collapsibili funzionano
- [ ] Ricerca istantanea attiva (se presente)
- [ ] Sidebar navigazione sticky (se presente)

---

**Last Updated**: January 2025
**Version**: 2.0 (with Usability Improvements)
