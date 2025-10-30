# 📅 Guida Completa - Componente Orario Responsive

## 📋 Indice

1. [Panoramica](#panoramica)
2. [Caratteristiche](#caratteristiche)
3. [Installazione](#installazione)
4. [Utilizzo Base](#utilizzo-base)
5. [Configurazione Avanzata](#configurazione-avanzata)
6. [Design e Stile](#design-e-stile)
7. [Accessibilità](#accessibilità)
8. [API e Funzioni](#api-e-funzioni)
9. [Esempi Pratici](#esempi-pratici)
10. [Best Practices](#best-practices)
11. [Troubleshooting](#troubleshooting)

---

## 🎯 Panoramica

Il **Componente Orario Responsive** è una soluzione completa e professionale per la gestione di orari settimanali delle lezioni. Progettato con un design moderno in palette blu/ciano/bianco, utilizza il font Inter e le Material Symbols icons per un'esperienza utente raffinata e coerente.

### Specifiche Tecniche

- **Orario**: 6 ore/giorno (Lunedì-Venerdì), 08:00 - 14:00
- **Durata lezione**: 60 minuti
- **Design**: Blue/Cyan/White palette, forme arrotondate
- **Font**: Inter (fallback su system fonts)
- **Icone**: Material Symbols Outlined
- **Responsive**: Mobile, Tablet, Desktop
- **Accessibilità**: WCAG 2.1 AA compliant

---

## ✨ Caratteristiche

### Design e UI/UX

- ✅ **Palette Professionale**: Colori blu e ciano per un aspetto moderno e professionale
- ✅ **Forme Arrotondate**: Border-radius su tutti gli elementi per un look accogliente
- ✅ **Icone Material**: Integrazione completa con Material Symbols
- ✅ **Animazioni Fluide**: Transizioni smooth e professionali
- ✅ **Dark Mode**: Supporto completo per tema scuro

### Funzionalità

- ✅ **Celle Interattive**: Click/tap per modificare ogni cella
- ✅ **Modal Editing**: Interfaccia modale intuitiva per la modifica
- ✅ **Tipi di Attività**: 6 tipi preconfigurati con icone dedicate
- ✅ **Validazione Dati**: Controlli automatici sui dati inseriti
- ✅ **Salvataggio Automatico**: Integrazione con localStorage

### Responsive Design

- ✅ **Mobile (< 640px)**: Layout compatto con scroll orizzontale
- ✅ **Tablet (640-1024px)**: Layout ottimizzato con celle medie
- ✅ **Desktop (> 1024px)**: Layout completo con massimo spazio
- ✅ **Touch-Friendly**: Aree di tocco ottimizzate (min 44px iOS standard)

### Accessibilità

- ✅ **Keyboard Navigation**: Navigazione completa da tastiera
- ✅ **Screen Readers**: ARIA labels e ruoli semantici
- ✅ **Focus Visible**: Indicatori di focus chiari
- ✅ **High Contrast**: Supporto per modalità ad alto contrasto
- ✅ **Reduced Motion**: Rispetto per prefers-reduced-motion

---

## 📦 Installazione

### 1. File da includere

Aggiungi questi file al tuo progetto:

```
css/
├── schedule-theme.css          # Variabili di tema
└── schedule-component.css      # Stili del componente

js/
├── schedule-component.js       # Componente principale
└── schedule-example-data.js    # Dati di esempio e helpers
```

### 2. Import nel HTML

```html
<!DOCTYPE html>
<html lang="it">
<head>
    <!-- Material Symbols Icons -->
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">
    
    <!-- Inter Font (opzionale, usa fallback se non disponibile) -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Schedule Styles -->
    <link rel="stylesheet" href="css/schedule-theme.css">
    <link rel="stylesheet" href="css/schedule-component.css">
</head>
<body>
    <!-- Schedule Container -->
    <div id="schedule-container"></div>
    
    <!-- Schedule JavaScript Module -->
    <script type="module" src="js/your-app.js"></script>
</body>
</html>
```

### 3. Import nel JavaScript

```javascript
// Nel tuo file JavaScript principale
import { 
    renderScheduleTable, 
    showScheduleEditModal,
    getActivityType,
    ACTIVITY_TYPES 
} from './js/schedule-component.js';

import { 
    exampleScheduleData,
    exampleClasses 
} from './js/schedule-example-data.js';
```

---

## 🚀 Utilizzo Base

### Esempio Minimo

```javascript
import { renderScheduleTable, showScheduleEditModal } from './js/schedule-component.js';
import { state } from './js/data.js';

// Container HTML
const container = document.getElementById('schedule-container');

// Dati orario (può essere vuoto all'inizio)
let scheduleData = {};

// Callback per il click sulla cella
function handleCellClick(dayIndex, time, currentData) {
    showScheduleEditModal(dayIndex, time, currentData, handleSave);
}

// Callback per il salvataggio
function handleSave(dayIndex, time, newData) {
    const day = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì'][dayIndex];
    const key = `${day}-${time}`;
    
    if (newData === null) {
        // Elimina l'attività
        delete scheduleData[key];
    } else {
        // Salva/aggiorna l'attività
        scheduleData[key] = newData;
    }
    
    // Ri-renderizza la tabella
    renderScheduleTable(container, scheduleData, handleCellClick);
    
    // Salva nel localStorage o backend
    saveScheduleData(scheduleData);
}

// Render iniziale
renderScheduleTable(container, scheduleData, handleCellClick);
```

---

## ⚙️ Configurazione Avanzata

### Personalizzazione delle Variabili CSS

Puoi sovrascrivere le variabili di tema nel tuo CSS:

```css
:root {
    /* Cambia i colori primari */
    --schedule-primary: #1565C0;
    --schedule-accent: #0288D1;
    
    /* Cambia il font */
    --schedule-font-family: 'Roboto', sans-serif;
    
    /* Cambia gli spacing */
    --schedule-spacing-md: 16px;
    --schedule-spacing-lg: 24px;
    
    /* Cambia i border radius */
    --schedule-radius-md: 12px;
    --schedule-radius-lg: 16px;
}
```

### Aggiungere Nuovi Tipi di Attività

Modifica `js/schedule-component.js`:

```javascript
const ACTIVITY_TYPES = {
    // Tipi esistenti...
    theory: { ... },
    practice: { ... },
    
    // Nuovo tipo personalizzato
    custom: {
        label: 'Attività Speciale',
        icon: 'star',              // Material Symbol
        color: '#FF6F00'           // Colore personalizzato
    }
};
```

### Modificare le Ore di Lezione

In `js/schedule-component.js`:

```javascript
const SCHEDULE_CONFIG = {
    hoursPerDay: 8,        // Cambia a 8 ore
    startHour: 8,
    startMinute: 0,
    workingDays: ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'] // Aggiungi sabato
};
```

---

## 🎨 Design e Stile

### Palette Colori

#### Light Theme (Default)
```css
--schedule-primary: #0277BD       /* Deep Blue */
--schedule-accent: #00BCD4        /* Cyan */
--schedule-bg: #FFFFFF            /* White */
--schedule-cell-hover: #E1F5FE    /* Light Blue Hover */
```

#### Dark Theme
```css
--schedule-primary: #42A5F5       /* Light Blue */
--schedule-accent: #26C6DA        /* Bright Cyan */
--schedule-bg: #1E1E1E            /* Dark Gray */
--schedule-cell-hover: #1A237E    /* Dark Blue Hover */
```

### Icone Material Symbols

Il componente utilizza Material Symbols con queste impostazioni:

```css
font-variation-settings: 
    'FILL' 1,      /* Filled icons */
    'wght' 400,    /* Normal weight */
    'GRAD' 0,      /* No gradient */
    'opsz' 24;     /* Size 24 */
```

Icone utilizzate:
- 📚 `menu_book` - Teoria/Lezione
- ✏️ `draw` - Disegno/Pratica
- 🔬 `science` - Laboratorio
- 📝 `quiz` - Verifica
- 👥 `groups` - Lavoro di Gruppo
- ⋯ `more_horiz` - Altro

### Tipografia

Font Stack:
```css
--schedule-font-family: 'Inter', -apple-system, BlinkMacSystemFont, 
                        'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

Font Sizes:
- Extra Small: 12px (0.75rem)
- Small: 14px (0.875rem)
- Base: 16px (1rem)
- Large: 18px (1.125rem)
- Extra Large: 20px (1.25rem)

---

## ♿ Accessibilità

### Keyboard Navigation

- **Tab**: Naviga tra le celle
- **Enter/Space**: Apri il modal di modifica
- **Esc**: Chiudi il modal
- **Tab** (nel modal): Naviga tra i campi del form

### ARIA Labels

Ogni cella ha un label descrittivo:
```html
<td role="button" tabindex="0" aria-label="Lunedì 08:00">
```

### Focus Indicators

```css
.schedule-cell:focus {
    outline: 3px solid var(--schedule-accent);
    outline-offset: 2px;
}
```

### Screen Reader Support

Il componente utilizza ruoli ARIA semantici:
- `role="grid"` sulla tabella
- `role="button"` sulle celle
- `role="dialog"` sul modal
- `aria-label` per descrizioni contestuali

---

## 📚 API e Funzioni

### `renderScheduleTable(container, scheduleData, onCellClick)`

Renderizza la tabella orario completa.

**Parametri:**
- `container` (HTMLElement): Elemento DOM contenitore
- `scheduleData` (Object): Dati orario con chiavi "Giorno-Ora"
- `onCellClick` (Function): Callback `(dayIndex, time, data) => void`

**Esempio:**
```javascript
renderScheduleTable(
    document.getElementById('schedule'),
    { "Lunedì-08:00": { classId: "1A", subject: "Matematica", activityType: "theory" } },
    (dayIndex, time, data) => console.log('Clicked:', dayIndex, time)
);
```

### `showScheduleEditModal(dayIndex, time, currentData, onSave)`

Mostra il modal di modifica per una cella.

**Parametri:**
- `dayIndex` (number): Indice del giorno (0-4)
- `time` (string): Ora (es. "08:00")
- `currentData` (Object|null): Dati correnti della cella
- `onSave` (Function): Callback `(dayIndex, time, newData) => void`

**Esempio:**
```javascript
showScheduleEditModal(
    0,                          // Lunedì
    "08:00",                    // Ore 8
    { classId: "1A", ... },     // Dati correnti
    (dayIndex, time, newData) => {
        // Salva i nuovi dati
    }
);
```

### `generateTimeSlots()`

Genera array di slot temporali.

**Returns:** `string[]` - Array di ore (es. `["08:00", "09:00", ...]`)

**Esempio:**
```javascript
const slots = generateTimeSlots();
// ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00"]
```

### `getActivityType(type)`

Ottiene la configurazione di un tipo di attività.

**Parametri:**
- `type` (string): Chiave del tipo (es. "theory", "lab")

**Returns:** `Object` - `{ label, icon, color }`

**Esempio:**
```javascript
const activityType = getActivityType("theory");
// { label: "Teoria/Lezione", icon: "menu_book", color: "#1976D2" }
```

### Helper Functions (schedule-example-data.js)

#### `generateEmptySchedule()`
Genera struttura orario vuota.

#### `validateScheduleData(scheduleData)`
Valida i dati dell'orario.

#### `getScheduleForDay(scheduleData, dayName)`
Ottiene orario per un giorno specifico.

#### `getScheduleStats(scheduleData)`
Calcola statistiche sull'orario.

---

## 💡 Esempi Pratici

### Esempio 1: Integrazione con LocalStorage

```javascript
import { renderScheduleTable, showScheduleEditModal } from './js/schedule-component.js';

// Carica dati da localStorage
function loadSchedule() {
    const saved = localStorage.getItem('schedule-data');
    return saved ? JSON.parse(saved) : {};
}

// Salva dati in localStorage
function saveSchedule(data) {
    localStorage.setItem('schedule-data', JSON.stringify(data));
}

// Setup
let scheduleData = loadSchedule();
const container = document.getElementById('schedule-container');

function handleCellClick(dayIndex, time, currentData) {
    showScheduleEditModal(dayIndex, time, currentData, handleSave);
}

function handleSave(dayIndex, time, newData) {
    const days = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì'];
    const key = `${days[dayIndex]}-${time}`;
    
    if (newData === null) {
        delete scheduleData[key];
    } else {
        scheduleData[key] = newData;
    }
    
    saveSchedule(scheduleData);
    renderScheduleTable(container, scheduleData, handleCellClick);
}

// Render iniziale
renderScheduleTable(container, scheduleData, handleCellClick);
```

### Esempio 2: Integrazione con Backend API

```javascript
import { renderScheduleTable, showScheduleEditModal } from './js/schedule-component.js';

// Carica dati dal backend
async function loadSchedule() {
    try {
        const response = await fetch('/api/schedule');
        return await response.json();
    } catch (error) {
        console.error('Error loading schedule:', error);
        return {};
    }
}

// Salva dati nel backend
async function saveSchedule(data) {
    try {
        await fetch('/api/schedule', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    } catch (error) {
        console.error('Error saving schedule:', error);
    }
}

// Setup con async/await
(async function() {
    let scheduleData = await loadSchedule();
    const container = document.getElementById('schedule-container');
    
    function handleCellClick(dayIndex, time, currentData) {
        showScheduleEditModal(dayIndex, time, currentData, handleSave);
    }
    
    async function handleSave(dayIndex, time, newData) {
        const days = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì'];
        const key = `${days[dayIndex]}-${time}`;
        
        if (newData === null) {
            delete scheduleData[key];
        } else {
            scheduleData[key] = newData;
        }
        
        await saveSchedule(scheduleData);
        renderScheduleTable(container, scheduleData, handleCellClick);
    }
    
    renderScheduleTable(container, scheduleData, handleCellClick);
})();
```

### Esempio 3: Vista Giornaliera

```javascript
import { renderScheduleTable, generateTimeSlots } from './js/schedule-component.js';
import { getScheduleForDay } from './js/schedule-example-data.js';

// Crea vista giornaliera per oggi
function renderTodaySchedule() {
    const today = new Date();
    const days = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
    const dayName = days[today.getDay()];
    
    // Filtra dati per oggi
    const todaySchedule = getScheduleForDay(scheduleData, dayName);
    
    // Renderizza solo gli slot di oggi
    const container = document.getElementById('today-schedule');
    
    // Crea HTML personalizzato per vista giornaliera
    const timeSlots = generateTimeSlots();
    let html = `<h2>Orario di ${dayName}</h2>`;
    html += '<div class="today-schedule-list">';
    
    timeSlots.forEach(time => {
        const key = `${dayName}-${time}`;
        const slot = todaySchedule[key];
        
        html += `<div class="today-schedule-item">
            <div class="time">${time}</div>
            ${slot ? `
                <div class="content">
                    <strong>${slot.subject}</strong>
                    <span>${slot.classId}</span>
                </div>
            ` : '<div class="empty">Libero</div>'}
        </div>`;
    });
    
    html += '</div>';
    container.innerHTML = html;
}
```

---

## 📖 Best Practices

### 1. Performance

- ✅ Usa `generateEmptySchedule()` per inizializzare
- ✅ Valida i dati con `validateScheduleData()` prima di salvare
- ✅ Minimizza i re-render chiamando `renderScheduleTable()` solo quando necessario

### 2. UX

- ✅ Fornisci feedback visivo durante il salvataggio
- ✅ Conferma prima di eliminare attività
- ✅ Mostra messaggi di errore chiari
- ✅ Usa toast/notifications per conferme

### 3. Accessibilità

- ✅ Testa con screen reader (NVDA, JAWS, VoiceOver)
- ✅ Verifica navigazione keyboard
- ✅ Mantieni contrasto colori WCAG AA
- ✅ Fornisci alternative testuali per icone

### 4. Responsive

- ✅ Testa su dispositivi reali, non solo emulatori
- ✅ Verifica touch targets (min 44x44px iOS)
- ✅ Abilita smooth scrolling su mobile
- ✅ Ottimizza per orientamento landscape e portrait

### 5. Manutenibilità

- ✅ Non hardcodare valori, usa le variabili CSS
- ✅ Centralizza la configurazione in un unico file
- ✅ Documenta personalizzazioni importanti
- ✅ Mantieni separazione tra logica e presentazione

---

## 🔧 Troubleshooting

### Le icone Material Symbols non si caricano

**Soluzione:**
```html
<!-- Verifica che il link sia presente nell'<head> -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">
```

### La tabella non è responsive su mobile

**Soluzione:**
```html
<!-- Assicurati di avere il meta viewport -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### I colori non cambiano con il dark theme

**Soluzione:**
```javascript
// Verifica che la classe dark-theme sia applicata al body
document.body.classList.add('dark-theme');
```

### Il modal non si apre

**Soluzione:**
```javascript
// Verifica che state.classes sia popolato
import { state } from './js/data.js';
console.log('Classes:', state.classes);

// Assicurati che ci siano classi disponibili prima di aprire il modal
```

### Errore "Cannot read property 'name' of undefined"

**Soluzione:**
```javascript
// Verifica che tutti i classId nei dati dell'orario esistano in state.classes
const classIds = Object.values(scheduleData)
    .filter(item => item !== null)
    .map(item => item.classId);

const missingClasses = classIds.filter(id => 
    !state.classes.find(c => c.id === id)
);

console.log('Missing classes:', missingClasses);
```

---

## 📞 Supporto

Per domande, suggerimenti o segnalazione bug:

1. Consulta questa documentazione
2. Controlla gli esempi in `js/schedule-example-data.js`
3. Verifica la console del browser per errori
4. Apri una issue sul repository GitHub

---

## 📄 Licenza

Questo componente fa parte del progetto Docente++ ed è rilasciato sotto la stessa licenza del progetto principale.

---

**Versione:** 1.0.0  
**Ultimo aggiornamento:** 2025-10-15  
**Autore:** Team Docente++
