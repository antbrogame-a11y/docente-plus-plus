/**
 * @file Lesson Card Component
 * @description Reusable component for displaying lesson information
 * @module components/LessonCard
 */

/**
 * @typedef {Object} LessonCardConfig
 * @property {string} id - Lesson ID
 * @property {string} title - Lesson title
 * @property {string} teacher - Teacher name
 * @property {string} subject - Subject/materia
 * @property {string} date - Date string
 * @property {string} time - Time string
 * @property {number} duration - Duration in minutes
 * @property {string} className - Class name
 * @property {string} type - Activity type
 * @property {number} enrolledCount - Number of enrolled students
 * @property {number} maxCapacity - Maximum capacity
 * @property {Function} [onEnroll] - Callback when enroll button is clicked
 * @property {Function} [onViewDetails] - Callback when card is clicked
 */

/**
 * LessonCard component
 * Creates a card element for displaying lesson information
 * @class
 */
export class LessonCard {
    /**
     * @param {LessonCardConfig} config - Card configuration
     */
    constructor(config) {
        this.config = config;
        this.element = null;
    }

    /**
     * Format date to Italian locale
     * @private
     * @param {string} dateStr - ISO date string
     * @returns {string} Formatted date
     */
    _formatDate(dateStr) {
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
     * Get icon for activity type
     * @private
     * @param {string} type - Activity type
     * @returns {string} Material icon name
     */
    _getTypeIcon(type) {
        const iconMap = {
            'Teoria': 'menu_book',
            'Laboratorio': 'science',
            'Pratica': 'sports',
            'Verifica': 'assignment',
            'default': 'school'
        };
        return iconMap[type] || iconMap.default;
    }

    /**
     * Get CSS class for activity type
     * @private
     * @param {string} type - Activity type
     * @returns {string} CSS class name
     */
    _getTypeClass(type) {
        const classMap = {
            'Teoria': 'type-teoria',
            'Laboratorio': 'type-laboratorio',
            'Pratica': 'type-pratica',
            'Verifica': 'type-verifica'
        };
        return classMap[type] || 'type-default';
    }

    /**
     * Calculate availability percentage
     * @private
     * @returns {number} Percentage (0-100)
     */
    _getAvailabilityPercent() {
        const { enrolledCount = 0, maxCapacity = 1 } = this.config;
        if (maxCapacity === 0) return 0;
        return Math.round((enrolledCount / maxCapacity) * 100);
    }

    /**
     * Check if lesson is full
     * @private
     * @returns {boolean} True if lesson is at capacity
     */
    _isFull() {
        const { enrolledCount = 0, maxCapacity = 0 } = this.config;
        return enrolledCount >= maxCapacity;
    }

    /**
     * Render the lesson card
     * @returns {HTMLElement} Card element
     */
    render() {
        const {
            id,
            title,
            teacher,
            subject,
            date,
            time,
            duration,
            className,
            type,
            enrolledCount,
            maxCapacity
        } = this.config;

        // Create card container
        const card = document.createElement('article');
        card.className = 'lesson-card';
        card.setAttribute('data-lesson-id', id);
        card.setAttribute('role', 'article');
        card.setAttribute('aria-label', `Lezione: ${title}`);

        // Make card focusable for keyboard navigation
        card.setAttribute('tabindex', '0');

        const isFull = this._isFull();
        const availabilityPercent = this._getAvailabilityPercent();
        const typeIcon = this._getTypeIcon(type);
        const typeClass = this._getTypeClass(type);
        const formattedDate = this._formatDate(date);

        // Build card HTML
        card.innerHTML = `
            <div class="lesson-card-header">
                <div class="lesson-type-badge ${typeClass}">
                    <span class="material-symbols-outlined" aria-hidden="true">${typeIcon}</span>
                    <span>${type}</span>
                </div>
                <div class="lesson-subject">${this._escapeHtml(subject)}</div>
            </div>

            <div class="lesson-card-content">
                <h3 class="lesson-title">${this._escapeHtml(title)}</h3>
                
                <div class="lesson-meta">
                    <div class="lesson-meta-item">
                        <span class="material-symbols-outlined" aria-hidden="true">person</span>
                        <span>${this._escapeHtml(teacher)}</span>
                    </div>
                    <div class="lesson-meta-item">
                        <span class="material-symbols-outlined" aria-hidden="true">group</span>
                        <span>${this._escapeHtml(className)}</span>
                    </div>
                    <div class="lesson-meta-item">
                        <span class="material-symbols-outlined" aria-hidden="true">schedule</span>
                        <span>${this._escapeHtml(time)} (${duration} min)</span>
                    </div>
                    <div class="lesson-meta-item">
                        <span class="material-symbols-outlined" aria-hidden="true">event</span>
                        <span>${formattedDate}</span>
                    </div>
                </div>

                <div class="lesson-availability">
                    <div class="availability-bar" role="progressbar" 
                         aria-valuenow="${availabilityPercent}" 
                         aria-valuemin="0" 
                         aria-valuemax="100"
                         aria-label="Disponibilità posti">
                        <div class="availability-fill" style="width: ${availabilityPercent}%"></div>
                    </div>
                    <div class="availability-text">
                        <span>${enrolledCount} / ${maxCapacity} iscritti</span>
                        ${isFull ? '<span class="full-badge">Completo</span>' : ''}
                    </div>
                </div>
            </div>

            <div class="lesson-card-footer">
                <button class="btn-view-details btn-secondary" 
                        type="button"
                        aria-label="Visualizza dettagli di ${this._escapeHtml(title)}">
                    <span class="material-symbols-outlined" aria-hidden="true">info</span>
                    <span>Dettagli</span>
                </button>
                <button class="btn-enroll btn-primary" 
                        type="button"
                        ${isFull ? 'disabled' : ''}
                        aria-label="Iscriviti a ${this._escapeHtml(title)}">
                    <span class="material-symbols-outlined" aria-hidden="true">
                        ${isFull ? 'block' : 'add_circle'}
                    </span>
                    <span>${isFull ? 'Completo' : 'Iscriviti'}</span>
                </button>
            </div>
        `;

        // Add event listeners
        this._attachEventListeners(card);

        // Store reference
        this.element = card;

        return card;
    }

    /**
     * Attach event listeners to card
     * @private
     * @param {HTMLElement} card - Card element
     */
    _attachEventListeners(card) {
        const { onEnroll, onViewDetails } = this.config;

        // Details button
        const detailsBtn = card.querySelector('.btn-view-details');
        if (detailsBtn && onViewDetails) {
            detailsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                onViewDetails(this.config);
            });
        }

