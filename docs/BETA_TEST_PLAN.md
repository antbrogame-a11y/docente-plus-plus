# 🧪 Piano di Test Beta - Docente++

## 📋 Panoramica

Questo documento fornisce un piano di test completo per validare tutte le funzionalità di **Docente++** prima del rilascio della versione Beta 1.0.

**Obiettivo:** Garantire che tutte le funzionalità esistenti funzionino correttamente e siano pronte per l'uso in produzione.

---

## 🎯 Metodologia di Test

### Tipi di Test

1. **Test Funzionali:** Verificano che ogni funzionalità produca il risultato atteso
2. **Test di Usabilità:** Valutano facilità d'uso e user experience
3. **Test di Integrazione:** Verificano interazione tra componenti
4. **Test Cross-Browser:** Verificano compatibilità browser
5. **Test Mobile:** Verificano funzionamento su dispositivi mobili
6. **Test PWA:** Verificano installazione e funzionamento offline

### Criteri di Successo

- ✅ **Pass:** Funzionalità opera come previsto
- ⚠️ **Warning:** Funzionalità opera con limitazioni minori
- ❌ **Fail:** Funzionalità non opera o presenta bug critici
- ⏸️ **Skip:** Test non applicabile o rimandato

---

## 1️⃣ Test Onboarding e Primo Accesso

### Test Case 1.1: Primo Avvio App
**Obiettivo:** Verificare apertura modal onboarding al primo accesso

**Passi:**
1. Aprire app in browser (localStorage vuoto)
2. Verificare apertura automatica modal onboarding
3. Verificare presenza di tutti i campi obbligatori

**Risultato Atteso:**
- Modal si apre automaticamente
- Campi obbligatori marcati con *
- Form non inviabile senza compilare campi obbligatori

**Stato:** [ ]

---

### Test Case 1.2: Compilazione Onboarding Completo
**Obiettivo:** Verificare salvataggio dati onboarding

**Passi:**
1. Compilare tutti i campi obbligatori:
   - Nome: Mario
   - Cognome: Rossi
   - Email: mario.rossi@scuola.it
   - Ordine scuola: Secondaria di I Grado
   - Discipline: Italiano, Storia
   - Anno scolastico: 2024/2025
2. Click su "Inizia ad Usare Docente++"
3. Verificare chiusura modal
4. Verificare accesso a dashboard

**Risultato Atteso:**
- Modal si chiude
- Dashboard visibile
- Dati salvati in localStorage
- Nome docente visibile in impostazioni

**Stato:** [ ]

---

## 2️⃣ Test Gestione Classi

### Test Case 2.1: Creazione Classe
**Obiettivo:** Creare nuova classe

**Passi:**
1. Navigare a tab "Classi"
2. Click su "➕ Nuova Classe"
3. Compilare form:
   - Nome: 2A
   - Livello: Seconda Media
   - Anno scolastico: 2024/2025
4. Click "Salva Classe"

**Risultato Atteso:**
- Classe appare in lista classi
- Classe disponibile in selettori
- Messaggio conferma creazione

**Stato:** [ ]

---

### Test Case 2.2: Modifica Classe
**Obiettivo:** Modificare classe esistente

**Passi:**
1. Click su "✏️" su classe creata
2. Modificare nome da "2A" a "2A - Sezione A"
3. Click "Salva Modifiche"

**Risultato Atteso:**
- Nome aggiornato in lista
- Modifiche persistono dopo refresh pagina

**Stato:** [ ]

---

### Test Case 2.3: Eliminazione Classe
**Obiettivo:** Eliminare classe

**Passi:**
1. Click su "🗑️" su una classe
2. Confermare eliminazione

**Risultato Atteso:**
- Classe rimossa da lista
- Conferma richiesta prima di eliminazione
- Studenti associati gestiti correttamente

**Stato:** [ ]

---

## 3️⃣ Test Gestione Studenti

### Test Case 3.1: Aggiunta Studente Manuale
**Obiettivo:** Aggiungere studente tramite form

**Passi:**
1. Navigare a tab "Studenti"
2. Click "➕ Nuovo Studente"
3. Compilare:
   - Nome: Giovanni
   - Cognome: Bianchi
   - Classe: 2A
4. Click "Salva Studente"

