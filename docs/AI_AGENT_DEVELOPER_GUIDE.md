# 🤖 Agente IA Contestuale - Guida per Sviluppatori

## Panoramica

L'Agente IA Contestuale è un sistema modulare che fornisce assistenza intelligente basata sul contesto dell'applicazione. Questa guida spiega come estendere e personalizzare il sistema di suggerimenti contestuali.

## Architettura

### Componenti Principali

1. **FAB (Floating Action Button)** - `/js/ai-agent.js`
   - Pulsante floating sempre visibile
   - Drag & drop con salvataggio posizione in localStorage
   - Toggle visibilità tramite settings

2. **Modal Agente IA** - `index.html`
   - Interfaccia di dialogo contestuale
   - Suggerimenti specifici per sezione
   - Input prompt utente
   - Area output per risposte IA

3. **Sistema di Contesto** - `/js/ai-agent.js`
   - Rilevamento sezione attiva (`app.currentActiveTab`)
   - Mapping suggerimenti per sezione
   - Gestione stato e persistenza

## Come Estendere i Suggerimenti Contestuali

### 1. Aggiungere Suggerimenti per una Nuova Sezione

Nel file `/js/ai-agent.js`, modifica l'oggetto `CONTEXTUAL_SUGGESTIONS`:

```javascript
const CONTEXTUAL_SUGGESTIONS = {
    // ... altre sezioni ...
    'nuova-sezione': [
        { label: '🎯 Suggerimento 1', action: 'action-1' },
        { label: '📊 Suggerimento 2', action: 'action-2' },
        { label: '💡 Suggerimento 3', action: 'action-3' }
    ]
};
```

E aggiungi il nome della sezione in `SECTION_NAMES`:

```javascript
const SECTION_NAMES = {
    // ... altre sezioni ...
    'nuova-sezione': 'Nuova Sezione'
};
```

### 2. Implementare Logica Personalizzata per Suggerimenti

Modifica la funzione `handleSuggestionClick` per aggiungere logica specifica:

```javascript
function handleSuggestionClick(action, label) {
    const currentSection = getCurrentSection();
    
    switch(action) {
        case 'action-1':
            // Logica specifica per action-1
            // Es: analizza dati della sezione corrente
            const data = analyzeCurrentSectionData();
            displayAIResponse(data);
            break;
            
        case 'action-2':
            // Logica per action-2
            break;
            
        default:
            // Fallback al comportamento di default (stub)
            const mockResponse = generateMockResponse(action, label);
            outputContent.innerHTML = mockResponse;
    }
}
```

### 3. Integrare con API IA (OpenRouter o altro provider)

Per sostituire gli stub con chiamate API reali, modifica `handleUserPromptSubmit`:

```javascript
async function handleUserPromptSubmit() {
    const promptInput = document.getElementById('ai-prompt-input');
    const userPrompt = promptInput.value.trim();
    
    if (!userPrompt) {
        showToast('Inserisci una richiesta', 'warning');
        return;
    }

    // Mostra loading state
    showLoadingState();

    try {
        // 1. Costruisci il contesto applicativo
        const context = buildApplicationContext();
        
        // 2. Chiama API IA (esempio con OpenRouter)
        const response = await callAIAPI(userPrompt, context);
        
        // 3. Parsa e visualizza la risposta
        displayAIResponse(response);
        
        // 4. Estrai eventuali azioni proposte
        const proposedActions = parseProposedActions(response);
        if (proposedActions.length > 0) {
            displayProposedActions(proposedActions);
        }
        
    } catch (error) {
        console.error('AI API Error:', error);
        showToast('Errore nella richiesta IA', 'error');
    } finally {
        hideLoadingState();
        promptInput.value = '';
    }
}

// Esempio di chiamata API OpenRouter
async function callAIAPI(prompt, context) {
    const apiKey = localStorage.getItem('openrouter-api-key');
    
    if (!apiKey) {
        throw new Error('API key non configurata');
    }
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.href,
        },
        body: JSON.stringify({
            model: 'anthropic/claude-3-sonnet',
            messages: [
                {
                    role: 'system',
                    content: `Sei un assistente IA per insegnanti. Contesto: ${JSON.stringify(context)}`
                },
                {
                    role: 'user',
                    content: prompt
                }
            ]
        })
    });
    
    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
}
```

### 4. Costruire il Contesto Applicativo

Esempio di funzione per costruire un contesto ricco basato sulla sezione attiva:

```javascript
function buildApplicationContext() {
    const currentSection = getCurrentSection();
    const context = {
        section: currentSection,
        timestamp: new Date().toISOString(),
    };
    
    // Aggiungi dati specifici per sezione
    switch(currentSection) {
        case 'home':
            context.stats = {
                totalLessons: state.lessons.length,
                totalStudents: state.students.length,
                totalActivities: state.activities.length,
                totalEvaluations: state.evaluations.length
            };
            break;
            
        case 'students':
            context.students = state.students.map(s => ({
                id: s.id,
                name: `${s.firstName} ${s.lastName}`,
                class: s.classId
            }));
            break;
            
        case 'lessons':
            context.upcomingLessons = state.lessons
                .filter(l => new Date(l.date) >= new Date())
                .slice(0, 5);
            break;
            
        // ... altri casi ...
    }
    
    return context;
}
```

