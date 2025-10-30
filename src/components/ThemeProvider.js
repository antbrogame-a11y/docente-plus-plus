/**
 * ThemeProvider - Centralized theme management component
 * Provides theme context and state management for the entire application
 * Similar to React Context API but implemented in vanilla JS
 */

import { 
    initializeTheme, 
    applyTheme, 
    getThemePreference, 
    getThemeColorPreference,
    saveThemePreference,
    saveThemeColorPreference,
    getColorPalettes
} from '../../js/theme.js';

class ThemeProvider {
    constructor() {
        this.listeners = [];
        this.theme = getThemePreference();
        this.color = getThemeColorPreference();
        this.initialized = false;
        this.validationEnabled = true; // Enable validation by default
    }

    /**
     * Initialize the theme provider
     */
    initialize() {
        if (this.initialized) {
            console.warn('ThemeProvider already initialized');
            return;
        }

        initializeTheme();
        this.initialized = true;
        
        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', () => {
                if (this.theme === 'auto') {
                    this.notifyListeners();
                }
            });
        }

        console.log('ThemeProvider initialized with theme:', this.theme, 'color:', this.color);
    }

    /**
     * Get current theme mode
     * @returns {string} Current theme ('light', 'dark', or 'auto')
     */
    getTheme() {
        return this.theme;
    }

    /**
     * Get current color palette
     * @returns {string} Current color palette name
     */
    getColor() {
        return this.color;
    }

    /**
     * Get effective theme (resolved from 'auto' if necessary)
     * @returns {string} Effective theme ('light' or 'dark')
     */
    getEffectiveTheme() {
        if (this.theme === 'auto') {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
            return 'light';
        }
        return this.theme;
    }

    /**
     * Set theme mode
     * @param {string} theme - Theme to set ('light', 'dark', or 'auto')
     */
    setTheme(theme) {
        if (!['light', 'dark', 'auto'].includes(theme)) {
            console.error('Invalid theme:', theme);
            return;
        }

        this.theme = theme;
        saveThemePreference(theme);
        applyTheme(theme, this.color);
        this.notifyListeners();
    }

    /**
     * Set color palette
     * @param {string} color - Color palette name
     */
    setColor(color) {
        const palettes = getColorPalettes();
        if (!palettes[color]) {
            console.error('Invalid color palette:', color);
            return;
        }

        this.color = color;
        saveThemeColorPreference(color);
        applyTheme(this.theme, color);
        this.notifyListeners();
    }

    /**
     * Set both theme and color at once
     * @param {string} theme - Theme to set
     * @param {string} color - Color palette to set
     */
    setThemeAndColor(theme, color) {
        if (!['light', 'dark', 'auto'].includes(theme)) {
            console.error('Invalid theme:', theme);
            return;
        }

        const palettes = getColorPalettes();
        if (!palettes[color]) {
            console.error('Invalid color palette:', color);
            return;
        }

        this.theme = theme;
        this.color = color;
        saveThemePreference(theme);
        saveThemeColorPreference(color);
        applyTheme(theme, color);
        this.notifyListeners();
    }

    /**
     * Subscribe to theme changes
     * @param {Function} listener - Callback function to be called when theme changes
     * @returns {Function} Unsubscribe function
     */
    subscribe(listener) {
        if (typeof listener !== 'function') {
            console.error('Listener must be a function');
            return () => {};
        }

        this.listeners.push(listener);

        // Return unsubscribe function
        return () => {
            const index = this.listeners.indexOf(listener);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }

    /**
     * Notify all listeners of theme change
     */
    notifyListeners() {
        const state = {
            theme: this.theme,
            color: this.color,
            effectiveTheme: this.getEffectiveTheme()
        };

        this.listeners.forEach(listener => {
            try {
                listener(state);
            } catch (error) {
                console.error('Error in theme listener:', error);
            }
        });
    }

    /**
     * Get available color palettes
     * @returns {Object} Available color palettes
     */
    getAvailablePalettes() {
        return getColorPalettes();
    }

    /**
     * Check if Material Design 3 theme is active
     * This centralizes the isM3 check mentioned in the requirements
     * @returns {boolean} Always true - MD3 is always active in this unified theme
     */
    isM3() {
        return true;
    }

    /**
     * Get theme state for use in components
     * @returns {Object} Current theme state
     */
    getState() {
        return {
            theme: this.theme,
            color: this.color,
            effectiveTheme: this.getEffectiveTheme(),
            isM3: this.isM3(),
            palettes: this.getAvailablePalettes()
        };
    }

    /**
     * Validate that MD3 CSS variables are properly set
     * This helps detect if theme is not properly initialized
     * @returns {Object} Validation result with status and errors
     */
    validateThemeVariables() {
        const errors = [];
        const warnings = [];
        
        // Check if theme is initialized
        if (!this.initialized) {
            errors.push('ThemeProvider not initialized. Call themeProvider.initialize() at app startup.');
        }
        
        // Check for required MD3 CSS variables
        const requiredVars = [
            '--md-sys-color-primary',
            '--md-sys-color-on-primary',
            '--md-sys-color-surface',
            '--md-sys-color-on-surface',
            '--md-sys-color-background',
            '--md-sys-color-on-background'
        ];
        
        const rootStyles = getComputedStyle(document.documentElement);
        
        requiredVars.forEach(varName => {
            const value = rootStyles.getPropertyValue(varName).trim();
            if (!value) {
                errors.push(`Required CSS variable ${varName} is not set`);
            }
        });
        
        // Check for theme classes
        const hasThemeClass = document.documentElement.classList.contains('light-theme') || 
                             document.documentElement.classList.contains('dark-theme');
        
        if (!hasThemeClass) {
            warnings.push('No theme class found on document element. Theme may not be properly applied.');
        }
        
        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    }

    /**
     * Log validation errors to console (only in development)
     * @param {Object} validation - Validation result from validateThemeVariables
     */
    logValidationErrors(validation) {
        if (!validation.valid) {
            console.error('❌ Theme Validation Failed:', validation.errors);
        }
        if (validation.warnings.length > 0) {
            console.warn('⚠️ Theme Validation Warnings:', validation.warnings);
        }
    }

    /**
     * Enable or disable validation
     * @param {boolean} enabled - Whether to enable validation
     */
    setValidationEnabled(enabled) {
        this.validationEnabled = enabled;
    }
}

// Create a singleton instance
const themeProvider = new ThemeProvider();

// Set up validation check on initialization
if (typeof window !== 'undefined') {
    // Run validation after a short delay to allow theme to be applied
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (themeProvider.validationEnabled) {
                const validation = themeProvider.validateThemeVariables();
                themeProvider.logValidationErrors(validation);
            }
        }, 100);
    });
}

// Export the singleton instance
export default themeProvider;

// Also export the class for testing or advanced usage
export { ThemeProvider };
