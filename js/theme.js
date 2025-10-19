// theme.js - Theme management for Docente++

const THEME_STORAGE_KEY = 'docente-plus-plus-theme';
const THEME_COLOR_STORAGE_KEY = 'docente-plus-plus-theme-color';
const THEME_AUTO = 'auto';
const THEME_LIGHT = 'light';
const THEME_DARK = 'dark';

// Color palettes for Material Design 3
const COLOR_PALETTES = {
    purple: {
        name: 'Viola',
        light: { primary: '#6750A4', primaryContainer: '#EADDFF', onPrimary: '#FFFFFF', onPrimaryContainer: '#21005D' },
        dark: { primary: '#D0BCFF', primaryContainer: '#4F378B', onPrimary: '#371E73', onPrimaryContainer: '#EADDFF' }
    },
    lilla: {
        name: 'Lilla',
        light: { primary: '#9C27B0', primaryContainer: '#F3E5F5', onPrimary: '#FFFFFF', onPrimaryContainer: '#4A148C' },
        dark: { primary: '#CE93D8', primaryContainer: '#6A1B9A', onPrimary: '#4A148C', onPrimaryContainer: '#F3E5F5' }
    },
    blue: {
        name: 'Blu',
        light: { primary: '#1976D2', primaryContainer: '#BBDEFB', onPrimary: '#FFFFFF', onPrimaryContainer: '#0D47A1' },
        dark: { primary: '#90CAF9', primaryContainer: '#1565C0', onPrimary: '#0D47A1', onPrimaryContainer: '#E3F2FD' }
    },
    teal: {
        name: 'Teal',
        light: { primary: '#00796B', primaryContainer: '#B2DFDB', onPrimary: '#FFFFFF', onPrimaryContainer: '#004D40' },
        dark: { primary: '#4DB6AC', primaryContainer: '#00695C', onPrimary: '#004D40', onPrimaryContainer: '#E0F2F1' }
    },
    green: {
        name: 'Verde',
        light: { primary: '#388E3C', primaryContainer: '#C8E6C9', onPrimary: '#FFFFFF', onPrimaryContainer: '#1B5E20' },
        dark: { primary: '#81C784', primaryContainer: '#2E7D32', onPrimary: '#1B5E20', onPrimaryContainer: '#E8F5E9' }
    },
    orange: {
        name: 'Arancione',
        light: { primary: '#EF6C00', primaryContainer: '#FFE0B2', onPrimary: '#FFFFFF', onPrimaryContainer: '#E65100' },
        dark: { primary: '#FFB74D', primaryContainer: '#F57C00', onPrimary: '#E65100', onPrimaryContainer: '#FFF3E0' }
    },
    pink: {
        name: 'Rosa',
        light: { primary: '#C2185B', primaryContainer: '#F8BBD0', onPrimary: '#FFFFFF', onPrimaryContainer: '#880E4F' },
        dark: { primary: '#F06292', primaryContainer: '#AD1457', onPrimary: '#880E4F', onPrimaryContainer: '#FCE4EC' }
    },
    red: {
        name: 'Rosso',
        light: { primary: '#C62828', primaryContainer: '#FFCDD2', onPrimary: '#FFFFFF', onPrimaryContainer: '#B71C1C' },
        dark: { primary: '#EF5350', primaryContainer: '#B71C1C', onPrimary: '#FFEBEE', onPrimaryContainer: '#FFCDD2' }
    },
    indigo: {
        name: 'Indigo',
        light: { primary: '#303F9F', primaryContainer: '#C5CAE9', onPrimary: '#FFFFFF', onPrimaryContainer: '#1A237E' },
        dark: { primary: '#7986CB', primaryContainer: '#283593', onPrimary: '#1A237E', onPrimaryContainer: '#E8EAF6' }
    }
};

/**
 * Get the current theme preference from localStorage
 * @returns {string} The current theme ('light', 'dark', or 'auto')
 */
export function getThemePreference() {
    return localStorage.getItem(THEME_STORAGE_KEY) || THEME_AUTO;
}

/**
 * Save the theme preference to localStorage
 * @param {string} theme - The theme to save ('light', 'dark', or 'auto')
 */
