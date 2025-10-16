// js/navigation.js
// Navigation management with breadcrumbs, back button, and history


// Navigation history stack
const navigationHistory = [];
let currentTab = 'home';

// Breadcrumb configuration for each tab
const breadcrumbConfig = {
    home: [{ label: 'Home', tab: 'home', icon: 'home' }],
    lessons: [
        { label: 'Home', tab: 'home', icon: 'home' },
        { label: 'Lezioni', tab: 'lessons', icon: 'menu_book' }
    ],
    students: [
        { label: 'Home', tab: 'home', icon: 'home' },
        { label: 'Studenti', tab: 'students', icon: 'group' }
    ],
    classes: [
        { label: 'Home', tab: 'home', icon: 'home' },
        { label: 'Classi', tab: 'classes', icon: 'school' }
    ],
    activities: [
        { label: 'Home', tab: 'home', icon: 'home' },
        { label: 'Attività', tab: 'activities', icon: 'assignment' }
    ],
    evaluations: [
        { label: 'Home', tab: 'home', icon: 'home' },
        { label: 'Valutazioni', tab: 'evaluations', icon: 'assessment' }
    ],
    schedule: [
        { label: 'Home', tab: 'home', icon: 'home' },
        { label: 'Orario', tab: 'schedule', icon: 'calendar_month' }
    ],
    agenda: [
        { label: 'Home', tab: 'home', icon: 'home' },
        { label: 'Agenda', tab: 'agenda', icon: 'event' }
    ],
    aiAssistant: [
        { label: 'Home', tab: 'home', icon: 'home' },
        { label: 'Assistente IA', tab: 'aiAssistant', icon: 'psychology' }
    ],
    documentImport: [
        { label: 'Home', tab: 'home', icon: 'home' },
        { label: 'Importa Documenti', tab: 'documentImport', icon: 'upload_file' }
    ],
    settings: [
        { label: 'Home', tab: 'home', icon: 'home' },
        { label: 'Impostazioni', tab: 'settings', icon: 'settings' }
    ]
};

/**
 * Initialize navigation system
 */
export function initNavigation() {
    createBreadcrumbContainer();
    setupKeyboardNavigation();
    setupBrowserHistoryManagement();
    
    // Update breadcrumbs on initial load
    updateBreadcrumbs('home');
}

/**
 * Create breadcrumb container in the DOM
 */
function createBreadcrumbContainer() {
    // Check if already exists
    if (document.getElementById('breadcrumb-nav')) return;
    
    const header = document.getElementById('app-header');
    if (!header) return;
    
    const breadcrumbNav = document.createElement('nav');
    breadcrumbNav.id = 'breadcrumb-nav';
    breadcrumbNav.className = 'breadcrumb-nav';
    breadcrumbNav.setAttribute('aria-label', 'Breadcrumb');
    breadcrumbNav.innerHTML = `
        <ol class="breadcrumb-list">
            <!-- Breadcrumbs will be populated here -->
        </ol>
    `;
    
    // Insert after header content
    header.appendChild(breadcrumbNav);
}

/**
 * Update breadcrumbs based on current tab
 * @param {string} tabName - Current tab name
 */
export function updateBreadcrumbs(tabName) {
    const breadcrumbList = document.querySelector('.breadcrumb-list');
    if (!breadcrumbList) return;
    
    const breadcrumbs = breadcrumbConfig[tabName] || breadcrumbConfig.home;
    
    breadcrumbList.innerHTML = breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const ariaCurrent = isLast ? 'aria-current="page"' : '';
        
        if (isLast) {
            return `
                <li class="breadcrumb-item breadcrumb-current" ${ariaCurrent}>
                    <span class="material-symbols-outlined breadcrumb-icon">${crumb.icon}</span>
                    <span class="breadcrumb-label">${crumb.label}</span>
                </li>
            `;
        } else {
            return `
                <li class="breadcrumb-item">
                    <button class="breadcrumb-link" data-tab="${crumb.tab}" aria-label="Vai a ${crumb.label}">
                        <span class="material-symbols-outlined breadcrumb-icon">${crumb.icon}</span>
                        <span class="breadcrumb-label">${crumb.label}</span>
                    </button>
                    <span class="breadcrumb-separator" aria-hidden="true">/</span>
                </li>
            `;
        }
    }).join('');
    
    // Setup click handlers for breadcrumb links
    breadcrumbList.querySelectorAll('.breadcrumb-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = link.dataset.tab;
            if (targetTab && window.app) {
                window.app.switchTab(targetTab);
            }
        });
    });
}

