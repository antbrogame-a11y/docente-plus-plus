# 📋 Importazione Attività da PDF - Guida Completa

## Panoramica

Questa funzionalità permette di importare automaticamente attività didattiche annuali da file PDF (come "PIANO DIDATTICO ANNUALE DI TECNOLOGIA.pdf") nell'app Docente Plus Plus. Il sistema è in grado di:

- ✅ Estrarre testo da file PDF
- ✅ Analizzare e identificare attività didattiche
- ✅ Suddividere le attività per livello di classe (Prima, Seconda, Terza Media)
- ✅ Classificare automaticamente il tipo di attività (lezione, laboratorio, esercitazione, etc.)
- ✅ Importare le attività nel sistema per gestione e assegnazione

## Tecnologie Utilizzate

La soluzione utilizza **esclusivamente** tecnologie già presenti nel progetto:

- **PDF.js** (v3.11.174) - Libreria CDN per estrazione testo da PDF
- **OpenRouter AI** (opzionale) - Per classificazione intelligente del documento
- **JavaScript nativo** - Per parsing e analisi del testo
- **Regex e pattern matching** - Per identificazione di livelli classe e tipi di attività

## Come Funziona

### 1. Upload del PDF

1. Vai alla sezione **"📥 Importa Documenti"**
2. Clicca sull'area di upload o trascina il file PDF
3. Seleziona il file "PIANO DIDATTICO ANNUALE DI TECNOLOGIA.pdf"

### 2. Estrazione e Analisi

Il sistema:
- Estrae automaticamente il testo dal PDF usando PDF.js
- Analizza il contenuto con l'IA (se configurata) o permette classificazione manuale
- Identifica il documento come tipo "ATTIVITA"

### 3. Parsing delle Attività

Il parser utilizza pattern multipli per identificare attività:

#### Pattern di Riconoscimento Classe:
- **Prima Media**: `prima`, `1°`, `1^`, `1ª`, `classe prima`
- **Seconda Media**: `seconda`, `2°`, `2^`, `2ª`, `classe seconda`  
- **Terza Media**: `terza`, `3°`, `3^`, `3ª`, `classe terza`

#### Pattern di Riconoscimento Attività:
- Liste puntate: `- attività`, `• attività`, `· attività`
- Liste numerate: `1. attività`, `1) attività`
- Keyword specifiche: `lezione:`, `laboratorio:`, `esercitazione:`, etc.

#### Classificazione Tipo Attività:
- **📚 Lezione** - Keywords: lezione, spiegazione, introduzione, teoria
- **🔬 Laboratorio** - Keywords: laboratorio, pratica, esperimento
- **✏️ Esercitazione** - Keywords: esercitazione, esercizi, attività
- **📊 Progetto** - Keywords: progetto, elaborato
- **📝 Compiti** - Keywords: compito, compiti, homework
- **📄 Verifica** - Keywords: verifica, test, esame, valutazione

### 4. Anteprima e Conferma

Viene mostrata un'anteprima organizzata per classe:

```
📘 Prima Media (X attività)
  - Lista attività con tipo e stato

📘 Seconda Media (X attività)
  - Lista attività con tipo e stato

📘 Terza Media (X attività)
  - Lista attività con tipo e stato
```

### 5. Importazione Finale

Dopo la conferma:
- Le attività vengono salvate nel sistema
- Vengono associate alle classi corrispondenti (se esistenti)
- Sono immediatamente disponibili nella sezione "📋 Attività"
- L'importazione viene registrata in "Documenti Importati"

## Formati Supportati

Il sistema supporta l'importazione attività da:

### PDF
- Estrazione automatica del testo
- Parsing intelligente con pattern multipli
- Riconoscimento automatico dei livelli classe

### CSV/Excel
- Mapping automatico delle colonne:
  - `titolo`, `title`, `attività` → Titolo attività
  - `tipo`, `type` → Tipo attività
  - `classe`, `class`, `livello` → Livello classe
  - `descrizione`, `description` → Descrizione
  - `stato`, `status` → Stato

### JSON
- Supporto per strutture:
  ```json
  {
    "activities": [
      {
        "title": "...",
        "type": "lesson",
        "classLevel": "Prima",
        "description": "...",
        "status": "planned"
      }
    ]
  }
  ```

### Testo Semplice (TXT)
- Stesso parsing usato per PDF
- Riconoscimento pattern e livelli classe

## Struttura PDF Consigliata

Per risultati ottimali, strutturare il PDF in questo modo:

```
PIANO DIDATTICO ANNUALE DI TECNOLOGIA

PRIMA MEDIA
- Lezione: Introduzione alla tecnologia
- Laboratorio: Strumenti di misura
- Esercitazione: Disegno tecnico base
- Progetto: Realizzazione oggetto semplice

SECONDA MEDIA  
- Lezione: Materiali e proprietà
- Laboratorio: Test sui materiali
- Esercitazione: Calcoli tecnici
- Progetto: Costruzione meccanismo

TERZA MEDIA
- Lezione: Energia e fonti rinnovabili
- Laboratorio: Esperimenti elettrici
- Esercitazione: Circuiti elettrici
- Progetto: Sistema domotico
```

