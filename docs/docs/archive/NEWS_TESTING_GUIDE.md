# 🧪 Guida Test - Modulo News RSS/Atom e Agente IA

## 📋 Indice
1. [Setup Ambiente Test](#setup-ambiente-test)
2. [Test Funzionali](#test-funzionali)
3. [Test Feed RSS Reali](#test-feed-rss-reali)
4. [Test Agente IA](#test-agente-ia)
5. [Test Edge Cases](#test-edge-cases)
6. [Checklist Completa](#checklist-completa)

## 🛠️ Setup Ambiente Test

### Prerequisiti
- Browser moderno (Chrome, Firefox, Safari aggiornati)
- Connessione internet stabile
- API key OpenRouter configurata (per test IA)

### Avvio App
1. Apri `index.html` in un browser
2. Completa onboarding se prima volta
3. Naviga al tab "📰 News"

### Dati di Test

#### Feed RSS di Test
```
Nome: Test RSS Feed
URL: http://feeds.bbci.co.uk/news/rss.xml
Categoria: Istituzionale
```

#### Feed Atom di Test
```
Nome: Test Atom Feed  
URL: https://www.reddit.com/.rss
Categoria: Altro
```

#### Feed RSS Italiano
```
Nome: ANSA - Ultim'ora
URL: https://www.ansa.it/sito/notizie/topnews/topnews_rss.xml
Categoria: Istituzionale
```

## ✅ Test Funzionali

### Test 1: Aggiunta Feed RSS

**Obiettivo**: Verificare aggiunta corretta feed RSS

**Passi:**
1. Clicca "➕ Aggiungi Fonte RSS"
2. Inserisci:
   - Nome: "BBC News"
   - URL: `http://feeds.bbci.co.uk/news/rss.xml`
   - Categoria: Istituzionale
3. Clicca "Aggiungi"

**Risultato atteso:**
- ✅ Form si chiude
- ✅ Feed appare nella lista "📡 Fonti RSS/Atom"
- ✅ Mostra "📊 X news" (dove X > 0)
- ✅ "🕐 Ultimo aggiornamento" mostra data/ora corrente
- ✅ Icona ✅ indica feed attivo

**Risultato:** ⬜ PASS / ⬜ FAIL

---

### Test 2: Visualizzazione News da Feed

**Obiettivo**: Verificare che le news vengano recuperate e visualizzate

**Passi:**
1. Dopo aggiunta feed (Test 1)
2. Scorri alla sezione "📄 Ultime News"

**Risultato atteso:**
- ✅ Lista news popolata (almeno 10 news)
- ✅ Ogni news mostra:
  - Titolo cliccabile
  - Fonte (BBC News)
  - Categoria
  - Data pubblicazione
- ✅ Pulsanti "📖 Leggi" e "🤖 Analizza con IA" presenti

**Risultato:** ⬜ PASS / ⬜ FAIL

---

### Test 3: Click su "Leggi" News

**Obiettivo**: Verificare apertura link news in nuova tab

**Passi:**
1. Nella lista news, clicca "📖 Leggi" su una news qualsiasi
2. Osserva comportamento

**Risultato atteso:**
- ✅ Nuova tab/finestra browser si apre
- ✅ Pagina news originale si carica
- ✅ URL nella barra corrisponde al link della news

**Risultato:** ⬜ PASS / ⬜ FAIL

---

### Test 4: Refresh Feed Singolo

**Obiettivo**: Verificare aggiornamento feed singolo

**Passi:**
1. Nella lista feed, clicca "🔄 Aggiorna" su un feed
2. Osserva comportamento

**Risultato atteso:**
- ✅ "🕐 Ultimo aggiornamento" si aggiorna con ora corrente
- ✅ "📊 X news" potrebbe aumentare se ci sono nuove news
- ✅ Nuove news appaiono in cima alla lista news

**Risultato:** ⬜ PASS / ⬜ FAIL

---

### Test 5: Disattivazione Feed

**Obiettivo**: Verificare toggle attivazione feed

**Passi:**
1. Nella lista feed, clicca "⏸️ Disattiva" su un feed attivo
2. Osserva cambio icona
3. Clicca "🔄 Aggiorna Tutte"
4. Clicca "▶️ Attiva" per riattivare

**Risultato atteso:**
- ✅ Dopo "Disattiva": icona cambia da ✅ a ⏸️
- ✅ Pulsante cambia a "▶️ Attiva"
- ✅ Feed disattivato non viene aggiornato da "Aggiorna Tutte"
- ✅ Dopo "Attiva": icona torna a ✅

**Risultato:** ⬜ PASS / ⬜ FAIL

---

### Test 6: Eliminazione Feed

**Obiettivo**: Verificare eliminazione feed e news associate

**Passi:**
1. Conta numero news totali prima eliminazione
2. Nella lista feed, clicca "🗑️ Elimina" su un feed
3. Conferma eliminazione
4. Osserva lista feed e news

**Risultato atteso:**
- ✅ Dialog conferma appare
- ✅ Dopo conferma, feed rimosso dalla lista
- ✅ News di quel feed rimosse dalla lista news
- ✅ Numero news diminuisce

**Risultato:** ⬜ PASS / ⬜ FAIL

---

### Test 7: Filtro News per Fonte

**Obiettivo**: Verificare filtro news per fonte specifica

**Prerequisiti**: Almeno 2 feed configurati

**Passi:**
1. Nella sezione "📄 Ultime News"
2. Dropdown "Filtra per fonte", seleziona una fonte specifica
3. Osserva lista news

**Risultato atteso:**
- ✅ Lista news mostra solo news della fonte selezionata
- ✅ Ogni news mostra il nome della fonte selezionata
- ✅ Selezionare "Tutte le fonti" ripristina vista completa

**Risultato:** ⬜ PASS / ⬜ FAIL

---

### Test 8: Filtro News per Categoria

**Obiettivo**: Verificare filtro news per categoria

**Prerequisiti**: Feed di categorie diverse configurati

**Passi:**
1. Dropdown "Filtra per categoria", seleziona "Istituzionale"
2. Osserva lista news

**Risultato atteso:**
- ✅ Lista news mostra solo news categoria "Istituzionale"
- ✅ Badge categoria su ogni news mostra "istituzionale"
- ✅ Selezionare "Tutte le categorie" ripristina vista completa

**Risultato:** ⬜ PASS / ⬜ FAIL

---

### Test 9: Floating Action Button (FAB)

**Obiettivo**: Verificare FAB sempre visibile

**Passi:**
1. Naviga a vari tab dell'app (Dashboard, Lezioni, ecc.)
2. Osserva pulsante 🤖 in basso a destra
3. Scorri pagina su/giù
4. Clicca FAB

**Risultato atteso:**
- ✅ FAB visibile su TUTTI i tab
- ✅ FAB rimane fisso durante scroll
- ✅ FAB sempre in basso a destra
- ✅ Click apre modal "Agente IA - Analisi Contestuale News"

**Risultato:** ⬜ PASS / ⬜ FAIL

---

### Test 10: Modal Agente IA - Apertura/Chiusura

**Obiettivo**: Verificare apertura e chiusura modal

**Passi:**
1. Clicca FAB 🤖
2. Osserva modal aperto
3. Clicca "✕" in alto a destra
4. Riapri cliccando FAB
5. Clicca "Chiudi" in basso
6. Riapri e clicca fuori dal modal (overlay)

**Risultato atteso:**
- ✅ Modal si apre centrato con overlay scuro
- ✅ Cliccando "✕" modal si chiude
- ✅ Cliccando "Chiudi" modal si chiude
- ✅ (Opzionale) Cliccando overlay modal si chiude

**Risultato:** ⬜ PASS / ⬜ FAIL

---

## 🌐 Test Feed RSS Reali

### Test 11: Feed RSS 2.0

**Feed di test**: BBC News RSS
**URL**: `http://feeds.bbci.co.uk/news/rss.xml`

**Passi:**
1. Aggiungi feed come "BBC News"
2. Attendi caricamento
3. Verifica news caricate

**Risultato atteso:**
- ✅ Feed aggiunto senza errori
- ✅ Almeno 20 news recuperate
- ✅ Titoli news in inglese
- ✅ Link news validi (dominio bbc.co.uk o bbc.com)
- ✅ Date pubblicazione recenti

**Risultato:** ⬜ PASS / ⬜ FAIL

---

### Test 12: Feed Atom 1.0

**Feed di test**: Reddit RSS
**URL**: `https://www.reddit.com/.rss`

**Passi:**
1. Aggiungi feed come "Reddit Front Page"
2. Attendi caricamento
3. Verifica news caricate

**Risultato atteso:**
- ✅ Feed aggiunto senza errori
- ✅ News recuperate (formato Atom)
- ✅ Titoli e link validi
- ✅ Descrizioni presenti

**Risultato:** ⬜ PASS / ⬜ FAIL

---

### Test 13: Feed Italiano con Caratteri Speciali

**Feed di test**: ANSA Ultim'ora
**URL**: `https://www.ansa.it/sito/notizie/topnews/topnews_rss.xml`

**Passi:**
1. Aggiungi feed come "ANSA Ultim'ora"
2. Verifica encoding caratteri speciali

**Risultato atteso:**
- ✅ Caratteri accentati corretti (è, à, ò, ù, ecc.)
- ✅ Apostrofi e virgolette corretti
- ✅ Nessun carattere strano o encoding errato

**Risultato:** ⬜ PASS / ⬜ FAIL

---

### Test 14: Feed con HTML nelle Descrizioni

**Obiettivo**: Verificare rimozione HTML da descrizioni

**Passi:**
1. Usa un feed che include HTML nelle description (molti feed lo fanno)
2. Osserva descrizioni news renderizzate

**Risultato atteso:**
- ✅ Tag HTML rimossi (no `<p>`, `<a>`, `<img>`, ecc. visibili)
- ✅ Solo testo puro visualizzato
- ✅ Formattazione base mantenuta (spazi, a capo)

**Risultato:** ⬜ PASS / ⬜ FAIL

---

## 🤖 Test Agente IA

### Test 15: Analisi IA da News

**Prerequisiti**: 
- API key OpenRouter configurata
- Almeno 1 feed con news

**Passi:**
1. Nella lista news, clicca "🤖 Analizza con IA" su una news
2. Osserva modal aperto
3. Verifica URL e titolo precompilati
4. Clicca "🔍 Analizza con IA"
5. Attendi risposta

**Risultato atteso:**
- ✅ Modal si apre con URL news precompilato
- ✅ Campo "Richiesta Specifica" contiene testo default con titolo news
- ✅ Durante analisi: spinner/loading visibile
- ✅ Dopo analisi: risultati mostrati in sezione "📊 Risultati Analisi"
- ✅ Testo analisi strutturato e leggibile

**Risultato:** ⬜ PASS / ⬜ FAIL

---

### Test 16: Analisi IA - Date e Scadenze

**Passi:**
1. Apri modal agente IA (FAB)
2. Inserisci URL news con date (es. news su scadenze iscrizioni)
3. Clicca "📅 Date e Scadenze"
4. Clicca "🔍 Analizza con IA"

**Risultato atteso:**
- ✅ Campo "Richiesta Specifica" popolato con "Estrai tutte le date e scadenze menzionate"
- ✅ Analisi evidenzia date trovate
- ✅ Format date chiaro e leggibile

**Risultato:** ⬜ PASS / ⬜ FAIL

---

### Test 17: Analisi IA - Documenti

**Passi:**
1. Inserisci URL news che menziona documenti/moduli
2. Clicca "📎 Documenti"
3. Analizza

**Risultato atteso:**
- ✅ Analisi elenca documenti menzionati
- ✅ Indicazioni su dove trovarli/scaricarli se disponibili

**Risultato:** ⬜ PASS / ⬜ FAIL

---

### Test 18: Analisi IA - Soggetti

**Passi:**
1. Inserisci URL news con destinatari/soggetti
2. Clicca "👥 Soggetti"
3. Analizza

**Risultato atteso:**
- ✅ Analisi identifica soggetti coinvolti
- ✅ Ruoli chiari (studenti, docenti, genitori, uffici, ecc.)

**Risultato:** ⬜ PASS / ⬜ FAIL

---

### Test 19: Analisi IA - Riepilogo e Azioni

**Passi:**
1. Inserisci URL news qualsiasi
2. Clicca "📋 Riepilogo e Azioni"
3. Analizza

**Risultato atteso:**
- ✅ Riepilogo strutturato della news
- ✅ Sezione "✅ Azioni Proposte" appare (se IA trova azioni)
- ✅ Azioni categorizzate (SCADENZA, PROMEMORIA, CIRCOLARE, ecc.)
- ✅ Pulsante "✅ Crea" su ogni azione proposta

**Risultato:** ⬜ PASS / ⬜ FAIL

---

### Test 20: Analisi IA - Senza API Key

**Passi:**
1. Rimuovi API key OpenRouter (Impostazioni)
2. Tenta analisi IA

**Risultato atteso:**
- ✅ Alert/messaggio: "Configura la tua API key..."
- ✅ Reindirizzamento automatico a tab Impostazioni
- ✅ Analisi NON eseguita

**Risultato:** ⬜ PASS / ⬜ FAIL

---

## 🔧 Test Edge Cases

### Test 21: Feed URL Invalido

**Passi:**
1. Aggiungi feed con URL invalido: `https://invalid-url-12345.com/feed.xml`
2. Osserva comportamento

**Risultato atteso:**
- ✅ Errore mostrato all'utente
- ✅ Feed NON aggiunto alla lista
- ✅ Messaggio errore chiaro

**Risultato:** ⬜ PASS / ⬜ FAIL

---

### Test 22: Feed Duplicato

**Passi:**
1. Aggiungi un feed (es. BBC News)
2. Tenta di aggiungere lo stesso feed con nome diverso

**Risultato atteso:**
- ✅ Sistema permette aggiunta (nessuna validazione duplicati URL)
- ⚠️ Nota: Feature futura potrebbe bloccare duplicati

**Risultato:** ⬜ PASS / ⬜ FAIL

---

### Test 23: Feed Lento/Timeout

**Passi:**
1. Aggiungi feed da server lento
2. Attendi risposta

**Risultato atteso:**
- ✅ Spinner/loading mostrato durante fetch
- ✅ Timeout dopo ~30 secondi
- ✅ Messaggio errore se timeout
- ✅ App non si blocca

**Risultato:** ⬜ PASS / ⬜ FAIL

---

### Test 24: News con URL Molto Lunghi

**Passi:**
1. Feed con URL news molto lunghi
2. Verifica rendering

**Risultato atteso:**
- ✅ URL non rompono layout
- ✅ Word-wrap o truncate applicato
- ✅ Link comunque cliccabili

**Risultato:** ⬜ PASS / ⬜ FAIL

---

### Test 25: Persistenza Dopo Ricarica Pagina

**Passi:**
1. Aggiungi 2-3 feed
2. Attendi caricamento news
3. Ricarica pagina (F5)
4. Naviga a tab News

**Risultato atteso:**
- ✅ Feed ancora presenti dopo ricarica
- ✅ News ancora presenti
- ✅ Filtri resettati a default
- ✅ Nessun refetch automatico (usa dati cached)

**Risultato:** ⬜ PASS / ⬜ FAIL

---

### Test 26: localStorage Pieno

**Passi:**
1. Aggiungi molti feed (10+)
2. Aggiorna tutti più volte
3. Osserva comportamento con migliaia di news

**Risultato atteso:**
- ✅ App continua a funzionare
- ⚠️ Performance potrebbe degradare
- ⚠️ Possibile errore localStorage quota exceeded

**Risultato:** ⬜ PASS / ⬜ FAIL

---

### Test 27: Analisi IA di News Inaccessibile

**Passi:**
1. Inserisci URL news dietro paywall o non accessibile pubblicamente
2. Tenta analisi

**Risultato atteso:**
- ✅ IA tenta analisi
- ⚠️ Potrebbe non riuscire ad accedere al contenuto
- ✅ Messaggio indicante limitazioni

**Risultato:** ⬜ PASS / ⬜ FAIL

---

### Test 28: Modal IA con Testo Molto Lungo

**Passi:**
1. Inserisci richiesta personalizzata molto lunga (500+ caratteri)
2. Analizza news con contenuto molto lungo
3. Osserva risultati

**Risultato atteso:**
- ✅ Textarea espande correttamente
- ✅ Risultati lunghi mostrati con scroll
- ✅ Modal non si rompe
- ✅ Performance accettabile

**Risultato:** ⬜ PASS / ⬜ FAIL

---

## ✅ Checklist Completa

### Funzionalità Base
- [ ] Aggiunta feed RSS
- [ ] Aggiunta feed Atom
- [ ] Visualizzazione news
- [ ] Click "Leggi" news
- [ ] Refresh feed singolo
- [ ] Refresh tutti feed
- [ ] Disattivazione feed
- [ ] Attivazione feed
- [ ] Eliminazione feed
- [ ] Filtro per fonte
- [ ] Filtro per categoria
- [ ] Filtri combinati

### Floating Action Button
- [ ] FAB visibile su tutti i tab
- [ ] FAB posizione fixed
- [ ] FAB sempre sopra altri elementi
- [ ] Click apre modal IA
- [ ] Hover effect

### Modal Agente IA
- [ ] Apertura/chiusura corrette
- [ ] Form campi validati
- [ ] Pulsanti analisi predefinite
- [ ] Analisi Date e Scadenze
- [ ] Analisi Documenti
- [ ] Analisi Soggetti
- [ ] Analisi Riepilogo
- [ ] Visualizzazione risultati
- [ ] Azioni proposte (se presenti)
- [ ] Gestione errori API

### Integrazione OpenRouter
- [ ] Richiesta API formattata correttamente
- [ ] Risposta parsata correttamente
- [ ] Gestione errori API
- [ ] Timeout gestito
- [ ] API key verificata

### Persistenza
- [ ] Feed salvati in localStorage
- [ ] News salvate in localStorage
- [ ] Dati persistono dopo ricarica
- [ ] Import/export compatibile

### UI/UX
- [ ] Layout responsive desktop
- [ ] Layout responsive mobile
- [ ] Stati vuoti (empty states)
- [ ] Stati caricamento (loading)
- [ ] Messaggi errore chiari
- [ ] Accessibilità keyboard
- [ ] Contrast ratio sufficiente

### Performance
- [ ] Rendering lista feed veloce
- [ ] Rendering lista news veloce
- [ ] Fetch feed non blocca UI
- [ ] Analisi IA non blocca UI
- [ ] No memory leaks evidenti

### Edge Cases
- [ ] Feed URL invalido gestito
- [ ] Feed duplicato permesso
- [ ] Feed lento/timeout gestito
- [ ] News duplicate filtrate
- [ ] HTML sanitizzato
- [ ] Caratteri speciali supportati
- [ ] localStorage quota monitorata

## 📊 Report Template

```
# Test Report - Modulo News RSS/Atom

Data test: _______________
Tester: _______________
Browser: _______________
OS: _______________

## Summary
- Test eseguiti: __ / 28
- Test passati: __
- Test falliti: __
- Test parziali: __

## Issues Trovati
1. [Severità] Descrizione issue
   - Passi riproduzione
   - Comportamento atteso
   - Comportamento attuale
   - Screenshot (se applicabile)

2. ...

## Note Aggiuntive
- ...

## Raccomandazioni
- ...
```

---

**Guida test versione**: 1.0  
**Ultima revisione**: Ottobre 2025
