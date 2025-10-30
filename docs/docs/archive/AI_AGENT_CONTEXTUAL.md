# 🤖 Agente IA Contestuale Floating

## Panoramica

L'Agente IA Floating è un assistente virtuale sempre disponibile che si adatta automaticamente alla sezione dell'applicazione in cui ti trovi, fornendo suggerimenti e supporto contestuale per ogni area di Docente++.

## ✨ Caratteristiche Principali

### 1. **Assistenza Contestuale**
L'agente IA cambia automaticamente i suoi suggerimenti in base alla sezione attiva dell'applicazione. **La sezione attiva è determinata dal tab correntemente visualizzato** - quando passi da "Dashboard" a "Lezioni", l'agente rileva il cambio e aggiorna i suggerimenti alla prossima apertura.

**Nota speciale per la sezione News:** La sezione News mantiene funzionalità uniche di analisi URL, permettendo di inserire link esterni per l'analisi approfondita di articoli e comunicazioni.

#### Suggerimenti per Sezione:

- **📊 Dashboard**: Riepilogo settimanale, priorità giornaliere, consigli didattici
- **📚 Lezioni**: Pianificazione lezioni, obiettivi didattici, gestione tempi
- **👥 Studenti**: Analisi progressi, strategie personalizzate, report classe
- **✅ Valutazioni**: Analisi voti, identificazione criticità, suggerimenti valutazione
- **📅 Orario**: Ottimizzazione orario, gestione scadenze, pianificazione mensile
- **📋 Attività**: Priorità attività, creazione attività, obiettivi
- **📰 News**: Analisi news, estrazione date/documenti/soggetti, azioni proposte
- **⚙️ Impostazioni**: Ottimizzazione configurazione, guida IA

### 2. **Pulsante Floating Personalizzabile**
- 🎯 **Sempre visibile**: Il pulsante 🤖 appare in tutte le pagine
- 🖱️ **Trascinabile**: Posizionalo dove preferisci con drag & drop
- 💾 **Posizione salvata**: La posizione viene memorizzata automaticamente
- 🔒 **Limiti viewport**: Non può essere trascinato fuori dallo schermo
- 👆 **Touch-friendly**: Funziona sia con mouse che touch

### 3. **Controlli Visibilità**
Nelle **Impostazioni** trovi:
- ☑️ **Checkbox "Mostra Agente IA Floating"**: Attiva/disattiva la visibilità del pulsante
- 🔄 **Pulsante "Ripristina Posizione"**: Riporta il pulsante alla posizione predefinita (in basso a destra)

## 🚀 Come Utilizzare

### Apertura Rapida
1. Clicca sul pulsante 🤖 floating (in basso a destra per default)
2. Il modal si apre mostrando:
   - **Sezione corrente** evidenziata
   - **Suggerimenti contestuali** specifici per la sezione
   - **Campo richiesta** per chiedere assistenza personalizzata

### Spostare il Pulsante
1. **Click e trascina** il pulsante 🤖 con il mouse
2. Su dispositivi touch, **tocca e trascina** con il dito
3. La nuova posizione viene salvata automaticamente
4. Il pulsante resta nei limiti dello schermo

### Nascondere il Pulsante
1. Vai in **⚙️ Impostazioni**
2. Scorri fino a **🤖 Agente IA Floating**
3. **Deseleziona** la checkbox "Mostra Agente IA Floating"
4. Clicca **Salva Impostazioni**

### Ripristinare Posizione Predefinita
1. Vai in **⚙️ Impostazioni**
2. Scorri fino a **🤖 Agente IA Floating**
3. Clicca **🔄 Ripristina Posizione Agente IA**
4. Il pulsante torna in basso a destra

## 💡 Esempi d'Uso per Sezione

### Dashboard
**Suggerimenti disponibili:**
- 📊 Genera un riepilogo della settimana
- 📋 Suggerisci priorità
- 💡 Consigli didattici

