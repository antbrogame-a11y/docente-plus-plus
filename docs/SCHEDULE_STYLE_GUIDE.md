# 🎨 Style Guide - Componente Orario

## Panoramica

Questo documento descrive le linee guida di design e stile per il Componente Orario del progetto Docente++. Seguendo queste linee guida, assicurerai coerenza visiva e funzionale in tutta l'applicazione.

---

## Palette Colori

### Tema Chiaro (Default)

#### Colori Primari
```css
--schedule-primary: #0277BD          /* Deep Blue - Azioni principali */
--schedule-primary-light: #4FC3F7    /* Light Cyan - Hover states */
--schedule-primary-dark: #01579B     /* Dark Blue - Active states */
--schedule-accent: #00BCD4           /* Cyan - Accenti e call-to-action */
--schedule-accent-light: #B2EBF2     /* Light Cyan - Backgrounds */
```

**Utilizzo:**
- Primario: Header, bottoni principali, icone importanti
- Accent: Hover effects, focus states, highlights

#### Colori di Background
```css
--schedule-bg: #FFFFFF               /* Bianco - Background principale */
--schedule-cell-bg: #FAFAFA          /* Grigio chiaro - Celle normali */
--schedule-cell-hover: #E1F5FE       /* Light Blue - Hover su celle */
--schedule-cell-active: #B3E5FC      /* Active Blue - Celle attive */
--schedule-cell-empty: #F5F5F5       /* Grigio - Celle vuote */
```

#### Colori Bordi
```css
--schedule-border: #E0E0E0           /* Grigio chiaro - Bordi normali */
--schedule-border-hover: #4FC3F7     /* Cyan - Bordi hover */
--schedule-border-active: #0277BD    /* Blue - Bordi attivi */
```

#### Colori Testo
```css
--schedule-text-primary: #212121     /* Quasi nero - Testo principale */
--schedule-text-secondary: #757575   /* Grigio medio - Testo secondario */
--schedule-text-muted: #9E9E9E       /* Grigio chiaro - Testo disabilitato */
--schedule-text-on-primary: #FFFFFF  /* Bianco - Testo su primario */
```

### Tema Scuro

#### Colori Primari
```css
--schedule-primary: #42A5F5          /* Light Blue - Più luminoso per dark */
--schedule-primary-light: #4FC3F7    /* Light Cyan */
--schedule-primary-dark: #1976D2     /* Medium Blue */
--schedule-accent: #26C6DA           /* Bright Cyan */
```

#### Colori di Background
```css
--schedule-bg: #1E1E1E               /* Dark Gray - Background principale */
--schedule-cell-bg: #2A2A2A          /* Dark Gray - Celle normali */
--schedule-cell-hover: #1A237E       /* Dark Blue - Hover */
--schedule-cell-active: #0D47A1      /* Deep Blue - Active */
```

### Colori per Tipi di Attività

Ogni tipo di attività ha un colore distintivo:

```css
--schedule-activity-theory: #1976D2      /* Blue - Teoria */
--schedule-activity-practice: #0097A7    /* Cyan - Pratica */
--schedule-activity-lab: #00796B         /* Teal - Laboratorio */
--schedule-activity-test: #5E35B1        /* Purple - Verifica */
--schedule-activity-group: #43A047       /* Green - Gruppo */
--schedule-activity-other: #757575       /* Gray - Altro */
```

**Applicazione:**
- Icone delle attività
- Badge di tipo attività
- Indicatori visivi

---

## Tipografia

### Font Family

