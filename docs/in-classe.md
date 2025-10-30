# Pagina "In Classe" - Documentazione

## Panoramica

La pagina "In Classe" fornisce un'interfaccia per esplorare, filtrare e iscriversi alle lezioni disponibili. È progettata con un approccio mobile-first, accessibile e modulare, utilizzando design tokens Material Design 3.

## Architettura

### Componenti Modulari

Il sistema è diviso in tre moduli principali:

#### 1. API Client (`src/api/lessons.js`)

Client API per la gestione delle lezioni con supporto per dati mock.

**Caratteristiche:**
- Supporto mock data per sviluppo rapido
- Interfaccia pronta per integrazione API REST
- Filtri avanzati (ricerca, materia, stato, date)
- Gestione errori con fallback
- Type hints tramite JSDoc

**API Pubblica:**

```javascript
import { lessonsAPI } from './src/api/lessons.js';

// Ottenere tutte le lezioni
const lessons = await lessonsAPI.getLessons();

// Filtrare lezioni
const filtered = await lessonsAPI.getLessons({
  search: 'matematica',
  subject: 'Matematica',
  status: 'scheduled'
});

// Ottenere una lezione specifica
const lesson = await lessonsAPI.getLesson('lesson-001');

// Iscriversi a una lezione
const result = await lessonsAPI.enrollInLesson('lesson-001');
if (result.success) {
  console.log(result.message);
}

// Ottenere materie disponibili
const subjects = await lessonsAPI.getSubjects();
```

**Tipo Lesson:**

```javascript
{
  id: string,              // ID univoco
  title: string,           // Titolo lezione
  teacher: string,         // Nome docente
  subject: string,         // Materia
  date: string,           // Data ISO (es. '2025-10-20')
  time: string,           // Orario (es. '14:00 - 15:00')
  duration: number,       // Durata in minuti
  classId: string,        // ID classe
  className: string,      // Nome classe
  type: string,           // Tipo attività
  status: string,         // Stato lezione
  enrolledCount: number,  // Iscritti
  maxCapacity: number     // Capacità massima
}
```

#### 2. Componente Lesson Card (`src/components/LessonCard.js`)

Componente riutilizzabile per visualizzare informazioni di una lezione.

**Caratteristiche:**
- Rendering dichiarativo
- Gestione eventi (click, enroll)
- Accessibilità completa (ARIA, keyboard)
- Update dinamico
- Icone Material Symbols
- Badge tipo attività

**Utilizzo:**

```javascript
import { LessonCard } from './src/components/LessonCard.js';

const card = new LessonCard({
  id: 'lesson-001',
  title: 'Introduzione all\'Algebra',
  teacher: 'Prof. Mario Rossi',
  subject: 'Matematica',
  date: '2025-10-20',
  time: '08:00 - 09:00',
  duration: 60,
  className: 'Classe 3A',
  type: 'Teoria',
  enrolledCount: 18,
  maxCapacity: 25,
  onViewDetails: (lesson) => {
    console.log('View details:', lesson);
  },
  onEnroll: (lesson) => {
    console.log('Enroll in:', lesson);
  }
});

// Renderizza la card
const element = card.render();
document.getElementById('container').appendChild(element);

// Aggiorna dati
card.update({ enrolledCount: 19 });

// Distruggi card
card.destroy();
```

#### 3. Pagina Principale (`src/pages/InClasse.js`)

Controller della pagina che gestisce lista lezioni, filtri e dialogo dettagli.

**Caratteristiche:**
- Gestione completa dello stato
- Filtri real-time (ricerca + materia)
- Dialog dettagli lezione
- Gestione iscrizioni
- Loading states
- Messaggi di successo/errore
- Accessibilità completa

**Utilizzo:**

```javascript
import { initInClassePage } from './src/pages/InClasse.js';

// Inizializza pagina in un container
const page = initInClassePage('my-container-id');

// Cleanup quando necessario
page.destroy();
```