        // Enroll button
        const enrollBtn = card.querySelector('.btn-enroll');
        if (enrollBtn && onEnroll && !enrollBtn.disabled) {
            enrollBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                onEnroll(this.config);
            });
        }

        // Card click (same as details)
        if (onViewDetails) {
            card.addEventListener('click', () => {
                onViewDetails(this.config);
            });

            // Keyboard support (Enter/Space)
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onViewDetails(this.config);
                }
            });
        }
    }

    /**
     * Escape HTML to prevent XSS
     * @private
     * @param {string} str - String to escape
     * @returns {string} Escaped string
     */
    _escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Update card data
     * @param {Partial<LessonCardConfig>} updates - Updates to apply
     */
    update(updates) {
        this.config = { ...this.config, ...updates };
        
        // Re-render if element exists and is in DOM
        if (this.element && this.element.parentNode) {
            const parentNode = this.element.parentNode;
            const oldElement = this.element;
            const newElement = this.render();
            parentNode.replaceChild(newElement, oldElement);
            // this.element is now updated by render() to point to newElement
        }
    }

    /**
     * Destroy the card and remove event listeners
     */
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
    }
}

/**
 * Create a lesson card element
 * Helper function for quick card creation
 * @param {LessonCardConfig} config - Card configuration
 * @returns {HTMLElement} Card element
 */
export function createLessonCard(config) {
    const card = new LessonCard(config);
    return card.render();
}