**Risultato Atteso:**
- Studente appare in lista
- Associato correttamente a classe
- Contatore studenti aggiornato

**Stato:** [ ]

---

### Test Case 3.2: Import Studenti da CSV
**Obiettivo:** Importare lista studenti da file CSV

**Passi:**
1. Creare file CSV:
   ```
   Nome,Cognome,Classe
   Luca,Verdi,2A
   Anna,Neri,2A
   Marco,Blu,2A
   ```
2. Click "📥 Importa da CSV"
3. Selezionare file
4. Verificare preview dati
5. Click "Conferma Importazione"

**Risultato Atteso:**
- 3 studenti importati
- Tutti associati a classe 2A
- Nessun duplicato
- Messaggio conferma

**Stato:** [ ]

---

### Test Case 3.3: Visualizzazione Scheda Studente
**Obiettivo:** Visualizzare dettagli studente

**Passi:**
1. Click su studente in lista
2. Verificare apertura scheda dettaglio

**Risultato Atteso:**
- Modal/sezione con info studente
- Storico valutazioni
- Note e osservazioni
- Possibilità modifica

**Stato:** [ ]

---

## 4️⃣ Test Gestione Lezioni

### Test Case 4.1: Creazione Lezione Manuale
**Obiettivo:** Creare lezione manualmente

**Passi:**
1. Tab "Lezioni"
2. Click "➕ Nuova Lezione"
3. Compilare:
   - Titolo: Analisi del testo poetico
   - Materia: Italiano
   - Data: [oggi]
   - Ora: 09:00
   - Descrizione: Analisi metrica e figure retoriche
4. Click "Salva Lezione"

**Risultato Atteso:**
- Lezione in lista lezioni
- Ordinata per data
- Contatore dashboard aggiornato

**Stato:** [ ]

---

### Test Case 4.2: Generazione Lezione con IA
**Obiettivo:** Generare lezione usando IA (richiede API key)

**Prerequisiti:** API key OpenRouter configurata

**Passi:**
1. Click "🤖 Genera con IA"
2. Inserire prompt: "Lezione di grammatica italiana sul congiuntivo per seconda media"
3. Click "Genera"
4. Attendere risposta IA

**Risultato Atteso:**
- Lezione generata con contenuto strutturato
- Possibilità modificare prima di salvare
- Salvataggio opzionale

**Stato:** [ ] (Skip se no API key)

---

### Test Case 4.3: Modifica/Eliminazione Lezione
**Obiettivo:** Modificare ed eliminare lezione

**Passi:**
1. Click "✏️" su lezione
2. Modificare titolo
3. Salvare
4. Click "🗑️" per eliminare
5. Confermare

**Risultato Atteso:**
- Modifiche salvate correttamente
- Eliminazione con conferma
- Lezione rimossa da lista

**Stato:** [ ]

---

## 5️⃣ Test Orario Didattico

### Test Case 5.1: Creazione Orario Settimanale
**Obiettivo:** Configurare orario settimanale

**Passi:**
1. Tab "Orario"
2. Selezionare giorno (es. Lunedì)
3. Selezionare ora (es. 8:00)
4. Click su cella
5. Compilare:
   - Classe: 2A
   - Materia: Italiano
   - Tipo attività: Lezione
6. Salvare

**Risultato Atteso:**
- Cella orario popolata
- Colore distintivo per materia
- Info visibili su hover

**Stato:** [ ]

---

### Test Case 5.2: Visualizzazione Orario di Oggi
**Obiettivo:** Verificare preview orario giornaliero in dashboard

**Passi:**
1. Configurare almeno 2 slot per oggi
2. Tornare a dashboard
3. Verificare sezione "Orario di Oggi"

**Risultato Atteso:**
- Slot di oggi visibili
- Pulsante "Avvia" per ogni slot
- Link a orario completo funzionante

**Stato:** [ ]

---

### Test Case 5.3: Quick Start Lezione da Orario
**Obiettivo:** Avviare lezione da cella orario

**Passi:**
1. Click "Avvia" su slot in "Orario di Oggi"
2. Verificare apertura modal selezione attività

**Risultato Atteso:**
- Modal mostra classe e ora corrette
- Possibilità selezionare attività
- Workflow guidato verso valutazione studenti

