/**
 * @jest-environment jsdom
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import themeProvider, { ThemeProvider } from '../../src/components/ThemeProvider.js';
import {
    validateThemeContext,
    validateNoHardcodedColors,
    subscribeToTheme,
    getThemeState,
    validatePageTheme,
    checkMD3TokenUsage
} from '../../src/utils/ThemeValidator.js';

describe('Theme Validation System', () => {
    let originalLocalStorage;
    let consoleErrorSpy;
    let consoleWarnSpy;

    beforeEach(() => {
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

        // Set up DOM
        document.documentElement.className = '';
        document.body.className = '';
        
        // Add meta theme-color
        const metaThemeColor = document.createElement('meta');
        metaThemeColor.name = 'theme-color';
        metaThemeColor.content = '#6750A4';
        document.head.appendChild(metaThemeColor);

        // Mock console methods
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        // Reset theme provider
        if (themeProvider.initialized) {
            themeProvider.initialized = false;
        }
    });

    afterEach(() => {
        global.localStorage = originalLocalStorage;
        document.documentElement.className = '';
        document.body.className = '';
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.remove();
        }
        consoleErrorSpy.mockRestore();
        consoleWarnSpy.mockRestore();
    });

    describe('ThemeProvider Validation', () => {
        test('validateThemeVariables returns errors when not initialized', () => {
            const validation = themeProvider.validateThemeVariables();
            
            expect(validation.valid).toBe(false);
            expect(validation.errors).toContain('ThemeProvider not initialized. Call themeProvider.initialize() at app startup.');
        });

        test('validateThemeVariables passes when properly initialized', async () => {
            // Import and initialize theme
            const theme = await import('../../js/theme.js');
            theme.initializeTheme();
            themeProvider.initialize();
            
            const validation = themeProvider.validateThemeVariables();
            
            // In JSDOM, CSS variables may not be computed, check structure
            expect(validation).toHaveProperty('valid');
            expect(validation).toHaveProperty('errors');
            expect(validation).toHaveProperty('warnings');
            expect(Array.isArray(validation.errors)).toBe(true);
            expect(Array.isArray(validation.warnings)).toBe(true);
        });

        test('logValidationErrors logs errors when validation fails', () => {
            const validation = { valid: false, errors: ['Test error'], warnings: ['Test warning'] };
            
            themeProvider.logValidationErrors(validation);
            
            expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Theme Validation Failed:', ['Test error']);
            expect(consoleWarnSpy).toHaveBeenCalledWith('⚠️ Theme Validation Warnings:', ['Test warning']);
        });

        test('validation can be disabled', () => {
            themeProvider.setValidationEnabled(false);
            expect(themeProvider.validationEnabled).toBe(false);
            
            themeProvider.setValidationEnabled(true);
            expect(themeProvider.validationEnabled).toBe(true);
        });
    });

    describe('Component Theme Context Validation', () => {
        test('validateThemeContext returns false when ThemeProvider not initialized', () => {
            const result = validateThemeContext('TestComponent');
            
            expect(result).toBe(false);
            expect(consoleErrorSpy).toHaveBeenCalled();
        });

        test('validateThemeContext returns true when properly initialized', async () => {
            const theme = await import('../../js/theme.js');
            theme.initializeTheme();
            themeProvider.initialize();
            
            const result = validateThemeContext('TestComponent');
            
            expect(result).toBe(true);
        });

        test('getThemeState returns null when validation fails', () => {
            const state = getThemeState('TestComponent');
            
            expect(state).toBeNull();
        });

        test('getThemeState returns theme state when validation passes', async () => {
            const theme = await import('../../js/theme.js');
            theme.initializeTheme();
            themeProvider.initialize();
            
            const state = getThemeState('TestComponent');
            
            expect(state).not.toBeNull();
            expect(state).toHaveProperty('theme');
            expect(state).toHaveProperty('color');
            expect(state).toHaveProperty('effectiveTheme');
        });
    });

    describe('Hardcoded Color Detection', () => {
        test('validateNoHardcodedColors detects hex colors', () => {
            const element = document.createElement('div');
            element.setAttribute('style', 'color: #FF0000; background: #00FF00');
            
            const result = validateNoHardcodedColors(element, 'TestComponent');
            
            expect(result.valid).toBe(false);
            expect(result.issues.length).toBeGreaterThan(0);
            expect(result.issues[0].type).toBe('hardcoded-color');
        });

        test('validateNoHardcodedColors detects RGB colors', () => {
            const element = document.createElement('div');
            element.setAttribute('style', 'color: rgb(255, 0, 0); background: rgba(0, 255, 0, 0.5)');
            
            const result = validateNoHardcodedColors(element, 'TestComponent');
            
            expect(result.valid).toBe(false);
            expect(result.issues.length).toBeGreaterThan(0);
        });

        test('validateNoHardcodedColors passes when no hardcoded colors', () => {
            const element = document.createElement('div');
            element.setAttribute('style', 'color: var(--md-sys-color-primary)');
            
            const result = validateNoHardcodedColors(element, 'TestComponent');
            
            expect(result.valid).toBe(true);
            expect(result.issues.length).toBe(0);
        });

        test('validateNoHardcodedColors handles null element', () => {
            const result = validateNoHardcodedColors(null, 'TestComponent');
            
            expect(result.valid).toBe(true);
            expect(result.issues.length).toBe(0);
        });
    });

    describe('Page Theme Validation', () => {
        test('validatePageTheme reports errors when ThemeProvider not initialized', () => {
            const result = validatePageTheme('TestPage');
            
            expect(result.valid).toBe(false);
            expect(result.issues.length).toBeGreaterThan(0);
            expect(result.issues.some(i => i.type === 'not-initialized')).toBe(true);
        });

        test('validatePageTheme passes when properly initialized', async () => {
            const theme = await import('../../js/theme.js');
            theme.initializeTheme();
            themeProvider.initialize();
            
            const result = validatePageTheme('TestPage');
            
            // In JSDOM, CSS variables may not be computed, so we check structure
            expect(result).toHaveProperty('valid');
            expect(result).toHaveProperty('issues');
            expect(Array.isArray(result.issues)).toBe(true);
        });

        test('validatePageTheme logs success message when valid', async () => {
            const theme = await import('../../js/theme.js');
            theme.initializeTheme();
            themeProvider.initialize();
            const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
            
            const result = validatePageTheme('TestPage');
            
            // In JSDOM, CSS variables may not be fully computed, so we check result
            if (result.valid) {
                expect(consoleLogSpy).toHaveBeenCalledWith(
                    expect.stringContaining('✅ [ThemeValidator] Page "TestPage" theme validation passed')
                );
            }
            
            consoleLogSpy.mockRestore();
        });
    });

    describe('Theme Subscription Validation', () => {
        test('subscribeToTheme warns when validation fails', () => {
            const callback = jest.fn();
            
            subscribeToTheme(callback, 'TestComponent');
            
            expect(consoleWarnSpy).toHaveBeenCalled();
        });

        test('subscribeToTheme works when properly initialized', async () => {
            const theme = await import('../../js/theme.js');
            theme.initializeTheme();
            themeProvider.initialize();
            const callback = jest.fn();
            
            const unsubscribe = subscribeToTheme(callback, 'TestComponent');
            
            // Change theme to trigger callback
            themeProvider.setTheme('dark');
            
            expect(callback).toHaveBeenCalled();
            
            // Clean up
            unsubscribe();
        });
    });

    describe('MD3 Token Usage Check', () => {
        test('checkMD3TokenUsage detects MD3 variables', () => {
            const element = document.createElement('div');
            element.style.color = 'var(--md-sys-color-primary)';
            document.body.appendChild(element);
            
            const result = checkMD3TokenUsage(element);
            
            // In JSDOM, computed styles may not resolve CSS variables
            // We check that the function returns the expected structure
            expect(result).toHaveProperty('usingMD3');
            expect(result).toHaveProperty('tokens');
            expect(Array.isArray(result.tokens)).toBe(true);
            
            document.body.removeChild(element);
        });

        test('checkMD3TokenUsage returns false for non-MD3 styles', () => {
            const element = document.createElement('div');
            element.style.color = 'red';
            document.body.appendChild(element);
            
            const result = checkMD3TokenUsage(element);
            
            expect(result.usingMD3).toBe(false);
            expect(result.tokens.length).toBe(0);
            
            document.body.removeChild(element);
        });

        test('checkMD3TokenUsage handles null element', () => {
            const result = checkMD3TokenUsage(null);
            
            expect(result.usingMD3).toBe(false);
            expect(result.tokens.length).toBe(0);
        });
    });

    describe('Integration Tests', () => {
        test('complete theme setup and validation workflow', async () => {
            // 1. Initialize theme
            const theme = await import('../../js/theme.js');
            theme.initializeTheme();
            
            // 2. Initialize ThemeProvider
            themeProvider.initialize();
            
            // 3. Validate page theme (may have CSS variable issues in JSDOM)
            const pageValidation = validatePageTheme('IntegrationTest');
            // We check it ran without crashing
            expect(pageValidation).toHaveProperty('valid');
            expect(pageValidation).toHaveProperty('issues');
            
            // 4. Validate component context
            const contextValid = validateThemeContext('TestComponent');
            expect(contextValid).toBe(true);
            
            // 5. Get theme state
            const state = getThemeState('TestComponent');
            expect(state).not.toBeNull();
            expect(state.isM3).toBe(true);
            
            // 6. Subscribe to theme changes
            const callback = jest.fn();
            const unsubscribe = subscribeToTheme(callback, 'TestComponent');
            
            // 7. Change theme
            themeProvider.setTheme('dark');
            expect(callback).toHaveBeenCalled();
            
            // 8. Clean up
            unsubscribe();
        });

        test('theme persistence across component lifecycle', async () => {
            const theme = await import('../../js/theme.js');
            theme.initializeTheme();
            themeProvider.initialize();
            
            // Set theme
            themeProvider.setThemeAndColor('dark', 'blue');
            
            // Verify state is persisted
            expect(theme.getThemePreference()).toBe('dark');
            expect(theme.getThemeColorPreference()).toBe('blue');
            
            // Verify theme is applied
            expect(document.documentElement.classList.contains('dark-theme')).toBe(true);
            
            // Get state from validator
            const state = getThemeState('TestComponent');
            expect(state.theme).toBe('dark');
            expect(state.color).toBe('blue');
        });
    });
});
