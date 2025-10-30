/**
 * @file Lessons API Client
 * @description API client for managing lessons with mock data support
 * @module api/lessons
 */

import { MIME_TYPES } from '../../js/constants.js';

/**
 * @typedef {Object} Lesson
 * @property {string} id - Unique lesson identifier
 * @property {string} title - Lesson title
 * @property {string} teacher - Teacher name
 * @property {string} subject - Subject/materia
 * @property {string} date - Date in ISO format
 * @property {string} time - Time string (e.g., "14:00 - 15:00")
 * @property {number} duration - Duration in minutes
 * @property {string} classId - Class identifier
 * @property {string} className - Class name
 * @property {string} type - Activity type (Teoria, Laboratorio, etc.)
 * @property {string} status - Lesson status (scheduled, ongoing, completed)
 * @property {number} enrolledCount - Number of enrolled students
 * @property {number} maxCapacity - Maximum capacity
 */

/**
 * @typedef {Object} LessonsFilter
 * @property {string} [search] - Search query for title/teacher
 * @property {string} [subject] - Filter by subject
 * @property {string} [status] - Filter by status
 * @property {string} [dateFrom] - Filter from date (ISO format)
 * @property {string} [dateTo] - Filter to date (ISO format)
 */

/**
 * Mock lessons data for development
 * @type {Lesson[]}
 */
const mockLessons = [
    {
        id: 'lesson-001',
        title: 'Introduzione all\'Algebra Lineare',
        teacher: 'Prof. Mario Rossi',
        subject: 'Matematica',
        date: '2025-10-20',
        time: '08:00 - 09:00',
        duration: 60,
        classId: '3A',
        className: 'Classe 3A',
        type: 'Teoria',
        status: 'scheduled',
        enrolledCount: 18,
        maxCapacity: 25
    },
    {
        id: 'lesson-002',
        title: 'Esperimenti di Chimica Organica',
        teacher: 'Prof.ssa Laura Bianchi',
        subject: 'Scienze',
        date: '2025-10-20',
        time: '10:00 - 12:00',
        duration: 120,
        classId: '4B',
        className: 'Classe 4B',
        type: 'Laboratorio',
        status: 'scheduled',
        enrolledCount: 15,
        maxCapacity: 20
    },
    {
        id: 'lesson-003',
        title: 'Analisi del Testo: Dante Alighieri',
        teacher: 'Prof. Giuseppe Verdi',
        subject: 'Italiano',
        date: '2025-10-20',
        time: '14:00 - 15:00',
        duration: 60,
        classId: '5C',
        className: 'Classe 5C',
        type: 'Teoria',
        status: 'scheduled',
        enrolledCount: 22,
        maxCapacity: 25
    },
    {
        id: 'lesson-004',
        title: 'Grammatica Inglese Avanzata',
        teacher: 'Prof.ssa Anna Neri',
        subject: 'Inglese',
        date: '2025-10-20',
        time: '15:00 - 16:00',
        duration: 60,
        classId: '3A',
        className: 'Classe 3A',
        type: 'Teoria',
        status: 'scheduled',
        enrolledCount: 20,
        maxCapacity: 25
    },
    {
        id: 'lesson-005',
        title: 'Storia Contemporanea: Il Novecento',
        teacher: 'Prof. Marco Blu',
        subject: 'Storia',
        date: '2025-10-21',
        time: '09:00 - 10:00',
        duration: 60,
        classId: '5A',
        className: 'Classe 5A',
        type: 'Teoria',
        status: 'scheduled',
        enrolledCount: 23,
        maxCapacity: 25
    },
    {
        id: 'lesson-006',
        title: 'Educazione Fisica: Pallavolo',
        teacher: 'Prof. Luca Verde',
        subject: 'Educazione Fisica',
        date: '2025-10-21',
        time: '11:00 - 12:00',
        duration: 60,
        classId: '2B',
        className: 'Classe 2B',
        type: 'Pratica',
        status: 'scheduled',
        enrolledCount: 24,
        maxCapacity: 30
    },
    {
        id: 'lesson-007',
        title: 'Programmazione in Python',
        teacher: 'Prof.ssa Sofia Gialli',
        subject: 'Informatica',
        date: '2025-10-21',
        time: '14:00 - 16:00',
        duration: 120,
        classId: '4A',
        className: 'Classe 4A',
        type: 'Laboratorio',
        status: 'scheduled',
        enrolledCount: 16,
        maxCapacity: 20
    },
    {
        id: 'lesson-008',
        title: 'Fisica Quantistica Introduttiva',
        teacher: 'Prof. Roberto Viola',
        subject: 'Fisica',
        date: '2025-10-22',
        time: '08:00 - 09:00',
        duration: 60,
        classId: '5C',
        className: 'Classe 5C',
        type: 'Teoria',
        status: 'scheduled',
        enrolledCount: 19,
        maxCapacity: 25
    }
];

