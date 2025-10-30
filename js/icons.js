/**
 * Icon Component System
 * Provides a centralized way to manage and render icons across the application
 * Uses Material Symbols Outlined by default
 */

class IconComponent {
    /**
     * Icon library types
     */
    static LIBRARIES = {
        MATERIAL_SYMBOLS: 'material-symbols-outlined',
        MATERIAL_ICONS: 'material-icons'
    };

    /**
     * Icon sizes mapping to CSS variables
     */
    static SIZES = {
        XS: 'xs',    // 16px
        SM: 'sm',    // 20px
        MD: 'md',    // 24px (default)
        LG: 'lg',    // 32px
        XL: 'xl',    // 48px
        XXL: 'xxl'   // 64px
    };

    /**
     * Commonly used icons - centralized reference
     */
    static ICONS = {
        // Navigation
        HOME: 'home',
        MENU: 'menu',
        CLOSE: 'close',
        ARROW_BACK: 'arrow_back',
        ARROW_FORWARD: 'arrow_forward',
        MORE_VERT: 'more_vert',
        MORE_HORIZ: 'more_horiz',
        
        // Actions
        ADD: 'add',
        EDIT: 'edit',
        DELETE: 'delete',
        SAVE: 'save',
        CANCEL: 'cancel',
        REFRESH: 'refresh',
        SEARCH: 'search',
        FILTER: 'filter_list',
        SORT: 'sort',
        
        // Content
        UPLOAD: 'upload_file',
        DOWNLOAD: 'download',
        COPY: 'content_copy',
        PASTE: 'content_paste',
        CUT: 'content_cut',
        
        // Communication
        EMAIL: 'email',
        NOTIFICATIONS: 'notifications',
        MESSAGE: 'message',
        
        // Files & Folders
        FOLDER: 'folder',
        FILE: 'description',
        ATTACHMENT: 'attach_file',
        
        // Education specific
        BOOK: 'menu_book',
        SCHOOL: 'school',
        CLASS: 'group',
        ASSIGNMENT: 'assignment',
        GRADE: 'grade',
        CALENDAR: 'calendar_month',
        SCHEDULE: 'schedule',
        
        // Status & Feedback
        CHECK: 'check',
        CHECK_CIRCLE: 'check_circle',
        ERROR: 'error',
        WARNING: 'warning',
        INFO: 'info',
        HELP: 'help',
        
        // Settings & Tools
        SETTINGS: 'settings',
        BACKUP: 'backup',
        RESTORE: 'restore',
        
        // View modes
        VIEW_LIST: 'view_list',
        VIEW_MODULE: 'view_module',
        VIEW_GRID: 'grid_view',
        
        // AI & Analytics
        PSYCHOLOGY: 'psychology',
        ANALYTICS: 'bar_chart',
        INSIGHTS: 'insights',
        
        // UI Elements
        PALETTE: 'palette',
        LIGHT_MODE: 'light_mode',
        DARK_MODE: 'dark_mode',
        FULLSCREEN: 'fullscreen',
        FULLSCREEN_EXIT: 'fullscreen_exit',
        
        // Users
        PERSON: 'person',
        PERSON_ADD: 'person_add',
        GROUP: 'group',
        ACCOUNT_CIRCLE: 'account_circle'
    };

    /**
     * Create an icon element
     * @param {string} iconName - Icon name from Material Symbols or custom name
     * @param {Object} options - Configuration options
     * @param {string} options.size - Size (xs, sm, md, lg, xl, xxl)
     * @param {string} options.color - CSS color value
     * @param {string} options.className - Additional CSS classes
     * @param {string} options.title - Tooltip text
     * @param {string} options.ariaLabel - Accessibility label
     * @param {string} options.library - Icon library to use (default: material-symbols-outlined)
     * @returns {HTMLElement} Icon element
     */
    static create(iconName, options = {}) {
        const {
            size = 'md',
            color = '',
            className = '',
            title = '',
            ariaLabel = '',
            library = IconComponent.LIBRARIES.MATERIAL_SYMBOLS
        } = options;

        const icon = document.createElement('span');
        icon.className = `${library} icon icon-${size} ${className}`.trim();
        icon.textContent = iconName;

        // Apply custom color if provided
        if (color) {
            icon.style.color = color;
        }

        // Add tooltip
        if (title) {
            icon.title = title;
        }

        // Add accessibility
        icon.setAttribute('role', 'img');
        icon.setAttribute('aria-label', ariaLabel || title || iconName);

        return icon;
    }

