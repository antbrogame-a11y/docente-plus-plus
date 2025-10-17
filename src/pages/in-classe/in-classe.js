/**
 * In Classe Page - JavaScript Module
 * Mobile-first, supports deep-linking from schedule
 * LocalStorage-based history for e2e testing
 */

import { initBreadcrumbs } from '../../components/breadcrumbs/breadcrumbs.js';

/**
 * In Classe Page Manager
 * Handles session data, deep-linking, and UI interactions
 */
class InClasseManager {
  constructor() {
    this.sessionData = null;
    this.activities = [];
    this.assignments = [];
    this.grades = [];
    this.voiceNotes = [];
    this.isRecording = false;
    this.mediaRecorder = null;
    this.audioChunks = [];
    
    // Feature flag for mock data
    this.MOCK_MODE = true;
  }

  /**
   * Initialize the In Classe page
   */
  init() {
    // Initialize breadcrumbs
    initBreadcrumbs('breadcrumbs-container');
    
    // Load session from URL parameters
    this.loadSessionFromURL();
    
    // Update UI with session data
    this.updateSessionUI();
    
    // Load saved data from localStorage
    this.loadDataFromStorage();
    
    // Attach event listeners
    this.attachEventListeners();
    
    // Save to history
    this.saveToHistory();
    
    console.log('In Classe page initialized', this.sessionData);
  }

  /**
   * Load session data from URL query parameters
   * Supports deep-linking: /in-classe?date=...&time=...&class=...&slotId=...
   */
  loadSessionFromURL() {
    const params = new URLSearchParams(window.location.search);
    
    this.sessionData = {
      date: params.get('date') || new Date().toISOString().split('T')[0],
      time: params.get('time') || '08:00',
      class: params.get('class') || 'Classe',
      slotId: params.get('slotId') || null,
      subject: params.get('subject') || 'Materia',
      type: params.get('type') || 'Lezione'
    };
  }

  /**
   * Update UI with session data
   */
  updateSessionUI() {
    // Update title
    document.getElementById('lesson-title').textContent = `In Classe - ${this.sessionData.class}`;
    
    // Update metadata
    document.getElementById('lesson-class').textContent = this.sessionData.class;
    document.getElementById('lesson-subject').textContent = this.sessionData.subject;
    
    // Format date and time
    const dateObj = new Date(this.sessionData.date);
    const dayName = dateObj.toLocaleDateString('it-IT', { weekday: 'long' });
    const dateFormatted = dateObj.toLocaleDateString('it-IT', { day: 'numeric', month: 'long' });
    
    document.getElementById('lesson-datetime').textContent = `${dayName}, ${dateFormatted} - ${this.sessionData.time}`;
  }

  /**
   * Generate storage key for session
   */
  getStorageKey(type) {
    const sessionKey = `${this.sessionData.date}_${this.sessionData.time}_${this.sessionData.class}`;
    return `inClasse_${type}_${sessionKey}`;
  }

  /**
   * Load data from localStorage
   */
  loadDataFromStorage() {
    this.activities = this.loadFromStorage('activities');
    this.assignments = this.loadFromStorage('assignments');
    this.grades = this.loadFromStorage('grades');
    this.voiceNotes = this.loadFromStorage('voiceNotes');
    
    this.updateCounts();
    this.renderAll();
  }

  /**
   * Load specific data type from localStorage
   */
  loadFromStorage(type) {
    try {
      const key = this.getStorageKey(type);
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error(`Error loading ${type} from storage:`, e);
      return [];
    }
  }

