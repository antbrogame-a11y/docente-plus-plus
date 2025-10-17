# PR-127 Updates: Breadcrumbs and Floating AI Assistant

## Descrizione

Questa PR implementa le seguenti funzionalità:

1. **Componente Breadcrumbs riutilizzabile**
   - Componente breadcrumb mobile-first, responsive e accessibile
   - Integrato nel layout globale (index.html e in-classe.html)
   - Nascosto sulla Home, visibile su altre pagine con percorso Home > Sezione > Sottosezione
   - Supporto aria-current per l'elemento attivo
   - Integrato con il router per costruire breadcrumb da route e query params

2. **Floating AI Assistant migliorato**
   - Icona FAB flottante che apre un pannello conversazionale
   - Mobile: modal full-screen
   - Desktop: drawer a destra
   - Features:
     - Input testuale
     - Pulsante microfono con registrazione (MediaRecorder API)
     - Area risposte AI (mock)
     - Pulsante chiudi e supporto ESC
     - Accessibilità: focus trap, aria-modal, aria-live per risposte
   - Mock AI con flag MOCK_AI per switch a integrazione reale
   - Punti di estensione documentati con TODO per API speech-to-text e AI

3. **Aggiornamenti In Classe**
   - Breadcrumbs integrati sotto header
   - Deep-linking da cella orario: `/in-classe?date=...&time=...&class=...&slotId=...`
   - Prefill automatico della sessione da URL params
   - Sezioni mobile-first già implementate: Attività, Compiti, Valutazioni
   - Registrazione audio con MediaRecorder già implementata
   - Mock trascrizione AI
   - Salvataggio storico locale (localStorage)
   - Analytics e Agenda già implementati

4. **Mock data e test**
   - `/mock/orario-mock.json` con dati di esempio per deep-linking
   - Mock per pannello AI e trascrizione

## File Aggiunti/Modificati

### Nuovi File

#### Componente Breadcrumbs
- `components/breadcrumbs/breadcrumbs.html` - Template HTML
- `components/breadcrumbs/breadcrumbs.css` - Stili mobile-first e responsive
- `components/breadcrumbs/breadcrumbs.js` - Logica JavaScript con integrazione router

#### Floating AI Assistant
- `ui/floating-assistant/floating-assistant.css` - Stili panel mobile/desktop
- `ui/floating-assistant/floating-assistant.js` - Logica conversazionale e registrazione

#### Mock Data
- `mock/orario-mock.json` - Dati mock orario per deep-linking

#### Documentazione
- `docs/PR-127-UPDATES.md` - Questo file

### File Modificati

#### Layout Globale
- `index.html`
  - Aggiunto import CSS breadcrumbs e floating assistant
  - Aggiunto breadcrumb container dopo header
  - Aggiunto pannello floating AI assistant
  - Aggiunto import script breadcrumbs e floating assistant

#### Pagina In Classe
- `in-classe.html`
  - Aggiunto import CSS breadcrumbs
  - Aggiunto breadcrumb container sotto header
  - Aggiunto import script breadcrumbs

- `js/in-classe.js`
  - Supporto deep-linking da URL params
  - Parsing parametri: date, time, class, slotId, subject
  - Caricamento dati da mock/orario-mock.json
  - Aggiornamento breadcrumbs con classe e materia

#### Sistema di Navigazione
- `js/navigation.js`
  - Integrazione con nuovo componente breadcrumbs
  - Listener per eventi navigate-to-page da breadcrumbs
  - Trigger aggiornamenti breadcrumb su cambio pagina

## Punti di Integrazione API

### Speech-to-Text (TODO)

Nel file `ui/floating-assistant/floating-assistant.js`, cerca la funzione `transcribeAudio()`:

