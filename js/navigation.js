// js/navigation.js
// Navigation utilities for breadcrumb, back button, and browser history management

import { showToast } from './ui.js';

/**
 * Navigation state manager
 * Handles breadcrumb, back navigation, and browser history
 */
class NavigationManager {
    constructor() {
        this.history = [];
        this.currentPage = { name: 'home', title: 'Home', params: null };
        this.breadcrumb = [];
        this.initialized = false;
    }

    /**
     * Initialize navigation system
     */
    init() {
        if (this.initialized) return;
        
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.page) {
                this.navigateToPage(event.state.page, event.state.params, false);
            } else {
                // No state, go to home
                this.navigateToPage('home', null, false);
            }
        });

        // Set initial state
        if (!history.state) {
            history.replaceState({ page: 'home', params: null }, '', '#home');
        }

        this.initialized = true;
        console.log('Navigation manager initialized');
    }

    /**
     * Navigate to a page
     * @param {string} pageName - Page identifier
     * @param {object} params - Optional parameters
     * @param {boolean} updateHistory - Whether to push to browser history
     */
    navigateToPage(pageName, params = null, updateHistory = true) {
        const previousPage = this.currentPage;
        
        this.currentPage = { name: pageName, title: this.getPageTitle(pageName), params };
        
        // Update browser history
        if (updateHistory) {
            const state = { page: pageName, params };
            const url = `#${pageName}${params ? `?${this.serializeParams(params)}` : ''}`;
            history.pushState(state, '', url);
        }

        // Update breadcrumb
        this.updateBreadcrumb();

        // Trigger page switch
        if (window.app && typeof window.app.switchTab === 'function') {
            window.app.switchTab(pageName);
        }

        console.log(`Navigated from ${previousPage.name} to ${pageName}`);
    }

    /**
     * Navigate back to previous page
     */
    goBack() {
        if (history.length > 1) {
            history.back();
        } else {
            // Fallback to home if no history
            this.navigateToHome();
        }
    }

    /**
     * Navigate to home page
     */
    navigateToHome() {
        this.navigateToPage('home', null, true);
    }

    /**
     * Get page title for breadcrumb
     * @param {string} pageName - Page identifier
     * @returns {string} Page title
     */
    getPageTitle(pageName) {
        const titles = {
            home: 'Home',
            inClasse: 'In Classe',
            lessons: 'Lezioni',
            students: 'Studenti',
            classes: 'Classi',
            activities: 'Attività',
            evaluations: 'Valutazioni',
            schedule: 'Orario',
            agenda: 'Agenda',
            aiAssistant: 'Assistente IA',
            documentImport: 'Importa Documenti',
            settings: 'Impostazioni'
        };
        return titles[pageName] || pageName.charAt(0).toUpperCase() + pageName.slice(1);
    }

    /**
     * Update breadcrumb based on current page
     */
    updateBreadcrumb() {
        const breadcrumbContainer = document.getElementById('breadcrumb-container');
        const navigationBar = document.getElementById('navigation-bar');
        
        if (!breadcrumbContainer) return;

        // Hide breadcrumb navigation on homepage
        if (this.currentPage.name === 'home') {
            if (navigationBar) {
                navigationBar.style.display = 'none';
            }
            return;
        }

        // Show navigation bar on internal pages
        if (navigationBar) {
            navigationBar.style.display = 'flex';
        }

        // Build breadcrumb trail
        const trail = [{ name: 'home', title: 'Home' }];
        
        // Add current page
        trail.push(this.currentPage);

        // Generate breadcrumb HTML
        const breadcrumbHTML = trail.map((item, index) => {
            const isLast = index === trail.length - 1;
            const separator = isLast ? '' : '<span class="breadcrumb-separator" aria-hidden="true">/</span>';
            
            if (isLast) {
                return `<span class="breadcrumb-current" aria-current="page">${item.title}</span>`;
            } else {
                return `<a href="#${item.name}" class="breadcrumb-link" onclick="window.navigationManager.navigateToPage('${item.name}', null, true); return false;">${item.title}</a>${separator}`;
            }
        }).join('');

        breadcrumbContainer.innerHTML = breadcrumbHTML;
    }

    /**
     * Show back button
     * @param {boolean} show - Whether to show the button
     */
    toggleBackButton(show) {
        const backButton = document.getElementById('back-button');
        if (backButton) {
            backButton.style.display = show ? 'flex' : 'none';
        }
    }

    /**
     * Serialize parameters for URL
     * @param {object} params - Parameters object
     * @returns {string} Serialized parameters
     */
    serializeParams(params) {
        if (!params) return '';
        return Object.keys(params)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');
    }
}

// Create singleton instance
export const navigationManager = new NavigationManager();

/**
 * Initialize navigation system
 */
export function initNavigation() {
    navigationManager.init();
    createNavigationUI();
}

/**
 * Create navigation UI elements (breadcrumb, back button)
 */
function createNavigationUI() {
    // Check if navigation UI already exists
    if (document.getElementById('navigation-bar')) return;

    // Create navigation bar
    const navBar = document.createElement('div');
    navBar.id = 'navigation-bar';
    navBar.className = 'navigation-bar';
    navBar.setAttribute('role', 'navigation');
    navBar.setAttribute('aria-label', 'Navigazione breadcrumb');
    
    navBar.innerHTML = `
        <button id="back-button" class="back-button" 
                onclick="window.navigationManager.goBack()" 
                aria-label="Torna indietro"
                title="Torna alla pagina precedente">
            <span class="material-symbols-outlined" aria-hidden="true">arrow_back</span>
            <span class="back-button-text">Indietro</span>
        </button>
        <nav id="breadcrumb-container" class="breadcrumb" aria-label="Percorso di navigazione"></nav>
        <button id="home-button" class="home-button" 
                onclick="window.navigationManager.navigateToHome()" 
                aria-label="Vai alla home"
                title="Torna alla pagina principale">
            <span class="material-symbols-outlined" aria-hidden="true">home</span>
            <span class="home-button-text">Home</span>
        </button>
    `;

    // Insert after header
    const header = document.getElementById('app-header');
    if (header && header.nextSibling) {
        header.parentNode.insertBefore(navBar, header.nextSibling);
    } else if (header) {
        header.parentNode.appendChild(navBar);
    } else {
        // Fallback: insert at beginning of body
        document.body.insertBefore(navBar, document.body.firstChild);
    }

    // Initial breadcrumb update
    navigationManager.updateBreadcrumb();
}

/**
 * Navigate to a specific page with optional parameters
 * @param {string} pageName - Page identifier
 * @param {object} params - Optional parameters
 */
export function navigateToPage(pageName, params = null) {
    navigationManager.navigateToPage(pageName, params, true);
}

/**
 * Navigate back to previous page
 */
export function goBack() {
    navigationManager.goBack();
}

/**
 * Navigate to home page
 */
export function goHome() {
    navigationManager.navigateToHome();
}

// Make navigationManager globally accessible for inline event handlers
if (typeof window !== 'undefined') {
    window.navigationManager = navigationManager;
}
