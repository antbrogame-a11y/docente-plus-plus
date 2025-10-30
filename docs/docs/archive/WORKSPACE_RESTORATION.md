# Guida al Ripristino della Funzionalità Workspace

## Stato Attuale
La funzionalità Workspace è stata temporaneamente nascosta dall'interfaccia utente poiché non è attualmente utilizzata. Tutto il codice è stato mantenuto e commentato per facilitare un eventuale ripristino futuro.

## Come Ripristinare il Workspace

### 1. HTML (index.html)
Rimuovere l'attributo `style="display: none;"` dal pulsante workspace:

**Riga ~111-113:**
```html
<!-- WORKSPACE TEMPORANEAMENTE NASCOSTO - Per ripristinare, rimuovere style="display: none;" -->
<button id="workspace-btn" class="icon-btn" title="Workspace" aria-label="Seleziona workspace" style="display: none;">
    <span class="material-symbols-outlined">folder_open</span>
</button>
```

**Diventa:**
```html
<button id="workspace-btn" class="icon-btn" title="Workspace" aria-label="Seleziona workspace">
    <span class="material-symbols-outlined">folder_open</span>
</button>
```

### 2. JavaScript - appbar.js
Decommentare la funzione `initWorkspaceButton()`:

**Righe ~56-72:**
- Rimuovere il blocco commento `/* ... */` che avvolge la funzione
- Rimuovere i commenti dal JSDoc

**Righe ~76-79:**
Decommentare la chiamata alla funzione in `initAppBar()`:
```javascript
export function initAppBar() {
    initAppBarScrollBehavior();
    initWorkspaceButton(); // Rimuovere il commento
}
```

### 3. JavaScript - ui.js
Sostituire la funzione placeholder con l'implementazione originale:

**Righe ~58-78:**
- Decommentare il blocco `/* ... */` che contiene l'implementazione originale
- Rimuovere la funzione placeholder vuota

### 4. CSS - styles.css (Opzionale)
Il file CSS contiene già una classe `.class-selector-item.workspace` (riga ~4074) che è pronta per l'uso. Questa classe definisce lo stile per gli elementi workspace nel selettore di classi. Non sono necessarie modifiche al CSS per ripristinare la funzionalità base.

### 5. Implementare la Funzionalità Workspace
Una volta ripristinata la visibilità, sarà necessario implementare:

1. **Modale/Dropdown di Selezione Workspace**: Creare un'interfaccia per selezionare tra diverse workspace o classi
2. **Gestione dello Stato**: Implementare la logica per tracciare la workspace attiva
3. **Filtraggio dei Dati**: Filtrare lezioni, attività e studenti in base alla workspace selezionata
4. **Persistenza**: Salvare la workspace selezionata in localStorage

### 6. Possibili Evoluzioni Future
- **Menu Secondario**: Integrare workspace come sottomenu nell'AppBar
- **Impostazioni**: Aggiungere configurazione workspace nella sezione Impostazioni
- **Multi-Workspace**: Supporto per più workspace simultanee
- **Condivisione**: Possibilità di condividere workspace con colleghi

## File Modificati
I seguenti file contengono codice commentato relativo al Workspace:

1. `/index.html` - Pulsante nascosto con `display: none`
2. `/js/appbar.js` - Funzione `initWorkspaceButton()` commentata
3. `/js/ui.js` - Funzione `updateActiveClassBadge()` commentata
4. `/styles.css` - Classe `.class-selector-item.workspace` documentata (riga ~4074)
5. `/docs/WORKSPACE_RESTORATION.md` - Questa guida al ripristino

## Note
- Tutto il codice è stato mantenuto intatto per facilitare il ripristino
- I commenti includono istruzioni esplicite per ogni modifica
- Non sono state rimosse dipendenze o funzionalità attive
- La soluzione è completamente reversibile