**Stato:** [ ]

---

## 6️⃣ Test Gestione Attività

### Test Case 6.1: Creazione Attività Didattica
**Obiettivo:** Creare nuova attività

**Passi:**
1. Tab "Attività"
2. Click "➕ Nuova Attività"
3. Compilare:
   - Titolo: Verifica grammatica
   - Tipo: Verifica
   - Classe: 2A
   - Data scadenza: [data futura]
   - Descrizione: Test congiuntivo
4. Salvare

**Risultato Atteso:**
- Attività in lista
- Badge stato "Da completare"
- Notifica scadenza se abilitata

**Stato:** [ ]

---

### Test Case 6.2: Import Attività da Documento
**Obiettivo:** Importare attività da file (richiede IA)

**Prerequisiti:** API key configurata

**Passi:**
1. Tab "🤖 Importa/gestisci con IA"
2. Sezione "📂 Importazione Documenti"
3. Upload file TXT/PDF con piano attività
4. Attendere classificazione IA
5. Selezionare "Piano Attività"
6. Click "Elabora"

**Risultato Atteso:**
- IA estrae attività da documento
- Preview attività estratte
- Possibilità confermare importazione
- Attività aggiunte a lista

**Stato:** [ ] (Skip se no API key)

---

### Test Case 6.3: Modifica Stato Attività
**Obiettivo:** Cambiare stato attività

**Passi:**
1. Click su attività
2. Cambiare stato da "Da completare" a "Completata"
3. Salvare

**Risultato Atteso:**
- Badge stato aggiornato
- Attività spostata in sezione "Completate"
- Contatore aggiornato

**Stato:** [ ]

---

## 7️⃣ Test Valutazioni

### Test Case 7.1: Creazione Griglia di Valutazione
**Obiettivo:** Creare griglia personalizzata

**Passi:**
1. Tab "Valutazioni"
2. Sezione "Griglie di Valutazione"
3. Click "➕ Nuova Griglia"
4. Compilare:
   - Nome: Griglia Verifica Scritta
   - Disciplina: Italiano
   - Livelli: Eccellente (10), Buono (8), Sufficiente (6), Insufficiente (4)
5. Salvare

**Risultato Atteso:**
- Griglia in lista
- Riutilizzabile per valutazioni
- Modificabile successivamente

**Stato:** [ ]

---

### Test Case 7.2: Valutazione Studenti da Orario
**Obiettivo:** Valutare studenti durante lezione

**Passi:**
1. Dashboard → Click "Avvia" su slot orario
2. Selezionare attività
3. Procedere a Step 2: Valutazione Studenti
4. Selezionare studente
5. Inserire voto/osservazione
6. Salvare

**Risultato Atteso:**
- Lista studenti classe visibile
- Possibilità valutare singolarmente
- Voti/osservazioni salvati
- Associati a studente e attività

**Stato:** [ ]

---

### Test Case 7.3: Suggerimenti IA per Valutazione
**Obiettivo:** Ottenere suggerimenti IA (richiede API key)

**Prerequisiti:** API key configurata

**Passi:**
1. Durante valutazione studente
2. Click "🤖 IA" su studente
3. Attendere suggerimenti

**Risultato Atteso:**
- IA genera suggerimenti contestuali
- Basati su storico studente
- Possibilità inserire in note

**Stato:** [ ] (Skip se no API key)

---

## 8️⃣ Test Notifiche

### Test Case 8.1: Configurazione Notifiche
**Obiettivo:** Abilitare notifiche browser

**Passi:**
1. Tab "Notifiche"
2. Click "Abilita Notifiche"
3. Accettare permesso browser

**Risultato Atteso:**
- Permesso richiesto
- Se accettato, notifiche abilitate
- Indicatore stato visibile

**Stato:** [ ]

---

### Test Case 8.2: Ricezione Notifica Scadenza
**Obiettivo:** Verificare notifica per scadenza attività

**Prerequisiti:** Notifiche abilitate

**Passi:**
1. Creare attività con scadenza domani
2. Verificare notifica (o simularla modificando data)

**Risultato Atteso:**
- Notifica mostrata
- Contenuto corretto (titolo attività, scadenza)
- Click porta a sezione attività

**Stato:** [ ] (Difficile testare senza aspettare)

