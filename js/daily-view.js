/**
 * Daily View - Vista giornaliera con slot cliccabili
 * Mobile First, Touch Gestures, Deeplink Support
 */

class DailyView {
    constructor() {
        // Constants
        this.ACTIVE_SLOT_THRESHOLD_MINUTES = 60;
        this.SWIPE_THRESHOLD_PX = 50;
        
        this.currentDayIndex = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
        this.dayNames = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
        this.timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00'];
        this.schedule = this.loadSchedule();
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        // Check for deeplink
        this.checkDeeplink();
    }

    /**
     * Load schedule from localStorage
     */
    loadSchedule() {
        try {
            const scheduleStr = localStorage.getItem('schedule');
            return scheduleStr ? JSON.parse(scheduleStr) : {};
        } catch (e) {
            console.error('Error loading schedule:', e);
            return {};
        }
    }

    /**
     * Check for deeplink in URL
     */
    checkDeeplink() {
        const params = new URLSearchParams(window.location.search);
        const lessonKey = params.get('lesson');
        
        if (lessonKey) {
            // Extract day from lesson key (format: "Lunedì-08:00")
            const [dayName, time] = lessonKey.split('-');
            const dayIndex = this.dayNames.indexOf(dayName);
            
            if (dayIndex !== -1) {
                this.currentDayIndex = dayIndex;
            }
        }
    }

    /**
     * Initialize the daily view
     */
    init() {
        this.renderWeekNavigation();
        this.renderDailyGrid();
        this.setupEventListeners();
        this.setupTouchGestures();
    }

    /**
     * Render week navigation
     */
    renderWeekNavigation() {
        const currentDayName = this.dayNames[this.currentDayIndex];
        const currentDate = this.getCurrentDate();
        
        document.getElementById('current-day-name').textContent = currentDayName;
        document.getElementById('current-date').textContent = currentDate;
    }

