# 📋 Guida alla Configurazione - Docente++

## Introduzione

Questa guida ti aiuterà a configurare Docente++ per adattarlo alle tue esigenze specifiche. La versione corrente supporta la configurazione dell'orario settimanale, delle impostazioni didattiche e dell'integrazione IA.

## 🕐 Configurazione Orario Settimanale

### Accesso alle Impostazioni

1. Apri il menu principale (☰)
2. Naviga in **Altro > Impostazioni**
3. Scorri fino alla sezione **📅 Configurazione Orario**

### Parametri Configurabili

#### Ore di Lezione al Giorno
- **Predefinito**: 6 ore
- **Range**: 1-12 ore
- Definisce quanti slot orari vengono visualizzati nell'orario giornaliero

#### Orario Inizio Lezioni
- **Predefinito**: 08:00
- Definisce l'ora di inizio della prima lezione
- L'orario di fine viene calcolato automaticamente sommando le ore di lezione

#### Giorni Lavorativi
- **Predefinito**: Lunedì - Venerdì
- Seleziona i giorni della settimana in cui si svolgono le lezioni
- È possibile includere anche Sabato e Domenica se necessario

### Esempio di Configurazione

**Scenario 1: Scuola Primaria Standard**
```
Ore di lezione: 6
Orario inizio: 08:00
Giorni lavorativi: Lun, Mar, Mer, Gio, Ven
Risultato: 6 ore dalle 08:00 alle 14:00, dal lunedì al venerdì
```

**Scenario 2: Scuola con Sabato**
```
Ore di lezione: 5
Orario inizio: 08:00
Giorni lavorativi: Lun, Mar, Mer, Gio, Ven, Sab
Risultato: 5 ore dalle 08:00 alle 13:00, incluso il sabato
```

**Scenario 3: Orario Pomeridiano**
```
Ore di lezione: 4
Orario inizio: 14:00
Giorni lavorativi: Lun, Mar, Mer, Gio, Ven
Risultato: 4 ore dalle 14:00 alle 18:00, corsi pomeridiani
```

### Applicazione delle Modifiche

Dopo aver modificato le impostazioni dell'orario:

1. Clicca su **Salva Impostazioni Orario**
2. L'app salverà automaticamente le nuove configurazioni
3. La tabella oraria verrà immediatamente aggiornata
4. Verrà attivata la pipeline di auto-pianificazione (in sviluppo)

## 🎓 Configurazione Anno Scolastico

### Impostazione Anno Scolastico

1. Nella sezione **🎓 Anno Scolastico e Classi**
2. Inserisci l'anno corrente nel formato `AAAA/AAAA` (es. 2024/2025)
3. Clicca su **Salva Anno Scolastico**

### Gestione Classi

Le classi disponibili vengono gestite attraverso la sezione dedicata:

1. Naviga in **Gestione > Classi**
2. Aggiungi le classi che insegni
3. Le classi saranno disponibili per l'assegnazione negli slot dell'orario

**Suggerimento**: Mantieni aggiornato l'elenco delle classi per facilitare la pianificazione delle lezioni.

## 📚 Configurazione Discipline Insegnate

### Impostazione Discipline

La sezione **Discipline Insegnate** permette di configurare le materie che il docente insegna. Questo consente di:

- Filtrare le lezioni per mostrare solo quelle delle discipline selezionate
- Filtrare l'orario personale per visualizzare solo gli slot relativi alle proprie materie
- Limitare le opzioni disponibili durante la creazione di nuove lezioni

### Accesso alle Impostazioni

1. Apri il menu principale (☰)
2. Naviga in **Impostazioni > Profilo**
3. Scorri fino alla sezione **📚 Discipline Insegnate**

### Discipline Disponibili

L'applicazione supporta 20 discipline predefinite:

- **Materie Umanistiche**: Italiano, Storia, Geografia, Filosofia, Latino, Greco
- **Materie Scientifiche**: Matematica, Scienze, Fisica, Chimica
- **Lingue Straniere**: Inglese, Francese, Spagnolo, Tedesco
- **Materie Artistiche e Tecniche**: Arte e Immagine, Musica, Educazione Fisica, Tecnologia, Informatica
- **Altre**: Religione

