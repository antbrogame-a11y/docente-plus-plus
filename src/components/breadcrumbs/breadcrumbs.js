/**
 * Breadcrumbs Component - JavaScript Module
 * Mobile-first, router/query-based breadcrumb generation
 * Accessibility-first with aria-current support
 */

/**
 * Breadcrumbs Manager Class
 * Handles breadcrumb generation, rendering, and navigation
 */
class BreadcrumbsManager {
  constructor(containerId = 'breadcrumbs-container') {
    this.containerId = containerId;
    this.container = null;
    this.currentPath = [];
  }

  /**
   * Initialize breadcrumbs component
   * @param {string} containerId - ID of the container element
   * @returns {boolean} Success status
   */
  init(containerId = null) {
    if (containerId) {
      this.containerId = containerId;
    }
    
    this.container = document.getElementById(this.containerId);
    
    if (!this.container) {
      console.warn(`Breadcrumbs container #${this.containerId} not found`);
      return false;
    }

    this.updateFromCurrentLocation();
    return true;
  }

  /**
   * Update breadcrumbs based on current URL and query parameters
   */
  updateFromCurrentLocation() {
    const path = this.buildPathFromLocation();
    this.render(path);
  }

  /**
   * Build breadcrumb path from current window location
   * @returns {Array} Array of breadcrumb items
   */
  buildPathFromLocation() {
    const path = [];
    
    // Always start with Home
    path.push({
      label: 'Home',
      href: 'index.html',
      isCurrent: false
    });

    // Parse current page from URL
    const currentPage = this.getCurrentPageFromURL();
    
    // If we're on home, just return home (will be hidden or non-interactive)
    if (currentPage === 'home' || currentPage === '' || currentPage === 'index.html') {
      path[0].isCurrent = true;
      return path;
    }

    // Parse query parameters for subsections
    const params = new URLSearchParams(window.location.search);
    
    // Add main section based on current page
    const sectionInfo = this.getSectionInfo(currentPage, params);
    if (sectionInfo) {
      path.push(sectionInfo);
    }

    // Add subsection if available from params
    const subsectionInfo = this.getSubsectionInfo(currentPage, params);
    if (subsectionInfo) {
      path.push(subsectionInfo);
    }

    // Mark the last item as current
    if (path.length > 0) {
      path[path.length - 1].isCurrent = true;
    }

    return path;
  }

  /**
   * Get current page name from URL
   * @returns {string} Current page identifier
   */
  getCurrentPageFromURL() {
    const pathname = window.location.pathname;
    const filename = pathname.split('/').pop();
    
    // Remove .html extension
    return filename.replace('.html', '') || 'home';
  }

  /**
   * Get section information based on page and parameters
   * @param {string} page - Current page name
   * @param {URLSearchParams} params - URL parameters
   * @returns {Object|null} Section breadcrumb item
   */
  getSectionInfo(page, params) {
    const sectionMap = {
      'in-classe': {
        label: 'In Classe',
        href: 'in-classe.html',
        isCurrent: false
      },
      'orario': {
        label: 'Orario',
        href: 'orario.html',
        isCurrent: false
      },
      'schedule': {
        label: 'Orario',
        href: 'schedule.html',
        isCurrent: false
      },
      'students': {
        label: 'Studenti',
        href: 'index.html#students',
        isCurrent: false
      },
      'activities': {
        label: 'Attività',
        href: 'index.html#activities',
        isCurrent: false
      },
      'evaluations': {
        label: 'Valutazioni',
        href: 'index.html#evaluations',
        isCurrent: false
      },
      'settings': {
        label: 'Impostazioni',
        href: 'index.html#settings',
        isCurrent: false
      }
    };

    return sectionMap[page] || null;
  }

  /**
   * Get subsection information from query parameters
   * @param {string} page - Current page name
   * @param {URLSearchParams} params - URL parameters
   * @returns {Object|null} Subsection breadcrumb item
   */
  getSubsectionInfo(page, params) {
    // For In Classe page, check for class and date params
    if (page === 'in-classe') {
      const className = params.get('class');
      const date = params.get('date');
      const time = params.get('time');
      
      if (className || date) {
        const label = this.buildInClasseLabel(className, date, time);
        return {
          label: label,
          href: null, // Current page, no link
          isCurrent: true
        };
      }
    }

    // For Orario page, check for date param
    if (page === 'orario') {
      const date = params.get('date');
      if (date) {
        return {
          label: this.formatDate(date),
          href: null,
          isCurrent: true
        };
      }
    }

    return null;
  }

