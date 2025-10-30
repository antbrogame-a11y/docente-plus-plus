# 💾 Guida Backup & Ripristino - Docente++

## Panoramica

Il modulo **Backup & Ripristino** di Docente++ ti permette di proteggere i tuoi dati creando copie di sicurezza che possono essere salvate e ripristinate in qualsiasi momento.

## 🎯 Funzionalità Principali

### 1. Backup Manuale

Crea un backup immediato di tutti i tuoi dati con un semplice click.

**Come usarlo:**
1. Vai alla sezione **"Backup & Ripristino"** dal menu laterale
2. Clicca sul pulsante **"Crea Backup Ora"**
3. Il backup verrà creato e salvato automaticamente
4. Vedrai il nuovo backup nella lista con data, ora e dimensione

**Cosa viene salvato:**
- Lezioni e orario
- Studenti e classi
- Attività didattiche
- Valutazioni e criteri
- Notifiche e promemoria
- Feed RSS e news
- Profilo docente
- Tutte le impostazioni

### 2. Backup Programmato

Configura backup automatici che vengono creati quando l'app è aperta.

**Frequenze disponibili:**
- **Mai**: Nessun backup automatico
- **Giornaliero**: Un backup ogni 24 ore
- **Settimanale**: Un backup ogni 7 giorni (consigliato)
- **Mensile**: Un backup ogni 30 giorni

**Come configurarlo:**
1. Nella sezione "Backup Programmato"
2. Seleziona la frequenza desiderata dal menu a tendina
3. Le impostazioni vengono salvate automaticamente
4. I backup programmati verranno creati automaticamente quando apri l'app

**Note importanti:**
- I backup programmati funzionano solo quando l'app è aperta (limitazione browser)
- L'app verifica ogni ora se è necessario un backup
- Massimo 10 backup vengono conservati (i più vecchi vengono eliminati)

### 3. Esportazione Backup

Scarica i tuoi backup sul dispositivo in formato JSON o ZIP.

**Formato JSON:**
- File singolo con tutti i dati
- Ideale per backup rapidi
- Facilmente ispezionabile

**Formato ZIP:**
- Contiene il file JSON dei dati
- Include un file README con istruzioni
- Include metadata del backup
- Più organizzato per archiviazione

**Come scaricare:**
1. Trova il backup nella lista
2. Clicca su **"📥 JSON"** o **"📦 ZIP"**
3. Il file verrà scaricato sul tuo dispositivo

### 4. Ripristino Dati

Ripristina i tuoi dati da un backup precedente.

**Metodo 1: Da backup salvato**
1. Trova il backup nella lista
2. Clicca su **"♻️ Ripristina"**
3. Conferma l'operazione
4. I dati verranno ripristinati immediatamente

**Metodo 2: Da file esterno**
1. Clicca su **"Ripristina da File"**
2. Seleziona un file JSON o ZIP precedentemente scaricato
3. Conferma l'operazione
4. I dati verranno ripristinati

**⚠️ ATTENZIONE:**
- Il ripristino sovrascrive TUTTI i dati attuali
- Crea un backup prima di ripristinare se hai dati importanti
- L'operazione non è reversibile (salvo avere un altro backup)

### 5. Eliminazione Backup

Rimuovi backup non più necessari per liberare spazio.

**Come eliminare:**
1. Trova il backup nella lista
2. Clicca sul pulsante **"🗑️"**
3. Conferma l'eliminazione
4. Il backup verrà rimosso dalla lista

**Note:**
- L'eliminazione è permanente
- Non elimina i file scaricati sul tuo dispositivo
- Massimo 10 backup vengono conservati automaticamente

## 📱 Ottimizzazione Mobile

L'interfaccia è completamente ottimizzata per smartphone:

- **Pulsanti grandi**: Facili da premere con il tocco
- **Layout responsive**: Si adatta a qualsiasi dimensione schermo
- **Feedback visivi**: Messaggi toast per confermare le operazioni
- **Conferme chiare**: Dialog di conferma prima di azioni importanti

## 🔒 Sicurezza e Privacy

- **Tutto locale**: I backup sono salvati nel browser (localStorage)
- **Nessun server**: Nessun dato viene inviato a server esterni
- **Privacy totale**: I tuoi dati rimangono sul tuo dispositivo
- **Esportazione sicura**: Puoi salvare i backup su cloud personali

## 💡 Best Practices

### Frequenza Backup Consigliata

- **Uso quotidiano**: Backup giornaliero
- **Uso regolare**: Backup settimanale (predefinito)
- **Uso occasionale**: Backup mensile + backup manuale prima di modifiche importanti

### Gestione Backup

1. **Crea backup prima di**:
   - Importare grandi quantità di dati
   - Modificare molte valutazioni
   - Cambiare configurazioni importanti
   - Aggiornare il browser

