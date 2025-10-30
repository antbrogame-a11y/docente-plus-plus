/**
 * ThemeSwitcher - UI component for theme and color selection
 * Provides a user-friendly interface to change theme settings
 */

import themeProvider from './ThemeProvider.js';

/**
 * Create the theme switcher UI element
 * @param {string} containerId - ID of the container element
 * @returns {HTMLElement} The theme switcher element
 */
export function createThemeSwitcher(containerId = 'theme-switcher-container') {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Theme switcher container not found:', containerId);
        return null;
    }

    const state = themeProvider.getState();
    const palettes = state.palettes;

    // Create theme switcher HTML
    const switcherHTML = `
        <div class="theme-switcher">
            <div class="theme-switcher-section">
                <label class="theme-switcher-label">
                    <span class="material-symbols-outlined">brightness_medium</span>
                    Tema
                </label>
                <div class="theme-mode-options">
                    <button 
                        class="theme-option ${state.theme === 'light' ? 'active' : ''}" 
                        data-theme="light"
                        aria-label="Tema chiaro"
                        title="Tema chiaro">
                        <span class="material-symbols-outlined">light_mode</span>
                        <span class="theme-option-label">Chiaro</span>
                    </button>
                    <button 
                        class="theme-option ${state.theme === 'dark' ? 'active' : ''}" 
                        data-theme="dark"
                        aria-label="Tema scuro"
                        title="Tema scuro">
                        <span class="material-symbols-outlined">dark_mode</span>
                        <span class="theme-option-label">Scuro</span>
                    </button>
                    <button 
                        class="theme-option ${state.theme === 'auto' ? 'active' : ''}" 
                        data-theme="auto"
                        aria-label="Tema automatico"
                        title="Tema automatico (segue il sistema)">
                        <span class="material-symbols-outlined">schedule</span>
                        <span class="theme-option-label">Auto</span>
                    </button>
                </div>
            </div>

            <div class="theme-switcher-section">
                <label class="theme-switcher-label">
                    <span class="material-symbols-outlined">palette</span>
                    Colore Base
                </label>
                <div class="theme-color-options">
                    ${Object.keys(palettes).map(colorKey => {
                        const palette = palettes[colorKey];
                        const isActive = state.color === colorKey;
                        return `
                            <button 
                                class="color-option ${isActive ? 'active' : ''}" 
                                data-color="${colorKey}"
                                aria-label="Colore ${palette.name}"
                                title="${palette.name}"
                                style="--preview-color: ${palette[state.effectiveTheme].primary}">
                                <span class="color-preview"></span>
                                <span class="color-name">${palette.name}</span>
                            </button>
                        `;
                    }).join('')}
                </div>
            </div>

            <div class="theme-switcher-preview">
                <div class="preview-card">
                    <div class="preview-header">
                        <span class="material-symbols-outlined">preview</span>
                        Anteprima
                    </div>
                    <div class="preview-content">
                        <button class="btn-preview btn-primary">Pulsante Primario</button>
                        <button class="btn-preview btn-secondary">Pulsante Secondario</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = switcherHTML;

    // Add event listeners
    setupEventListeners(container);

    // Subscribe to theme changes to update UI
    themeProvider.subscribe((newState) => {
        updateSwitcherUI(container, newState);
    });

    return container.querySelector('.theme-switcher');
}

/**
 * Setup event listeners for the theme switcher
 * @param {HTMLElement} container - The container element
 */
function setupEventListeners(container) {
    // Theme mode buttons
    const themeButtons = container.querySelectorAll('[data-theme]');
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.dataset.theme;
            themeProvider.setTheme(theme);
        });
    });

    // Color palette buttons
    const colorButtons = container.querySelectorAll('[data-color]');
    colorButtons.forEach(button => {
        button.addEventListener('click', () => {
            const color = button.dataset.color;
            themeProvider.setColor(color);
        });
    });
}

/**
 * Update the theme switcher UI when theme changes
 * @param {HTMLElement} container - The container element
 * @param {Object} state - The new theme state
 */
function updateSwitcherUI(container, state) {
    // Update active theme button
    const themeButtons = container.querySelectorAll('[data-theme]');
    themeButtons.forEach(button => {
        if (button.dataset.theme === state.theme) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });

    // Update active color button
    const colorButtons = container.querySelectorAll('[data-color]');
    colorButtons.forEach(button => {
        if (button.dataset.color === state.color) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
        
        // Update color preview
        const palette = state.palettes[button.dataset.color];
        if (palette) {
            button.style.setProperty('--preview-color', palette[state.effectiveTheme].primary);
        }
    });
}

/**
 * Create a compact theme switcher for settings page
 * @param {string} containerId - ID of the container element
 * @returns {HTMLElement} The compact theme switcher element
 */
export function createCompactThemeSwitcher(containerId = 'compact-theme-switcher') {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Compact theme switcher container not found:', containerId);
        return null;
    }

    const state = themeProvider.getState();
    const palettes = state.palettes;

    const switcherHTML = `
        <div class="compact-theme-switcher">
            <div class="form-group">
                <label for="theme-mode-select">Modalità Tema</label>
                <select id="theme-mode-select" class="form-control">
                    <option value="light" ${state.theme === 'light' ? 'selected' : ''}>Chiaro</option>
                    <option value="dark" ${state.theme === 'dark' ? 'selected' : ''}>Scuro</option>
                    <option value="auto" ${state.theme === 'auto' ? 'selected' : ''}>Automatico</option>
                </select>
            </div>

            <div class="form-group">
                <label for="theme-color-select">Colore Base</label>
                <select id="theme-color-select" class="form-control">
                    ${Object.keys(palettes).map(colorKey => {
                        const palette = palettes[colorKey];
                        return `<option value="${colorKey}" ${state.color === colorKey ? 'selected' : ''}>${palette.name}</option>`;
                    }).join('')}
                </select>
            </div>
        </div>
    `;

    container.innerHTML = switcherHTML;

    // Add event listeners
    const themeSelect = container.querySelector('#theme-mode-select');
    const colorSelect = container.querySelector('#theme-color-select');

    themeSelect.addEventListener('change', (e) => {
        themeProvider.setTheme(e.target.value);
    });

    colorSelect.addEventListener('change', (e) => {
        themeProvider.setColor(e.target.value);
    });

    // Subscribe to theme changes
    themeProvider.subscribe((newState) => {
        themeSelect.value = newState.theme;
        colorSelect.value = newState.color;
    });

    return container.querySelector('.compact-theme-switcher');
}

/**
 * Initialize theme switcher in the app
 * This is called from app initialization
 */
export function initThemeSwitcher() {
    // Check if there's a theme switcher container in the page
    const mainContainer = document.getElementById('theme-switcher-container');
    const compactContainer = document.getElementById('compact-theme-switcher');

    if (mainContainer) {
        createThemeSwitcher('theme-switcher-container');
    }

    if (compactContainer) {
        createCompactThemeSwitcher('compact-theme-switcher');
    }
}

export default {
    createThemeSwitcher,
    createCompactThemeSwitcher,
    initThemeSwitcher
};