## Stili e Design Tokens

### Material Design 3 Expressive

Tutti gli stili utilizzano variabili CSS da `src/styles/theme-md3-expressive.css`:

```css
/* Colori */
--md-sys-color-primary
--md-sys-color-on-primary
--md-sys-color-primary-container
--md-sys-color-secondary
--md-sys-color-surface
--md-sys-color-on-surface
--md-sys-color-outline

/* Spacing */
--md-spacing-xs: 4px
--md-spacing-sm: 8px
--md-spacing-md: 16px
--md-spacing-lg: 24px

/* Shape */
--md-shape-small: 10px
--md-shape-medium: 14px
--md-shape-large: 20px

/* Focus */
--md-focus-outline
--md-focus-width: 2px
--md-focus-offset: 2px
```

### File CSS

`src/styles/in-classe.css` contiene:
- Layout responsive (mobile-first)
- Componenti card
- Filtri
- Dialog
- Stati (loading, empty, error)
- Animazioni
- Accessibility styles

## Accessibilità (WCAG 2.1 AA)

### Focus Visibile

Tutti gli elementi interattivi hanno focus visibile con outline personalizzato:

```css
element:focus {
  outline: var(--md-focus-width) solid var(--md-focus-outline);
  outline-offset: var(--md-focus-offset);
}
```

### ARIA Labels e Roles

- **role="article"** per lesson cards
- **aria-label** su pulsanti e controlli
- **aria-describedby** per hint testuali
- **aria-live="polite"** per annunci dinamici
- **role="status"** per messaggi
- **aria-labelledby** su dialog

### Navigazione Tastiera

- **Tab**: navigazione tra elementi
- **Enter/Space**: attivazione elementi
- **Escape**: chiusura dialog
- Card focusabili con `tabindex="0"`

### Screen Reader

- Labels descrittivi su tutti i controlli
- Testo alternativo per icone (`aria-hidden="true"` + testo visibile)
- Annunci per caricamenti e cambiamenti stato
- `.visually-hidden` class per testo solo screen reader

## Responsive Design

### Breakpoints

```css
/* Desktop: default */
/* Tablet: max-width: 768px */
/* Mobile: max-width: 480px */
```

### Layout Adattivo

- **Desktop**: Grid 3 colonne
- **Tablet**: Grid 2 colonne, filtri stack
- **Mobile**: 1 colonna, filtri full-width

### Touch-Friendly

- Pulsanti minimo 44x44px
- Spacing adeguato per touch
- Card con area cliccabile grande

## Integrazione con Backend

### Configurazione API

Modificare la configurazione in `src/api/lessons.js`:

```javascript
// Usa dati mock (default)
const api = new LessonsAPI({ useMock: true });

// Usa API reale
const api = new LessonsAPI({
  useMock: false,
  baseURL: 'https://api.example.com'
});
```

### Endpoint API Richiesti

```
GET  /api/lessons              - Lista lezioni (con query params)
GET  /api/lessons/:id          - Dettagli lezione
POST /api/lessons/:id/enroll   - Iscrizione
```

### Esempio Integrazione

```javascript
// 1. Modificare lessonsAPI in src/api/lessons.js
export const lessonsAPI = new LessonsAPI({
  useMock: false,
  baseURL: process.env.API_BASE_URL || 'https://api.docente-plus.com'
});

// 2. Aggiungere autenticazione se necessario
async getLessons(filter = {}) {
  const queryParams = new URLSearchParams(filter).toString();
  const response = await fetch(`${this.baseURL}/lessons?${queryParams}`, {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}
```

## Testing

### Unit Test

Esempio test per componenti:

