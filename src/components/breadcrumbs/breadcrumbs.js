/**
 * Breadcrumbs Component
 * Provides navigation context and hierarchy
 * Mobile-first, accessible breadcrumb navigation
 */

export class Breadcrumbs {
  constructor(containerId = 'breadcrumb-container') {
    this.containerId = containerId;
    this.container = null;
    this.items = [];
  }

  /**
   * Initialize the breadcrumb component
   * @param {Object} options - Configuration options
   */
  init(options = {}) {
    this.container = document.getElementById(this.containerId);
    
    if (!this.container) {
      console.warn(`Breadcrumb container with id "${this.containerId}" not found`);
      return false;
    }

    // Set default options
    this.options = {
      separator: '/',
      maxItems: options.maxItems || 5,
      homeLabel: options.homeLabel || 'Home',
      homeUrl: options.homeUrl || 'index.html',
      ...options
    };

    console.log('Breadcrumbs component initialized');
    return true;
  }

  /**
   * Set breadcrumb items
   * @param {Array} items - Array of breadcrumb items {label, url, current}
   */
  setItems(items) {
    if (!Array.isArray(items)) {
      console.error('Breadcrumb items must be an array');
      return;
    }

    this.items = items;
    this.render();
  }

  /**
   * Add a breadcrumb item
   * @param {Object} item - Breadcrumb item {label, url, current}
   */
  addItem(item) {
    if (!item || !item.label) {
      console.error('Invalid breadcrumb item');
      return;
    }

    // Remove 'current' from all existing items
    this.items.forEach(i => i.current = false);

    this.items.push(item);
    this.render();
  }

  /**
   * Remove the last breadcrumb item
   */
  popItem() {
    if (this.items.length > 0) {
      this.items.pop();
      if (this.items.length > 0) {
        this.items[this.items.length - 1].current = true;
      }
      this.render();
    }
  }

  /**
   * Clear all breadcrumb items
   */
  clear() {
    this.items = [];
    this.render();
  }

  /**
   * Render the breadcrumb navigation
   */
  render() {
    if (!this.container) {
      console.warn('Cannot render: container not found');
      return;
    }

    // Clear existing content
    this.container.innerHTML = '';

    // If no items, hide the breadcrumb
    if (this.items.length === 0) {
      this.container.style.display = 'none';
      return;
    }

    this.container.style.display = 'flex';

    // Limit items if maxItems is set
    let displayItems = [...this.items];
    if (this.options.maxItems && displayItems.length > this.options.maxItems) {
      // Keep first item, add ellipsis, and keep last items
      displayItems = [
        displayItems[0],
        { label: '...', url: null, isEllipsis: true },
        ...displayItems.slice(-(this.options.maxItems - 2))
      ];
    }

    // Create breadcrumb items
    displayItems.forEach((item, index) => {
      // Create item element
      if (item.current || index === displayItems.length - 1) {
        // Current page - not a link
        const currentElement = document.createElement('span');
        currentElement.className = 'breadcrumb-current';
        currentElement.textContent = item.label;
        currentElement.setAttribute('aria-current', 'page');
        this.container.appendChild(currentElement);
      } else if (item.isEllipsis) {
        // Ellipsis - not clickable
        const ellipsisElement = document.createElement('span');
        ellipsisElement.className = 'breadcrumb-ellipsis';
        ellipsisElement.textContent = item.label;
        ellipsisElement.setAttribute('aria-hidden', 'true');
        this.container.appendChild(ellipsisElement);
      } else {
        // Link to previous page
        const linkElement = document.createElement('a');
        linkElement.className = 'breadcrumb-link';
        linkElement.href = item.url || '#';
        linkElement.textContent = item.label;
        linkElement.setAttribute('aria-label', `Vai a ${item.label}`);
        this.container.appendChild(linkElement);
      }

      // Add separator (except after last item)
      if (index < displayItems.length - 1) {
        const separator = document.createElement('span');
        separator.className = 'breadcrumb-separator';
        separator.textContent = this.options.separator;
        separator.setAttribute('aria-hidden', 'true');
        this.container.appendChild(separator);
      }
    });
  }

  /**
   * Update breadcrumb based on current page
   * @param {string} pageName - Current page identifier
   * @param {Object} pageData - Additional page data
   */
  updateForPage(pageName, pageData = {}) {
    const pageConfigs = {
      'home': {
        items: []
      },
      'dashboard': {
        items: [
          { label: 'Home', url: 'index.html' },
          { label: 'Dashboard', current: true }
        ]
      },
      'orario': {
        items: [
          { label: 'Home', url: 'index.html' },
          { label: 'Orario', current: true }
        ]
      },
      'in-classe': {
        items: [
          { label: 'Home', url: 'index.html' },
          { label: 'Orario', url: 'index.html#schedule' },
          { label: pageData.title || 'In Classe', current: true }
        ]
      },
      'planner': {
        items: [
          { label: 'Home', url: 'index.html' },
          { label: 'Piano Didattico', current: true }
        ]
      },
      'agenda': {
        items: [
          { label: 'Home', url: 'index.html' },
          { label: 'Agenda', current: true }
        ]
      }
    };

    const config = pageConfigs[pageName] || pageConfigs['home'];
    this.setItems(config.items);
  }

  /**
   * Get current breadcrumb items
   * @returns {Array} Current breadcrumb items
   */
  getItems() {
    return [...this.items];
  }

  /**
   * Set up back button functionality
   * @param {string} backButtonId - ID of the back button element
   */
  setupBackButton(backButtonId = 'breadcrumb-back-button') {
    const backButton = document.getElementById(backButtonId);
    
    if (!backButton) {
      console.warn(`Back button with id "${backButtonId}" not found`);
      return;
    }

    backButton.addEventListener('click', () => {
      if (this.items.length > 1) {
        // Navigate to previous item
        const previousItem = this.items[this.items.length - 2];
        if (previousItem.url) {
          window.location.href = previousItem.url;
        }
      } else {
        // Navigate to home
        window.location.href = this.options.homeUrl;
      }
    });
  }

  /**
   * Set up home button functionality
   * @param {string} homeButtonId - ID of the home button element
   */
  setupHomeButton(homeButtonId = 'breadcrumb-home-button') {
    const homeButton = document.getElementById(homeButtonId);
    
    if (!homeButton) {
      console.warn(`Home button with id "${homeButtonId}" not found`);
      return;
    }

    homeButton.addEventListener('click', () => {
      window.location.href = this.options.homeUrl;
    });
  }
}

// Export a singleton instance
export const breadcrumbsInstance = new Breadcrumbs();

// Auto-initialize if DOM is ready
if (typeof window !== 'undefined' && document.readyState !== 'loading') {
  breadcrumbsInstance.init();
} else if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    breadcrumbsInstance.init();
  });
}
