/**
 * theme-hook.js - Runtime Theme Hook for MD3 Expressive
 * 
 * This module provides runtime integration between the app's theme picker
 * and the MD3 Expressive theme system. It supports:
 * - Dynamic seed color changes
 * - Light/dark mode switching
 * - Integration with existing theme.js
 */

// Current theme state
let currentSeed = '#8657FF';
let currentMode = 'light';

/**
 * Helper to convert hex to RGB
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Helper to lighten a color
 */
function lighten(r, g, b, amount) {
  return {
    r: Math.round(r + (255 - r) * amount),
    g: Math.round(g + (255 - g) * amount),
    b: Math.round(b + (255 - b) * amount)
  };
}

/**
 * Helper to darken a color
 */
function darken(r, g, b, amount) {
  return {
    r: Math.round(r * (1 - amount)),
    g: Math.round(g * (1 - amount)),
    b: Math.round(b * (1 - amount))
  };
}

/**
 * Convert RGB to hex
 */
function rgbToHex(r, g, b) {
  const clamp = (val) => Math.max(0, Math.min(255, val));
  return '#' + [r, g, b]
    .map(v => clamp(v).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}

/**
 * Generate theme colors from a seed color
 */
function generateThemeColors(seedHex, mode = 'light') {
  const rgb = hexToRgb(seedHex);
  if (!rgb) {
    console.error('Invalid seed color:', seedHex);
    return null;
  }

  const { r, g, b } = rgb;

  if (mode === 'dark') {
    // Dark theme colors
    const primary = lighten(r, g, b, 0.5);
    const primaryContainer = darken(r, g, b, 0.3);
    const secondary = lighten(r, g, b, 0.55);
    const secondaryContainer = darken(r, g, b, 0.35);

    return {
      '--md-sys-color-primary': rgbToHex(primary.r, primary.g, primary.b),
      '--md-sys-color-on-primary': rgbToHex(...Object.values(darken(r, g, b, 0.75))),
      '--md-sys-color-primary-container': rgbToHex(primaryContainer.r, primaryContainer.g, primaryContainer.b),
      '--md-sys-color-on-primary-container': rgbToHex(...Object.values(lighten(r, g, b, 0.85))),
      '--md-sys-color-secondary': rgbToHex(secondary.r, secondary.g, secondary.b),
      '--md-sys-color-on-secondary': rgbToHex(...Object.values(darken(r, g, b, 0.7))),
      '--md-sys-color-secondary-container': rgbToHex(secondaryContainer.r, secondaryContainer.g, secondaryContainer.b),
      '--md-sys-color-on-secondary-container': rgbToHex(...Object.values(lighten(r, g, b, 0.88))),
    };
  } else {
    // Light theme colors
    const primaryContainer = lighten(r, g, b, 0.85);
    const secondaryContainer = lighten(r, g, b, 0.88);

    return {
      '--md-sys-color-primary': seedHex,
      '--md-sys-color-on-primary': '#FFFFFF',
      '--md-sys-color-primary-container': rgbToHex(primaryContainer.r, primaryContainer.g, primaryContainer.b),
      '--md-sys-color-on-primary-container': rgbToHex(...Object.values(darken(r, g, b, 0.7))),
      '--md-sys-color-secondary': rgbToHex(Math.min(r + 20, 255), Math.min(g + 20, 255), b),
      '--md-sys-color-on-secondary': '#FFFFFF',
      '--md-sys-color-secondary-container': rgbToHex(secondaryContainer.r, secondaryContainer.g, secondaryContainer.b),
      '--md-sys-color-on-secondary-container': rgbToHex(...Object.values(darken(r, g, b, 0.65))),
    };
  }
}

/**
 * Apply theme colors to the document
 */
function applyThemeColors(colors) {
  if (!colors) return;

  const root = document.documentElement;
  Object.entries(colors).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
}

/**
 * Set the theme seed color
 */
export function setThemeSeed(seedHex) {
  if (!seedHex || !hexToRgb(seedHex)) {
    console.error('Invalid seed color:', seedHex);
    return;
  }

  currentSeed = seedHex;
  const colors = generateThemeColors(currentSeed, currentMode);
  applyThemeColors(colors);

  // Update meta theme-color
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', seedHex);
  }

  // Dispatch custom event for listeners
  window.dispatchEvent(new CustomEvent('themechange', {
    detail: { seed: currentSeed, mode: currentMode }
  }));
}

