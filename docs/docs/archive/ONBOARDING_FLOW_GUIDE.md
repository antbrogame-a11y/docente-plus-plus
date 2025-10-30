# 📋 Guida al Flusso di Onboarding - Docente++

## Panoramica

A partire dalla versione 1.2.2, Docente++ ha semplificato il flusso di onboarding rendendo tutte le funzionalità dell'app accessibili immediatamente, senza blocchi. Il completamento del profilo è consigliato per un'esperienza ottimale, ma non è più obbligatorio per esplorare l'applicazione.

## Obiettivi del Nuovo Flusso

1. **Massima Libertà di Esplorazione** - Gli utenti possono navigare liberamente in tutte le sezioni dell'app sin dal primo avvio
2. **Profilo Consigliato** - Il sistema suggerisce all'utente di completare il profilo per un'esperienza personalizzata
3. **UX Non Invasiva** - Un banner discreto ricorda la configurazione del profilo senza bloccare l'utilizzo
4. **Gestione errori robusta** - Migliore gestione di localStorage corrotto o non disponibile

## Flusso Utente

### 1. Primo Avvio

Quando un utente apre Docente++ per la prima volta:

```
┌─────────────────────────────────────┐
│  Docente++ si carica                │
│  ↓                                   │
│  Tutte le voci di menu attive       │
│  ↓                                   │
│  Banner informativo (discreto)       │
│  "Configura il tuo profilo per      │
│   un'esperienza personalizzata"     │
│  ↓                                   │
│  L'utente può esplorare liberamente │
└─────────────────────────────────────┘
```

**Elemento visivo:** Banner informativo in alto con pulsante "Completa Profilo"

**Campi suggeriti del profilo:**
- Nome * (consigliato per personalizzazione)
- Cognome (opzionale)
- Email (opzionale)
- Anno Scolastico (opzionale, es. 2024/2025)

**Azioni disponibili:**
- ✅ Esplora l'app liberamente
- ⚙️ Vai alle Impostazioni per configurare il profilo
- ❌ Chiudi il banner (può essere mostrato nuovamente)

### 2. Configurazione Profilo (Consigliata)

Quando l'utente accede alle Impostazioni per configurare il profilo:

```
┌─────────────────────────────────────┐
│  Vai a Impostazioni                 │
│  ↓                                   │
│  Compila i campi del profilo        │
│  ↓                                   │
│  Salva                               │
│  ↓                                   │
│  Banner nascosto automaticamente     │
│  ↓                                   │
│  Toast: "Profilo completo!"         │
└─────────────────────────────────────┘
```

### 3. Avvii Successivi

Quando un utente ritorna all'app dopo aver completato il profilo:

```
┌─────────────────────────────────────┐
│  Docente++ si carica                │
│  ↓                                   │
│  Controlla profilo                   │
│  ↓                                   │
│  Profilo completo: nessun banner    │
│  ↓                                   │
│  App completamente funzionante       │
└─────────────────────────────────────┘
```

### 4. Gestione Dati Corrotti (Raro)

Se localStorage contiene dati corrotti:

