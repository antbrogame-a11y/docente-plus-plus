
// js/events.js

import { completeOnboarding, skipOnboarding, clearAllData, state } from './data.js';
import { hideOnboarding, showToast, switchTab } from './ui.js';
import { sendMessageToAI } from './ai.js';
import { handleFileUpload } from './files.js';

export function setupEventListeners() {
    document.getElementById('menu-toggle')?.addEventListener('click', () => {
        document.getElementById('main-nav').classList.toggle('mobile-open');
        document.getElementById('menu-backdrop').classList.toggle('active');
    });
    document.getElementById('menu-backdrop')?.addEventListener('click', () => document.getElementById('menu-toggle').click());
    
    // Handle nav-item clicks
    document.querySelectorAll('.nav-item[data-tab]').forEach(button => {
        button.addEventListener('click', () => {
            // Check if item is disabled
            if (button.classList.contains('disabled')) {
                showToast('Completa il profilo per accedere a questa funzionalità', 'warning');
                return;
            }
            switchTab(button.dataset.tab);
        });
    });
    
    // Complete onboarding button in banner (NEW: Navigate to settings)
    document.getElementById('complete-onboarding-btn')?.addEventListener('click', () => {
        // Navigate to settings page
        switchTab('settings');
        showToast('Completa il tuo profilo nella sezione Impostazioni', 'info');
    });

    document.getElementById('onboarding-form')?.addEventListener('submit', e => {
        e.preventDefault();
        try {
            const settings = {
                teacherName: document.getElementById('onboarding-first-name')?.value || '',
                teacherLastName: document.getElementById('onboarding-last-name')?.value || '',
                schoolYear: document.getElementById('onboarding-school-year')?.value || '',
            };
            
            // Basic validation
            if (!settings.teacherName.trim()) {
                showToast('Inserisci almeno il tuo nome.', 'warning');
                return;
            }
            
            completeOnboarding(settings);
            hideOnboarding();
            showToast('Profilo configurato! Benvenuto in Docente++.', 'success');
            
            // Enable all menu items and hide banner
            if (window.app) {
                window.app.initializeAppUI();
            }
        } catch (error) {
            console.error('Error completing onboarding:', error);
            showToast('Errore durante il salvataggio. Riprova.', 'error');
        }
    });
    
    // Skip onboarding button handler - DISABLED
    // Skipping is no longer allowed to prevent unclear intermediate states
    document.getElementById('onboarding-skip')?.addEventListener('click', () => {
        showToast('Devi completare il profilo per utilizzare l\'applicazione.', 'warning');
    });

    document.getElementById('ai-chat-send')?.addEventListener('click', () => sendMessageToAI());
    document.getElementById('ai-chat-input')?.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessageToAI();
        }
    });
    document.getElementById('pdf-upload')?.addEventListener('change', e => handleFileUpload(e));
    
    // Clear all data button (troubleshooting)
    document.getElementById('clear-all-data-btn')?.addEventListener('click', () => {
        if (confirm('⚠️ ATTENZIONE: Questa azione cancellerà TUTTI i tuoi dati salvati (classi, studenti, lezioni, ecc.). Questa azione è irreversibile. Sei sicuro di voler continuare?')) {
            if (confirm('Sei VERAMENTE sicuro? Non potrai recuperare i dati cancellati.')) {
                try {
                    clearAllData();
                    showToast('Tutti i dati sono stati cancellati. La pagina verrà ricaricata.', 'success');
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                } catch (error) {
                    console.error('Error clearing data:', error);
                    showToast('Errore durante la cancellazione dei dati.', 'error');
                }
            }
        }
    });

    // AI FAB Settings Controls
    document.getElementById('ai-fab-enabled-checkbox')?.addEventListener('change', (e) => {
        if (window.app) {
            window.app.toggleAIFAB(e.target.checked);
            showToast(e.target.checked ? 'Agente IA attivato' : 'Agente IA disattivato', 'success');
        }
    });

    document.getElementById('reset-ai-fab-position-btn')?.addEventListener('click', () => {
        if (window.app) {
            window.app.resetAIFABPosition();
        }
    });
    
    // Schedule settings form
    document.getElementById('schedule-settings-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (window.app) {
            window.app.saveScheduleSettings();
        }
    });
    
    // NEW: Profile settings form
    document.getElementById('profile-settings-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (window.app) {
            window.app.saveProfileSettings();
        }
    });
    
    // School year settings form
    document.getElementById('school-year-settings-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (window.app) {
            window.app.saveSchoolYearSettings();
        }
    });
    
    // NEW: Class management form
    document.getElementById('class-management-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (window.app) {
            window.app.saveClassManagementSettings();
        }
    });
    
    // NEW: Generate classes button
    document.getElementById('generate-classes-btn')?.addEventListener('click', () => {
        if (window.app) {
            window.app.generateClasses();
        }
    });
    
    // NEW: Toggle API key visibility
    document.getElementById('toggle-api-key-visibility')?.addEventListener('click', () => {
        const input = document.getElementById('ai-api-key-input');
        if (input) {
            input.type = input.type === 'password' ? 'text' : 'password';
        }
    });
    
    // AI settings form
    document.getElementById('ai-settings-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (window.app) {
            window.app.saveAISettings();
        }
    });
    
    // Edit profile button (LEGACY - can be removed)
    document.getElementById('edit-profile-btn')?.addEventListener('click', () => {
        if (window.app) {
            window.app.editProfile();
        }
    });

    // Notification Center Controls - now in sidebar
    document.getElementById('notification-bell-btn-sidebar')?.addEventListener('click', (e) => {
        e.stopPropagation();
        const center = document.getElementById('notification-center');
        if (center) {
            const isVisible = center.style.display !== 'none';
            center.style.display = isVisible ? 'none' : 'flex';
            
            if (!isVisible && window.notificationSystem) {
                window.notificationSystem.renderNotificationCenter();
            }
        }
    });

    // Close notification center when clicking outside
    document.addEventListener('click', (e) => {
        const center = document.getElementById('notification-center');
        const bellBtn = document.getElementById('notification-bell-btn-sidebar');
        
        if (center && bellBtn && 
            center.style.display !== 'none' &&
            !center.contains(e.target) && 
            !bellBtn.contains(e.target)) {
            center.style.display = 'none';
        }
    });

    // Notification filter toggle
    document.getElementById('notification-filter-btn')?.addEventListener('click', () => {
        const filterTabs = document.getElementById('notification-filter-tabs');
        if (filterTabs) {
            filterTabs.style.display = filterTabs.style.display === 'none' ? 'flex' : 'none';
        }
    });

    // Filter tabs
    document.querySelectorAll('.notification-filter-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const filter = e.target.dataset.filter;
            
            // Update active state
            document.querySelectorAll('.notification-filter-tab').forEach(t => 
                t.classList.remove('active'));
            e.target.classList.add('active');
            
            // Update content filter
            const content = document.getElementById('notification-center-content');
            if (content) {
                content.dataset.filter = filter;
            }
            
            // Re-render notifications
            if (window.notificationSystem) {
                window.notificationSystem.renderNotificationCenter();
            }
        });
    });

    // Mark all as read
    document.getElementById('notification-mark-all-read-btn')?.addEventListener('click', () => {
        if (window.notificationSystem) {
            window.notificationSystem.markAllAsRead();
        }
    });

    // Notification settings button
    document.getElementById('notification-settings-btn')?.addEventListener('click', () => {
        // Close notification center
        const center = document.getElementById('notification-center');
        if (center) center.style.display = 'none';
        
        // Switch to settings tab
        if (window.app) {
            window.app.switchTab('settings');
            
            // Scroll to notification settings section
            setTimeout(() => {
                const section = document.querySelector('#settings .settings-section:has(#notification-settings-form)');
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    });

    // Notification settings form
    document.getElementById('notification-settings-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (window.notificationSystem) {
            const preferences = {
                enableInApp: document.getElementById('notification-enable-inapp')?.checked || false,
                enablePush: document.getElementById('notification-enable-push')?.checked || false,
                enableEmail: document.getElementById('notification-enable-email')?.checked || false,
                notifyDeadlines: document.getElementById('notification-deadlines')?.checked || false,
                notifyScheduleChanges: document.getElementById('notification-schedule-changes')?.checked || false,
                notifyNewDocuments: document.getElementById('notification-new-documents')?.checked || false,
                notifySmartSuggestions: document.getElementById('notification-smart-suggestions')?.checked || false,
                notifyInstitutional: document.getElementById('notification-institutional')?.checked || false
            };
            
            window.notificationSystem.updatePreferences(preferences);
        }
    });
}
