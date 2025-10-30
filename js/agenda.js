// js/agenda.js - Agenda management module

import { state, saveData } from './data.js';
import { showToast } from './ui.js';

/**
 * Generate a unique event ID
 */
function generateEventId() {
    return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Get all events for a specific date range
 * @param {Date} startDate 
 * @param {Date} endDate 
 * @returns {Array} Array of events in the date range
 */
export function getEventsInRange(startDate, endDate) {
    return state.events.filter(event => {
        const eventStart = new Date(event.start);
        return eventStart >= startDate && eventStart <= endDate;
    }).sort((a, b) => new Date(a.start) - new Date(b.start));
}

/**
 * Get events for a specific date
 * @param {Date} date 
 * @returns {Array} Array of events on that date
 */
export function getEventsForDate(date) {
    const dateStr = date.toISOString().split('T')[0];
    return state.events.filter(event => {
        const eventDateStr = new Date(event.start).toISOString().split('T')[0];
        return eventDateStr === dateStr;
    }).sort((a, b) => new Date(a.start) - new Date(b.start));
}

/**
 * Create a new event
 * @param {Object} eventData 
 * @returns {Object} The created event
 */
export function createEvent(eventData) {
    const newEvent = {
        id: generateEventId(),
        title: eventData.title,
        start: eventData.start,
        end: eventData.end,
        type: eventData.type || 'evento',
        note: eventData.note || '',
        linkedToOrario: eventData.linkedToOrario || false,
        classId: eventData.classId || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    state.events.push(newEvent);
    saveData();
    
    return newEvent;
}

/**
 * Update an existing event
 * @param {string} eventId 
 * @param {Object} updates 
 * @returns {Object|null} The updated event or null if not found
 */
export function updateEvent(eventId, updates) {
    const eventIndex = state.events.findIndex(e => e.id === eventId);
    
    if (eventIndex === -1) {
        return null;
    }
    
    state.events[eventIndex] = {
        ...state.events[eventIndex],
        ...updates,
        updatedAt: new Date().toISOString()
    };
    
    saveData();
    
    return state.events[eventIndex];
}

/**
 * Delete an event
 * @param {string} eventId 
 * @returns {boolean} True if deleted, false if not found
 */
export function deleteEvent(eventId) {
    const eventIndex = state.events.findIndex(e => e.id === eventId);
    
    if (eventIndex === -1) {
        return false;
    }
    
    state.events.splice(eventIndex, 1);
    saveData();
    
    return true;
}

/**
 * Get event by ID
 * @param {string} eventId 
 * @returns {Object|null} The event or null if not found
 */
export function getEventById(eventId) {
    return state.events.find(e => e.id === eventId) || null;
}

/**
 * Get event type information (icon, label, color)
 * @param {string} type 
 * @returns {Object} Type information
 */
export function getEventTypeInfo(type) {
    const types = {
        'lezione': { icon: '📚', label: 'Lezione', color: '#3498db' },
        'compito': { icon: '📝', label: 'Compito', color: '#e67e22' },
        'verifica': { icon: '✏️', label: 'Verifica', color: '#e74c3c' },
        'progetto': { icon: '📊', label: 'Progetto', color: '#9b59b6' },
        'evento': { icon: '📅', label: 'Evento', color: '#27ae60' },
        'riunione': { icon: '👥', label: 'Riunione', color: '#34495e' },
        'laboratorio': { icon: '🔬', label: 'Laboratorio', color: '#16a085' },
        'gita': { icon: '🚌', label: 'Gita', color: '#f39c12' }
    };
    
    return types[type] || { icon: '📌', label: 'Altro', color: '#95a5a6' };
}

/**
 * Generate smart suggestions based on upcoming events and schedule
 * @returns {Array} Array of suggestion objects
 */
export function generateSmartSuggestions() {
    const suggestions = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    // Check for lessons tomorrow
    const tomorrowEvents = getEventsForDate(tomorrow);
    const tomorrowLessons = tomorrowEvents.filter(e => e.type === 'lezione');
    
    if (tomorrowLessons.length > 0) {
        suggestions.push({
            type: 'preparation',
            icon: '📚',
            message: `Hai ${tomorrowLessons.length} lezione/i domani. Prepara i materiali!`,
            priority: 'high',
            action: 'viewAgenda'
        });
    }
    
    // Check for tests in the next week
    const upcomingEvents = getEventsInRange(today, nextWeek);
    const upcomingTests = upcomingEvents.filter(e => e.type === 'verifica');
    
    if (upcomingTests.length > 0 && upcomingTests.length < 3) {
        suggestions.push({
            type: 'test',
            icon: '✏️',
            message: `${upcomingTests.length} verifica/e questa settimana. Prepara gli studenti!`,
            priority: 'medium',
            action: 'viewAgenda'
        });
    } else if (upcomingTests.length === 0) {
        suggestions.push({
            type: 'suggestion',
            icon: '💡',
            message: 'Nessuna verifica pianificata questa settimana. Considera di aggiungerne una.',
            priority: 'low',
            action: 'addEvent'
        });
    }
    
    // Check for homework deadlines
    const upcomingHomework = upcomingEvents.filter(e => e.type === 'compito');
    if (upcomingHomework.length > 0) {
        suggestions.push({
            type: 'homework',
            icon: '📝',
            message: `${upcomingHomework.length} compito/i in scadenza questa settimana.`,
            priority: 'medium',
            action: 'viewAgenda'
        });
    }
    
    // Check for events without notes
    const eventsWithoutNotes = upcomingEvents.filter(e => !e.note || e.note.trim() === '');
    if (eventsWithoutNotes.length > 3) {
        suggestions.push({
            type: 'reminder',
            icon: '📋',
            message: `${eventsWithoutNotes.length} eventi senza note. Aggiungi dettagli!`,
            priority: 'low',
            action: 'viewAgenda'
        });
    }
    
    return suggestions;
}

/**
 * Link an event to a schedule slot
 * @param {string} eventId 
 * @param {string} scheduleKey 
 * @returns {boolean} Success
 */
export function linkEventToSchedule(eventId, scheduleKey) {
    const event = getEventById(eventId);
    if (!event) {
        return false;
    }
    
    // Update event to mark it as linked
    updateEvent(eventId, { 
        linkedToOrario: true,
        scheduleKey: scheduleKey 
    });
    
    return true;
}

/**
 * Create event from schedule slot
 * @param {Object} slot Schedule slot data
 * @param {Date} date Date of the slot
 * @param {string} time Time of the slot
 * @returns {Object} Created event
 */
export function createEventFromScheduleSlot(slot, date, time) {
    const classObj = state.classes.find(c => c.id === slot.classId);
    const className = classObj ? classObj.name : 'Classe';
    
    const [hour, minute] = time.split(':');
    const startDate = new Date(date);
    startDate.setHours(parseInt(hour), parseInt(minute), 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1); // Default 1 hour duration
    
    const eventData = {
        title: `Lezione ${className}`,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        type: 'lezione',
        note: `Attività: ${slot.activityType || 'Non specificata'}`,
        linkedToOrario: true,
        classId: slot.classId
    };
    
    return createEvent(eventData);
}

/**
 * Get recurring event suggestions based on schedule
 * @returns {Array} Array of recurring event suggestions
 */
export function getRecurringEventSuggestions() {
    const suggestions = [];
    const workingDays = state.settings.schedule?.workingDays || [1, 2, 3, 4, 5];
    
    // Suggest weekly recurring events based on schedule
    Object.entries(state.schedule).forEach(([key, slot]) => {
        if (slot.classId) {
            const classObj = state.classes.find(c => c.id === slot.classId);
            if (classObj) {
                suggestions.push({
                    type: 'recurring',
                    title: `Lezione ricorrente: ${classObj.name}`,
                    schedule: key,
                    frequency: 'weekly'
                });
            }
        }
    });
    
    return suggestions;
}
