/**
 * @file In Classe Page Module
 * @description Main module for the "In Classe" lessons page
 * @module pages/InClasse
 */

import { lessonsAPI } from '../api/lessons.js';
import { LessonCard } from '../components/LessonCard.js';

/**
 * InClasse page controller
 * Manages lesson list, search, filters, and detail dialog
 * @class
 */
export class InClassePage {
    /**
     * @param {Object} config - Configuration options
     * @param {string} config.containerId - ID of container element
     */
    constructor(config = {}) {
        this.containerId = config.containerId || 'in-classe-container';
        this.container = null;
        this.lessons = [];
        this.filteredLessons = [];
        this.lessonCards = new Map();
        this.currentFilters = {
            search: '',
            subject: ''
        };
        this.subjects = [];
        this.selectedLesson = null;
    }

    /**
     * Initialize the page
     * @returns {Promise<void>}
     */
    async init() {
        this.container = document.getElementById(this.containerId);
        if (!this.container) {
            console.error(`Container #${this.containerId} not found`);
            return;
        }

        // Render initial structure
        this._renderStructure();

        // Load subjects for filter
        this.subjects = await lessonsAPI.getSubjects();
        this._populateSubjectFilter();

        // Load and display lessons
        await this.loadLessons();

        // Attach event listeners
        this._attachEventListeners();

        // Announce to screen readers
        this._announceLoaded();
    }

    /**
     * Render page structure
     * @private
     */
    _renderStructure() {
        this.container.innerHTML = `
            <div class="in-classe-page app-page">
                <!-- Header -->
                <header class="page-header app-header">
                    <h1>
                        <span class="material-symbols-outlined" aria-hidden="true">school</span>
                        In Classe
                    </h1>
                    <p class="page-subtitle">Esplora e iscriviti alle lezioni disponibili</p>
                </header>

                <!-- Daily Timeline Section -->
                <section class="daily-timeline-section" aria-label="Lezioni di oggi">
                    <div class="section-header">
                        <h2>
                            <span class="material-symbols-outlined" aria-hidden="true">today</span>
                            Lezioni di Oggi
                        </h2>
                        <span id="today-date" class="today-date"></span>
                    </div>
                    <div id="daily-timeline" class="daily-timeline">
                        <!-- Timeline will be rendered here -->
                    </div>
                    <div id="timeline-empty" class="timeline-empty" style="display: none;">
                        <span class="material-symbols-outlined empty-icon" aria-hidden="true">event_busy</span>
                        <p>Nessuna lezione programmata per oggi</p>
                    </div>
                </section>

                <!-- Filters Section -->
                <section class="filters-section" aria-label="Filtri lezioni">
                    <div class="filter-row">
                        <!-- Search -->
                        <div class="filter-item filter-search">
                            <label for="lesson-search" class="visually-hidden">Cerca lezioni</label>
                            <div class="search-input-wrapper">
                                <span class="material-symbols-outlined search-icon" aria-hidden="true">search</span>
                                <input 
                                    type="search" 
                                    id="lesson-search" 
                                    class="search-input"
                                    placeholder="Cerca per titolo o docente..."
                                    aria-describedby="search-hint"
                                />
                            </div>
                            <span id="search-hint" class="visually-hidden">
                                Inserisci il titolo o il nome del docente per filtrare le lezioni
                            </span>
                        </div>

                        <!-- Subject Filter -->
                        <div class="filter-item filter-subject">
                            <label for="subject-filter">Materia</label>
                            <select id="subject-filter" class="filter-select">
                                <option value="">Tutte le materie</option>
                            </select>
                        </div>

                        <!-- Clear Filters -->
                        <button 
                            type="button" 
                            id="clear-filters" 
                            class="btn-clear-filters"
                            aria-label="Cancella tutti i filtri">
                            <span class="material-symbols-outlined" aria-hidden="true">clear</span>
                            <span>Cancella</span>
                        </button>
                    </div>
                </section>

                <!-- Loading Indicator -->
                <div id="loading-indicator" class="loading-indicator" role="status" aria-live="polite">
                    <div class="spinner" aria-hidden="true"></div>
                    <span>Caricamento lezioni...</span>
                </div>

                <!-- Results Info -->
                <div id="results-info" class="results-info" role="status" aria-live="polite" aria-atomic="true">
                </div>

                <!-- Lessons Grid -->
                <section class="lessons-section" aria-label="Elenco lezioni">
                    <div id="lessons-grid" class="lessons-grid">
                        <!-- Lesson cards will be inserted here -->
                    </div>
                </section>

                <!-- Empty State -->
                <div id="empty-state" class="empty-state" style="display: none;">
                    <span class="material-symbols-outlined empty-icon" aria-hidden="true">search_off</span>
                    <h2>Nessuna lezione trovata</h2>
                    <p>Prova a modificare i filtri di ricerca</p>
                </div>
            </div>

            <!-- Lesson Detail Dialog -->
            <dialog id="lesson-detail-dialog" class="lesson-dialog" aria-labelledby="dialog-title">
                <div class="dialog-content">
                    <header class="dialog-header">
                        <h2 id="dialog-title" class="dialog-title"></h2>
                        <button 
                            type="button" 
                            class="btn-close-dialog"
                            aria-label="Chiudi finestra dettagli">
                            <span class="material-symbols-outlined" aria-hidden="true">close</span>
                        </button>
                    </header>
                    <div class="dialog-body" id="dialog-body">
                        <!-- Dialog content will be inserted here -->
                    </div>
                    <footer class="dialog-footer">
                        <button type="button" class="btn-secondary" id="dialog-close-btn">
                            Chiudi
                        </button>
                        <button type="button" class="btn-primary" id="dialog-enroll-btn">
                            <span class="material-symbols-outlined" aria-hidden="true">add_circle</span>
                            Iscriviti
                        </button>
                    </footer>
                </div>
            </dialog>
        `;
    }