### Configurazione

1. Seleziona le discipline che insegni spuntando le relative caselle
2. Clicca su **Salva Discipline**
3. Le impostazioni vengono salvate automaticamente in `localStorage`

### Comportamento Predefinito

**Se non selezioni alcuna disciplina**: Tutte le discipline rimangono disponibili (comportamento predefinito). Questo assicura la retrocompatibilità con i dati esistenti.

**Se selezioni una o più discipline**: L'applicazione filtrerà automaticamente:
- Le lezioni visualizzate nella sezione "Lezioni"
- Gli slot dell'orario personale
- Le opzioni nel menu a tendina durante la creazione di nuove lezioni

### Esempio di Utilizzo

**Scenario: Docente di Matematica e Fisica**
```
Discipline selezionate: Matematica, Fisica
Risultato:
- Nella sezione "Lezioni" vengono mostrate solo le lezioni di Matematica e Fisica
- Nell'orario personale vengono mostrati solo gli slot con Matematica o Fisica
- Quando si crea una nuova lezione, il menu "Materia" mostra solo Matematica e Fisica
```

### Impatto sul Modello Dati

Le discipline selezionate vengono salvate in:
```javascript
state.settings.teacherDisciplines = ['Matematica', 'Fisica', ...]
```

Questo campo viene utilizzato da:
- `populateSubjectDropdown()` - popola il menu delle materie
- `renderLessons()` - filtra le lezioni visualizzate
- `renderWeeklySchedule()` / `renderDailySchedule()` - filtra gli slot dell'orario
- `shouldDisplaySubject()` - verifica se una materia deve essere mostrata

## 🤖 Configurazione IA

### Chiave API OpenRouter

Per abilitare le funzionalità IA avanzate:

