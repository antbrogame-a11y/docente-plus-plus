/**
 * Breadcrumbs Component - JavaScript Module
 * Manages breadcrumb navigation with router integration
 */

// Breadcrumb configuration for each page
const BREADCRUMB_CONFIG = {
    home: {
        label: 'Home',
        icon: 'home',
        showBreadcrumbs: false // Hide breadcrumbs on home
    },
    lessons: {
        label: 'Lezioni',
        icon: 'menu_book',
        parent: 'home'
    },
    students: {
        label: 'Studenti',
        icon: 'group',
        parent: 'home'
    },
    classes: {
        label: 'Classi',
        icon: 'school',
        parent: 'home'
    },
    activities: {
        label: 'Attività',
        icon: 'assignment',
        parent: 'home'
    },
    evaluations: {
        label: 'Valutazioni',
        icon: 'assessment',
        parent: 'home'
    },
    schedule: {
        label: 'Orario',
        icon: 'calendar_month',
        parent: 'home'
    },
    agenda: {
        label: 'Agenda',
        icon: 'event',
        parent: 'home'
    },
    aiAssistant: {
        label: 'Assistente IA',
        icon: 'psychology',
        parent: 'home'
    },
    documentImport: {
        label: 'Importa Documenti',
        icon: 'upload_file',
        parent: 'home'
    },
    settings: {
        label: 'Impostazioni',
        icon: 'settings',
        parent: 'home'
    }
};

/**
 * Initialize breadcrumbs component
 */
export function initBreadcrumbs() {
    const container = document.getElementById('breadcrumbs-container');
    if (!container) {
        console.warn('Breadcrumbs container not found');
        return;
    }
    
    // Listen for navigation changes
    window.addEventListener('breadcrumb-update', handleBreadcrumbUpdate);
    
    // Initial render
    updateBreadcrumbs('home');
}

/**
 * Update breadcrumbs based on current page and params
 * @param {string} currentPage - Current page identifier
 * @param {Object} params - Optional query parameters
 */
export function updateBreadcrumbs(currentPage, params = {}) {
    const container = document.getElementById('breadcrumbs-container');
    if (!container) {
        console.warn('Breadcrumbs container not found');
        return;
    }
    
    const config = BREADCRUMB_CONFIG[currentPage];
    
    // Hide breadcrumbs on home or if config says so
    if (!config || config.showBreadcrumbs === false || currentPage === 'home') {
        container.classList.add('hidden');
        return;
    }
    
    container.classList.remove('hidden');
    
    // Build breadcrumb trail
    const trail = buildBreadcrumbTrail(currentPage, params);
    
    // Render breadcrumbs
    renderBreadcrumbs(trail);
}

/**
 * Build breadcrumb trail from current page back to home
 * @param {string} currentPage - Current page identifier
 * @param {Object} params - Optional query parameters
 * @returns {Array} Breadcrumb trail array
 */
function buildBreadcrumbTrail(currentPage, params = {}) {
    const trail = [];
    let page = currentPage;
    
    // Build trail by following parent chain
    while (page && BREADCRUMB_CONFIG[page]) {
        const config = BREADCRUMB_CONFIG[page];
        trail.unshift({
            page,
            label: config.label,
            icon: config.icon,
            isCurrent: page === currentPage
        });
        page = config.parent;
    }
    
    // Add query param info if present (e.g., for In Classe)
    if (params.class || params.subject) {
        trail.push({
            page: currentPage,
            label: params.class || params.subject || 'Dettaglio',
            icon: null,
            isCurrent: true,
            isSubsection: true
        });
    }
    
    return trail;
}

/**
 * Render breadcrumbs HTML
 * @param {Array} trail - Breadcrumb trail array
 */
function renderBreadcrumbs(trail) {
    const breadcrumbsList = document.getElementById('breadcrumbs-list');
    if (!breadcrumbsList) {
        console.warn('Breadcrumbs list element not found');
        return;
    }
    
    breadcrumbsList.innerHTML = '';
    
    trail.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'breadcrumb-item';
        
        if (item.isCurrent) {
            // Current page - not clickable
            li.innerHTML = `
                <span class="breadcrumb-current" aria-current="page">
                    ${item.icon ? `<span class="material-symbols-outlined">${item.icon}</span>` : ''}
                    ${item.label}
                </span>
            `;
        } else {
            // Clickable link
            li.innerHTML = `
                <a href="#${item.page}" class="breadcrumb-link" data-page="${item.page}">
                    ${item.icon ? `<span class="material-symbols-outlined">${item.icon}</span>` : ''}
                    ${item.label}
                </a>
            `;
        }
        
        breadcrumbsList.appendChild(li);
        
        // Add separator (except after last item)
        if (index < trail.length - 1) {
            const separator = document.createElement('li');
            separator.className = 'breadcrumb-separator';
            separator.setAttribute('aria-hidden', 'true');
            separator.innerHTML = '<span class="material-symbols-outlined">chevron_right</span>';
            breadcrumbsList.appendChild(separator);
        }
    });
    
    // Add click handlers
    breadcrumbsList.querySelectorAll('.breadcrumb-link').forEach(link => {
        link.addEventListener('click', handleBreadcrumbClick);
    });
}

/**
 * Handle breadcrumb link click
 * @param {Event} e - Click event
 */
function handleBreadcrumbClick(e) {
    e.preventDefault();
    const page = e.currentTarget.dataset.page;
    
    // Dispatch navigation event
    window.dispatchEvent(new CustomEvent('navigate-to-page', {
        detail: { page }
    }));
}

/**
 * Handle breadcrumb update event
 * @param {CustomEvent} e - Breadcrumb update event
 */
function handleBreadcrumbUpdate(e) {
    const { page, params } = e.detail || {};
    if (page) {
        updateBreadcrumbs(page, params);
    }
}

/**
 * Trigger breadcrumb update (called by navigation system)
 * @param {string} page - Page to navigate to
 * @param {Object} params - Optional query parameters
 */
export function triggerBreadcrumbUpdate(page, params = {}) {
    window.dispatchEvent(new CustomEvent('breadcrumb-update', {
        detail: { page, params }
    }));
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBreadcrumbs);
} else {
    initBreadcrumbs();
}