    /**
     * Populate subject filter dropdown
     * @private
     */
    _populateSubjectFilter() {
        const select = document.getElementById('subject-filter');
        if (!select) return;

        // Clear existing options (except first)
        while (select.options.length > 1) {
            select.remove(1);
        }

        // Add subject options
        this.subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject;
            option.textContent = subject;
            select.appendChild(option);
        });
    }

    /**
     * Load lessons from API
     * @returns {Promise<void>}
     */
    async loadLessons() {
        this._showLoading(true);

        try {
            this.lessons = await lessonsAPI.getLessons(this.currentFilters);
            this.filteredLessons = [...this.lessons];
            this._renderLessons();
            this._renderDailyTimeline();
            this._updateResultsInfo();
        } catch (error) {
            console.error('Error loading lessons:', error);
            this._showError('Errore nel caricamento delle lezioni');
            // Use fallback mock data for development
            this._useFallbackData();
        } finally {
            this._showLoading(false);
        }
    }

    /**
     * Render daily timeline with today's lessons
     * @private
     */
    _renderDailyTimeline() {
        const timeline = document.getElementById('daily-timeline');
        const emptyState = document.getElementById('timeline-empty');
        const dateDisplay = document.getElementById('today-date');
        
        if (!timeline) return;

        // Get current date
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        
        // Update date display
        if (dateDisplay) {
            dateDisplay.textContent = today.toLocaleDateString('it-IT', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        }

        // Filter lessons for today and sort by time
        const todaysLessons = this.lessons
            .filter(lesson => lesson.date === todayStr)
            .sort((a, b) => {
                const timeA = a.time.split(' - ')[0];
                const timeB = b.time.split(' - ')[0];
                return timeA.localeCompare(timeB);
            });

        // Show/hide empty state
        if (todaysLessons.length === 0) {
            timeline.style.display = 'none';
            if (emptyState) emptyState.style.display = 'flex';
            return;
        }

        timeline.style.display = 'block';
        if (emptyState) emptyState.style.display = 'none';

        // Render timeline items
        timeline.innerHTML = todaysLessons.map(lesson => `
            <div class="timeline-item app-card" data-lesson-id="${lesson.id}">
                <div class="timeline-time">
                    <span class="material-symbols-outlined" aria-hidden="true">schedule</span>
                    <span>${lesson.time}</span>
                </div>
                <div class="timeline-content">
                    <h3>${this._escapeHtml(lesson.title)}</h3>
                    <div class="timeline-meta">
                        <span class="timeline-subject">${this._escapeHtml(lesson.subject)}</span>
                        <span class="timeline-separator">•</span>
                        <span class="timeline-teacher">${this._escapeHtml(lesson.teacher)}</span>
                        <span class="timeline-separator">•</span>
                        <span class="timeline-class">${this._escapeHtml(lesson.className)}</span>
                    </div>
                    <div class="timeline-type">
                        <span class="type-badge type-${lesson.type.toLowerCase()}">${lesson.type}</span>
                    </div>
                </div>
                <button 
                    class="timeline-action btn-icon" 
                    onclick="window.inClassePage?._showLessonDetailsFromTimeline('${lesson.id}')"
                    aria-label="Visualizza dettagli ${lesson.title}"
                    title="Visualizza dettagli">
                    <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
                </button>
            </div>
        `).join('');
    }

    /**
     * Show lesson details from timeline click
     * @private
     * @param {string} lessonId - Lesson ID
     */
    _showLessonDetailsFromTimeline(lessonId) {
        const lesson = this.lessons.find(l => l.id === lessonId);
        if (lesson) {
            this._showLessonDetails(lesson);
        }
    }

    /**
     * Use fallback mock data when API is unavailable
     * @private
     */
    _useFallbackData() {
        // Provide development fallback with lessons for today
        const today = new Date().toISOString().split('T')[0];
        this.lessons = [
            {
                id: 'fallback-1',
                title: 'Lezione di Esempio - Matematica',
                teacher: 'Prof. Demo',
                subject: 'Matematica',
                date: today,
                time: '09:00 - 10:00',
                duration: 60,
                classId: '3A',
                className: 'Classe 3A',
                type: 'Teoria',
                status: 'scheduled',
                enrolledCount: 15,
                maxCapacity: 25
            },
            {
                id: 'fallback-2',
                title: 'Lezione di Esempio - Italiano',
                teacher: 'Prof. Demo',
                subject: 'Italiano',
                date: today,
                time: '10:00 - 11:00',
                duration: 60,
                classId: '3A',
                className: 'Classe 3A',
                type: 'Teoria',
                status: 'scheduled',
                enrolledCount: 18,
                maxCapacity: 25
            }
        ];
        this.filteredLessons = [...this.lessons];
        this._renderLessons();
        this._renderDailyTimeline();
        this._updateResultsInfo();
        
        console.log('📝 Using fallback mock data for development');
    }

    /**
     * Render lessons in grid
     * @private
     */
    _renderLessons() {
        const grid = document.getElementById('lessons-grid');
        const emptyState = document.getElementById('empty-state');
        
        if (!grid) return;

        // Clear existing cards
        grid.innerHTML = '';
        this.lessonCards.clear();

        // Show empty state if no lessons
        if (this.filteredLessons.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        // Create and render lesson cards
        this.filteredLessons.forEach(lesson => {
            const card = new LessonCard({
                ...lesson,
                onViewDetails: (lessonData) => this._showLessonDetails(lessonData),
                onEnroll: (lessonData) => this._handleEnroll(lessonData)
            });

            const cardElement = card.render();
            grid.appendChild(cardElement);
            this.lessonCards.set(lesson.id, card);
        });
    }

    /**
     * Show/hide loading indicator
     * @private
     * @param {boolean} show - Whether to show loading
     */
    _showLoading(show) {
        const loader = document.getElementById('loading-indicator');
        if (loader) {
            loader.style.display = show ? 'flex' : 'none';
        }
    }

    /**
     * Update results info
     * @private
     */
    _updateResultsInfo() {
        const info = document.getElementById('results-info');
        if (!info) return;

        const count = this.filteredLessons.length;
        const total = this.lessons.length;

        if (count === total) {
            info.textContent = `${count} ${count === 1 ? 'lezione trovata' : 'lezioni trovate'}`;
        } else {
            info.textContent = `${count} di ${total} ${count === 1 ? 'lezione trovata' : 'lezioni trovate'}`;
        }
    }

    /**
     * Show error message
     * @private
     * @param {string} message - Error message
     */
    _showError(message) {
        // Create or update error alert
        let alert = document.getElementById('error-alert');
        if (!alert) {
            alert = document.createElement('div');
            alert.id = 'error-alert';
            alert.className = 'alert alert-error';
            alert.setAttribute('role', 'alert');
            this.container.insertBefore(alert, this.container.firstChild);
        }

        alert.innerHTML = `
            <span class="material-symbols-outlined" aria-hidden="true">error</span>
            <span>${message}</span>
            <button type="button" class="btn-close-alert" aria-label="Chiudi avviso">
                <span class="material-symbols-outlined" aria-hidden="true">close</span>
            </button>
        `;

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            if (alert && alert.parentNode) {
                alert.remove();
            }
        }, 5000);

        // Close button
        const closeBtn = alert.querySelector('.btn-close-alert');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => alert.remove());
        }
    }

    /**
     * Show lesson details in dialog
     * @private
     * @param {Object} lesson - Lesson data
     */
    _showLessonDetails(lesson) {
        this.selectedLesson = lesson;
        
        const dialog = document.getElementById('lesson-detail-dialog');
        const title = document.getElementById('dialog-title');
        const body = document.getElementById('dialog-body');
        const enrollBtn = document.getElementById('dialog-enroll-btn');

        if (!dialog || !title || !body || !enrollBtn) return;

        // Set title
        title.textContent = lesson.title;

        // Set body content
        body.innerHTML = `
            <div class="lesson-detail-content">
                <div class="detail-section">
                    <h3>Informazioni Generali</h3>
                    <dl class="detail-list">
                        <dt>Docente</dt>
                        <dd>${this._escapeHtml(lesson.teacher)}</dd>
                        
                        <dt>Materia</dt>
                        <dd>${this._escapeHtml(lesson.subject)}</dd>
                        
                        <dt>Classe</dt>
                        <dd>${this._escapeHtml(lesson.className)}</dd>
                        
                        <dt>Tipo</dt>
                        <dd>${this._escapeHtml(lesson.type)}</dd>
                    </dl>
                </div>

                <div class="detail-section">
                    <h3>Data e Orario</h3>
                    <dl class="detail-list">
                        <dt>Data</dt>
                        <dd>${this._formatDate(lesson.date)}</dd>
                        
                        <dt>Orario</dt>
                        <dd>${this._escapeHtml(lesson.time)}</dd>
                        
                        <dt>Durata</dt>
                        <dd>${lesson.duration} minuti</dd>
                    </dl>
                </div>

                <div class="detail-section">
                    <h3>Disponibilità</h3>
                    <dl class="detail-list">
                        <dt>Posti occupati</dt>
                        <dd>${lesson.enrolledCount} / ${lesson.maxCapacity}</dd>
                        
                        <dt>Posti disponibili</dt>
                        <dd>${lesson.maxCapacity - lesson.enrolledCount}</dd>
                    </dl>
                </div>
            </div>
        `;

        // Update enroll button state
        const isFull = lesson.enrolledCount >= lesson.maxCapacity;
        enrollBtn.disabled = isFull;
        enrollBtn.innerHTML = isFull 
            ? '<span class="material-symbols-outlined" aria-hidden="true">block</span><span>Completo</span>'
            : '<span class="material-symbols-outlined" aria-hidden="true">add_circle</span><span>Iscriviti</span>';

        // Show dialog
        dialog.showModal();

        // Focus management
        dialog.focus();
    }

    /**
     * Handle lesson enrollment
     * @private
     * @param {Object} lesson - Lesson data
     */
    async _handleEnroll(lesson) {
        try {
            const result = await lessonsAPI.enrollInLesson(lesson.id);
            
            if (result.success) {
                // Update lesson data
                const updatedLesson = { ...lesson, enrolledCount: lesson.enrolledCount + 1 };
                
                // Update in lessons array
                const index = this.lessons.findIndex(l => l.id === lesson.id);
                if (index >= 0) {
                    this.lessons[index] = updatedLesson;
                }
                
                // Update in filtered array
                const filteredIndex = this.filteredLessons.findIndex(l => l.id === lesson.id);
                if (filteredIndex >= 0) {
                    this.filteredLessons[filteredIndex] = updatedLesson;
                }
                
                // Update card
                const card = this.lessonCards.get(lesson.id);
                if (card) {
                    card.update(updatedLesson);
                }

                // Show success message
                this._showSuccessMessage(result.message);

                // Close dialog if open
                const dialog = document.getElementById('lesson-detail-dialog');
                if (dialog && dialog.open) {
                    dialog.close();
                }
            } else {
                this._showError(result.message);
            }
        } catch (error) {
            console.error('Error enrolling in lesson:', error);
            this._showError('Errore durante l\'iscrizione');
        }
    }

    /**
     * Show success message
     * @private
     * @param {string} message - Success message
     */
    _showSuccessMessage(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-success';
        alert.setAttribute('role', 'alert');
        alert.innerHTML = `
            <span class="material-symbols-outlined" aria-hidden="true">check_circle</span>
            <span>${message}</span>
        `;

        this.container.insertBefore(alert, this.container.firstChild);

        // Auto-dismiss
        setTimeout(() => {
            if (alert && alert.parentNode) {
                alert.remove();
            }
        }, 3000);
    }

    /**
     * Attach event listeners
     * @private
     */
    _attachEventListeners() {
        // Search input
        const searchInput = document.getElementById('lesson-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilters.search = e.target.value;
                this._applyFilters();
            });
        }

        // Subject filter
        const subjectFilter = document.getElementById('subject-filter');
        if (subjectFilter) {
            subjectFilter.addEventListener('change', (e) => {
                this.currentFilters.subject = e.target.value;
                this.loadLessons();
            });
        }

        // Clear filters button
        const clearBtn = document.getElementById('clear-filters');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.currentFilters = { search: '', subject: '' };
                if (searchInput) searchInput.value = '';
                if (subjectFilter) subjectFilter.value = '';
                this.loadLessons();
            });
        }

        // Dialog close buttons
        const dialog = document.getElementById('lesson-detail-dialog');
        const closeBtn = document.querySelector('.btn-close-dialog');
        const dialogCloseBtn = document.getElementById('dialog-close-btn');
        
        if (dialog) {
            if (closeBtn) {
                closeBtn.addEventListener('click', () => dialog.close());
            }
            if (dialogCloseBtn) {
                dialogCloseBtn.addEventListener('click', () => dialog.close());
            }

            // Close on Escape key
            dialog.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    dialog.close();
                }
            });
        }

        // Dialog enroll button
        const dialogEnrollBtn = document.getElementById('dialog-enroll-btn');
        if (dialogEnrollBtn) {
            dialogEnrollBtn.addEventListener('click', () => {
                if (this.selectedLesson) {
                    this._handleEnroll(this.selectedLesson);
                }
            });
        }
    }

    /**
     * Apply filters to lessons (client-side)
     * @private
     */
    _applyFilters() {
        const searchLower = this.currentFilters.search.toLowerCase();

        this.filteredLessons = this.lessons.filter(lesson => {
            // Search filter
            if (searchLower) {
                const matchTitle = lesson.title.toLowerCase().includes(searchLower);
                const matchTeacher = lesson.teacher.toLowerCase().includes(searchLower);
                if (!matchTitle && !matchTeacher) {
                    return false;
                }
            }

            return true;
        });

        this._renderLessons();
        this._updateResultsInfo();
    }

    /**
     * Format date helper
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
                month: 'long',
                year: 'numeric'
            });
        } catch (e) {
            return dateStr;
        }
    }

    /**
     * Escape HTML helper
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
     * Announce page loaded to screen readers
     * @private
     */
    _announceLoaded() {
        const announcement = document.createElement('div');
        announcement.className = 'visually-hidden';
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.textContent = 'Pagina In Classe caricata. Usa i filtri per cercare lezioni.';
        this.container.appendChild(announcement);

        // Remove after announcement
        setTimeout(() => {
            if (announcement && announcement.parentNode) {
                announcement.remove();
            }
        }, 1000);
    }

    /**
     * Destroy the page and cleanup
     */
    destroy() {
        // Destroy all lesson cards
        this.lessonCards.forEach(card => card.destroy());
        this.lessonCards.clear();

        // Clear container
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

// Export helper function to initialize page
export function initInClassePage(containerId) {
    const page = new InClassePage({ containerId });
    page.init();
    // Make globally accessible for timeline interactions
    if (typeof window !== 'undefined') {
        window.inClassePage = page;
    }
    return page;
}