---

## 9️⃣ Test News RSS

### Test Case 9.1: Aggiunta Fonte RSS
**Obiettivo:** Aggiungere feed RSS/Atom

**Passi:**
1. Tab "📰 News"
2. Compilare form:
   - Nome: MIUR
   - URL: https://www.miur.gov.it/web/guest/home?p_p_state=rss
   - Categoria: Istruzione
3. Click "Aggiungi Fonte"

**Risultato Atteso:**
- Fonte aggiunta a lista
- News caricate (se feed valido)
- Possibilità filtrare per fonte

**Stato:** [ ]

---

### Test Case 9.2: Analisi News con IA
**Obiettivo:** Analizzare articolo con IA (richiede API key)

**Prerequisiti:** API key configurata, almeno una news caricata

**Passi:**
1. Click "🤖 Analizza con IA" su news
2. Modal agente IA si apre con URL precompilato
3. Click su analisi predefinita (es. "📅 Date e Scadenze")
4. Attendere risultato

**Risultato Atteso:**
- IA analizza contenuto news
- Estrae informazioni richieste
- Possibilità creare azioni da risultato

**Stato:** [ ] (Skip se no API key)

---

## 🔟 Test Assistente IA

### Test Case 10.1: Chat con Assistente IA
**Obiettivo:** Interagire con assistente IA (richiede API key)

**Prerequisiti:** API key configurata

**Passi:**
1. Tab "Assistente IA"
2. Digitare messaggio: "Suggeriscimi 5 attività per una classe di seconda media su grammatica italiana"
3. Inviare
4. Attendere risposta

**Risultato Atteso:**
- Messaggio inviato appare in chat
- Risposta IA generata
- Conversazione mantiene contesto
- Possibilità inviare follow-up

**Stato:** [ ] (Skip se no API key)

---

### Test Case 10.2: FAB Agente IA Fluttuante
**Obiettivo:** Accesso rapido a IA da qualsiasi pagina

**Passi:**
1. Navigare a diverse tab (Classi, Studenti, ecc.)
2. Verificare presenza FAB (icona 🤖 bottom-right)
3. Click su FAB
4. Verificare apertura modal agente IA

**Risultato Atteso:**
- FAB sempre visibile
- Click apre modal
- Modal contestuale a pagina corrente

**Stato:** [ ]

---

## 1️⃣1️⃣ Test Import/Export Dati

### Test Case 11.1: Esportazione Dati JSON
**Obiettivo:** Esportare tutti i dati in JSON

**Passi:**
1. Tab "Impostazioni"
2. Sezione "Import/Export Dati"
3. Click "📥 Esporta Dati"
4. Selezionare formato "JSON"
5. Download file

**Risultato Atteso:**
- File JSON scaricato
- Contiene tutti i dati (classi, studenti, lezioni, ecc.)
- File valido e parsable
- Nome file con timestamp

**Stato:** [ ]

---

### Test Case 11.2: Esportazione Dati PDF
**Obiettivo:** Esportare report in PDF

**Passi:**
1. Click "📥 Esporta Dati"
2. Selezionare formato "PDF"
3. Download file

**Risultato Atteso:**
- File PDF scaricato
- Contiene report formattato
- Tabelle leggibili
- Grafici/statistiche (se implementati)

**Stato:** [ ]

---

### Test Case 11.3: Importazione Dati da Backup
**Obiettivo:** Ripristinare dati da file JSON

**Passi:**
1. Esportare dati (creare backup)
2. Eliminare alcuni dati o resettare app
3. Click "📤 Importa Dati"
4. Selezionare file JSON backup
5. Confermare importazione

**Risultato Atteso:**
- Dati ripristinati correttamente
- Nessun dato perso
- Nessun duplicato
- Messaggio conferma

**Stato:** [ ]

---

## 1️⃣2️⃣ Test Impostazioni

### Test Case 12.1: Configurazione API Key OpenRouter
**Obiettivo:** Salvare API key

**Passi:**
1. Tab "Impostazioni"
2. Sezione "API OpenRouter"
3. Inserire API key: `sk-or-v1-...`
4. Click "Salva Impostazioni"

**Risultato Atteso:**
- Key salvata in localStorage
- Indicatore IA "attiva" in dashboard
- Funzionalità IA disponibili

