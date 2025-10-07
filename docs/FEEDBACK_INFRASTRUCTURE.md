# 📋 Infrastruttura di Feedback - Docente++

## Panoramica

Questo documento descrive l'infrastruttura di feedback implementata per raccogliere bug, richieste di funzionalità e suggerimenti dalla community di Docente++.

## Template di Issue Disponibili

### 🐛 Segnalazione Bug
**File:** `.github/ISSUE_TEMPLATE/bug_report.md`  
**Label:** `bug`  
**Uso:** Per segnalare problemi, errori o malfunzionamenti nell'app

**Sezioni incluse:**
- Descrizione del bug
- Passaggi per riprodurre
- Comportamento atteso vs attuale
- Screenshot
- Informazioni ambiente (browser, OS, dispositivo)
- Contesto aggiuntivo
- Possibile soluzione

### ✨ Richiesta Funzionalità
**File:** `.github/ISSUE_TEMPLATE/feature_request.md`  
**Label:** `enhancement`  
**Uso:** Per proporre nuove funzionalità o miglioramenti

**Sezioni incluse:**
- Problema da risolvere
- Soluzione proposta
- Alternative considerate
- Priorità (alta/media/bassa)
- Caso d'uso
- Funzionalità correlate

### 🎨 Miglioramento UX/UI
**File:** `.github/ISSUE_TEMPLATE/ux_improvement.md`  
**Label:** `ux/ui`  
**Uso:** Per suggerire miglioramenti all'interfaccia e usabilità

**Sezioni incluse:**
- Area dell'interfaccia interessata
- Problema attuale
- Miglioramento proposto
- Benefici
- Mockup/esempi
- Flusso attuale vs proposto
- Dispositivi interessati

### 💬 Feedback Generale
**File:** `.github/ISSUE_TEMPLATE/feedback.md`  
**Label:** `feedback`  
**Uso:** Per condividere feedback generale sull'esperienza d'uso

**Sezioni incluse:**
- Tipo di feedback
- Contesto d'uso (livello scolastico, materie, ecc.)
- Funzionalità utilizzate
- Valutazione generale (1-5 stelle)
- Funzionalità prioritarie
- Note aggiuntive

## Configurazione

### config.yml
Il file `.github/ISSUE_TEMPLATE/config.yml` configura:
- Issue vuote abilitate (`blank_issues_enabled: true`)
- Link di contatto verso documentazione e discussioni

## Come Usare i Template

### Per gli Utenti

1. Vai su [Issues](https://github.com/antbrogame-a11y/docente-plus-plus/issues)
2. Clicca su "New Issue"
3. Scegli il template appropriato
4. Compila tutti i campi richiesti
5. Invia l'issue

**Link diretti:**
- [🐛 Segnala Bug](https://github.com/antbrogame-a11y/docente-plus-plus/issues/new?template=bug_report.md)
- [✨ Richiedi Funzionalità](https://github.com/antbrogame-a11y/docente-plus-plus/issues/new?template=feature_request.md)
- [🎨 Migliora UX/UI](https://github.com/antbrogame-a11y/docente-plus-plus/issues/new?template=ux_improvement.md)
- [💬 Condividi Feedback](https://github.com/antbrogame-a11y/docente-plus-plus/issues/new?template=feedback.md)

### Per i Maintainer

**Gestione delle Label:**
- `bug` - Problemi confermati
- `enhancement` - Nuove funzionalità
- `ux/ui` - Miglioramenti interfaccia
- `feedback` - Feedback generale
- `documentation` - Documentazione
- `good first issue` - Issue per principianti
- `help wanted` - Aiuto dalla community
- `priority: high/medium/low` - Priorità

**Workflow consigliato:**
1. Triaging: revisione issue nuove entro 48h
2. Labeling: assegnare label appropriate
3. Prioritizzazione: valutare impatto e urgenza
4. Assegnazione: assegnare a developer o milestone
5. Chiusura: dopo fix/implementazione con commento di follow-up

## CONTRIBUTING.md

Il file `CONTRIBUTING.md` fornisce:
- Guida completa ai contributi
- Esempi di buone segnalazioni
- Principi UX dell'app
- Workflow di sviluppo
- Linee guida per il codice
- Convenzioni commit
- Checklist testing

## Statistiche e Monitoraggio

### Metriche da Tracciare
- Numero issue per tipo (bug/feature/ux/feedback)
- Tempo medio di risposta
- Tasso di chiusura
- Funzionalità più richieste
- Problemi più comuni

### Analisi Periodica
Si consiglia di:
- Analizzare feedback mensile
- Identificare pattern ricorrenti
- Aggiornare roadmap basandosi su priorità utenti
- Comunicare progressi alla community

## Best Practices

### Per Segnalazioni Efficaci
1. **Sii specifico** - Più dettagli = più facile risolvere
2. **Usa screenshot** - Un'immagine vale 1000 parole
3. **Verifica duplicati** - Cerca prima di creare nuova issue
4. **Segui template** - Aiuta a fornire info complete
5. **Sii costruttivo** - Feedback positivo costruttivo è benvenuto

### Per Risposte Rapide
1. **Sii paziente** - Progetto mantenuto da volontari
2. **Fornisci info aggiuntive** se richieste
3. **Testa le soluzioni** proposte e dai feedback
4. **Chiudi l'issue** quando risolta

## Integrazione con README

Il README ora include:
- Link diretti a tutti i template
- Riferimento a CONTRIBUTING.md
- Sezione contributi migliorata
- Chiara call-to-action per feedback

## Manutenzione

### Aggiornamenti Futuri
I template vanno aggiornati quando:
- Cambiano funzionalità principali dell'app
- Si aggiungono nuove sezioni
- Il feedback indica confusione su certi campi
- Nuove tecnologie/browser necessitano tracciamento

### File da Mantenere Allineati
- `.github/ISSUE_TEMPLATE/*.md`
- `CONTRIBUTING.md`
- `README.md` (sezione contributi)
- Questa documentazione (`FEEDBACK_INFRASTRUCTURE.md`)

## Risorse Aggiuntive

- [GitHub Issue Templates Docs](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests)
- [Best Practices for Bug Reports](https://developer.mozilla.org/en-US/docs/Mozilla/QA/Bug_writing_guidelines)
- [CONTRIBUTING.md](../CONTRIBUTING.md)

---

**Ultima modifica:** 2025-01-XX  
**Maintainer:** Progetto Docente++
