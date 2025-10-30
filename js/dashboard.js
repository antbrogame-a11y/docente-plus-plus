
// js/dashboard.js
// Advanced dashboard with filters, search, and real-time class status

import { state } from './data.js';

/**
 * Advanced Dashboard Module
 * Provides filtering, searching, and real-time status tracking
 */

export class AdvancedDashboard {
    constructor() {
        this.filters = {
            dateRange: 'all', // all, today, week, month, custom
            classId: 'all',
            subject: 'all',
            status: 'all',
            customStartDate: null,
            customEndDate: null
        };
        
        this.searchQuery = '';
        this.sortBy = 'date';
        this.sortOrder = 'desc';
    }

    /**
     * Apply filters to data
     */
    applyFilters(data, type) {
        let filtered = [...data];

        // Date range filter
        if (this.filters.dateRange !== 'all') {
            filtered = this.filterByDateRange(filtered);
        }

        // Class filter
        if (this.filters.classId !== 'all') {
            filtered = filtered.filter(item => item.classId === this.filters.classId);
        }

        // Subject filter (for lessons)
        if (type === 'lessons' && this.filters.subject !== 'all') {
            filtered = filtered.filter(item => item.subject === this.filters.subject);
        }

        // Status filter (for activities)
        if (type === 'activities' && this.filters.status !== 'all') {
            filtered = filtered.filter(item => item.status === this.filters.status);
        }

        // Search query
        if (this.searchQuery) {
            filtered = this.applySearch(filtered, type);
        }

        // Sort
        filtered = this.applySorting(filtered, type);

        return filtered;
    }