**Esempio richiesta:**
> "Mostrami le attività più urgenti per questa settimana"

### Lezioni
**Suggerimenti disponibili:**
- 📝 Pianifica lezione
- 🎯 Obiettivi didattici
- ⏱️ Gestione tempi

**Esempio richiesta:**
> "Aiutami a pianificare una lezione di 2 ore su [argomento] per la classe 3A"

### Studenti
**Suggerimenti disponibili:**
- 📈 Analizza progressi
- 🎓 Strategie personalizzate
- 📊 Report classe

**Esempio richiesta:**
> "Quali studenti hanno bisogno di maggiore supporto?"

### News (Sezione Speciale)
Nella sezione News, l'agente mantiene la funzionalità specifica di analisi:
- **Campo URL**: Inserisci l'URL della news da analizzare
- **Analisi predefinite**:
  - 📅 Date e Scadenze
  - 📎 Documenti
  - 👥 Soggetti
  - 📋 Riepilogo e Azioni

## 🔧 Dettagli Tecnici

### Archiviazione Dati
- **Posizione FAB**: Salvata in `localStorage` come JSON (`ai-fab-position`)
- **Visibilità FAB**: Salvata in `localStorage` come booleano (`ai-fab-enabled`)
- **Persistenza**: I dati rimangono salvati anche chiudendo il browser

### Adattamento Contesto
L'agente rileva automaticamente la sezione attiva tramite:
- Tracking del tab attivo in `app.currentActiveTab`
- Aggiornamento dinamico al cambio sezione
- Caricamento suggerimenti specifici per sezione

### Compatibilità
- ✅ Desktop (Browser moderni)
- ✅ Mobile (iOS e Android recenti)
- ✅ Tablet
- ✅ Touch e mouse support

**Nota:** L'app richiede un browser con supporto JavaScript moderno e localStorage abilitato.

### Accessibilità
- 🎯 Keyboard navigation supportata
- 🔊 Screen reader friendly
- 👁️ Alto contrasto compatibile
- 📱 Responsive design

## 🐛 Troubleshooting

### Il pulsante non appare
1. Verifica che sia attivo nelle **Impostazioni**
2. Controlla la checkbox "Mostra Agente IA Floating"
3. Ricarica la pagina

### Il pulsante è fuori schermo
1. Vai in **Impostazioni**
2. Clicca **🔄 Ripristina Posizione Agente IA**
3. Il pulsante tornerà visibile in basso a destra

### I suggerimenti non cambiano
1. Assicurati di aver chiuso e riaperto il modal dopo il cambio sezione
2. Il modal aggiorna il contenuto all'apertura

### La posizione non viene salvata
1. Verifica che il browser abbia `localStorage` abilitato
2. Controlla le impostazioni privacy del browser
3. Assicurati di non essere in modalità navigazione privata

## 📚 Risorse Correlate

- [NEWS_RSS_MODULE.md](NEWS_RSS_MODULE.md) - Documentazione originale dell'agente IA per News
- [FEEDBACK_UTENTE.md](FEEDBACK_UTENTE.md) - Requisiti e feedback utente
- [OPENROUTER_API_EXAMPLE.md](OPENROUTER_API_EXAMPLE.md) - Configurazione API OpenRouter

## 🔄 Changelog

### Versione 2.0 (Attuale)
- ✅ Aggiunto supporto contestuale per tutte le sezioni
- ✅ Implementata funzionalità drag & drop
- ✅ Aggiunti controlli visibilità in Settings
- ✅ Implementato salvataggio posizione in localStorage
- ✅ Aggiunto boundary checking per evitare che il FAB esca dallo schermo
- ✅ Ottimizzato storage posizione (solo left/top)

### Versione 1.0 (Precedente)
- ✅ Agente IA per analisi News
- ✅ Pulsante floating fisso
- ✅ Integrazione OpenRouter API
