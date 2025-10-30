
// js/events.js

import { completeOnboarding, state } from './js/data.js';
import { hideOnboarding, showToast, switchTab } from './ui.js';
import { sendMessageToAI } from './ai.js';
import { handleFileUpload, processPdfForLessons, processPdfForActivities } from './js/files.js';

export function setupEventListeners(app) {
    // Menu Toggle for mobile
    document.getElementById('menu-toggle')?.addEventListener('click', () => {
        document.getElementById('main-nav').classList.toggle('mobile-open');
        document.getElementById('menu-backdrop').classList.toggle('active');
    });
    document.getElementById('menu-backdrop')?.addEventListener('click', () => document.getElementById('menu-toggle').click());

    // Main Tab Navigation
    document.querySelectorAll('.tab-button[data-tab]').forEach(button => {
        button.addEventListener('click', () => {
            switchTab(button.dataset.tab);
            // Close mobile menu on navigation
            if (document.getElementById('main-nav').classList.contains('mobile-open')) {
                document.getElementById('menu-toggle').click();
            }
        });
    });

    // Onboarding
    document.getElementById('onboarding-form')?.addEventListener('submit', e => {
        e.preventDefault();
        const settings = { teacherName: document.getElementById('onboarding-first-name').value };
        completeOnboarding(settings);
        hideOnboarding();
        showToast('Profilo configurato! Benvenuto in Docente++.', 'success');
        app.initializeAppUI();
    });

    // AI Chat
    document.getElementById('ai-chat-send')?.addEventListener('click', () => sendMessageToAI());
    document.getElementById('ai-chat-input')?.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessageToAI();
        }
    });

    // PDF Import
    document.getElementById('pdf-upload')?.addEventListener('change', e => handleFileUpload(e));
    
    // Direct buttons for PDF processing in the new UI
    const btnCreateLesson = document.querySelector('button[onclick="processPdfForLessons()"]');
    if(btnCreateLesson) btnCreateLesson.addEventListener('click', processPdfForLessons);
    
    const btnExtractActivities = document.querySelector('button[onclick="processPdfForActivities()"]');
    if(btnExtractActivities) btnExtractActivities.addEventListener('click', processPdfForActivities);

    // Link app methods to window for inline HTML calls
    window.app = app; 
}