  /**
   * Build label for In Classe subsection
   * @param {string} className - Class name
   * @param {string} date - Date string
   * @param {string} time - Time string
   * @returns {string} Formatted label
   */
  buildInClasseLabel(className, date, time) {
    const parts = [];
    
    if (className) {
      parts.push(className);
    }
    
    if (date) {
      parts.push(this.formatDate(date));
    }
    
    if (time) {
      parts.push(time);
    }
    
    return parts.join(' - ') || 'Sessione';
  }

  /**
   * Format date string for display
   * @param {string} dateStr - Date string (ISO or other format)
   * @returns {string} Formatted date
   */
  formatDate(dateStr) {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('it-IT', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
      });
    } catch (e) {
      return dateStr;
    }
  }

  /**
   * Render breadcrumbs to container
   * @param {Array} path - Array of breadcrumb items
   */
  render(path) {
    if (!this.container) {
      console.warn('Breadcrumbs container not initialized');
      return;
    }

    this.currentPath = path;

    // Check if we're on home page
    const isHome = path.length === 1 && path[0].label === 'Home';
    
    if (isHome) {
      // Hide breadcrumbs on home page
      this.container.classList.add('breadcrumbs--hidden');
      return;
    } else {
      // Show breadcrumbs on other pages
      this.container.classList.remove('breadcrumbs--hidden');
    }

    // Build HTML
    const listItems = path.map((item, index) => {
      const isLast = index === path.length - 1;
      
      let itemHTML = '<li class="breadcrumbs__item">';
      
      if (item.isCurrent || isLast || !item.href) {
        // Current page - no link, with aria-current
        itemHTML += `<span class="breadcrumbs__current" aria-current="page">${this.escapeHtml(item.label)}</span>`;
      } else {
        // Link to previous page
        itemHTML += `<a href="${this.escapeHtml(item.href)}" class="breadcrumbs__link">${this.escapeHtml(item.label)}</a>`;
      }
      
      // Add separator if not the last item
      if (!isLast) {
        itemHTML += '<span class="breadcrumbs__separator" aria-hidden="true">&gt;</span>';
      }
      
      itemHTML += '</li>';
      
      return itemHTML;
    }).join('');

    this.container.innerHTML = `<ol class="breadcrumbs__list">${listItems}</ol>`;
  }

  /**
   * Manually update breadcrumbs with custom path
   * @param {Array} path - Custom breadcrumb path
   */
  update(path) {
    this.render(path);
  }

  /**
   * Escape HTML to prevent XSS
   * @param {string} str - String to escape
   * @returns {string} Escaped string
   */
  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Show breadcrumbs
   */
  show() {
    if (this.container) {
      this.container.classList.remove('breadcrumbs--hidden');
    }
  }

  /**
   * Hide breadcrumbs
   */
  hide() {
    if (this.container) {
      this.container.classList.add('breadcrumbs--hidden');
    }
  }
}

// Export singleton instance
let breadcrumbsInstance = null;

/**
 * Initialize breadcrumbs component
 * @param {string} containerId - Container element ID
 * @returns {BreadcrumbsManager} Breadcrumbs manager instance
 */
export function initBreadcrumbs(containerId = 'breadcrumbs-container') {
  if (!breadcrumbsInstance) {
    breadcrumbsInstance = new BreadcrumbsManager(containerId);
  }
  breadcrumbsInstance.init(containerId);
  return breadcrumbsInstance;
}

/**
 * Get breadcrumbs instance
 * @returns {BreadcrumbsManager} Breadcrumbs manager instance
 */
export function getBreadcrumbs() {
  if (!breadcrumbsInstance) {
    breadcrumbsInstance = new BreadcrumbsManager();
  }
  return breadcrumbsInstance;
}

/**
 * Update breadcrumbs with custom path
 * @param {Array} path - Custom breadcrumb path
 */
export function updateBreadcrumbs(path) {
  const instance = getBreadcrumbs();
  instance.update(path);
}

// Make available globally for non-module scripts
if (typeof window !== 'undefined') {
  window.BreadcrumbsManager = BreadcrumbsManager;
  window.initBreadcrumbs = initBreadcrumbs;
  window.getBreadcrumbs = getBreadcrumbs;
  window.updateBreadcrumbs = updateBreadcrumbs;
}
