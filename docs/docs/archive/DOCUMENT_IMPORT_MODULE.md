# 📂 Modulo Importazione e Gestione Documenti con IA

## Panoramica

Il modulo di importazione documenti è un sistema avanzato integrato in Docente++ che permette di caricare, classificare e importare automaticamente documenti didattici e anagrafici utilizzando l'intelligenza artificiale.

## Funzionalità Principali

### 🎯 Caratteristiche Chiave

1. **Caricamento Multi-Formato**
   - CSV (Comma-Separated Values)
   - XLSX/XLS (Microsoft Excel)
   - PDF (Portable Document Format)
   - TXT (Testo semplice)
   - JSON (JavaScript Object Notation)

2. **Classificazione Intelligente con IA**
   - Riconoscimento automatico del tipo di documento
   - Livello di confidenza della classificazione
   - Suggerimenti contestuali per l'importazione
   - Fallback manuale se l'IA non è disponibile

3. **Importazione Dati Studenti**
   - Mappatura automatica campi CSV/Excel
   - Supporto per nomi di colonne comuni in italiano e inglese
   - Gestione duplicati con merge intelligente
   - Anteprima dati prima dell'importazione

4. **Registrazione Audio Lezioni**
   - Registrazione audio in tempo reale
   - Timer e controlli di registrazione
   - Associazione automatica contesto (classe, lezione, data)
   - Riproduzione e download

5. **Storico Importazioni**
   - Tracciamento di tutti i documenti importati
   - Statistiche di importazione
   - Metadati e timestamp

## Come Usare il Modulo

### Accesso al Modulo

Il modulo è accessibile tramite:
- Tab "🤖 Importa/gestisci con IA" nella navigazione principale
- Pulsante "📥 Importa da File" nella sezione Studenti

### Importazione Studenti da CSV/Excel

#### Passo 1: Preparare il File

Crea un file CSV o Excel con le seguenti colonne (i nomi sono flessibili):

**Colonne supportate:**
- **nome** / **name** - Nome dello studente
- **cognome** / **lastname** - Cognome
- **email** / **e-mail** - Indirizzo email
- **classe** / **class** - Classe di appartenenza
- **data_nascita** / **birthdate** / **nascita** - Data di nascita (formato: YYYY-MM-DD)
- **onomastico** / **santo** / **nameday** - Onomastico (es. "San Giovanni - 24 Giugno")
- **note** / **notes** - Note aggiuntive

**Esempio CSV:**

```csv
nome,cognome,email,classe,data_nascita,onomastico,note
Mario,Rossi,mario.rossi@example.com,3A,2005-03-15,San Mario - 19 Gennaio,Studente eccellente in matematica
Laura,Bianchi,laura.bianchi@example.com,3A,2005-07-22,Santa Laura - 19 Ottobre,Partecipazione attiva
Giovanni,Verdi,giovanni.verdi@example.com,3B,2005-11-08,San Giovanni - 24 Giugno,Bravo in scienze
Anna,Neri,anna.neri@example.com,3B,2005-04-12,Sant'Anna - 26 Luglio,Ottima in italiano
```

**Esempio Excel:**

| nome     | cognome | email                      | classe | data_nascita | onomastico              | note                    |
|----------|---------|----------------------------|--------|--------------|-------------------------|-------------------------|
| Mario    | Rossi   | mario.rossi@example.com    | 3A     | 2005-03-15   | San Mario - 19 Gennaio  | Studente eccellente     |
| Laura    | Bianchi | laura.bianchi@example.com  | 3A     | 2005-07-22   | Santa Laura - 19 Ottobre| Partecipazione attiva   |

#### Passo 2: Caricare il File

1. Naviga alla sezione "🤖 Importa/gestisci con IA"
2. Clicca sull'area di upload "📎 Clicca per selezionare o trascina un file qui"
3. Seleziona il file CSV o Excel dal tuo computer
   - Oppure trascinalo direttamente nell'area di upload

#### Passo 3: Classificazione IA (se disponibile)

Se hai configurato l'API Key di OpenRouter:

1. Il sistema analizza automaticamente il contenuto del file
2. L'IA classifica il documento:
   - 👥 **Anagrafica Studenti**
   - 📚 **Materiali Didattici**
   - 📋 **Attività Didattiche**
   - ✅ **Valutazioni**
   - 📄 **Altro**

3. Viene mostrato il livello di confidenza (0-100%)
4. Ricevi suggerimenti per l'importazione

**Se l'IA non è disponibile:**
- Puoi classificare manualmente il documento
- Seleziona il tipo dal menu a tendina
- Procedi con l'importazione

#### Passo 4: Anteprima e Conferma

1. Il sistema mostra un'anteprima tabellare dei dati estratti
2. Verifica che i campi siano mappati correttamente:
   - Nome e Cognome uniti se separati
   - Email formattata correttamente
   - Date nel formato giusto
   - Onomastici leggibili