```
┌─────────────────────────────────────┐
│  Docente++ si carica                │
│  ↓                                   │
│  Rileva dati corrotti                │
│  ↓                                   │
│  Mostra banner informativo           │
│  ↓                                   │
│  Toast: "Profilo incompleto rilevato"│
│  ↓                                   │
│  L'utente può ancora esplorare      │
└─────────────────────────────────────┘
```
│  ↓                                   │
│  Mostra banner "Configurazione incompleta"│
│  ↓                                   │
│  Mostra banner informativo           │
│  ↓                                   │
│  Toast: "Profilo incompleto rilevato"│
│  ↓                                   │
│  L'utente può ancora esplorare      │
└─────────────────────────────────────┘
```

**Come risolvere:**
1. Ignora il banner e esplora l'app
2. Oppure clicca "Completa Profilo" per configurare
3. Inserisci i dati consigliati
4. Salva (il banner scompare)

## Componenti UI

### Banner "Configurazione Consigliata"

**Posizione:** Sticky top, subito sotto l'header principale

**Aspetto:**
- Sfondo: Gradiente blu info (#2196f3 → #1976d2)
- Icona: Material Symbol "info"
- Testo: 
  - Titolo: "Configura il tuo profilo" (bold)
  - Sottotitolo: "Per un'esperienza personalizzata"
- Pulsante: "Completa Profilo" (bianco su blu)

**Comportamento:**
- Appare solo se il profilo non è configurato
- Scompare automaticamente quando il profilo viene completato
- È sempre visibile durante lo scroll
- Può essere chiuso dall'utente (ma si può rimostrare)
- Animazione di entrata: slide down con fade in

### Menu Sempre Attivo

**Comportamento nuovo (v1.2.2):**
- **Tutte le voci sono sempre attive e cliccabili**
- Nessuna voce viene disabilitata
- Nessuna icona lucchetto
- Nessun tooltip di blocco

**Voci di menu disponibili:**
- 🏠 Home
- 📚 Lezioni
- 👥 Studenti
- 🎓 Classi
- 📝 Attività
- 📊 Valutazioni
- 📅 Orario
- 📆 Agenda
- 🤖 Assistente IA
- 📄 Importa Documenti
- ⚙️ Impostazioni (spostata più in alto su mobile)

**Ordine menu mobile ottimizzato:**
1. Home
2. Lezioni
3. Studenti
4. Classi
5. Attività
6. Valutazioni
7. Orario
8. Agenda
9. Assistente IA
10. Importa Documenti
11. **Impostazioni** (prima era in fondo, ora qui per facilità d'accesso)
12. Notifiche

## Validazione e Controlli

### Funzioni di Controllo

```javascript
// Controlla se il profilo è completo e valido
isProfileComplete()
// Returns: boolean
// Controlla: 
//   - state.settings.teacherName esiste
//   - state.settings.teacherName.trim() !== ''
```

### Validazione Form Profilo (Impostazioni)

**Campo Nome:**
- Required: true (consigliato)
- Validazione: Non può essere vuoto o solo spazi
- Messaggio: "Il nome è consigliato per personalizzazione"

**Campo Cognome:**
- Required: false
- Nessuna validazione particolare

**Campo Email:**
- Required: false
- Validazione: Formato email se compilato
- Pattern: ^[^\s@]+@[^\s@]+\.[^\s@]+$

**Campo Anno Scolastico:**
- Required: false
- Formato dropdown con opzioni predefinite

## Gestione Errori

### localStorage Non Disponibile

**Scenari:**
- Browser troppo vecchio
- localStorage disabilitato
- Modalità privata con restrizioni
- Quota storage esaurita

**Comportamento:**
```javascript
if (!checkStorageHealth()) {
    showToast('Errore: localStorage non disponibile. Verifica le impostazioni del browser.', 'error', 10000);
    return false;
}
```

**Azione utente:** 
- Messaggio di errore persistente (10 secondi)
- L'app continua a funzionare in modalità limitata (senza salvataggio)

### Dati Corrotti in localStorage

**Rilevamento:**
- Parsing JSON fallisce
- Tipi di dati non corrispondono
- Valori null/undefined inaspettati

**Comportamento:**
```javascript
try {
    const parsed = JSON.parse(value);
    // Validate data type
} catch (error) {
    console.warn('Failed to parse localStorage item:', error);
    return fallback; // Usa valore di default
}
```

**Azione automatica:**
- Reset ai valori di default
- Toast: "Dati corrotti rilevati. App ripristinata ai valori predefiniti."
- L'app continua a funzionare con dati puliti

### Profilo Incompleto

**Scenari:**
- Primo avvio
- Dati del profilo non ancora configurati
- localStorage parzialmente corrotto

**Comportamento:**
- Banner informativo visibile (non bloccante)
- **Tutte le voci di menu rimangono attive**
- Toast: "Profilo incompleto. Completa i dati mancanti..."

**Recupero:**
1. Utente clicca su "Completa Profilo" nel banner
2. Modal onboarding si apre con dati esistenti pre-compilati
3. Utente completa i campi mancanti
4. Salvataggio e ripristino funzionalità

## Best Practices per Sviluppatori

### 1. Non Permettere Mai Stati Intermedi

❌ **Sbagliato:**
```javascript
// Permettere skip senza dati minimi
function skipOnboarding() {
    localStorage.setItem('onboardingComplete', 'true');
    // Nessun dato salvato!
}
```

✅ **Corretto:**
```javascript
// Skip non permesso, deve completare
function skipOnboarding() {
    console.warn('Skipping onboarding is not allowed.');
    return false;
}
```

### 2. Validare Sempre il Profilo

❌ **Sbagliato:**
```javascript
if (isOnboardingComplete()) {
    enableAllFeatures();
}
```

✅ **Corretto:**
```javascript
if (isOnboardingComplete() && isProfileComplete()) {
    enableAllFeatures();
} else {
    showBanner();
    disableMenu();
}
```

### 3. Fornire Feedback Chiaro

❌ **Sbagliato:**
```javascript
// Disabilita senza spiegazioni
button.disabled = true;
```

✅ **Corretto:**
```javascript
button.classList.add('disabled');
button.setAttribute('title', 'Completa il profilo per accedere');
button.addEventListener('click', () => {
    showToast('Completa il profilo per accedere a questa funzionalità');
});
```

### 4. Gestire Errori Gracefully

❌ **Sbagliato:**
```javascript
const data = JSON.parse(localStorage.getItem('data'));
// Può lanciare errore e bloccare l'app
```

✅ **Corretto:**
```javascript
const data = safeJSONParse(localStorage.getItem('data'), defaultValue);
// Ritorna sempre un valore valido
```

## Testing

### Test Manuali Essenziali

1. **Primo avvio pulito**
   ```
   1. Cancella localStorage
   2. Ricarica app
   3. Verifica: Modal onboarding appare
   4. Verifica: Menu disabilitato
   5. Verifica: Banner visibile
   ```

2. **Completamento onboarding**
   ```
   1. Compila solo campo Nome
   2. Submit form
   3. Verifica: Modal si chiude
   4. Verifica: Banner scompare
   5. Verifica: Menu tutto abilitato
   6. Verifica: Toast successo appare
   ```

3. **Validazione campo obbligatorio**
   ```
   1. Lascia campo Nome vuoto
   2. Prova submit
   3. Verifica: Form non si invia
   4. Verifica: Toast warning appare
   ```

4. **Dati corrotti**
   ```
   1. Imposta manualmente: localStorage.setItem('onboardingComplete', 'true')
   2. NON impostare teacherName
   3. Ricarica app
   4. Verifica: Banner appare
   5. Verifica: Menu disabilitato
   6. Verifica: Toast warning appare
   ```

5. **Recupero da profilo incompleto**
   ```
   1. Scenario dati corrotti attivo
   2. Clicca "Completa Profilo" nel banner
   3. Inserisci nome
   4. Salva
   5. Verifica: Menu si abilita
   6. Verifica: Banner scompare
   ```

6. **Click su voci disabilitate**
   ```
   1. Con profilo incompleto
   2. Clicca su voce disabilitata (es. Lezioni)
   3. Verifica: Nessun cambio tab
   4. Verifica: Toast warning appare
   ```

7. **localStorage non disponibile**
   ```
   1. Disabilita localStorage nel browser
   2. Ricarica app
   3. Verifica: Toast errore appare
   4. Verifica: App non si blocca
   ```

## Metriche e Monitoraggio

### Eventi da Tracciare

- `onboarding_started` - Modal aperta
- `onboarding_completed` - Form inviato con successo
- `onboarding_validation_error` - Errore validazione form
- `profile_incomplete_detected` - Dati corrotti rilevati
- `banner_shown` - Banner "Configurazione incompleta" mostrato
- `banner_button_clicked` - Click su "Completa Profilo"
- `menu_item_disabled_clicked` - Click su voce disabilitata
- `localStorage_error` - Errore accesso localStorage

### KPI

- **Tasso completamento onboarding** - % utenti che completano vs abbandonano
- **Tempo medio completamento** - Secondi dall'apertura modal al submit
- **Tasso errori validazione** - % submit falliti per validazione
- **Tasso recupero da errori** - % utenti che risolvono profilo incompleto

## Changelog

### v1.2.0 (2025-10-16)
- ✅ Implementato flusso onboarding obbligatorio
- ✅ Rimosso pulsante "Salta per Ora"
- ✅ Aggiunto banner persistente per configurazione incompleta
- ✅ Disabilitazione selettiva voci di menu
- ✅ Migliorata gestione errori localStorage
- ✅ Aggiunta validazione `isProfileComplete()`
- ✅ Feedback visivo per voci disabilitate
- ✅ Toast informativi per guidare l'utente
- ✅ Documentazione completa del flusso

### v1.1.0 (Precedente)
- Onboarding opzionale con skip
- Nessuna validazione profilo
- Menu sempre abilitato

---

**Versione documento:** 1.0  
**Autore:** Sistema Copilot  
**Ultimo aggiornamento:** 2025-10-16  
**Compatibile con:** Docente++ v1.2.0+
