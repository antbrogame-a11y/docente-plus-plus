
// app.js
import { loadData, saveData, isOnboardingComplete, isProfileComplete, skipOnboarding, clearAllData, checkStorageHealth, recoverOnboardingState, validateAndFixOnboardingState, state } from './js/data.js';
import { createToastContainer, showToast, switchTab, updateActiveClassBadge, showOnboarding, showOnboardingBanner, hideOnboardingBanner, disableMenuItems, enableAllMenuItems, renderChatMessages } from './js/ui.js';
import { setupEventListeners } from './js/events.js';
import { initializeTheme, setupThemePicker } from './js/theme.js';
import { initAppBar } from './js/appbar.js';
import { initNavigation } from './js/navigation.js';
import { 
    showModal, hideModal, 
    createClass, editClass, deleteClass,
    createStudent, editStudent, deleteStudent,
    createLesson, editLesson, deleteLesson,
    createActivity, editActivity, deleteActivity,
    createEvaluation, editEvaluation, deleteEvaluation,
    exportStudentsCSV, importStudentsCSV
} from './js/crud.js';
import { 
    initAIAgentFAB, 
    openAIAgentModal, 
    closeAIAgentModal, 
    resetFABPosition, 
    toggleFABVisibility 
} from './js/ai-agent.js';
import { importPipeline } from './js/import-pipeline.js';
import { smartPlanner } from './js/planner.js';
import { notificationSystem } from './js/notifications.js';
import { dashboard } from './js/dashboard.js';
import {
    getEventsInRange,
    getEventsForDate,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    getEventTypeInfo,
    generateSmartSuggestions,
    createEventFromScheduleSlot
} from './js/agenda.js';

class DocentePlusPlus {
    constructor() {
        this.subjectsPreset = [
            'Italiano', 'Storia', 'Geografia', 'Matematica', 'Scienze',
            'Inglese', 'Arte e Immagine', 'Musica', 'Educazione Fisica'
        ];
        this.currentActiveTab = 'home'; // Track current active tab for AI context
        
        // Schedule management properties
        this.scheduleView = 'weekly'; // 'weekly' or 'daily'
        this.currentScheduleDate = null; // Will be set to current/next weekday
        this.currentEditingSlot = null; // Track the slot being edited
        
        // Agenda management properties
        this.agendaView = 'weekly'; // 'weekly' or 'daily'
        this.currentAgendaDate = null; // Current date for agenda view
        this.currentEditingEvent = null; // Track the event being edited
    }
    
    // Generate time slots based on settings
    getScheduleTimeSlots() {
        if (!state.settings.schedule) {
            return ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00'];
        }
        
        const { startTime, hoursPerDay } = state.settings.schedule;
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const slots = [];
        
        for (let i = 0; i < hoursPerDay; i++) {
            const hour = String(startHour + i).padStart(2, '0');
            const minute = String(startMinute).padStart(2, '0');
            slots.push(`${hour}:${minute}`);
        }
        
        return slots;
    }
    
    // Get working days from settings
    getWorkingDays() {
        if (!state.settings.schedule || !state.settings.schedule.workingDays) {
            return [1, 2, 3, 4, 5]; // Default Monday to Friday
        }
        return state.settings.schedule.workingDays;
    }

    init() {
        try {
            // Initialize theme first (before loading data)
            initializeTheme();
            
            const dataLoaded = loadData();
            if (!dataLoaded) {
                showToast('Dati corrotti rilevati. App ripristinata ai valori predefiniti.', 'warning', 5000);
            }
            
            // Validate and recover onboarding state if needed
            const onboardingState = recoverOnboardingState();
            console.log('Onboarding state:', onboardingState);
            
            // NEW: Always enable all menu items (sidebar always active)
            enableAllMenuItems();
            
            if (onboardingState.needsOnboarding) {
                // NEW: Instead of showing modal, initialize UI and redirect to settings
                this.initializeAppUI();
                showOnboardingBanner();
                // Auto-open settings page
                setTimeout(() => {
                    switchTab('settings');
                    showToast('👋 Benvenuto! Completa il tuo profilo per iniziare.', 'info', 5000);
                }, 500);
            } else if (onboardingState.needsProfileCompletion) {
                // Onboarding marked complete but profile is incomplete (corrupted data)
                showOnboardingBanner();
                this.initializeAppUI();
                showToast('⚠️ Profilo incompleto rilevato. Completa i dati mancanti dalle Impostazioni.', 'warning', 6000);
            } else {
                // Everything is OK - profile complete
                hideOnboardingBanner();
                this.initializeAppUI();
                
                // Log success for debugging
                if (onboardingState.reason === 'complete') {
                    console.log('✅ App initialized with complete profile');
                }
            }
            
            setupEventListeners();
            setupThemePicker();
            createToastContainer();
            
            // Initialize AppBar scroll behavior
            initAppBar();
            
            // Initialize Navigation system
            initNavigation();
            
            // Initialize AI Agent FAB
            initAIAgentFAB();
            
            // Initialize notification system
            notificationSystem.startAutoCheck();
            
            console.log("Docente++ v1.2.2 (Always-Visible Sidebar & Unified Settings) initialized.");
        } catch (error) {
            console.error("Error during init:", error);
            // Try to recover by showing a minimal UI
            createToastContainer();
            showToast('Errore durante l\'inizializzazione. Alcune funzionalità potrebbero non essere disponibili.', 'error', 5000);
            setupEventListeners();
        }
    }

    initializeAppUI() {
        document.querySelector('header')?.classList.add('minimal');
        this.renderAllTabs();
        updateActiveClassBadge();
        switchTab('home');
        
        // NEW: Check profile status and show banner if needed (but don't disable menu)
        if (isProfileComplete()) {
            hideOnboardingBanner();
        } else {
            showOnboardingBanner();
        }
    }
    
    // Public method to switch tabs - used by landing page cards
    switchTab(tabName) {
        switchTab(tabName);
    }

    renderAllTabs() {
        this.renderHome();
        this.renderLessons();
        this.renderStudents();
        this.renderClasses();
        this.renderActivities();
        this.renderEvaluations();
        this.renderSchedule();
        this.renderAgenda();
        this.renderAiAssistant();
        this.renderDocumentImport();
        this.renderNotifications();
    }

    renderHome() {
        // Update stats with filters
        const filteredLessons = dashboard.applyFilters(state.lessons, 'lessons');
        const filteredActivities = dashboard.applyFilters(state.activities, 'activities');
        
        document.getElementById('home-lesson-count').textContent = filteredLessons.length;
        document.getElementById('home-student-count').textContent = state.students.length;
        document.getElementById('home-activity-count').textContent = filteredActivities.length;
        document.getElementById('home-evaluation-count').textContent = state.evaluations.length;

        // The new landing page doesn't have the old dashboard elements
        // These are legacy elements, check if they exist before updating
        const todoContainer = document.getElementById('things-todo-list');
        if (todoContainer) {
            const upcomingActivities = filteredActivities.filter(a => new Date(a.date) >= new Date()).slice(0, 3);
            if (upcomingActivities.length > 0) {
                todoContainer.innerHTML = upcomingActivities.map(a => `<div class="todo-item">- Valutare <strong>${a.title}</strong></div>`).join('');
            } else {
                todoContainer.innerHTML = '<p class="home-placeholder">Nessuna attività imminente.</p>';
            }
        }

        const aiSuggestionsContent = document.getElementById('ai-suggestions-content');
        if (aiSuggestionsContent) {
            aiSuggestionsContent.innerHTML = `
                <div class="ai-suggestion-item">💡 Potresti creare un'attività di ripasso sulla "Rivoluzione Francese".</div>
                <div class="ai-suggestion-item">💡 Considera di pianificare una verifica per la classe 5B.</div>
            `;
        }

        const homeAiReady = document.getElementById('home-ai-ready');
        if (homeAiReady) {
            homeAiReady.textContent = "Pronta";
            homeAiReady.style.color = 'green';
        }

        // Render today's schedule if element exists (legacy dashboard)
        const todayScheduleContainer = document.getElementById('today-schedule-enhanced');
        if (todayScheduleContainer) {
            this.renderTodaySchedule();
        }
    }

    renderTodaySchedule() {
        const container = document.getElementById('today-schedule-enhanced');
        if (!container) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = today.toISOString().split('T')[0];

        // Get today's slots from schedule
        const todaySlots = Object.entries(state.schedule)
            .filter(([key, slot]) => key.startsWith(todayStr))
            .map(([key, slot]) => {
                const hour = key.split('-')[3];
                return {
                    time: `${hour}:00`,
                    slot: slot,
                    key: key
                };
            })
            .sort((a, b) => a.time.localeCompare(b.time));

        if (todaySlots.length === 0) {
            container.innerHTML = '<p class="home-placeholder">Nessuna lezione programmata per oggi.</p>';
            return;
        }

        let html = '<div class="today-schedule-list">';
        todaySlots.forEach(({ time, slot, key }) => {
            const classObj = state.classes.find(c => c.id === slot.classId);
            const activityTypeInfo = this.getActivityTypeIcon(slot.activityType);
            
            html += `
                <div class="schedule-item">
                    <div class="schedule-time">${time}</div>
                    <div class="schedule-info">
                        <strong>${classObj ? classObj.name : 'N/A'}</strong>
                        <span class="activity-badge" style="background-color: ${activityTypeInfo.color}">
                            ${activityTypeInfo.icon} ${activityTypeInfo.label}
                        </span>
                    </div>
                    <button class="btn btn-sm btn-primary" onclick="window.app.launchScheduleActivity('${key}')">
                        ▶ Avvia
                    </button>
                </div>
            `;
        });
        html += '</div>';

        container.innerHTML = html;
    }