/**
 * Lessons API client
 * @class
 */
export class LessonsAPI {
    /**
     * @param {Object} config - Configuration options
     * @param {string} [config.baseURL] - Base URL for API (for future integration)
     * @param {boolean} [config.useMock=true] - Use mock data instead of real API
     */
    constructor(config = {}) {
        this.baseURL = config.baseURL || '/api';
        this.useMock = config.useMock !== false; // Default to true
    }

    /**
     * Get all lessons with optional filtering
     * @param {LessonsFilter} [filter={}] - Filter options
     * @returns {Promise<Lesson[]>} Array of lessons
     */
    async getLessons(filter = {}) {
        if (this.useMock) {
            return this._getMockLessons(filter);
        }

        // TODO: Replace with real API call when backend is ready
        try {
            const queryParams = new URLSearchParams(filter).toString();
            const response = await fetch(`${this.baseURL}/lessons?${queryParams}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching lessons:', error);
            // Fallback to mock data on error
            return this._getMockLessons(filter);
        }
    }

    /**
     * Get a single lesson by ID
     * @param {string} id - Lesson ID
     * @returns {Promise<Lesson|null>} Lesson object or null if not found
     */
    async getLesson(id) {
        if (this.useMock) {
            return this._getMockLesson(id);
        }

        // TODO: Replace with real API call
        try {
            const response = await fetch(`${this.baseURL}/lessons/${id}`);
            
            if (response.status === 404) {
                return null;
            }
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error fetching lesson ${id}:`, error);
            return this._getMockLesson(id);
        }
    }

    /**
     * Enroll in a lesson
     * @param {string} lessonId - Lesson ID
     * @returns {Promise<{success: boolean, message: string}>} Enrollment result
     */
    async enrollInLesson(lessonId) {
        if (this.useMock) {
            return this._mockEnroll(lessonId);
        }

        // TODO: Replace with real API call
        try {
            const response = await fetch(`${this.baseURL}/lessons/${lessonId}/enroll`, {
                method: 'POST',
                headers: {
                    'Content-Type': MIME_TYPES.APPLICATION_JSON
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error enrolling in lesson ${lessonId}:`, error);
            return { success: false, message: 'Errore durante l\'iscrizione' };
        }
    }

    /**
     * Get unique subjects from all lessons
     * @returns {Promise<string[]>} Array of unique subjects
     */
    async getSubjects() {
        const lessons = await this.getLessons();
        const subjects = [...new Set(lessons.map(l => l.subject))];
        return subjects.sort();
    }

    // Private mock methods

    /**
     * Get filtered mock lessons
     * @private
     * @param {LessonsFilter} filter - Filter options
     * @returns {Promise<Lesson[]>} Filtered lessons
     */
    async _getMockLessons(filter) {
        // Simulate network delay
        await this._delay(300);

        let filtered = [...mockLessons];

        // Apply search filter
        if (filter.search) {
            const searchLower = filter.search.toLowerCase();
            filtered = filtered.filter(lesson =>
                lesson.title.toLowerCase().includes(searchLower) ||
                lesson.teacher.toLowerCase().includes(searchLower)
            );
        }

        // Apply subject filter
        if (filter.subject) {
            filtered = filtered.filter(lesson => lesson.subject === filter.subject);
        }

        // Apply status filter
        if (filter.status) {
            filtered = filtered.filter(lesson => lesson.status === filter.status);
        }

        // Apply date range filter
        if (filter.dateFrom) {
            filtered = filtered.filter(lesson => lesson.date >= filter.dateFrom);
        }
        if (filter.dateTo) {
            filtered = filtered.filter(lesson => lesson.date <= filter.dateTo);
        }

        return filtered;
    }

    /**
     * Get single mock lesson by ID
     * @private
     * @param {string} id - Lesson ID
     * @returns {Promise<Lesson|null>} Lesson or null
     */
    async _getMockLesson(id) {
        await this._delay(200);
        return mockLessons.find(lesson => lesson.id === id) || null;
    }

    /**
     * Mock enrollment
     * @private
     * @param {string} lessonId - Lesson ID
     * @returns {Promise<{success: boolean, message: string}>}
     */
    async _mockEnroll(lessonId) {
        await this._delay(500);
        
        const lesson = mockLessons.find(l => l.id === lessonId);
        if (!lesson) {
            return { success: false, message: 'Lezione non trovata' };
        }

        if (lesson.enrolledCount >= lesson.maxCapacity) {
            return { success: false, message: 'Lezione al completo' };
        }

        // Simulate successful enrollment
        lesson.enrolledCount++;
        return { success: true, message: 'Iscrizione completata con successo!' };
    }

    /**
     * Simulate network delay
     * @private
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise<void>}
     */
    _delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Export singleton instance
export const lessonsAPI = new LessonsAPI();