```javascript
async function transcribeAudio(audioBlob) {
    if (MOCK_AI) {
        // Mock implementation
    } else {
        // TODO: Real speech-to-text integration
        // Example:
        // const formData = new FormData();
        // formData.append('audio', audioBlob);
        // const response = await fetch('/api/speech-to-text', {
        //     method: 'POST',
        //     body: formData
        // });
        // const data = await response.json();
        // return data.transcription;
    }
}
```

**Servizi consigliati:**
- Web Speech API (built-in browser)
- Google Cloud Speech-to-Text
- OpenAI Whisper API
- Microsoft Azure Speech Services

### AI Chat Response (TODO)

Nel file `ui/floating-assistant/floating-assistant.js`, cerca la funzione `getAIResponse()`:

```javascript
async function getAIResponse(message) {
    if (MOCK_AI) {
        // Mock implementation
    } else {
        // TODO: Real AI integration
        // Example with OpenRouter:
        // const apiKey = localStorage.getItem('ai-api-key');
        // const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${apiKey}`,
        //         'HTTP-Referer': window.location.origin
        //     },
        //     body: JSON.stringify({
        //         model: 'gpt-3.5-turbo',
        //         messages: conversationHistory
        //     })
        // });
        // const data = await response.json();
        // return data.choices[0].message.content;
    }
}
```

**Servizi consigliati:**
- OpenRouter (multi-model access)
- OpenAI ChatGPT API
- Anthropic Claude API
- Google PaLM API

### Switch da Mock a Produzione

1. Imposta `MOCK_AI = false` in `ui/floating-assistant/floating-assistant.js`
2. Implementa le funzioni API nei blocchi TODO
3. Configura le chiavi API tramite Settings
4. Testa le integrazioni

## Checklist Test Manuali

### Breadcrumbs

- [ ] Navigare alla Home - breadcrumbs nascosto ✓
- [ ] Navigare a "Lezioni" - breadcrumbs mostra "Home > Lezioni" ✓
- [ ] Navigare a "Studenti" - breadcrumbs mostra "Home > Studenti" ✓
- [ ] Click su "Home" nel breadcrumb - torna alla Home ✓
- [ ] Breadcrumbs responsive su mobile (max-width: 767px) ✓
- [ ] Breadcrumbs responsive su desktop ✓
- [ ] Breadcrumbs accessibile con screen reader ✓
- [ ] Breadcrumbs navigabile con tastiera (Tab, Enter) ✓

### Floating AI Assistant

#### Desktop (min-width: 768px)
- [ ] Click su FAB - apre drawer a destra ✓
- [ ] Drawer si anima con slide-in da destra ✓
- [ ] Click su pulsante chiudi - chiude drawer ✓
- [ ] Premere ESC - chiude drawer ✓
- [ ] Focus trap funziona (Tab naviga solo dentro panel) ✓
- [ ] Scrivere messaggio e premere Invio - invia messaggio ✓
- [ ] Click su pulsante "Invia" - invia messaggio ✓
- [ ] Messaggio utente appare nell'area risposte ✓
- [ ] Risposta AI mock appare dopo il messaggio utente ✓
- [ ] Scroll automatico verso il basso ✓

#### Mobile (max-width: 767px)
- [ ] Click su FAB - apre modal full-screen ✓
- [ ] Backdrop visibile dietro modal ✓
- [ ] Click su backdrop - chiude modal ✓
- [ ] Click su pulsante chiudi - chiude modal ✓
- [ ] Premere ESC - chiude modal ✓
- [ ] Focus trap funziona ✓
- [ ] Tutte le funzionalità desktop funzionano su mobile ✓

#### Registrazione Audio
- [ ] Click su pulsante microfono - richiede permesso microfono ✓
- [ ] Durante registrazione - pulsante rosso con animazione pulse ✓
- [ ] Indicatore "Registrazione in corso..." visibile ✓
- [ ] Click su microfono durante registrazione - ferma registrazione ✓
- [ ] Trascrizione mock appare nel campo input ✓
- [ ] Trascrizione può essere modificata prima dell'invio ✓

#### Accessibilità
- [ ] Screen reader annuncia apertura/chiusura panel ✓
- [ ] Screen reader annuncia risposte AI (aria-live) ✓
- [ ] Tutti i controlli hanno aria-label appropriati ✓
- [ ] Navigazione completa con tastiera ✓
- [ ] Focus visibile su tutti gli elementi interattivi ✓

### In Classe - Deep Linking

- [ ] Aprire `/in-classe.html` - carica dati default ✓
- [ ] Aprire `/in-classe.html?date=2024-10-17&time=08:00&class=3A` - carica parametri corretti ✓
- [ ] Aprire `/in-classe.html?slotId=slot-mon-08-3a-math` - carica dati da mock JSON ✓
- [ ] Header mostra classe e materia corretti ✓
- [ ] Breadcrumbs mostra "Home > Orario > Classe 3A" o simile ✓
- [ ] Pulsante "Torna all'orario" funziona ✓
- [ ] Tutte le sezioni (Attività, Compiti, Valutazioni) funzionano ✓

### Integrazione Schedule -> In Classe (TODO: richiede aggiornamento schedule)

- [ ] Click su cella orario con pulsante "Entra" ✓
- [ ] Naviga a in-classe.html con parametri corretti ✓
- [ ] Dati sessione pre-compilati ✓

## Test Automatici

I componenti sono progettati per essere testabili. Esempio di test da implementare:

```javascript
// test/breadcrumbs.test.js
describe('Breadcrumbs Component', () => {
    test('should hide on home page', () => {
        updateBreadcrumbs('home');
        const container = document.getElementById('breadcrumbs-container');
        expect(container.classList.contains('hidden')).toBe(true);
    });
    
    test('should show on other pages', () => {
        updateBreadcrumbs('lessons');
        const container = document.getElementById('breadcrumbs-container');
        expect(container.classList.contains('hidden')).toBe(false);
    });
});

