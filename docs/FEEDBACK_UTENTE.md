# 📝 Feedback Utente - Acquisizione Requisiti per Miglioramenti

## 📋 Panoramica

Questo documento raccoglie il feedback degli utenti per guidare lo sviluppo e il miglioramento continuo di **Docente++**. I feedback sono organizzati per area tematica con priorità e stato di implementazione.

---

## 🎨 1. Interfaccia Utente e Usabilità

### 1.1 Leggibilità e Design

**Problema Osservato:**
- Intestazione ingombrante all'ingresso nell'app
- Necessità di uno stile moderno, minimalista ma morbido
- Simboli e titoli occupano troppo spazio

**Miglioramenti Proposti:**
- ✅ Ridurre dimensioni header e padding
- ✅ Implementare hamburger menu per navigazione principale
- ✅ Ottimizzare gerarchia visiva dei testi (dimensioni basate su importanza)
- ✅ Applicare design più soft e minimalista
- ✅ Migliorare contrasto e leggibilità

**Priorità:** Alta  
**Stato:** ✅ Completato  
**Riferimento Issue:** #[numero]

### 1.2 Organizzazione e Navigazione

**Problema Osservato:**
- Sensazione di disordine e mancanza di guida
- Troppe funzionalità visibili contemporaneamente
- Manca raggruppamento logico per processi d'uso

**Miglioramenti Proposti:**
- ✅ Raggruppare funzionalità per casi d'uso (es. "In Classe", "Pianificazione", "Valutazione")
- ✅ Implementare wizard/guide contestuali
- [ ] Nascondere funzionalità avanzate in menu secondari
- [ ] Creare percorsi guidati per scenari comuni

**Priorità:** Alta  
**Stato:** 🔄 In corso (menu raggruppato implementato)

### 1.3 Coerenza tra Pagine

**Problema Osservato:**
- Manca coerenza visiva tra diverse sezioni
- Layout non uniforme

**Miglioramenti Proposti:**
- [ ] Standardizzare layout delle pagine
- [ ] Unificare pattern di navigazione
- [ ] Applicare spacing e dimensioni consistenti
- [ ] Creare componenti UI riutilizzabili

**Priorità:** Media  
**Stato:** In pianificazione

---

## 🤖 2. Intelligenza Artificiale e Automazione

### 2.1 Sistema IA Contestuale

**Problema Osservato:**
- IA non propone automaticamente azioni basate sul contesto d'uso
- Manca integrazione IA nel flusso di lavoro quotidiano

**Miglioramenti Proposti:**
- [ ] Implementare sistema di suggerimenti contestuali
- [ ] IA propone azioni all'accesso basate su:
  - Orario del giorno
  - Attività usuali dell'utente
  - Scadenze imminenti
  - Pattern di utilizzo
- [ ] Suggerimenti intelligenti durante la navigazione

**Priorità:** Alta  
**Stato:** In pianificazione  
**Complessità:** Alta

**Esempio Caso d'Uso:**
```
Scenario: Docente accede all'app alle 8:00
→ IA verifica orario: 1ª ora - Classe 2A - Italiano
→ Propone:
  - Apri registro classe 2A
  - Attività prevista: Verifica di comprensione
  - Visualizza elenco studenti con info rapide
```

### 2.2 Navigazione Intelligente

**Problema Osservato:**
- Sequenze di navigazione non ottimizzate per uso in classe
- Troppi click per azioni frequenti

**Miglioramenti Proposti:**
- [ ] Flusso rapido: Orario → Tocco cella ora → Schermata classe
- [ ] Quick actions da elenco studenti:
  - Valutare (voto rapido)
  - Annotare
  - Osservare
  - Ammonire (con semaforo colorato)
  - Elogiare/Supportare/Richiamare
- [ ] IA suggerisce azioni frequenti per studente

**Priorità:** Alta  
**Stato:** In pianificazione  
**Complessità:** Media

### 2.3 Agente IA Conversazionale

**Problema Osservato:**
- Icona IA fluttuante legata a funzionalità specifica
- Non permette dialogo aperto con IA per gestione app

**Miglioramenti Proposti:**
- [ ] Trasformare FAB IA in assistente conversazionale completo
- [ ] Permettere dialogo libero per:
  - Gestione dati (es. "Aggiungi voto 8 a Mario Rossi")
  - Ricerca informazioni (es. "Mostrami studenti con media <6")
  - Automazione task (es. "Genera programmazione mensile")
  - Supporto decisionale
- [ ] Contestualizzare risposte IA in base a pagina/sezione attiva

**Priorità:** Media  
**Stato:** In pianificazione  
**Complessità:** Alta

### 2.4 IA come Gestore Interno

**Problema Osservato:**
- IA non monitora funzionamento app
- Nessun sistema di auto-diagnosi