## Esempi di Parsing Richieste Utente

### Rilevamento Intent Semplice

```javascript
function parseUserRequest(prompt) {
    const lowercasePrompt = prompt.toLowerCase();
    
    const intents = {
        create: /crea|aggiungi|nuovo/i,
        analyze: /analizza|statistiche|report/i,
        suggest: /suggerisci|consiglia|idee/i,
        help: /aiuto|guida|come/i
    };
    
    for (const [intent, regex] of Object.entries(intents)) {
        if (regex.test(lowercasePrompt)) {
            return {
                intent,
                originalPrompt: prompt,
                context: getCurrentSection()
            };
        }
    }
    
    return {
        intent: 'general',
        originalPrompt: prompt,
        context: getCurrentSection()
    };
}
```

### Estrazione Entità

```javascript
function extractEntities(prompt) {
    const entities = {};
    
    // Estrai date
    const dateMatch = prompt.match(/\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}/);
    if (dateMatch) {
        entities.date = dateMatch[0];
    }
    
    // Estrai materie (basato su preset)
    const subjects = ['italiano', 'matematica', 'storia', 'inglese', 'scienze'];
    subjects.forEach(subject => {
        if (prompt.toLowerCase().includes(subject)) {
            entities.subject = subject;
        }
    });
    
    // Estrai nomi studenti
    const studentNames = state.students.map(s => 
        `${s.firstName} ${s.lastName}`.toLowerCase()
    );
    studentNames.forEach(name => {
        if (prompt.toLowerCase().includes(name)) {
            entities.studentName = name;
        }
    });
    
    return entities;
}
```

## Best Practices

### 1. Gestione Errori

Sempre gestire gli errori API e fornire feedback all'utente:

```javascript
try {
    const response = await callAIAPI(prompt, context);
    displayAIResponse(response);
} catch (error) {
    console.error('AI Error:', error);
    
    // Mostra messaggio utente-friendly
    if (error.message.includes('API key')) {
        showToast('Configura la tua API key nelle Impostazioni', 'warning');
        switchTab('settings');
    } else if (error.message.includes('quota')) {
        showToast('Quota API esaurita. Riprova più tardi.', 'error');
    } else {
        showToast('Errore nella richiesta IA. Riprova.', 'error');
    }
}
```

### 2. Caching Risposte

Per ridurre chiamate API e migliorare performance:

```javascript
const responseCache = new Map();

function getCacheKey(prompt, context) {
    return `${prompt}_${context.section}_${context.timestamp.split('T')[0]}`;
}

async function callAIAPIWithCache(prompt, context) {
    const cacheKey = getCacheKey(prompt, context);
    
    if (responseCache.has(cacheKey)) {
        console.log('Using cached response');
        return responseCache.get(cacheKey);
    }
    
    const response = await callAIAPI(prompt, context);
    responseCache.set(cacheKey, response);
    
    // Limita dimensione cache
    if (responseCache.size > 50) {
        const firstKey = responseCache.keys().next().value;
        responseCache.delete(firstKey);
    }
    
    return response;
}
```

### 3. Feedback Progressivo

Mostra feedback durante elaborazione lunga:

```javascript
function showLoadingState() {
    const outputSection = document.getElementById('ai-output-section');
    const outputContent = document.getElementById('ai-agent-results-content');
    
    outputSection.style.display = 'block';
    outputContent.innerHTML = `
        <div class="loading-indicator">
            <span class="spinner"></span>
            <p>L'Agente IA sta elaborando la tua richiesta...</p>
        </div>
    `;
}
```

## TODO per Integrazione Completa

- [ ] Aggiungere campo API key nelle Impostazioni
- [ ] Implementare chiamate API reali (OpenRouter, OpenAI, ecc.)
- [ ] Aggiungere parsing sofisticato delle richieste (NLP)
- [ ] Implementare azioni automatiche proposte dall'IA
- [ ] Aggiungere cronologia conversazioni
- [ ] Implementare streaming responses per IA
- [ ] Aggiungere supporto multimodale (immagini, documenti)
- [ ] Ottimizzare prompts per ogni sezione
- [ ] Aggiungere analytics utilizzo IA

## Riferimenti

- **Documentazione utente**: `/docs/AI_AGENT_CONTEXTUAL.md`
- **Codice sorgente**: `/js/ai-agent.js`
- **Esempi API OpenRouter**: https://openrouter.ai/docs
- **Issue GitHub**: #91

---

**Ultimo aggiornamento**: 2025-10-15  
**Versione**: 1.0 (Prima implementazione)