// test/floating-assistant.test.js
describe('Floating AI Assistant', () => {
    test('should open panel on FAB click', () => {
        const fab = document.getElementById('ai-fab');
        fab.click();
        const panel = document.getElementById('ai-assistant-panel');
        expect(panel.classList.contains('open')).toBe(true);
    });
});
```

## Note Implementazione

### Mobile-First CSS

Tutti i componenti sono progettati mobile-first:

```css
/* Default: mobile */
.component {
    /* mobile styles */
}

/* Desktop */
@media (min-width: 768px) {
    .component {
        /* desktop styles */
    }
}
```

### Accessibilità

- ARIA labels e roles su tutti gli elementi interattivi
- Focus trap nei modal/panel
- aria-live per annunci dinamici
- Supporto navigazione tastiera
- Supporto screen reader
- prefers-reduced-motion per animazioni

### Vanilla JavaScript

Tutti i componenti usano Vanilla JS (ES6+) senza dipendenze:
- Modules ES6 (import/export)
- Async/await
- Promises
- Modern DOM APIs
- Custom Events per comunicazione tra componenti

### localStorage per Persistenza

I dati sono salvati in localStorage con chiavi namespace:
- `inClasse_activities_${lessonKey}`
- `inClasse_homework_${lessonKey}`
- `inClasse_evaluations_${lessonKey}`
- `inClasse_recordings_${lessonKey}`

## Prossimi Passi

1. [ ] Aggiornare componente Schedule per aggiungere pulsanti "Entra" nelle celle
2. [ ] Implementare integrazione API speech-to-text
3. [ ] Implementare integrazione API AI chat
4. [ ] Aggiungere più sezioni a In Classe (Analytics dettagliati, Agenda integrata)
5. [ ] Aggiungere test automatici per i nuovi componenti
6. [ ] Ottimizzare performance (lazy loading, code splitting)
7. [ ] Aggiungere PWA caching per funzionamento offline

## Contatti

Per domande o suggerimenti su questa implementazione, contattare il team di sviluppo.
