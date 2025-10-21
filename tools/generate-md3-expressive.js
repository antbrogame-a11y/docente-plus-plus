#!/usr/bin/env node
/**
 * generate-md3-expressive.js
 * 
 * Generates MD3 Expressive theme CSS variables from a seed color.
 * Supports both light and dark modes.
 * 
 * Usage:
 *   node tools/generate-md3-expressive.js --seed=#8657FF
 *   node tools/generate-md3-expressive.js --seed=#8657FF --output=src/styles/generated-md3-expressive.css
 */

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);
let seedColor = '#8657FF'; // Default seed color
let outputPath = join(__dirname, '../src/styles/generated-md3-expressive.css');

args.forEach(arg => {
  if (arg.startsWith('--seed=')) {
    seedColor = arg.replace('--seed=', '');
  } else if (arg.startsWith('--output=')) {
    outputPath = arg.replace('--output=', '');
  }
});

/**
 * Simplified color generation for MD3 Expressive theme
 * In a real implementation, this would use Material Color Utilities
 * For now, we'll use a simplified approach with color adjustments
 */
function generatePalette(seedHex) {
  // Parse seed color
  const hex = seedHex.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  // Helper to convert RGB to hex
  const toHex = (r, g, b) => {
    const clamp = (val) => Math.max(0, Math.min(255, Math.round(val)));
    return '#' + [r, g, b].map(v => clamp(v).toString(16).padStart(2, '0')).join('').toUpperCase();
  };

  // Helper to lighten a color
  const lighten = (r, g, b, amount) => {
    return [
      r + (255 - r) * amount,
      g + (255 - g) * amount,
      b + (255 - b) * amount
    ];
  };

  // Helper to darken a color
  const darken = (r, g, b, amount) => {
    return [r * (1 - amount), g * (1 - amount), b * (1 - amount)];
  };

  // Generate light theme colors
  const light = {
    primary: seedHex,
    onPrimary: '#FFFFFF',
    primaryContainer: toHex(...lighten(r, g, b, 0.85)),
    onPrimaryContainer: toHex(...darken(r, g, b, 0.7)),

    secondary: toHex(Math.min(r + 20, 255), Math.min(g + 20, 255), b),
    onSecondary: '#FFFFFF',
    secondaryContainer: toHex(...lighten(r, g, b, 0.88)),
    onSecondaryContainer: toHex(...darken(r, g, b, 0.65)),

    tertiary: '#FF7AC6',
    onTertiary: '#381326',
    tertiaryContainer: '#FFD8EC',
    onTertiaryContainer: '#3B1020',

    background: '#FFFBFF',
    onBackground: '#1B1224',
    surface: '#FFFBFF',
    onSurface: '#1B1224',
    surfaceVariant: '#F4EEF9',
    onSurfaceVariant: '#4B4456',
    surfaceContainerLowest: '#FFFFFF',
    surfaceContainerLow: '#FEF7FF',
    surfaceContainer: '#F8F1FC',
    surfaceContainerHigh: '#F3ECF6',
    surfaceContainerHighest: '#EDE6F1',

    outline: '#8F8698',
    outlineVariant: '#CDC4CE',
    inverseOnSurface: '#F6EEFF',
    inverseSurface: '#2B1E36',
    inversePrimary: toHex(...lighten(r, g, b, 0.5)),

    error: '#D84B4B',
    onError: '#FFFFFF',
    errorContainer: '#FFDAD6',
    onErrorContainer: '#410002',

    shadow: '#000000',
    scrim: '#000000'
  };

  // Generate dark theme colors
  const dark = {
    primary: toHex(...lighten(r, g, b, 0.5)),
    onPrimary: toHex(...darken(r, g, b, 0.75)),
    primaryContainer: toHex(...darken(r, g, b, 0.3)),
    onPrimaryContainer: toHex(...lighten(r, g, b, 0.85)),

    secondary: toHex(...lighten(r, g, b, 0.55)),
    onSecondary: toHex(...darken(r, g, b, 0.7)),
    secondaryContainer: toHex(...darken(r, g, b, 0.35)),
    onSecondaryContainer: toHex(...lighten(r, g, b, 0.88)),

    tertiary: '#FFB1E3',
    onTertiary: '#5D1139',
    tertiaryContainer: '#7E2A50',
    onTertiaryContainer: '#FFD8EC',

    background: '#141218',
    onBackground: '#E6E0E9',
    surface: '#141218',
    onSurface: '#E6E0E9',
    surfaceVariant: '#49454F',
    onSurfaceVariant: '#CAC4D0',
    surfaceContainerLowest: '#0F0D13',
    surfaceContainerLow: '#1D1B20',
    surfaceContainer: '#211F26',
    surfaceContainerHigh: '#2B2930',
    surfaceContainerHighest: '#36343B',

    outline: '#938F99',
    outlineVariant: '#49454F',
    inverseOnSurface: '#322F35',
    inverseSurface: '#E6E0E9',
    inversePrimary: seedHex,

    error: '#FFB4AB',
    onError: '#690005',
    errorContainer: '#93000A',
    onErrorContainer: '#FFDAD6',

    shadow: '#000000',
    scrim: '#000000'
  };

  return { light, dark };
}