/**
 * Add back button to a tab content
 * @param {string} tabId - Tab content ID
 * @param {string} targetTab - Tab to navigate back to
 */
export function addBackButton(tabId, targetTab = null) {
    const tabContent = document.getElementById(tabId);
    if (!tabContent) return;
    
    // Check if back button already exists
    if (tabContent.querySelector('.back-button')) return;
    
    const backButton = document.createElement('button');
    backButton.className = 'back-button btn-icon-text';
    backButton.setAttribute('aria-label', 'Torna indietro');
    backButton.innerHTML = `
        <span class="material-symbols-outlined">arrow_back</span>
        <span>Indietro</span>
    `;
    
    backButton.addEventListener('click', () => {
        if (targetTab && window.app) {
            window.app.switchTab(targetTab);
        } else {
            navigateBack();
        }
    });
    
    // Insert as first element in tab content
    tabContent.insertBefore(backButton, tabContent.firstChild);
}

/**
 * Navigate to previous page in history
 */
export function navigateBack() {
    if (navigationHistory.length > 0) {
        const previousTab = navigationHistory.pop();
        if (window.app && previousTab) {
            window.app.switchTab(previousTab);
        }
    } else if (window.app) {
        // Default: go to home
        window.app.switchTab('home');
    }
}

/**
 * Push current tab to navigation history
 * @param {string} tabName - Tab name to push
 */
export function pushToHistory(tabName) {
    if (tabName !== currentTab) {
        navigationHistory.push(currentTab);
        currentTab = tabName;
        
        // Limit history to 10 items
        if (navigationHistory.length > 10) {
            navigationHistory.shift();
        }
    }
}

/**
 * Setup keyboard navigation (Tab, Arrow keys, etc.)
 */
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Alt + Left Arrow: Navigate back
        if (e.altKey && e.key === 'ArrowLeft') {
            e.preventDefault();
            window.history.back();
        }
        
        // Alt + H: Go to Home
        if (e.altKey && e.key === 'h') {
            e.preventDefault();
            if (window.app) {
                window.app.switchTab('home');
            }
        }
        
        // Escape: Close modals or go back
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal[style*="display: flex"], .modal[style*="display: block"]');
            if (!openModal && window.app) {
                // If no modal open, navigate back
                navigateBack();
            }
        }
    });
    
    // Make nav items keyboard navigable with arrows
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach((item, index) => {
        item.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                e.preventDefault();
                const nextItem = navItems[index + 1] || navItems[0];
                nextItem.focus();
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const prevItem = navItems[index - 1] || navItems[navItems.length - 1];
                prevItem.focus();
            }
        });
    });
}

/**
 * Setup browser history management with pushState/popState
 */
function setupBrowserHistoryManagement() {
    // Handle browser back/forward buttons
    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.tab) {
            if (window.app) {
                // Delegate to centralized tab switching logic, skipping history push
                const tab = e.state.tab;
                window.app.switchTab(tab, { fromHistory: true });
            }
        }
    });
}

/**
 * Push state to browser history
 * @param {string} tabName - Tab name
 */
export function pushState(tabName) {
    const url = new URL(window.location);
    url.searchParams.set('tab', tabName);
    
    window.history.pushState(
        { tab: tabName },
        '',
        url.toString()
    );
}

/**
 * Get current tab from URL or default
 * @returns {string} Current tab name
 */
export function getCurrentTabFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('tab') || 'home';
}

/**
 * Navigate to home with proper history management
 */
export function navigateToHome() {
    if (window.app) {
        window.app.switchTab('home');
    }
}

/**
 * Check if can navigate back
 * @returns {boolean} True if can navigate back
 */
export function canNavigateBack() {
    return navigationHistory.length > 0;
}

/**
 * Get navigation history
 * @returns {Array} Navigation history
 */
export function getNavigationHistory() {
    return [...navigationHistory];
}

/**
 * Clear navigation history
 */
export function clearNavigationHistory() {
    navigationHistory.length = 0;
    currentTab = 'home';
}
