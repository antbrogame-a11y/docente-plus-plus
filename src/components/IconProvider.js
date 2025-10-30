/**
 * IconProvider - Centralized icon management
 * Provides a unified interface for using Material Symbols icons throughout the app
 */

class IconProvider {
    constructor() {
        this.iconSet = 'material-symbols-outlined';
        this.defaultSize = 24;
        this.cache = new Map();
    }

    /**
     * Create an icon element
     * @param {string} name - Icon name (e.g., 'home', 'settings')
     * @param {Object} options - Icon options
     * @param {number} options.size - Icon size in pixels
     * @param {string} options.color - Icon color
     * @param {string} options.className - Additional CSS classes
     * @param {string} options.ariaLabel - Accessibility label
     * @param {boolean} options.ariaHidden - Whether to hide from screen readers
     * @returns {HTMLElement} Icon element
     */
    create(name, options = {}) {
        const {
            size = this.defaultSize,
            color = null,
            className = '',
            ariaLabel = null,
            ariaHidden = true
        } = options;

        const icon = document.createElement('span');
        icon.className = `${this.iconSet} ${className}`.trim();
        icon.textContent = name;
        
        // Set size if different from default
        if (size !== this.defaultSize) {
            icon.style.fontSize = `${size}px`;
        }
        
        // Set color if provided
        if (color) {
            icon.style.color = color;
        }
        
        // Accessibility
        if (ariaHidden) {
            icon.setAttribute('aria-hidden', 'true');
        }
        if (ariaLabel) {
            icon.setAttribute('aria-label', ariaLabel);
        }
        
        return icon;
    }

    /**
     * Create an icon as HTML string
     * @param {string} name - Icon name
     * @param {Object} options - Icon options (same as create method)
     * @returns {string} Icon HTML string
     */
    createHTML(name, options = {}) {
        const {
            size = this.defaultSize,
            color = null,
            className = '',
            ariaLabel = null,
            ariaHidden = true
        } = options;

        const classes = `${this.iconSet} ${className}`.trim();
        const style = [];
        
        if (size !== this.defaultSize) {
            style.push(`font-size: ${size}px`);
        }
        if (color) {
            style.push(`color: ${color}`);
        }
        
        const styleAttr = style.length > 0 ? ` style="${style.join('; ')}"` : '';
        const ariaHiddenAttr = ariaHidden ? ' aria-hidden="true"' : '';
        const ariaLabelAttr = ariaLabel ? ` aria-label="${ariaLabel}"` : '';
        
        return `<span class="${classes}"${styleAttr}${ariaHiddenAttr}${ariaLabelAttr}>${name}</span>`;
    }

    /**
     * Get available icon names (common icons)
     * @returns {Array<string>} Array of icon names
     */
    getAvailableIcons() {
        return [
            // Navigation
            'home', 'menu', 'arrow_back', 'arrow_forward', 'expand_more', 'expand_less',
            'chevron_left', 'chevron_right', 'close', 'more_vert', 'more_horiz',
            
            // Actions
            'add', 'edit', 'delete', 'save', 'cancel', 'done', 'check', 'clear',
            'search', 'filter_list', 'refresh', 'settings', 'info', 'help',
            
            // Content
            'school', 'menu_book', 'group', 'assignment', 'assessment', 'event',
            'calendar_month', 'psychology', 'upload_file', 'download', 'share',
            
            // Status
            'check_circle', 'error', 'warning', 'info_outline', 'notifications',
            'visibility', 'visibility_off',
            
            // UI Elements
            'light_mode', 'dark_mode', 'contrast', 'palette', 'logout',
            'login', 'person', 'person_add', 'lock', 'backup',
            
            // Media
            'play_arrow', 'pause', 'stop', 'volume_up', 'volume_off'
        ];
    }

    /**
     * Validate if an icon name is available
     * @param {string} name - Icon name to validate
     * @returns {boolean} Whether icon is available
     */
    isAvailable(name) {
        // In Material Symbols, all icon names are potentially available
        // We just check if it's a valid string
        return typeof name === 'string' && name.length > 0;
    }

    /**
     * Set default icon size
     * @param {number} size - Default size in pixels
     */
    setDefaultSize(size) {
        if (typeof size === 'number' && size > 0) {
            this.defaultSize = size;
        }
    }

    /**
     * Get the current icon set name
     * @returns {string} Icon set name
     */
    getIconSet() {
        return this.iconSet;
    }
}

// Create singleton instance
const iconProvider = new IconProvider();

// Export singleton
export default iconProvider;

// Also export class for testing
export { IconProvider };
