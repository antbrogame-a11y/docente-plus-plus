/**
 * @jest-environment jsdom
 */

import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';

describe('Theme System', () => {
  let theme;
  let originalLocalStorage;

  beforeEach(async () => {
    // Mock localStorage
    originalLocalStorage = global.localStorage;
    const localStorageMock = {
      store: {},
      getItem(key) {
        return this.store[key] || null;
      },
      setItem(key, value) {
        this.store[key] = value.toString();
      },
      removeItem(key) {
        delete this.store[key];
      },
      clear() {
        this.store = {};
      }
    };
    global.localStorage = localStorageMock;

    // Set up basic DOM structure
    document.documentElement.className = '';
    document.body.className = '';
    
    // Mock meta theme-color
    const metaThemeColor = document.createElement('meta');
    metaThemeColor.name = 'theme-color';
    metaThemeColor.content = '#6750A4';
    document.head.appendChild(metaThemeColor);
    
    // Import theme module
    theme = await import('../../js/theme.js');
  });

  afterEach(() => {
    global.localStorage = originalLocalStorage;
    document.documentElement.className = '';
    document.body.className = '';
    // Clean up meta tags
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.remove();
    }
  });

  describe('Theme Preference Storage', () => {
    test('getThemePreference returns default auto when not set', () => {
      expect(theme.getThemePreference()).toBe('auto');
    });

    test('saveThemePreference stores theme in localStorage', () => {
      theme.saveThemePreference('dark');
      expect(localStorage.getItem('docente-plus-plus-theme')).toBe('dark');
    });

    test('getThemePreference retrieves saved preference', () => {
      theme.saveThemePreference('light');
      expect(theme.getThemePreference()).toBe('light');
    });

    test('getThemeColorPreference returns default lilac when not set', () => {
      expect(theme.getThemeColorPreference()).toBe('lilac');
    });

    test('saveThemeColorPreference stores color in localStorage', () => {
      theme.saveThemeColorPreference('blue');
      expect(localStorage.getItem('docente-plus-plus-theme-color')).toBe('blue');
    });

    test('getThemeColorPreference retrieves saved color', () => {
      theme.saveThemeColorPreference('teal');
      expect(theme.getThemeColorPreference()).toBe('teal');
    });
  });

  describe('Theme Application', () => {
    test('applyTheme adds light-theme class for light mode', () => {
      theme.applyTheme('light');
      expect(document.documentElement.classList.contains('light-theme')).toBe(true);
      expect(document.body.classList.contains('light-theme')).toBe(true);
      expect(document.documentElement.classList.contains('dark-theme')).toBe(false);
    });

    test('applyTheme adds dark-theme class for dark mode', () => {
      theme.applyTheme('dark');
      expect(document.documentElement.classList.contains('dark-theme')).toBe(true);
      expect(document.body.classList.contains('dark-theme')).toBe(true);
      expect(document.documentElement.classList.contains('light-theme')).toBe(false);
    });

    test('applyTheme removes old theme classes before applying new ones', () => {
      theme.applyTheme('dark');
      expect(document.documentElement.classList.contains('dark-theme')).toBe(true);
      
      theme.applyTheme('light');
      expect(document.documentElement.classList.contains('dark-theme')).toBe(false);
      expect(document.documentElement.classList.contains('light-theme')).toBe(true);
    });

    test('applyTheme with auto mode uses system preference', () => {
      // Mock matchMedia to return dark mode preference
      const mockMatchMedia = (query) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {}
      });
      window.matchMedia = mockMatchMedia;

      theme.applyTheme('auto');
      expect(document.documentElement.classList.contains('dark-theme')).toBe(true);
    });

    test('applyTheme applies color palette CSS variables', () => {
      theme.applyTheme('light', 'blue');
      
      const primaryColor = document.documentElement.style.getPropertyValue('--md-sys-color-primary');
      expect(primaryColor).toBeTruthy();
    });

    test('applyTheme updates meta theme-color', () => {
      theme.applyTheme('light', 'red');
      
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      expect(metaThemeColor).toBeTruthy();
      // Color should be updated to red palette primary color
      expect(metaThemeColor.getAttribute('content')).toBeTruthy();
    });
  });

  describe('Theme Initialization', () => {
    test('initializeTheme applies saved preferences', () => {
      theme.saveThemePreference('dark');
      theme.saveThemeColorPreference('green');
      
      theme.initializeTheme();
      
      expect(document.documentElement.classList.contains('dark-theme')).toBe(true);
    });

    test('initializeTheme sets up system preference listener', () => {
      let eventListenerAdded = false;
      const mockAddEventListener = () => {
        eventListenerAdded = true;
      };
      const mockMatchMedia = (query) => ({
        matches: false,
        media: query,
        addEventListener: mockAddEventListener,
        removeEventListener: () => {}
      });
      window.matchMedia = mockMatchMedia;

      theme.initializeTheme();
      
      expect(eventListenerAdded).toBe(true);
    });
  });

  describe('Color Palette Support', () => {
    const colors = ['purple', 'lilla', 'blue', 'teal', 'green', 'orange', 'pink', 'red', 'indigo'];
    
    test.each(colors)('applyTheme works with %s color palette in light mode', (color) => {
      theme.applyTheme('light', color);
      expect(document.documentElement.classList.contains('light-theme')).toBe(true);
      const primaryColor = document.documentElement.style.getPropertyValue('--md-sys-color-primary');
      expect(primaryColor).toBeTruthy();
    });

    test.each(colors)('applyTheme works with %s color palette in dark mode', (color) => {
      theme.applyTheme('dark', color);
      expect(document.documentElement.classList.contains('dark-theme')).toBe(true);
      const primaryColor = document.documentElement.style.getPropertyValue('--md-sys-color-primary');
      expect(primaryColor).toBeTruthy();
    });
  });

  describe('Theme Persistence', () => {
    test('theme preference persists across page reloads', () => {
      theme.saveThemePreference('dark');
      theme.saveThemeColorPreference('teal');
      
      // Simulate page reload by re-initializing
      theme.initializeTheme();
      
      expect(theme.getThemePreference()).toBe('dark');
      expect(theme.getThemeColorPreference()).toBe('teal');
    });

    test('theme classes are applied after initialization', () => {
      theme.saveThemePreference('light');
      theme.initializeTheme();
      
      expect(document.documentElement.classList.contains('light-theme')).toBe(true);
    });
  });

  describe('Theme Context Pattern', () => {
    test('theme state can be read and updated consistently', () => {
      // Set initial state
      theme.saveThemePreference('light');
      theme.saveThemeColorPreference('purple');
      
      // Read state
      expect(theme.getThemePreference()).toBe('light');
      expect(theme.getThemeColorPreference()).toBe('purple');
      
      // Update state
      theme.applyTheme('dark', 'blue');
      theme.saveThemePreference('dark');
      theme.saveThemeColorPreference('blue');
      
      // Verify update
      expect(theme.getThemePreference()).toBe('dark');
      expect(theme.getThemeColorPreference()).toBe('blue');
    });
  });
});