    /**
     * Get current date formatted
     */
    getCurrentDate() {
        const today = new Date();
        const dayDiff = this.currentDayIndex - today.getDay();
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + dayDiff);
        
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return targetDate.toLocaleDateString('it-IT', options);
    }

    /**
     * Render daily schedule grid
     */
    renderDailyGrid() {
        const grid = document.getElementById('daily-schedule-grid');
        if (!grid) return;

        grid.innerHTML = '';
        
        const currentDayName = this.dayNames[this.currentDayIndex];
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinutes = now.getMinutes();
        
        this.timeSlots.forEach(timeSlot => {
            const lessonKey = `${currentDayName}-${timeSlot}`;
            const lesson = this.schedule[lessonKey];
            const slotElement = this.createTimeSlot(timeSlot, lesson, currentHour, currentMinutes);
            grid.appendChild(slotElement);
        });
    }

    /**
     * Create a time slot element
     */
    createTimeSlot(timeSlot, lesson, currentHour, currentMinutes) {
        const slot = document.createElement('div');
        slot.className = 'time-slot';
        
        // Parse time
        const [hour, minutes] = timeSlot.split(':').map(Number);
        const slotTime = hour * 60 + minutes;
        const currentTime = currentHour * 60 + currentMinutes;
        
        // Determine status
        let status = 'future';
        if (slotTime < currentTime) {
            status = 'completed';
        } else if (slotTime <= currentTime + this.ACTIVE_SLOT_THRESHOLD_MINUTES) {
            status = 'active';
        }
        
        if (lesson) {
            slot.classList.add(status);
            slot.setAttribute('data-subject', lesson.subject || '');
            slot.setAttribute('data-lesson-key', `${this.dayNames[this.currentDayIndex]}-${timeSlot}`);
            slot.setAttribute('tabindex', '0');
            slot.setAttribute('role', 'button');
            slot.setAttribute('aria-label', `Lezione ${lesson.subject || ''} alle ${timeSlot}`);
            
            const header = document.createElement('div');
            header.className = 'slot-header';
            
            const timeEl = document.createElement('div');
            timeEl.className = 'slot-time';
            timeEl.textContent = timeSlot;
            
            const statusIndicator = document.createElement('span');
            statusIndicator.className = `slot-status-indicator ${status}`;
            statusIndicator.textContent = this.getStatusLabel(status);
            
            header.appendChild(timeEl);
            header.appendChild(statusIndicator);
            
            const body = document.createElement('div');
            body.className = 'slot-body';
            
            const subject = document.createElement('div');
            subject.className = 'slot-subject';
            subject.textContent = lesson.subject || 'Materia';
            
            const classEl = document.createElement('div');
            classEl.className = 'slot-class';
            classEl.textContent = lesson.className || lesson.classId || 'Classe';
            
            body.appendChild(subject);
            body.appendChild(classEl);
            
            if (lesson.activityType) {
                const activityType = document.createElement('div');
                activityType.className = 'slot-activity-type';
                activityType.textContent = lesson.activityType;
                body.appendChild(activityType);
            }
            
            slot.appendChild(header);
            slot.appendChild(body);
            
            // Add click handler
            slot.addEventListener('click', () => this.openLessonDetails(timeSlot, lesson));
            slot.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.openLessonDetails(timeSlot, lesson);
                }
            });
        } else {
            // Empty slot
            slot.classList.add('empty');
            
            const header = document.createElement('div');
            header.className = 'slot-header';
            
            const timeEl = document.createElement('div');
            timeEl.className = 'slot-time';
            timeEl.textContent = timeSlot;
            
            header.appendChild(timeEl);
            
            const emptyContent = document.createElement('div');
            emptyContent.className = 'empty-slot-content';
            
            const icon = document.createElement('span');
            icon.className = 'material-symbols-outlined';
            icon.textContent = 'event_available';
            
            const text = document.createElement('p');
            text.textContent = 'Nessuna lezione';
            
            emptyContent.appendChild(icon);
            emptyContent.appendChild(text);
            
            slot.appendChild(header);
            slot.appendChild(emptyContent);
        }
        
        return slot;
    }

    /**
     * Get status label
     */
    getStatusLabel(status) {
        const labels = {
            'active': 'In corso',
            'completed': 'Completata',
            'future': 'Futura'
        };
        return labels[status] || '';
    }

    /**
     * Open lesson details modal
     */
    openLessonDetails(timeSlot, lesson) {
        const modal = document.getElementById('lesson-details-modal');
        if (!modal) return;

        const lessonKey = `${this.dayNames[this.currentDayIndex]}-${timeSlot}`;
        
        document.getElementById('modal-lesson-title').textContent = lesson.subject || 'Lezione';
        document.getElementById('modal-lesson-class').textContent = lesson.className || lesson.classId || 'N/A';
        document.getElementById('modal-lesson-subject').textContent = lesson.subject || 'N/A';
        document.getElementById('modal-lesson-time').textContent = timeSlot;
        document.getElementById('modal-lesson-type').textContent = lesson.activityType || 'N/A';
        
        // Set status
        const now = new Date();
        const [hour, minutes] = timeSlot.split(':').map(Number);
        const slotTime = hour * 60 + minutes;
        const currentTime = now.getHours() * 60 + now.getMinutes();
        
        let status = 'future';
        if (slotTime < currentTime) {
            status = 'completed';
        } else if (slotTime <= currentTime + 60) {
            status = 'active';
        }
        
        const statusBadge = document.getElementById('modal-lesson-status');
        statusBadge.textContent = this.getStatusLabel(status);
        statusBadge.className = `detail-value status-badge ${status}`;
        
        // Setup enter button
        const enterBtn = document.getElementById('enter-lesson-btn');
        enterBtn.onclick = () => {
            this.enterLesson(lessonKey);
        };
        
        modal.style.display = 'flex';
    }

    /**
     * Close lesson details modal
     */
    closeLessonDetails() {
        const modal = document.getElementById('lesson-details-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    /**
     * Enter lesson
     */
    enterLesson(lessonKey) {
        // Update URL with lesson parameter
        window.location.href = `in-classe.html?lesson=${encodeURIComponent(lessonKey)}`;
    }

    /**
     * Navigate to previous day
     */
    navigatePrevious() {
        this.currentDayIndex--;
        if (this.currentDayIndex < 0) {
            this.currentDayIndex = 6; // Wrap to Saturday
        }
        this.renderWeekNavigation();
        this.renderDailyGrid();
    }

    /**
     * Navigate to next day
     */
    navigateNext() {
        this.currentDayIndex++;
        if (this.currentDayIndex > 6) {
            this.currentDayIndex = 0; // Wrap to Sunday
        }
        this.renderWeekNavigation();
        this.renderDailyGrid();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        const prevBtn = document.getElementById('prev-week-btn');
        const nextBtn = document.getElementById('next-week-btn');
        const closeBtn = document.getElementById('lesson-details-close');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.navigatePrevious());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.navigateNext());
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeLessonDetails());
        }
        
        // Close modal when clicking outside
        const modal = document.getElementById('lesson-details-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeLessonDetails();
                }
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.navigatePrevious();
            } else if (e.key === 'ArrowRight') {
                this.navigateNext();
            } else if (e.key === 'Escape') {
                this.closeLessonDetails();
            }
        });
    }

    /**
     * Setup touch gestures for swipe navigation
     */
    setupTouchGestures() {
        const container = document.querySelector('.daily-view-container');
        if (!container) return;
        
        container.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        container.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });
    }

    /**
     * Handle swipe gesture
     */
    handleSwipe() {
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > this.SWIPE_THRESHOLD_PX) {
            if (diff > 0) {
                // Swipe left - next day
                this.navigateNext();
            } else {
                // Swipe right - previous day
                this.navigatePrevious();
            }
        }
    }
}

// Initialize daily view when DOM is ready
let dailyView;

function initDailyView() {
    dailyView = new DailyView();
    dailyView.init();
    // Export for global access after initialization
    window.dailyView = dailyView;
}

// Export for global access
window.DailyView = DailyView;
window.initDailyView = initDailyView;
