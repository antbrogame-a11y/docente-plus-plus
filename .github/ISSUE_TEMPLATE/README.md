# 📝 Sistema di Issue Templates

## Panoramica

Il progetto Docente++ utilizza un sistema di template per le issue di GitHub che aiuta gli utenti a fornire informazioni complete e strutturate quando segnalano bug, propongono funzionalità o condividono feedback.

## Template Disponibili

### 🐛 Bug Report (`bug_report.md`)
Template per segnalare bug e malfunzionamenti dell'applicazione.

**Sezioni incluse:**
- Descrizione del Bug
- Passi per Riprodurre
- Comportamento Atteso
- Comportamento Attuale
- Screenshot
- Informazioni Ambiente (Browser, OS, Device, Versione)
- Log Errori
- Severità (Critico/Alto/Medio/Basso)
- Informazioni Aggiuntive
- Checklist di verifica

### ✨ Feature Request (`feature_request.md`)
Template per proporre nuove funzionalità.

**Sezioni incluse:**
- Descrizione della Funzionalità
- Problema da Risolvere
- Soluzione Proposta
- Alternative Considerate
- Mockup o Esempi
- Caso d'Uso
- Informazioni Contesto
- Priorità
- Dipendenze
- Checklist

### 💡 Feedback (`feedback.md`)
Template per condividere feedback generale e suggerimenti.

**Sezioni incluse:**
- Tipo di Feedback (Interfaccia, Funzionalità, IA, Mobile, ecc.)
- Descrizione del Feedback
- Problema o Esigenza
- Soluzione Proposta
- Screenshot o Esempi
- Priorità Percepita
- Contesto d'Uso
- Informazioni Aggiuntive
- Checklist

## Configurazione

Il file `config.yml` configura il sistema di template e fornisce link utili:

- **blank_issues_enabled: false** - Disabilita le issue vuote per assicurare che gli utenti usino sempre un template
- **contact_links** - Fornisce link rapidi a:
  - Documentazione
  - Discussioni
  - Domande e Supporto

## Come Usare i Template

### Per gli Utenti

1. Vai alla pagina Issues del repository
2. Clicca su "New Issue"
3. Seleziona il template appropriato dal chooser
4. Compila tutte le sezioni richieste
5. Rimuovi i commenti HTML (<!-- -->) che sono solo guide
6. Spunta le checkbox rilevanti
7. Invia la issue

### Per i Maintainer

**Modificare un Template:**
1. Modifica il file `.md` corrispondente in `.github/ISSUE_TEMPLATE/`
2. Mantieni la struttura YAML frontmatter (name, about, title, labels)
3. Usa commenti HTML per le istruzioni: `<!-- istruzione -->`
4. Testa il template creando una issue di prova

**Aggiungere un Nuovo Template:**
1. Crea un nuovo file `.md` in `.github/ISSUE_TEMPLATE/`
2. Aggiungi il frontmatter YAML all'inizio:
   ```yaml
   ---
   name: Nome Template
   about: Descrizione breve
   title: '[PREFIX] '
   labels: label1, label2
   assignees: ''
   ---
   ```
3. Struttura il contenuto con sezioni markdown (##)
4. Aggiungi checkbox per priorità/severità
5. Includi una checklist finale

## Best Practices

### Struttura delle Sezioni

- Usa emoji per rendere le sezioni più identificabili
- Separa le sezioni con `---` (linea orizzontale)
- Usa commenti HTML per fornire istruzioni: `<!-- istruzione -->`
- Lascia spazi vuoti dove l'utente deve scrivere

### Checkbox e Liste

```markdown
- [ ] Opzione 1
- [ ] Opzione 2
- [x] Opzione preselezionata
```

### Campi Richiesti

Per i campi richiesti, usa un commento esplicito:
```markdown
**Campo Richiesto:**
<!-- Questo campo è obbligatorio -->
```

### Campi Opzionali

Indica chiaramente i campi opzionali:
```markdown
## 📸 Screenshot (opzionale)
```

## Validazione

Quando ricevi una issue, verifica che:

1. ✅ Il template sia stato usato completamente
2. ✅ Tutte le sezioni richieste siano compilate
3. ✅ Le checkbox siano state spuntate dove appropriato
4. ✅ Le informazioni siano sufficienti per agire

Se una issue è incompleta:
1. Aggiungi il label `needs-more-info`
2. Commenta chiedendo le informazioni mancanti
3. Riferisci alle sezioni specifiche del template

## Manutenzione

### Revisione Periodica

Ogni 3-6 mesi, rivedi i template per:
- Aggiungere/rimuovere campi in base al feedback
- Aggiornare le istruzioni
- Migliorare la chiarezza
- Allineare con le nuove funzionalità dell'app

### Metriche da Monitorare

- Tasso di completamento dei template
- Frequenza di richieste "needs-more-info"
- Tempo medio di risoluzione per tipo di issue
- Feedback degli utenti sui template

## Risoluzione Problemi

### Issue Vuote o Incomplete

**Problema:** Gli utenti creano issue senza usare i template
**Soluzione:** `blank_issues_enabled: false` nel config.yml

### Template Non Appare nel Chooser

**Problema:** Il template non appare quando si crea una issue
**Possibili cause:**
1. Frontmatter YAML non valido
2. File non in `.github/ISSUE_TEMPLATE/`
3. Estensione file non corretta (deve essere `.md`)

**Debug:**
```bash
# Verifica la struttura YAML
head -7 .github/ISSUE_TEMPLATE/template_name.md

# Verifica il percorso
ls -la .github/ISSUE_TEMPLATE/
```

### Formattazione Rotta

**Problema:** Il template appare con formattazione rotta
**Causa comune:** Markdown non valido o YAML frontmatter non chiuso
**Soluzione:** 
1. Verifica che il frontmatter inizi con `---` e finisca con `---`
2. Controlla che non ci siano caratteri speciali non escaped nel YAML
3. Valida il markdown con un linter

## Risorse

- [GitHub Issue Templates Documentation](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository)
- [Markdown Guide](https://www.markdownguide.org/)
- [YAML Syntax](https://yaml.org/spec/1.2/spec.html)

---

**Ultimo aggiornamento:** 2025-10-18
**Maintainer:** Docente++ Team
