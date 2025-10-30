
// js/planner.js
// Intelligent planner with AI-powered scheduling and material suggestions

import { state, saveData } from './data.js';
import { showToast } from './ui.js';

/**
 * Smart Planner Module
 * Handles intelligent scheduling, validation, and AI suggestions
 */

export class SmartPlanner {
    constructor() {
        // Scheduling rules
        this.rules = {
            hoursPerDay: 5,
            startHour: 8,
            endHour: 14, // Exclusive (8-13 = 5 hours)
            workDays: [1, 2, 3, 4, 5], // Monday to Friday
            timeSlots: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00']
        };
        
        this.aiSuggestionsEnabled = false; // TODO(AI): Enable when API integrated
    }

    /**
     * Validate if a schedule slot is within allowed rules
     */
    validateSlot(date, time) {
        const d = new Date(date);
        const dayOfWeek = d.getDay();
        const hour = parseInt(time.split(':')[0]);

        const errors = [];

        // Check if it's a weekday
        if (!this.rules.workDays.includes(dayOfWeek)) {
            errors.push('Le lezioni devono essere programmate dal lunedì al venerdì');
        }

        // Check if hour is within range
        if (hour < this.rules.startHour || hour >= this.rules.endHour) {
            errors.push(`L'orario deve essere tra le ${this.rules.startHour}:00 e le ${this.rules.endHour}:00`);
        }

        return {
            valid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Check if adding a slot would exceed daily hours limit
     */
    checkDailyLimit(date) {
        const dateStr = new Date(date).toISOString().split('T')[0];
        const slotsForDay = Object.keys(state.schedule).filter(key => key.startsWith(dateStr));
        
        const remaining = this.rules.hoursPerDay - slotsForDay.length;
        
        return {
            current: slotsForDay.length,
            limit: this.rules.hoursPerDay,
            remaining: Math.max(0, remaining),
            exceeded: slotsForDay.length >= this.rules.hoursPerDay
        };
    }

    /**
     * Get available time slots for a given date
     */
    getAvailableSlots(date) {
        const validation = this.validateSlot(date, '08:00');
        if (!validation.valid) {
            return [];
        }

        const dateStr = new Date(date).toISOString().split('T')[0];
        const occupiedSlots = Object.keys(state.schedule)
            .filter(key => key.startsWith(dateStr))
            .map(key => {
                const parts = key.split('-');
                return `${parts[3]}:00`;
            });

        return this.rules.timeSlots.filter(slot => !occupiedSlots.includes(slot));
    }

    /**
     * Suggest optimal time slots based on context
     * TODO(AI): Integrate real AI suggestions
     */
    async suggestTimeSlots(classId, activityType, date) {
        const available = this.getAvailableSlots(date);
        
        if (available.length === 0) {
            return {
                suggestions: [],
                message: 'Nessuno slot disponibile per questa data (limite 5 ore/giorno raggiunto)'
            };
        }

        // Simple heuristic-based suggestions (replace with AI later)
        const suggestions = this.generateHeuristicSuggestions(available, activityType);

        return {
            suggestions: suggestions,
            message: `${suggestions.length} slot suggeriti in base al tipo di attività`,
            aiPowered: false // TODO(AI): Set to true when using real AI
        };
    }

    generateHeuristicSuggestions(availableSlots, activityType) {
        // Activity type preferences (heuristic)
        const preferences = {
            'theory': { preferredHours: [8, 9, 10], priority: 'morning' },
            'lab': { preferredHours: [10, 11, 12], priority: 'midday' },
            'drawing': { preferredHours: [11, 12, 13], priority: 'afternoon' },
            'exercise': { preferredHours: [9, 10, 11], priority: 'morning' },
            'test': { preferredHours: [9, 10], priority: 'early' }
        };

        const pref = preferences[activityType] || preferences['theory'];
        
        // Score each slot
        const scoredSlots = availableSlots.map(slot => {
            const hour = parseInt(slot.split(':')[0]);
            const isPreferred = pref.preferredHours.includes(hour);
            const score = isPreferred ? 10 : 5;
            
            return {
                time: slot,
                score: score,
                reason: isPreferred 
                    ? `Orario ottimale per ${activityType}` 
                    : 'Orario disponibile'
            };
        });

        // Sort by score
        scoredSlots.sort((a, b) => b.score - a.score);

        return scoredSlots;
    }

    /**
     * Suggest activities for a time slot
     * TODO(AI): AI-powered activity suggestions
     */
    async suggestActivities(classId, date, time) {
        if (!classId) {
            return {
                suggestions: [],
                message: 'Seleziona una classe per ricevere suggerimenti'
            };
        }

        // Get activities for this class
        const classActivities = state.activities.filter(a => a.classId === classId);
        
        // Filter by status and date relevance
        const relevantActivities = classActivities.filter(a => {
            const activityDate = new Date(a.date);
            const slotDate = new Date(date);
            const daysDiff = Math.floor((activityDate - slotDate) / (1000 * 60 * 60 * 24));
            
            // Suggest activities due within next 7 days or already in progress
            return (a.status === 'in-progress' || a.status === 'planned') && daysDiff <= 7;
        });

        // Score activities (simple heuristic)
        const scoredActivities = relevantActivities.map(a => {
            let score = 5;
            const hour = parseInt(time.split(':')[0]);
            
            // Boost score based on activity type and time
            if (a.type === 'test' && hour >= 9 && hour <= 10) score += 5;
            if (a.type === 'lab' && hour >= 10 && hour <= 12) score += 5;
            if (a.status === 'in-progress') score += 3;
            
            return {
                activity: a,
                score: score,
                reason: this.getActivitySuggestionReason(a, hour)
            };
        });

        scoredActivities.sort((a, b) => b.score - a.score);

        return {
            suggestions: scoredActivities.slice(0, 5), // Top 5
            message: scoredActivities.length > 0 
                ? `${scoredActivities.length} attività suggerite in base al contesto`
                : 'Nessuna attività pianificata per questa classe',
            aiPowered: false // TODO(AI): Set to true when using real AI
        };
    }

    getActivitySuggestionReason(activity, hour) {
        const reasons = [];
        
        if (activity.status === 'in-progress') {
            reasons.push('In corso');
        }
        
        if (activity.type === 'test' && hour >= 9 && hour <= 10) {
            reasons.push('Orario ottimale per verifiche');
        } else if (activity.type === 'lab' && hour >= 10 && hour <= 12) {
            reasons.push('Orario ideale per laboratorio');
        }

        const daysUntilDue = Math.floor((new Date(activity.date) - new Date()) / (1000 * 60 * 60 * 24));
        if (daysUntilDue <= 3) {
            reasons.push(`Scadenza tra ${daysUntilDue} giorni`);
        }

        return reasons.length > 0 ? reasons.join(', ') : 'Attività pianificata';
    }

    /**
     * Suggest materials for a slot
     * TODO(AI): AI-powered material generation
     */
    async suggestMaterials(classId, activityType, subject, date) {
        // TODO(AI): Integrate AI material generation
        // For now, return template-based suggestions
        
        const templates = this.getMaterialTemplates(activityType, subject);
        
        return {
            suggestions: templates,
            message: 'Suggerimenti basati su template. Integrazione IA in arrivo per materiali personalizzati.',
            aiPowered: false
        };
    }

    getMaterialTemplates(activityType, subject) {
        const templates = {
            'theory': [
                {
                    title: 'Presentazione Teorica',
                    type: 'slides',
                    description: 'Slide introduttive con concetti chiave',
                    icon: '📊'
                },
                {
                    title: 'Dispensa PDF',
                    type: 'document',
                    description: 'Documento riepilogativo degli argomenti',
                    icon: '📄'
                },
                {
                    title: 'Mappa Concettuale',
                    type: 'visual',
                    description: 'Schema visivo dei collegamenti tra concetti',
                    icon: '🗺️'
                }
            ],
            'lab': [
                {
                    title: 'Guida Laboratorio',
                    type: 'worksheet',
                    description: 'Istruzioni step-by-step per l\'esperimento',
                    icon: '🔬'
                },
                {
                    title: 'Scheda Osservazioni',
                    type: 'form',
                    description: 'Template per registrare risultati',
                    icon: '📝'
                }
            ],
            'test': [
                {
                    title: 'Griglia Valutazione',
                    type: 'rubric',
                    description: 'Criteri di valutazione della verifica',
                    icon: '✅'
                },
                {
                    title: 'Test Simulazione',
                    type: 'quiz',
                    description: 'Domande di esempio per preparazione',
                    icon: '❓'
                }
            ]
        };

        return templates[activityType] || templates['theory'];
    }

    /**
     * Auto-schedule activities based on constraints
     * TODO(AI): AI-powered optimal scheduling
     */
    async autoSchedule(activities, startDate, endDate, classId) {
        // TODO(AI): Implement intelligent auto-scheduling
        // For now, simple sequential scheduling
        
        const scheduledActivities = [];
        let currentDate = new Date(startDate);
        const end = new Date(endDate);

        for (const activity of activities) {
            while (currentDate <= end) {
                // Skip weekends
                if (this.rules.workDays.includes(currentDate.getDay())) {
                    const availableSlots = this.getAvailableSlots(currentDate);
                    
                    if (availableSlots.length > 0) {
                        // Schedule in first available slot
                        const time = availableSlots[0];
                        const dateStr = currentDate.toISOString().split('T')[0];
                        const key = `${dateStr}-${time.split(':')[0]}`;
                        
                        scheduledActivities.push({
                            activity: activity,
                            date: dateStr,
                            time: time,
                            key: key
                        });
                        
                        // Move to next day for next activity
                        currentDate.setDate(currentDate.getDate() + 1);
                        break;
                    }
                }
                
                currentDate.setDate(currentDate.getDate() + 1);
            }

            if (currentDate > end) {
                break; // Can't schedule remaining activities
            }
        }

        return {
            scheduled: scheduledActivities,
            message: `${scheduledActivities.length} di ${activities.length} attività programmate automaticamente`,
            unscheduled: activities.length - scheduledActivities.length
        };
    }

    /**
     * Validate entire schedule for conflicts and rule violations
     */
    validateSchedule() {
        const issues = [];
        const dates = {};

        // Group by date
        Object.keys(state.schedule).forEach(key => {
            const dateStr = key.substring(0, 10); // YYYY-MM-DD
            if (!dates[dateStr]) {
                dates[dateStr] = [];
            }
            dates[dateStr].push(key);
        });

        // Check each date
        Object.entries(dates).forEach(([dateStr, keys]) => {
            // Check daily limit
            if (keys.length > this.rules.hoursPerDay) {
                issues.push({
                    type: 'daily_limit',
                    date: dateStr,
                    message: `${keys.length} ore programmate (limite: ${this.rules.hoursPerDay})`,
                    severity: 'error'
                });
            }

            // Check if it's a weekday
            const date = new Date(dateStr);
            if (!this.rules.workDays.includes(date.getDay())) {
                issues.push({
                    type: 'weekend',
                    date: dateStr,
                    message: 'Lezione programmata nel weekend',
                    severity: 'warning'
                });
            }

            // Check time range
            keys.forEach(key => {
                const hour = parseInt(key.split('-')[3]);
                if (hour < this.rules.startHour || hour >= this.rules.endHour) {
                    issues.push({
                        type: 'time_range',
                        date: dateStr,
                        time: `${hour}:00`,
                        message: `Orario fuori dal range consentito (${this.rules.startHour}:00-${this.rules.endHour}:00)`,
                        severity: 'error'
                    });
                }
            });
        });

        return {
            valid: issues.filter(i => i.severity === 'error').length === 0,
            issues: issues,
            summary: `${issues.length} problemi rilevati`
        };
    }

    /**
     * Get schedule statistics
     */
    getScheduleStats(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const stats = {
            totalSlots: 0,
            occupiedSlots: 0,
            byClass: {},
            byActivityType: {},
            byDayOfWeek: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0},
            byHour: {}
        };

        Object.entries(state.schedule).forEach(([key, slot]) => {
            const [year, month, day, hour] = key.split('-').map(Number);
            const slotDate = new Date(year, month - 1, day);

            if (slotDate >= start && slotDate <= end) {
                stats.occupiedSlots++;

                // By class
                if (slot.classId) {
                    stats.byClass[slot.classId] = (stats.byClass[slot.classId] || 0) + 1;
                }

                // By activity type
                if (slot.activityType) {
                    stats.byActivityType[slot.activityType] = (stats.byActivityType[slot.activityType] || 0) + 1;
                }

                // By day of week
                const dayOfWeek = slotDate.getDay();
                if (stats.byDayOfWeek[dayOfWeek] !== undefined) {
                    stats.byDayOfWeek[dayOfWeek]++;
                }

                // By hour
                stats.byHour[hour] = (stats.byHour[hour] || 0) + 1;
            }
        });

        // Calculate total possible slots
        let currentDate = new Date(start);
        while (currentDate <= end) {
            if (this.rules.workDays.includes(currentDate.getDay())) {
                stats.totalSlots += this.rules.hoursPerDay;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        stats.utilizationRate = stats.totalSlots > 0 
            ? Math.round((stats.occupiedSlots / stats.totalSlots) * 100) 
            : 0;

        return stats;
    }

    /**
     * Suggest replanning based on current schedule
     * TODO(AI): AI-powered replanning
     */
    async suggestReplanning() {
        const validation = this.validateSchedule();
        
        if (validation.valid && validation.issues.length === 0) {
            return {
                needed: false,
                message: 'L\'orario attuale è ottimale, nessun ripianificazione necessaria'
            };
        }

        // Generate suggestions to fix issues
        const suggestions = [];
        
        validation.issues.forEach(issue => {
            if (issue.type === 'daily_limit') {
                suggestions.push({
                    type: 'move',
                    message: `Spostare alcune lezioni da ${issue.date} ad altri giorni`,
                    priority: 'high'
                });
            } else if (issue.type === 'weekend') {
                suggestions.push({
                    type: 'move',
                    message: `Rimuovere lezioni programmate nel weekend (${issue.date})`,
                    priority: 'critical'
                });
            } else if (issue.type === 'time_range') {
                suggestions.push({
                    type: 'reschedule',
                    message: `Riprogrammare lezione fuori orario in ${issue.date} alle ${issue.time}`,
                    priority: 'high'
                });
            }
        });

        return {
            needed: true,
            issues: validation.issues,
            suggestions: suggestions,
            message: `${suggestions.length} suggerimenti per migliorare l'orario`,
            aiPowered: false // TODO(AI): Set to true when using real AI
        };
    }
}

// Create singleton instance
export const smartPlanner = new SmartPlanner();

// Make available globally
if (typeof window !== 'undefined') {
    window.smartPlanner = smartPlanner;
}
