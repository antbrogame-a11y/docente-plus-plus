/**
 * Schedule Component - Reusable Weekly Schedule Table
 * Professional, responsive, and accessible schedule component
 * 
 * Features:
 * - 6 hours/day (Monday-Friday), 08:00-14:00
 * - Click/tap cells to edit content
 * - Fully responsive (mobile, tablet, desktop)
 * - Material Symbols icons
 * - Blue/cyan/white modern palette
 * - Keyboard accessible
 */

import { state } from './data.js';

// Activity type configurations with Material Symbols icons
const ACTIVITY_TYPES = {
    theory: {
        label: 'Teoria/Lezione',
        icon: 'menu_book',
        color: '#6750A4'  // Primary purple
    },
    practice: {
        label: 'Disegno/Pratica',
        icon: 'draw',
        color: '#7D5260'  // Tertiary rose
    },
    lab: {
        label: 'Laboratorio',
        icon: 'science',
        color: '#006A6A'  // Teal
    },
    test: {
        label: 'Verifica',
        icon: 'quiz',
        color: '#984061'  // Deep rose
    },
    group: {
        label: 'Lavoro di Gruppo',
        icon: 'groups',
        color: '#6750A4'  // Primary purple
    },
    other: {
        label: 'Altro',
        icon: 'more_horiz',
        color: '#625B71'  // Secondary gray
    }
};

// Schedule configuration
const SCHEDULE_CONFIG = {
    hoursPerDay: 6,
    startHour: 8,
    startMinute: 0,
    workingDays: ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì']
};

/**
 * Generate time slots for the schedule
 * @returns {string[]} Array of time strings (e.g., ['08:00', '09:00', ...])
 */
export function generateTimeSlots() {
    const slots = [];
    for (let i = 0; i < SCHEDULE_CONFIG.hoursPerDay; i++) {
        const hour = SCHEDULE_CONFIG.startHour + i;
        const minute = SCHEDULE_CONFIG.startMinute;
        slots.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
    }
    return slots;
}

/**
 * Create a schedule cell element
 * @param {string} dayIndex - Day of week index (0-4)
 * @param {string} time - Time slot (e.g., '08:00')
 * @param {Object|null} data - Cell data (classId, activityType, subject)
 * @param {Function} onCellClick - Callback when cell is clicked
 * @returns {HTMLElement} Schedule cell element
 */
function createScheduleCell(dayIndex, time, data, onCellClick) {
    const cell = document.createElement('td');
    cell.className = 'schedule-cell';
    cell.setAttribute('role', 'button');
    cell.setAttribute('tabindex', '0');
    cell.setAttribute('aria-label', `${SCHEDULE_CONFIG.workingDays[dayIndex]} ${time}`);
    
    if (data && data.classId) {
        // Cell with activity
        const classObj = state.classes.find(c => c.id === data.classId);
        const activityType = ACTIVITY_TYPES[data.activityType] || ACTIVITY_TYPES.other;
        
        cell.classList.add('schedule-cell--filled');
        cell.innerHTML = `
            <div class="schedule-cell__content">
                <div class="schedule-cell__icon">
                    <span class="material-symbols-outlined" style="color: ${activityType.color}">
                        ${activityType.icon}
                    </span>
                </div>
                <div class="schedule-cell__info">
                    <div class="schedule-cell__class">${classObj ? classObj.name : 'N/A'}</div>
                    <div class="schedule-cell__subject">${data.subject || activityType.label}</div>
                </div>
            </div>
        `;
    } else {
        // Empty cell
        cell.classList.add('schedule-cell--empty');
        cell.innerHTML = `
            <div class="schedule-cell__content schedule-cell__content--empty">
                <span class="material-symbols-outlined schedule-cell__add-icon">add_circle</span>
                <span class="schedule-cell__add-text">Aggiungi</span>
            </div>
        `;
    }
    
    // Click handler
    cell.addEventListener('click', () => {
        onCellClick(dayIndex, time, data);
    });
    
    // Keyboard handler
    cell.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onCellClick(dayIndex, time, data);
        }
    });
    
    return cell;
}

/**
 * Render the complete schedule table
 * @param {HTMLElement} container - Container element for the schedule
 * @param {Object} scheduleData - Schedule data object with keys like 'Mon-08:00'
 * @param {Function} onCellClick - Callback when a cell is clicked
 */