// Generate the palette
const palette = generatePalette(seedColor);

// Generate CSS content
const cssContent = `/**
 * Generated MD3 Expressive Theme
 * Seed color: ${seedColor}
 * Generated: ${new Date().toISOString()}
 * 
 * This file is auto-generated. Do not edit manually.
 * Regenerate with: node tools/generate-md3-expressive.js --seed=${seedColor}
 */

/* ==================== LIGHT THEME ==================== */
:root,
:root.light-theme,
html.light-theme,
body.light-theme {
  /* Primary colors */
  --md-sys-color-primary: ${palette.light.primary};
  --md-sys-color-on-primary: ${palette.light.onPrimary};
  --md-sys-color-primary-container: ${palette.light.primaryContainer};
  --md-sys-color-on-primary-container: ${palette.light.onPrimaryContainer};

  /* Secondary colors */
  --md-sys-color-secondary: ${palette.light.secondary};
  --md-sys-color-on-secondary: ${palette.light.onSecondary};
  --md-sys-color-secondary-container: ${palette.light.secondaryContainer};
  --md-sys-color-on-secondary-container: ${palette.light.onSecondaryContainer};

  /* Tertiary colors */
  --md-sys-color-tertiary: ${palette.light.tertiary};
  --md-sys-color-on-tertiary: ${palette.light.onTertiary};
  --md-sys-color-tertiary-container: ${palette.light.tertiaryContainer};
  --md-sys-color-on-tertiary-container: ${palette.light.onTertiaryContainer};

  /* Surface colors */
  --md-sys-color-background: ${palette.light.background};
  --md-sys-color-on-background: ${palette.light.onBackground};
  --md-sys-color-surface: ${palette.light.surface};
  --md-sys-color-on-surface: ${palette.light.onSurface};
  --md-sys-color-surface-variant: ${palette.light.surfaceVariant};
  --md-sys-color-on-surface-variant: ${palette.light.onSurfaceVariant};
  --md-sys-color-surface-container-lowest: ${palette.light.surfaceContainerLowest};
  --md-sys-color-surface-container-low: ${palette.light.surfaceContainerLow};
  --md-sys-color-surface-container: ${palette.light.surfaceContainer};
  --md-sys-color-surface-container-high: ${palette.light.surfaceContainerHigh};
  --md-sys-color-surface-container-highest: ${palette.light.surfaceContainerHighest};

  /* Outline colors */
  --md-sys-color-outline: ${palette.light.outline};
  --md-sys-color-outline-variant: ${palette.light.outlineVariant};

  /* Inverse colors */
  --md-sys-color-inverse-on-surface: ${palette.light.inverseOnSurface};
  --md-sys-color-inverse-surface: ${palette.light.inverseSurface};
  --md-sys-color-inverse-primary: ${palette.light.inversePrimary};

  /* Error colors */
  --md-sys-color-error: ${palette.light.error};
  --md-sys-color-on-error: ${palette.light.onError};
  --md-sys-color-error-container: ${palette.light.errorContainer};
  --md-sys-color-on-error-container: ${palette.light.onErrorContainer};

  /* Shadow & Scrim */
  --md-sys-color-shadow: ${palette.light.shadow};
  --md-sys-color-scrim: ${palette.light.scrim};
}

/* ==================== DARK THEME ==================== */
:root.dark-theme,
html.dark-theme,
body.dark-theme {
  /* Primary colors */
  --md-sys-color-primary: ${palette.dark.primary};
  --md-sys-color-on-primary: ${palette.dark.onPrimary};
  --md-sys-color-primary-container: ${palette.dark.primaryContainer};
  --md-sys-color-on-primary-container: ${palette.dark.onPrimaryContainer};

  /* Secondary colors */
  --md-sys-color-secondary: ${palette.dark.secondary};
  --md-sys-color-on-secondary: ${palette.dark.onSecondary};
  --md-sys-color-secondary-container: ${palette.dark.secondaryContainer};
  --md-sys-color-on-secondary-container: ${palette.dark.onSecondaryContainer};

  /* Tertiary colors */
  --md-sys-color-tertiary: ${palette.dark.tertiary};
  --md-sys-color-on-tertiary: ${palette.dark.onTertiary};
  --md-sys-color-tertiary-container: ${palette.dark.tertiaryContainer};
  --md-sys-color-on-tertiary-container: ${palette.dark.onTertiaryContainer};

  /* Surface colors */
  --md-sys-color-background: ${palette.dark.background};
  --md-sys-color-on-background: ${palette.dark.onBackground};
  --md-sys-color-surface: ${palette.dark.surface};
  --md-sys-color-on-surface: ${palette.dark.onSurface};
  --md-sys-color-surface-variant: ${palette.dark.surfaceVariant};
  --md-sys-color-on-surface-variant: ${palette.dark.onSurfaceVariant};
  --md-sys-color-surface-container-lowest: ${palette.dark.surfaceContainerLowest};
  --md-sys-color-surface-container-low: ${palette.dark.surfaceContainerLow};
  --md-sys-color-surface-container: ${palette.dark.surfaceContainer};
  --md-sys-color-surface-container-high: ${palette.dark.surfaceContainerHigh};
  --md-sys-color-surface-container-highest: ${palette.dark.surfaceContainerHighest};

  /* Outline colors */
  --md-sys-color-outline: ${palette.dark.outline};
  --md-sys-color-outline-variant: ${palette.dark.outlineVariant};

  /* Inverse colors */
  --md-sys-color-inverse-on-surface: ${palette.dark.inverseOnSurface};
  --md-sys-color-inverse-surface: ${palette.dark.inverseSurface};
  --md-sys-color-inverse-primary: ${palette.dark.inversePrimary};

  /* Error colors */
  --md-sys-color-error: ${palette.dark.error};
  --md-sys-color-on-error: ${palette.dark.onError};
  --md-sys-color-error-container: ${palette.dark.errorContainer};
  --md-sys-color-on-error-container: ${palette.dark.onErrorContainer};

  /* Shadow & Scrim */
  --md-sys-color-shadow: ${palette.dark.shadow};
  --md-sys-color-scrim: ${palette.dark.scrim};
}

/* ==================== ELEVATION ==================== */
:root {
  --md-sys-elevation-level0: 0px 0px 0px 0px rgba(0,0,0,0.2), 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 0px 0px 0px rgba(0,0,0,0.12);
  --md-sys-elevation-level1: 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12);
  --md-sys-elevation-level2: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12);
  --md-sys-elevation-level3: 0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12);
  --md-sys-elevation-level4: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
  --md-sys-elevation-level5: 0px 3px 5px -1px rgba(0,0,0,0.2), 0px 5px 8px 0px rgba(0,0,0,0.14), 0px 1px 14px 0px rgba(0,0,0,0.12);
}
`;

// Write the CSS file
writeFileSync(outputPath, cssContent, 'utf-8');

console.log(`✅ Generated MD3 Expressive theme CSS`);
console.log(`   Seed color: ${seedColor}`);
console.log(`   Output: ${outputPath}`);
console.log(`\nColors generated:`);
console.log(`   Light primary: ${palette.light.primary}`);
console.log(`   Dark primary: ${palette.dark.primary}`);
