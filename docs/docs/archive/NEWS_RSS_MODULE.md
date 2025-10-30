# 📰 Modulo News e Feed RSS/Atom con Agente IA

## 📋 Panoramica

Il modulo News permette ai docenti di aggregare e gestire notizie da fonti RSS/Atom esterne e utilizzare l'intelligenza artificiale per analizzare automaticamente le news, estraendo informazioni contestuali e creando automaticamente attività, scadenze e promemoria.

## ✨ Funzionalità Principali

### 1. Gestione Fonti RSS/Atom
- **Aggiunta fonti**: Aggiungi feed RSS/Atom da siti istituzionali, MIUR, scuole, ecc.
- **Categorizzazione**: Organizza le fonti per categoria (Istituzionale, Normativa, Didattica, Circolari, Altro)
- **Attivazione/Disattivazione**: Sospendi temporaneamente fonti senza eliminarle
- **Aggiornamento**: Aggiorna tutte le fonti o singolarmente
- **Eliminazione**: Rimuovi fonti non più necessarie

### 2. Visualizzazione News
- **Lista aggregata**: Tutte le news da tutte le fonti in un'unica lista
- **Filtri**: Filtra per fonte specifica o categoria
- **Ordinamento**: News ordinate per data (più recenti prime)
- **Link diretti**: Apri la news originale nel browser
- **Metadati**: Visualizza fonte, categoria, data di pubblicazione

### 3. Agente IA per Analisi Contestuale
- **Floating Action Button (FAB)**: Sempre visibile in basso a destra, accessibile da qualsiasi pagina
- **Analisi intelligente**: L'IA analizza il contenuto della news e estrae:
  - 📅 **Date e Scadenze**: Identifica tutte le date importanti e deadline
  - 📎 **Documenti**: Elenca moduli, allegati, documenti menzionati
  - 👥 **Soggetti**: Identifica destinatari, uffici, responsabili coinvolti
  - 📋 **Azioni Consigliate**: Propone azioni concrete da intraprendere
- **Creazione automatica**: Proposta di creazione automatica di promemoria, attività, circolari

## 🚀 Come Utilizzare

### Aggiungere una Fonte RSS/Atom

1. Naviga alla sezione **📰 News**
2. Clicca su **➕ Aggiungi Fonte RSS**
3. Compila il form:
   - **Nome Fonte**: Nome descrittivo (es. "MIUR - Notizie")
   - **URL Feed**: L'URL del feed RSS/Atom (es. `https://www.miur.gov.it/feed.xml`)
   - **Categoria**: Seleziona la categoria appropriata
4. Clicca **Aggiungi**
5. Il sistema recupererà automaticamente le news dal feed

### Visualizzare e Filtrare News

1. Le news appaiono automaticamente nella sezione "📄 Ultime News"
2. Usa i filtri per:
   - **Filtra per fonte**: Mostra solo news da una fonte specifica
   - **Filtra per categoria**: Mostra solo news di una categoria
3. Clicca **📖 Leggi** per aprire la news originale
4. Clicca **🤖 Analizza con IA** per analisi contestuale

### Utilizzare l'Agente IA

#### Metodo 1: Da una News Specifica
1. Nella lista news, clicca **🤖 Analizza con IA** sulla news di interesse
2. Il modal dell'agente si apre con l'URL già precompilato
3. Seleziona un'analisi predefinita o scrivi una richiesta personalizzata
4. Clicca **🔍 Analizza con IA**

#### Metodo 2: Floating Action Button (FAB)
1. Clicca sul pulsante **🤖** in basso a destra (sempre visibile)
2. Inserisci l'URL della news da analizzare
3. Scegli il tipo di analisi:
   - **📅 Date e Scadenze**: Estrai tutte le date e scadenze menzionate
   - **📎 Documenti**: Identifica documenti e allegati da scaricare
   - **👥 Soggetti**: Estrai soggetti coinvolti e destinatari
   - **📋 Riepilogo e Azioni**: Crea un riepilogo e proponi azioni
4. Clicca **🔍 Analizza con IA**
5. L'IA analizzerà la news e mostrerà i risultati

### Interpretare i Risultati dell'Analisi

L'agente IA fornisce:
1. **Analisi strutturata** del contenuto della news
2. **Elenco di date e scadenze** rilevanti
3. **Documenti e moduli** da scaricare o consultare
4. **Soggetti coinvolti** (studenti, genitori, uffici, ecc.)
5. **Azioni proposte** con tipo (SCADENZA, PROMEMORIA, CIRCOLARE, ATTIVITÀ)

## 📂 Esempi di Fonti RSS/Atom Utili

### Fonti Istituzionali
- **MIUR**: `https://www.miur.gov.it/web/guest/rss`
- **Ufficio Scolastico Regionale**: Varia per regione
- **Comune**: Verifica sul sito del tuo comune

### Fonti Didattiche
- **Indire**: `https://www.indire.it/feed/`
- **Scuola24**: Verifica sul sito
- **Blog didattici**: Vari feed disponibili

### Fonti Normative
- **Gazzetta Ufficiale**: Sezioni specifiche
- **Leggi e decreti**: Feed istituzionali

> **Nota**: Non tutti i siti offrono feed RSS/Atom. Cerca l'icona RSS o la voce "Feed" nei siti istituzionali.

## 🔧 Dettagli Tecnici

