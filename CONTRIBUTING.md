# 🤝 Guida ai Contributi - Docente++

Grazie per il tuo interesse nel contribuire a Docente++! Questa guida ti aiuterà a capire come segnalare bug, proporre funzionalità e contribuire al progetto.

## 📋 Indice

- [Come Contribuire](#come-contribuire)
- [Segnalazione Bug](#segnalazione-bug)
- [Richiesta Funzionalità](#richiesta-funzionalità)
- [Miglioramenti UX/UI](#miglioramenti-uxui)
- [Feedback Generale](#feedback-generale)
- [Processo di Sviluppo](#processo-di-sviluppo)
- [Linee Guida per il Codice](#linee-guida-per-il-codice)
- [Documentazione](#documentazione)

## 🚀 Come Contribuire

Ci sono diversi modi per contribuire a Docente++:

1. **🐛 Segnalare Bug** - Hai trovato un problema? Aiutaci a risolverlo!
2. **✨ Proporre Funzionalità** - Hai un'idea per migliorare l'app? Condividila!
3. **🎨 Migliorare UX/UI** - L'interfaccia potrebbe essere più intuitiva? Diccelo!
4. **💬 Fornire Feedback** - La tua esperienza d'uso è preziosa per noi
5. **💻 Contribuire al Codice** - Vuoi sviluppare nuove funzionalità? Fantastico!
6. **📚 Migliorare la Documentazione** - Aiutaci a rendere la documentazione più chiara

## 🐛 Segnalazione Bug

Prima di segnalare un bug:

1. **Verifica** che non sia già stato segnalato nelle [Issues esistenti](https://github.com/antbrogame-a11y/docente-plus-plus/issues)
2. **Assicurati** di usare l'ultima versione dell'app
3. **Prova** a riprodurre il bug in un browser diverso

Per segnalare un bug:

1. Usa il template [🐛 Segnalazione Bug](https://github.com/antbrogame-a11y/docente-plus-plus/issues/new?template=bug_report.md)
2. Fornisci una descrizione chiara del problema
3. Includi i passaggi per riprodurre il bug
4. Aggiungi screenshot se possibile
5. Specifica browser, sistema operativo e dispositivo

### Esempio di Buona Segnalazione

```markdown
## Descrizione
Quando aggiungo uno studente con un nome molto lungo (>50 caratteri), 
il testo esce dal contenitore nella lista studenti.

## Passaggi per Riprodurre
1. Vai su "Gestione Studenti"
2. Clicca "Aggiungi Studente"
3. Inserisci un nome lungo (es. "Alessandro Bartolomeo Cristoforo...")
4. Salva lo studente
5. Il nome nella lista non è completamente visibile

## Browser: Chrome 120 su Windows 11
```

## ✨ Richiesta Funzionalità

Per proporre una nuova funzionalità:

1. Usa il template [✨ Richiesta Funzionalità](https://github.com/antbrogame-a11y/docente-plus-plus/issues/new?template=feature_request.md)
2. Spiega **il problema** che la funzionalità risolverebbe
3. Descrivi **la soluzione proposta**
4. Fornisci un **caso d'uso concreto**
5. Indica la **priorità** (alta, media, bassa)

### Funzionalità Prioritarie

Consulta la sezione [📋 Cose da Fare](README.md#-cose-da-fare-to-do) nel README per le funzionalità già pianificate.

## 🎨 Miglioramenti UX/UI

Per suggerire miglioramenti all'interfaccia:

1. Usa il template [🎨 Miglioramento UX/UI](https://github.com/antbrogame-a11y/docente-plus-plus/issues/new?template=ux_improvement.md)
2. Specifica l'**area dell'interfaccia** coinvolta
3. Descrivi il **problema attuale**
4. Proponi il **miglioramento**
5. Aggiungi **mockup o esempi** se possibile

### Principi UX di Docente++

- **Semplicità** - L'interfaccia deve essere intuitiva anche per chi non è esperto di tecnologia
- **Accessibilità** - Tutti devono poter usare l'app, incluse persone con disabilità
- **Chiarezza** - Ogni funzione deve essere chiara nel suo scopo
- **Efficienza** - Ridurre al minimo i passaggi per completare le attività comuni

## 💬 Feedback Generale

Per condividere la tua esperienza:

1. Usa il template [💬 Feedback Generale](https://github.com/antbrogame-a11y/docente-plus-plus/issues/new?template=feedback.md)
2. Descrivi il tuo **contesto d'uso** (livello scolastico, materie, ecc.)
3. Condividi cosa **funziona bene** e cosa **non funziona**
4. Indica le **funzionalità che usi di più**
5. Suggerisci **priorità** per lo sviluppo futuro

## 💻 Processo di Sviluppo

Se vuoi contribuire con codice:

### 1. Fork e Clone

```bash
# Fork il repository su GitHub, poi:
git clone https://github.com/TUO-USERNAME/docente-plus-plus.git
cd docente-plus-plus
```

### 2. Crea un Branch

```bash
git checkout -b feature/nome-funzionalita
# oppure
git checkout -b fix/nome-bug
```

### 3. Sviluppa

- Lavora sulla tua funzionalità o fix
- Testa accuratamente le modifiche
- Segui le [Linee Guida per il Codice](#linee-guida-per-il-codice)

### 4. Commit

```bash
git add .
git commit -m "Descrizione chiara delle modifiche"
```

**Convenzioni per i Commit:**
- `feat:` per nuove funzionalità
- `fix:` per correzioni di bug
- `docs:` per modifiche alla documentazione
- `style:` per modifiche di stile/formattazione
- `refactor:` per refactoring del codice
- `test:` per aggiunta o modifica di test

**Esempi:**
```
feat: aggiungi esportazione PDF delle valutazioni
fix: correggi overflow testo lungo nomi studenti
docs: migliora guida installazione PWA
```

### 5. Push e Pull Request

```bash
git push origin feature/nome-funzionalita
```

Poi apri una Pull Request su GitHub con:
- Descrizione chiara delle modifiche
- Riferimento alle issue correlate (es. "Closes #123")
- Screenshot per modifiche UI

## 📝 Linee Guida per il Codice

### Struttura del Progetto

```
docente-plus-plus/
├── index.html          # UI principale
├── app.js             # Logica applicazione (classe DocentePlusPlus)
├── styles.css         # Stili
├── manifest.json      # Configurazione PWA
├── sw.js             # Service Worker
├── docs/             # Documentazione
└── icons/            # Icone PWA
```

### Stile JavaScript

- Usa **camelCase** per variabili e funzioni
- Usa **PascalCase** per classi
- Commenta il codice complesso
- Mantieni le funzioni brevi e focalizzate
- Gestisci sempre gli errori con try/catch

```javascript
// ✅ Buono
async function loadStudents() {
    try {
        const data = localStorage.getItem('students');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading students:', error);
        return [];
    }
}

// ❌ Da evitare
function loadStudents() {
    return JSON.parse(localStorage.getItem('students'));
}
```

### Stile HTML

- Usa tag semantici (`<section>`, `<article>`, `<nav>`)
- Aggiungi attributi ARIA per accessibilità
- Mantieni l'indentazione consistente (4 spazi)

### Stile CSS

- Usa classi descrittive
- Raggruppa stili correlati
- Mantieni la specificità bassa
- Usa variabili CSS per colori e dimensioni comuni

### Testing

Prima di fare commit:

1. **Testa su browser diversi** (Chrome, Firefox, Safari)
2. **Testa su dispositivi diversi** (Desktop, Tablet, Mobile)
3. **Verifica la PWA** - L'app deve funzionare offline
4. **Controlla la console** - Nessun errore JavaScript
5. **Valida l'accessibilità** - Prova la navigazione da tastiera

### LocalStorage

Docente++ salva tutti i dati in localStorage. Chiavi usate:

```javascript
// Profilo docente
'teacher-first-name', 'teacher-last-name', 'teacher-email'
'school-name', 'school-level', 'school-year'

// Dati
'students', 'classes', 'lessons', 'evaluations'
'activities', 'schedule', 'rss-feeds', 'news-items'

// Configurazione
'openrouter-api-key', 'openrouter-model-id'
'onboarding-completed', 'active-class-id'
```

## 📚 Documentazione

### Aggiungere Documentazione

La documentazione si trova in `/docs/`:

- Guide per utenti finali
- Documentazione tecnica
- Architettura e design decisions

### Stile Documentazione

- Usa **emoji** per rendere la documentazione più leggibile
- Scrivi in **italiano** (lingua del progetto)
- Usa **esempi pratici** quando possibile
- Mantieni un **tono amichevole** ma professionale

## 🏷️ Labels

Le issue vengono etichettate con:

- `bug` - Problemi e malfunzionamenti
- `enhancement` - Nuove funzionalità
- `ux/ui` - Miglioramenti interfaccia
- `feedback` - Feedback generale
- `documentation` - Documentazione
- `good first issue` - Adatto per chi inizia
- `help wanted` - Aiuto richiesto dalla community
- `priority: high/medium/low` - Priorità

## ❓ Domande?

Se hai domande:

1. Controlla la [Documentazione](docs/)
2. Cerca nelle [Issues esistenti](https://github.com/antbrogame-a11y/docente-plus-plus/issues)
3. Apri una [nuova issue](https://github.com/antbrogame-a11y/docente-plus-plus/issues/new/choose) con il template Feedback

## 🙏 Grazie!

Ogni contributo, grande o piccolo, è prezioso. Grazie per aiutarci a migliorare Docente++!

---

**Licenza**: Contribuendo a questo progetto, accetti che i tuoi contributi siano rilasciati sotto la licenza MIT del progetto.