3. Opzioni disponibili:
   - **✅ Conferma Importazione** - Procede con l'import
   - **❌ Annulla** - Annulla l'operazione
   - **🤖 Affina con IA** - Richiede all'IA di ottimizzare i dati (prossimamente)

#### Passo 5: Gestione Duplicati

Il sistema gestisce automaticamente i duplicati:

**Criteri di identificazione:**
- Nome completo (case-insensitive)
- Email

**Comportamento:**
- **Nuovo studente** → Aggiunto all'elenco
- **Studente esistente** → I campi mancanti vengono integrati
  - Se birthdate esiste → mantiene quello esistente
  - Se birthdate è vuoto → aggiunge quello nuovo
  - Note vengono concatenate

**Risultato:**
```
✅ Importazione completata!

Nuovi studenti: 3
Duplicati aggiornati: 2
```

### Registrazione Audio Lezioni

#### Avviare una Registrazione

1. Vai nella sezione "🤖 Importa/gestisci con IA"
2. Scorri fino a "🎙️ Registrazione Audio Lezione"
3. Clicca "🎙️ Avvia Registrazione"
4. Autorizza l'accesso al microfono quando richiesto dal browser
5. La registrazione inizia con timer in tempo reale

#### Durante la Registrazione

- **Timer**: Mostra minuti:secondi trascorsi
- **Classe attiva**: Associata automaticamente alla registrazione
- **Contesto**: Data, ora e lezione corrente (se disponibile)

#### Fermare e Salvare

1. Clicca "⏹️ Ferma Registrazione"
2. L'audio viene salvato automaticamente
3. Ricevi una notifica di conferma
4. La registrazione appare nell'elenco sotto

#### Gestire le Registrazioni

Ogni registrazione mostra:
- **Data e ora** della registrazione
- **Classe** associata
- **Lezione** in corso (se disponibile)
- **Durata** in minuti:secondi
- **Player audio** integrato
- **Pulsanti**:
  - 💾 Download - Scarica il file WebM
  - 🗑️ Elimina - Rimuove la registrazione

> **⚠️ Nota importante**: Le registrazioni audio sono mantenute in memoria durante la sessione di lavoro. Per conservarle a lungo termine, ricordati di scaricarle prima di chiudere il browser.

## Tipi di Documento Supportati

### 👥 Anagrafica Studenti

**Contenuto riconosciuto:**
- Elenchi studenti con dati anagrafici
- Registri di classe
- Liste di iscritti

**Campi importati:**
- Nome completo
- Email
- Classe
- Data di nascita
- Onomastico
- Note

**Azioni disponibili:**
- Importazione diretta
- Gestione duplicati
- Merge intelligente

### 📚 Materiali Didattici (Prossimamente)

**Contenuto riconosciuto:**
- Programmi didattici annuali
- Syllabus
- Contenuti delle lezioni
- Bibliografia

**Azioni future:**
- Import automatico materiali
- Associazione a classi e discipline
- Organizzazione per argomento

### 📋 Attività Didattiche (Prossimamente)

**Contenuto riconosciuto:**
- Piani di attività
- Compiti e esercitazioni
- Progetti e laboratori
- Verifiche programmate

**Azioni future:**
- Import calendario attività
- Assegnazione automatica
- Tracking scadenze

### ✅ Valutazioni (Prossimamente)

**Contenuto riconosciuto:**
- Griglie di valutazione
- Criteri di assessment
- Voti e giudizi

**Azioni future:**
- Import criteri valutazione
- Creazione griglie automatiche
- Associazione a discipline

## Mappatura Automatica Campi

Il sistema riconosce automaticamente vari formati di colonne:

### Nome Studente
- `nome`, `name`
- `cognome`, `lastname`, `surname`
- `nome_completo`, `full_name`

**Comportamento:**
- Se `nome` e `cognome` sono separati → vengono uniti
- Se c'è solo `nome` → usato come nome completo

### Email
- `email`, `e-mail`, `mail`
- `posta_elettronica`

### Classe
- `classe`, `class`
- `sezione`, `section`
- `anno`, `year`

### Data di Nascita
- `data_nascita`, `data_di_nascita`
- `birthdate`, `birth_date`
- `nascita`, `dob`

**Formato supportato:**
- YYYY-MM-DD (raccomandato)
- DD/MM/YYYY
- Altri formati ISO

### Onomastico
- `onomastico`, `nameday`
- `santo`, `saint`
- `festeggiamento`

**Formato suggerito:**
- "San Giovanni - 24 Giugno"
- "Santa Maria - 12 Settembre"

### Note
- `note`, `notes`
- `commenti`, `comments`
- `osservazioni`, `observations`

## Storico Importazioni

Il sistema mantiene uno storico completo di tutte le importazioni:

**Informazioni tracciate:**
- Nome file originale
- Tipo file (CSV, XLSX, ecc.)
- Tipo classificazione (Anagrafica, Materiali, ecc.)
- Numero elementi importati
- Numero duplicati gestiti
- Data e ora importazione

