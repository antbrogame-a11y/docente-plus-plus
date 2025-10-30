/**
 * DailyTimeline Component
 * Shows lessons for the current day in a timeline view
 * @module components/DailyTimeline
 */

/**
 * Fetch lessons for a specific date
 * @param {Date} date - Date to fetch lessons for
 * @returns {Promise<Array>} Array of lessons for the day
 */
export async function fetchLessons(date) {
    try {
        // In development, use mock data
        const lessons = await fetchLessonsFromAPI(date);
        return lessons;
    } catch (error) {
        console.warn('API unavailable, using mock data:', error.message);
        return getMockLessons(date);
    }
}

/**
 * Fetch lessons from API (stub for future implementation)
 * @param {Date} date - Date to fetch lessons for
 * @returns {Promise<Array>} Array of lessons
 */
async function fetchLessonsFromAPI(date) {
    // Check if running in development mode
    const isDev = !window.location.origin.includes('production');
    
    if (isDev) {
        // Simulate API delay in dev
        await new Promise(resolve => setTimeout(resolve, 300));
        throw new Error('API not available in development mode');
    }
    
    // TODO: Replace with actual API call
    const response = await fetch(`/api/lessons?date=${date.toISOString().split('T')[0]}`);
    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
}

/**
 * Get mock lessons for development
 * Uses schedule data from localStorage
 * @param {Date} date - Date to get lessons for
 * @returns {Array} Array of mock lessons
 */
function getMockLessons(date) {
    const dayName = getDayName(date);
    const schedule = getScheduleFromStorage();
    const lessons = [];
    
    // Extract lessons for this day from schedule
    Object.entries(schedule).forEach(([key, slot]) => {
        const [scheduleDayName, time] = key.split('-');
        if (scheduleDayName === dayName && slot.classId && slot.subject) {
            lessons.push({
                id: key,
                time: time,
                endTime: getEndTime(time),
                className: slot.className || `Classe ${slot.classId}`,
                classId: slot.classId,
                subject: slot.subject,
                activityType: slot.activityType || 'Lezione',
                teacher: slot.teacher || 'Docente',
                room: slot.room || '',
                description: slot.description || ''
            });
        }
    });
    
    // Sort by time
    lessons.sort((a, b) => a.time.localeCompare(b.time));
    
    return lessons;
}

/**
 * Get schedule from localStorage
 * @returns {Object} Schedule object
 */
function getScheduleFromStorage() {
    try {
        const scheduleStr = localStorage.getItem('schedule');
        return scheduleStr ? JSON.parse(scheduleStr) : {};
    } catch (e) {
        console.error('Error loading schedule:', e);
        return {};
    }
}

/**
 * Get day name for a date
 * @param {Date} date - Date object
 * @returns {string} Day name in Italian
 */
function getDayName(date) {
    const days = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
    return days[date.getDay()];
}

/**
 * Calculate end time based on start time (assumes 60-minute lessons)
 * @param {string} startTime - Start time in HH:MM format
 * @returns {string} End time in HH:MM format
 */