```css
--schedule-font-family: 'Inter', -apple-system, BlinkMacSystemFont, 
                        'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

**Ordine di Fallback:**
1. Inter (Google Font - preferito)
2. -apple-system (iOS/macOS)
3. BlinkMacSystemFont (Chrome macOS)
4. Segoe UI (Windows)
5. Roboto (Android)
6. Helvetica Neue
7. Arial (universale)
8. sans-serif (sistema)

### Scale Tipografica

```css
--schedule-font-size-xs: 0.75rem    /* 12px - Caption, labels piccole */
--schedule-font-size-sm: 0.875rem   /* 14px - Testo secondario */
--schedule-font-size-base: 1rem     /* 16px - Testo normale (default) */
--schedule-font-size-lg: 1.125rem   /* 18px - Sottotitoli */
--schedule-font-size-xl: 1.25rem    /* 20px - Titoli */
```

### Pesi Font

```css
--schedule-font-weight-normal: 400    /* Regular - Testo normale */
--schedule-font-weight-medium: 500    /* Medium - Enfasi leggera */
--schedule-font-weight-semibold: 600  /* Semibold - Titoli secondari */
--schedule-font-weight-bold: 700      /* Bold - Titoli principali */
```

**Utilizzo:**
- Normal (400): Corpo testo, descrizioni
- Medium (500): Label, menu items
- Semibold (600): Subtitoli, headers secondari
- Bold (700): Headers principali, call-to-action

---

## Spaziatura

### Sistema di Spaziatura Base

Basato su unità di 4px per consistenza:

```css
--schedule-spacing-xs: 4px      /* 0.5 unità - Padding minimo */
--schedule-spacing-sm: 8px      /* 1 unità - Padding piccolo */
--schedule-spacing-md: 12px     /* 1.5 unità - Padding medio */
--schedule-spacing-lg: 16px     /* 2 unità - Padding standard */
--schedule-spacing-xl: 24px     /* 3 unità - Padding grande */
```

**Applicazione:**
- XS: Gap tra icona e testo
- SM: Padding interno celle piccole
- MD: Padding interno celle medie
- LG: Padding contenitori, margini card
- XL: Margini sezioni, spacing macro

---

## Border Radius

### Valori Predefiniti

```css
--schedule-radius-sm: 4px       /* Piccolo - Input, bottoni piccoli */
--schedule-radius-md: 8px       /* Medio - Card, celle tabella */
--schedule-radius-lg: 12px      /* Grande - Modali, contenitori */
```

**Utilizzo:**
- SM: Bottoni, input fields, badge
- MD: Celle tabella, card secondarie
- LG: Wrapper principale, modali, container grandi

---

## Ombre (Shadows)

### Elevazione

```css
--schedule-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12)
--schedule-shadow-md: 0 2px 6px rgba(0, 0, 0, 0.15)
--schedule-shadow-lg: 0 4px 12px rgba(0, 0, 0, 0.2)
--schedule-shadow-hover: 0 4px 16px rgba(2, 119, 189, 0.2)
```

**Applicazione:**
- SM: Bordi sottili, separatori visivi
- MD: Card, contenitori normali
- LG: Modali, overlays, popup
- Hover: Stati hover interattivi

---

## Transizioni

### Durata

```css
--schedule-transition-fast: 150ms       /* Feedback immediato */
--schedule-transition-normal: 250ms     /* Standard (default) */
--schedule-transition-slow: 350ms       /* Animazioni complesse */
```

### Timing Function

```css
cubic-bezier(0.4, 0, 0.2, 1)  /* Material Design standard */
```

**Applicazione:**
- Fast: Hover, focus, stati semplici
- Normal: Click, apertura menu, fade
- Slow: Modali, drawer, animazioni elaborate

---

## Iconografia

### Material Symbols Settings

```css
font-variation-settings: 
    'FILL' 1,      /* Filled icons */
    'wght' 400,    /* Normal weight */
    'GRAD' 0,      /* No gradient */
    'opsz' 24;     /* Optical size 24 */