2. **Scarica backup su file quando**:
   - Cambi dispositivo
   - Reinstalli il browser
   - Vuoi un archivio permanente
   - Prima di cancellare dati del browser

3. **Tieni backup multipli**:
   - Almeno 3 backup recenti
   - Un backup mensile come archivio
   - Backup prima e dopo importazioni massive

## 🛠️ Risoluzione Problemi

### Backup non viene creato

**Problema**: Click su "Crea Backup Ora" non funziona

**Soluzioni:**
1. Verifica di avere dati da salvare
2. Controlla la console del browser per errori
3. Libera spazio nel localStorage (elimina vecchi backup)
4. Ricarica la pagina e riprova

### File ZIP non si scarica

**Problema**: Click su "ZIP" non avvia il download

**Soluzioni:**
1. Verifica che JSZip sia caricato (controlla console)
2. Prova con formato JSON invece
3. Controlla le impostazioni download del browser
4. Disabilita blocco popup se attivo

### Ripristino non funziona

**Problema**: Dopo ripristino i dati non cambiano

**Soluzioni:**
1. Ricarica la pagina dopo il ripristino
2. Verifica che il file backup sia valido (apri come testo)
3. Controlla che il formato sia corretto (JSON o ZIP valido)
4. Prova con un backup diverso

### Backup automatico non parte

**Problema**: Backup programmato non viene creato

**Soluzioni:**
1. Verifica che la frequenza non sia impostata su "Mai"
2. Controlla che sia passato abbastanza tempo dall'ultimo backup
3. L'app deve essere aperta per creare backup
4. Ricarica la pagina per attivare il controllo

### Quota localStorage superata

**Problema**: Errore "QuotaExceededError"

**Soluzioni:**
1. Elimina backup vecchi (mantieni solo gli ultimi 3-5)
2. Scarica backup importanti come file
3. Pulisci altri dati del browser
4. Esporta tutto e reimporta solo il necessario

## 📊 Limiti Tecnici

### Limiti Browser

- **localStorage quota**: 5-10 MB tipicamente
- **Numero backup**: Max 10 conservati automaticamente
- **Timer JavaScript**: Funziona solo con app aperta
- **Formato file**: Solo JSON e ZIP supportati

### Performance

- **Backup grande**: Può richiedere alcuni secondi
- **ZIP grande**: Generazione può essere lenta su mobile
- **Ripristino**: Ricaricamento dati richiede tempo

### Compatibilità

- **Browser moderni**: Chrome, Firefox, Safari, Edge
- **Mobile**: iOS Safari, Chrome Android
- **Requisiti**: JavaScript ES6+, localStorage, Blob API
- **JSZip**: Caricato da CDN (richiede connessione)

## 🎓 Esempi d'Uso

### Scenario 1: Cambio Dispositivo

```
1. Sul vecchio dispositivo:
   - Vai a "Backup & Ripristino"
   - Crea backup manuale
   - Scarica come ZIP
   - Salva file su cloud/USB

2. Sul nuovo dispositivo:
   - Apri Docente++
   - Vai a "Backup & Ripristino"
   - "Ripristina da File"
   - Seleziona il file ZIP
   - Conferma ripristino
```

### Scenario 2: Backup Pre-Importazione

```
1. Prima di importare CSV studenti:
   - Crea backup manuale
   - Verifica che sia nella lista
   
2. Importa i dati CSV

3. Se qualcosa va storto:
   - Ripristina il backup precedente
   - Correggi il CSV
   - Riprova importazione
```

### Scenario 3: Archiviazione Fine Anno

```
1. Fine anno scolastico:
   - Crea backup manuale finale
   - Scarica come ZIP
   - Rinomina: "Docente-2024-2025-Finale.zip"
   - Salva su cloud personale
   
2. Nuovo anno:
   - Reset app o mantieni struttura
   - Hai sempre accesso a dati precedenti
```

## 📞 Supporto

Se incontri problemi non risolti da questa guida:

1. Controlla la console del browser per errori specifici
2. Verifica la versione del browser (aggiorna se necessario)
3. Prova in modalità incognito per escludere estensioni
4. Crea una segnalazione con dettagli dell'errore

## 🔄 Aggiornamenti Futuri

Funzionalità in sviluppo:

- [ ] Backup incrementale (solo modifiche)
- [ ] Compressione avanzata per backup grandi
- [ ] Export selettivo (solo alcune sezioni)
- [ ] Sincronizzazione cloud opzionale
- [ ] Crittografia backup con password
- [ ] Import/merge intelligente (no sovrascrittura totale)

---

**Versione Guida**: 1.0  
**Ultimo Aggiornamento**: Gennaio 2025  
**Compatibile con**: Docente++ v1.0+