function getEndTime(startTime) {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHours = hours + 1;
    return `${String(endHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/**
 * DailyTimeline Component Class
 */
export class DailyTimeline {
    /**
     * @param {Object} config - Configuration options
     * @param {string} config.containerId - ID of container element
     * @param {Date} config.date - Date to show (defaults to today)
     * @param {Function} config.onLessonClick - Callback when lesson is clicked
     */
    constructor(config = {}) {
        this.containerId = config.containerId || 'daily-timeline';
        this.date = config.date || new Date();
        this.onLessonClick = config.onLessonClick || null;
        this.container = null;
        this.lessons = [];
        this.loading = false;
    }
    
    /**
     * Initialize the timeline
     * @returns {Promise<void>}
     */
    async init() {
        this.container = document.getElementById(this.containerId);
        if (!this.container) {
            console.error(`Container #${this.containerId} not found`);
            return;
        }
        
        await this.loadLessons();
        this.render();
    }
    
    /**
     * Load lessons for the current date
     * @returns {Promise<void>}
     */
    async loadLessons() {
        this.loading = true;
        this.render();
        
        try {
            this.lessons = await fetchLessons(this.date);
        } catch (error) {
            console.error('Error loading lessons:', error);
            this.lessons = [];
        } finally {
            this.loading = false;
        }
    }
    
    /**
     * Render the timeline
     */
    render() {
        if (!this.container) return;
        
        const dayName = getDayName(this.date);
        const formattedDate = this.date.toLocaleDateString('it-IT', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        if (this.loading) {
            this.container.innerHTML = `
                <div class="daily-timeline">
                    <div class="timeline-header">
                        <h3>Orario del Giorno</h3>
                        <p class="timeline-date">${formattedDate}</p>
                    </div>
                    <div class="timeline-loading">
                        <div class="spinner" aria-hidden="true"></div>
                        <span>Caricamento lezioni...</span>
                    </div>
                </div>
            `;
            return;
        }
        
        if (this.lessons.length === 0) {
            this.container.innerHTML = `
                <div class="daily-timeline">
                    <div class="timeline-header">
                        <h3>Orario del Giorno</h3>
                        <p class="timeline-date">${formattedDate}</p>
                    </div>
                    <div class="timeline-empty">
                        <span class="material-symbols-outlined">event_busy</span>
                        <p>Nessuna lezione programmata per oggi</p>
                    </div>
                </div>
            `;
            return;
        }
        
        const lessonsHTML = this.lessons.map(lesson => this.renderLesson(lesson)).join('');
        
        this.container.innerHTML = `
            <div class="daily-timeline">
                <div class="timeline-header">
                    <h3>Orario del Giorno</h3>
                    <p class="timeline-date">${formattedDate}</p>
                </div>
                <div class="timeline-content">
                    ${lessonsHTML}
                </div>
            </div>
        `;
        
        // Attach click handlers
        this.attachEventListeners();
    }
    
    /**
     * Render a single lesson
     * @param {Object} lesson - Lesson object
     * @returns {string} HTML string
     */
    renderLesson(lesson) {
        const isNow = this.isLessonNow(lesson);
        const statusClass = isNow ? 'timeline-lesson-current' : '';
        
        return `
            <div class="timeline-lesson ${statusClass}" data-lesson-id="${lesson.id}">
                <div class="timeline-lesson-time">
                    <span class="timeline-time-start">${lesson.time}</span>
                    <span class="timeline-time-separator">-</span>
                    <span class="timeline-time-end">${lesson.endTime}</span>
                </div>
                <div class="timeline-lesson-info">
                    <div class="timeline-lesson-header">
                        <h4 class="timeline-lesson-class">${this.escapeHtml(lesson.className)}</h4>
                        ${isNow ? '<span class="timeline-badge-now">In corso</span>' : ''}
                    </div>
                    <p class="timeline-lesson-subject">${this.escapeHtml(lesson.subject)}</p>
                    ${lesson.activityType ? `<span class="timeline-lesson-type">${this.escapeHtml(lesson.activityType)}</span>` : ''}
                    ${lesson.room ? `<span class="timeline-lesson-room"><span class="material-symbols-outlined">door_front</span>${this.escapeHtml(lesson.room)}</span>` : ''}
                </div>
                ${this.onLessonClick ? `
                <button class="timeline-lesson-action" aria-label="Apri lezione ${lesson.className}">
                    <span class="material-symbols-outlined">arrow_forward</span>
                </button>
                ` : ''}
            </div>
        `;
    }
    
    /**
     * Check if lesson is currently happening
     * @param {Object} lesson - Lesson object
     * @returns {boolean} True if lesson is now
     */
    isLessonNow(lesson) {
        const now = new Date();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Check if it's today
        const lessonDate = new Date(this.date);
        lessonDate.setHours(0, 0, 0, 0);
        if (lessonDate.getTime() !== today.getTime()) {
            return false;
        }
        
        // Parse start and end times
        const [startHours, startMinutes] = lesson.time.split(':').map(Number);
        const [endHours, endMinutes] = lesson.endTime.split(':').map(Number);
        
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const startTotalMinutes = startHours * 60 + startMinutes;
        const endTotalMinutes = endHours * 60 + endMinutes;
        
        return currentMinutes >= startTotalMinutes && currentMinutes < endTotalMinutes;
    }
    
    /**
     * Attach event listeners to lesson elements
     */
    attachEventListeners() {
        if (!this.onLessonClick) return;
        
        const lessonElements = this.container.querySelectorAll('.timeline-lesson');
        lessonElements.forEach(element => {
            element.addEventListener('click', (e) => {
                const lessonId = element.dataset.lessonId;
                const lesson = this.lessons.find(l => l.id === lessonId);
                if (lesson) {
                    this.onLessonClick(lesson);
                }
            });
        });
    }
    
    /**
     * Update timeline with new date
     * @param {Date} date - New date
     * @returns {Promise<void>}
     */
    async updateDate(date) {
        this.date = date;
        await this.loadLessons();
        this.render();
    }
    
    /**
     * Escape HTML helper
     * @param {string} str - String to escape
     * @returns {string} Escaped string
     */
    escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
    
    /**
     * Destroy the timeline and cleanup
     */
    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

// Export helper function to initialize timeline
export function initDailyTimeline(containerId, date = null, onLessonClick = null) {
    const timeline = new DailyTimeline({ 
        containerId, 
        date: date || new Date(),
        onLessonClick 
    });
    timeline.init();
    return timeline;
}