**Miglioramenti Proposti:**
- [ ] IA monitora:
  - Errori e incongruenze nei dati
  - Performance e problemi tecnici
  - Pattern di utilizzo anomali
- [ ] IA legge log e suggerisce correzioni
- [ ] Integrazione con GitHub per:
  - Apertura automatica issue su errori critici
  - Suggerimento miglioramenti basati su utilizzo
- [ ] Utente può aprire issue direttamente da app

**Priorità:** Bassa (Nice to have)  
**Stato:** Idea futura  
**Complessità:** Molto Alta

---

## 📂 3. Gestione Documenti e Import

### 3.1 Upload Piano Attività

**Problema Osservato:**
- Impossibile caricare piano delle attività
- IA non elabora documenti per popolare calendario annuale

**Miglioramenti Proposti:**
- [ ] Implementare upload documenti di pianificazione:
  - Piano Annuale delle Attività (PAA)
  - Programmazione didattica
  - Calendari scolastici
- [ ] IA elabora e estrae:
  - Date e scadenze
  - Tipologie attività
  - Collegamenti a classi/discipline
- [ ] Popolamento automatico calendario app

**Priorità:** Alta  
**Stato:** In pianificazione  
**Complessità:** Media-Alta

### 3.2 Upload Materiale Didattico

**Problema Osservato:**
- Sistema upload documenti non completamente funzionale
- IA non classifica/comprende materiali caricati

**Miglioramenti Proposti:**
- [ ] Migliorare sistema classificazione documenti IA:
  - Riconoscimento automatico tipo documento
  - Estrazione metadati (materia, classe, argomento)
  - Richiesta esplicita chiarimenti se ambiguo
- [ ] Organizzazione automatica materiali per:
  - Disciplina
  - Classe
  - Tipologia (teoria, esercizi, verifiche, ecc.)
- [ ] Collegamento materiali a lezioni/attività

**Priorità:** Media  
**Stato:** Parzialmente implementato  
**Complessità:** Media

---

## 🧪 4. Testing e Stabilità

### 4.1 Piano Test Funzionalità

**Problema Osservato:**
- Mancanza di piano di test strutturato
- Impossibilità di validare tutte le funzionalità

**Miglioramenti Proposti:**
- ✅ Creare piano di test completo (vedi BETA_TEST_PLAN.md)
- [ ] Test manuali per ogni caso d'uso
- [ ] Checklist verifiche pre-rilascio
- [ ] Documentazione procedure test

**Priorità:** Critica  
**Stato:** ✅ Completato (documento creato)

### 4.2 Stabilizzazione Beta

**Problema Osservato:**
- Necessità prodotto stabile prima di aggiungere nuove feature
- Alcune funzionalità già in README non completamente implementate

**Raccomandazioni:**
- [ ] Freeze feature (stop nuove funzionalità)
- [ ] Focus su bug fixing
- [ ] Completamento funzionalità incomplete
- [ ] Testing approfondito
- [ ] Documentazione completa funzionalità esistenti
- [ ] Release versione Beta stabile

**Priorità:** Critica  
**Stato:** In corso  
**Timeline Proposta:** 2-3 settimane

---

## 📊 5. Riepilogo Priorità

### Priorità Critica (Pre-Beta)
1. ✅ Piano di test completo
2. Stabilizzazione funzionalità esistenti
3. Bug fixing

### Priorità Alta (Post-Beta v1.0)
1. Miglioramento UI/UX (leggibilità, header, organizzazione)
2. Sistema IA contestuale con suggerimenti
3. Upload e elaborazione Piano Attività
4. Navigazione intelligente e quick actions

### Priorità Media (v1.1+)
1. Hamburger menu e navigazione migliorata
2. Agente IA conversazionale completo
3. Miglioramento gestione materiale didattico
4. Coerenza UI tra pagine

### Priorità Bassa (Futuro)
1. IA come gestore interno app
2. Integrazione GitHub automatica
3. Funzionalità avanzate auto-diagnosi

---

## 🔗 Riferimenti

- **Piano di Test:** [BETA_TEST_PLAN.md](./BETA_TEST_PLAN.md)
- **Issue GitHub:** [Apri nuova issue](https://github.com/antbrogame-a11y/docente-plus-plus/issues)
- **Documentazione Tecnica:** [docs/](.)

---

## 📬 Come Fornire Feedback

Per segnalare problemi, suggerire miglioramenti o discutere priorità:

1. **GitHub Issues:** [Apri una issue](https://github.com/antbrogame-a11y/docente-plus-plus/issues/new)
2. **In-App:** Usa funzione "Segnala Problema" (da implementare)
3. **Documentazione:** Contribuisci a questo file tramite Pull Request

---

**Ultimo aggiornamento:** 2024-10-07  
**Versione App:** Beta pre-1.0  
**Stato:** Documento vivo - aggiornato continuamente
