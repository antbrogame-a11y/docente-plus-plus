// theme.js - Theme management for Docente++

const THEME_STORAGE_KEY = 'docente-plus-plus-theme';
const THEME_COLOR_STORAGE_KEY = 'docente-plus-plus-theme-color';
const THEME_AUTO = 'auto';
const THEME_LIGHT = 'light';
const THEME_DARK = 'dark';

// Material Design 3 Expressive Color Palettes
// Following MD3 Expressive guidelines with vibrant, expressive colors
const COLOR_PALETTES = {
    lilac: {
        name: 'Lilla',
        light: { 
            primary: '#8657FF', 
            primaryContainer: '#E7DEFF', 
            onPrimary: '#FFFFFF', 
            onPrimaryContainer: '#20005B',
            secondary: '#6E5EFF',
            secondaryContainer: '#E6E0FF',
            onSecondary: '#FFFFFF',
            onSecondaryContainer: '#1B1144',
            tertiary: '#FF7AC6',
            tertiaryContainer: '#FFD8EC',
            onTertiary: '#381326',
            onTertiaryContainer: '#3B1020'
        },
        dark: { 
            primary: '#CDB6FF', 
            primaryContainer: '#4A2E78', 
            onPrimary: '#2B1733', 
            onPrimaryContainer: '#F0E6FF',
            secondary: '#C9BDFF',
            secondaryContainer: '#4A3A8F',
            onSecondary: '#2A1B5F',
            onSecondaryContainer: '#E9E1FF',
            tertiary: '#FFB1D8',
            tertiaryContainer: '#6B2E50',
            onTertiary: '#4A1E35',
            onTertiaryContainer: '#FFE0F0'
        }
    },
    teal: {
        name: 'Teal',
        light: { 
            primary: '#00BFA5', 
            primaryContainer: '#B2DFDB', 
            onPrimary: '#FFFFFF', 
            onPrimaryContainer: '#004D40',
            secondary: '#26A69A',
            secondaryContainer: '#B2DFDB',
            onSecondary: '#FFFFFF',
            onSecondaryContainer: '#004D40',
            tertiary: '#26C6DA',
            tertiaryContainer: '#B2EBF2',
            onTertiary: '#006064',
            onTertiaryContainer: '#00363A'
        },
        dark: { 
            primary: '#64FFDA', 
            primaryContainer: '#00695C', 
            onPrimary: '#004D40', 
            onPrimaryContainer: '#E0F2F1',
            secondary: '#80CBC4',
            secondaryContainer: '#00796B',
            onSecondary: '#004D40',
            onSecondaryContainer: '#E0F2F1',
            tertiary: '#80DEEA',
            tertiaryContainer: '#00838F',
            onTertiary: '#004D56',
            onTertiaryContainer: '#E0F7FA'
        }
    },
    orange: {
        name: 'Arancione',
        light: { 
            primary: '#FF6F00', 
            primaryContainer: '#FFE0B2', 
            onPrimary: '#FFFFFF', 
            onPrimaryContainer: '#E65100',
            secondary: '#FF9800',
            secondaryContainer: '#FFE0B2',
            onSecondary: '#FFFFFF',
            onSecondaryContainer: '#E65100',
            tertiary: '#FF5722',
            tertiaryContainer: '#FFCCBC',
            onTertiary: '#FFFFFF',
            onTertiaryContainer: '#BF360C'
        },
        dark: { 
            primary: '#FFB74D', 
            primaryContainer: '#F57C00', 
            onPrimary: '#E65100', 
            onPrimaryContainer: '#FFF3E0',
            secondary: '#FFCC80',
            secondaryContainer: '#FB8C00',
            onSecondary: '#E65100',
            onSecondaryContainer: '#FFF3E0',
            tertiary: '#FF8A65',
            tertiaryContainer: '#E64A19',
            onTertiary: '#BF360C',
            onTertiaryContainer: '#FBE9E7'
        }
    },
    purple: {
        name: 'Viola',
        light: { 
            primary: '#6750A4', 
            primaryContainer: '#EADDFF', 
            onPrimary: '#FFFFFF', 
            onPrimaryContainer: '#21005D',
            secondary: '#625B71',
            secondaryContainer: '#E8DEF8',
            onSecondary: '#FFFFFF',
            onSecondaryContainer: '#1D192B',
            tertiary: '#7D5260',
            tertiaryContainer: '#FFD8E4',
            onTertiary: '#FFFFFF',
            onTertiaryContainer: '#31111D'
        },
        dark: { 
            primary: '#D0BCFF', 
            primaryContainer: '#4F378B', 
            onPrimary: '#371E73', 
            onPrimaryContainer: '#EADDFF',
            secondary: '#CCC2DC',
            secondaryContainer: '#4A4458',
            onSecondary: '#332D41',
            onSecondaryContainer: '#E8DEF8',
            tertiary: '#EFB8C8',
            tertiaryContainer: '#633B48',
            onTertiary: '#492532',
            onTertiaryContainer: '#FFD8E4'
        }
    },
    lilla: {
        name: 'Lilla',
        light: { primary: '#9C27B0', primaryContainer: '#F3E5F5', onPrimary: '#FFFFFF', onPrimaryContainer: '#4A148C' },
        dark: { primary: '#CE93D8', primaryContainer: '#6A1B9A', onPrimary: '#4A148C', onPrimaryContainer: '#F3E5F5' }
    },
    blue: {
        name: 'Blu',
        light: { 
            primary: '#0061A4', 
            primaryContainer: '#D1E4FF', 
            onPrimary: '#FFFFFF', 
            onPrimaryContainer: '#001D36',
            secondary: '#535F70',
            secondaryContainer: '#D7E3F7',
            onSecondary: '#FFFFFF',
            onSecondaryContainer: '#101C2B',
            tertiary: '#6B5778',
            tertiaryContainer: '#F2DAFF',
            onTertiary: '#FFFFFF',
            onTertiaryContainer: '#251431'
        },
        dark: { 
            primary: '#9ECAFF', 
            primaryContainer: '#00497D', 
            onPrimary: '#003258', 
            onPrimaryContainer: '#D1E4FF',
            secondary: '#BBC7DB',
            secondaryContainer: '#3C4858',
            onSecondary: '#253140',
            onSecondaryContainer: '#D7E3F7',
            tertiary: '#D6BEE4',
            tertiaryContainer: '#523F5F',
            onTertiary: '#3B2948',
            onTertiaryContainer: '#F2DAFF'
        }
    },
    teal: {
        name: 'Teal',
        light: { primary: '#00796B', primaryContainer: '#B2DFDB', onPrimary: '#FFFFFF', onPrimaryContainer: '#004D40' },
        dark: { primary: '#4DB6AC', primaryContainer: '#00695C', onPrimary: '#004D40', onPrimaryContainer: '#E0F2F1' }
    },
    green: {
        name: 'Verde',
        light: { 
            primary: '#006E1C', 
            primaryContainer: '#A0F57C', 
            onPrimary: '#FFFFFF', 
            onPrimaryContainer: '#002204',
            secondary: '#53634E',
            secondaryContainer: '#D6E8CD',
            onSecondary: '#FFFFFF',
            onSecondaryContainer: '#111F0F',
            tertiary: '#386569',
            tertiaryContainer: '#BCEBEF',
            onTertiary: '#FFFFFF',
            onTertiaryContainer: '#002023'
        },
        dark: { 
            primary: '#85D962', 
            primaryContainer: '#005310', 
            onPrimary: '#00390A', 
            onPrimaryContainer: '#A0F57C',
            secondary: '#BACDAF',
            secondaryContainer: '#3C4B38',
            onSecondary: '#253423',
            onSecondaryContainer: '#D6E8CD',
            tertiary: '#A0CFD3',
            tertiaryContainer: '#1F4D51',
            onTertiary: '#003739',
            onTertiaryContainer: '#BCEBEF'
        }
    },
    red: {
        name: 'Rosso',
        light: { 
            primary: '#BA1A1A', 
            primaryContainer: '#FFDAD6', 
            onPrimary: '#FFFFFF', 
            onPrimaryContainer: '#410002',
            secondary: '#775652',
            secondaryContainer: '#FFDAD6',
            onSecondary: '#FFFFFF',
            onSecondaryContainer: '#2C1512',
            tertiary: '#705C2E',
            tertiaryContainer: '#FBDFA6',
            onTertiary: '#FFFFFF',
            onTertiaryContainer: '#251A00'
        },
        dark: { 
            primary: '#FFB4AB', 
            primaryContainer: '#93000A', 
            onPrimary: '#690005', 
            onPrimaryContainer: '#FFDAD6',
            secondary: '#E7BDB7',
            secondaryContainer: '#5F3F3B',
            onSecondary: '#442925',
            onSecondaryContainer: '#FFDAD6',
            tertiary: '#DEC48B',
            tertiaryContainer: '#574419',
            onTertiary: '#3E2D04',
            onTertiaryContainer: '#FBDFA6'
        }
    },
    indigo: {
        name: 'Indigo',
        light: { 
            primary: '#3F51B5', 
            primaryContainer: '#C5CAE9', 
            onPrimary: '#FFFFFF', 
            onPrimaryContainer: '#1A237E',
            secondary: '#5C6BC0',
            secondaryContainer: '#C5CAE9',
            onSecondary: '#FFFFFF',
            onSecondaryContainer: '#1A237E',
            tertiary: '#7986CB',
            tertiaryContainer: '#E8EAF6',
            onTertiary: '#FFFFFF',
            onTertiaryContainer: '#1A237E'
        },
        dark: { 
            primary: '#9FA8DA', 
            primaryContainer: '#283593', 
            onPrimary: '#1A237E', 
            onPrimaryContainer: '#E8EAF6',
            secondary: '#9FA8DA',
            secondaryContainer: '#3949AB',
            onSecondary: '#1A237E',
            onSecondaryContainer: '#E8EAF6',
            tertiary: '#C5CAE9',
            tertiaryContainer: '#5C6BC0',
            onTertiary: '#283593',
            onTertiaryContainer: '#E8EAF6'
        }
    },
    pink: {
        name: 'Rosa',
        light: { 
            primary: '#C2185B', 
            primaryContainer: '#F8BBD0', 
            onPrimary: '#FFFFFF', 
            onPrimaryContainer: '#880E4F',
            secondary: '#E91E63',
            secondaryContainer: '#F8BBD0',
            onSecondary: '#FFFFFF',
            onSecondaryContainer: '#880E4F',
            tertiary: '#F06292',
            tertiaryContainer: '#FCE4EC',
            onTertiary: '#FFFFFF',
            onTertiaryContainer: '#880E4F'
        },
        dark: { 
            primary: '#F48FB1', 
            primaryContainer: '#AD1457', 
            onPrimary: '#880E4F', 
            onPrimaryContainer: '#FCE4EC',
            secondary: '#F48FB1',
            secondaryContainer: '#C2185B',
            onSecondary: '#880E4F',
            onSecondaryContainer: '#FCE4EC',
            tertiary: '#F8BBD0',
            tertiaryContainer: '#E91E63',
            onTertiary: '#AD1457',
            onTertiaryContainer: '#FCE4EC'
        }
    }
};