**Stato:** [ ]

---

### Test Case 12.2: Modifica Profilo Docente
**Obiettivo:** Aggiornare dati profilo

**Passi:**
1. Sezione "Profilo Docente"
2. Modificare email
3. Aggiungere disciplina
4. Salvare

**Risultato Atteso:**
- Modifiche salvate
- Persistono dopo refresh
- Visibili dove utilizzate (es. discipline in form)

**Stato:** [ ]

---

### Test Case 12.3: Reset Applicazione
**Obiettivo:** Reset completo dati app

**Passi:**
1. Click "🗑️ Reset Applicazione"
2. Confermare reset
3. Verificare ritorno a onboarding

**Risultato Atteso:**
- Tutti i dati cancellati
- localStorage svuotato
- App torna a stato iniziale
- Onboarding si riapre

**Stato:** [ ]

---

## 1️⃣3️⃣ Test PWA e Offline

### Test Case 13.1: Installazione PWA
**Obiettivo:** Installare app come PWA

**Passi:**
1. Aprire app in Chrome/Edge
2. Click su icona "Installa" nella barra indirizzi
3. Confermare installazione
4. Aprire app installata

**Risultato Atteso:**
- App installata su sistema
- Si apre in finestra standalone
- Icona in app drawer/desktop
- Funziona come app nativa

**Stato:** [ ]

---

### Test Case 13.2: Funzionamento Offline
**Obiettivo:** Verificare funzionamento senza connessione

**Prerequisiti:** App visitata almeno una volta (cache popolata)

**Passi:**
1. Aprire DevTools → Network
2. Impostare "Offline"
3. Ricaricare app
4. Provare a navigare tra tab

**Risultato Atteso:**
- App si carica correttamente
- Navigazione funziona
- Dati locali accessibili
- Solo funzionalità IA non disponibili

**Stato:** [ ]

---

### Test Case 13.3: Service Worker Updates
**Obiettivo:** Verificare aggiornamento service worker

**Passi:**
1. Aprire Console → Application → Service Workers
2. Verificare service worker attivo
3. Click "Update"

**Risultato Atteso:**
- Service worker aggiorna
- Cache aggiornata
- App continua a funzionare

**Stato:** [ ]

---

## 1️⃣4️⃣ Test Cross-Browser

### Test Case 14.1: Chrome/Edge
**Obiettivo:** Verificare funzionamento su browser Chromium

**Passi:**
1. Aprire app in Chrome
2. Testare funzionalità chiave:
   - Onboarding
   - CRUD classi/studenti
   - Salvataggio dati
   - IA (se API key)

**Risultato Atteso:**
- Tutte le funzionalità operative
- UI corretta
- Nessun errore console

**Stato:** [ ]

---

### Test Case 14.2: Firefox
**Obiettivo:** Verificare compatibilità Firefox

**Passi:**
1. Aprire app in Firefox
2. Testare funzionalità chiave

**Risultato Atteso:**
- Funzionalità operative
- LocalStorage funzionante
- Possibili differenze minori UI

**Stato:** [ ]

---

### Test Case 14.3: Safari (macOS/iOS)
**Obiettivo:** Verificare compatibilità Safari

**Passi:**
1. Aprire app in Safari
2. Testare funzionalità chiave
3. Testare installazione iOS ("Aggiungi a Home")

**Risultato Atteso:**
- App funzionante
- LocalStorage OK
- PWA installabile su iOS

**Stato:** [ ] (Se disponibile dispositivo Apple)

---

## 1️⃣5️⃣ Test Mobile e Responsive

### Test Case 15.1: Layout Mobile
**Obiettivo:** Verificare responsive design

**Passi:**
1. Aprire DevTools → Toggle Device Toolbar
2. Testare su vari viewport:
   - iPhone SE (375px)
   - iPhone 12 Pro (390px)
   - iPad (768px)
3. Verificare navigazione, form, tabelle

**Risultato Atteso:**
- Layout si adatta
- Testi leggibili
- Pulsanti toccabili (min 44px)
- Nessun overflow orizzontale
- Menu/tab responsive

**Stato:** [ ]

---

### Test Case 15.2: Touch Interactions
**Obiettivo:** Verificare interazioni touch