/**
 * Set the theme mode (light/dark)
 */
export function setThemeMode(mode) {
  if (mode !== 'light' && mode !== 'dark') {
    console.error('Invalid theme mode:', mode);
    return;
  }

  currentMode = mode;

  // Apply theme class to document
  const root = document.documentElement;
  const body = document.body;

  root.classList.remove('light-theme', 'dark-theme');
  body.classList.remove('light-theme', 'dark-theme');

  root.classList.add(`${mode}-theme`);
  body.classList.add(`${mode}-theme`);

  // Regenerate colors for the new mode
  const colors = generateThemeColors(currentSeed, currentMode);
  applyThemeColors(colors);

  // Dispatch custom event for listeners
  window.dispatchEvent(new CustomEvent('themechange', {
    detail: { seed: currentSeed, mode: currentMode }
  }));
}

/**
 * Get current theme state
 */
export function getCurrentTheme() {
  return {
    seed: currentSeed,
    mode: currentMode
  };
}

/**
 * Initialize the theme hook and integrate with existing theme.js
 */
export function initializeThemeHook() {
  // Detect initial mode from classes
  if (document.documentElement.classList.contains('dark-theme') || 
      document.body.classList.contains('dark-theme')) {
    currentMode = 'dark';
  } else {
    currentMode = 'light';
  }

  // Check if system prefers dark mode and auto theme is enabled
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('docente-plus-plus-theme');
  
  if (savedTheme === 'auto') {
    currentMode = prefersDark ? 'dark' : 'light';
    setThemeMode(currentMode);
  }

  // Listen for system theme changes
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      const savedTheme = localStorage.getItem('docente-plus-plus-theme');
      if (savedTheme === 'auto') {
        setThemeMode(e.matches ? 'dark' : 'light');
      }
    });
  }

  // Apply initial theme
  const colors = generateThemeColors(currentSeed, currentMode);
  applyThemeColors(colors);

  console.log('MD3 Theme Hook initialized:', { seed: currentSeed, mode: currentMode });
}

/**
 * Map legacy color names to seed colors
 */
const LEGACY_COLOR_MAP = {
  'purple': '#8657FF',
  'blue': '#1976D2',
  'green': '#388E3C',
  'red': '#C62828',
  'orange': '#EF6C00',
  'teal': '#00796B',
  'indigo': '#303F9F',
  'pink': '#C2185B'
};

/**
 * Integrate with existing theme.js color picker
 * This hooks into the theme picker and translates color selection to seed color
 */
export function integrateWithLegacyThemePicker() {
  // Listen for theme color changes from the existing theme picker
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
        // Try both legacy and new variable names
        const style = getComputedStyle(document.documentElement);
        let primaryColor = (style.getPropertyValue('--md-primary') || '').trim();
        if (!primaryColor) {
          primaryColor = (style.getPropertyValue('--md-sys-color-primary') || '').trim();
        }
        
        if (primaryColor && primaryColor !== currentSeed) {
          // Try to map it to a known seed or use it directly
          const seedColor = Object.values(LEGACY_COLOR_MAP).includes(primaryColor) 
            ? primaryColor 
            : (primaryColor.startsWith('#') ? primaryColor : currentSeed);
          
          setThemeSeed(seedColor);
        }
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['style']
  });

  // Also listen for storage events (theme changes in other tabs)
  window.addEventListener('storage', (e) => {
    if (e.key === 'docente-plus-plus-theme-color' && e.newValue) {
      const seedColor = LEGACY_COLOR_MAP[e.newValue] || currentSeed;
      setThemeSeed(seedColor);
    }

    if (e.key === 'docente-plus-plus-theme' && e.newValue) {
      if (e.newValue === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setThemeMode(prefersDark ? 'dark' : 'light');
      } else {
        setThemeMode(e.newValue);
      }
    }
  });
}

// Auto-initialize if this module is loaded
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initializeThemeHook();
      integrateWithLegacyThemePicker();
    });
  } else {
    initializeThemeHook();
    integrateWithLegacyThemePicker();
  }
}
