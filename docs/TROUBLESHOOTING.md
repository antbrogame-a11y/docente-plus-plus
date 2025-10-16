# 🔧 Guida alla Risoluzione dei Problemi - Docente++

Questa guida ti aiuterà a risolvere i problemi più comuni che potresti incontrare utilizzando Docente++.

## 📋 Indice

1. [Problemi di Avvio](#problemi-di-avvio)
2. [Problemi con l'Onboarding](#problemi-con-lonboarding)
3. [Dati Corrotti o Mancanti](#dati-corrotti-o-mancanti)
4. [Problemi di Storage](#problemi-di-storage)
5. [Ripristino dell'App](#ripristino-dellapp)

---

## 🚀 Problemi di Avvio

### L'app non si carica / Schermata bianca

**Cause possibili:**
- localStorage del browser disabilitato
- Dati corrotti in localStorage
- Errore JavaScript

**Soluzioni:**

1. **Ricarica la pagina** (F5 o Ctrl+R)
   - Questo risolve la maggior parte dei problemi temporanei

2. **Controlla la console del browser**
   - Premi F12 per aprire gli strumenti per sviluppatori
   - Vai alla tab "Console"
   - Cerca messaggi di errore in rosso
   - Se vedi errori relativi a localStorage, vai alla sezione [Dati Corrotti](#dati-corrotti-o-mancanti)

3. **Verifica che localStorage sia abilitato**
   - Vai nelle impostazioni del browser
   - Assicurati che i cookie e lo storage locale siano abilitati per questo sito
   - Se usi la modalità Incognito, nota che alcuni browser limitano l'accesso a localStorage

4. **Cancella i dati e ricomincia**
   - Se l'app si carica parzialmente, vai in Impostazioni → Risoluzione Problemi
   - Clicca su "Cancella Tutti i Dati"
   - Ricarica la pagina

---

## 🎯 Problemi con l'Onboarding

### Il menu è disabilitato / Le funzionalità sono bloccate

**Causa:** Il profilo docente non è stato completato.

**Soluzione:**
1. Vedrai un banner arancione in cima alla pagina con il messaggio "Configurazione incompleta"
2. Clicca sul pulsante **"Completa Profilo"** nel banner
3. Inserisci almeno il tuo nome nel form di onboarding
4. Clicca su **"Inizia ad Usare Docente++"**
5. Tutte le funzionalità del menu saranno ora disponibili

**Nota importante:** A partire dalla versione 1.2.0, non è più possibile saltare l'onboarding. Devi completare il profilo con almeno il nome per accedere a tutte le funzionalità dell'applicazione. Questo previene stati intermedi non chiari e garantisce un'esperienza utente migliore.

### La modale di onboarding non si apre

**Soluzione:**
1. Controlla se vedi il banner arancione "Configurazione incompleta" in cima alla pagina
2. Clicca sul pulsante "Completa Profilo" nel banner per aprire la modale di onboarding
3. Se il banner non appare e il menu è disabilitato, vai in **Impostazioni** (accessibile anche senza completare l'onboarding)
4. Clicca su **"Modifica Profilo"** nella sezione "Profilo Docente"
5. Inserisci almeno il tuo nome

### Non riesco a completare l'onboarding

**Soluzione:**
1. Assicurati di aver compilato almeno il campo "Nome" (obbligatorio)
2. Il campo "Nome" non può essere vuoto
3. Se riscontri errori, controlla la console del browser (F12) per messaggi di errore
4. Verifica che localStorage sia abilitato nel tuo browser

### L'onboarding continua a riapparirsi

**Causa:** Il salvataggio non è andato a buon fine o i dati del profilo sono corrotti

**Soluzione:**
1. Verifica che il browser non sia in modalità Incognito
2. Controlla che localStorage sia abilitato
3. Prova a completare l'onboarding con tutti i campi compilati
4. Se il problema persiste:
   - Apri gli strumenti per sviluppatori (F12)
   - Vai alla tab "Console"
   - Digita: `localStorage.setItem('onboardingComplete', 'true')`
   - Ricarica la pagina e vai in Impostazioni → Modifica Profilo per completare i dati

### Il menu resta disabilitato anche dopo aver completato l'onboarding

**Causa:** Dati del profilo mancanti o corrotti

**Soluzione:**
1. Vai in **Impostazioni** (accessibile anche con profilo incompleto)
2. Verifica che il nome sia presente nella sezione "Profilo Docente"
3. Se il nome non c'è o è vuoto, clicca su **"Modifica Profilo"**
4. Inserisci il tuo nome e salva
5. Il menu si abiliterà automaticamente e il banner scomparirà

---

## 💾 Dati Corrotti o Mancanti

### I miei dati sono scomparsi

**Cause possibili:**
- Hai cancellato i dati del browser
- Hai cambiato browser o dispositivo
- localStorage è stato corrotto

**Soluzioni:**

1. **Controlla se hai un backup**
   - Vai in **Backup/Ripristino**
   - Se hai esportato un backup precedentemente, puoi importarlo

2. **Verifica che sei sullo stesso browser**
   - I dati sono salvati localmente nel browser
   - Se usi un browser diverso, i dati non saranno disponibili

3. **Controlla la modalità Incognito**
   - I dati salvati in modalità Incognito vengono cancellati quando chiudi il browser

### Ricevo l'errore "Dati corrotti rilevati"

**Cosa significa:**
L'app ha rilevato che alcuni dati in localStorage sono danneggiati o in un formato non valido.

**Cosa fa l'app automaticamente:**
- Ripristina automaticamente i dati corrotti ai valori predefiniti
- L'app continua a funzionare normalmente
- Gli altri dati validi vengono preservati

**Cosa puoi fare:**
1. Se l'app funziona dopo il messaggio, continua a usarla normalmente
2. Se hai problemi persistenti, vai in Impostazioni e usa "Cancella Tutti i Dati"
3. Importa un backup se disponibile

### Alcuni dati sembrano sbagliati

**Soluzione:**
1. Vai in **Impostazioni → Risoluzione Problemi**
2. Clicca su **"Cancella Tutti i Dati"**
3. Conferma l'azione (⚠️ questa operazione è irreversibile!)
4. Ricarica la pagina
5. Completa nuovamente l'onboarding o importa un backup

---

## 🗄️ Problemi di Storage

### "Quota exceeded" o errori di salvataggio

**Causa:** Lo spazio di storage locale del browser è pieno

**Soluzioni:**

1. **Cancella i dati vecchi**
   - Vai nelle varie sezioni (Lezioni, Studenti, ecc.)
   - Elimina i dati che non ti servono più

2. **Esporta e cancella**
   - Vai in **Backup/Ripristino**
   - Esporta tutti i tuoi dati come backup
   - Vai in Impostazioni e usa "Cancella Tutti i Dati"
   - Importa solo i dati che ti servono

3. **Libera spazio nel browser**
   - Vai nelle impostazioni del browser
   - Cancella dati di altri siti che non usi più
   - Aumenta la quota di storage se disponibile

### localStorage non disponibile

**Cause possibili:**
- Browser molto vecchio
- localStorage disabilitato nelle impostazioni
- Modalità di navigazione privata con restrizioni

**Soluzioni:**
1. Aggiorna il browser all'ultima versione
2. Abilita localStorage nelle impostazioni del browser
3. Usa un browser moderno (Chrome, Firefox, Safari, Edge)
4. Non usare la modalità Incognito se il browser limita localStorage

---

## 🔄 Ripristino dell'App

### Reset Completo (Cancella Tutti i Dati)

**Quando usarlo:**
- L'app non funziona correttamente
- I dati sono corrotti e non recuperabili
- Vuoi ricominciare da zero

**Come fare:**

1. Apri l'app (anche se parzialmente funzionante)
2. Clicca sul menu **⚙️ Altro**
3. Seleziona **⚙️ Impostazioni**
4. Scorri fino a **Risoluzione Problemi**
5. Clicca sul pulsante rosso **"Cancella Tutti i Dati"**
6. Conferma l'azione (due volte per sicurezza)
7. Attendi il messaggio di successo
8. La pagina si ricaricherà automaticamente
9. Completa nuovamente l'onboarding o saltalo

**⚠️ ATTENZIONE:** Questa operazione è irreversibile! Assicurati di aver esportato un backup se vuoi conservare i tuoi dati.

### Reset Manuale (da Console Browser)

**Quando usarlo:**
- L'app non si carica affatto
- Non riesci ad accedere al pulsante "Cancella Tutti i Dati"

**Come fare:**

1. Apri gli strumenti per sviluppatori (F12)
2. Vai alla tab "Console"
3. Digita il seguente comando:
   ```javascript
   localStorage.clear();
   location.reload();
   ```
4. Premi Invio
5. La pagina si ricaricherà con tutti i dati cancellati

---

## 🆘 Ancora Problemi?

Se dopo aver provato tutte le soluzioni sopra continui ad avere problemi:

1. **Documenta il problema**
   - Apri la console del browser (F12)
   - Fai uno screenshot degli errori
   - Annota i passi esatti che hai fatto

2. **Prova un browser diverso**
   - Installa Chrome, Firefox o Edge
   - Prova ad aprire l'app in un browser diverso
   - Questo aiuterà a capire se il problema è specifico del browser

3. **Verifica la connessione**
   - Alcune funzionalità (come l'assistente IA) richiedono una connessione internet
   - Controlla che il tuo dispositivo sia connesso

4. **Contatta il supporto**
   - Apri una issue su GitHub con:
     - Descrizione dettagliata del problema
     - Screenshot della console
     - Browser e versione che stai usando
     - Passi per riprodurre il problema

---

## ✅ Prevenzione

### Best Practices per evitare problemi:

1. **Fai backup regolari**
   - Esporta i tuoi dati ogni settimana
   - Salva i backup in un posto sicuro (Google Drive, Dropbox, ecc.)

2. **Usa un browser aggiornato**
   - Mantieni il browser sempre aggiornato all'ultima versione
   - Usa Chrome, Firefox, Safari o Edge

3. **Non usare modalità Incognito per lavoro importante**
   - I dati verranno cancellati alla chiusura del browser
   - Usa la modalità normale per conservare i dati

4. **Evita di manipolare manualmente localStorage**
   - Non modificare i dati direttamente dalla console
   - Usa sempre l'interfaccia dell'app

5. **Monitora lo spazio di storage**
   - Se hai molti dati, fai pulizia periodicamente
   - Esporta e archivia i dati vecchi

---

**Versione documento:** 1.1  
**Ultimo aggiornamento:** 2025-10-16  
**Compatibile con:** Docente++ v1.2.0+