**Passi:**
1. Su dispositivo touch (o simulato)
2. Testare:
   - Tap pulsanti
   - Scroll liste
   - Modal touch-outside per chiudere
   - Swipe (se implementato)

**Risultato Atteso:**
- Tutte le interazioni funzionano
- Nessun conflitto tap/click
- Feedback visivo su tap

**Stato:** [ ]

---

## 📊 Report Test e Tracking

### Template Report Singolo Test

```markdown
**Test Case:** [Numero e Nome]
**Data Test:** YYYY-MM-DD
**Tester:** [Nome]
**Browser/Device:** [es. Chrome 120 / Windows 11]
**Risultato:** ✅ Pass / ⚠️ Warning / ❌ Fail

**Note:**
- [Osservazioni]
- [Bug trovati]
- [Suggerimenti]

**Screenshot:** [Se rilevante]
```

### Tracking Complessivo

| Categoria | Totale Test | Pass | Warning | Fail | Skip | % Successo |
|-----------|-------------|------|---------|------|------|------------|
| Onboarding | 2 | - | - | - | - | - |
| Classi | 3 | - | - | - | - | - |
| Studenti | 3 | - | - | - | - | - |
| Lezioni | 3 | - | - | - | - | - |
| Orario | 3 | - | - | - | - | - |
| Attività | 3 | - | - | - | - | - |
| Valutazioni | 3 | - | - | - | - | - |
| Notifiche | 2 | - | - | - | - | - |
| News RSS | 2 | - | - | - | - | - |
| Assistente IA | 2 | - | - | - | - | - |
| Import/Export | 3 | - | - | - | - | - |
| Impostazioni | 3 | - | - | - | - | - |
| PWA | 3 | - | - | - | - | - |
| Cross-Browser | 3 | - | - | - | - | - |
| Mobile | 2 | - | - | - | - | - |
| **TOTALE** | **40** | - | - | - | - | - |

---

## 🐛 Bug Tracking

| ID | Severità | Descrizione | Test Case | Stato | Fix Previsto |
|----|----------|-------------|-----------|-------|--------------|
| - | - | - | - | - | - |

**Livelli Severità:**
- 🔴 **Critico:** App inutilizzabile o perdita dati
- 🟠 **Alto:** Funzionalità principale non funziona
- 🟡 **Medio:** Funzionalità secondaria con problemi
- 🟢 **Basso:** Problema estetico o miglioramento

---

## ✅ Checklist Pre-Release Beta

Prima di rilasciare versione Beta 1.0, verificare:

### Funzionalità Core
- [ ] Onboarding completo e funzionante
- [ ] CRUD completo: Classi, Studenti, Lezioni, Attività
- [ ] Orario didattico funzionale
- [ ] Sistema valutazioni operativo
- [ ] Import/Export dati funzionante

### Qualità e Stabilità
- [ ] Nessun bug critico (🔴)
- [ ] Bug alto (🟠) risolti o documentati
- [ ] Tutti i test core passati
- [ ] Dati persistono correttamente
- [ ] Nessun errore console critico

### Compatibilità
- [ ] Funziona su Chrome/Edge
- [ ] Funziona su Firefox
- [ ] Responsive su mobile
- [ ] PWA installabile

### Documentazione
- [ ] README aggiornato
- [ ] Guide utente complete
- [ ] Changelog versione Beta
- [ ] Known issues documentati

### UX
- [ ] Navigazione intuitiva
- [ ] Messaggi errore chiari
- [ ] Feedback azioni utente
- [ ] Performance accettabile

---

## 📝 Note Finali

### Per i Tester

- Registrare **ogni** problema trovato, anche minore
- Fornire **screenshot** per problemi UI
- Includere **passi per riprodurre** ogni bug
- Suggerire **miglioramenti** UX osservati

### Per gli Sviluppatori

- Prioritizzare fix bug critici e alti
- Documentare workaround per bug non fixabili subito
- Aggiornare questo piano con nuovi test per nuove feature
- Celebrare quando tutti i test passano! 🎉

---

**Versione Piano Test:** 1.0  
**Ultimo Aggiornamento:** 2024-10-07  
**Stato:** Pronto per esecuzione  
**Target Release:** Beta 1.0
