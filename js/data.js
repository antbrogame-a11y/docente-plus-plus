
// js/data.js

export const state = {
    settings: {},
    classes: [],
    students: [],
    lessons: [],
    activities: [],
    evaluations: [],
    schedule: {},
    events: [], // Agenda events
    chatMessages: [],
    activeClass: null,
};

// Safe JSON parse with fallback
function safeJSONParse(value, fallback) {
    if (!value) return fallback;
    try {
        const parsed = JSON.parse(value);
        // Validate that parsed data matches expected type
        if (Array.isArray(fallback)) {
            return Array.isArray(parsed) ? parsed : fallback;
        } else if (typeof fallback === 'object') {
            return (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) ? parsed : fallback;
        }
        return parsed;
    } catch (error) {
        console.warn('Failed to parse localStorage item:', error);
        return fallback;
    }
}

// Default schedule settings
export function getDefaultScheduleSettings() {
    return {
        hoursPerDay: 6,
        startTime: '08:00',
        endTime: '14:00',
        workingDays: [1, 2, 3, 4, 5], // Monday to Friday (0 = Sunday, 1 = Monday, etc.)
        slotDuration: 60 // minutes per slot
    };
}

export function loadData() {
    try {
        // First check if localStorage is accessible
        if (!checkStorageHealth()) {
            console.error('localStorage is not accessible');
            showStorageError();
            return false;
        }
        
        state.settings = safeJSONParse(localStorage.getItem('settings'), {});
        
        // Initialize schedule settings with defaults if not present
        if (!state.settings.schedule) {
            state.settings.schedule = getDefaultScheduleSettings();
        } else {
            // Merge with defaults to ensure all properties exist
            state.settings.schedule = { ...getDefaultScheduleSettings(), ...state.settings.schedule };
        }
        
        state.classes = safeJSONParse(localStorage.getItem('classes'), []);
        state.students = safeJSONParse(localStorage.getItem('students'), []);
        state.lessons = safeJSONParse(localStorage.getItem('lessons'), []);
        state.activities = safeJSONParse(localStorage.getItem('activities'), []);
        state.evaluations = safeJSONParse(localStorage.getItem('evaluations'), []);
        state.schedule = safeJSONParse(localStorage.getItem('schedule'), {});
        state.events = safeJSONParse(localStorage.getItem('events'), []);
        state.chatMessages = safeJSONParse(localStorage.getItem('chatMessages'), []);
        state.activeClass = localStorage.getItem('activeClass') || null;
        
        // Validate activeClass exists in classes array
        if (state.activeClass && !state.classes.find(c => c.id === state.activeClass)) {
            console.warn('Active class not found in classes array, resetting');
            state.activeClass = null;
        }
        
        return true;
    } catch (error) {
        console.error('Critical error loading data:', error);
        // Reset to defaults if data is completely corrupted
        resetToDefaults();
        return false;
    }
}

function showStorageError() {
    // Show a user-friendly error message when localStorage is not available
    if (typeof window !== 'undefined' && window.showToast) {
        window.showToast('Errore: localStorage non disponibile. Verifica le impostazioni del browser.', 'error', 10000);
    }
}

export function saveData() {
    try {
        localStorage.setItem('settings', JSON.stringify(state.settings));
        localStorage.setItem('classes', JSON.stringify(state.classes));
        localStorage.setItem('students', JSON.stringify(state.students));
        localStorage.setItem('lessons', JSON.stringify(state.lessons));
        localStorage.setItem('activities', JSON.stringify(state.activities));
        localStorage.setItem('evaluations', JSON.stringify(state.evaluations));
        localStorage.setItem('schedule', JSON.stringify(state.schedule));
        localStorage.setItem('events', JSON.stringify(state.events));
        localStorage.setItem('chatMessages', JSON.stringify(state.chatMessages));
        localStorage.setItem('activeClass', state.activeClass);
        return true;
    } catch (error) {
        console.error('Error saving data to localStorage:', error);
        // Could be quota exceeded or other storage error
        return false;
    }
}

export function isOnboardingComplete() {
    return localStorage.getItem('onboardingComplete') === 'true';
}

export function isProfileComplete() {
    // Check if the user has completed the essential profile information
    return isOnboardingComplete() && 
           state.settings.teacherName && 
           state.settings.teacherName.trim() !== '';
}

export function completeOnboarding(settings) {
    state.settings = settings;
    localStorage.setItem('onboardingComplete', 'true');
    saveData();
}

export function skipOnboarding() {
    // Don't allow skipping - user must complete onboarding
    // This ensures we never have an intermediate unclear state
    console.warn('Skipping onboarding is not allowed. User must complete profile setup.');
    return false;
}

export function resetToDefaults() {
    // Reset all state to defaults
    state.settings = {};
    state.classes = [];
    state.students = [];
    state.lessons = [];
    state.activities = [];
    state.evaluations = [];
    state.schedule = {};
    state.chatMessages = [];
    state.activeClass = null;
    
    console.warn('State reset to defaults due to corrupted data');
}

export function clearAllData() {
    // Clear all app data - for troubleshooting
    try {
        localStorage.clear();
        resetToDefaults();
        return true;
    } catch (error) {
        console.error('Error clearing localStorage:', error);
        return false;
    }
}

export function checkStorageHealth() {
    // Check if localStorage is accessible and working
    try {
        const testKey = '__docente_storage_test__';
        localStorage.setItem(testKey, 'test');
        const value = localStorage.getItem(testKey);
        localStorage.removeItem(testKey);
        return value === 'test';
    } catch (error) {
        console.error('localStorage is not available:', error);
        return false;
    }
}

/**
 * Recover from corrupted onboarding state
 * This ensures the app is always in a valid state
 */
export function recoverOnboardingState() {
    const onboardingComplete = isOnboardingComplete();
    const profileComplete = isProfileComplete();
    
    console.log('Checking onboarding state:', { onboardingComplete, profileComplete });
    
    // Case 1: Onboarding marked complete but profile is actually incomplete (corrupted state)
    if (onboardingComplete && !profileComplete) {
        console.warn('Detected corrupted onboarding state. Profile is incomplete despite onboarding flag.');
        // Keep onboarding flag but require profile completion
        return {
            needsOnboarding: false,
            needsProfileCompletion: true,
            reason: 'corrupted_profile'
        };
    }
    
    // Case 2: Normal incomplete onboarding
    if (!onboardingComplete) {
        return {
            needsOnboarding: true,
            needsProfileCompletion: false,
            reason: 'not_started'
        };
    }
    
    // Case 3: Everything is OK
    return {
        needsOnboarding: false,
        needsProfileCompletion: false,
        reason: 'complete'
    };
}

/**
 * Validate and fix onboarding state
 * @returns {boolean} True if state is valid or was fixed
 */
export function validateAndFixOnboardingState() {
    try {
        const recovery = recoverOnboardingState();
        
        if (recovery.reason === 'corrupted_profile') {
            console.log('Attempting to fix corrupted profile state...');
            // Check if we can recover any profile data
            if (state.settings.teacherName && state.settings.teacherName.trim() !== '') {
                console.log('Profile data recovered successfully');
                return true;
            } else {
                // Reset onboarding flag to force re-completion
                console.warn('Cannot recover profile data. Resetting onboarding flag.');
                localStorage.removeItem('onboardingComplete');
                return false;
            }
        }
        
        return recovery.reason === 'complete';
    } catch (error) {
        console.error('Error validating onboarding state:', error);
        return false;
    }
}