```

### Icone Utilizzate

| Contesto | Icona | Nome Symbol |
|----------|-------|-------------|
| Orario | 🗓️ | `calendar_month` |
| Ora | ⏰ | `schedule` |
| Modifica | ✏️ | `edit_calendar` |
| Chiudi | ✖️ | `close` |
| Aggiungi | ➕ | `add_circle` |
| Elimina | 🗑️ | `delete` |
| Salva | ✓ | `check` |
| Classe | 🏫 | `school` |
| Materia | 📄 | `subject` |
| Tipo | 📂 | `category` |
| Teoria | 📚 | `menu_book` |
| Disegno | ✏️ | `draw` |
| Lab | 🔬 | `science` |
| Verifica | 📝 | `quiz` |
| Gruppo | 👥 | `groups` |
| Altro | ⋯ | `more_horiz` |
| Statistiche | 📊 | `analytics` |
| Upload | ⬆️ | `upload` |
| Download | ⬇️ | `download` |
| Pulisci | 🧹 | `delete_sweep` |
| Dark Mode | 🌙 | `dark_mode` |

---

## Componenti UI

### Bottoni

#### Stili Bottoni

**Primary Button:**
```css
background: var(--schedule-primary);
color: var(--schedule-text-on-primary);
padding: 12px 20px;
border-radius: var(--schedule-radius-md);
font-weight: var(--schedule-font-weight-medium);
```

**Secondary Button:**
```css
background: var(--schedule-border);
color: var(--schedule-text-primary);
padding: 12px 20px;
border-radius: var(--schedule-radius-md);
```

**Danger Button:**
```css
background: #D32F2F;
color: white;
padding: 12px 20px;
border-radius: var(--schedule-radius-md);
```

#### Stati Bottoni

- **Hover**: Background più scuro, shadow elevata
- **Active**: Background ancora più scuro, shadow ridotta
- **Disabled**: Opacity 0.5, cursor not-allowed
- **Focus**: Outline accent con offset

### Celle Tabella

#### Stati Celle

**Normale (vuota):**
```css
background: var(--schedule-cell-empty);
border: 2px dashed var(--schedule-border);
opacity: 0.7;
```

**Compilata:**
```css
background: var(--schedule-cell-bg);
border: 2px solid var(--schedule-border);
```

**Hover:**
```css
background: var(--schedule-cell-hover);
border-color: var(--schedule-border-hover);
transform: translateY(-2px);
box-shadow: var(--schedule-shadow-hover);
```

**Focus:**
```css
outline: 3px solid var(--schedule-accent);
outline-offset: 2px;
```

### Modali

#### Struttura Modal

**Header:**
```css
background: linear-gradient(135deg, 
    var(--schedule-primary) 0%, 
    var(--schedule-accent) 100%
);
color: var(--schedule-text-on-primary);
padding: var(--schedule-spacing-lg);
border-radius: var(--schedule-radius-lg) var(--schedule-radius-lg) 0 0;
```

**Body:**
```css
padding: var(--schedule-spacing-xl);
background: var(--schedule-bg);
```

**Footer:**
```css
padding: var(--schedule-spacing-lg);
border-top: 1px solid var(--schedule-border);
background: var(--schedule-cell-bg);
display: flex;
justify-content: space-between;
```

---

## Responsive Design

### Breakpoints

```css
--schedule-breakpoint-mobile: 640px      /* Smartphone */
--schedule-breakpoint-tablet: 768px      /* Tablet */
--schedule-breakpoint-desktop: 1024px    /* Desktop */
```

### Adattamenti per Dispositivo

#### Mobile (< 640px)
- Header giorni: Abbreviati (Lun, Mar, Mer...)
- Font size: Ridotto di 1 step
- Padding: Ridotto a SM
- Layout celle: Verticale, centrato
- Modal: Full-screen

#### Tablet (640-1024px)
- Header giorni: Completi
- Font size: Standard
- Padding: Standard (MD)
- Layout celle: Orizzontale
- Modal: Max-width 90%

#### Desktop (> 1024px)
- Header giorni: Completi
- Font size: Standard o maggiore
- Padding: Generoso (LG)
- Layout celle: Orizzontale con spaziatura
- Modal: Max-width fissa

---

## Accessibilità

### Contrasto Colori

Tutti i colori rispettano **WCAG 2.1 AA**:
- Testo normale: Contrasto minimo 4.5:1
- Testo grande: Contrasto minimo 3:1
- Elementi UI: Contrasto minimo 3:1

### Focus Indicators

```css
:focus {
    outline: 3px solid var(--schedule-accent);
    outline-offset: 2px;
}
```

### Touch Targets

Dimensioni minime per area di tocco:
- iOS: 44x44px (standard Apple)
- Android: 48x48px (standard Material)
- Componente: min 44x44px

---

## Best Practices

### DO ✅

1. **Usa sempre le variabili CSS** invece di valori hardcoded
2. **Mantieni consistenza** nella spaziatura usando il sistema 4px
3. **Applica transizioni** su stati interattivi
4. **Testa accessibilità** con screen reader
5. **Ottimizza per mobile-first** progressivamente
6. **Usa icone Material Symbols** per coerenza
7. **Valida contrasti** colori per accessibilità

### DON'T ❌

1. **Non hardcodare colori** - usa sempre variabili
2. **Non ignorare stati hover/focus** - fondamentali per UX
3. **Non usare font size assolute** - usa rem per accessibilità
4. **Non dimenticare mobile** - sempre mobile-first
5. **Non sovrascrivere transizioni** senza motivo
6. **Non usare icone inconsistenti** - solo Material Symbols
7. **Non ignorare dark mode** - testa entrambi i temi

---

## Esempi di Implementazione

### Bottone con Icona

```html
<button class="schedule-btn schedule-btn--primary">
    <span class="material-symbols-outlined">check</span>
    Salva
</button>
```

### Cella Tabella Compilata

```html
<td class="schedule-cell schedule-cell--filled">
    <div class="schedule-cell__content">
        <div class="schedule-cell__icon">
            <span class="material-symbols-outlined">menu_book</span>
        </div>
        <div class="schedule-cell__info">
            <div class="schedule-cell__class">1A</div>
            <div class="schedule-cell__subject">Matematica</div>
        </div>
    </div>
</td>
```

### Card Statistica

```html
<div class="stat-item">
    <div class="stat-label">Slot Totali</div>
    <div class="stat-value">30</div>
</div>
```

---

## Manutenzione

### Aggiornamento Colori

Per cambiare il tema, modifica solo `css/schedule-theme.css`:

```css
:root {
    --schedule-primary: #TUO_COLORE;
    --schedule-accent: #TUO_ACCENTO;
}
```

### Aggiunta Nuovi Componenti

Quando aggiungi nuovi componenti:
1. Usa le variabili esistenti
2. Segui le convenzioni di naming (`schedule-*`)
3. Implementa stati hover/focus/active
4. Testa su tutti i breakpoints
5. Verifica accessibilità

---

**Versione**: 1.0.0  
**Ultimo Aggiornamento**: 2025-10-15  
**Mantenuto da**: Team Docente++