## Gestione Post-Importazione

Dopo l'importazione, ogni attività può essere:

- ✏️ Modificata - Titolo, descrizione, tipo, scadenza
- 🎯 Assegnata - A una classe specifica (il docente sceglie manualmente)
- 📅 Pianificata - Nel calendario/orario didattico
- ✅ Tracciata - Stato: pianificata, in corso, completata
- 🗑️ Eliminata - Se non più necessaria

**Nota importante**: Le attività importate sono per livelli generali (Prima, Seconda, Terza Media) e non vengono automaticamente assegnate a sezioni specifiche. Il docente può successivamente assegnarle manualmente alle sezioni desiderate (es. Prima A, Prima B, etc.).

## Livelli Classe

Le attività vengono importate con indicazione del livello generale:

- **Prima Media** - Attività per tutte le sezioni della prima
- **Seconda Media** - Attività per tutte le sezioni della seconda  
- **Terza Media** - Attività per tutte le sezioni della terza
- **Generale** - Attività non specifiche per livello

Il docente può poi assegnare manualmente ciascuna attività alla sezione specifica desiderata.

## Troubleshooting

### Nessuna attività trovata
- **Causa**: Il PDF non contiene pattern riconoscibili
- **Soluzione**: 
  1. Verifica che il PDF contenga testo (non solo immagini)
  2. Usa formati CSV/Excel per dati strutturati
  3. Aggiungi manualmente le attività

### Classificazione errata delle classi
- **Causa**: Pattern non standard nel PDF
- **Soluzione**:
  1. Le attività sono importate a livello generale (Prima, Seconda, Terza)
  2. Il docente può assegnare manualmente alle sezioni specifiche dopo l'importazione

### Tipo attività non corretto
- **Causa**: Keywords non riconosciute
- **Soluzione**: Modifica il tipo dopo l'importazione

### PDF non leggibile
- **Causa**: PDF protetto o basato su immagini
- **Soluzione**: 
  1. Rimuovi protezione dal PDF
  2. Usa OCR per convertire immagini in testo
  3. Esporta in formato testo e importa come TXT

## Testing

### Test con PDF di Esempio

1. **Crea un file di test** `test-piano-didattico.pdf` con contenuto:
   ```
   PIANO DIDATTICO ANNUALE
   
   CLASSE PRIMA
   - Lezione introduttiva sulla tecnologia
   - Laboratorio: uso degli strumenti
   
   CLASSE SECONDA  
   - Studio dei materiali
   - Progetto: costruzione di un oggetto
   
   CLASSE TERZA
   - Energia e circuiti
   - Verifica finale
   ```

2. **Importa il file**:
   - Vai a "📥 Importa Documenti"
   - Carica il PDF
   - Verifica che vengano estratte 6 attività
   - Conferma che siano divise per classe

3. **Valida i risultati**:
   - Vai a "📋 Attività"
   - Verifica presenza attività importate
   - Controlla livelli classe (Prima, Seconda, Terza Media)
   - Assegna manualmente alle sezioni specifiche se necessario
   - Testa modifica e pianificazione

### Test con CSV

File CSV di esempio `attivita.csv`:
```csv
titolo,tipo,classe,descrizione
"Introduzione tecnologia",lesson,Prima,"Lezione base"
"Lab strumenti",lab,Prima,"Uso strumenti di misura"
"Studio materiali",lesson,Seconda,"Proprietà materiali"
"Progetto circuiti",project,Terza,"Realizzazione circuito"
```

## Limitazioni Note

1. **PDF Solo Testo**: Non supporta PDF basati solo su immagini (richiede OCR esterno)
2. **Pattern Fissi**: Il riconoscimento si basa su pattern comuni italiani
3. **Classificazione IA**: Opzionale, richiede OpenRouter API key
4. **Livelli Generali**: Le attività sono importate per livelli generali (Prima, Seconda, Terza Media) e non vengono assegnate automaticamente a sezioni specifiche

## Sviluppi Futuri

- [ ] Supporto OCR integrato per PDF immagine
- [ ] Pattern personalizzabili dall'utente
- [ ] Import batch di più PDF
- [ ] Export attività in formato template PDF
- [ ] Suggerimenti IA per miglioramento attività

## Riferimenti Tecnici

- **PDF.js**: https://mozilla.github.io/pdf.js/
- **Codice sorgente**: `app.js` linee 3970-4382
- **Pattern regex**: Funzioni `extractActivitiesFromPDF()` e `detectActivityType()`
- **Mapping classi**: Funzione `createClassMapping()`

---

**📝 Nota**: Questa funzionalità è completamente integrata nel modulo di importazione documenti esistente e non richiede configurazioni aggiuntive oltre all'eventuale API key OpenRouter per la classificazione automatica.