export function saveThemePreference(theme) {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
}

/**
 * Get the current theme color preference from localStorage
 * @returns {string} The current theme color
 */
export function getThemeColorPreference() {
    return localStorage.getItem(THEME_COLOR_STORAGE_KEY) || 'purple';
}

/**
 * Save the theme color preference to localStorage
 * @param {string} color - The theme color to save
 */
export function saveThemeColorPreference(color) {
    localStorage.setItem(THEME_COLOR_STORAGE_KEY, color);
}

/**
 * Get the system color scheme preference
 * @returns {string} 'light' or 'dark'
 */
function getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return THEME_DARK;
    }
    return THEME_LIGHT;
}

/**
 * Apply color palette to the document
 * @param {string} colorName - The color palette name
 * @param {string} mode - 'light' or 'dark'
 */
function applyColorPalette(colorName, mode) {
    const palette = COLOR_PALETTES[colorName];
    if (!palette) return;
    
    const colors = palette[mode];
    const root = document.documentElement;
    
    // Apply colors as MD3 system properties
    root.style.setProperty('--md-sys-color-primary', colors.primary);
    root.style.setProperty('--md-sys-color-primary-container', colors.primaryContainer);
    root.style.setProperty('--md-sys-color-on-primary', colors.onPrimary);
    root.style.setProperty('--md-sys-color-on-primary-container', colors.onPrimaryContainer);
    
    // Also set legacy properties for backwards compatibility
    root.style.setProperty('--md-primary', colors.primary);
    root.style.setProperty('--md-primary-container', colors.primaryContainer);
    root.style.setProperty('--md-on-primary', colors.onPrimary);
    root.style.setProperty('--md-on-primary-container', colors.onPrimaryContainer);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.setAttribute('content', colors.primary);
    }
}

/**
 * Apply the theme to the document
 * @param {string} theme - The theme to apply ('light', 'dark', or 'auto')
 * @param {string} color - The color palette to apply (optional)
 */
export function applyTheme(theme, color = null) {
    const root = document.documentElement;
    const body = document.body;
    
    // Remove existing theme classes
    root.classList.remove('light-theme', 'dark-theme');
    body.classList.remove('light-theme', 'dark-theme');
    
    let effectiveTheme;
    if (theme === THEME_AUTO) {
        effectiveTheme = getSystemTheme();
    } else {
        effectiveTheme = theme;
    }
    
    // Apply the effective theme
    if (effectiveTheme === THEME_DARK) {
        root.classList.add('dark-theme');
        body.classList.add('dark-theme');
    } else {
        root.classList.add('light-theme');
        body.classList.add('light-theme');
    }
    
    // Apply color palette
    const themeColor = color || getThemeColorPreference();
    applyColorPalette(themeColor, effectiveTheme);
}

/**
 * Initialize the theme system
 */
export function initializeTheme() {
    const savedTheme = getThemePreference();
    const savedColor = getThemeColorPreference();
    applyTheme(savedTheme, savedColor);
    
    // Listen for system theme changes if auto mode is selected
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            const currentTheme = getThemePreference();
            if (currentTheme === THEME_AUTO) {
                applyTheme(THEME_AUTO);
            }
        });
    }
}

/**
 * Update preview with selected theme and color
 * @param {string} theme - The theme mode ('light', 'dark', or 'auto')
 * @param {string} color - The color palette name
 */
function updatePreview(theme, color) {
    const preview = document.getElementById('theme-preview');
    if (!preview) return;
    
    // Determine effective theme
    let effectiveTheme = theme;
    if (theme === THEME_AUTO) {
        effectiveTheme = getSystemTheme();
    }
    
    // Get color palette
    const palette = COLOR_PALETTES[color];
    if (!palette) return;
    
    const colors = palette[effectiveTheme];
    
    // Apply colors to preview container
    preview.style.setProperty('--md-sys-color-primary', colors.primary);
    preview.style.setProperty('--md-sys-color-primary-container', colors.primaryContainer);
    preview.style.setProperty('--md-sys-color-on-primary', colors.onPrimary);
    preview.style.setProperty('--md-sys-color-on-primary-container', colors.onPrimaryContainer);
}