    renderLessons() {
        const list = document.getElementById('lessons-list');
        if (!list) return;
        if (state.lessons.length === 0) {
            list.innerHTML = '<p>Nessuna lezione pianificata. Clicca "Nuova Lezione" per iniziare.</p>';
            return;
        }
        
        // Sort lessons by date (newest first)
        const sortedLessons = [...state.lessons].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        list.innerHTML = sortedLessons.map(lesson => {
            const classObj = state.classes.find(c => c.id === lesson.classId);
            const className = classObj ? classObj.name : '';
            
            return `
                <div class="lesson-item card">
                    <h4>${lesson.title}</h4>
                    <p><strong>Materia:</strong> ${lesson.subject}</p>
                    <p><strong>Data:</strong> ${new Date(lesson.date).toLocaleDateString()} - ${lesson.time}</p>
                    ${className ? `<p><strong>Classe:</strong> ${className}</p>` : ''}
                    ${lesson.description ? `<p>${lesson.description}</p>` : ''}
                    <div class="item-actions">
                        <button class="btn btn-sm btn-secondary" onclick="window.app.editLesson('${lesson.id}')">✏️ Modifica</button>
                        <button class="btn btn-sm btn-danger" onclick="window.app.deleteLesson('${lesson.id}')">🗑️ Elimina</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderStudents() {
        const list = document.getElementById('students-list');
        if (!list) return;
        
        // Filter by active class if one is selected
        let studentsToShow = state.students;
        if (state.activeClass) {
            studentsToShow = state.students.filter(s => s.classId === state.activeClass);
        }
        
        if (studentsToShow.length === 0) {
            list.innerHTML = '<p>Nessuno studente trovato. Clicca "Nuovo Studente" per iniziare.</p>';
            return;
        }
        
        list.innerHTML = studentsToShow.map(student => {
            const classObj = state.classes.find(c => c.id === student.classId);
            const className = classObj ? classObj.name : 'Nessuna classe';
            
            return `
                <div class="student-item card">
                    <h4>${student.firstName} ${student.lastName}</h4>
                    <p><strong>Classe:</strong> ${className}</p>
                    ${student.email ? `<p><strong>Email:</strong> ${student.email}</p>` : ''}
                    ${student.birthDate ? `<p><strong>Data di nascita:</strong> ${new Date(student.birthDate).toLocaleDateString()}</p>` : ''}
                    ${student.notes ? `<p><strong>Note:</strong> ${student.notes}</p>` : ''}
                    <div class="item-actions">
                        <button class="btn btn-sm btn-secondary" onclick="window.app.editStudent('${student.id}')">✏️ Modifica</button>
                        <button class="btn btn-sm btn-danger" onclick="window.app.deleteStudent('${student.id}')">🗑️ Elimina</button>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    renderClasses() {
        const list = document.getElementById('classes-list');
        if (!list) return;
        
        if (state.classes.length === 0) {
            list.innerHTML = '<p>Nessuna classe creata. Clicca "Nuova Classe" per iniziare.</p>';
            return;
        }
        
        list.innerHTML = state.classes.map(classItem => {
            const studentCount = state.students.filter(s => s.classId === classItem.id).length;
            
            return `
                <div class="class-item card">
                    <h4>${classItem.name}</h4>
                    ${classItem.schoolYear ? `<p><strong>Anno Scolastico:</strong> ${classItem.schoolYear}</p>` : ''}
                    <p><strong>Studenti:</strong> ${studentCount}</p>
                    ${classItem.description ? `<p>${classItem.description}</p>` : ''}
                    <div class="item-actions">
                        <button class="btn btn-sm btn-secondary" onclick="window.app.editClass('${classItem.id}')">✏️ Modifica</button>
                        <button class="btn btn-sm btn-danger" onclick="window.app.deleteClass('${classItem.id}')">🗑️ Elimina</button>
                    </div>
                </div>
            `;
        }).join('');
    }
    renderActivities() {
        const list = document.getElementById('activities-list');
        if (!list) return;
        if (state.activities.length === 0) {
            list.innerHTML = '<p>Nessuna attività creata. Clicca "Nuova Attività" per iniziare.</p>';
            return;
        }
        
        // Sort activities by date (newest first)
        const sortedActivities = [...state.activities].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        list.innerHTML = sortedActivities.map(act => {
            const classObj = state.classes.find(c => c.id === act.classId);
            const className = classObj ? classObj.name : '';
            
            // Status badge styling
            const statusColors = {
                'pianificata': '#2196f3',
                'in corso': '#ff9800',
                'completata': '#4caf50'
            };
            const statusColor = statusColors[act.status] || '#999';
            
            return `
                <div class="activity-item card">
                    <h4>${act.title}</h4>
                    <p><strong>Tipo:</strong> ${act.type} | <strong>Stato:</strong> <span style="color: ${statusColor}; font-weight: bold;">${act.status}</span></p>
                    <p><strong>Data:</strong> ${new Date(act.date).toLocaleDateString()}</p>
                    ${className ? `<p><strong>Classe:</strong> ${className}</p>` : ''}
                    ${act.description ? `<p>${act.description}</p>` : ''}
                    <div class="item-actions">
                        <button class="btn btn-sm btn-secondary" onclick="window.app.editActivity('${act.id}')">✏️ Modifica</button>
                        <button class="btn btn-sm btn-danger" onclick="window.app.deleteActivity('${act.id}')">🗑️ Elimina</button>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    renderEvaluations() {
        const list = document.getElementById('evaluations-list');
        if (!list) return;
        if (state.evaluations.length === 0) {
            list.innerHTML = '<p>Nessuna valutazione inserita. Clicca "Nuova Valutazione" per iniziare.</p>';
            return;
        }
        
        // Sort evaluations by date (newest first)
        const sortedEvals = [...state.evaluations].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        list.innerHTML = sortedEvals.map(evaluation => {
            const student = state.students.find(s => s.id === evaluation.studentId);
            const activity = state.activities.find(a => a.id === evaluation.activityId);
            
            const studentName = student ? `${student.firstName} ${student.lastName}` : 'Studente non trovato';
            const activityTitle = activity ? activity.title : 'Attività non trovata';
            
            return `
                <div class="evaluation-item card">
                    <h4>${studentName}</h4>
                    <p><strong>Attività:</strong> ${activityTitle}</p>
                    <p><strong>Voto:</strong> ${evaluation.grade || 'N/A'}</p>
                    <p><strong>Data:</strong> ${new Date(evaluation.date).toLocaleDateString()}</p>
                    ${evaluation.comment ? `<p><strong>Commento:</strong> ${evaluation.comment}</p>` : ''}
                    <div class="item-actions">
                        <button class="btn btn-sm btn-secondary" onclick="window.app.editEvaluation('${evaluation.id}')">✏️ Modifica</button>
                        <button class="btn btn-sm btn-danger" onclick="window.app.deleteEvaluation('${evaluation.id}')">🗑️ Elimina</button>
                    </div>
                </div>
            `;
        }).join('');
    }
    renderSchedule() {
        const container = document.getElementById('schedule-view');
        if (!container) return;
        
        // Initialize current schedule date if not set
        if (!this.currentScheduleDate) {
            this.currentScheduleDate = this.getNextWeekday(new Date());
        }
        
        // Render view controls
        const viewControls = `
            <div class="schedule-controls">
                <div class="schedule-nav">
                    <button class="btn btn-sm btn-secondary" onclick="window.app.navigateSchedule('prev')">⬅ ${this.scheduleView === 'weekly' ? 'Settimana Prec.' : 'Giorno Prec.'}</button>
                    <button class="btn btn-sm btn-primary" onclick="window.app.navigateSchedule('today')">📅 Oggi</button>
                    <button class="btn btn-sm btn-secondary" onclick="window.app.navigateSchedule('next')">${this.scheduleView === 'weekly' ? 'Settimana Succ.' : 'Giorno Succ.'} ➡</button>
                </div>
                <div class="schedule-view-toggle">
                    <button class="btn btn-sm ${this.scheduleView === 'weekly' ? 'btn-primary' : 'btn-secondary'}" onclick="window.app.toggleScheduleView('weekly')">📅 Settimana</button>
                    <button class="btn btn-sm ${this.scheduleView === 'daily' ? 'btn-primary' : 'btn-secondary'}" onclick="window.app.toggleScheduleView('daily')">📋 Giorno</button>
                </div>
            </div>
        `;
        
        container.innerHTML = viewControls;
        
        // Render appropriate view
        if (this.scheduleView === 'weekly') {
            this.renderWeeklySchedule(container);
        } else {
            this.renderDailySchedule(container);
        }
    }
    
    renderWeeklySchedule(container) {
        const weekStart = this.getWeekStart(this.currentScheduleDate);
        const weekDays = [];
        const workingDays = this.getWorkingDays();
        
        // Generate days based on working days configuration
        // Start from Monday and include all days in the week
        for (let i = 0; i < 7; i++) {
            const day = new Date(weekStart);
            day.setDate(weekStart.getDate() + i);
            // Only include if it's a working day
            if (workingDays.includes(day.getDay())) {
                weekDays.push(day);
            }
        }
        
        // If no working days in current week, show message
        if (weekDays.length === 0) {
            container.innerHTML += '<p class="no-schedule">Nessun giorno lavorativo configurato per questa settimana.</p>';
            return;
        }
        
        // Create table header
        let tableHtml = `
            <div class="schedule-week-info">
                Settimana dal ${weekDays[0].toLocaleDateString()} al ${weekDays[weekDays.length - 1].toLocaleDateString()}
            </div>
            <div class="schedule-table-wrapper">
                <table class="schedule-table">
                    <thead>
                        <tr>
                            <th>Ora</th>
                            ${weekDays.map(day => `<th>${this.getDayName(day)}<br><small>${day.toLocaleDateString()}</small></th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        // Create table rows for each time slot
        const timeSlots = this.getScheduleTimeSlots();
        timeSlots.forEach(time => {
            tableHtml += '<tr>';
            tableHtml += `<td class="schedule-time">${time}</td>`;
            
            weekDays.forEach(day => {
                const scheduleKey = this.getScheduleKey(day, time);
                const slot = state.schedule[scheduleKey];
                tableHtml += `<td class="schedule-cell" onclick="window.app.showScheduleSlotEditor('${scheduleKey}', '${day.toISOString()}', '${time}')">`;
                
                if (slot && slot.classId) {
                    const classObj = state.classes.find(c => c.id === slot.classId);
                    const activityTypeInfo = this.getActivityTypeIcon(slot.activityType);
                    
                    tableHtml += `
                        <div class="schedule-slot-content">
                            <div class="schedule-class-name">${classObj ? classObj.name : 'Classe N/A'}</div>
                            <div class="schedule-activity-badge" style="background-color: ${activityTypeInfo.color}">
                                ${activityTypeInfo.icon} ${activityTypeInfo.label}
                            </div>
                            <button class="btn btn-xs btn-success schedule-launch-btn" onclick="event.stopPropagation(); window.app.launchScheduleActivity('${scheduleKey}')">▶ Avvia</button>
                        </div>
                    `;
                } else {
                    tableHtml += '<div class="schedule-slot-empty">+ Aggiungi</div>';
                }
                
                tableHtml += '</td>';
            });
            
            tableHtml += '</tr>';
        });
        
        tableHtml += '</tbody></table></div>';
        
        container.insertAdjacentHTML('beforeend', tableHtml);
    }
    
    renderDailySchedule(container) {
        const day = this.currentScheduleDate;
        
        let tableHtml = `
            <div class="schedule-week-info">
                ${this.getDayName(day)} - ${day.toLocaleDateString()}
            </div>
            <div class="schedule-table-wrapper">
                <table class="schedule-table schedule-table-daily">
                    <thead>
                        <tr>
                            <th>Ora</th>
                            <th>Lezione</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        const timeSlots = this.getScheduleTimeSlots();
        timeSlots.forEach(time => {
            const scheduleKey = this.getScheduleKey(day, time);
            const slot = state.schedule[scheduleKey];
            
            tableHtml += `
                <tr>
                    <td class="schedule-time">${time}</td>
                    <td class="schedule-cell schedule-cell-daily" onclick="window.app.showScheduleSlotEditor('${scheduleKey}', '${day.toISOString()}', '${time}')">
            `;
            
            if (slot && slot.classId) {
                const classObj = state.classes.find(c => c.id === slot.classId);
                const activityTypeInfo = this.getActivityTypeIcon(slot.activityType);
                
                tableHtml += `
                    <div class="schedule-slot-content schedule-slot-content-daily">
                        <div class="schedule-class-name">${classObj ? classObj.name : 'Classe N/A'}</div>
                        <div class="schedule-activity-badge" style="background-color: ${activityTypeInfo.color}">
                            ${activityTypeInfo.icon} ${activityTypeInfo.label}
                        </div>
                        <button class="btn btn-sm btn-success schedule-launch-btn" onclick="event.stopPropagation(); window.app.launchScheduleActivity('${scheduleKey}')">▶ Avvia Lezione</button>
                    </div>
                `;
            } else {
                tableHtml += '<div class="schedule-slot-empty">+ Aggiungi Lezione</div>';
            }
            
            tableHtml += '</td></tr>';
        });
        
        tableHtml += '</tbody></table></div>';
        
        container.insertAdjacentHTML('beforeend', tableHtml);
    }
    
    // Helper methods for schedule management
    getScheduleKey(date, time) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hour = time.split(':')[0];
        return `${year}-${month}-${day}-${hour}`;
    }
    
    getNextWeekday(date) {
        const d = new Date(date);
        const dayOfWeek = d.getDay();
        
        // If Saturday (6), move to Monday
        if (dayOfWeek === 6) {
            d.setDate(d.getDate() + 2);
        }
        // If Sunday (0), move to Monday
        else if (dayOfWeek === 0) {
            d.setDate(d.getDate() + 1);
        }
        
        return d;
    }
    
    getWeekStart(date) {
        const d = new Date(date);
        const dayOfWeek = d.getDay();
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust to Monday
        d.setDate(d.getDate() + diff);
        return d;
    }
    
    getDayName(date) {
        const days = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
        return days[date.getDay()];
    }
    
    getActivityTypeIcon(type) {
        const types = {
            'theory': { icon: 'T', label: 'Teoria', color: '#3498db' },
            'drawing': { icon: 'D', label: 'Disegno', color: '#e67e22' },
            'lab': { icon: 'L', label: 'Laboratorio', color: '#27ae60' }
        };
        return types[type] || { icon: '?', label: 'N/A', color: '#999' };
    }
    
    toggleScheduleView(view) {
        this.scheduleView = view;
        this.renderSchedule();
    }
    
    navigateSchedule(direction) {
        if (direction === 'today') {
            this.currentScheduleDate = this.getNextWeekday(new Date());
        } else if (direction === 'prev') {
            if (this.scheduleView === 'weekly') {
                this.currentScheduleDate.setDate(this.currentScheduleDate.getDate() - 7);
            } else {
                this.currentScheduleDate.setDate(this.currentScheduleDate.getDate() - 1);
                this.currentScheduleDate = this.getNextWeekday(this.currentScheduleDate);
            }
        } else if (direction === 'next') {
            if (this.scheduleView === 'weekly') {
                this.currentScheduleDate.setDate(this.currentScheduleDate.getDate() + 7);
            } else {
                this.currentScheduleDate.setDate(this.currentScheduleDate.getDate() + 1);
                this.currentScheduleDate = this.getNextWeekday(this.currentScheduleDate);
            }
        }
        this.renderSchedule();
    }
    
    showScheduleSlotEditor(scheduleKey, dateISO, time) {
        this.currentEditingSlot = scheduleKey;
        const slot = state.schedule[scheduleKey] || {};
        
        // Validate slot with smart planner
        const validation = smartPlanner.validateSlot(dateISO, time);
        if (!validation.valid) {
            showToast(validation.errors.join('. '), 'error');
            return;
        }

        // Check daily limit
        const dailyCheck = smartPlanner.checkDailyLimit(dateISO);
        if (dailyCheck.exceeded && !slot.classId) {
            showToast(`Limite giornaliero raggiunto (${dailyCheck.limit} ore/giorno). Impossibile aggiungere nuovi slot.`, 'warning');
            return;
        }
        
        // Create and show modal
        const modal = document.createElement('div');
        modal.id = 'schedule-slot-modal';
        modal.className = 'modal';
        modal.style.display = 'flex';
        
        const date = new Date(dateISO);
        const dayName = this.getDayName(date);
        
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Modifica Slot Orario</h2>
                <p><strong>${dayName} ${date.toLocaleDateString()} - ${time}</strong></p>
                ${dailyCheck.remaining < 2 && !slot.classId ? `
                    <div class="warning-message">⚠️ Solo ${dailyCheck.remaining} slot rimanenti per oggi</div>
                ` : ''}
                <form id="schedule-slot-form">
                    <div class="form-group">
                        <label for="slot-class">Classe</label>
                        <select id="slot-class" required>
                            <option value="">-- Seleziona Classe --</option>
                            ${state.classes.map(c => `<option value="${c.id}" ${slot.classId === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="slot-activity-type">Tipo Attività</label>
                        <select id="slot-activity-type" required>
                            <option value="">-- Seleziona Tipo --</option>
                            <option value="theory" ${slot.activityType === 'theory' ? 'selected' : ''}>Teoria</option>
                            <option value="drawing" ${slot.activityType === 'drawing' ? 'selected' : ''}>Disegno</option>
                            <option value="lab" ${slot.activityType === 'lab' ? 'selected' : ''}>Laboratorio</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">💾 Salva</button>
                        ${slot.classId ? '<button type="button" class="btn btn-danger" onclick="window.app.clearScheduleSlot()">🗑️ Elimina</button>' : ''}
                        <button type="button" class="btn btn-secondary" onclick="window.app.closeScheduleSlotEditor()">Annulla</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Setup form submission
        document.getElementById('schedule-slot-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveScheduleSlot();
        });
        
        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
    }
    
    saveScheduleSlot() {
        const classId = document.getElementById('slot-class').value;
        const activityType = document.getElementById('slot-activity-type').value;
        
        if (!classId || !activityType) {
            showToast('Seleziona classe e tipo attività', 'error');
            return;
        }
        
        state.schedule[this.currentEditingSlot] = {
            classId: classId,
            activityType: activityType
        };
        
        saveData();
        this.closeScheduleSlotEditor();
        this.renderSchedule();
        showToast('Slot orario salvato!', 'success');
    }
    
    clearScheduleSlot() {
        if (confirm('Sei sicuro di voler eliminare questo slot?')) {
            delete state.schedule[this.currentEditingSlot];
            saveData();
            this.closeScheduleSlotEditor();
            this.renderSchedule();
            showToast('Slot eliminato', 'success');
        }
    }
    
    closeScheduleSlotEditor() {
        const modal = document.getElementById('schedule-slot-modal');
        if (modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    }
    
    launchScheduleActivity(scheduleKey) {
        const slot = state.schedule[scheduleKey];
        if (!slot || !slot.classId) {
            showToast('Nessuna classe configurata per questo slot', 'error');
            return;
        }
        
        // Get activities for this class
        const classActivities = state.activities.filter(a => a.classId === slot.classId);
        
        // Filter by status
        const inProgressActivities = classActivities.filter(a => a.status === 'in corso');
        const plannedActivities = classActivities.filter(a => a.status === 'pianificata');
        
        // Show activity selection modal
        this.showActivitySelectionModal(scheduleKey, slot, inProgressActivities, plannedActivities);
    }
    
    showActivitySelectionModal(scheduleKey, slot, inProgressActivities, plannedActivities) {
        const classObj = state.classes.find(c => c.id === slot.classId);
        const activityTypeInfo = this.getActivityTypeIcon(slot.activityType);
        
        // Parse schedule key to get date/time info
        const parts = scheduleKey.split('-');
        const date = new Date(parts[0], parts[1] - 1, parts[2]);
        const hour = parts[3];
        
        const modal = document.createElement('div');
        modal.id = 'activity-selection-modal';
        modal.className = 'modal';
        modal.style.display = 'flex';
        
        let activitiesHtml = '';
        
        if (inProgressActivities.length > 0) {
            activitiesHtml += '<h3>📝 Attività In Corso</h3><div class="activity-cards">';
            inProgressActivities.forEach(activity => {
                activitiesHtml += `
                    <div class="activity-card" onclick="window.app.selectScheduleActivity('${activity.id}', '${scheduleKey}')">
                        <h4>${activity.title}</h4>
                        <p><strong>Tipo:</strong> ${activity.type}</p>
                        <p><strong>Scadenza:</strong> ${new Date(activity.date).toLocaleDateString()}</p>
                        <span class="activity-badge activity-badge-progress">In corso</span>
                    </div>
                `;
            });
            activitiesHtml += '</div>';
        }
        
        if (plannedActivities.length > 0) {
            activitiesHtml += '<h3>📋 Attività Pianificate</h3><div class="activity-cards">';
            plannedActivities.forEach(activity => {
                activitiesHtml += `
                    <div class="activity-card" onclick="window.app.selectScheduleActivity('${activity.id}', '${scheduleKey}')">
                        <h4>${activity.title}</h4>
                        <p><strong>Tipo:</strong> ${activity.type}</p>
                        <p><strong>Scadenza:</strong> ${new Date(activity.date).toLocaleDateString()}</p>
                        <span class="activity-badge activity-badge-planned">Pianificata</span>
                    </div>
                `;
            });
            activitiesHtml += '</div>';
        }
        
        if (inProgressActivities.length === 0 && plannedActivities.length === 0) {
            activitiesHtml = '<p class="no-activities">Nessuna attività disponibile per questa classe. Crea una nuova attività dalla sezione Attività.</p>';
        }
        
        modal.innerHTML = `
            <div class="modal-content modal-content-large">
                <h2>🎓 Avvia Lezione</h2>
                <div class="lesson-header">
                    <div><strong>Classe:</strong> ${classObj ? classObj.name : 'N/A'}</div>
                    <div><strong>Data/Ora:</strong> ${date.toLocaleDateString()} - ${hour}:00</div>
                    <div class="schedule-activity-badge" style="background-color: ${activityTypeInfo.color}">
                        ${activityTypeInfo.icon} ${activityTypeInfo.label}
                    </div>
                </div>
                <div class="step-indicator">
                    <span class="step-active">1. Seleziona Attività</span>
                    <span class="step-arrow">→</span>
                    <span>2. Valuta Studenti</span>
                </div>
                ${activitiesHtml}
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="window.app.closeActivitySelectionModal()">Annulla</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
    }
    
    selectScheduleActivity(activityId, scheduleKey) {
        this.closeActivitySelectionModal();
        
        // Get activity and related data
        const activity = state.activities.find(a => a.id === activityId);
        if (!activity) {
            showToast('Attività non trovata', 'error');
            return;
        }
        
        // Show student evaluation modal
        this.showStudentEvaluationModal(activity, scheduleKey);
    }
    
    showStudentEvaluationModal(activity, scheduleKey) {
        const classObj = state.classes.find(c => c.id === activity.classId);
        const students = state.students.filter(s => s.classId === activity.classId);
        
        // Parse schedule key for date/time
        const parts = scheduleKey.split('-');
        const date = new Date(parts[0], parts[1] - 1, parts[2]);
        const hour = parts[3];
        
        const modal = document.createElement('div');
        modal.id = 'student-evaluation-modal';
        modal.className = 'modal';
        modal.style.display = 'flex';
        
        let studentsHtml = '';
        
        if (students.length === 0) {
            studentsHtml = '<p class="no-students">Nessuno studente registrato per questa classe.</p>';
        } else {
            studentsHtml = students.map(student => `
                <div class="student-eval-card" id="eval-card-${student.id}">
                    <h4>${student.firstName} ${student.lastName}</h4>
                    
                    <div class="eval-section">
                        <label>Voto</label>
                        <div class="grade-buttons">
                            ${[4, 5, 6, 7, 8, 9, 10].map(grade => `
                                <button class="grade-btn" data-student-id="${student.id}" data-grade="${grade}" onclick="window.app.selectGrade('${student.id}', ${grade})">${grade}</button>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="eval-section">
                        <label>Comportamento</label>
                        <div class="behavior-buttons">
                            <button class="behavior-btn" data-student-id="${student.id}" data-behavior="positive" onclick="window.app.selectBehavior('${student.id}', 'positive')">😊 Positivo</button>
                            <button class="behavior-btn" data-student-id="${student.id}" data-behavior="neutral" onclick="window.app.selectBehavior('${student.id}', 'neutral')">😐 Neutro</button>
                            <button class="behavior-btn" data-student-id="${student.id}" data-behavior="negative" onclick="window.app.selectBehavior('${student.id}', 'negative')">😟 Negativo</button>
                        </div>
                    </div>
                    
                    <div class="eval-section">
                        <label>Osservazioni</label>
                        <textarea id="observation-${student.id}" rows="2" placeholder="Note e osservazioni..."></textarea>
                    </div>
                </div>
            `).join('');
        }
        
        modal.innerHTML = `
            <div class="modal-content modal-content-xlarge">
                <div class="lesson-in-progress-header">
                    <h2>🎓 Lezione in Corso</h2>
                    <div class="lesson-info">
                        <span><strong>Classe:</strong> ${classObj ? classObj.name : 'N/A'}</span> | 
                        <span><strong>Attività:</strong> ${activity.title}</span> | 
                        <span><strong>Data/Ora:</strong> ${date.toLocaleDateString()} ${hour}:00</span>
                    </div>
                </div>
                
                <div class="step-indicator">
                    <span>1. Seleziona Attività</span>
                    <span class="step-arrow">→</span>
                    <span class="step-active">2. Valuta Studenti</span>
                </div>
                
                <h3>👥 Valutazioni Studenti (${students.length})</h3>
                
                <div class="students-eval-container">
                    ${studentsHtml}
                </div>
                
                <div class="eval-section">
                    <label>📝 Note Generali della Lezione</label>
                    <textarea id="lesson-notes" rows="3" placeholder="Note generali sulla lezione..."></textarea>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-danger" onclick="window.app.cancelLesson()">Annulla Lezione</button>
                    <button type="button" class="btn btn-secondary" onclick="window.app.saveLessonProgress()">💾 Salva Progresso</button>
                    <button type="button" class="btn btn-success" onclick="window.app.completeLesson('${activity.id}')">✅ Termina Lezione</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Store evaluation data temporarily
        if (!window.currentLessonEvaluations) {
            window.currentLessonEvaluations = {};
        }
    }
    
    selectGrade(studentId, grade) {
        // Visual feedback
        const card = document.getElementById(`eval-card-${studentId}`);
        const buttons = card.querySelectorAll('.grade-btn');
        buttons.forEach(btn => btn.classList.remove('selected'));
        
        const selectedBtn = card.querySelector(`[data-student-id="${studentId}"][data-grade="${grade}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('selected');
        }
        
        // Store data
        if (!window.currentLessonEvaluations[studentId]) {
            window.currentLessonEvaluations[studentId] = {};
        }
        window.currentLessonEvaluations[studentId].grade = grade;
        
        showToast(`Voto ${grade} assegnato`, 'success', 1000);
    }
    
    selectBehavior(studentId, behavior) {
        // Visual feedback
        const card = document.getElementById(`eval-card-${studentId}`);
        const buttons = card.querySelectorAll('.behavior-btn');
        buttons.forEach(btn => btn.classList.remove('selected'));
        
        const selectedBtn = card.querySelector(`[data-student-id="${studentId}"][data-behavior="${behavior}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('selected');
        }
        
        // Store data
        if (!window.currentLessonEvaluations[studentId]) {
            window.currentLessonEvaluations[studentId] = {};
        }
        window.currentLessonEvaluations[studentId].behavior = behavior;
        
        const behaviorLabel = behavior === 'positive' ? 'Positivo' : behavior === 'neutral' ? 'Neutro' : 'Negativo';
        showToast(`Comportamento: ${behaviorLabel}`, 'success', 1000);
    }
    
    saveLessonProgress() {
        showToast('Progresso salvato! Puoi continuare in seguito.', 'success');
        // Could implement actual progress saving to localStorage here
    }
    
    completeLesson(activityId) {
        // Collect all evaluations
        const students = state.students.filter(s => s.classId === state.activities.find(a => a.id === activityId)?.classId);
        const lessonNotes = document.getElementById('lesson-notes')?.value || '';
        
        students.forEach(student => {
            const evaluation = window.currentLessonEvaluations?.[student.id];
            const observation = document.getElementById(`observation-${student.id}`)?.value || '';
            
            if (evaluation && (evaluation.grade || evaluation.behavior || observation)) {
                // Create evaluation record
                const newEvaluation = {
                    id: `eval_${Date.now()}_${student.id}`,
                    studentId: student.id,
                    activityId: activityId,
                    date: new Date().toISOString().split('T')[0],
                    grade: evaluation.grade || null,
                    comment: observation,
                    behavior: evaluation.behavior || null,
                    lessonNotes: lessonNotes
                };
                
                state.evaluations.push(newEvaluation);
            }
        });
        
        // Update activity status to completed
        const activity = state.activities.find(a => a.id === activityId);
        if (activity) {
            activity.status = 'completata';
        }
        
        saveData();
        
        // Clear temp data
        window.currentLessonEvaluations = {};
        
        // Close modal
        this.closeStudentEvaluationModal();
        
        showToast('Lezione completata con successo!', 'success');
        
        // Refresh views
        this.renderEvaluations();
        this.renderActivities();
    }
    
    cancelLesson() {
        if (confirm('Sei sicuro di voler annullare questa lezione? I dati non salvati andranno persi.')) {
            window.currentLessonEvaluations = {};
            this.closeStudentEvaluationModal();
            showToast('Lezione annullata', 'info');
        }
    }
    
    closeActivitySelectionModal() {
        const modal = document.getElementById('activity-selection-modal');
        if (modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    }
    
    closeStudentEvaluationModal() {
        const modal = document.getElementById('student-evaluation-modal');
        if (modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    }
    
    // ============================================
    // Agenda View Methods
    // ============================================
    
    renderAgenda() {
        // Initialize current agenda date if not set
        if (!this.currentAgendaDate) {
            this.currentAgendaDate = new Date();
        }
        
        // Render smart suggestions
        this.renderAgendaSuggestions();
        
        // Update view toggle buttons
        this.updateAgendaViewToggle();
        
        // Render appropriate view
        if (this.agendaView === 'weekly') {
            this.renderWeeklyAgenda();
        } else {
            this.renderDailyAgenda();
        }
    }
    
    renderAgendaSuggestions() {
        const container = document.getElementById('agenda-suggestions-list');
        if (!container) return;
        
        const suggestions = generateSmartSuggestions();
        
        if (suggestions.length === 0) {
            container.innerHTML = '<div class="agenda-suggestion-item">✅ Tutto sotto controllo! Nessun suggerimento al momento.</div>';
            return;
        }
        
        container.innerHTML = suggestions.map(suggestion => `
            <div class="agenda-suggestion-item priority-${suggestion.priority}" onclick="window.app.handleSuggestionClick('${suggestion.action}')">
                <span class="agenda-suggestion-icon">${suggestion.icon}</span>
                <span class="agenda-suggestion-message">${suggestion.message}</span>
            </div>
        `).join('');
    }
    
    handleSuggestionClick(action) {
        if (action === 'viewAgenda') {
            // Already on agenda, just scroll to events
            document.getElementById('agenda-view')?.scrollIntoView({ behavior: 'smooth' });
        } else if (action === 'addEvent') {
            this.newEvent();
        }
    }
    
    updateAgendaViewToggle() {
        const dailyBtn = document.getElementById('agenda-view-daily');
        const weeklyBtn = document.getElementById('agenda-view-weekly');
        
        if (dailyBtn && weeklyBtn) {
            dailyBtn.classList.toggle('active', this.agendaView === 'daily');
            weeklyBtn.classList.toggle('active', this.agendaView === 'weekly');
        }
    }
    
    renderDailyAgenda() {
        const container = document.getElementById('agenda-view');
        if (!container) return;
        
        const date = new Date(this.currentAgendaDate);
        const events = getEventsForDate(date);
        
        let html = `
            <div class="agenda-date-header">
                <h3>${this.getDayName(date)}</h3>
                <p>${date.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div class="agenda-daily-view">
        `;
        
        if (events.length === 0) {
            html += `
                <div class="agenda-no-events">
                    <div class="agenda-no-events-icon">📅</div>
                    <p>Nessun evento programmato per questa giornata</p>
                    <button class="btn btn-primary" onclick="window.app.newEvent()">
                        <span class="material-symbols-outlined">add</span>
                        Aggiungi Evento
                    </button>
                </div>
            `;
        } else {
            events.forEach(event => {
                const typeInfo = getEventTypeInfo(event.type);
                const classObj = event.classId ? state.classes.find(c => c.id === event.classId) : null;
                const startDate = new Date(event.start);
                const endDate = new Date(event.end);
                
                html += `
                    <div class="agenda-event-card" onclick="window.app.viewEvent('${event.id}')" style="border-left-color: ${typeInfo.color}">
                        <div class="agenda-event-time">
                            <span class="agenda-event-time-start">${startDate.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</span>
                            <span class="agenda-event-time-end">${endDate.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div class="agenda-event-content">
                            <h4 class="agenda-event-title">${event.title}</h4>
                            <div class="agenda-event-meta">
                                <span class="agenda-event-type-badge" style="background-color: ${typeInfo.color}">
                                    ${typeInfo.icon} ${typeInfo.label}
                                </span>
                                ${classObj ? `<span class="agenda-event-class-badge">🏫 ${classObj.name}</span>` : ''}
                                ${event.linkedToOrario ? '<span class="agenda-event-class-badge">🔗 Collegato all\'orario</span>' : ''}
                            </div>
                            ${event.note ? `<p class="agenda-event-note">${event.note}</p>` : ''}
                            <div class="agenda-event-actions">
                                <button class="btn btn-xs btn-secondary" onclick="event.stopPropagation(); window.app.editEvent('${event.id}')">
                                    <span class="material-symbols-outlined">edit</span>
                                    Modifica
                                </button>
                                <button class="btn btn-xs btn-danger" onclick="event.stopPropagation(); window.app.deleteEventConfirm('${event.id}')">
                                    <span class="material-symbols-outlined">delete</span>
                                    Elimina
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
        
        html += '</div>';
        container.innerHTML = html;
    }
    
    renderWeeklyAgenda() {
        const container = document.getElementById('agenda-view');
        if (!container) return;
        
        const weekStart = this.getWeekStart(this.currentAgendaDate);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        
        const events = getEventsInRange(weekStart, weekEnd);
        
        let html = `
            <div class="agenda-date-header">
                <h3>Settimana</h3>
                <p>${weekStart.toLocaleDateString('it-IT', { day: 'numeric', month: 'long' })} - ${weekEnd.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div class="agenda-weekly-view">
        `;
        
        // Create 7 day columns
        for (let i = 0; i < 7; i++) {
            const day = new Date(weekStart);
            day.setDate(weekStart.getDate() + i);
            
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            day.setHours(0, 0, 0, 0);
            const isToday = day.getTime() === today.getTime();
            
            const dayEvents = events.filter(event => {
                const eventDate = new Date(event.start);
                eventDate.setHours(0, 0, 0, 0);
                return eventDate.getTime() === day.getTime();
            });
            
            html += `
                <div class="agenda-weekly-day ${isToday ? 'is-today' : ''}">
                    <div class="agenda-weekly-day-header">
                        ${this.getDayName(day)}
                        <span class="agenda-weekly-day-date">${day.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}</span>
                    </div>
                    <div class="agenda-weekly-events">
            `;
            
            if (dayEvents.length === 0) {
                html += '<p style="color: var(--md-text-secondary); font-size: var(--font-size-sm); text-align: center; padding: var(--spacing-md);">Nessun evento</p>';
            } else {
                dayEvents.forEach(event => {
                    const typeInfo = getEventTypeInfo(event.type);
                    const startDate = new Date(event.start);
                    
                    html += `
                        <div class="agenda-weekly-event" onclick="window.app.viewEvent('${event.id}')" style="border-left-color: ${typeInfo.color}">
                            <div class="agenda-weekly-event-time">${startDate.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</div>
                            <div class="agenda-weekly-event-title">${event.title}</div>
                            <div class="agenda-weekly-event-type">${typeInfo.icon} ${typeInfo.label}</div>
                        </div>
                    `;
                });
            }
            
            html += '</div></div>';
        }
        
        html += '</div>';
        container.innerHTML = html;
    }
    
    toggleAgendaView(view) {
        this.agendaView = view;
        this.renderAgenda();
    }
    
    navigateAgenda(direction) {
        if (direction === 'today') {
            this.currentAgendaDate = new Date();
        } else if (direction === 'prev') {
            if (this.agendaView === 'weekly') {
                this.currentAgendaDate.setDate(this.currentAgendaDate.getDate() - 7);
            } else {
                this.currentAgendaDate.setDate(this.currentAgendaDate.getDate() - 1);
            }
        } else if (direction === 'next') {
            if (this.agendaView === 'weekly') {
                this.currentAgendaDate.setDate(this.currentAgendaDate.getDate() + 7);
            } else {
                this.currentAgendaDate.setDate(this.currentAgendaDate.getDate() + 1);
            }
        }
        this.renderAgenda();
    }
    
    // Event CRUD Methods
    newEvent() {
        document.getElementById('event-modal-form').reset();
        this.populateClassDropdowns();
        
        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('event-modal-start-date').value = today;
        document.getElementById('event-modal-end-date').value = today;
        
        this.currentEditingEvent = null;
        
        document.getElementById('event-modal-form').onsubmit = (e) => {
            e.preventDefault();
            this.saveEvent();
        };
        
        showModal('event-modal');
    }
    
    editEvent(eventId) {
        const event = getEventById(eventId);
        if (!event) {
            showToast('Evento non trovato', 'error');
            return;
        }
        
        this.currentEditingEvent = eventId;
        this.populateClassDropdowns();
        
        // Populate form fields
        document.getElementById('event-modal-title').value = event.title;
        document.getElementById('event-modal-type').value = event.type;
        
        const startDate = new Date(event.start);
        const endDate = new Date(event.end);
        
        document.getElementById('event-modal-start-date').value = startDate.toISOString().split('T')[0];
        document.getElementById('event-modal-start-time').value = startDate.toTimeString().substring(0, 5);
        document.getElementById('event-modal-end-date').value = endDate.toISOString().split('T')[0];
        document.getElementById('event-modal-end-time').value = endDate.toTimeString().substring(0, 5);
        
        if (event.classId) {
            document.getElementById('event-modal-classId').value = event.classId;
        }
        
        document.getElementById('event-modal-note').value = event.note || '';
        document.getElementById('event-modal-linkedToOrario').checked = event.linkedToOrario || false;
        
        document.getElementById('event-modal-form').onsubmit = (e) => {
            e.preventDefault();
            this.saveEvent();
        };
        
        showModal('event-modal');
    }
    
    saveEvent() {
        const title = document.getElementById('event-modal-title').value.trim();
        const type = document.getElementById('event-modal-type').value;
        const startDate = document.getElementById('event-modal-start-date').value;
        const startTime = document.getElementById('event-modal-start-time').value;
        const endDate = document.getElementById('event-modal-end-date').value || startDate;
        const endTime = document.getElementById('event-modal-end-time').value;
        const classId = document.getElementById('event-modal-classId').value || null;
        const note = document.getElementById('event-modal-note').value.trim();
        const linkedToOrario = document.getElementById('event-modal-linkedToOrario').checked;
        
        if (!title || !type || !startDate || !startTime) {
            showToast('Compila tutti i campi obbligatori', 'error');
            return;
        }
        
        const start = new Date(`${startDate}T${startTime}`).toISOString();
        const end = new Date(`${endDate}T${endTime}`).toISOString();
        
        const eventData = {
            title,
            type,
            start,
            end,
            classId,
            note,
            linkedToOrario
        };
        
        if (this.currentEditingEvent) {
            // Update existing event
            updateEvent(this.currentEditingEvent, eventData);
            showToast('Evento aggiornato!', 'success');
        } else {
            // Create new event
            createEvent(eventData);
            showToast('Evento creato!', 'success');
        }
        
        hideModal('event-modal');
        this.renderAgenda();
        this.renderHome(); // Update suggestions on home
    }
    
    viewEvent(eventId) {
        this.editEvent(eventId);
    }
    
    deleteEventConfirm(eventId) {
        const event = getEventById(eventId);
        if (!event) {
            showToast('Evento non trovato', 'error');
            return;
        }
        
        if (confirm(`Sei sicuro di voler eliminare "${event.title}"?`)) {
            if (deleteEvent(eventId)) {
                showToast('Evento eliminato', 'success');
                this.renderAgenda();
                this.renderHome(); // Update suggestions on home
            } else {
                showToast('Errore durante l\'eliminazione', 'error');
            }
        }
    }
    
    renderAiAssistant() { renderChatMessages(); }
    renderDocumentImport() {
        const container = document.getElementById('documentImport');
        if (!container) return;

        // Check if container already has the enhanced UI
        const existingUpload = container.querySelector('.document-import-container');
        if (existingUpload) return; // Already rendered

        // Create enhanced document import UI
        const importUI = document.createElement('div');
        importUI.className = 'document-import-container';
        importUI.innerHTML = `
            <div class="import-header">
                <h2>Importa Documenti Didattici</h2>
                <p class="import-subtitle">Carica documenti e lascia che l'IA estragga automaticamente lezioni, compiti, orari e altro</p>
            </div>

            <div class="import-upload-area">
                <div class="upload-zone" id="upload-zone">
                    <span class="material-symbols-outlined upload-icon">upload_file</span>
                    <h3>Trascina qui i file o clicca per caricare</h3>
                    <p>Formati supportati: PDF, Word, Excel, CSV, TXT</p>
                    <input type="file" id="document-upload-input" accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls" style="display: none;">
                    <button class="btn btn-primary" onclick="document.getElementById('document-upload-input').click()">
                        <span class="material-symbols-outlined">folder_open</span>
                        Seleziona File
                    </button>
                </div>
            </div>

            <div class="import-status" id="import-status" style="display: none;">
                <div class="status-indicator">
                    <span class="material-symbols-outlined spinning">sync</span>
                    <span id="status-text">Analisi in corso...</span>
                </div>
            </div>

            <div id="import-preview-container" class="import-preview-container"></div>

            <div class="import-help">
                <h3><span class="material-symbols-outlined">help</span> Tipi di documenti supportati</h3>
                <div class="supported-types">
                    <div class="type-card">
                        <span class="type-icon">📚</span>
                        <h4>Curriculum/Programma</h4>
                        <p>Estrazione di competenze, obiettivi e unità didattiche</p>
                    </div>
                    <div class="type-card">
                        <span class="type-icon">📋</span>
                        <h4>Piano Attività</h4>
                        <p>Riconoscimento di lezioni, compiti, verifiche e progetti</p>
                    </div>
                    <div class="type-card">
                        <span class="type-icon">🗓️</span>
                        <h4>Orario Scolastico</h4>
                        <p>Parsing di orari settimanali e slot temporali</p>
                    </div>
                    <div class="type-card">
                        <span class="type-icon">👥</span>
                        <h4>Anagrafica Studenti</h4>
                        <p>Importazione elenchi studenti con dati anagrafici</p>
                    </div>
                </div>
            </div>
        `;

        // Clear existing content and add new UI
        const existingContent = container.querySelector('.import-area');
        if (existingContent) {
            existingContent.replaceWith(importUI);
        } else {
            // Find where to insert (after h2)
            const h2 = container.querySelector('h2');
            if (h2 && h2.nextSibling) {
                h2.parentNode.insertBefore(importUI, h2.nextSibling);
            } else {
                container.appendChild(importUI);
            }
        }

        // Set up event listeners
        this.setupDocumentImportListeners();
    }

    setupDocumentImportListeners() {
        const fileInput = document.getElementById('document-upload-input');
        const uploadZone = document.getElementById('upload-zone');

        if (fileInput) {
            fileInput.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file) {
                    await this.handleDocumentUpload(file);
                }
            });
        }

        if (uploadZone) {
            // Drag and drop support
            uploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadZone.classList.add('drag-over');
            });

            uploadZone.addEventListener('dragleave', () => {
                uploadZone.classList.remove('drag-over');
            });

            uploadZone.addEventListener('drop', async (e) => {
                e.preventDefault();
                uploadZone.classList.remove('drag-over');
                
                const file = e.dataTransfer.files[0];
                if (file) {
                    await this.handleDocumentUpload(file);
                }
            });
        }
    }

    async handleDocumentUpload(file) {
        const statusDiv = document.getElementById('import-status');
        const statusText = document.getElementById('status-text');
        const previewContainer = document.getElementById('import-preview-container');

        if (statusDiv) statusDiv.style.display = 'block';
        if (statusText) statusText.textContent = 'Analisi documento in corso...';
        if (previewContainer) previewContainer.innerHTML = '';

        try {
            // Use import pipeline to process the document
            const importData = await importPipeline.handleDocumentUpload(file);
            
            if (importData) {
                // Hide status and show preview
                if (statusDiv) statusDiv.style.display = 'none';
                
                // Generate and display preview
                const previewHTML = importPipeline.generatePreviewHTML(importData);
                if (previewContainer) {
                    previewContainer.innerHTML = previewHTML;
                    importPipeline.attachFieldListeners();
                }
            } else {
                if (statusDiv) statusDiv.style.display = 'none';
                showToast('Errore durante l\'analisi del documento', 'error');
            }
        } catch (error) {
            console.error('Error handling document upload:', error);
            if (statusDiv) statusDiv.style.display = 'none';
            showToast('Errore durante l\'elaborazione del file: ' + error.message, 'error');
        }
    }
    
    renderNotifications() {
        const container = document.getElementById('notifications-content');
        if (!container) return;
        
        container.innerHTML = notificationSystem.generateNotificationHTML();
    }
    
    renderSettings() { 
        // REMOVED: Legacy display elements (old profile section)
        // NEW: Load all form fields with current values
        
        // Load AI FAB settings
        const fabCheckbox = document.getElementById('ai-fab-enabled-checkbox');
        if (fabCheckbox) {
            const fabEnabled = localStorage.getItem('ai-fab-enabled');
            fabCheckbox.checked = fabEnabled !== 'false'; // Default to true if not set
        }
        
        // Load profile settings
        this.loadProfileSettingsForm();
        
        // Load schedule settings
        this.loadScheduleSettingsForm();
        
        // Load school year settings
        this.loadSchoolYearSettingsForm();
        
        // Load AI settings
        this.loadAISettingsForm();

        // Load notification settings
        this.loadNotificationSettingsForm();
    }
    
    // NEW: Load profile settings form
    loadProfileSettingsForm() {
        const firstNameInput = document.getElementById('profile-first-name');
        if (firstNameInput) {
            firstNameInput.value = state.settings.teacherName || '';
        }
        
        const lastNameInput = document.getElementById('profile-last-name');
        if (lastNameInput) {
            lastNameInput.value = state.settings.teacherLastName || '';
        }
        
        const emailInput = document.getElementById('profile-email');
        if (emailInput) {
            emailInput.value = state.settings.teacherEmail || '';
        }
    }

    loadNotificationSettingsForm() {
        if (!window.notificationSystem) return;

        const preferences = window.notificationSystem.preferences;

        // Load notification modes
        const inAppCheckbox = document.getElementById('notification-enable-inapp');
        if (inAppCheckbox) inAppCheckbox.checked = preferences.enableInApp;

        const pushCheckbox = document.getElementById('notification-enable-push');
        if (pushCheckbox) pushCheckbox.checked = preferences.enablePush;

        const emailCheckbox = document.getElementById('notification-enable-email');
        if (emailCheckbox) emailCheckbox.checked = preferences.enableEmail;

        // Load notification types
        const deadlinesCheckbox = document.getElementById('notification-deadlines');
        if (deadlinesCheckbox) deadlinesCheckbox.checked = preferences.notifyDeadlines;

        const scheduleChangesCheckbox = document.getElementById('notification-schedule-changes');
        if (scheduleChangesCheckbox) scheduleChangesCheckbox.checked = preferences.notifyScheduleChanges;

        const newDocumentsCheckbox = document.getElementById('notification-new-documents');
        if (newDocumentsCheckbox) newDocumentsCheckbox.checked = preferences.notifyNewDocuments;

        const smartSuggestionsCheckbox = document.getElementById('notification-smart-suggestions');
        if (smartSuggestionsCheckbox) smartSuggestionsCheckbox.checked = preferences.notifySmartSuggestions;

        const institutionalCheckbox = document.getElementById('notification-institutional');
        if (institutionalCheckbox) institutionalCheckbox.checked = preferences.notifyInstitutional;
    }
    
    loadScheduleSettingsForm() {
        const scheduleSettings = state.settings.schedule || {};
        
        // Load hours per day
        const hoursInput = document.getElementById('schedule-hours-per-day');
        if (hoursInput) {
            hoursInput.value = scheduleSettings.hoursPerDay || 6;
        }
        
        // Load start time
        const startTimeInput = document.getElementById('schedule-start-time');
        if (startTimeInput) {
            startTimeInput.value = scheduleSettings.startTime || '08:00';
        }
        
        // Load working days
        const workingDays = scheduleSettings.workingDays || [1, 2, 3, 4, 5];
        for (let i = 0; i <= 6; i++) {
            const checkbox = document.getElementById(`schedule-day-${i}`);
            if (checkbox) {
                checkbox.checked = workingDays.includes(i);
            }
        }
    }
    
    loadSchoolYearSettingsForm() {
        const schoolYearSelect = document.getElementById('school-year-select');
        if (schoolYearSelect) {
            schoolYearSelect.value = state.settings.schoolYear || '';
        }
    }
    
    loadAISettingsForm() {
        const apiKeyInput = document.getElementById('ai-api-key-input');
        if (apiKeyInput) {
            apiKeyInput.value = state.settings.aiApiKey || '';
        }
        
        const modelSelect = document.getElementById('ai-model-select');
        if (modelSelect) {
            modelSelect.value = state.settings.aiModel || 'gpt-3.5-turbo';
        }
    }
    
    saveScheduleSettings() {
        const hoursPerDay = parseInt(document.getElementById('schedule-hours-per-day').value);
        const startTime = document.getElementById('schedule-start-time').value;
        
        // Get selected working days
        const workingDays = [];
        for (let i = 0; i <= 6; i++) {
            const checkbox = document.getElementById(`schedule-day-${i}`);
            if (checkbox && checkbox.checked) {
                workingDays.push(i);
            }
        }
        
        if (workingDays.length === 0) {
            showToast('Seleziona almeno un giorno lavorativo', 'error');
            return;
        }
        
        // Calculate end time based on hours per day
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const endHour = startHour + hoursPerDay;
        const endTime = `${String(endHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`;
        
        // Update settings
        state.settings.schedule = {
            hoursPerDay,
            startTime,
            endTime,
            workingDays,
            slotDuration: 60
        };
        
        saveData();
        showToast('Impostazioni orario salvate! Ripianificazione in corso...', 'success');
        
        // Trigger auto-planning pipeline
        this.triggerAutoPlanning();
        
        // Re-render schedule
        this.renderSchedule();
    }
    
    saveSchoolYearSettings() {
        const schoolYear = document.getElementById('school-year-select').value.trim();
        
        if (!schoolYear) {
            showToast('Seleziona un anno scolastico', 'error');
            return;
        }
        
        state.settings.schoolYear = schoolYear;
        saveData();
        showToast('Anno scolastico salvato!', 'success');
        
        // Update display
        this.renderSettings();
        
        // Check if profile is now complete
        this.checkProfileCompleteness();
        
        // Trigger auto-planning pipeline
        this.triggerAutoPlanning();
    }
    
    // NEW: Save profile settings
    saveProfileSettings() {
        const firstName = document.getElementById('profile-first-name').value.trim();
        const lastName = document.getElementById('profile-last-name').value.trim();
        const email = document.getElementById('profile-email').value.trim();
        
        if (!firstName) {
            showToast('Il nome è obbligatorio', 'error');
            return;
        }
        
        // Validate email if provided
        if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            showToast('Inserisci un indirizzo email valido', 'error');
            return;
        }
        
        state.settings.teacherName = firstName;
        state.settings.teacherLastName = lastName;
        state.settings.teacherEmail = email;
        
        saveData();
        showToast('Profilo salvato!', 'success');
        
        // Mark onboarding as complete if first time
        if (!isOnboardingComplete()) {
            localStorage.setItem('onboardingComplete', 'true');
        }
        
        // Check if profile is now complete
        this.checkProfileCompleteness();
        
        this.renderSettings();
    }
    
    // NEW: Save class management settings
    saveClassManagementSettings() {
        const selectedClasses = [];
        document.querySelectorAll('#generated-classes-list input[type="checkbox"]:checked').forEach(checkbox => {
            selectedClasses.push({
                name: checkbox.value,
                schoolYear: state.settings.schoolYear || new Date().getFullYear() + '/' + (new Date().getFullYear() + 1)
            });
        });
        
        if (selectedClasses.length === 0) {
            showToast('Seleziona almeno una classe', 'warning');
            return;
        }
        
        // Add selected classes to state.classes if not already present
        selectedClasses.forEach(classData => {
            const exists = state.classes.find(c => c.name === classData.name);
            if (!exists) {
                state.classes.push({
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                    name: classData.name,
                    schoolYear: classData.schoolYear,
                    description: `Generata automaticamente`,
                    createdAt: new Date().toISOString()
                });
            }
        });
        
        saveData();
        showToast(`${selectedClasses.length} classi salvate!`, 'success');
        
        // Re-render classes and settings
        this.renderClasses();
        this.renderSettings();
    }
    
    // NEW: Generate classes based on selected sections and levels
    generateClasses() {
        const selectedSections = [];
        document.querySelectorAll('.section-checkbox:checked').forEach(checkbox => {
            selectedSections.push(checkbox.value);
        });
        
        const selectedLevels = [];
        document.querySelectorAll('.level-checkbox:checked').forEach(checkbox => {
            selectedLevels.push(checkbox.value);
        });
        
        if (selectedSections.length === 0 || selectedLevels.length === 0) {
            showToast('Seleziona almeno una sezione e un livello', 'warning');
            return;
        }
        
        // Generate class names (e.g., 1A, 1B, 2A, 2B, etc.)
        const generatedClasses = [];
        selectedLevels.forEach(level => {
            selectedSections.forEach(section => {
                generatedClasses.push(`${level}${section}`);
            });
        });
        
        // Display generated classes in preview
        const previewDiv = document.getElementById('generated-classes-preview');
        const listDiv = document.getElementById('generated-classes-list');
        
        if (previewDiv && listDiv) {
            previewDiv.style.display = 'block';
            listDiv.innerHTML = generatedClasses.map(className => `
                <label>
                    <input type="checkbox" value="${className}" checked>
                    Classe ${className}
                </label>
            `).join('');
            
            showToast(
                generatedClasses.length === 1
                    ? `Generata 1 classe`
                    : `Generate ${generatedClasses.length} classi`,
                'success'
            );
        }
    }
    
    // NEW: Check profile completeness and update UI
    checkProfileCompleteness() {
        if (isProfileComplete()) {
            hideOnboardingBanner();
            enableAllMenuItems();
            showToast('✅ Profilo completo! Tutte le funzionalità sono disponibili.', 'success');
        }
    }
    
    saveAISettings() {
        const apiKey = document.getElementById('ai-api-key-input').value.trim();
        const model = document.getElementById('ai-model-select').value;
        
        // Validate API key format if provided
        const statusDiv = document.getElementById('api-key-status');
        if (apiKey) {
            // Basic validation (OpenRouter keys typically start with 'sk-or-v1-')
            if (apiKey.startsWith('sk-or-v1-')) {
                if (statusDiv) {
                    statusDiv.style.display = 'block';
                    statusDiv.innerHTML = '<span style="color: var(--md-success);">✓ Formato chiave API valido</span>';
                }
            } else {
                if (statusDiv) {
                    statusDiv.style.display = 'block';
                    statusDiv.innerHTML = '<span style="color: var(--md-warning);">⚠️ Formato chiave non standard. Verifica che sia corretto.</span>';
                }
            }
        } else {
            if (statusDiv) {
                statusDiv.style.display = 'none';
            }
        }
        
        state.settings.aiApiKey = apiKey;
        state.settings.aiModel = model;
        
        saveData();
        showToast('Impostazioni IA salvate!', 'success');
        
        // Update AI ready status on home
        const aiReadyElement = document.getElementById('home-ai-ready');
        if (aiReadyElement) {
            aiReadyElement.textContent = apiKey ? 'Configurata ✓' : 'Non configurata';
            aiReadyElement.style.color = apiKey ? '#27ae60' : '#e74c3c';
        }
    }
    
    editProfile() {
        // Show a simple prompt dialog for editing profile
        const firstName = prompt('Nome:', state.settings.teacherName || '');
        if (firstName === null) return; // User cancelled
        
        const lastName = prompt('Cognome:', state.settings.teacherLastName || '');
        if (lastName === null) return; // User cancelled
        
        // Validate that at least first name is provided
        if (!firstName.trim()) {
            showToast('Il nome è obbligatorio', 'warning');
            return;
        }
        
        state.settings.teacherName = firstName;
        state.settings.teacherLastName = lastName;
        
        saveData();
        showToast('Profilo aggiornato!', 'success');
        this.renderSettings();
        
        // Check if profile is now complete and update UI
        if (isProfileComplete()) {
            hideOnboardingBanner();
            enableAllMenuItems();
            showToast('Profilo completo! Tutte le funzionalità sono ora disponibili.', 'success');
        }
    }
    
    triggerAutoPlanning() {
        // TODO: Implement auto-planning pipeline
        // This function should:
        // 1. Re-validate all scheduled activities against new time slots
        // 2. Update notifications based on new schedule
        // 3. Generate suggestions for rescheduling if conflicts exist
        // 4. Update AI suggestions based on new configuration
        
        console.log('Auto-planning pipeline triggered');
        console.log('Current schedule settings:', state.settings.schedule);
        
        // For now, just show a toast with TODO
        setTimeout(() => {
            showToast('📝 TODO: Pipeline auto-pianificante sarà implementata in versioni future', 'info', 4000);
        }, 1000);
    }
    renderBackupRestore() { 
        // Backup/restore functionality
    }
    renderNotifications() { 
        // Notifications - future feature
    }
    renderInfoApp() { 
        // App info - future feature
    }
    renderHelp() { 
        // Help content already in HTML
    }
    
    // Expose CRUD functions to window scope
    showModal(modalId) { showModal(modalId); }
    hideModal(modalId) { hideModal(modalId); }
    
    // Classes CRUD
    newClass() {
        // Reset form for new entry
        document.getElementById('class-modal-form').reset();
        document.getElementById('class-modal-form').onsubmit = (e) => {
            e.preventDefault();
            createClass();
        };
        showModal('class-modal');
    }
    editClass(id) { editClass(id); }
    deleteClass(id) { deleteClass(id); }
    
    // Students CRUD
    newStudent() {
        document.getElementById('student-modal-form').reset();
        this.populateClassDropdowns();
        document.getElementById('student-modal-form').onsubmit = (e) => {
            e.preventDefault();
            createStudent();
        };
        showModal('student-modal');
    }
    editStudent(id) { editStudent(id); }
    deleteStudent(id) { deleteStudent(id); }
    exportStudentsCSV() { exportStudentsCSV(); }
    importStudentsCSV(file) { importStudentsCSV(file); }
    
    // Lessons CRUD
    newLesson() {
        document.getElementById('lesson-modal-form').reset();
        this.populateClassDropdowns();
        this.populateSubjectDropdown();
        // Set default date to today
        document.getElementById('lesson-modal-date').value = new Date().toISOString().split('T')[0];
        document.getElementById('lesson-modal-form').onsubmit = (e) => {
            e.preventDefault();
            createLesson();
        };
        showModal('lesson-modal');
    }
    editLesson(id) { editLesson(id); }
    deleteLesson(id) { deleteLesson(id); }
    
    // Activities CRUD
    newActivity() {
        document.getElementById('activity-modal-form').reset();
        this.populateClassDropdowns();
        // Set default date to today
        document.getElementById('activity-modal-date').value = new Date().toISOString().split('T')[0];
        document.getElementById('activity-modal-form').onsubmit = (e) => {
            e.preventDefault();
            createActivity();
        };
        showModal('activity-modal');
    }
    editActivity(id) { editActivity(id); }
    deleteActivity(id) { deleteActivity(id); }
    
    // Evaluations CRUD
    newEvaluation() {
        document.getElementById('evaluation-modal-form').reset();
        this.populateStudentDropdown();
        this.populateActivityDropdown();
        // Set default date to today
        document.getElementById('evaluation-modal-date').value = new Date().toISOString().split('T')[0];
        document.getElementById('evaluation-modal-form').onsubmit = (e) => {
            e.preventDefault();
            createEvaluation();
        };
        showModal('evaluation-modal');
    }
    editEvaluation(id) { editEvaluation(id); }
    deleteEvaluation(id) { deleteEvaluation(id); }
    
    // Helper functions to populate dropdowns
    populateClassDropdowns() {
        const classSelects = [
            'student-modal-classId',
            'lesson-modal-classId',
            'activity-modal-classId'
        ];
        
        classSelects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (select) {
                // Keep the first option (None/empty)
                const firstOption = select.options[0];
                select.innerHTML = '';
                select.appendChild(firstOption);
                
                // Add all classes
                state.classes.forEach(cls => {
                    const option = document.createElement('option');
                    option.value = cls.id;
                    option.textContent = cls.name;
                    select.appendChild(option);
                });
            }
        });
    }
    
    populateSubjectDropdown() {
        const select = document.getElementById('lesson-modal-subject');
        if (select) {
            const firstOption = select.options[0];
            select.innerHTML = '';
            select.appendChild(firstOption);
            
            this.subjectsPreset.forEach(subject => {
                const option = document.createElement('option');
                option.value = subject;
                option.textContent = subject;
                select.appendChild(option);
            });
        }
    }
    
    populateStudentDropdown() {
        const select = document.getElementById('evaluation-modal-studentId');
        if (select) {
            const firstOption = select.options[0];
            select.innerHTML = '';
            select.appendChild(firstOption);
            
            state.students.forEach(student => {
                const option = document.createElement('option');
                option.value = student.id;
                option.textContent = `${student.firstName} ${student.lastName}`;
                select.appendChild(option);
            });
        }
    }
    
    populateActivityDropdown() {
        const select = document.getElementById('evaluation-modal-activityId');
        if (select) {
            const firstOption = select.options[0];
            select.innerHTML = '';
            select.appendChild(firstOption);
            
            state.activities.forEach(activity => {
                const option = document.createElement('option');
                option.value = activity.id;
                option.textContent = `${activity.title} (${activity.type})`;
                select.appendChild(option);
            });
        }
    }

    // AI Agent FAB methods
    openAIAgentModal() {
        openAIAgentModal();
    }

    closeAIAgentModal() {
        closeAIAgentModal();
    }

    resetAIFABPosition() {
        resetFABPosition();
    }

    toggleAIFAB(enabled) {
        toggleFABVisibility(enabled);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        window.app = new DocentePlusPlus();
        window.app.init();
        // Expose showToast globally for theme picker
        window.showToast = showToast;
    } catch (error) {
        console.error("Fatal error during app initialization:", error);
        document.body.innerHTML = '<div style="text-align:center;padding:20px;"><h1>Errore Critico</h1><p>L\'applicazione non è riuscita a caricarsi. Controlla la console per i dettagli.</p></div>';
    }
});
