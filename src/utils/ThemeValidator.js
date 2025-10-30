/**
 * ThemeValidator - Utility to ensure components are using the global theme system
 * 
 * This validator helps prevent components from:
 * - Using hardcoded colors instead of CSS variables
 * - Managing their own theme state
 * - Ignoring the global ThemeProvider
 */

import themeProvider from '../components/ThemeProvider.js';

/**
 * Check if a component is using the global theme context
 * This should be called in component initialization
 * @param {string} componentName - Name of the component for debugging
 * @returns {boolean} True if theme is properly configured
 */
export function validateThemeContext(componentName) {
    const state = themeProvider.getState();
    
    if (!themeProvider.initialized) {
        console.error(
            `[ThemeValidator] Component "${componentName}" is trying to use theme, ` +
            `but ThemeProvider is not initialized. ` +
            `Ensure themeProvider.initialize() is called at app startup.`
        );
        return false;
    }
    
    // Check if MD3 variables are available
    const rootStyles = getComputedStyle(document.documentElement);
    const primaryColor = rootStyles.getPropertyValue('--md-sys-color-primary').trim();
    
    if (!primaryColor) {
        console.error(
            `[ThemeValidator] Component "${componentName}" detected missing MD3 variables. ` +
            `Theme may not be properly applied.`
        );
        return false;
    }
    
    return true;
}

/**
 * Validate that a component is not using hardcoded colors
 * @param {HTMLElement} element - The element to check
 * @param {string} componentName - Name of the component for debugging
 * @returns {Object} Validation result with issues found
 */
export function validateNoHardcodedColors(element, componentName) {
    const issues = [];
    
    if (!element) {
        return { valid: true, issues };
    }
    
    // Check inline styles for hardcoded colors
    const inlineStyle = element.getAttribute('style');
    if (inlineStyle) {
        // Check for hex colors
        const hexColorPattern = /#[0-9A-Fa-f]{3,6}/g;
        const hexMatches = inlineStyle.match(hexColorPattern);
        if (hexMatches) {
            issues.push({
                type: 'hardcoded-color',
                element: componentName,
                colors: hexMatches,
                suggestion: 'Use CSS variables like var(--md-sys-color-primary) instead'
            });
        }
        
        // Check for rgb/rgba colors
        const rgbPattern = /rgba?\([^)]+\)/g;
        const rgbMatches = inlineStyle.match(rgbPattern);
        if (rgbMatches) {
            issues.push({
                type: 'hardcoded-color',
                element: componentName,
                colors: rgbMatches,
                suggestion: 'Use CSS variables like var(--md-sys-color-primary) instead'
            });
        }
    }
    
    return {
        valid: issues.length === 0,
        issues
    };
}

/**
 * Subscribe a component to theme changes
 * This ensures the component will update when theme changes
 * @param {Function} callback - Function to call when theme changes
 * @param {string} componentName - Name of the component for debugging
 * @returns {Function} Unsubscribe function
 */
export function subscribeToTheme(callback, componentName) {
    if (!validateThemeContext(componentName)) {
        console.warn(
            `[ThemeValidator] Component "${componentName}" is subscribing to theme ` +
            `but theme context validation failed. Component may not work correctly.`
        );
    }
    
    return themeProvider.subscribe(callback);
}

/**
 * Get current theme state for a component
 * @param {string} componentName - Name of the component for debugging
 * @returns {Object} Current theme state or null if not available
 */
export function getThemeState(componentName) {
    if (!validateThemeContext(componentName)) {
        return null;
    }
    
    return themeProvider.getState();
}

/**
 * Run comprehensive theme validation for a page
 * This should be called on page load to ensure theme is properly set up
 * @param {string} pageName - Name of the page for debugging
 * @returns {Object} Validation result with all issues found
 */
export function validatePageTheme(pageName) {
    const issues = [];
    
    // Check if ThemeProvider is initialized
    if (!themeProvider.initialized) {
        issues.push({
            severity: 'error',
            type: 'not-initialized',
            message: 'ThemeProvider not initialized on this page',
            fix: 'Add themeProvider.initialize() at page startup'
        });
    }
    
    // Check for MD3 variables
    const validation = themeProvider.validateThemeVariables();
    if (!validation.valid) {
        validation.errors.forEach(error => {
            issues.push({
                severity: 'error',
                type: 'missing-variable',
                message: error,
                fix: 'Ensure theme CSS files are loaded and theme is applied'
            });
        });
    }
    
    validation.warnings.forEach(warning => {
        issues.push({
            severity: 'warning',
            type: 'theme-warning',
            message: warning,
            fix: 'Check theme initialization order'
        });
    });
    
    // Check for legacy theme.js calls
    // This would require code analysis, so we just log a reminder
    if (issues.length === 0) {
        console.log(`✅ [ThemeValidator] Page "${pageName}" theme validation passed`);
    } else {
        console.error(`❌ [ThemeValidator] Page "${pageName}" has theme issues:`, issues);
    }
    
    return {
        valid: issues.filter(i => i.severity === 'error').length === 0,
        issues
    };
}

/**
 * Create a theme-aware component wrapper
 * This is a helper to ensure components always check for theme context
 * @param {string} componentName - Name of the component
 * @param {Function} initFunction - Component initialization function
 * @returns {Function} Wrapped initialization function
 */
export function createThemeAwareComponent(componentName, initFunction) {
    return function(...args) {
        // Validate theme context before initializing component
        if (!validateThemeContext(componentName)) {
            console.error(
                `[ThemeValidator] Cannot initialize component "${componentName}" ` +
                `without proper theme context`
            );
            return null;
        }
        
        // Call the original init function
        return initFunction(...args);
    };
}

/**
 * Check if an element is using MD3 design tokens
 * @param {HTMLElement} element - Element to check
 * @returns {Object} Information about MD3 token usage
 */
export function checkMD3TokenUsage(element) {
    if (!element) {
        return { usingMD3: false, tokens: [] };
    }
    
    const computedStyle = getComputedStyle(element);
    const md3Tokens = [];
    
    // Check common properties for MD3 variables
    const properties = ['color', 'background-color', 'border-color', 'fill'];
    
    properties.forEach(prop => {
        const value = computedStyle.getPropertyValue(prop);
        if (value && value.includes('--md-')) {
            md3Tokens.push({ property: prop, token: value });
        }
    });
    
    return {
        usingMD3: md3Tokens.length > 0,
        tokens: md3Tokens
    };
}

export default {
    validateThemeContext,
    validateNoHardcodedColors,
    subscribeToTheme,
    getThemeState,
    validatePageTheme,
    createThemeAwareComponent,
    checkMD3TokenUsage
};