```javascript
import { describe, it, expect } from '@jest/globals';
import { LessonCard } from '../src/components/LessonCard.js';
import { lessonsAPI } from '../src/api/lessons.js';

describe('LessonCard', () => {
  it('should render card with lesson data', () => {
    const card = new LessonCard({
      id: 'test-1',
      title: 'Test Lesson',
      teacher: 'Test Teacher',
      // ... other props
    });
    
    const element = card.render();
    expect(element.querySelector('.lesson-title').textContent).toBe('Test Lesson');
  });
});

describe('LessonsAPI', () => {
  it('should fetch lessons', async () => {
    const lessons = await lessonsAPI.getLessons();
    expect(lessons).toBeInstanceOf(Array);
    expect(lessons.length).toBeGreaterThan(0);
  });
  
  it('should filter lessons by search', async () => {
    const lessons = await lessonsAPI.getLessons({ search: 'matematica' });
    lessons.forEach(lesson => {
      const hasMatch = 
        lesson.title.toLowerCase().includes('matematica') ||
        lesson.teacher.toLowerCase().includes('matematica');
      expect(hasMatch).toBe(true);
    });
  });
});
```

### E2E Test

Esempio test end-to-end:

```javascript
describe('InClasse Page', () => {
  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = '<div id="in-classe-container"></div>';
  });

  it('should load and display lessons', async () => {
    const page = await initInClassePage('in-classe-container');
    
    // Wait for lessons to load
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const cards = document.querySelectorAll('.lesson-card');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('should filter lessons on search', async () => {
    const page = await initInClassePage('in-classe-container');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const searchInput = document.getElementById('lesson-search');
    searchInput.value = 'matematica';
    searchInput.dispatchEvent(new Event('input'));
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const cards = document.querySelectorAll('.lesson-card');
    // Verify filtered results
  });
});
```

## Performance

### Ottimizzazioni

1. **Lazy Loading**: Carica solo lezioni visibili (implementazione futura)
2. **Debouncing**: Filtro ricerca con debounce 300ms
3. **Virtual Scrolling**: Per grandi dataset (implementazione futura)
4. **CSS Animations**: Hardware-accelerated con `transform`
5. **Event Delegation**: Eventi gestiti a livello container quando possibile

### Metriche Target

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## Estensioni Future

### Funzionalità Pianificate

1. **Calendario Vista**: Visualizzazione lezioni in calendario
2. **Notifiche**: Alert per nuove lezioni/modifiche
3. **Preferiti**: Salvare lezioni preferite
4. **Condivisione**: Condividere link lezioni
5. **Export**: Esportare programma lezioni (PDF, ICS)
6. **Filtri Avanzati**: Data range picker, docente, orario
7. **Ordinamento**: Per data, popolarità, disponibilità
8. **Paginazione**: Per grandi dataset
9. **Ricerca Vocale**: Input vocale per ricerca
10. **Modalità Offline**: PWA con cache delle lezioni

### Integrazione AI

Possibili integrazioni con assistente IA:

1. **Raccomandazioni**: Suggerire lezioni basate su profilo
2. **Riassunti**: Generare riassunti automatici lezioni
3. **Q&A**: Chatbot per informazioni lezioni
4. **Analisi**: Insights su partecipazione e performance

## Manutenzione

### Aggiornamento Dati Mock

Modificare array `mockLessons` in `src/api/lessons.js`.

### Aggiungere Nuovi Filtri

1. Aggiungere campo a `LessonsFilter` typedef
2. Implementare logica in `_getMockLessons()`
3. Aggiungere UI in `_renderStructure()`
4. Collegare evento in `_attachEventListeners()`

### Personalizzare Stili

Modificare variabili in `src/styles/theme-md3-expressive.css` per cambiare tema globale.

## Supporto Browser

- Chrome/Edge: 90+
- Firefox: 88+
- Safari: 14+
- Mobile: iOS 14+, Android 8+

## Licenza

MIT - Vedi LICENSE file nel repository.

## Autori

Team Docente++ - https://github.com/antbrogame-a11y/docente-plus-plus

## Riferimenti

- [Material Design 3](https://m3.material.io/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
