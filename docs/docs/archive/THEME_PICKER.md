# Theme Picker - Documentazione

## Panoramica

Docente++ include un sistema di gestione temi basato su Material Design 3 Expressive che permette agli utenti di personalizzare l'aspetto dell'applicazione. Il theme picker supporta tre modalità:

1. **Tema Chiaro** - Un tema luminoso ottimizzato per ambienti ben illuminati
2. **Tema Scuro** - Un tema scuro che riduce l'affaticamento degli occhi in condizioni di scarsa illuminazione
3. **Tema Automatico (Dinamico)** - Segue automaticamente le impostazioni del tema del sistema operativo

## Caratteristiche

### Material Design 3 Expressive

Il sistema di temi implementa la palette Material Design 3 Expressive con:
- Colori primari, secondari e terziari distintivi
- Variazioni di superficie per profondità e gerarchia
- Ombre di elevazione coerenti
- Transizioni fluide tra i temi
- Border radius più generosi per un aspetto moderno

### Material Web Components

L'interfaccia del theme picker utilizza Material Web Components ufficiali:
- `<md-dialog>` per il dialogo modale
- `<md-radio>` per la selezione del tema
- `<md-filled-button>` e `<md-text-button>` per le azioni

### Material Symbols

Le icone utilizzano Material Symbols Outlined per coerenza visiva:
- `light_mode` - Icona tema chiaro
- `dark_mode` - Icona tema scuro
- `contrast` - Icona tema automatico
- `palette` - Icona pulsante theme picker nell'header

## Utilizzo

### Per gli Utenti

1. **Aprire il Theme Picker**
   - Cliccare sull'icona della palette (🎨) nell'header dell'applicazione
   - Il dialogo del theme picker si aprirà mostrando le tre opzioni disponibili

2. **Selezionare un Tema**
   - Cliccare su uno dei tre radio button per selezionare il tema desiderato
   - Ogni opzione mostra un'icona descrittiva e una breve spiegazione

3. **Applicare il Tema**
   - Cliccare sul pulsante "Applica" per salvare e applicare il tema selezionato
   - Il tema verrà applicato immediatamente e salvato per le sessioni future
   - Un messaggio di conferma apparirà brevemente

4. **Annullare la Selezione**
   - Cliccare su "Annulla" o chiudere il dialogo per uscire senza modifiche

### Tema Automatico

Quando si seleziona il tema automatico:
- L'applicazione rileva automaticamente le preferenze del sistema operativo
- Su dispositivi con modalità chiara: verrà applicato il tema chiaro
- Su dispositivi con modalità scura: verrà applicato il tema scuro
- Le modifiche al tema del sistema vengono rilevate automaticamente e applicate in tempo reale

## Implementazione Tecnica

### Architettura

Il sistema di temi è implementato in tre componenti principali:

1. **`js/theme.js`** - Modulo JavaScript che gestisce:
   - Salvataggio/caricamento delle preferenze da localStorage
   - Applicazione dei temi al documento
   - Rilevamento delle preferenze del sistema
   - Setup del dialog del theme picker

2. **`styles.css`** - Variabili CSS per i temi:
   - `:root` - Variabili del tema chiaro (default)
   - `.dark-theme` - Variabili del tema scuro
   - Transizioni fluide tra i temi

3. **`index.html`** - Componenti UI:
   - Pulsante theme picker nell'header
   - Dialog con Material Web Components
   - Import dei moduli necessari

### Persistenza

Le preferenze dell'utente vengono salvate in `localStorage` con la chiave:
```
docente-plus-plus-theme
```

Valori possibili:
- `"light"` - Tema chiaro
- `"dark"` - Tema scuro
- `"auto"` - Tema automatico (default)

### API JavaScript

#### Funzioni Esportate

```javascript
// Inizializza il sistema di temi
initializeTheme()

// Configura il theme picker dialog
setupThemePicker()

// Ottiene la preferenza del tema corrente
getThemePreference() // returns 'light', 'dark', or 'auto'

// Salva la preferenza del tema
saveThemePreference(theme)

// Applica un tema al documento
applyTheme(theme)
```

#### Esempio di Utilizzo

```javascript
import { initializeTheme, setupThemePicker, applyTheme } from './js/theme.js';

// Inizializzare all'avvio dell'app
initializeTheme();
setupThemePicker();

// Cambiare tema programmaticamente
applyTheme('dark');
```

## Personalizzazione

### Modificare i Colori del Tema

I colori dei temi possono essere personalizzati modificando le variabili CSS in `styles.css`:

```css
:root {
    /* Tema Chiaro */
    --md-primary: #6750A4;
    --md-primary-container: #EADDFF;
    /* ... altre variabili */
}

.dark-theme {
    /* Tema Scuro */
    --md-primary: #D0BCFF;
    --md-primary-container: #4F378B;
    /* ... altre variabili */
}
```

### Aggiungere Nuovi Temi

Per aggiungere un nuovo tema (es. "High Contrast"):

1. Aggiungere le variabili CSS:
```css
.high-contrast-theme {
    --md-primary: #000000;
    --md-on-primary: #FFFFFF;
    /* ... altre variabili */
}
```

2. Aggiungere l'opzione nel dialog in `index.html`:
```html
<div class="theme-option">
  <label>
    <md-radio name="theme" value="high-contrast"></md-radio>
    <span class="theme-option-content">
      <span class="material-symbols-outlined">contrast_rtl_off</span>
      <span class="theme-option-text">
        <strong>Alto Contrasto</strong>
        <small>Massima leggibilità</small>
      </span>
    </span>
  </label>
</div>
```

3. Aggiornare la logica in `js/theme.js` per gestire il nuovo tema

## Accessibilità

Il theme picker è progettato con l'accessibilità in mente:

- **Navigazione da tastiera**: Tutti i controlli sono accessibili via tastiera
- **Screen reader**: Radio button e label semantici
- **Focus visibile**: Indicatori di focus chiari
- **Contrasto**: I temi rispettano i requisiti WCAG per il contrasto dei colori
- **Riduzione movimento**: Le transizioni rispettano `prefers-reduced-motion`

## Compatibilità

### Browser Supportati

- Chrome/Edge 119+
- Firefox 120+
- Safari 17+
- Opera 105+

### Requisiti

- JavaScript ES6 Modules
- CSS Custom Properties
- `prefers-color-scheme` media query
- localStorage API

### Fallback

Se il browser non supporta alcune funzionalità:
- Il tema chiaro viene applicato come default
- Il theme picker funziona comunque per la selezione manuale
- Le Material Web Components hanno polyfill integrati

## Risoluzione Problemi

### Il tema non viene salvato

Verificare che localStorage sia abilitato nel browser:
```javascript
console.log(localStorage.getItem('docente-plus-plus-theme'));
```

### Il tema automatico non funziona

Verificare che il browser supporti `prefers-color-scheme`:
```javascript
console.log(window.matchMedia('(prefers-color-scheme: dark)').matches);
```

### Le Material Web Components non si caricano

1. Verificare la connessione internet (componenti caricati da CDN)
2. Controllare la console del browser per errori
3. Verificare che il browser supporti ES6 modules

## Riferimenti

- [Material Design 3](https://m3.material.io/)
- [Material Web Components](https://github.com/material-components/material-web)
- [Material Symbols](https://fonts.google.com/icons)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