1. Vai su [OpenRouter](https://openrouter.ai/keys)
2. Crea un account e genera una chiave API
3. Nella sezione **🤖 Configurazione IA**, inserisci la chiave API
4. Seleziona il modello IA desiderato
5. Clicca su **Salva Impostazioni IA**

### Modelli IA Disponibili

| Modello | Caratteristiche | Consigliato per |
|---------|----------------|-----------------|
| **GPT-3.5 Turbo** | Veloce ed economico | Uso quotidiano |
| **GPT-4** | Più accurato e dettagliato | Analisi complesse |
| **Claude 2** | Buon equilibrio qualità/costo | Uso generale |
| **Llama 2 70B** | Open source, privacy-friendly | Dati sensibili |

### Modalità Simulata

Se **non** configuri una chiave API:
- L'assistente IA funzionerà in **modalità simulata**
- Riceverai risposte predefinite e demo
- Le funzionalità base rimarranno disponibili

## 📱 Agente IA Floating

L'agente IA floating è un pulsante sempre visibile che ti permette di accedere rapidamente all'assistente:

### Configurazione

1. **Attiva/Disattiva**: Usa il checkbox "Mostra Agente IA Floating"
2. **Posizione**: Trascina il pulsante dove preferisci
3. **Reset Posizione**: Clicca "Ripristina Posizione" per tornare alla posizione predefinita

## 🔄 Pipeline Auto-Pianificante

**Stato**: 📝 In Sviluppo

La pipeline auto-pianificante è una funzionalità futura che:

- Ripianificherà automaticamente le attività quando cambi l'orario
- Aggiornerà le notifiche in base alle nuove configurazioni
- Genererà suggerimenti intelligenti per l'ottimizzazione dell'orario
- Identificherà conflitti e sovrapposizioni

### Attivazione

La pipeline si attiverà automaticamente quando:
- Modifichi le impostazioni dell'orario
- Aggiungi o rimuovi giorni lavorativi
- Cambi l'anno scolastico

## 💾 Persistenza dei Dati

Tutte le configurazioni vengono salvate automaticamente nel browser:

- **LocalStorage**: Dati salvati localmente
- **Nessun server richiesto**: Funziona offline
- **Privacy**: I tuoi dati rimangono sul tuo dispositivo

### Backup delle Configurazioni

**Consigliato**: Esporta periodicamente i tuoi dati:

1. Naviga in **Altro > Backup e Ripristino**
2. Clicca su **Esporta Backup**
3. Salva il file in un luogo sicuro

## 🔧 Risoluzione Problemi

### Ripristino Configurazioni

Se riscontri problemi con le configurazioni:

1. Vai in **Impostazioni > Risoluzione Problemi**
2. Clicca su **Cancella Tutti i Dati**
3. ⚠️ **ATTENZIONE**: Questa azione cancellerà TUTTI i dati

### Configurazioni Predefinite

Al primo avvio o dopo un reset, l'app usa queste impostazioni:

- Ore di lezione: 6
- Orario: 08:00-14:00
- Giorni: Lunedì-Venerdì
- Durata slot: 60 minuti

## 🚀 Funzionalità Future

Le seguenti funzionalità sono pianificate per versioni future:

### 📅 Integrazione Calendario Esterno
- Sincronizzazione con Google Calendar
- Export verso Outlook/iCal
- Import eventi da calendar esterni

### 🔔 Notifiche Avanzate
- Notifiche push personalizzate
- Promemoria automatici per lezioni
- Avvisi per scadenze attività

### 🤝 Modalità Collaborativa
- Condivisione orari con colleghi
- Coordinamento aule e risorse
- Team teaching support

### 📊 Import/Export API
- Integrazione con registro elettronico
- Export dati in formati standard
- API per automazioni esterne

### ☁️ Backup Cloud
- Sincronizzazione automatica
- Accesso da più dispositivi
- Versionamento configurazioni

### 🧠 IA Avanzata
- Suggerimenti automatici per pianificazione
- Analisi pattern e ottimizzazione
- Generazione automatica programmi didattici

## 📸 Screenshot ed Esempi

### Schermata Configurazione Orario

```
┌─────────────────────────────────────┐
│ 📅 Configurazione Orario            │
├─────────────────────────────────────┤
│ Ore di lezione al giorno: [6    ]  │
│ Orario inizio lezioni:   [08:00]   │
│                                     │
│ Giorni lavorativi:                  │
│ ☑ Lunedì    ☑ Martedì              │
│ ☑ Mercoledì ☑ Giovedì              │
│ ☑ Venerdì   ☐ Sabato               │
│ ☐ Domenica                          │
│                                     │
│ [Salva Impostazioni Orario]         │
└─────────────────────────────────────┘
```

### Tabella Orario Risultante

```
┌──────┬────────┬────────┬────────┬────────┬────────┐
│ Ora  │  Lun   │  Mar   │  Mer   │  Gio   │  Ven   │
├──────┼────────┼────────┼────────┼────────┼────────┤
│ 8:00 │ 1A     │ 2A     │ 1A     │ 3A     │ 1A     │
│ 9:00 │ 1A     │ 2A     │ 1A     │ 3A     │ 2A     │
│10:00 │ 2A     │ 1A     │ 2A     │ 1A     │ 3A     │
│11:00 │ 2A     │ 1A     │ 2A     │ 1A     │ 3A     │
│12:00 │ 3A     │ 3A     │ 3A     │ 2A     │ 1A     │
│13:00 │ 3A     │ 3A     │ 3A     │ 2A     │ 2A     │
└──────┴────────┴────────┴────────┴────────┴────────┘
```

## 📞 Supporto

Per ulteriore assistenza:

1. Consulta la [Guida Utente](user-guide.md)
2. Leggi la [Guida Risoluzione Problemi](TROUBLESHOOTING.md)
3. Apri una issue su GitHub per bug o suggerimenti

## 📝 Note di Versione

**Versione 1.1.0** - Configurazione Orario Implementata
- ✅ Orario settimanale modificabile
- ✅ Configurazione ore/giorno e orario
- ✅ Selezione giorni lavorativi personalizzabili
- ✅ UI impostazioni completa e accessibile
- ✅ Persistenza configurazioni in localStorage
- 📝 Pipeline auto-pianificante (in sviluppo)
- 📝 Funzionalità avanzate (roadmap)

---

**Ultimo aggiornamento**: Ottobre 2025  
**Versione documento**: 1.0
