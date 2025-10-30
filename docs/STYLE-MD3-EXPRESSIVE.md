# Material Design 3 Expressive - Guida alla Migrazione dei Token

## Panoramica

Questo documento fornisce una guida completa per migrare i valori hardcoded alle variabili del tema Material Design 3 (MD3) Expressive. Tutti i componenti dell'app devono utilizzare esclusivamente le variabili CSS MD3 per garantire coerenza visiva e facilità di manutenzione.

## Regola Fondamentale

**NON utilizzare mai valori hardcoded per colori, spaziatura o tipografia.** Utilizzare sempre le variabili CSS MD3.

## Variabili Colore MD3

### Colori Primari

Utilizzare per elementi principali, pulsanti CTA, link importanti:

```css
/* ❌ NON FARE */
background: #8657FF;
color: #FFFFFF;

/* ✅ FARE */
background: var(--md-sys-color-primary);
color: var(--md-sys-color-on-primary);
```

**Variabili disponibili:**
- `--md-sys-color-primary` - Colore primario principale
- `--md-sys-color-on-primary` - Testo/icone su colore primario
- `--md-sys-color-primary-container` - Contenitore con colore primario
- `--md-sys-color-on-primary-container` - Testo/icone su contenitore primario

### Colori Secondari

Utilizzare per elementi di supporto, pulsanti secondari, badge:

```css
/* ❌ NON FARE */
background: #6E5EFF;
color: #FFFFFF;

/* ✅ FARE */
background: var(--md-sys-color-secondary);
color: var(--md-sys-color-on-secondary);
```

**Variabili disponibili:**
- `--md-sys-color-secondary`
- `--md-sys-color-on-secondary`
- `--md-sys-color-secondary-container`
- `--md-sys-color-on-secondary-container`

### Colori Terziari

Utilizzare per elementi di accento, highlights:

```css
/* ❌ NON FARE */
background: #FF7AC6;
color: #381326;

/* ✅ FARE */
background: var(--md-sys-color-tertiary);
color: var(--md-sys-color-on-tertiary);
```

**Variabili disponibili:**
- `--md-sys-color-tertiary`
- `--md-sys-color-on-tertiary`
- `--md-sys-color-tertiary-container`
- `--md-sys-color-on-tertiary-container`

### Superfici e Sfondi

Utilizzare per card, dialog, background delle pagine:

```css
/* ❌ NON FARE */
background: #FFFFFF;
color: #1B1224;

/* ✅ FARE */
background: var(--md-sys-color-surface);
color: var(--md-sys-color-on-surface);
```

**Variabili disponibili:**
- `--md-sys-color-surface` - Superficie principale
- `--md-sys-color-on-surface` - Testo su superficie
- `--md-sys-color-surface-variant` - Superficie alternativa
- `--md-sys-color-on-surface-variant` - Testo su superficie alternativa
- `--md-sys-color-background` - Sfondo pagina
- `--md-sys-color-on-background` - Testo su sfondo

### Colori di Stato

Utilizzare per messaggi di errore, outline, bordi:

```css
/* ❌ NON FARE */
border: 1px solid #8F8698;
background: #D84B4B;

/* ✅ FARE */
border: 1px solid var(--md-sys-color-outline);
background: var(--md-sys-color-error);
```

**Variabili disponibili:**
- `--md-sys-color-outline` - Bordi e separatori
- `--md-sys-color-error` - Errori
- `--md-sys-color-on-error` - Testo su errore

### Trasparenze e Overlay

Per effetti con trasparenza, utilizzare `rgba()` con valori calcolati:

```css
/* ❌ NON FARE */
background: rgba(134, 87, 255, 0.1);

/* ✅ FARE - Usare CSS custom properties con trasparenza */
background: color-mix(in srgb, var(--md-sys-color-primary) 10%, transparent);

/* OPPURE per compatibilità */
background: var(--md-sys-color-primary);
opacity: 0.1;
```

## Variabili Spaziatura

Utilizzare il sistema di spaziatura basato su griglia 8px:

```css
/* ❌ NON FARE */
padding: 16px;
margin: 24px;
gap: 8px;

/* ✅ FARE */
padding: var(--md-spacing-md);
margin: var(--md-spacing-lg);
gap: var(--md-spacing-sm);
```

**Variabili disponibili:**
- `--md-spacing-xs: 4px` - Extra small (0.5 unità)
- `--md-spacing-sm: 8px` - Small (1 unità)
- `--md-spacing-md: 16px` - Medium (2 unità)
- `--md-spacing-lg: 24px` - Large (3 unità)
- `--md-spacing-xl: 32px` - Extra large (4 unità)

Oppure utilizzare le variabili alternative:
- `--spacing-xs`, `--spacing-sm`, `--spacing-md`, `--spacing-lg`, `--spacing-xl`

## Variabili Border Radius

Utilizzare per consistenza negli angoli arrotondati:

```css
/* ❌ NON FARE */
border-radius: 10px;
border-radius: 14px;
border-radius: 20px;

/* ✅ FARE */
border-radius: var(--md-shape-small);
border-radius: var(--md-shape-medium);
border-radius: var(--md-shape-large);
```