    /**
     * Filter by date range
     */
    filterByDateRange(data) {
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const getItemDate = (item) => {
            const date = new Date(item.date);
            date.setHours(0, 0, 0, 0);
            return date;
        };

        switch (this.filters.dateRange) {
            case 'today':
                return data.filter(item => {
                    const itemDate = getItemDate(item);
                    return itemDate.getTime() === now.getTime();
                });

            case 'week':
                const weekStart = new Date(now);
                weekStart.setDate(now.getDate() - now.getDay() + 1); // Monday
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekStart.getDate() + 6); // Sunday
                
                return data.filter(item => {
                    const itemDate = getItemDate(item);
                    return itemDate >= weekStart && itemDate <= weekEnd;
                });

            case 'month':
                const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
                const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                
                return data.filter(item => {
                    const itemDate = getItemDate(item);
                    return itemDate >= monthStart && itemDate <= monthEnd;
                });

            case 'custom':
                if (this.filters.customStartDate && this.filters.customEndDate) {
                    const start = new Date(this.filters.customStartDate);
                    const end = new Date(this.filters.customEndDate);
                    
                    return data.filter(item => {
                        const itemDate = getItemDate(item);
                        return itemDate >= start && itemDate <= end;
                    });
                }
                return data;

            default:
                return data;
        }
    }

    /**
     * Apply search to data
     */
    applySearch(data, type) {
        const query = this.searchQuery.toLowerCase();

        return data.filter(item => {
            // Search in common fields
            const searchableFields = [];
            
            if (item.title) searchableFields.push(item.title);
            if (item.name) searchableFields.push(item.name);
            if (item.description) searchableFields.push(item.description);
            if (item.subject) searchableFields.push(item.subject);
            if (item.notes) searchableFields.push(item.notes);
            if (item.email) searchableFields.push(item.email);

            // Search in class name if classId exists
            if (item.classId) {
                const classObj = state.classes.find(c => c.id === item.classId);
                if (classObj) searchableFields.push(classObj.name);
            }

            return searchableFields.some(field => 
                field && field.toLowerCase().includes(query)
            );
        });
    }

    /**
     * Apply sorting to data
     */
    applySorting(data, type) {
        const sorted = [...data];

        sorted.sort((a, b) => {
            let compareValue = 0;

            switch (this.sortBy) {
                case 'date':
                    const dateA = new Date(a.date || a.createdAt || 0);
                    const dateB = new Date(b.date || b.createdAt || 0);
                    compareValue = dateA - dateB;
                    break;

                case 'name':
                case 'title':
                    const nameA = (a.name || a.title || '').toLowerCase();
                    const nameB = (b.name || b.title || '').toLowerCase();
                    compareValue = nameA.localeCompare(nameB);
                    break;

                case 'class':
                    const classA = this.getClassName(a.classId);
                    const classB = this.getClassName(b.classId);
                    compareValue = classA.localeCompare(classB);
                    break;

                case 'status':
                    const statusA = a.status || '';
                    const statusB = b.status || '';
                    compareValue = statusA.localeCompare(statusB);
                    break;

                default:
                    compareValue = 0;
            }

            return this.sortOrder === 'asc' ? compareValue : -compareValue;
        });

        return sorted;
    }

    getClassName(classId) {
        if (!classId) return '';
        const classObj = state.classes.find(c => c.id === classId);
        return classObj ? classObj.name : '';
    }

    /**
     * Set filter
     */
    setFilter(filterName, value) {
        this.filters[filterName] = value;
    }

    /**
     * Set search query
     */
    setSearch(query) {
        this.searchQuery = query;
    }

    /**
     * Set sorting
     */
    setSorting(sortBy, sortOrder) {
        this.sortBy = sortBy;
        this.sortOrder = sortOrder;
    }

    /**
     * Reset filters
     */
    resetFilters() {
        this.filters = {
            dateRange: 'all',
            classId: 'all',
            subject: 'all',
            status: 'all',
            customStartDate: null,
            customEndDate: null
        };
        this.searchQuery = '';
    }

    /**
     * Get class status summary
     */
    getClassStatus(classId) {
        // Get all data for this class
        const students = state.students.filter(s => s.classId === classId);
        const lessons = state.lessons.filter(l => l.classId === classId);
        const activities = state.activities.filter(a => a.classId === classId);
        const evaluations = state.evaluations.filter(e => {
            const student = state.students.find(s => s.id === e.studentId);
            return student && student.classId === classId;
        });

        // Calculate statistics
        const upcomingActivities = activities.filter(a => {
            const date = new Date(a.date);
            return date >= new Date() && a.status !== 'completed';
        }).length;

        const overdueActivities = activities.filter(a => {
            const date = new Date(a.date);
            return date < new Date() && a.status !== 'completed';
        }).length;

        const completedActivities = activities.filter(a => a.status === 'completed').length;

        // Average grade (if evaluations have numeric grades)
        let avgGrade = 0;
        const numericEvaluations = evaluations.filter(e => !isNaN(parseFloat(e.grade)));
        if (numericEvaluations.length > 0) {
            const sum = numericEvaluations.reduce((acc, e) => acc + parseFloat(e.grade), 0);
            avgGrade = (sum / numericEvaluations.length).toFixed(2);
        }

        // Recent activity (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const recentLessons = lessons.filter(l => new Date(l.date) >= sevenDaysAgo).length;
        const recentEvaluations = evaluations.filter(e => new Date(e.date) >= sevenDaysAgo).length;

        return {
            classId: classId,
            studentCount: students.length,
            lessonCount: lessons.length,
            activityCount: activities.length,
            evaluationCount: evaluations.length,
            upcomingActivities: upcomingActivities,
            overdueActivities: overdueActivities,
            completedActivities: completedActivities,
            avgGrade: avgGrade,
            recentActivity: {
                lessons: recentLessons,
                evaluations: recentEvaluations
            },
            health: this.calculateClassHealth(students.length, overdueActivities, recentLessons)
        };
    }

    /**
     * Calculate class health score
     */
    calculateClassHealth(studentCount, overdueActivities, recentLessons) {
        let score = 100;

        // Penalize for overdue activities
        score -= overdueActivities * 10;

        // Penalize for lack of recent activity
        if (recentLessons === 0) score -= 20;

        // Penalize for no students
        if (studentCount === 0) score -= 30;

        score = Math.max(0, Math.min(100, score));

        if (score >= 80) return { level: 'excellent', label: '🟢 Ottimo', color: '#27ae60' };
        if (score >= 60) return { level: 'good', label: '🟡 Buono', color: '#f39c12' };
        if (score >= 40) return { level: 'warning', label: '🟠 Attenzione', color: '#e67e22' };
        return { level: 'critical', label: '🔴 Critico', color: '#e74c3c' };
    }

    /**
     * Get all class statuses
     */
    getAllClassStatuses() {
        return state.classes.map(classObj => ({
            class: classObj,
            status: this.getClassStatus(classObj.id)
        }));
    }

    /**
     * Global search across all data types
     */
    globalSearch(query) {
        const results = {
            classes: [],
            students: [],
            lessons: [],
            activities: [],
            evaluations: []
        };

        const lowerQuery = query.toLowerCase();

        // Search classes
        results.classes = state.classes.filter(c => 
            c.name.toLowerCase().includes(lowerQuery) ||
            (c.description && c.description.toLowerCase().includes(lowerQuery))
        );

        // Search students
        results.students = state.students.filter(s =>
            s.name.toLowerCase().includes(lowerQuery) ||
            (s.email && s.email.toLowerCase().includes(lowerQuery)) ||
            (s.notes && s.notes.toLowerCase().includes(lowerQuery))
        );

        // Search lessons
        results.lessons = state.lessons.filter(l =>
            l.title.toLowerCase().includes(lowerQuery) ||
            (l.subject && l.subject.toLowerCase().includes(lowerQuery)) ||
            (l.description && l.description.toLowerCase().includes(lowerQuery))
        );

        // Search activities
        results.activities = state.activities.filter(a =>
            a.title.toLowerCase().includes(lowerQuery) ||
            (a.description && a.description.toLowerCase().includes(lowerQuery))
        );

        // Search evaluations
        results.evaluations = state.evaluations.filter(e =>
            (e.notes && e.notes.toLowerCase().includes(lowerQuery))
        );

        return results;
    }

    /**
     * Generate filter controls HTML
     */
    generateFilterHTML(type) {
        return `
            <div class="dashboard-filters">
                <div class="filter-group">
                    <label for="filter-date-range">📅 Periodo:</label>
                    <select id="filter-date-range" class="filter-select" onchange="window.dashboard.handleFilterChange('dateRange', this.value)">
                        <option value="all" ${this.filters.dateRange === 'all' ? 'selected' : ''}>Tutti</option>
                        <option value="today" ${this.filters.dateRange === 'today' ? 'selected' : ''}>Oggi</option>
                        <option value="week" ${this.filters.dateRange === 'week' ? 'selected' : ''}>Questa Settimana</option>
                        <option value="month" ${this.filters.dateRange === 'month' ? 'selected' : ''}>Questo Mese</option>
                        <option value="custom" ${this.filters.dateRange === 'custom' ? 'selected' : ''}>Personalizzato</option>
                    </select>
                </div>

                <div class="filter-group">
                    <label for="filter-class">🏫 Classe:</label>
                    <select id="filter-class" class="filter-select" onchange="window.dashboard.handleFilterChange('classId', this.value)">
                        <option value="all" ${this.filters.classId === 'all' ? 'selected' : ''}>Tutte</option>
                        ${state.classes.map(c => `
                            <option value="${c.id}" ${this.filters.classId === c.id ? 'selected' : ''}>${c.name}</option>
                        `).join('')}
                    </select>
                </div>

                ${type === 'lessons' ? `
                    <div class="filter-group">
                        <label for="filter-subject">📚 Materia:</label>
                        <select id="filter-subject" class="filter-select" onchange="window.dashboard.handleFilterChange('subject', this.value)">
                            <option value="all">Tutte</option>
                            ${this.getUniqueSubjects().map(s => `
                                <option value="${s}" ${this.filters.subject === s ? 'selected' : ''}>${s}</option>
                            `).join('')}
                        </select>
                    </div>
                ` : ''}

                ${type === 'activities' ? `
                    <div class="filter-group">
                        <label for="filter-status">📊 Stato:</label>
                        <select id="filter-status" class="filter-select" onchange="window.dashboard.handleFilterChange('status', this.value)">
                            <option value="all">Tutti</option>
                            <option value="planned" ${this.filters.status === 'planned' ? 'selected' : ''}>Pianificato</option>
                            <option value="in-progress" ${this.filters.status === 'in-progress' ? 'selected' : ''}>In Corso</option>
                            <option value="completed" ${this.filters.status === 'completed' ? 'selected' : ''}>Completato</option>
                        </select>
                    </div>
                ` : ''}

                <div class="filter-group filter-actions">
                    <button class="btn btn-sm btn-secondary" onclick="window.dashboard.resetFilters(); window.app.renderAllTabs();">
                        🔄 Reset Filtri
                    </button>
                </div>
            </div>

            ${this.filters.dateRange === 'custom' ? `
                <div class="custom-date-range">
                    <input type="date" id="custom-start-date" value="${this.filters.customStartDate || ''}" 
                           onchange="window.dashboard.handleFilterChange('customStartDate', this.value)">
                    <span>→</span>
                    <input type="date" id="custom-end-date" value="${this.filters.customEndDate || ''}"
                           onchange="window.dashboard.handleFilterChange('customEndDate', this.value)">
                </div>
            ` : ''}
        `;
    }

    getUniqueSubjects() {
        const subjects = new Set();
        state.lessons.forEach(l => {
            if (l.subject) subjects.add(l.subject);
        });
        return Array.from(subjects).sort();
    }

    /**
     * Generate search bar HTML
     */
    generateSearchHTML() {
        return `
            <div class="dashboard-search">
                <input type="text" 
                       id="global-search-input" 
                       class="search-input" 
                       placeholder="🔍 Cerca in tutto (studenti, lezioni, attività...)"
                       value="${this.searchQuery}"
                       oninput="window.dashboard.handleSearch(this.value)">
                ${this.searchQuery ? `
                    <button class="btn-clear-search" onclick="window.dashboard.clearSearch()" title="Cancella">✕</button>
                ` : ''}
            </div>
        `;
    }

    /**
     * Generate class status cards HTML
     */
    generateClassStatusHTML() {
        const classStatuses = this.getAllClassStatuses();

        if (classStatuses.length === 0) {
            return '<p class="info">Nessuna classe configurata</p>';
        }

        let html = '<div class="class-status-grid">';

        classStatuses.forEach(({ class: classObj, status }) => {
            html += `
                <div class="class-status-card" onclick="window.dashboard.viewClassDetails('${classObj.id}')">
                    <div class="class-status-header">
                        <h3>${classObj.name}</h3>
                        <span class="health-badge" style="background-color: ${status.health.color}">
                            ${status.health.label}
                        </span>
                    </div>
                    <div class="class-status-stats">
                        <div class="stat">
                            <span class="stat-icon">👥</span>
                            <span class="stat-value">${status.studentCount}</span>
                            <span class="stat-label">Studenti</span>
                        </div>
                        <div class="stat">
                            <span class="stat-icon">📚</span>
                            <span class="stat-value">${status.lessonCount}</span>
                            <span class="stat-label">Lezioni</span>
                        </div>
                        <div class="stat">
                            <span class="stat-icon">📋</span>
                            <span class="stat-value">${status.activityCount}</span>
                            <span class="stat-label">Attività</span>
                        </div>
                        <div class="stat">
                            <span class="stat-icon">⭐</span>
                            <span class="stat-value">${status.avgGrade || 'N/A'}</span>
                            <span class="stat-label">Media Voti</span>
                        </div>
                    </div>
                    ${status.overdueActivities > 0 ? `
                        <div class="class-status-alert">
                            ⚠️ ${status.overdueActivities} attività in ritardo
                        </div>
                    ` : ''}
                </div>
            `;
        });

        html += '</div>';

        return html;
    }

    /**
     * Handle filter change
     */
    handleFilterChange(filterName, value) {
        this.setFilter(filterName, value);
        if (window.app) {
            window.app.renderAllTabs();
        }
    }

    /**
     * Handle search input
     */
    handleSearch(query) {
        this.setSearch(query);
        
        // Debounce search
        if (this.searchTimeout) clearTimeout(this.searchTimeout);
        
        this.searchTimeout = setTimeout(() => {
            if (window.app) {
                window.app.renderAllTabs();
            }
        }, 300);
    }

    /**
     * Clear search
     */
    clearSearch() {
        this.setSearch('');
        const input = document.getElementById('global-search-input');
        if (input) input.value = '';
        
        if (window.app) {
            window.app.renderAllTabs();
        }
    }

    /**
     * View class details
     */
    viewClassDetails(classId) {
        // Set filter to this class
        this.setFilter('classId', classId);
        
        // Switch to classes tab
        if (window.app) {
            window.app.switchTab('classes');
        }
    }
}

// Create singleton instance
export const dashboard = new AdvancedDashboard();

// Make available globally
if (typeof window !== 'undefined') {
    window.dashboard = dashboard;
}