    /**
     * Create an icon button
     * @param {string} iconName - Icon name
     * @param {Object} options - Configuration options
     * @param {Function} options.onClick - Click handler
     * @param {string} options.buttonClass - Additional button classes
     * @param {boolean} options.disabled - Whether button is disabled
     * @returns {HTMLButtonElement} Icon button element
     */
    static createButton(iconName, options = {}) {
        const {
            onClick = null,
            buttonClass = 'icon-btn',
            disabled = false,
            ...iconOptions
        } = options;

        const button = document.createElement('button');
        button.className = buttonClass;
        button.type = 'button';
        button.disabled = disabled;

        const icon = IconComponent.create(iconName, iconOptions);
        button.appendChild(icon);

        if (onClick) {
            button.addEventListener('click', onClick);
        }

        return button;
    }

    /**
     * Replace text with icon in existing element
     * @param {HTMLElement} element - Element to update
     * @param {string} iconName - Icon name
     * @param {Object} options - Icon options
     */
    static replace(element, iconName, options = {}) {
        const icon = IconComponent.create(iconName, options);
        element.innerHTML = '';
        element.appendChild(icon);
    }

    /**
     * Prepend icon to existing element
     * @param {HTMLElement} element - Element to update
     * @param {string} iconName - Icon name
     * @param {Object} options - Icon options
     */
    static prepend(element, iconName, options = {}) {
        const icon = IconComponent.create(iconName, options);
        element.insertBefore(icon, element.firstChild);
    }

    /**
     * Append icon to existing element
     * @param {HTMLElement} element - Element to update
     * @param {string} iconName - Icon name
     * @param {Object} options - Icon options
     */
    static append(element, iconName, options = {}) {
        const icon = IconComponent.create(iconName, options);
        element.appendChild(icon);
    }

    /**
     * Get SVG string for custom icon (for future SVG support)
     * @param {string} iconName - Icon name
     * @returns {string} SVG markup
     */
    static getSVG(iconName) {
        // Placeholder for future custom SVG icons
        console.warn('Custom SVG icons not yet implemented');
        return '';
    }

    /**
     * Validate if icon exists in the reference
     * @param {string} iconName - Icon name to check
     * @returns {boolean} Whether icon exists
     */
    static exists(iconName) {
        return Object.values(IconComponent.ICONS).includes(iconName);
    }

    /**
     * Get recommended icon for a context
     * @param {string} context - Context name (e.g., 'save', 'delete', 'edit')
     * @returns {string} Icon name
     */
    static getIcon(context) {
        const contextKey = context.toUpperCase().replace(/[-_\s]/g, '_');
        return IconComponent.ICONS[contextKey] || context;
    }

    /**
     * Create icon with text label
     * @param {string} iconName - Icon name
     * @param {string} label - Text label
     * @param {Object} options - Configuration options
     * @returns {HTMLElement} Container with icon and label
     */
    static createWithLabel(iconName, label, options = {}) {
        const { containerClass = 'icon-with-label', ...iconOptions } = options;
        
        const container = document.createElement('span');
        container.className = containerClass;
        
        const icon = IconComponent.create(iconName, iconOptions);
        const text = document.createElement('span');
        text.className = 'icon-label';
        text.textContent = label;
        
        container.appendChild(icon);
        container.appendChild(text);
        
        return container;
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.IconComponent = IconComponent;
}

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IconComponent;
}