**Variabili disponibili:**
- `--md-shape-small: 10px` - Piccoli elementi (button, chip)
- `--md-shape-medium: 14px` - Card, dialog
- `--md-shape-large: 20px` - Container grandi
- `--md-radius-small: 8px` - Alternativa compatibile
- `--md-radius-medium: 12px` - Alternativa compatibile
- `--md-radius-large: 16px` - Alternativa compatibile

## Focus Indicators

Utilizzare le variabili per indicatori di focus accessibili:

```css
/* ❌ NON FARE */
button:focus {
  outline: 2px solid #8657FF;
  outline-offset: 2px;
}

/* ✅ FARE */
button:focus {
  outline: var(--md-focus-width) solid var(--md-focus-outline);
  outline-offset: var(--md-focus-offset);
}
```

**Variabili disponibili:**
- `--md-focus-outline` - Colore dell'outline di focus
- `--md-focus-width: 2px` - Spessore dell'outline
- `--md-focus-offset: 2px` - Distanza dall'elemento

## Tipografia

Utilizzare le variabili tipografiche per dimensioni e pesi:

```css
/* ❌ NON FARE */
font-size: 16px;
font-weight: 500;
line-height: 1.5;

/* ✅ FARE */
font-size: var(--font-size-base);
font-weight: var(--font-weight-medium);
line-height: var(--line-height-normal);
```

**Variabili dimensioni:**
- `--font-size-xs: 0.75rem` (12px)
- `--font-size-sm: 0.875rem` (14px)
- `--font-size-base: 1rem` (16px)
- `--font-size-lg: 1.125rem` (18px)
- `--font-size-xl: 1.25rem` (20px)
- `--font-size-2xl: 1.5rem` (24px)

**Variabili pesi:**
- `--font-weight-light: 300`
- `--font-weight-regular: 400`
- `--font-weight-medium: 500`
- `--font-weight-semibold: 600`
- `--font-weight-bold: 700`

## Ombre (Elevation)

Utilizzare le elevation MD3 per ombre consistenti:

```css
/* ❌ NON FARE */
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

/* ✅ FARE */
box-shadow: var(--md-elevation-1);
box-shadow: var(--md-elevation-2);
```

**Variabili disponibili:**
- `--md-elevation-0: none` - Nessuna ombra
- `--md-elevation-1` - Elevazione minima (card)
- `--md-elevation-2` - Elevazione media (hover)
- `--md-elevation-3` - Elevazione alta (dialog)
- `--md-elevation-4` - Elevazione molto alta
- `--md-elevation-5` - Elevazione massima

## Esempi di Migrazione

### Esempio 1: Pulsante Primario

```css
/* ❌ PRIMA */
.btn-primary {
  background: #8657FF;
  color: #FFFFFF;
  padding: 10px 18px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(134, 87, 255, 0.2);
}

/* ✅ DOPO */
.btn-primary {
  background: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  padding: var(--md-spacing-sm) var(--md-spacing-md);
  border-radius: var(--md-shape-small);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  box-shadow: var(--md-elevation-1);
}

.btn-primary:focus {
  outline: var(--md-focus-width) solid var(--md-focus-outline);
  outline-offset: var(--md-focus-offset);
}
```

### Esempio 2: Card

```css
/* ❌ PRIMA */
.card {
  background: #FFFFFF;
  color: #1B1224;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #E7E0EC;
}

/* ✅ DOPO */
.card {
  background: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
  padding: var(--md-spacing-md);
  border-radius: var(--md-shape-medium);
  box-shadow: var(--md-elevation-1);
  border: 1px solid var(--md-sys-color-outline);
}
```

### Esempio 3: Badge/Pill

```css
/* ❌ PRIMA */
.badge {
  background: #E6E0FF;
  color: #1B1144;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

/* ✅ DOPO */
.badge {
  background: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
  padding: var(--md-spacing-xs) var(--md-spacing-sm);
  border-radius: 999px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
}
```

## Tema Scuro

Le variabili MD3 gestiscono automaticamente il tema scuro quando la classe `.dark-theme` è applicata a `:root` o `body`. Non è necessario scrivere media query o override:

```css
/* ❌ NON FARE - Media query manuali */
@media (prefers-color-scheme: dark) {
  .card {
    background: #1A1720;
    color: #EDE7F8;
  }
}

/* ✅ FARE - Le variabili cambiano automaticamente */
.card {
  background: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
}
```

## Checklist Migrazione

Quando migri un componente a MD3:

- [ ] Sostituisci tutti i colori hex/rgb con variabili `--md-sys-color-*`
- [ ] Sostituisci padding/margin con variabili `--md-spacing-*`
- [ ] Sostituisci border-radius con variabili `--md-shape-*` o `--md-radius-*`
- [ ] Sostituisci font-size con variabili `--font-size-*`
- [ ] Sostituisci font-weight con variabili `--font-weight-*`
- [ ] Sostituisci box-shadow con variabili `--md-elevation-*`
- [ ] Aggiungi indicatori di focus con `--md-focus-*`
- [ ] Rimuovi media query `@media (prefers-color-scheme: dark)`
- [ ] Testa in modalità chiara e scura
- [ ] Testa con diverse palette di colori

## Riferimenti

- [docs/theme.md](./theme.md) - Documentazione completa del sistema tema
- [Material Design 3 Guidelines](https://m3.material.io/)
- [Color System](https://m3.material.io/styles/color/overview)

## Supporto

Per domande o problemi con la migrazione, consulta la documentazione in `docs/theme.md` o apri una issue su GitHub.