### Parsing RSS/Atom
- **Libreria**: Parsing nativo XML tramite DOMParser JavaScript
- **Formati supportati**: RSS 2.0, Atom 1.0
- **CORS Proxy**: Utilizzo di `api.allorigins.win` per superare restrizioni CORS
- **Client-side**: Tutto il parsing avviene nel browser, nessun server esterno

### Persistenza Dati
- **localStorage**: Feed e news salvati localmente nel browser
- **Chiavi utilizzate**:
  - `docente-plus-rss-feeds`: Array di fonti RSS configurate
  - `docente-plus-news-items`: Array di news recuperate dai feed

### Integrazione IA
- **Provider**: OpenRouter AI
- **Modello**: Configurabile nelle impostazioni (default: `alibaba/tongyi-deepresearch-30b-a3b`)
- **API Key**: Richiesta configurazione nelle Impostazioni
- **Context-aware**: L'IA riceve contesto sulla news e sulla richiesta del docente

### Struttura Dati

#### Feed RSS
```javascript
{
  id: "timestamp-string",
  name: "Nome Fonte",
  url: "https://esempio.com/feed.xml",
  category: "istituzionale|normativa|didattica|circolari|altro",
  addedDate: "ISO-8601-timestamp",
  lastFetched: "ISO-8601-timestamp",
  itemCount: number,
  active: boolean
}
```

#### News Item
```javascript
{
  id: "unique-id",
  feedId: "feed-id",
  feedName: "Nome Fonte",
  category: "categoria",
  title: "Titolo news",
  link: "URL news",
  description: "Descrizione/contenuto",
  pubDate: "ISO-8601-timestamp",
  fetchedDate: "ISO-8601-timestamp"
}
```

## 🎯 Best Practices

### Configurazione Feed
1. **Inizia con poche fonti**: Aggiungi 2-3 fonti rilevanti per la tua scuola
2. **Categorizza correttamente**: Usa categorie coerenti per facilitare i filtri
3. **Verifica l'URL**: Testa l'URL del feed prima di aggiungerlo
4. **Aggiorna regolarmente**: Clicca "🔄 Aggiorna Tutte" almeno una volta al giorno

### Utilizzo Agente IA
1. **Sii specifico**: Nella richiesta, specifica esattamente cosa ti interessa
2. **Usa analisi predefinite**: Le opzioni suggerite coprono la maggior parte dei casi
3. **Verifica sempre**: L'IA è un assistente, verifica sempre i risultati
4. **Crea azioni**: Usa i risultati per creare promemoria e attività reali

### Privacy e Sicurezza
- **Dati locali**: Tutti i feed e le news rimangono nel tuo browser
- **CORS Proxy**: Necessario per accedere ai feed, usa proxy affidabili
- **API Key**: La tua API OpenRouter è salvata solo localmente
- **Contenuto news**: Solo l'URL viene inviato all'IA, non tutto il contenuto HTML

## 🐛 Risoluzione Problemi

### Il feed non si carica
- **Verifica URL**: Assicurati che l'URL del feed sia corretto
- **Formato supportato**: Verifica che sia RSS 2.0 o Atom 1.0
- **CORS**: Alcuni feed potrebbero bloccare richieste cross-origin
- **Proxy timeout**: Riprova dopo qualche minuto

### L'analisi IA non funziona
- **API Key**: Verifica di aver configurato l'API key nelle Impostazioni
- **Credito API**: Controlla di avere credito sul tuo account OpenRouter
- **URL news**: Assicurati che l'URL della news sia accessibile pubblicamente
- **Timeout**: Per news molto lunghe, l'analisi potrebbe richiedere più tempo

### News duplicate
- Le news duplicate vengono automaticamente filtrate tramite confronto URL
- Se vedi duplicati, potrebbero essere da feed diversi che riportano la stessa notizia

### Performance
- Il sistema mantiene fino a 50 news per fonte
- News più vecchie possono essere rimosse manualmente eliminando e ri-aggiungendo il feed
- Per migliori performance, mantieni 3-5 fonti attive

## 📊 Statistiche e Metriche

Il sistema traccia automaticamente:
- Numero di feed configurati
- Numero totale di news recuperate
- Data ultimo aggiornamento per ogni feed
- Numero di news per categoria

## 🔄 Aggiornamenti Futuri

Funzionalità pianificate:
- [ ] Auto-refresh periodico dei feed
- [ ] Notifiche per nuove news importanti
- [ ] Esportazione news in PDF/Excel
- [ ] Archiviazione news per consultazione offline
- [ ] Integrazione diretta creazione attività da analisi IA
- [ ] Supporto per feed autenticati
- [ ] Suggerimenti automatici fonti RSS rilevanti

## 📞 Supporto

Per problemi o domande:
- Verifica questa documentazione
- Controlla la console browser per errori (F12)
- Verifica le impostazioni API OpenRouter
- Controlla la connessione internet per accesso ai feed

## 📄 Licenza e Credits

Questo modulo fa parte di **Docente++** - App per la gestione didattica potenziata da IA.

**Tecnologie utilizzate**:
- JavaScript nativo (ES6+)
- DOMParser per parsing XML
- OpenRouter AI per analisi contestuale
- CORS proxy: api.allorigins.win
- localStorage per persistenza

---

**Versione**: 1.0.0  
**Data**: Ottobre 2025  
**Autore**: Docente++ Team