/**
 * Setup the theme picker dialog
 */
export function setupThemePicker() {
    const dialog = document.getElementById('theme-picker-dialog');
    const openButton = document.getElementById('theme-picker-btn');
    const openButtonSidebar = document.getElementById('theme-picker-btn-sidebar');
    const openButtonSettings = document.getElementById('theme-picker-btn-settings');
    const form = document.getElementById('theme-picker-form');
    const cancelBtn = document.getElementById('theme-cancel-btn');
    const applyBtn = document.getElementById('theme-apply-btn');
    
    if (!dialog || !form) {
        console.error('Theme picker dialog or form not found');
        return;
    }
    
    if (!openButton && !openButtonSidebar && !openButtonSettings) {
        console.warn('No theme picker buttons found, but dialog exists');
    }
    
    // Function to open the dialog
    const openDialog = () => {
        // Set current theme in radio buttons
        const currentTheme = getThemePreference();
        const radioToCheck = document.getElementById(`theme-${currentTheme}`);
        if (radioToCheck) {
            radioToCheck.checked = true;
        }
        
        // Set current color in radio buttons
        const currentColor = getThemeColorPreference();
        const colorRadioToCheck = document.getElementById(`color-${currentColor}`);
        if (colorRadioToCheck) {
            colorRadioToCheck.checked = true;
        }
        
        // Update preview with current settings
        updatePreview(currentTheme, currentColor);
        
        dialog.style.display = 'flex';
        
        // Focus the apply button
        setTimeout(() => applyBtn.focus(), 100);
    };
    
    // Listen for theme mode changes to update preview
    const themeRadios = form.querySelectorAll('input[name="theme"]');
    themeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const selectedColor = form.querySelector('input[name="themeColor"]:checked');
            if (selectedColor) {
                updatePreview(radio.value, selectedColor.value);
            }
        });
    });
    
    // Listen for color changes to update preview
    const colorRadios = form.querySelectorAll('input[name="themeColor"]');
    colorRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const selectedTheme = form.querySelector('input[name="theme"]:checked');
            if (selectedTheme) {
                updatePreview(selectedTheme.value, radio.value);
            }
        });
    });
    
    // Open dialog when button is clicked (original button in header, if exists)
    if (openButton) {
        openButton.addEventListener('click', openDialog);
    }
    
    // Open dialog when sidebar button is clicked
    if (openButtonSidebar) {
        openButtonSidebar.addEventListener('click', openDialog);
    }
    
    // Open dialog when settings button is clicked
    if (openButtonSettings) {
        openButtonSettings.addEventListener('click', openDialog);
    }
    
    // Close dialog function
    const closeDialog = () => {
        dialog.style.display = 'none';
    };
    
    // Handle cancel button
    cancelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeDialog();
    });
    
    // Handle form submit (apply button)
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get selected theme from radio buttons
        const selectedThemeRadio = form.querySelector('input[name="theme"]:checked');
        const selectedColorRadio = form.querySelector('input[name="themeColor"]:checked');
        
        if (selectedThemeRadio) {
            const selectedTheme = selectedThemeRadio.value;
            saveThemePreference(selectedTheme);
            
            const selectedColor = selectedColorRadio ? selectedColorRadio.value : 'purple';
            saveThemeColorPreference(selectedColor);
            
            applyTheme(selectedTheme, selectedColor);
            
            // Show confirmation toast
            if (window.showToast) {
                const themeNames = {
                    light: 'Chiaro',
                    dark: 'Scuro',
                    auto: 'Automatico'
                };
                const colorNames = {
                    purple: 'Viola',
                    lilla: 'Lilla',
                    blue: 'Blu',
                    teal: 'Teal',
                    green: 'Verde',
                    orange: 'Arancione',
                    pink: 'Rosa',
                    red: 'Rosso',
                    indigo: 'Indigo'
                };
                window.showToast(`Tema ${themeNames[selectedTheme]} con colore ${colorNames[selectedColor]} applicato`, 'success');
            }
        }
        
        closeDialog();
    });
    
    // Close on backdrop click
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
            closeDialog();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && dialog.style.display === 'flex') {
            closeDialog();
        }
    });
}