/**
 * Get all available color palettes
 * @returns {Object} All color palettes
 */
export function getColorPalettes() {
    return COLOR_PALETTES;
}

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
    return localStorage.getItem(THEME_COLOR_STORAGE_KEY) || 'lilac';
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
    
    // Apply all MD3 color variables
    root.style.setProperty('--md-primary', colors.primary);
    root.style.setProperty('--md-primary-container', colors.primaryContainer);
    root.style.setProperty('--md-on-primary', colors.onPrimary);
    root.style.setProperty('--md-on-primary-container', colors.onPrimaryContainer);
    
    root.style.setProperty('--md-secondary', colors.secondary);
    root.style.setProperty('--md-secondary-container', colors.secondaryContainer);
    root.style.setProperty('--md-on-secondary', colors.onSecondary);
    root.style.setProperty('--md-on-secondary-container', colors.onSecondaryContainer);
    
    root.style.setProperty('--md-tertiary', colors.tertiary);
    root.style.setProperty('--md-tertiary-container', colors.tertiaryContainer);
    root.style.setProperty('--md-on-tertiary', colors.onTertiary);
    root.style.setProperty('--md-on-tertiary-container', colors.onTertiaryContainer);
    
    // Also update the sys-color variables used in components
    root.style.setProperty('--md-sys-color-primary', colors.primary);
    root.style.setProperty('--md-sys-color-primary-container', colors.primaryContainer);
    root.style.setProperty('--md-sys-color-on-primary', colors.onPrimary);
    root.style.setProperty('--md-sys-color-on-primary-container', colors.onPrimaryContainer);
    
    root.style.setProperty('--md-sys-color-secondary', colors.secondary);
    root.style.setProperty('--md-sys-color-secondary-container', colors.secondaryContainer);
    root.style.setProperty('--md-sys-color-on-secondary', colors.onSecondary);
    root.style.setProperty('--md-sys-color-on-secondary-container', colors.onSecondaryContainer);
    
    root.style.setProperty('--md-sys-color-tertiary', colors.tertiary);
    root.style.setProperty('--md-sys-color-tertiary-container', colors.tertiaryContainer);
    root.style.setProperty('--md-sys-color-on-tertiary', colors.onTertiary);
    root.style.setProperty('--md-sys-color-on-tertiary-container', colors.onTertiaryContainer);
    
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
                const colorName = COLOR_PALETTES[selectedColor]?.name || selectedColor;
                window.showToast(`Tema ${themeNames[selectedTheme]} con colore ${colorName} applicato`, 'success');
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
