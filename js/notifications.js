
// js/notifications.js
// Proactive notification system for reminders and institutional commitments

import { state, saveData } from './data.js';
import { showToast } from './ui.js';

/**
 * Proactive Notifications System
 * Manages day-after reminders and institutional commitments
 */

export class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.reminders = [];
        this.institutionalCommitments = [];
        
        // User preferences for notifications
        this.preferences = {
            enableInApp: true,
            enablePush: false,
            enableEmail: false,
            notifyDeadlines: true,
            notifyScheduleChanges: true,
            notifyNewDocuments: true,
            notifySmartSuggestions: true,
            notifyInstitutional: true
        };
        
        // Initialize from localStorage
        this.loadNotifications();
        
        // Auto-check interval (every hour)
        this.autoCheckInterval = null;
    }

    /**
     * Load notifications from localStorage
     */
    loadNotifications() {
        try {
            this.notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
            this.reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
            this.institutionalCommitments = JSON.parse(localStorage.getItem('institutionalCommitments') || '[]');
            
            // Load user preferences
            const savedPreferences = localStorage.getItem('notificationPreferences');
            if (savedPreferences) {
                this.preferences = { ...this.preferences, ...JSON.parse(savedPreferences) };
            }
        } catch (error) {
            console.error('Error loading notifications:', error);
            this.notifications = [];
            this.reminders = [];
            this.institutionalCommitments = [];
        }
    }

    /**
     * Save notifications to localStorage
     */
    saveNotifications() {
        try {
            localStorage.setItem('notifications', JSON.stringify(this.notifications));
            localStorage.setItem('reminders', JSON.stringify(this.reminders));
            localStorage.setItem('institutionalCommitments', JSON.stringify(this.institutionalCommitments));
            localStorage.setItem('notificationPreferences', JSON.stringify(this.preferences));
        } catch (error) {
            console.error('Error saving notifications:', error);
        }
    }

    /**
     * Initialize auto-check system
     */
    startAutoCheck() {
        // Check immediately
        this.checkAndGenerateNotifications();
        
        // Check every hour
        this.autoCheckInterval = setInterval(() => {
            this.checkAndGenerateNotifications();
        }, 60 * 60 * 1000); // 1 hour
    }

    /**
     * Stop auto-check system
     */
    stopAutoCheck() {
        if (this.autoCheckInterval) {
            clearInterval(this.autoCheckInterval);
            this.autoCheckInterval = null;
        }
    }

    /**
     * Main notification generation logic
     */
    async checkAndGenerateNotifications() {
        try {
            // Generate day-after reminders
            await this.generateDayAfterReminders();
            
            // Check institutional commitments
            await this.checkInstitutionalCommitments();
            
            // Check activity deadlines
            await this.checkActivityDeadlines();
            
            // Clean old notifications
            this.cleanOldNotifications();
            
            // Save
            this.saveNotifications();
            
            // Update UI if available
            if (window.app && window.app.renderNotifications) {
                window.app.renderNotifications();
            }
            
        } catch (error) {
            console.error('Error generating notifications:', error);
        }
    }

    /**
     * Generate day-after reminders for completed lessons
     */
    async generateDayAfterReminders() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        // Find lessons from yesterday
        const yesterdayLessons = state.lessons.filter(lesson => {
            return lesson.date === yesterdayStr;
        });

        yesterdayLessons.forEach(lesson => {
            // Check if we already created a reminder for this lesson
            const exists = this.reminders.find(r => 
                r.type === 'day_after' && 
                r.lessonId === lesson.id
            );

            if (!exists) {
                // Create day-after reminder
                const reminder = {
                    id: `reminder_${Date.now()}_${lesson.id}`,
                    type: 'day_after',
                    lessonId: lesson.id,
                    title: `Revisione Lezione: ${lesson.title}`,
                    message: `Ricordati di verificare se gli studenti hanno compreso gli argomenti della lezione di ieri.`,
                    classId: lesson.classId,
                    date: yesterdayStr,
                    createdAt: new Date().toISOString(),
                    priority: 'medium',
                    status: 'active',
                    actions: [
                        {
                            label: 'Aggiungi Nota',
                            action: 'add_note',
                            lessonId: lesson.id
                        },
                        {
                            label: 'Programma Follow-up',
                            action: 'schedule_followup',
                            lessonId: lesson.id
                        }
                    ]
                };

                this.reminders.push(reminder);
                
                // Create notification
                this.createNotification({
                    title: '📅 Promemoria Giorno Dopo',
                    message: reminder.message,
                    type: 'day_after',
                    priority: 'medium',
                    relatedId: lesson.id
                });
            }
        });
    }

    /**
     * Check and notify about institutional commitments
     */
    async checkInstitutionalCommitments() {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentDay = today.getDate();

        // Predefined institutional commitments (Italian school calendar)
        const defaultCommitments = [
            {
                name: 'Scrutini Primo Quadrimestre',
                month: 1, // February
                dayStart: 1,
                dayEnd: 15,
                priority: 'high',
                daysBeforeNotify: 7
            },
            {
                name: 'Consigli di Classe - Primo Periodo',
                month: 10, // November
                dayStart: 15,
                dayEnd: 30,
                priority: 'medium',
                daysBeforeNotify: 5
            },
            {
                name: 'Scrutini Finali',
                month: 5, // June
                dayStart: 1,
                dayEnd: 15,
                priority: 'critical',
                daysBeforeNotify: 10
            },
            {
                name: 'Colloqui con le Famiglie',
                month: 11, // December
                dayStart: 10,
                dayEnd: 20,
                priority: 'medium',
                daysBeforeNotify: 7
            },
            {
                name: 'Colloqui con le Famiglie',
                month: 3, // April
                dayStart: 10,
                dayEnd: 20,
                priority: 'medium',
                daysBeforeNotify: 7
            }
        ];

        // Merge with custom commitments
        const allCommitments = [
            ...defaultCommitments,
            ...this.institutionalCommitments
        ];

        allCommitments.forEach(commitment => {
            if (commitment.month === currentMonth) {
                const daysUntilStart = commitment.dayStart - currentDay;
                
                // Notify if within notification window
                if (daysUntilStart > 0 && daysUntilStart <= commitment.daysBeforeNotify) {
                    // Check if already notified
                    const exists = this.notifications.find(n => 
                        n.type === 'institutional' && 
                        n.commitmentName === commitment.name &&
                        n.month === currentMonth
                    );

                    if (!exists) {
                        this.createNotification({
                            title: '🏫 Impegno Istituzionale Imminente',
                            message: `${commitment.name} tra ${daysUntilStart} giorni (${commitment.dayStart}-${commitment.dayEnd} del mese)`,
                            type: 'institutional',
                            priority: commitment.priority,
                            commitmentName: commitment.name,
                            month: currentMonth,
                            actions: [
                                {
                                    label: 'Prepara Documentazione',
                                    action: 'prepare_docs'
                                }
                            ]
                        });
                    }
                }
            }
        });
    }

    /**
     * Check activity deadlines
     */
    async checkActivityDeadlines() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        state.activities.forEach(activity => {
            if (activity.status === 'completed') return;

            const activityDate = new Date(activity.date);
            activityDate.setHours(0, 0, 0, 0);
            
            const daysUntil = Math.floor((activityDate - today) / (1000 * 60 * 60 * 24));

            // Notify 3 days before, 1 day before, and on due date
            const notifyDays = [3, 1, 0];
            
            if (notifyDays.includes(daysUntil)) {
                // Check if already notified for this day
                const exists = this.notifications.find(n => 
                    n.type === 'activity_deadline' && 
                    n.activityId === activity.id &&
                    n.daysUntil === daysUntil
                );

                if (!exists) {
                    let message = '';
                    let priority = 'low';

                    if (daysUntil === 0) {
                        message = `Scadenza OGGI: ${activity.title}`;
                        priority = 'critical';
                    } else if (daysUntil === 1) {
                        message = `Scadenza domani: ${activity.title}`;
                        priority = 'high';
                    } else {
                        message = `Scadenza tra ${daysUntil} giorni: ${activity.title}`;
                        priority = 'medium';
                    }

                    this.createNotification({
                        title: '⏰ Scadenza Attività',
                        message: message,
                        type: 'activity_deadline',
                        priority: priority,
                        activityId: activity.id,
                        daysUntil: daysUntil,
                        actions: [
                            {
                                label: 'Visualizza Attività',
                                action: 'view_activity',
                                activityId: activity.id
                            }
                        ]
                    });
                }
            }
        });
    }

    /**
     * Create a new notification
     */
    createNotification(notificationData) {
        const notification = {
            id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
            title: notificationData.title,
            message: notificationData.message,
            type: notificationData.type,
            priority: notificationData.priority || 'medium',
            createdAt: new Date().toISOString(),
            read: false,
            dismissed: false,
            completed: false,
            snoozedUntil: null,
            actions: notificationData.actions || [],
            ...notificationData
        };

        this.notifications.push(notification);
        
        // Check if notification should be shown based on preferences
        const shouldShow = this.shouldShowNotification(notification);
        
        if (shouldShow && this.preferences.enableInApp) {
            // Show toast for high/critical priority
            if (['high', 'critical'].includes(notification.priority)) {
                showToast(notification.message, 'warning', 5000);
            }
        }

        // Send push notification if enabled
        if (shouldShow && this.preferences.enablePush) {
            this.sendPushNotification(notification);
        }

        // Send email if enabled
        if (shouldShow && this.preferences.enableEmail) {
            this.sendEmailNotification(notification);
        }

        this.saveNotifications();
        this.updateUI();

        return notification;
    }

    /**
     * Check if notification should be shown based on preferences
     */
    shouldShowNotification(notification) {
        switch (notification.type) {
            case 'activity_deadline':
                return this.preferences.notifyDeadlines;
            case 'schedule_change':
                return this.preferences.notifyScheduleChanges;
            case 'new_document':
                return this.preferences.notifyNewDocuments;
            case 'smart_suggestion':
                return this.preferences.notifySmartSuggestions;
            case 'institutional':
                return this.preferences.notifyInstitutional;
            default:
                return true; // Show other notification types by default
        }
    }

    /**
     * Add custom institutional commitment
     */
    addInstitutionalCommitment(commitment) {
        const newCommitment = {
            id: `commit_${Date.now()}`,
            name: commitment.name,
            month: commitment.month,
            dayStart: commitment.dayStart,
            dayEnd: commitment.dayEnd,
            priority: commitment.priority || 'medium',
            daysBeforeNotify: commitment.daysBeforeNotify || 7,
            custom: true,
            createdAt: new Date().toISOString()
        };

        this.institutionalCommitments.push(newCommitment);
        this.saveNotifications();
        
        showToast('Impegno istituzionale aggiunto', 'success');
        
        return newCommitment;
    }

    /**
     * Mark notification as read
     */
    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.saveNotifications();
            this.updateUI();
        }
    }

    /**
     * Mark all notifications as read
     */
    markAllAsRead() {
        this.notifications.forEach(n => n.read = true);
        this.saveNotifications();
        this.updateUI();
        showToast('Tutte le notifiche segnate come lette', 'success');
    }

    /**
     * Dismiss notification
     */
    dismissNotification(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.dismissed = true;
            this.saveNotifications();
            this.updateUI();
        }
    }

    /**
     * Snooze notification (remind in X minutes)
     */
    snoozeNotification(notificationId, minutes = 30) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.snoozedUntil = new Date(Date.now() + minutes * 60000).toISOString();
            notification.read = true;
            this.saveNotifications();
            this.updateUI();
            showToast(`Notifica rimandata di ${minutes} minuti`, 'info');
        }
    }

    /**
     * Mark notification as completed
     */
    markAsCompleted(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.completed = true;
            notification.read = true;
            this.saveNotifications();
            this.updateUI();
            showToast('Notifica completata', 'success');
        }
    }

    /**
     * Update user preferences
     */
    updatePreferences(newPreferences) {
        this.preferences = { ...this.preferences, ...newPreferences };
        this.saveNotifications();
        showToast('Preferenze notifiche aggiornate', 'success');
        
        // Request push permission if enabled
        if (this.preferences.enablePush && 'Notification' in window) {
            this.requestPushPermission();
        }
    }

    /**
     * Request push notification permission
     */
    async requestPushPermission() {
        if (!('Notification' in window)) {
            console.log('Push notifications not supported');
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                showToast('Notifiche push abilitate', 'success');
                return true;
            }
        }

        showToast('Notifiche push non disponibili', 'warning');
        return false;
    }

    /**
     * Send push notification
     */
    async sendPushNotification(notification) {
        if (!this.preferences.enablePush) return;
        if (Notification.permission !== 'granted') return;

        try {
            new Notification(notification.title, {
                body: notification.message,
                icon: '/icons/icon-192x192.png',
                badge: '/icons/icon-192x192.png',
                tag: notification.id,
                requireInteraction: notification.priority === 'critical'
            });
        } catch (error) {
            console.error('Error sending push notification:', error);
        }
    }

    /**
     * Send email notification (mock)
     */
    async sendEmailNotification(notification) {
        if (!this.preferences.enableEmail) return;

        // Mock email sending - in production this would call an API
        console.log('📧 Mock Email Sent:', {
            to: state.settings.teacherEmail || 'teacher@example.com',
            subject: notification.title,
            body: notification.message,
            timestamp: new Date().toISOString()
        });

        // Store in email log
        const emailLog = JSON.parse(localStorage.getItem('emailNotificationLog') || '[]');
        emailLog.push({
            id: `email_${Date.now()}`,
            notificationId: notification.id,
            timestamp: new Date().toISOString(),
            subject: notification.title,
            body: notification.message,
            status: 'sent'
        });
        localStorage.setItem('emailNotificationLog', JSON.stringify(emailLog.slice(-100))); // Keep last 100
    }

    /**
     * Update UI (notification center badge, etc.)
     */
    updateUI() {
        // Update notification badge (now in sidebar)
        const badge = document.getElementById('notification-badge-sidebar');
        const unreadCount = this.getUnreadCount();
        if (badge) {
            badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
            badge.style.display = unreadCount > 0 ? 'flex' : 'none';
        }

        // Update notification center if open
        const centerContent = document.getElementById('notification-center-content');
        if (centerContent && centerContent.parentElement.classList.contains('open')) {
            this.renderNotificationCenter();
        }
    }

    /**
     * Clean old notifications (older than 30 days)
     */
    cleanOldNotifications() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        this.notifications = this.notifications.filter(n => {
            const createdAt = new Date(n.createdAt);
            return createdAt > thirtyDaysAgo || !n.dismissed;
        });

        this.reminders = this.reminders.filter(r => {
            const createdAt = new Date(r.createdAt);
            return createdAt > thirtyDaysAgo || r.status === 'active';
        });
    }

    /**
     * Get active notifications
     */
    getActiveNotifications() {
        return this.notifications
            .filter(n => !n.dismissed)
            .sort((a, b) => {
                // Sort by priority then date
                const priorityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
                const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
                
                if (priorityDiff !== 0) return priorityDiff;
                
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
    }

    /**
     * Get unread count
     */
    getUnreadCount() {
        return this.notifications.filter(n => !n.read && !n.dismissed).length;
    }

    /**
     * Get notifications by type
     */
    getNotificationsByType(type) {
        return this.notifications.filter(n => n.type === type && !n.dismissed);
    }

    /**
     * Get notifications by priority
     */
    getNotificationsByPriority(priority) {
        return this.notifications.filter(n => n.priority === priority && !n.dismissed);
    }

    /**
     * Handle notification action
     */
    async handleAction(notificationId, action) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (!notification) return;

        switch (action.action) {
            case 'view_activity':
                if (window.app) {
                    window.app.switchTab('activities');
                    // TODO: Highlight specific activity
                }
                break;
                
            case 'add_note':
                // TODO: Open note dialog
                showToast('Funzionalità note in sviluppo', 'info');
                break;
                
            case 'schedule_followup':
                // TODO: Open schedule dialog
                showToast('Funzionalità follow-up in sviluppo', 'info');
                break;
                
            case 'prepare_docs':
                showToast('Promemoria impostato per preparazione documentazione', 'info');
                break;

            case 'mark_read':
                this.markAsRead(notificationId);
                break;

            case 'mark_completed':
                this.markAsCompleted(notificationId);
                break;

            case 'snooze':
                this.snoozeNotification(notificationId, action.minutes || 30);
                break;

            case 'dismiss':
                this.dismissNotification(notificationId);
                break;
                
            default:
                console.log('Unknown action:', action);
        }

        // Mark as read after action (unless it's a snooze)
        if (action.action !== 'snooze') {
            this.markAsRead(notificationId);
        }
    }

    /**
     * Notify about new document
     */
    notifyNewDocument(documentTitle, documentType) {
        if (!this.preferences.notifyNewDocuments) return;

        this.createNotification({
            title: '📄 Nuovo Documento',
            message: `È stato aggiunto un nuovo documento: ${documentTitle}`,
            type: 'new_document',
            priority: 'low',
            documentTitle,
            documentType,
            actions: [
                { label: 'Visualizza', action: 'view_document' },
                { label: 'Segna come letto', action: 'mark_read' }
            ]
        });
    }

    /**
     * Notify about schedule change
     */
    notifyScheduleChange(changeDetails) {
        if (!this.preferences.notifyScheduleChanges) return;

        this.createNotification({
            title: '📅 Cambio Orario',
            message: changeDetails,
            type: 'schedule_change',
            priority: 'high',
            actions: [
                { label: 'Visualizza Orario', action: 'view_schedule' },
                { label: 'Segna come letto', action: 'mark_read' }
            ]
        });
    }

    /**
     * Notify about smart suggestion
     */
    notifySmartSuggestion(suggestion) {
        if (!this.preferences.notifySmartSuggestions) return;

        this.createNotification({
            title: '💡 Suggerimento Smart',
            message: suggestion.message,
            type: 'smart_suggestion',
            priority: 'low',
            suggestion,
            actions: [
                { label: 'Visualizza', action: 'view_suggestion' },
                { label: 'Ignora', action: 'dismiss' }
            ]
        });
    }

    /**
     * Get notifications with filters
     */
    getFilteredNotifications(filter = 'all') {
        let notifications = this.notifications.filter(n => !n.dismissed);

        // Filter out snoozed notifications
        const now = new Date();
        notifications = notifications.filter(n => {
            if (!n.snoozedUntil) return true;
            return new Date(n.snoozedUntil) <= now;
        });

        switch (filter) {
            case 'unread':
                return notifications.filter(n => !n.read);
            case 'completed':
                return notifications.filter(n => n.completed);
            case 'important':
                return notifications.filter(n => ['high', 'critical'].includes(n.priority));
            default:
                return notifications;
        }
    }

    /**
     * Render notification center UI
     */
    renderNotificationCenter() {
        const container = document.getElementById('notification-center-content');
        if (!container) return;

        const filter = container.dataset.filter || 'all';
        const notifications = this.getFilteredNotifications(filter);

        if (notifications.length === 0) {
            container.innerHTML = `
                <div class="notification-center-empty">
                    <span class="material-symbols-outlined">notifications_off</span>
                    <p>Nessuna notifica</p>
                </div>
            `;
            return;
        }

        // Sort notifications by priority and date
        const sortedNotifications = notifications.sort((a, b) => {
            const priorityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
            const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
            if (priorityDiff !== 0) return priorityDiff;
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        let html = '<div class="notification-center-list">';
        
        sortedNotifications.forEach(notification => {
            const iconMap = {
                'day_after': 'event_note',
                'institutional': 'school',
                'activity_deadline': 'alarm',
                'new_document': 'description',
                'schedule_change': 'schedule',
                'smart_suggestion': 'lightbulb',
                'reminder': 'notifications'
            };
            const icon = iconMap[notification.type] || 'notifications';
            const readClass = notification.read ? 'read' : 'unread';
            const completedClass = notification.completed ? 'completed' : '';
            const priorityClass = `priority-${notification.priority}`;

            html += `
                <div class="notification-item ${readClass} ${completedClass} ${priorityClass}" 
                     data-id="${notification.id}"
                     onclick="window.notificationSystem.markAsRead('${notification.id}')">
                    <div class="notification-icon">
                        <span class="material-symbols-outlined">${icon}</span>
                    </div>
                    <div class="notification-content">
                        <div class="notification-header">
                            <h4 class="notification-title">${notification.title}</h4>
                            <span class="notification-time">${this.formatTime(notification.createdAt)}</span>
                        </div>
                        <p class="notification-message">${notification.message}</p>
                        ${notification.actions && notification.actions.length > 0 ? `
                            <div class="notification-actions">
                                ${notification.actions.map(action => `
                                    <button class="btn-notification-action" 
                                            onclick="event.stopPropagation(); window.notificationSystem.handleAction('${notification.id}', ${JSON.stringify(action).replace(/"/g, '&quot;')})">
                                        ${action.label}
                                    </button>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                    <button class="btn-dismiss" 
                            onclick="event.stopPropagation(); window.notificationSystem.dismissNotification('${notification.id}')"
                            title="Rimuovi notifica">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    /**
     * Generate notification HTML
     */
    generateNotificationHTML() {
        const activeNotifications = this.getActiveNotifications();
        
        if (activeNotifications.length === 0) {
            return '<div class="notifications-empty"><p>📭 Nessuna notifica</p></div>';
        }

        let html = '<div class="notifications-list">';
        
        activeNotifications.forEach(notification => {
            const priorityClass = `priority-${notification.priority}`;
            const readClass = notification.read ? 'read' : 'unread';
            const iconMap = {
                'day_after': '📅',
                'institutional': '🏫',
                'activity_deadline': '⏰',
                'reminder': '🔔'
            };
            const icon = iconMap[notification.type] || '📢';

            html += `
                <div class="notification-item ${priorityClass} ${readClass}" data-id="${notification.id}">
                    <div class="notification-header">
                        <span class="notification-icon">${icon}</span>
                        <h4>${notification.title}</h4>
                        <button class="btn-icon btn-dismiss" onclick="window.notificationSystem.dismissNotification('${notification.id}')" title="Ignora">
                            ✕
                        </button>
                    </div>
                    <p class="notification-message">${notification.message}</p>
                    <div class="notification-meta">
                        <span class="notification-time">${this.formatTime(notification.createdAt)}</span>
                        <span class="notification-priority-badge">${this.formatPriority(notification.priority)}</span>
                    </div>
                    ${notification.actions && notification.actions.length > 0 ? `
                        <div class="notification-actions">
                            ${notification.actions.map(action => `
                                <button class="btn btn-sm btn-secondary" onclick="window.notificationSystem.handleAction('${notification.id}', ${JSON.stringify(action).replace(/"/g, '&quot;')})">
                                    ${action.label}
                                </button>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        });

        html += '</div>';
        
        return html;
    }

    formatTime(isoString) {
        const date = new Date(isoString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Adesso';
        if (diffMins < 60) return `${diffMins}m fa`;
        if (diffHours < 24) return `${diffHours}h fa`;
        if (diffDays < 7) return `${diffDays}g fa`;
        
        return date.toLocaleDateString('it-IT');
    }

    formatPriority(priority) {
        const labels = {
            'critical': '🔴 Critico',
            'high': '🟠 Alto',
            'medium': '🟡 Medio',
            'low': '🟢 Basso'
        };
        return labels[priority] || priority;
    }
}

// Create singleton instance
export const notificationSystem = new NotificationSystem();

// Make available globally
if (typeof window !== 'undefined') {
    window.notificationSystem = notificationSystem;
}

// Auto-start on load
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        notificationSystem.startAutoCheck();
    });
}