**Accesso allo storico:**
- Sezione "📚 Documenti Importati" nel tab Documenti
- Visualizzazione cronologica
- Metadati completi per ogni importazione

## Requisiti Tecnici

### Browser Supportati
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

### Permessi Richiesti

**Per caricamento file:**
- Accesso al file system locale (automatico)

**Per registrazione audio:**
- Accesso al microfono (richiesta al primo utilizzo)

### API OpenRouter (Opzionale)

**Per classificazione IA:**
- API Key OpenRouter configurata in Impostazioni
- Model ID configurato (default: alibaba/tongyi-deepresearch-30b-a3b)

**Se non configurata:**
- Classificazione manuale disponibile
- Tutte le altre funzionalità operative

## Limitazioni

### Importazione
- **Dimensione file**: Limite del browser (generalmente 100MB)
- **Righe CSV/Excel**: Illimitate (dipende dalla memoria del browser)
- **Formati PDF**: Riconoscimento limitato, IA può aiutare

### Registrazioni Audio
- **Formato**: WebM (dipende dal browser)
- **Durata**: Illimitata
- **Storage**: Solo in memoria durante la sessione
- **Numero registrazioni**: Limitato dalla RAM disponibile

### Classificazione IA
- **Richiede connessione internet**
- **Richiede API Key OpenRouter**
- **Costo API**: In base al piano OpenRouter

## Privacy e Sicurezza

- **Dati locali**: Tutti i dati rimangono nel browser (localStorage)
- **Nessun server**: L'app non invia dati a server esterni (eccetto API IA)
- **API OpenRouter**: Solo contenuto documento per classificazione
- **Audio**: Mai inviato a server esterni
- **Controllo utente**: Puoi eliminare tutto in qualsiasi momento

## Risoluzione Problemi

### Il file non viene caricato

**Problema**: Il file non viene riconosciuto

**Soluzioni:**
1. Verifica che il formato sia supportato (CSV, XLSX, PDF, TXT, JSON)
2. Controlla che il file non sia corrotto
3. Riprova con un file più piccolo
4. Verifica la console del browser per errori

### Classificazione IA non funziona

**Problema**: "Impossibile classificare automaticamente"

**Soluzioni:**
1. Verifica di aver configurato l'API Key in Impostazioni
2. Controlla la connessione internet
3. Usa la classificazione manuale

### Campi non mappati correttamente

**Problema**: I dati finiscono nelle colonne sbagliate

**Soluzioni:**
1. Usa i nomi di colonne standard (vedi Mappatura Campi)
2. Verifica il formato del CSV (separatore, encoding)
3. Correggi manualmente dopo l'importazione

### Microfono non funziona

**Problema**: Impossibile avviare la registrazione

**Soluzioni:**
1. Autorizza l'accesso al microfono quando richiesto
2. Verifica le impostazioni privacy del browser
3. Controlla che il microfono sia connesso e funzionante
4. Prova con un browser diverso

### Registrazioni perse

**Problema**: Le registrazioni scompaiono

**Causa**: Le registrazioni sono in memoria, non persistenti

**Soluzione**: 
1. Scarica le registrazioni importanti prima di chiudere
2. Mantieni la tab del browser aperta durante la sessione

## Sviluppi Futuri

### In Roadmap

1. **Importazione Materiali Didattici**
   - Riconoscimento programmi
   - Estrazione argomenti
   - Associazione automatica a lezioni

2. **Importazione Attività**
   - Parser piani didattici
   - Creazione automatica attività
   - Gestione scadenze

3. **Trascrizione Audio IA**
   - Trascrizione automatica registrazioni
   - Estrazione concetti chiave
   - Generazione riassunti

4. **Affinamento Dati con IA**
   - Correzione errori automatica
   - Standardizzazione formati
   - Completamento dati mancanti

5. **Analisi Predittiva**
   - Suggerimenti basati su dati importati
   - Identificazione pattern
   - Raccomandazioni personalizzate

6. **Batch Import**
   - Caricamento multiplo file
   - Importazione massiva
   - Gestione code

## Feedback e Supporto

Per domande, suggerimenti o segnalazioni:
- Apri una [nuova issue](https://github.com/antbrogame-a11y/docente-plus-plus/issues) su GitHub
- Descrivi il problema o la richiesta in dettaglio
- Allega screenshot se utili

## Conclusione

Il Modulo di Importazione Documenti con IA rappresenta un passo avanti significativo nella digitalizzazione e automazione delle attività didattiche. Con il supporto dell'intelligenza artificiale, puoi risparmiare tempo prezioso nell'inserimento dati e concentrarti su ciò che conta davvero: insegnare.

---

**Versione**: 1.0.0  
**Ultimo aggiornamento**: Gennaio 2025  
**Licenza**: MIT