  /**
   * Save data to localStorage
   */
  saveToStorage(type, data) {
    try {
      const key = this.getStorageKey(type);
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`Error saving ${type} to storage:`, e);
    }
  }

  /**
   * Save session to history
   */
  saveToHistory() {
    try {
      const historyKey = 'inClasse_history';
      const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
      
      // Add current session to history
      const sessionEntry = {
        ...this.sessionData,
        timestamp: new Date().toISOString(),
        url: window.location.href
      };
      
      // Check if already in history
      const existingIndex = history.findIndex(h => 
        h.date === sessionEntry.date && 
        h.time === sessionEntry.time && 
        h.class === sessionEntry.class
      );
      
      if (existingIndex >= 0) {
        // Update existing entry
        history[existingIndex] = sessionEntry;
      } else {
        // Add new entry
        history.unshift(sessionEntry);
      }
      
      // Keep only last 50 sessions
      const limitedHistory = history.slice(0, 50);
      
      localStorage.setItem(historyKey, JSON.stringify(limitedHistory));
    } catch (e) {
      console.error('Error saving to history:', e);
    }
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Back button
    const backBtn = document.getElementById('back-button');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        window.history.back();
      });
    }

    // Section expand/collapse
    document.querySelectorAll('.section-header').forEach(header => {
      header.addEventListener('click', () => this.toggleSection(header));
      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleSection(header);
        }
      });
    });

    // Add buttons
    document.getElementById('add-activity-btn')?.addEventListener('click', () => this.addActivity());
    document.getElementById('add-assignment-btn')?.addEventListener('click', () => this.addAssignment());
    document.getElementById('add-grade-btn')?.addEventListener('click', () => this.addGrade());
    document.getElementById('record-note-btn')?.addEventListener('click', () => this.toggleRecording());
  }

  /**
   * Toggle section expand/collapse
   */
  toggleSection(header) {
    const isExpanded = header.getAttribute('aria-expanded') === 'true';
    const contentId = header.getAttribute('aria-controls');
    const content = document.getElementById(contentId);
    
    if (content) {
      header.setAttribute('aria-expanded', !isExpanded);
      content.style.display = isExpanded ? 'none' : 'block';
    }
  }

  /**
   * Update section counts
   */
  updateCounts() {
    document.getElementById('activities-count').textContent = this.activities.length;
    document.getElementById('assignments-count').textContent = this.assignments.length;
    document.getElementById('grades-count').textContent = this.grades.length;
    document.getElementById('voice-notes-count').textContent = this.voiceNotes.length;
  }

  /**
   * Render all sections
   */
  renderAll() {
    this.renderActivities();
    this.renderAssignments();
    this.renderGrades();
    this.renderVoiceNotes();
  }

  /**
   * Add activity
   */
  addActivity() {
    const title = prompt('Titolo attività:');
    if (!title) return;
    
    const activity = {
      id: Date.now().toString(),
      title: title,
      description: '',
      timestamp: new Date().toISOString()
    };
    
    this.activities.push(activity);
    this.saveToStorage('activities', this.activities);
    this.updateCounts();
    this.renderActivities();
  }

  /**
   * Render activities
   */
  renderActivities() {
    const container = document.getElementById('activities-list');
    if (!container) return;
    
    if (this.activities.length === 0) {
      container.innerHTML = '<p class="info-text">Nessuna attività registrata</p>';
      return;
    }
    
    container.innerHTML = this.activities.map(activity => `
      <div class="list-item" data-id="${activity.id}">
        <span class="material-symbols-outlined list-item-icon">assignment</span>
        <div class="list-item-content">
          <div class="list-item-title">${this.escapeHtml(activity.title)}</div>
          <div class="list-item-description">${new Date(activity.timestamp).toLocaleString('it-IT')}</div>
        </div>
        <div class="list-item-actions">
          <button class="icon-btn" onclick="inClasseManager.removeActivity('${activity.id}')" aria-label="Rimuovi attività">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>
    `).join('');
  }

  /**
   * Remove activity
   */
  removeActivity(id) {
    this.activities = this.activities.filter(a => a.id !== id);
    this.saveToStorage('activities', this.activities);
    this.updateCounts();
    this.renderActivities();
  }

  /**
   * Add assignment
   */
  addAssignment() {
    const title = prompt('Titolo compito:');
    if (!title) return;
    
    const assignment = {
      id: Date.now().toString(),
      title: title,
      dueDate: null,
      timestamp: new Date().toISOString()
    };
    
    this.assignments.push(assignment);
    this.saveToStorage('assignments', this.assignments);
    this.updateCounts();
    this.renderAssignments();
  }

  /**
   * Render assignments
   */
  renderAssignments() {
    const container = document.getElementById('assignments-list');
    if (!container) return;
    
    if (this.assignments.length === 0) {
      container.innerHTML = '<p class="info-text">Nessun compito assegnato</p>';
      return;
    }
    
    container.innerHTML = this.assignments.map(assignment => `
      <div class="list-item" data-id="${assignment.id}">
        <span class="material-symbols-outlined list-item-icon">book</span>
        <div class="list-item-content">
          <div class="list-item-title">${this.escapeHtml(assignment.title)}</div>
          <div class="list-item-description">${new Date(assignment.timestamp).toLocaleString('it-IT')}</div>
        </div>
        <div class="list-item-actions">
          <button class="icon-btn" onclick="inClasseManager.removeAssignment('${assignment.id}')" aria-label="Rimuovi compito">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>
    `).join('');
  }

  /**
   * Remove assignment
   */
  removeAssignment(id) {
    this.assignments = this.assignments.filter(a => a.id !== id);
    this.saveToStorage('assignments', this.assignments);
    this.updateCounts();
    this.renderAssignments();
  }

  /**
   * Add grade
   */
  addGrade() {
    const student = prompt('Nome studente:');
    if (!student) return;
    
    const grade = prompt('Voto:');
    if (!grade) return;
    
    const gradeEntry = {
      id: Date.now().toString(),
      student: student,
      grade: grade,
      timestamp: new Date().toISOString()
    };
    
    this.grades.push(gradeEntry);
    this.saveToStorage('grades', this.grades);
    this.updateCounts();
    this.renderGrades();
  }

  /**
   * Render grades
   */
  renderGrades() {
    const container = document.getElementById('grades-list');
    if (!container) return;
    
    if (this.grades.length === 0) {
      container.innerHTML = '<p class="info-text">Nessuna valutazione registrata</p>';
      return;
    }
    
    container.innerHTML = this.grades.map(grade => `
      <div class="list-item" data-id="${grade.id}">
        <span class="material-symbols-outlined list-item-icon">grade</span>
        <div class="list-item-content">
          <div class="list-item-title">${this.escapeHtml(grade.student)} - Voto: ${this.escapeHtml(grade.grade)}</div>
          <div class="list-item-description">${new Date(grade.timestamp).toLocaleString('it-IT')}</div>
        </div>
        <div class="list-item-actions">
          <button class="icon-btn" onclick="inClasseManager.removeGrade('${grade.id}')" aria-label="Rimuovi valutazione">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>
    `).join('');
  }

  /**
   * Remove grade
   */
  removeGrade(id) {
    this.grades = this.grades.filter(g => g.id !== id);
    this.saveToStorage('grades', this.grades);
    this.updateCounts();
    this.renderGrades();
  }

  /**
   * Toggle voice recording
   */
  async toggleRecording() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      await this.startRecording();
    }
  }

  /**
   * Start voice recording
   * Uses MediaRecorder API with mock transcription
   */
  async startRecording() {
    try {
      // Mock implementation for now
      // TODO: Integrate with real speech-to-text service
      
      this.isRecording = true;
      const btn = document.getElementById('record-note-btn');
      btn.innerHTML = '<span class="material-symbols-outlined">stop</span> Interrompi';
      btn.classList.add('recording');
      
      console.log('Recording started (mock)');
      
      // Simulate recording
      setTimeout(() => {
        if (this.isRecording) {
          this.stopRecording();
        }
      }, 5000); // Auto-stop after 5 seconds for demo
      
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Errore durante l\'avvio della registrazione');
    }
  }

  /**
   * Stop voice recording and add mock transcription
   */
  stopRecording() {
    if (!this.isRecording) return;
    
    this.isRecording = false;
    const btn = document.getElementById('record-note-btn');
    btn.innerHTML = '<span class="material-symbols-outlined">mic</span> Registra Nota';
    btn.classList.remove('recording');
    
    // Mock transcription
    const mockTranscriptions = [
      'Ricordare di rivedere la sezione sui logaritmi con la classe',
      'Marco ha bisogno di supporto extra sugli esercizi di geometria',
      'Preparare materiale aggiuntivo per la prossima lezione',
      'Ottima partecipazione della classe oggi'
    ];
    
    const transcription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
    
    const voiceNote = {
      id: Date.now().toString(),
      transcription: transcription,
      duration: '00:05',
      timestamp: new Date().toISOString()
    };
    
    this.voiceNotes.push(voiceNote);
    this.saveToStorage('voiceNotes', this.voiceNotes);
    this.updateCounts();
    this.renderVoiceNotes();
    
    console.log('Recording stopped (mock), transcription:', transcription);
  }

  /**
   * Render voice notes
   */
  renderVoiceNotes() {
    const container = document.getElementById('voice-notes-list');
    if (!container) return;
    
    if (this.voiceNotes.length === 0) {
      container.innerHTML = '<p class="info-text">Nessuna nota vocale registrata</p>';
      return;
    }
    
    container.innerHTML = this.voiceNotes.map(note => `
      <div class="list-item" data-id="${note.id}">
        <span class="material-symbols-outlined list-item-icon">mic</span>
        <div class="list-item-content">
          <div class="list-item-title">${this.escapeHtml(note.transcription)}</div>
          <div class="list-item-description">
            ${new Date(note.timestamp).toLocaleString('it-IT')} - Durata: ${note.duration}
          </div>
        </div>
        <div class="list-item-actions">
          <button class="icon-btn" onclick="inClasseManager.removeVoiceNote('${note.id}')" aria-label="Rimuovi nota vocale">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>
    `).join('');
  }

  /**
   * Remove voice note
   */
  removeVoiceNote(id) {
    this.voiceNotes = this.voiceNotes.filter(n => n.id !== id);
    this.saveToStorage('voiceNotes', this.voiceNotes);
    this.updateCounts();
    this.renderVoiceNotes();
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}

// Initialize when DOM is ready
let inClasseManager;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    inClasseManager = new InClasseManager();
    inClasseManager.init();
  });
} else {
  inClasseManager = new InClasseManager();
  inClasseManager.init();
}

// Make available globally
if (typeof window !== 'undefined') {
  window.inClasseManager = inClasseManager;
}

export default InClasseManager;
