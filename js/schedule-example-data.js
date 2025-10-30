/**
 * Example data and configuration for the Schedule Component
 * This file demonstrates how to use the schedule component with sample data
 */

// Example schedule data structure
export const exampleScheduleData = {
    // Key format: "DayName-Time"
    // Example: "Lunedì-08:00"
    
    // Monday schedule
    "Lunedì-08:00": {
        classId: "class-1",
        subject: "Matematica",
        activityType: "theory"
    },
    "Lunedì-09:00": {
        classId: "class-1",
        subject: "Italiano",
        activityType: "practice"
    },
    "Lunedì-10:00": {
        classId: "class-2",
        subject: "Scienze",
        activityType: "lab"
    },
    "Lunedì-11:00": {
        classId: "class-2",
        subject: "Storia",
        activityType: "theory"
    },
    
    // Tuesday schedule
    "Martedì-08:00": {
        classId: "class-1",
        subject: "Inglese",
        activityType: "theory"
    },
    "Martedì-09:00": {
        classId: "class-1",
        subject: "Geografia",
        activityType: "practice"
    },
    "Martedì-10:00": {
        classId: "class-2",
        subject: "Matematica",
        activityType: "test"
    },
    "Martedì-12:00": {
        classId: "class-3",
        subject: "Arte",
        activityType: "practice"
    },
    
    // Wednesday schedule
    "Mercoledì-08:00": {
        classId: "class-1",
        subject: "Musica",
        activityType: "practice"
    },
    "Mercoledì-09:00": {
        classId: "class-2",
        subject: "Educazione Fisica",
        activityType: "group"
    },
    "Mercoledì-11:00": {
        classId: "class-3",
        subject: "Scienze",
        activityType: "lab"
    },
    "Mercoledì-13:00": {
        classId: "class-3",
        subject: "Italiano",
        activityType: "theory"
    },
    
    // Thursday schedule
    "Giovedì-08:00": {
        classId: "class-2",
        subject: "Storia",
        activityType: "theory"
    },
    "Giovedì-09:00": {
        classId: "class-2",
        subject: "Geografia",
        activityType: "practice"
    },
    "Giovedì-10:00": {
        classId: "class-1",
        subject: "Matematica",
        activityType: "test"
    },
    "Giovedì-12:00": {
        classId: "class-3",
        subject: "Inglese",
        activityType: "group"
    },
    
    // Friday schedule
    "Venerdì-08:00": {
        classId: "class-1",
        subject: "Arte",
        activityType: "practice"
    },
    "Venerdì-10:00": {
        classId: "class-2",
        subject: "Italiano",
        activityType: "theory"
    },
    "Venerdì-11:00": {
        classId: "class-3",
        subject: "Matematica",
        activityType: "theory"
    },
    "Venerdì-13:00": {
        classId: "class-3",
        subject: "Scienze",
        activityType: "lab"
    }
};

// Example classes data
export const exampleClasses = [
    {
        id: "class-1",
        name: "1A",
        schoolYear: "2024-2025",
        description: "Classe prima sezione A"
    },
    {
        id: "class-2",
        name: "2B",
        schoolYear: "2024-2025",
        description: "Classe seconda sezione B"
    },
    {
        id: "class-3",
        name: "3C",
        schoolYear: "2024-2025",
        description: "Classe terza sezione C"
    }
];

// Activity types configuration (already defined in schedule-component.js)
export const activityTypesConfig = {
    theory: {
        label: 'Teoria/Lezione',
        icon: 'menu_book',
        color: '#1976D2',
        description: 'Lezione teorica frontale'
    },
    practice: {
        label: 'Disegno/Pratica',
        icon: 'draw',
        color: '#0097A7',
        description: 'Attività pratica o di disegno'
    },
    lab: {
        label: 'Laboratorio',
        icon: 'science',
        color: '#00796B',
        description: 'Attività di laboratorio sperimentale'
    },
    test: {
        label: 'Verifica',
        icon: 'quiz',
        color: '#5E35B1',
        description: 'Verifica o test di valutazione'
    },
    group: {
        label: 'Lavoro di Gruppo',
        icon: 'groups',
        color: '#43A047',
        description: 'Lavoro collaborativo in gruppo'
    },
    other: {
        label: 'Altro',
        icon: 'more_horiz',
        color: '#757575',
        description: 'Altra attività'
    }
};

// Configuration constants
export const scheduleConfig = {
    hoursPerDay: 6,
    startHour: 8,
    startMinute: 0,
    endHour: 14,
    workingDays: ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì'],
    weekendDays: ['Sabato', 'Domenica']
};

/**
 * Helper function to generate an empty schedule structure
 * @returns {Object} Empty schedule data object
 */
export function generateEmptySchedule() {
    // Return an empty object - the component will handle missing slots as empty
    return {};
}

/**
 * Helper function to validate schedule data
 * @param {Object} scheduleData - Schedule data to validate
 * @returns {boolean} Whether the schedule data is valid
 */
export function validateScheduleData(scheduleData) {
    if (!scheduleData || typeof scheduleData !== 'object') {
        return false;
    }
    
    for (const [key, value] of Object.entries(scheduleData)) {
        if (value !== null) {
            // Check required fields
            if (!value.classId || !value.subject || !value.activityType) {
                console.warn(`Invalid schedule entry at ${key}:`, value);
                return false;
            }
            
            // Check activity type is valid
            if (!activityTypesConfig[value.activityType]) {
                console.warn(`Invalid activity type at ${key}:`, value.activityType);
                return false;
            }
        }
    }
    
    return true;
}

/**
 * Helper function to get schedule for a specific day
 * @param {Object} scheduleData - Full schedule data
 * @param {string} dayName - Day name (e.g., 'Lunedì')
 * @returns {Object} Schedule entries for the specified day
 */
export function getScheduleForDay(scheduleData, dayName) {
    const daySchedule = {};
    
    for (const [key, value] of Object.entries(scheduleData)) {
        if (key.startsWith(dayName + '-')) {
            daySchedule[key] = value;
        }
    }
    
    return daySchedule;
}

/**
 * Helper function to count occupied slots
 * @param {Object} scheduleData - Schedule data
 * @returns {Object} Statistics about the schedule
 */
export function getScheduleStats(scheduleData) {
    // Calculate total possible slots from configuration
    const totalSlots = scheduleConfig.workingDays.length * scheduleConfig.hoursPerDay;
    let occupiedSlots = 0;
    const classCounts = {};
    const activityTypeCounts = {};
    
    // Count only non-null entries as occupied
    for (const [key, value] of Object.entries(scheduleData)) {
        if (value !== null && value !== undefined) {
            occupiedSlots++;
            
            // Count by class
            if (value.classId) {
                classCounts[value.classId] = (classCounts[value.classId] || 0) + 1;
            }
            
            // Count by activity type
            if (value.activityType) {
                activityTypeCounts[value.activityType] = (activityTypeCounts[value.activityType] || 0) + 1;
            }
        }
    }
    
    return {
        totalSlots,
        occupiedSlots,
        emptySlots: totalSlots - occupiedSlots,
        occupancyRate: totalSlots > 0 ? (occupiedSlots / totalSlots * 100).toFixed(1) + '%' : '0%',
        classCounts,
        activityTypeCounts
    };
}

// Export default for easy importing
export default {
    exampleScheduleData,
    exampleClasses,
    activityTypesConfig,
    scheduleConfig,
    generateEmptySchedule,
    validateScheduleData,
    getScheduleForDay,
    getScheduleStats
};
