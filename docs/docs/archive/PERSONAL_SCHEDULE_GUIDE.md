# 📅 Guida all'Orario Personale del Docente

## Panoramica

Il sistema di orario in Docente++ è stato riprogettato per essere completamente personale e incentrato sul docente. Ogni docente ha il proprio orario settimanale ricorrente che definisce quando e dove insegna durante la settimana.

## Caratteristiche Principali

### 1. Orario Personale Ricorrente

L'orario è **personale** e **ricorrente settimanalmente**. Non è più basato su date specifiche, ma su giorni della settimana e orari.

**Struttura della chiave:**
```
"NomeGiorno-Ora" 
Esempio: "Lunedì-08:00", "Martedì-10:00"
```

### 2. Celle Editabili

Ogni cella dell'orario può essere modificata cliccando su di essa. Puoi configurare:

- **Classe**: Seleziona la classe in cui insegni in quell'ora
- **Materia**: Specifica la materia insegnata
- **Tipo Lezione**: Scegli tra:
  - **T** - Teoria/Lezione frontale
  - **D** - Disegno/Arte
  - **L** - Laboratorio
  - **ECiv** - Educazione Civica
  - **V** - Verifica/Test
  - **P** - Pratica/Esercitazione

### 3. Pulsante "Entra in Classe"

Il pulsante **"Entra in Classe"** appare solo quando:
- La classe è stata configurata
- Il tipo di lezione è stato selezionato

Questo garantisce che entri in classe solo con le informazioni necessarie.

### 4. Interfaccia "In Classe"

Quando premi "Entra in Classe", accedi a un'interfaccia dedicata che mostra:

**Informazioni Contestuali:**
- Giorno e ora della lezione
- Classe e materia
- Tipo di attività

**Funzionalità Disponibili:**
- Lista completa degli studenti della classe
- Valutazione rapida degli studenti
- Note della lezione (salvate per ogni slot)
- Azioni rapide: Appello, Nuova Attività, Assistente IA

### 5. Orario Unificato

Tutti gli orari mostrati nell'app derivano dall'orario personale principale:
- **Dashboard**: Mostra le lezioni di oggi
- **Vista Settimanale**: Visualizza l'intera settimana
- **Vista Giornaliera**: Focus su un singolo giorno
- Tutti sono editabili direttamente

## Come Usare

### Configurare l'Orario

1. Vai alla sezione **Orario**
2. Clicca su una cella vuota (mostra "+ Aggiungi")
3. Seleziona:
   - Classe
   - Materia
   - Tipo Lezione
4. Salva

### Modificare una Cella

1. Clicca su una cella già configurata
2. Modifica i dati desiderati
3. Salva le modifiche
4. Oppure elimina la configurazione

### Entrare in Classe

1. Clicca sul pulsante **"Entra in Classe"** (disponibile solo se classe e tipo lezione sono configurati)
2. L'interfaccia "In Classe" si apre automaticamente con tutti i dati della lezione
3. Puoi:
   - Vedere tutti gli studenti
   - Valutare rapidamente
   - Prendere note della lezione
   - Accedere ad azioni rapide

### Uscire dalla Classe

Clicca sul pulsante **"Esci"** nell'interfaccia "In Classe" per tornare alla vista normale.

## Struttura Dati

### Formato Schedule

```javascript
{
  "Lunedì-08:00": {
    classId: "1A",
    subject: "Matematica",
    activityType: "T",
    notes: "Lezione su equazioni lineari..."
  },
  "Martedì-10:00": {
    classId: "2B",
    subject: "Storia",
    activityType: "L",
    notes: ""
  }
}
```

### Tipi di Attività

| Codice | Descrizione | Icona | Colore |
|--------|-------------|-------|--------|
| T | Teoria/Lezione | 📚 | Blu |
| D | Disegno/Arte | ✏️ | Arancione |
| L | Laboratorio | 🔬 | Verde |
| ECiv | Ed. Civica | 📖 | Viola |
| V | Verifica/Test | 📝 | Rosso |
| P | Pratica | 🏃 | Giallo |

## Vantaggi del Nuovo Sistema

1. **Personalizzazione**: L'orario è completamente tuo
2. **Semplicità**: Un unico orario ricorrente, non date complicate
3. **Flessibilità**: Modifica qualsiasi cella in qualsiasi momento
4. **Integrazione**: Tutti gli orari mostrati derivano dalla stessa fonte
5. **Contesto**: Entra in classe con tutte le informazioni già pronte
6. **Efficienza**: Accesso rapido a studenti, note e azioni

## Migrazione da Vecchio Sistema

Se avevi un orario basato su date specifiche, il sistema è stato automaticamente convertito al nuovo formato. Tuttavia:

- Verifica che tutte le tue lezioni ricorrenti siano state correttamente convertite
- Aggiungi eventuali lezioni mancanti manualmente
- Configura classe e tipo lezione per ogni slot

## Risoluzione Problemi

### Il pulsante "Entra in Classe" non appare

**Soluzione**: Assicurati di aver configurato sia la classe che il tipo di lezione per quella cella.

### Non vedo le lezioni di oggi nella dashboard

**Soluzione**: Verifica che l'orario sia configurato per il giorno corrente della settimana.

### Le modifiche non vengono salvate

**Soluzione**: Controlla che il browser abbia accesso al localStorage. Verifica le impostazioni sulla privacy.

## Best Practices

1. **Configura l'orario all'inizio dell'anno**: Imposta tutte le tue lezioni ricorrenti una volta
2. **Usa tipi lezione consistenti**: Mantieni coerenza nei tipi di lezione per reportistica
3. **Prendi note durante la lezione**: Usa il campo note per tracciare progressi e osservazioni
4. **Valuta regolarmente**: Usa la funzione di valutazione rapida durante la classe
5. **Rivedi settimanalmente**: Controlla l'orario settimanale per pianificare

## API e Integrazione

### Funzioni Principali

```javascript
// Ottenere la chiave dello schedule
app.getScheduleKey(date, time)
// Restituisce: "NomeGiorno-Ora"

// Entrare in classe
app.enterClassroom(scheduleKey)

// Salvare note della lezione
app.saveLessonNotes(scheduleKey)

// Uscire dalla classe
app.exitClassroom()
```

### Eventi

Il sistema emette eventi per:
- Modifica orario
- Entrata in classe
- Uscita da classe
- Salvataggio note

## Supporto

Per domande o problemi:
1. Consulta la documentazione completa
2. Verifica la sezione Risoluzione Problemi
3. Contatta il supporto tecnico

---

**Versione**: 1.0.0  
**Ultimo Aggiornamento**: 2025-10-17  
**Autore**: Team Docente++