export function renderScheduleTable(container, scheduleData, onCellClick) {
    if (!container) {
        console.error('Schedule container not found');
        return;
    }
    
    const timeSlots = generateTimeSlots();
    
    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'schedule-wrapper';
    
    // Create table
    const table = document.createElement('table');
    table.className = 'schedule-table';
    table.setAttribute('role', 'grid');
    table.setAttribute('aria-label', 'Orario settimanale delle lezioni');
    
    // Create header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    // Time column header
    const timeHeader = document.createElement('th');
    timeHeader.className = 'schedule-header schedule-header--time';
    timeHeader.innerHTML = '<span class="material-symbols-outlined">schedule</span> Ora';
    timeHeader.setAttribute('scope', 'col');
    headerRow.appendChild(timeHeader);
    
    // Day headers
    SCHEDULE_CONFIG.workingDays.forEach((day, index) => {
        const dayHeader = document.createElement('th');
        dayHeader.className = 'schedule-header schedule-header--day';
        dayHeader.setAttribute('scope', 'col');
        dayHeader.innerHTML = `
            <span class="schedule-header__day-full">${day}</span>
            <span class="schedule-header__day-abbr">${day.substring(0, 3)}</span>
        `;
        headerRow.appendChild(dayHeader);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create body
    const tbody = document.createElement('tbody');
    
    timeSlots.forEach(time => {
        const row = document.createElement('tr');
        
        // Time cell
        const timeCell = document.createElement('td');
        timeCell.className = 'schedule-time-cell';
        timeCell.innerHTML = `<span class="schedule-time-cell__time">${time}</span>`;
        timeCell.setAttribute('scope', 'row');
        row.appendChild(timeCell);
        
        // Day cells
        SCHEDULE_CONFIG.workingDays.forEach((day, dayIndex) => {
            const scheduleKey = `${day}-${time}`;
            const cellData = scheduleData[scheduleKey] || null;
            const cell = createScheduleCell(dayIndex, time, cellData, onCellClick);
            row.appendChild(cell);
        });
        
        tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    wrapper.appendChild(table);
    
    // Clear and append
    container.innerHTML = '';
    container.appendChild(wrapper);
}

/**
 * Create and show modal for editing schedule cell
 * @param {number} dayIndex - Day index
 * @param {string} time - Time slot
 * @param {Object|null} currentData - Current cell data
 * @param {Function} onSave - Callback when data is saved
 */
export function showScheduleEditModal(dayIndex, time, currentData, onSave) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'schedule-modal-overlay';
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'schedule-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'schedule-modal-title');
    modal.setAttribute('aria-modal', 'true');
    
    const day = SCHEDULE_CONFIG.workingDays[dayIndex];
    
    modal.innerHTML = `
        <div class="schedule-modal__header">
            <h2 id="schedule-modal-title" class="schedule-modal__title">
                <span class="material-symbols-outlined">edit_calendar</span>
                Modifica Orario - ${day} ${time}
            </h2>
            <button type="button" class="schedule-modal__close" aria-label="Chiudi">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>
        
        <div class="schedule-modal__body">
            <form id="schedule-edit-form">
                <div class="schedule-form-group">
                    <label for="schedule-class" class="schedule-form-label">
                        <span class="material-symbols-outlined">school</span>
                        Classe
                    </label>
                    <select id="schedule-class" class="schedule-form-control" required>
                        <option value="">Seleziona classe...</option>
                        ${state.classes.map(c => `
                            <option value="${c.id}" ${currentData?.classId === c.id ? 'selected' : ''}>
                                ${c.name}
                            </option>
                        `).join('')}
                    </select>
                </div>
                
                <div class="schedule-form-group">
                    <label for="schedule-subject" class="schedule-form-label">
                        <span class="material-symbols-outlined">subject</span>
                        Materia
                    </label>
                    <input 
                        type="text" 
                        id="schedule-subject" 
                        class="schedule-form-control" 
                        value="${currentData?.subject || ''}"
                        placeholder="Es: Matematica, Storia..."
                        required
                    />
                </div>
                
                <div class="schedule-form-group">
                    <label class="schedule-form-label">
                        <span class="material-symbols-outlined">category</span>
                        Tipo di Attività
                    </label>
                    <div class="schedule-activity-types">
                        ${Object.entries(ACTIVITY_TYPES).map(([key, type]) => `
                            <label class="schedule-activity-type">
                                <input 
                                    type="radio" 
                                    name="activityType" 
                                    value="${key}"
                                    ${currentData?.activityType === key || (!currentData && key === 'theory') ? 'checked' : ''}
                                />
                                <span class="schedule-activity-type__content" style="--activity-color: ${type.color}">
                                    <span class="material-symbols-outlined">${type.icon}</span>
                                    <span class="schedule-activity-type__label">${type.label}</span>
                                </span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            </form>
        </div>
        
        <div class="schedule-modal__footer">
            ${currentData ? `
                <button type="button" class="schedule-btn schedule-btn--danger" id="schedule-delete-btn">
                    <span class="material-symbols-outlined">delete</span>
                    Elimina
                </button>
            ` : ''}
            <div class="schedule-modal__actions">
                <button type="button" class="schedule-btn schedule-btn--secondary" id="schedule-cancel-btn">
                    Annulla
                </button>
                <button type="submit" form="schedule-edit-form" class="schedule-btn schedule-btn--primary">
                    <span class="material-symbols-outlined">check</span>
                    Salva
                </button>
            </div>
        </div>
    `;
    
    // Event handlers
    const form = modal.querySelector('#schedule-edit-form');
    const closeBtn = modal.querySelector('.schedule-modal__close');
    const cancelBtn = modal.querySelector('#schedule-cancel-btn');
    const deleteBtn = modal.querySelector('#schedule-delete-btn');
    
    const closeModal = () => {
        overlay.remove();
    };
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            classId: form.querySelector('#schedule-class').value,
            subject: form.querySelector('#schedule-subject').value,
            activityType: form.querySelector('input[name="activityType"]:checked').value
        };
        
        onSave(dayIndex, time, formData);
        closeModal();
    });
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            if (confirm('Sei sicuro di voler eliminare questa attività?')) {
                onSave(dayIndex, time, null); // null = delete
                closeModal();
            }
        });
    }
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    });
    
    // Append and show
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Focus first input
    setTimeout(() => {
        const firstInput = modal.querySelector('#schedule-class');
        if (firstInput) firstInput.focus();
    }, 100);
}

/**
 * Get activity type configuration
 * @param {string} type - Activity type key
 * @returns {Object} Activity type configuration
 */
export function getActivityType(type) {
    return ACTIVITY_TYPES[type] || ACTIVITY_TYPES.other;
}

/**
 * Get schedule configuration
 * @returns {Object} Schedule configuration
 */
export function getScheduleConfig() {
    return { ...SCHEDULE_CONFIG };
}

// Export activity types for external use
export { ACTIVITY_TYPES, SCHEDULE_CONFIG };
