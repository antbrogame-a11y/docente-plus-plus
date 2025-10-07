// Docente++ - Main Application JavaScript
// Web app for teacher didactics management powered by OpenRouter AI

class DocentePlusPlus {
    constructor() {
        this.lessons = [];
        this.students = [];
        this.classes = [];
        this.subjects = [];
        this.settings = {};
        this.chatMessages = [];
        this.activeClass = '';
        this.selectedFile = null;
        this.evaluationCriteria = [];
        this.evaluationGrids = [];
        this.evaluations = [];
        this.notifications = [];
        this.reminders = [];
        this.activities = [];
        this.schedule = {}; // { 'YYYY-MM-DD-HH': { classId: null, activityType: null } }
        this.notificationSettings = {
            browserNotifications: true,
            emailNotifications: false,
            lessonReminders: true,
            remindersBefore24h: true,
            remindersBefore1h: true,
            backupReminders: true,
            backupReminderInterval: 7, // days
            lastBackupDate: null,
            quietHoursEnabled: false,
            quietHoursStart: '22:00',
            quietHoursEnd: '07:00'
        };
        this.notificationFilter = 'all'; // all, lesson-reminder, activity-reminder, custom-reminder, backup, system
        this.notificationCheckInterval = null;
        this.scheduleView = 'weekly'; // weekly or daily
        this.currentScheduleDate = null; // Will be set to current/next weekday
        
        // Document Import Module
        this.importedDocuments = [];
        this.currentImportData = null;
        this.documentClassification = null;
        
        // Audio Recording Module
        this.audioRecordings = [];
        this.mediaRecorder = null;
        this.recordingChunks = [];
        this.recordingStartTime = null;
        this.recordingTimer = null;
        
        // News and RSS Feeds Module
        this.rssFeeds = [];
        this.newsItems = [];
        this.newsFilter = { source: '', category: '' };
        
        // Smart Daily Schedule Module
        this.lessonSessions = []; // Active lesson sessions with student evaluations
        this.currentLessonSession = null; // Currently active lesson session
        
        this.init();
    }

    init() {
        // Load data from localStorage
        this.loadData();
        
        // Check if onboarding is needed
        if (!this.isOnboardingComplete()) {
            this.showOnboarding();
        }
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Render initial data
        this.renderDashboard();
        this.renderLessons();
        this.renderStudents();
        this.renderClasses();
        this.renderEvaluations();
        this.renderActivities();
        this.renderSchedule();
        this.renderImportedDocuments();
        this.renderRecordings();
        this.renderFeeds();
        this.renderNews();
        this.loadSettings();
        this.loadActiveClass();
        this.updateClassSelectors();
        
        // Initialize notification system
        this.requestNotificationPermission();
        this.startNotificationChecks();
        
        console.log('Docente++ initialized successfully');
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Lesson form
        const lessonForm = document.getElementById('lesson-form');
        if (lessonForm) {
            lessonForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addLesson();
            });
        }

        // Student form
        const studentForm = document.getElementById('student-form');
        if (studentForm) {
            studentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addStudent();
            });
        }

        // Class form
        const classForm = document.getElementById('class-form');
        if (classForm) {
            classForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveClass();
            });
        }

        // Activity form
        const activityForm = document.getElementById('activity-form');
        if (activityForm) {
            activityForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addActivity();
            });
        }

        // Onboarding form
        const onboardingForm = document.getElementById('onboarding-form');
        if (onboardingForm) {
            onboardingForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.completeOnboarding();
            });
        }

        // AI input
        const aiInput = document.getElementById('ai-input');
        if (aiInput) {
            aiInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                    this.sendAIMessage();
                }
            });
        }

        // Subject inputs
        this.setupSubjectInput('onboarding-subjects', 'subjects-suggestions', 'selected-subjects-display');
        this.setupSubjectInput('teacher-subjects-settings', 'subjects-suggestions-settings', 'selected-subjects-display-settings');
        
        // Drag and drop for document upload
        const uploadArea = document.getElementById('document-upload-area');
        if (uploadArea) {
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = 'var(--primary-color)';
                uploadArea.style.background = '#f0f7ff';
            });
            
            uploadArea.addEventListener('dragleave', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = '';
                uploadArea.style.background = '';
            });
            
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = '';
                uploadArea.style.background = '';
                
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    const fileInput = document.getElementById('document-file-input');
                    fileInput.files = files;
                    this.handleDocumentUpload({ target: { files: files } });
                }
            });
        }
    }

    // Onboarding methods
    isOnboardingComplete() {
        return localStorage.getItem('onboarding-complete') === 'true';
    }

    showOnboarding() {
        const modal = document.getElementById('onboarding-modal');
        if (modal) {
            modal.style.display = 'flex';
            
            // Prefill email if available
            const email = localStorage.getItem('teacher-email');
            if (email) {
                document.getElementById('onboarding-email').value = email;
            }
        }
    }

    completeOnboarding() {
        // Get all form values
        const firstName = document.getElementById('onboarding-first-name').value;
        const lastName = document.getElementById('onboarding-last-name').value;
        const email = document.getElementById('onboarding-email').value;
        const schoolLevel = document.getElementById('onboarding-school-level').value;
        const schoolName = document.getElementById('onboarding-school-name').value;
        const schoolYear = document.getElementById('onboarding-school-year').value;
        const yearStart = document.getElementById('onboarding-year-start').value;
        const yearEnd = document.getElementById('onboarding-year-end').value;

        // Save to localStorage
        localStorage.setItem('teacher-first-name', firstName);
        localStorage.setItem('teacher-last-name', lastName);
        localStorage.setItem('teacher-email', email);
        localStorage.setItem('school-level', schoolLevel);
        localStorage.setItem('school-name', schoolName);
        localStorage.setItem('school-year', schoolYear);
        localStorage.setItem('school-year-start', yearStart);
        localStorage.setItem('school-year-end', yearEnd);
        localStorage.setItem('teacher-subjects', JSON.stringify(this.subjects));
        localStorage.setItem('onboarding-complete', 'true');

        // Hide onboarding modal
        document.getElementById('onboarding-modal').style.display = 'none';

        // Load settings to reflect changes
        this.loadSettings();
        this.renderDashboard();

        // Show welcome message
        alert(`Benvenuto/a ${firstName}! Il tuo profilo è stato configurato con successo.`);
    }

    // Subject management methods
    getCommonSubjects() {
        return [
            'Italiano',
            'Matematica',
            'Scienze',
            'Storia',
            'Geografia',
            'Inglese',
            'Francese',
            'Spagnolo',
            'Tedesco',
            'Arte e Immagine',
            'Musica',
            'Educazione Fisica',
            'Tecnologia',
            'Religione',
            'Educazione Civica',
            'Fisica',
            'Chimica',
            'Biologia',
            'Filosofia',
            'Latino',
            'Greco',
            'Informatica',
            'Diritto ed Economia'
        ];
    }

    setupSubjectInput(inputId, suggestionsId, displayId) {
        const input = document.getElementById(inputId);
        const suggestionsDiv = document.getElementById(suggestionsId);
        const displayDiv = document.getElementById(displayId);

        if (!input || !suggestionsDiv || !displayDiv) return;

        // Render existing subjects
        this.renderSubjects(displayDiv);

        // Handle input
        input.addEventListener('input', (e) => {
            const value = e.target.value.trim().toLowerCase();
            if (value.length > 0) {
                const commonSubjects = this.getCommonSubjects();
                const filtered = commonSubjects.filter(s => 
                    s.toLowerCase().includes(value) && 
                    !this.subjects.includes(s)
                );

                if (filtered.length > 0) {
                    suggestionsDiv.innerHTML = filtered.map(subject => 
                        `<div class="subject-suggestion-item" data-subject="${subject}">${subject}</div>`
                    ).join('');
                    suggestionsDiv.classList.add('active');

                    // Add click handlers to suggestions
                    suggestionsDiv.querySelectorAll('.subject-suggestion-item').forEach(item => {
                        item.addEventListener('click', () => {
                            this.addSubject(item.dataset.subject);
                            this.renderSubjects(displayDiv);
                            input.value = '';
                            suggestionsDiv.classList.remove('active');
                        });
                    });
                } else {
                    suggestionsDiv.classList.remove('active');
                }
            } else {
                suggestionsDiv.classList.remove('active');
            }
        });

        // Handle Enter key
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const value = input.value.trim();
                if (value) {
                    this.addSubject(value);
                    this.renderSubjects(displayDiv);
                    input.value = '';
                    suggestionsDiv.classList.remove('active');
                }
            }
        });

        // Close suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!input.contains(e.target) && !suggestionsDiv.contains(e.target)) {
                suggestionsDiv.classList.remove('active');
            }
        });
    }

    addSubject(subject) {
        const normalizedSubject = subject.charAt(0).toUpperCase() + subject.slice(1).toLowerCase();
        if (!this.subjects.includes(normalizedSubject)) {
            this.subjects.push(normalizedSubject);
        }
    }

    removeSubject(subject) {
        this.subjects = this.subjects.filter(s => s !== subject);
    }

    renderSubjects(displayDiv) {
        if (!displayDiv) return;

        if (this.subjects.length === 0) {
            displayDiv.innerHTML = '<span style="color: var(--text-secondary); padding: 10px;">Nessuna disciplina aggiunta</span>';
        } else {
            displayDiv.innerHTML = this.subjects.map(subject => `
                <span class="subject-tag">
                    ${subject}
                    <span class="remove-subject" onclick="app.removeSubject('${subject}'); app.renderAllSubjects();">×</span>
                </span>
            `).join('');
        }
    }

    renderAllSubjects() {
        const displayOnboarding = document.getElementById('selected-subjects-display');
        const displaySettings = document.getElementById('selected-subjects-display-settings');
        this.renderSubjects(displayOnboarding);
        this.renderSubjects(displaySettings);
    }

    switchTab(tabName) {
        // Update active button
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update active content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        // Refresh notifications when switching to notifications tab
        if (tabName === 'notifications') {
            this.renderNotifications();
        }
    }

    // Dashboard methods
    renderDashboard() {
        document.getElementById('lesson-count').textContent = this.lessons.length;
        document.getElementById('student-count').textContent = this.students.length;
        
        // Count in-progress activities
        const inProgressActivities = this.activities.filter(a => a.status === 'in-progress' || a.status === 'planned');
        document.getElementById('activity-count').textContent = inProgressActivities.length;
        
        // Count pending evaluations (those without a score or from the last 7 days)
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const pendingEvaluations = this.evaluations.filter(e => {
            if (!e.score) return true;
            const evalDate = new Date(e.date);
            return evalDate >= sevenDaysAgo;
        });
        document.getElementById('evaluation-count').textContent = pendingEvaluations.length;
        
        const apiKey = localStorage.getItem('openrouter-api-key');
        document.getElementById('ai-status').textContent = apiKey ? '✓' : '✗';
        
        // Update active class display
        this.updateClassDisplay();
        
        // Render today's schedule preview
        this.renderTodaySchedulePreview();
    }
    
    renderTodaySchedulePreview() {
        const previewContainer = document.getElementById('today-schedule-preview');
        if (!previewContainer) return;
        
        const today = this.getCurrentScheduleDate();
        const hours = [8, 9, 10, 11, 12, 13];
        const todaySlots = [];
        
        hours.forEach(hour => {
            const key = this.getScheduleKey(today, hour);
            const slot = this.schedule[key];
            if (slot && slot.classId) {
                const cls = this.classes.find(c => c.id == slot.classId);
                const activityType = slot.activityType ? this.getActivityTypeIcon(slot.activityType) : null;
                todaySlots.push({
                    hour,
                    class: cls,
                    activityType,
                    slot
                });
            }
        });
        
        if (todaySlots.length === 0) {
            previewContainer.innerHTML = '<p style="color: #999; font-style: italic;">Nessuna lezione programmata per oggi</p>';
            return;
        }
        
        previewContainer.innerHTML = `
            <div class="today-schedule-list">
                ${todaySlots.map(({ hour, class: cls, activityType, slot }) => `
                    <div class="today-schedule-item" style="display: flex; align-items: center; padding: 12px; margin: 8px 0; background: #f8f9fa; border-radius: 8px; border-left: 4px solid ${activityType ? activityType.color : '#ddd'};">
                        <div style="flex: 0 0 60px; font-weight: bold; font-size: 1.1em;">${hour}:00</div>
                        <div style="flex: 1;">
                            <div style="font-weight: 500;">${cls ? cls.name : 'N/D'}</div>
                            ${activityType ? `<div style="font-size: 0.9em; color: #666;">${activityType.label}</div>` : ''}
                        </div>
                        <button class="btn btn-sm btn-primary" onclick="app.startLessonSession('${today.toISOString()}', ${hour})" style="margin-left: 10px;">
                            ▶ Avvia
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    goToTodaySchedule() {
        this.scheduleView = 'daily';
        this.currentScheduleDate = this.getCurrentScheduleDate();
        this.switchTab('schedule');
        this.renderSchedule();
    }

    // Class Management methods
    setActiveClass(className) {
        this.activeClass = className;
        localStorage.setItem('active-class', className);
        this.updateClassDisplay();
    }

    loadActiveClass() {
        const savedClass = localStorage.getItem('active-class');
        if (savedClass) {
            this.activeClass = savedClass;
            const selector = document.getElementById('active-class-selector');
            if (selector) {
                selector.value = savedClass;
            }
            this.updateClassDisplay();
        }
    }

    updateClassDisplay() {
        const displayElement = document.getElementById('current-class-display');
        if (displayElement) {
            if (this.activeClass) {
                displayElement.textContent = `Classe: ${this.activeClass}`;
                displayElement.style.display = 'inline-block';
            } else {
                displayElement.textContent = 'Nessuna classe selezionata';
                displayElement.style.display = 'inline-block';
            }
        }
    }

    // Lesson management methods
    showAddLessonForm() {
        document.getElementById('add-lesson-form').style.display = 'block';
    }

    hideAddLessonForm() {
        document.getElementById('add-lesson-form').style.display = 'none';
        document.getElementById('lesson-form').reset();
    }

    addLesson() {
        const lesson = {
            id: Date.now(),
            title: document.getElementById('lesson-title').value,
            subject: document.getElementById('lesson-subject').value,
            date: document.getElementById('lesson-date').value,
            time: document.getElementById('lesson-time').value || '09:00',
            description: document.getElementById('lesson-description').value,
            createdAt: new Date().toISOString()
        };

        this.lessons.push(lesson);
        this.saveData();
        this.renderLessons();
        this.renderDashboard();
        this.hideAddLessonForm();
    }

    deleteLesson(id) {
        if (confirm('Sei sicuro di voler eliminare questa lezione?')) {
            this.lessons = this.lessons.filter(lesson => lesson.id !== id);
            this.saveData();
            this.renderLessons();
            this.renderDashboard();
        }
    }

    renderLessons() {
        const lessonsList = document.getElementById('lessons-list');
        
        if (this.lessons.length === 0) {
            lessonsList.innerHTML = `
                <div class="empty-state">
                    <h3>Nessuna lezione programmata</h3>
                    <p>Inizia aggiungendo una nuova lezione o generandola con l'IA</p>
                </div>
            `;
            return;
        }

        lessonsList.innerHTML = this.lessons
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(lesson => `
                <div class="lesson-item">
                    <h4>${lesson.title}</h4>
                    <p><strong>Materia:</strong> ${lesson.subject}</p>
                    <p><strong>Data:</strong> ${new Date(lesson.date).toLocaleDateString('it-IT')} ${lesson.time ? 'alle ' + lesson.time : ''}</p>
                    <p>${lesson.description || 'Nessuna descrizione'}</p>
                    <div class="item-actions">
                        <button class="btn btn-danger" onclick="app.deleteLesson(${lesson.id})">Elimina</button>
                    </div>
                </div>
            `).join('');
    }

    async generateLessonWithAI() {
        const apiKey = localStorage.getItem('openrouter-api-key');
        
        if (!apiKey) {
            alert('Configura la tua API key di OpenRouter nelle impostazioni prima di usare l\'IA');
            this.switchTab('settings');
            return;
        }

        const subject = prompt('Per quale materia vuoi generare una lezione?');
        if (!subject) return;

        const topic = prompt('Quale argomento?');
        if (!topic) return;

        this.addChatMessage('system', 'Generazione lezione in corso...');

        try {
            const response = await this.callOpenRouterAPI(
                `Genera un piano di lezione dettagliato per ${subject} sull'argomento "${topic}". 
                Includi: obiettivi di apprendimento, durata stimata, materiali necessari, 
                attività didattiche e metodi di valutazione. Rispondi in formato JSON con i campi: 
                title, subject, duration, objectives, materials, activities, evaluation.`,
                apiKey
            );

            if (response && response.content) {
                try {
                    // Try to parse JSON from the response
                    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        const lessonData = JSON.parse(jsonMatch[0]);
                        
                        const lesson = {
                            id: Date.now(),
                            title: lessonData.title || `Lezione: ${topic}`,
                            subject: lessonData.subject || subject,
                            date: new Date().toISOString().split('T')[0],
                            description: `
Durata: ${lessonData.duration || 'N/D'}

Obiettivi:
${lessonData.objectives || 'N/D'}

Materiali:
${lessonData.materials || 'N/D'}

Attività:
${lessonData.activities || 'N/D'}

Valutazione:
${lessonData.evaluation || 'N/D'}
                            `.trim(),
                            createdAt: new Date().toISOString(),
                            generatedByAI: true
                        };

                        this.lessons.push(lesson);
                        this.saveData();
                        this.renderLessons();
                        this.renderDashboard();
                        this.switchTab('lessons');
                        
                        this.addChatMessage('system', 'Lezione generata con successo!');
                    } else {
                        throw new Error('Invalid JSON response');
                    }
                } catch (parseError) {
                    // If JSON parsing fails, create a simple lesson with the text response
                    const lesson = {
                        id: Date.now(),
                        title: `${subject}: ${topic}`,
                        subject: subject,
                        date: new Date().toISOString().split('T')[0],
                        description: response.content,
                        createdAt: new Date().toISOString(),
                        generatedByAI: true
                    };

                    this.lessons.push(lesson);
                    this.saveData();
                    this.renderLessons();
                    this.renderDashboard();
                    this.switchTab('lessons');
                    
                    this.addChatMessage('system', 'Lezione generata con successo!');
                }
            }
        } catch (error) {
            console.error('Error generating lesson:', error);
            this.addChatMessage('system', `Errore nella generazione: ${error.message}`);
            alert('Errore nella generazione della lezione. Verifica la tua API key.');
        }
    }

    // Student management methods
    showAddStudentForm() {
        document.getElementById('add-student-form').style.display = 'block';
    }

    hideAddStudentForm() {
        document.getElementById('add-student-form').style.display = 'none';
        document.getElementById('student-form').reset();
    }

    addStudent() {
        const student = {
            id: Date.now(),
            name: document.getElementById('student-name').value,
            email: document.getElementById('student-email').value,
            class: document.getElementById('student-class').value,
            birthdate: document.getElementById('student-birthdate').value || null,
            nameday: document.getElementById('student-nameday').value || null,
            notes: document.getElementById('student-notes').value || null,
            createdAt: new Date().toISOString()
        };

        this.students.push(student);
        this.saveData();
        this.renderStudents();
        this.renderDashboard();
        this.hideAddStudentForm();
    }

    deleteStudent(id) {
        if (confirm('Sei sicuro di voler eliminare questo studente?')) {
            this.students = this.students.filter(student => student.id !== id);
            this.saveData();
            this.renderStudents();
            this.renderDashboard();
        }
    }

    renderStudents() {
        const studentsList = document.getElementById('students-list');
        
        if (this.students.length === 0) {
            studentsList.innerHTML = `
                <div class="empty-state">
                    <h3>Nessuno studente registrato</h3>
                    <p>Inizia aggiungendo un nuovo studente o importando da file</p>
                </div>
            `;
            return;
        }

        studentsList.innerHTML = this.students.map(student => {
            let additionalInfo = '';
            if (student.birthdate) {
                const birthDate = new Date(student.birthdate);
                additionalInfo += `<p><strong>📅 Data di Nascita:</strong> ${birthDate.toLocaleDateString('it-IT')}</p>`;
            }
            if (student.nameday) {
                additionalInfo += `<p><strong>🎂 Onomastico:</strong> ${student.nameday}</p>`;
            }
            if (student.notes) {
                additionalInfo += `<p><strong>📝 Note:</strong> ${student.notes}</p>`;
            }
            
            return `
                <div class="student-item">
                    <h4>${student.name}</h4>
                    <p><strong>Email:</strong> ${student.email || 'N/D'}</p>
                    <p><strong>Classe:</strong> ${student.class || 'N/D'}</p>
                    ${additionalInfo}
                    <div class="item-actions">
                        <button class="btn btn-danger" onclick="app.deleteStudent(${student.id})">Elimina</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Activity management methods
    showAddActivityForm() {
        document.getElementById('activity-form-title').textContent = 'Nuova Attività';
        document.getElementById('activity-edit-id').value = '';
        document.getElementById('add-activity-form').style.display = 'block';
        this.updateActivityFormSelectors();
    }

    hideAddActivityForm() {
        document.getElementById('add-activity-form').style.display = 'none';
        document.getElementById('activity-form').reset();
        document.getElementById('activity-edit-id').value = '';
    }

    showEditActivityForm(id) {
        const activity = this.activities.find(a => a.id === id);
        if (!activity) return;

        document.getElementById('activity-form-title').textContent = 'Modifica Attività';
        document.getElementById('activity-edit-id').value = id;
        document.getElementById('activity-title').value = activity.title;
        document.getElementById('activity-type').value = activity.type;
        document.getElementById('activity-description').value = activity.description || '';
        document.getElementById('activity-deadline').value = activity.deadline || '';
        document.getElementById('activity-priority').value = activity.priority || 'medium';
        document.getElementById('activity-progress').value = activity.progress || 0;
        document.getElementById('activity-notes').value = activity.notes || '';
        
        this.updateActivityFormSelectors();
        
        if (activity.classId) {
            document.getElementById('activity-class').value = activity.classId;
        }
        if (activity.studentId) {
            document.getElementById('activity-student').value = activity.studentId;
        }
        
        document.getElementById('add-activity-form').style.display = 'block';
    }

    updateActivityFormSelectors() {
        const classSelector = document.getElementById('activity-class');
        const studentSelector = document.getElementById('activity-student');
        
        if (classSelector) {
            classSelector.innerHTML = '<option value="">Nessuna (generale)</option>' +
                this.classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
        }
        
        if (studentSelector) {
            studentSelector.innerHTML = '<option value="">Nessuno (tutta la classe)</option>' +
                this.students.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
        }
    }

    addActivity() {
        const editId = document.getElementById('activity-edit-id').value;
        
        if (editId) {
            // Edit existing activity
            const activity = this.activities.find(a => a.id == editId);
            if (activity) {
                activity.title = document.getElementById('activity-title').value;
                activity.type = document.getElementById('activity-type').value;
                activity.description = document.getElementById('activity-description').value;
                activity.deadline = document.getElementById('activity-deadline').value;
                activity.classId = document.getElementById('activity-class').value || null;
                activity.studentId = document.getElementById('activity-student').value || null;
                activity.priority = document.getElementById('activity-priority').value || 'medium';
                activity.progress = parseInt(document.getElementById('activity-progress').value) || 0;
                activity.notes = document.getElementById('activity-notes').value || '';
                activity.updatedAt = new Date().toISOString();
            }
        } else {
            // Create new activity
            const activity = {
                id: Date.now(),
                title: document.getElementById('activity-title').value,
                type: document.getElementById('activity-type').value,
                description: document.getElementById('activity-description').value,
                deadline: document.getElementById('activity-deadline').value,
                classId: document.getElementById('activity-class').value || null,
                studentId: document.getElementById('activity-student').value || null,
                priority: document.getElementById('activity-priority').value || 'medium',
                progress: parseInt(document.getElementById('activity-progress').value) || 0,
                notes: document.getElementById('activity-notes').value || '',
                status: 'planned',
                createdAt: new Date().toISOString()
            };

            this.activities.push(activity);
        }

        this.saveData();
        this.renderActivities();
        this.renderDashboard();
        this.hideAddActivityForm();
    }

    deleteActivity(id) {
        if (confirm('Sei sicuro di voler eliminare questa attività?')) {
            this.activities = this.activities.filter(activity => activity.id !== id);
            this.saveData();
            this.renderActivities();
            this.renderDashboard();
        }
    }

    updateActivityStatus(id, newStatus) {
        const activity = this.activities.find(a => a.id === id);
        if (activity) {
            activity.status = newStatus;
            activity.updatedAt = new Date().toISOString();
            this.saveData();
            this.renderActivities();
            this.renderDashboard();
        }
    }

    filterActivities(filterType) {
        this.activityFilter = filterType;
        this.renderActivities();
    }

    renderActivitiesSummary() {
        const totalActivities = this.activities.length;
        const plannedActivities = this.activities.filter(a => a.status === 'planned').length;
        const inProgressActivities = this.activities.filter(a => a.status === 'in-progress').length;
        const completedActivities = this.activities.filter(a => a.status === 'completed').length;
        
        // Calculate overdue activities
        const now = new Date();
        const overdueActivities = this.activities.filter(a => {
            if (!a.deadline || a.status === 'completed') return false;
            return new Date(a.deadline) < now;
        }).length;
        
        // Update summary cards
        const totalEl = document.getElementById('total-activities');
        const plannedEl = document.getElementById('planned-activities');
        const inProgressEl = document.getElementById('inprogress-activities');
        const completedEl = document.getElementById('completed-activities');
        const overdueEl = document.getElementById('overdue-activities');
        
        if (totalEl) totalEl.textContent = totalActivities;
        if (plannedEl) plannedEl.textContent = plannedActivities;
        if (inProgressEl) inProgressEl.textContent = inProgressActivities;
        if (completedEl) completedEl.textContent = completedActivities;
        if (overdueEl) overdueEl.textContent = overdueActivities;
    }

    renderActivities() {
        this.renderActivitiesSummary();
        
        const activitiesList = document.getElementById('activities-list');
        
        if (!activitiesList) return;

        if (this.activities.length === 0) {
            activitiesList.innerHTML = `
                <div class="empty-state">
                    <h3>Nessuna attività programmata</h3>
                    <p>Inizia aggiungendo una nuova attività didattica</p>
                </div>
            `;
            return;
        }

        // Apply filter
        let filteredActivities = this.activities;
        const filterSelect = document.getElementById('activity-filter');
        if (filterSelect) {
            const filterValue = filterSelect.value;
            if (filterValue && filterValue !== 'all') {
                if (filterValue === 'planned' || filterValue === 'in-progress' || filterValue === 'completed') {
                    filteredActivities = this.activities.filter(a => a.status === filterValue);
                } else {
                    filteredActivities = this.activities.filter(a => a.type === filterValue);
                }
            }
        }

        // Sort by deadline (newest first)
        filteredActivities.sort((a, b) => {
            if (!a.deadline) return 1;
            if (!b.deadline) return -1;
            return new Date(a.deadline) - new Date(b.deadline);
        });

        const activityTypeIcons = {
            'lesson': '📚',
            'exercise': '✏️',
            'lab': '🔬',
            'project': '📊',
            'homework': '📝',
            'exam': '📄'
        };

        const statusLabels = {
            'planned': 'Pianificata',
            'in-progress': 'In corso',
            'completed': 'Completata'
        };

        const statusColors = {
            'planned': '#3498db',
            'in-progress': '#f39c12',
            'completed': '#27ae60'
        };

        const priorityLabels = {
            'low': 'Bassa',
            'medium': 'Media',
            'high': 'Alta'
        };

        const priorityColors = {
            'low': '#95a5a6',
            'medium': '#f39c12',
            'high': '#e74c3c'
        };

        activitiesList.innerHTML = filteredActivities.map(activity => {
            const cls = this.classes.find(c => c.id == activity.classId);
            const student = this.students.find(s => s.id == activity.studentId);
            const icon = activityTypeIcons[activity.type] || '📋';
            const statusLabel = statusLabels[activity.status] || activity.status;
            const statusColor = statusColors[activity.status] || '#95a5a6';
            const priority = activity.priority || 'medium';
            const priorityLabel = priorityLabels[priority];
            const priorityColor = priorityColors[priority];
            const progress = activity.progress || 0;

            // Calculate if deadline is near (within 3 days)
            const isDeadlineNear = activity.deadline ? 
                (new Date(activity.deadline) - new Date()) < (3 * 24 * 60 * 60 * 1000) : false;

            return `
                <div class="activity-item" role="article" aria-labelledby="activity-title-${activity.id}">
                    <div class="activity-header">
                        <h4 id="activity-title-${activity.id}">${icon} ${activity.title}</h4>
                        <div class="activity-badges">
                            <span class="activity-status" style="background-color: ${statusColor}">${statusLabel}</span>
                            <span class="activity-priority" style="background-color: ${priorityColor}">Priorità: ${priorityLabel}</span>
                        </div>
                    </div>
                    <p><strong>Tipo:</strong> ${activity.type}</p>
                    ${activity.description ? `<p><strong>Descrizione:</strong> ${activity.description}</p>` : ''}
                    ${activity.deadline ? `<p><strong>Scadenza:</strong> ${new Date(activity.deadline).toLocaleDateString('it-IT')}${isDeadlineNear ? ' <span style="color: #e74c3c;">⚠️ Imminente</span>' : ''}</p>` : ''}
                    ${cls ? `<p><strong>Classe:</strong> ${cls.name}</p>` : ''}
                    ${student ? `<p><strong>Studente:</strong> ${student.name}</p>` : ''}
                    ${progress > 0 ? `
                        <div class="activity-progress" role="group" aria-label="Avanzamento attività">
                            <label><strong>Avanzamento:</strong> ${progress}%</label>
                            <div class="progress-bar" role="progressbar" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100" aria-label="Percentuale di completamento ${progress}%">
                                <div class="progress-fill" style="width: ${progress}%; background-color: ${statusColor}"></div>
                            </div>
                        </div>
                    ` : ''}
                    ${activity.notes ? `<p><strong>Note:</strong> ${activity.notes}</p>` : ''}
                    <div class="activity-actions">
                        <button class="btn btn-secondary" onclick="app.showEditActivityForm(${activity.id})">✏️ Modifica</button>
                        ${activity.status !== 'in-progress' ? `<button class="btn btn-secondary" onclick="app.updateActivityStatus(${activity.id}, 'in-progress')">▶️ In corso</button>` : ''}
                        ${activity.status !== 'completed' ? `<button class="btn btn-success" onclick="app.updateActivityStatus(${activity.id}, 'completed')">✅ Completa</button>` : ''}
                        ${activity.status === 'completed' ? `<button class="btn btn-secondary" onclick="app.updateActivityStatus(${activity.id}, 'planned')">↩️ Riapri</button>` : ''}
                        <button class="btn btn-danger" onclick="app.deleteActivity(${activity.id})">🗑️ Elimina</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Schedule Management methods
    getNextWeekday(date) {
        const day = date.getDay();
        // If Saturday (6) or Sunday (0), move to next Monday
        if (day === 0) { // Sunday
            date.setDate(date.getDate() + 1);
        } else if (day === 6) { // Saturday
            date.setDate(date.getDate() + 2);
        }
        return date;
    }

    getCurrentScheduleDate() {
        if (this.currentScheduleDate) {
            return new Date(this.currentScheduleDate);
        }
        const today = new Date();
        return this.getNextWeekday(today);
    }

    setScheduleDate(dateStr) {
        const date = new Date(dateStr);
        this.currentScheduleDate = this.getNextWeekday(date).toISOString().split('T')[0];
        this.renderSchedule();
    }

    getScheduleKey(date, hour) {
        const dateStr = date.toISOString().split('T')[0];
        return `${dateStr}-${hour}`;
    }

    updateScheduleSlot(date, hour, classId, activityType) {
        const key = this.getScheduleKey(date, hour);
        if (!classId && !activityType) {
            delete this.schedule[key];
        } else {
            this.schedule[key] = {
                classId: classId || null,
                activityType: activityType || null
            };
        }
        this.saveData();
        this.renderSchedule();
        this.renderTodaySchedulePreview(); // Update dashboard preview
    }

    getActivityTypeIcon(type) {
        const icons = {
            'theory': { icon: 'T', color: '#3498db', label: 'Teoria' },
            'drawing': { icon: 'D', color: '#e67e22', label: 'Disegno' },
            'lab': { icon: 'L', color: '#27ae60', label: 'Laboratorio' }
        };
        return icons[type] || { icon: '', color: '#95a5a6', label: '' };
    }

    showScheduleSlotEditor(date, hour) {
        const key = this.getScheduleKey(date, hour);
        const slot = this.schedule[key] || { classId: null, activityType: null };
        
        const classOptions = this.classes.map(c => 
            `<option value="${c.id}" ${slot.classId == c.id ? 'selected' : ''}>${c.name}</option>`
        ).join('');

        const activityOptions = ['theory', 'drawing', 'lab'].map(type => {
            const info = this.getActivityTypeIcon(type);
            return `<option value="${type}" ${slot.activityType === type ? 'selected' : ''}>${info.label}</option>`;
        }).join('');

        const dateStr = date.toISOString().split('T')[0];
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 400px;">
                <h3>Modifica Slot Orario</h3>
                <p><strong>Data:</strong> ${new Date(date).toLocaleDateString('it-IT')}</p>
                <p><strong>Ora:</strong> ${hour}:00</p>
                <div class="form-group">
                    <label>Classe:</label>
                    <select id="slot-class-select">
                        <option value="">Nessuna classe</option>
                        ${classOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label>Tipo di Attività:</label>
                    <select id="slot-activity-type-select">
                        <option value="">Nessuna attività</option>
                        ${activityOptions}
                    </select>
                </div>
                <div class="form-actions">
                    <button class="btn btn-primary" onclick="app.saveScheduleSlot('${dateStr}', ${hour})">Salva</button>
                    <button class="btn btn-secondary" onclick="app.closeScheduleSlotEditor()">Annulla</button>
                    ${slot.classId || slot.activityType ? `<button class="btn btn-danger" onclick="app.clearScheduleSlot('${dateStr}', ${hour})">Elimina</button>` : ''}
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        this.currentScheduleModal = modal;
    }

    saveScheduleSlot(dateStr, hour) {
        const classId = document.getElementById('slot-class-select').value;
        const activityType = document.getElementById('slot-activity-type-select').value;
        const date = new Date(dateStr);
        this.updateScheduleSlot(date, hour, classId || null, activityType || null);
        this.closeScheduleSlotEditor();
    }

    clearScheduleSlot(dateStr, hour) {
        const date = new Date(dateStr);
        this.updateScheduleSlot(date, hour, null, null);
        this.closeScheduleSlotEditor();
    }

    closeScheduleSlotEditor() {
        if (this.currentScheduleModal) {
            this.currentScheduleModal.remove();
            this.currentScheduleModal = null;
        }
    }

    launchScheduleActivity(date, hour) {
        const key = this.getScheduleKey(date, hour);
        const slot = this.schedule[key];
        
        if (!slot || !slot.classId) {
            alert('Seleziona prima una classe per questo slot orario');
            return;
        }

        // Switch to activities tab and show activity selector
        this.switchTab('activities');
        
        // Filter activities by class
        const classActivities = this.activities.filter(a => a.classId == slot.classId);
        
        // Show activity selection modal
        this.showActivitySelectionModal(slot, date, hour, classActivities);
    }

    showActivitySelectionModal(slot, date, hour, classActivities) {
        const cls = this.classes.find(c => c.id == slot.classId);
        const activityTypeInfo = slot.activityType ? this.getActivityTypeIcon(slot.activityType) : null;

        const plannedActivities = classActivities.filter(a => a.status === 'planned');
        const inProgressActivities = classActivities.filter(a => a.status === 'in-progress');
        const recentActivities = classActivities
            .filter(a => a.status === 'completed')
            .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
            .slice(0, 5);

        const renderActivityList = (activities, title) => {
            if (activities.length === 0) return '';
            return `
                <div class="activity-section">
                    <h4>${title}</h4>
                    ${activities.map(a => `
                        <div class="activity-option" onclick="app.selectScheduleActivity(${a.id})" style="cursor: pointer; padding: 10px; margin: 5px 0; border: 1px solid #ddd; border-radius: 5px;">
                            <strong>${a.title}</strong>
                            <p style="margin: 5px 0; font-size: 0.9em;">${a.type} ${a.deadline ? '- Scadenza: ' + new Date(a.deadline).toLocaleDateString('it-IT') : ''}</p>
                        </div>
                    `).join('')}
                </div>
            `;
        };

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px; max-height: 80vh; overflow-y: auto;">
                <h3>Seleziona Attività</h3>
                <p><strong>Classe:</strong> ${cls ? cls.name : 'N/D'}</p>
                ${activityTypeInfo ? `<p><strong>Tipo:</strong> ${activityTypeInfo.label}</p>` : ''}
                <p><strong>Orario:</strong> ${new Date(date).toLocaleDateString('it-IT')} - ${hour}:00</p>
                
                ${renderActivityList(inProgressActivities, '📝 Attività In Corso')}
                ${renderActivityList(plannedActivities, '📋 Attività Pianificate')}
                ${renderActivityList(recentActivities, '✅ Attività Recenti')}
                
                ${classActivities.length === 0 ? '<p style="text-align: center; margin: 20px 0;">Nessuna attività disponibile per questa classe</p>' : ''}
                
                <div class="form-actions">
                    <button class="btn btn-secondary" onclick="app.closeActivitySelectionModal()">Chiudi</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        this.currentActivityModal = modal;
    }

    selectScheduleActivity(activityId) {
        // Update activity status to in-progress if not already
        const activity = this.activities.find(a => a.id === activityId);
        if (activity && activity.status !== 'in-progress') {
            this.updateActivityStatus(activityId, 'in-progress');
        }
        this.closeActivitySelectionModal();
        this.switchTab('activities');
        // Scroll to the activity
        setTimeout(() => {
            const activityElement = document.querySelector(`[onclick*="deleteActivity(${activityId})"]`);
            if (activityElement) {
                activityElement.closest('.activity-item').scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    }

    closeActivitySelectionModal() {
        if (this.currentActivityModal) {
            this.currentActivityModal.remove();
            this.currentActivityModal = null;
        }
    }
    
    // Smart Daily Schedule Management Methods
    
    startLessonSession(dateStr, hour) {
        const date = new Date(dateStr);
        const key = this.getScheduleKey(date, hour);
        const slot = this.schedule[key];
        
        if (!slot || !slot.classId) {
            alert('Seleziona prima una classe per questo slot orario');
            return;
        }
        
        const cls = this.classes.find(c => c.id == slot.classId);
        if (!cls) {
            alert('Classe non trovata');
            return;
        }
        
        // Show step-by-step activity selection modal
        this.showSmartActivitySelectionModal(date, hour, slot, cls);
    }
    
    showSmartActivitySelectionModal(date, hour, slot, cls) {
        const classActivities = this.activities.filter(a => a.classId == slot.classId);
        const activityTypeInfo = slot.activityType ? this.getActivityTypeIcon(slot.activityType) : null;
        
        const plannedActivities = classActivities.filter(a => a.status === 'planned');
        const inProgressActivities = classActivities.filter(a => a.status === 'in-progress');
        
        // Get AI suggestions for activities if API key is available
        const apiKey = localStorage.getItem('openrouter-api-key');
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        modal.innerHTML = `
            <div class="modal-content lesson-session-modal" style="max-width: 700px; max-height: 90vh; overflow-y: auto;">
                <h3>🎓 Avvia Lezione</h3>
                
                <div class="lesson-info-section" style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <div>
                            <strong style="font-size: 1.1em;">${cls.name}</strong>
                            <div style="color: #666; font-size: 0.9em;">${new Date(date).toLocaleDateString('it-IT')} - ${hour}:00</div>
                        </div>
                        ${activityTypeInfo ? `<span style="background: ${activityTypeInfo.color}; color: white; padding: 5px 12px; border-radius: 20px; font-size: 0.9em;">${activityTypeInfo.label}</span>` : ''}
                    </div>
                </div>
                
                <div class="step-indicator" style="display: flex; justify-content: space-between; margin-bottom: 25px; padding: 0 20px;">
                    <div class="step active" style="text-align: center;">
                        <div style="width: 40px; height: 40px; background: #4a90e2; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; font-weight: bold;">1</div>
                        <div style="font-size: 0.85em;">Seleziona Attività</div>
                    </div>
                    <div style="flex: 1; border-top: 2px dashed #ddd; margin-top: 20px;"></div>
                    <div class="step" style="text-align: center; opacity: 0.5;">
                        <div style="width: 40px; height: 40px; background: #ddd; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; font-weight: bold;">2</div>
                        <div style="font-size: 0.85em;">Valuta Studenti</div>
                    </div>
                </div>
                
                ${apiKey ? `
                    <div class="ai-suggestion-section" style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #2196f3;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <span style="font-size: 1.3em;">🤖</span>
                            <strong>Suggerimenti IA</strong>
                        </div>
                        <div id="ai-activity-suggestions" style="font-size: 0.95em; color: #1976d2;">
                            <em>Caricamento suggerimenti...</em>
                        </div>
                        <button class="btn btn-sm btn-secondary" onclick="app.generateActivitySuggestions('${date.toISOString()}', ${hour}, ${slot.classId})" style="margin-top: 10px; font-size: 0.85em;">
                            🔄 Rigenera Suggerimenti
                        </button>
                    </div>
                ` : ''}
                
                <div class="activity-selection-section">
                    <h4 style="margin-bottom: 15px;">Scegli un'attività da svolgere:</h4>
                    
                    ${inProgressActivities.length > 0 ? `
                        <div class="activity-group" style="margin-bottom: 20px;">
                            <h5 style="color: #ff9800; margin-bottom: 10px;">📝 Attività In Corso</h5>
                            ${inProgressActivities.map(a => `
                                <div class="activity-card selectable" onclick="app.selectActivityForSession(${a.id}, '${date.toISOString()}', ${hour})" style="padding: 15px; margin: 10px 0; background: #fff; border: 2px solid #e0e0e0; border-radius: 8px; cursor: pointer; transition: all 0.2s;">
                                    <div style="display: flex; justify-content: space-between; align-items: start;">
                                        <div style="flex: 1;">
                                            <strong style="font-size: 1.05em;">${a.title}</strong>
                                            <div style="color: #666; font-size: 0.9em; margin-top: 5px;">${a.type}</div>
                                            ${a.deadline ? `<div style="color: #f44336; font-size: 0.85em; margin-top: 3px;">⏰ Scadenza: ${new Date(a.deadline).toLocaleDateString('it-IT')}</div>` : ''}
                                        </div>
                                        <span style="background: #ff9800; color: white; padding: 4px 10px; border-radius: 12px; font-size: 0.8em;">In corso</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                    
                    ${plannedActivities.length > 0 ? `
                        <div class="activity-group" style="margin-bottom: 20px;">
                            <h5 style="color: #2196f3; margin-bottom: 10px;">📋 Attività Pianificate</h5>
                            ${plannedActivities.map(a => `
                                <div class="activity-card selectable" onclick="app.selectActivityForSession(${a.id}, '${date.toISOString()}', ${hour})" style="padding: 15px; margin: 10px 0; background: #fff; border: 2px solid #e0e0e0; border-radius: 8px; cursor: pointer; transition: all 0.2s;">
                                    <div style="display: flex; justify-content: space-between; align-items: start;">
                                        <div style="flex: 1;">
                                            <strong style="font-size: 1.05em;">${a.title}</strong>
                                            <div style="color: #666; font-size: 0.9em; margin-top: 5px;">${a.type}</div>
                                            ${a.deadline ? `<div style="color: #f44336; font-size: 0.85em; margin-top: 3px;">⏰ Scadenza: ${new Date(a.deadline).toLocaleDateString('it-IT')}</div>` : ''}
                                        </div>
                                        <span style="background: #2196f3; color: white; padding: 4px 10px; border-radius: 12px; font-size: 0.8em;">Pianificata</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                    
                    ${classActivities.length === 0 ? `
                        <div style="text-align: center; padding: 40px 20px; color: #999;">
                            <div style="font-size: 3em; margin-bottom: 15px;">📋</div>
                            <p>Nessuna attività disponibile per questa classe</p>
                            <button class="btn btn-secondary" onclick="app.closeSmartActivityModal(); app.switchTab('activities');" style="margin-top: 15px;">
                                ➕ Crea Nuova Attività
                            </button>
                        </div>
                    ` : ''}
                </div>
                
                <div class="form-actions" style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
                    <button class="btn btn-secondary" onclick="app.closeSmartActivityModal()">Annulla</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.currentActivityModal = modal;
        
        // Load AI suggestions if API key exists
        if (apiKey) {
            this.generateActivitySuggestions(date.toISOString(), hour, slot.classId);
        }
        
        // Add hover effect styles
        const style = document.createElement('style');
        style.textContent = `
            .activity-card.selectable:hover {
                border-color: #4a90e2 !important;
                box-shadow: 0 4px 12px rgba(74, 144, 226, 0.2);
                transform: translateY(-2px);
            }
        `;
        document.head.appendChild(style);
    }
    
    async generateActivitySuggestions(dateStr, hour, classId) {
        const suggestionsDiv = document.getElementById('ai-activity-suggestions');
        if (!suggestionsDiv) return;
        
        suggestionsDiv.innerHTML = '<em>Analisi in corso...</em>';
        
        const apiKey = localStorage.getItem('openrouter-api-key');
        if (!apiKey) {
            suggestionsDiv.innerHTML = '<em style="color: #f44336;">API key non configurata</em>';
            return;
        }
        
        const cls = this.classes.find(c => c.id == classId);
        const date = new Date(dateStr);
        const classActivities = this.activities.filter(a => a.classId == classId);
        
        const prompt = `Sei un assistente IA per insegnanti. Analizza il contesto e suggerisci quale attività sia più opportuna per questa lezione.

Contesto:
- Classe: ${cls ? cls.name : 'N/D'}
- Data: ${date.toLocaleDateString('it-IT')} 
- Ora: ${hour}:00
- Giorno della settimana: ${['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'][date.getDay()]}

Attività disponibili:
${classActivities.map(a => `- ${a.title} (${a.type}, stato: ${a.status}${a.deadline ? ', scadenza: ' + new Date(a.deadline).toLocaleDateString('it-IT') : ''})`).join('\n')}

Fornisci un suggerimento breve (massimo 2-3 righe) su quale attività svolgere e perché, considerando scadenze, continuità didattica e il giorno della settimana. Se non ci sono attività, suggerisci brevemente cosa fare.`;

        try {
            const response = await this.callOpenRouterAPI(prompt);
            suggestionsDiv.innerHTML = response.replace(/\n/g, '<br>');
        } catch (error) {
            console.error('Error getting AI suggestions:', error);
            suggestionsDiv.innerHTML = '<em style="color: #f44336;">Errore nel caricamento dei suggerimenti</em>';
        }
    }
    
    selectActivityForSession(activityId, dateStr, hour) {
        const activity = this.activities.find(a => a.id === activityId);
        if (!activity) return;
        
        // Update activity status to in-progress if not already
        if (activity.status !== 'in-progress') {
            this.updateActivityStatus(activityId, 'in-progress');
        }
        
        const date = new Date(dateStr);
        const key = this.getScheduleKey(date, hour);
        const slot = this.schedule[key];
        const cls = this.classes.find(c => c.id == slot.classId);
        
        // Close the activity selection modal
        this.closeSmartActivityModal();
        
        // Create and start the lesson session
        this.createLessonSession(date, hour, slot, cls, activity);
    }
    
    createLessonSession(date, hour, slot, cls, activity) {
        const session = {
            id: Date.now(),
            date: date.toISOString(),
            hour: hour,
            classId: slot.classId,
            className: cls.name,
            activityId: activity.id,
            activityTitle: activity.title,
            activityType: activity.type,
            startTime: new Date().toISOString(),
            endTime: null,
            studentEvaluations: [],
            notes: '',
            status: 'active'
        };
        
        this.currentLessonSession = session;
        this.lessonSessions.push(session);
        this.saveData();
        
        // Show student evaluation interface
        this.showStudentEvaluationInterface(session);
    }
    
    showStudentEvaluationInterface(session) {
        const classStudents = this.students.filter(s => s.class === session.className);
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        modal.innerHTML = `
            <div class="modal-content student-evaluation-modal" style="max-width: 900px; max-height: 95vh; overflow-y: auto;">
                <div class="lesson-session-header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; margin: -20px -20px 20px -20px;">
                    <h3 style="margin: 0 0 10px 0; color: white;">🎓 Lezione in Corso</h3>
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                        <div>
                            <div style="font-size: 1.1em; font-weight: 500;">${session.className}</div>
                            <div style="opacity: 0.9; font-size: 0.9em;">${session.activityTitle}</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 0.9em; opacity: 0.9;">${new Date(session.date).toLocaleDateString('it-IT')}</div>
                            <div style="font-size: 0.9em; opacity: 0.9;">${session.hour}:00 - ${session.hour + 1}:00</div>
                        </div>
                    </div>
                </div>
                
                <div class="student-evaluation-section">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h4 style="margin: 0;">👥 Valutazioni Studenti (${classStudents.length})</h4>
                        <button class="btn btn-sm btn-secondary" onclick="app.generateAllEvaluationSuggestions()" style="font-size: 0.85em;">
                            🤖 Suggerimenti IA per Tutti
                        </button>
                    </div>
                    
                    ${classStudents.length === 0 ? `
                        <div style="text-align: center; padding: 40px; color: #999;">
                            <p>Nessuno studente trovato per questa classe</p>
                            <button class="btn btn-secondary" onclick="app.endLessonSession(); app.switchTab('students');">
                                ➕ Aggiungi Studenti
                            </button>
                        </div>
                    ` : `
                        <div class="students-grid" style="display: grid; gap: 15px;">
                            ${classStudents.map(student => this.renderStudentEvaluationCard(student, session)).join('')}
                        </div>
                    `}
                </div>
                
                <div class="lesson-notes-section" style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e0e0e0;">
                    <h4>📝 Note Generali della Lezione</h4>
                    <textarea id="lesson-notes-input" placeholder="Aggiungi note generali sulla lezione (argomenti trattati, materiali utilizzati, osservazioni generali...)" style="width: 100%; min-height: 100px; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-family: inherit; resize: vertical;">${session.notes || ''}</textarea>
                </div>
                
                <div class="form-actions" style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e0e0e0; display: flex; justify-content: space-between; gap: 10px;">
                    <button class="btn btn-danger" onclick="app.cancelLessonSession()">Annulla Lezione</button>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn btn-secondary" onclick="app.saveLessonSessionProgress()">💾 Salva Progresso</button>
                        <button class="btn btn-primary" onclick="app.endLessonSession()">✅ Termina Lezione</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.currentActivityModal = modal;
    }
    
    renderStudentEvaluationCard(student, session) {
        const existingEval = session.studentEvaluations.find(e => e.studentId === student.id);
        const studentId = student.id;
        
        return `
            <div class="student-eval-card" id="student-eval-${studentId}" style="background: #f8f9fa; padding: 18px; border-radius: 8px; border: 2px solid #e0e0e0;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                    <div style="flex: 1;">
                        <strong style="font-size: 1.05em;">${student.name}</strong>
                    </div>
                    <button class="btn btn-sm" onclick="app.generateEvaluationSuggestion(${studentId})" style="font-size: 0.75em; padding: 4px 8px; background: #e3f2fd; color: #1976d2; border: 1px solid #90caf9;">
                        🤖 IA
                    </button>
                </div>
                
                <div class="evaluation-inputs" style="display: grid; gap: 12px;">
                    <div>
                        <label style="display: block; font-size: 0.9em; color: #666; margin-bottom: 5px;">Voto</label>
                        <div style="display: flex; gap: 5px;">
                            ${[4, 5, 6, 7, 8, 9, 10].map(grade => `
                                <button class="grade-btn" onclick="app.setStudentGrade(${studentId}, ${grade})" data-grade="${grade}" style="flex: 1; padding: 8px; border: 2px solid ${existingEval && existingEval.grade === grade ? '#4a90e2' : '#ddd'}; background: ${existingEval && existingEval.grade === grade ? '#4a90e2' : 'white'}; color: ${existingEval && existingEval.grade === grade ? 'white' : '#333'}; border-radius: 6px; cursor: pointer; font-weight: ${existingEval && existingEval.grade === grade ? 'bold' : 'normal'}; transition: all 0.2s;">
                                    ${grade}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div>
                        <label style="display: block; font-size: 0.9em; color: #666; margin-bottom: 5px;">Comportamento</label>
                        <div style="display: flex; gap: 8px;">
                            ${['😊', '😐', '😟'].map((emoji, idx) => {
                                const behaviorValues = ['positivo', 'neutro', 'negativo'];
                                const behaviorValue = behaviorValues[idx];
                                const isSelected = existingEval && existingEval.behavior === behaviorValue;
                                return `
                                    <button class="behavior-btn" onclick="app.setStudentBehavior(${studentId}, '${behaviorValue}')" style="flex: 1; padding: 10px; border: 2px solid ${isSelected ? '#4a90e2' : '#ddd'}; background: ${isSelected ? '#e3f2fd' : 'white'}; border-radius: 6px; cursor: pointer; font-size: 1.5em; transition: all 0.2s;">
                                        ${emoji}
                                    </button>
                                `;
                            }).join('')}
                        </div>
                    </div>
                    
                    <div>
                        <label style="display: block; font-size: 0.9em; color: #666; margin-bottom: 5px;">Osservazioni</label>
                        <textarea id="observations-${studentId}" placeholder="Note comportamentali, partecipazione, difficoltà riscontrate..." style="width: 100%; min-height: 60px; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-family: inherit; font-size: 0.9em; resize: vertical;">${existingEval ? existingEval.observations || '' : ''}</textarea>
                        <div id="ai-suggestions-${studentId}" style="margin-top: 8px; font-size: 0.85em; color: #1976d2; font-style: italic; display: none;"></div>
                    </div>
                </div>
            </div>
        `;
    }
    
    setStudentGrade(studentId, grade) {
        if (!this.currentLessonSession) return;
        
        let evaluation = this.currentLessonSession.studentEvaluations.find(e => e.studentId === studentId);
        if (!evaluation) {
            evaluation = {
                studentId: studentId,
                grade: null,
                behavior: null,
                observations: '',
                aiSuggestion: null
            };
            this.currentLessonSession.studentEvaluations.push(evaluation);
        }
        
        evaluation.grade = grade;
        evaluation.observations = document.getElementById(`observations-${studentId}`)?.value || '';
        this.saveData();
        
        // Update UI - refresh the card
        const card = document.getElementById(`student-eval-${studentId}`);
        if (card) {
            const student = this.students.find(s => s.id === studentId);
            card.outerHTML = this.renderStudentEvaluationCard(student, this.currentLessonSession);
        }
    }
    
    setStudentBehavior(studentId, behavior) {
        if (!this.currentLessonSession) return;
        
        let evaluation = this.currentLessonSession.studentEvaluations.find(e => e.studentId === studentId);
        if (!evaluation) {
            evaluation = {
                studentId: studentId,
                grade: null,
                behavior: null,
                observations: '',
                aiSuggestion: null
            };
            this.currentLessonSession.studentEvaluations.push(evaluation);
        }
        
        evaluation.behavior = behavior;
        evaluation.observations = document.getElementById(`observations-${studentId}`)?.value || '';
        this.saveData();
        
        // Update UI - refresh the card
        const card = document.getElementById(`student-eval-${studentId}`);
        if (card) {
            const student = this.students.find(s => s.id === studentId);
            card.outerHTML = this.renderStudentEvaluationCard(student, this.currentLessonSession);
        }
    }
    
    async generateEvaluationSuggestion(studentId) {
        const suggestionsDiv = document.getElementById(`ai-suggestions-${studentId}`);
        if (!suggestionsDiv) return;
        
        const apiKey = localStorage.getItem('openrouter-api-key');
        if (!apiKey) {
            alert('Configura la tua API key di OpenRouter nelle impostazioni per usare i suggerimenti IA');
            return;
        }
        
        suggestionsDiv.style.display = 'block';
        suggestionsDiv.innerHTML = '🤖 Generazione suggerimento...';
        
        const student = this.students.find(s => s.id === studentId);
        const session = this.currentLessonSession;
        
        const prompt = `Sei un assistente IA per insegnanti. Genera 2-3 brevi suggerimenti di osservazioni in itinere per lo studente durante questa lezione.

Studente: ${student.name}
Classe: ${session.className}
Attività: ${session.activityTitle} (${session.activityType})
Data: ${new Date(session.date).toLocaleDateString('it-IT')}

Genera suggerimenti specifici e costruttivi relativi a: partecipazione, impegno, comprensione, collaborazione. 
Formato: elenco puntato breve (massimo 3 punti), ogni punto max 10 parole.`;

        try {
            const response = await this.callOpenRouterAPI(prompt);
            
            // Parse the response and create clickable suggestions
            const suggestions = response.split('\n').filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'));
            
            if (suggestions.length > 0) {
                suggestionsDiv.innerHTML = `
                    <div style="background: #e3f2fd; padding: 10px; border-radius: 6px; margin-top: 5px;">
                        <div style="font-weight: 500; margin-bottom: 8px; color: #1976d2;">💡 Suggerimenti IA:</div>
                        ${suggestions.map(s => {
                            const text = s.replace(/^[-•]\s*/, '').trim();
                            return `
                                <div onclick="app.applySuggestion(${studentId}, '${text.replace(/'/g, "\\'")}')" style="padding: 6px 10px; margin: 4px 0; background: white; border-radius: 4px; cursor: pointer; border: 1px solid #90caf9; transition: all 0.2s;" onmouseover="this.style.background='#bbdefb'" onmouseout="this.style.background='white'">
                                    ${text}
                                </div>
                            `;
                        }).join('')}
                    </div>
                `;
            } else {
                suggestionsDiv.innerHTML = response;
            }
        } catch (error) {
            console.error('Error generating suggestion:', error);
            suggestionsDiv.innerHTML = '❌ Errore nel generare suggerimenti';
        }
    }
    
    applySuggestion(studentId, suggestion) {
        const textArea = document.getElementById(`observations-${studentId}`);
        if (!textArea) return;
        
        const currentText = textArea.value.trim();
        textArea.value = currentText ? `${currentText}\n- ${suggestion}` : `- ${suggestion}`;
        
        // Save to session
        if (this.currentLessonSession) {
            let evaluation = this.currentLessonSession.studentEvaluations.find(e => e.studentId === studentId);
            if (!evaluation) {
                evaluation = {
                    studentId: studentId,
                    grade: null,
                    behavior: null,
                    observations: '',
                    aiSuggestion: null
                };
                this.currentLessonSession.studentEvaluations.push(evaluation);
            }
            evaluation.observations = textArea.value;
            this.saveData();
        }
        
        // Visual feedback
        textArea.style.background = '#e8f5e9';
        setTimeout(() => {
            textArea.style.background = 'white';
        }, 500);
    }
    
    async generateAllEvaluationSuggestions() {
        if (!this.currentLessonSession) return;
        
        const classStudents = this.students.filter(s => s.class === this.currentLessonSession.className);
        
        for (const student of classStudents) {
            await this.generateEvaluationSuggestion(student.id);
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }
    
    saveLessonSessionProgress() {
        if (!this.currentLessonSession) return;
        
        // Save notes
        const notesInput = document.getElementById('lesson-notes-input');
        if (notesInput) {
            this.currentLessonSession.notes = notesInput.value;
        }
        
        // Save all student observations
        const classStudents = this.students.filter(s => s.class === this.currentLessonSession.className);
        classStudents.forEach(student => {
            const observationsInput = document.getElementById(`observations-${student.id}`);
            if (observationsInput) {
                let evaluation = this.currentLessonSession.studentEvaluations.find(e => e.studentId === student.id);
                if (!evaluation) {
                    evaluation = {
                        studentId: student.id,
                        grade: null,
                        behavior: null,
                        observations: '',
                        aiSuggestion: null
                    };
                    this.currentLessonSession.studentEvaluations.push(evaluation);
                }
                evaluation.observations = observationsInput.value;
            }
        });
        
        this.saveData();
        
        // Visual feedback
        alert('✅ Progresso salvato con successo!');
    }
    
    endLessonSession() {
        if (!this.currentLessonSession) return;
        
        // Save all data
        this.saveLessonSessionProgress();
        
        // Mark session as completed
        this.currentLessonSession.endTime = new Date().toISOString();
        this.currentLessonSession.status = 'completed';
        
        // Save evaluations to main evaluations array
        this.currentLessonSession.studentEvaluations.forEach(evalData => {
            if (evalData.grade || evalData.observations) {
                const student = this.students.find(s => s.id === evalData.studentId);
                if (student) {
                    this.evaluations.push({
                        id: Date.now() + Math.random(),
                        studentId: evalData.studentId,
                        studentName: student.name,
                        date: this.currentLessonSession.date,
                        activity: this.currentLessonSession.activityTitle,
                        score: evalData.grade,
                        behavior: evalData.behavior,
                        notes: evalData.observations,
                        createdAt: new Date().toISOString()
                    });
                }
            }
        });
        
        this.saveData();
        
        // Close modal
        this.closeSmartActivityModal();
        
        // Show summary
        const evaluatedCount = this.currentLessonSession.studentEvaluations.filter(e => e.grade || e.observations).length;
        alert(`✅ Lezione terminata!\n\n${evaluatedCount} studenti valutati\nDati salvati con successo.`);
        
        this.currentLessonSession = null;
        
        // Refresh dashboard and evaluations
        this.renderDashboard();
        this.renderEvaluations();
    }
    
    cancelLessonSession() {
        if (!confirm('Sei sicuro di voler annullare questa lezione? I dati non salvati andranno persi.')) {
            return;
        }
        
        // Remove session from array
        if (this.currentLessonSession) {
            this.lessonSessions = this.lessonSessions.filter(s => s.id !== this.currentLessonSession.id);
            this.currentLessonSession = null;
            this.saveData();
        }
        
        this.closeSmartActivityModal();
    }
    
    closeSmartActivityModal() {
        if (this.currentActivityModal) {
            this.currentActivityModal.remove();
            this.currentActivityModal = null;
        }
    }

    toggleScheduleView() {
        this.scheduleView = this.scheduleView === 'weekly' ? 'daily' : 'weekly';
        this.renderSchedule();
    }

    navigateSchedule(direction) {
        const currentDate = this.getCurrentScheduleDate();
        
        if (this.scheduleView === 'daily') {
            // Move by 1 weekday
            do {
                currentDate.setDate(currentDate.getDate() + direction);
            } while (currentDate.getDay() === 0 || currentDate.getDay() === 6);
        } else {
            // Move by 1 week
            currentDate.setDate(currentDate.getDate() + (direction * 7));
        }
        
        this.currentScheduleDate = this.getNextWeekday(currentDate).toISOString().split('T')[0];
        this.renderSchedule();
    }

    renderSchedule() {
        const scheduleContainer = document.getElementById('schedule-container');
        if (!scheduleContainer) return;

        const currentDate = this.getCurrentScheduleDate();
        const hours = [8, 9, 10, 11, 12, 13];
        
        if (this.scheduleView === 'daily') {
            this.renderDailySchedule(scheduleContainer, currentDate, hours);
        } else {
            this.renderWeeklySchedule(scheduleContainer, currentDate, hours);
        }
    }

    renderDailySchedule(container, date, hours) {
        const dayName = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'][date.getDay()];
        
        container.innerHTML = `
            <div class="schedule-header">
                <button class="btn btn-secondary" onclick="app.navigateSchedule(-1)">◀ Giorno Precedente</button>
                <h3>${dayName} ${date.toLocaleDateString('it-IT')}</h3>
                <button class="btn btn-secondary" onclick="app.navigateSchedule(1)">Giorno Successivo ▶</button>
            </div>
            <div class="schedule-view-toggle">
                <button class="btn btn-primary" onclick="app.toggleScheduleView()">📅 Vista Settimanale</button>
            </div>
            <table class="schedule-table">
                <thead>
                    <tr>
                        <th>Ora</th>
                        <th>Classe e Attività</th>
                    </tr>
                </thead>
                <tbody>
                    ${hours.map(hour => {
                        const key = this.getScheduleKey(date, hour);
                        const slot = this.schedule[key] || {};
                        const cls = slot.classId ? this.classes.find(c => c.id == slot.classId) : null;
                        const activityInfo = slot.activityType ? this.getActivityTypeIcon(slot.activityType) : null;
                        
                        return `
                            <tr>
                                <td class="schedule-hour">${hour}:00 - ${hour + 1}:00</td>
                                <td class="schedule-slot" onclick="app.showScheduleSlotEditor(new Date('${date.toISOString()}'), ${hour})" title="Clicca per modificare">
                                    ${cls ? `<div class="slot-class">${cls.name}</div>` : '<div class="slot-empty">Nessuna classe</div>'}
                                    ${activityInfo ? `<div class="slot-activity" style="background-color: ${activityInfo.color}; color: white; display: inline-block; padding: 2px 8px; border-radius: 3px; font-weight: bold;">${activityInfo.icon}</div>` : ''}
                                    ${cls ? `<button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); app.launchScheduleActivity(new Date('${date.toISOString()}'), ${hour})" style="margin-left: 10px; font-size: 0.8em;">Avvia</button>` : ''}
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    }

    renderWeeklySchedule(container, startDate, hours) {
        // Get Monday of the week
        const monday = new Date(startDate);
        const day = monday.getDay();
        const diff = day === 0 ? -6 : 1 - day; // adjust when day is sunday
        monday.setDate(monday.getDate() + diff);

        const weekDays = [];
        for (let i = 0; i < 5; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            weekDays.push(date);
        }

        const dayNames = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì'];

        container.innerHTML = `
            <div class="schedule-header">
                <button class="btn btn-secondary" onclick="app.navigateSchedule(-1)">◀ Settimana Precedente</button>
                <h3>Settimana dal ${weekDays[0].toLocaleDateString('it-IT')} al ${weekDays[4].toLocaleDateString('it-IT')}</h3>
                <button class="btn btn-secondary" onclick="app.navigateSchedule(1)">Settimana Successiva ▶</button>
            </div>
            <div class="schedule-view-toggle">
                <button class="btn btn-primary" onclick="app.toggleScheduleView()">📆 Vista Giornaliera</button>
            </div>
            <table class="schedule-table">
                <thead>
                    <tr>
                        <th>Ora</th>
                        ${dayNames.map((name, i) => `<th>${name}<br><small>${weekDays[i].getDate()}/${weekDays[i].getMonth() + 1}</small></th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${hours.map(hour => `
                        <tr>
                            <td class="schedule-hour">${hour}:00</td>
                            ${weekDays.map(date => {
                                const key = this.getScheduleKey(date, hour);
                                const slot = this.schedule[key] || {};
                                const cls = slot.classId ? this.classes.find(c => c.id == slot.classId) : null;
                                const activityInfo = slot.activityType ? this.getActivityTypeIcon(slot.activityType) : null;
                                
                                return `
                                    <td class="schedule-slot" onclick="app.showScheduleSlotEditor(new Date('${date.toISOString()}'), ${hour})" title="Clicca per modificare">
                                        ${cls ? `<div class="slot-class">${cls.name}</div>` : '<div class="slot-empty">-</div>'}
                                        ${activityInfo ? `<div class="slot-activity" style="background-color: ${activityInfo.color}; color: white; display: inline-block; padding: 2px 8px; border-radius: 3px; font-weight: bold; margin-top: 3px;">${activityInfo.icon}</div>` : ''}
                                        ${cls ? `<button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); app.launchScheduleActivity(new Date('${date.toISOString()}'), ${hour})" style="margin-top: 5px; font-size: 0.7em; padding: 2px 6px;">Avvia</button>` : ''}
                                    </td>
                                `;
                            }).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    // Class Management methods
    showAddClassForm() {
        document.getElementById('add-class-form').style.display = 'block';
        document.getElementById('class-form-title').textContent = 'Nuova Classe';
        document.getElementById('class-edit-id').value = '';
    }

    hideAddClassForm() {
        document.getElementById('add-class-form').style.display = 'none';
        document.getElementById('class-form').reset();
        document.getElementById('class-edit-id').value = '';
    }

    saveClass() {
        const editId = document.getElementById('class-edit-id').value;
        const className = document.getElementById('class-name').value.trim();
        const year = document.getElementById('class-year').value;
        const section = document.getElementById('class-section').value.trim();
        const studentsCount = document.getElementById('class-students-count').value;

        if (!className) {
            alert('Il nome della classe è obbligatorio');
            return;
        }

        if (editId) {
            // Edit existing class
            const classIndex = this.classes.findIndex(c => c.id === parseInt(editId));
            if (classIndex !== -1) {
                this.classes[classIndex] = {
                    ...this.classes[classIndex],
                    name: className,
                    year: year,
                    section: section,
                    studentsCount: studentsCount ? parseInt(studentsCount) : 0,
                    updatedAt: new Date().toISOString()
                };
            }
        } else {
            // Add new class
            const newClass = {
                id: Date.now(),
                name: className,
                year: year,
                section: section,
                studentsCount: studentsCount ? parseInt(studentsCount) : 0,
                createdAt: new Date().toISOString()
            };
            this.classes.push(newClass);
        }

        this.saveData();
        this.renderClasses();
        this.updateClassSelectors();
        this.hideAddClassForm();
    }

    editClass(id) {
        const classToEdit = this.classes.find(c => c.id === id);
        if (!classToEdit) return;

        document.getElementById('add-class-form').style.display = 'block';
        document.getElementById('class-form-title').textContent = 'Modifica Classe';
        document.getElementById('class-edit-id').value = classToEdit.id;
        document.getElementById('class-name').value = classToEdit.name;
        document.getElementById('class-year').value = classToEdit.year || '';
        document.getElementById('class-section').value = classToEdit.section || '';
        document.getElementById('class-students-count').value = classToEdit.studentsCount || '';

        // Scroll to form
        document.getElementById('add-class-form').scrollIntoView({ behavior: 'smooth' });
    }

    deleteClass(id) {
        const classToDelete = this.classes.find(c => c.id === id);
        if (!classToDelete) return;

        if (confirm(`Sei sicuro di voler eliminare la classe ${classToDelete.name}?`)) {
            this.classes = this.classes.filter(c => c.id !== id);
            
            // If this was the active class, clear it
            if (this.activeClass === classToDelete.name) {
                this.activeClass = '';
                localStorage.removeItem('active-class');
            }

            this.saveData();
            this.renderClasses();
            this.updateClassSelectors();
            this.renderDashboard();
        }
    }

    renderClasses() {
        const classesList = document.getElementById('classes-list');
        
        if (!classesList) return;

        if (this.classes.length === 0) {
            classesList.innerHTML = `
                <div class="empty-state">
                    <h3>Nessuna classe configurata</h3>
                    <p>Inizia aggiungendo le tue classi per organizzare al meglio la didattica</p>
                </div>
            `;
            return;
        }

        classesList.innerHTML = this.classes
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(cls => `
                <div class="class-item">
                    <h4>${cls.name}</h4>
                    ${cls.year ? `<p><strong>Anno:</strong> ${cls.year}°</p>` : ''}
                    ${cls.section ? `<p><strong>Sezione:</strong> ${cls.section}</p>` : ''}
                    <p><strong>Studenti:</strong> ${cls.studentsCount || 0}</p>
                    <div class="item-actions">
                        <button class="btn btn-secondary" onclick="app.editClass(${cls.id})">Modifica</button>
                        <button class="btn btn-danger" onclick="app.deleteClass(${cls.id})">Elimina</button>
                    </div>
                </div>
            `).join('');
    }

    updateClassSelectors() {
        const selector = document.getElementById('active-class-selector');
        if (!selector) return;

        const currentValue = selector.value;
        
        // Clear and rebuild options
        selector.innerHTML = '<option value="">Seleziona una classe</option>';
        
        this.classes
            .sort((a, b) => a.name.localeCompare(b.name))
            .forEach(cls => {
                const option = document.createElement('option');
                option.value = cls.name;
                option.textContent = cls.name;
                selector.appendChild(option);
            });

        // Restore selection if it still exists
        if (currentValue && this.classes.some(c => c.name === currentValue)) {
            selector.value = currentValue;
        } else if (this.activeClass && this.classes.some(c => c.name === this.activeClass)) {
            selector.value = this.activeClass;
        }
    }

    // Evaluation Management methods
    showAddCriterionForm() {
        document.getElementById('add-criterion-form').style.display = 'block';
    }

    hideAddCriterionForm() {
        document.getElementById('add-criterion-form').style.display = 'none';
        document.getElementById('criterion-form').reset();
    }

    addCriterion() {
        const name = document.getElementById('criterion-name').value;
        const description = document.getElementById('criterion-description').value;
        const subject = document.getElementById('criterion-subject').value;
        const type = document.getElementById('criterion-type').value;

        if (!name) {
            alert('Inserisci un nome per il criterio');
            return;
        }

        const criterion = {
            id: Date.now(),
            name,
            description,
            subject,
            type,
            createdAt: new Date().toISOString()
        };

        this.evaluationCriteria.push(criterion);
        this.saveData();
        this.renderEvaluations();
        this.hideAddCriterionForm();
    }

    deleteCriterion(id) {
        if (confirm('Sei sicuro di voler eliminare questo criterio?')) {
            this.evaluationCriteria = this.evaluationCriteria.filter(c => c.id !== id);
            this.saveData();
            this.renderEvaluations();
        }
    }

    showAddGridForm() {
        document.getElementById('add-grid-form').style.display = 'block';
    }

    hideAddGridForm() {
        document.getElementById('add-grid-form').style.display = 'none';
        document.getElementById('grid-form').reset();
    }

    addGrid() {
        const name = document.getElementById('grid-name').value;
        const description = document.getElementById('grid-description').value;
        const subject = document.getElementById('grid-subject').value;

        if (!name) {
            alert('Inserisci un nome per la griglia');
            return;
        }

        const grid = {
            id: Date.now(),
            name,
            description,
            subject,
            levels: [
                { name: 'Eccellente', score: 10, description: 'Prestazione eccellente' },
                { name: 'Buono', score: 8, description: 'Prestazione buona' },
                { name: 'Sufficiente', score: 6, description: 'Prestazione sufficiente' },
                { name: 'Insufficiente', score: 4, description: 'Prestazione insufficiente' }
            ],
            createdAt: new Date().toISOString()
        };

        this.evaluationGrids.push(grid);
        this.saveData();
        this.renderEvaluations();
        this.hideAddGridForm();
    }

    deleteGrid(id) {
        if (confirm('Sei sicuro di voler eliminare questa griglia?')) {
            this.evaluationGrids = this.evaluationGrids.filter(g => g.id !== id);
            this.saveData();
            this.renderEvaluations();
        }
    }

    showAddEvaluationForm() {
        document.getElementById('add-evaluation-form').style.display = 'block';
        this.updateEvaluationFormSelectors();
        // Set today's date as default
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('evaluation-date').value = today;
    }

    hideAddEvaluationForm() {
        document.getElementById('add-evaluation-form').style.display = 'none';
        document.getElementById('evaluation-form').reset();
    }

    updateEvaluationFormSelectors() {
        // Update student selector
        const studentSelect = document.getElementById('evaluation-student');
        if (studentSelect) {
            studentSelect.innerHTML = '<option value="">Seleziona studente</option>';
            this.students.forEach(student => {
                const option = document.createElement('option');
                option.value = student.id;
                option.textContent = student.name;
                studentSelect.appendChild(option);
            });
        }

        // Update class selector
        const classSelect = document.getElementById('evaluation-class');
        if (classSelect) {
            classSelect.innerHTML = '<option value="">Seleziona classe</option>';
            this.classes.forEach(cls => {
                const option = document.createElement('option');
                option.value = cls.id;
                option.textContent = cls.name;
                classSelect.appendChild(option);
            });
        }

        // Update criterion selector
        const criterionSelect = document.getElementById('evaluation-criterion');
        if (criterionSelect) {
            criterionSelect.innerHTML = '<option value="">Seleziona criterio</option>';
            this.evaluationCriteria.forEach(criterion => {
                const option = document.createElement('option');
                option.value = criterion.id;
                option.textContent = criterion.name;
                criterionSelect.appendChild(option);
            });
        }

        // Update grid selector
        const gridSelect = document.getElementById('evaluation-grid');
        if (gridSelect) {
            gridSelect.innerHTML = '<option value="">Seleziona griglia</option>';
            this.evaluationGrids.forEach(grid => {
                const option = document.createElement('option');
                option.value = grid.id;
                option.textContent = grid.name;
                gridSelect.appendChild(option);
            });
        }

        // Update subject selector
        const subjectSelect = document.getElementById('evaluation-subject');
        if (subjectSelect) {
            subjectSelect.innerHTML = '<option value="">Seleziona disciplina</option>';
            this.subjects.forEach(subject => {
                const option = document.createElement('option');
                option.value = subject;
                option.textContent = subject;
                subjectSelect.appendChild(option);
            });
        }
    }

    addEvaluation() {
        const studentId = document.getElementById('evaluation-student').value;
        const classId = document.getElementById('evaluation-class').value;
        const criterionId = document.getElementById('evaluation-criterion').value;
        const gridId = document.getElementById('evaluation-grid').value;
        const subjectId = document.getElementById('evaluation-subject').value;
        const score = document.getElementById('evaluation-score').value;
        const notes = document.getElementById('evaluation-notes').value;
        const date = document.getElementById('evaluation-date').value;

        if (!studentId && !classId) {
            alert('Seleziona uno studente o una classe');
            return;
        }

        if (!criterionId && !gridId) {
            alert('Seleziona un criterio o una griglia di valutazione');
            return;
        }

        const evaluation = {
            id: Date.now(),
            studentId: studentId || null,
            classId: classId || null,
            criterionId: criterionId || null,
            gridId: gridId || null,
            subjectId: subjectId || null,
            score: score || null,
            notes,
            date: date || new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString()
        };

        this.evaluations.push(evaluation);
        this.saveData();
        this.renderEvaluations();
        this.renderDashboard();
        this.hideAddEvaluationForm();
    }

    deleteEvaluation(id) {
        if (confirm('Sei sicuro di voler eliminare questa valutazione?')) {
            this.evaluations = this.evaluations.filter(e => e.id !== id);
            this.saveData();
            this.renderEvaluations();
            this.renderDashboard();
        }
    }

    renderEvaluations() {
        // Render criteria list
        const criteriaList = document.getElementById('criteria-list');
        if (criteriaList) {
            if (this.evaluationCriteria.length === 0) {
                criteriaList.innerHTML = '<p class="empty-state">Nessun criterio di valutazione. Creane uno!</p>';
            } else {
                criteriaList.innerHTML = this.evaluationCriteria.map(criterion => `
                    <div class="card evaluation-item">
                        <h4>${criterion.name}</h4>
                        <p><strong>Tipo:</strong> ${criterion.type || 'Non specificato'}</p>
                        <p><strong>Disciplina:</strong> ${criterion.subject || 'Non specificata'}</p>
                        <p>${criterion.description || ''}</p>
                        <div class="evaluation-actions">
                            <button class="btn btn-danger" onclick="app.deleteCriterion(${criterion.id})">Elimina</button>
                        </div>
                    </div>
                `).join('');
            }
        }

        // Render grids list
        const gridsList = document.getElementById('grids-list');
        if (gridsList) {
            if (this.evaluationGrids.length === 0) {
                gridsList.innerHTML = '<p class="empty-state">Nessuna griglia di valutazione. Creane una!</p>';
            } else {
                gridsList.innerHTML = this.evaluationGrids.map(grid => `
                    <div class="card evaluation-item">
                        <h4>${grid.name}</h4>
                        <p><strong>Disciplina:</strong> ${grid.subject || 'Non specificata'}</p>
                        <p>${grid.description || ''}</p>
                        <div class="grid-levels">
                            <strong>Livelli:</strong>
                            ${grid.levels.map(level => `
                                <div class="level-item">
                                    <span class="level-name">${level.name}</span>
                                    <span class="level-score">${level.score}/10</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="evaluation-actions">
                            <button class="btn btn-danger" onclick="app.deleteGrid(${grid.id})">Elimina</button>
                        </div>
                    </div>
                `).join('');
            }
        }

        // Render evaluations list
        const evaluationsList = document.getElementById('evaluations-list');
        if (evaluationsList) {
            if (this.evaluations.length === 0) {
                evaluationsList.innerHTML = '<p class="empty-state">Nessuna valutazione registrata.</p>';
            } else {
                evaluationsList.innerHTML = this.evaluations.map(evaluation => {
                    const student = this.students.find(s => s.id == evaluation.studentId);
                    const cls = this.classes.find(c => c.id == evaluation.classId);
                    const criterion = this.evaluationCriteria.find(c => c.id == evaluation.criterionId);
                    const grid = this.evaluationGrids.find(g => g.id == evaluation.gridId);

                    return `
                        <div class="card evaluation-item">
                            <div class="evaluation-header">
                                <h4>${student ? student.name : (cls ? 'Classe: ' + cls.name : 'N/D')}</h4>
                                <span class="evaluation-date">${evaluation.date}</span>
                            </div>
                            <p><strong>Criterio/Griglia:</strong> ${criterion ? criterion.name : (grid ? grid.name : 'N/D')}</p>
                            ${evaluation.subjectId ? `<p><strong>Disciplina:</strong> ${evaluation.subjectId}</p>` : ''}
                            ${evaluation.score ? `<p><strong>Voto:</strong> ${evaluation.score}/10</p>` : ''}
                            ${evaluation.notes ? `<p><strong>Note:</strong> ${evaluation.notes}</p>` : ''}
                            <div class="evaluation-actions">
                                <button class="btn btn-danger" onclick="app.deleteEvaluation(${evaluation.id})">Elimina</button>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }

        // Initialize results filters
        this.initializeResultsFilters();
        // Render results view
        this.renderResults();
    }


    initializeResultsFilters() {
        // Populate filter selectors
        const filterClass = document.getElementById('filter-class');
        if (filterClass) {
            filterClass.innerHTML = '<option value="">Tutte le classi</option>';
            this.classes.forEach(cls => {
                const option = document.createElement('option');
                option.value = cls.id;
                option.textContent = cls.name;
                filterClass.appendChild(option);
            });
        }

        const filterSubject = document.getElementById('filter-subject');
        if (filterSubject) {
            filterSubject.innerHTML = '<option value="">Tutte le discipline</option>';
            
            // Get unique subjects from evaluations and this.subjects
            const allSubjects = new Set();
            this.subjects.forEach(s => allSubjects.add(s));
            this.evaluations.forEach(e => {
                if (e.subjectId) allSubjects.add(e.subjectId);
            });
            
            Array.from(allSubjects).sort().forEach(subject => {
                const option = document.createElement('option');
                option.value = subject;
                option.textContent = subject;
                filterSubject.appendChild(option);
            });
        }

        const filterStudent = document.getElementById('filter-student');
        if (filterStudent) {
            filterStudent.innerHTML = '<option value="">Tutti gli studenti</option>';
            this.students.forEach(student => {
                const option = document.createElement('option');
                option.value = student.id;
                option.textContent = student.name;
                filterStudent.appendChild(option);
            });
        }
    }

    filterResults() {
        this.renderResults();
    }

    toggleResultsView() {
        const viewMode = localStorage.getItem('results-view-mode') || 'by-student';
        const newMode = viewMode === 'by-student' ? 'by-class' : 'by-student';
        localStorage.setItem('results-view-mode', newMode);
        this.renderResults();
    }

    renderResults() {
        const resultsDisplay = document.getElementById('results-display');
        if (!resultsDisplay) return;

        const filterClassId = document.getElementById('filter-class')?.value || '';
        const filterSubject = document.getElementById('filter-subject')?.value || '';
        const filterStudentId = document.getElementById('filter-student')?.value || '';

        // Filter evaluations
        let filteredEvaluations = this.evaluations.filter(evaluation => {
            if (filterClassId) {
                let matchesClass = false;
                
                // Check if evaluation is for the class directly
                if (evaluation.classId == filterClassId) {
                    matchesClass = true;
                }
                // Or if evaluation is for a student in the class
                else if (evaluation.studentId) {
                    const student = this.students.find(s => s.id == evaluation.studentId);
                    const cls = this.classes.find(c => c.id == filterClassId);
                    if (student && cls && student.class === cls.name) {
                        matchesClass = true;
                    }
                }
                
                if (!matchesClass) return false;
            }
            if (filterSubject && evaluation.subjectId != filterSubject) return false;
            if (filterStudentId && evaluation.studentId != filterStudentId) return false;
            return true;
        });

        const viewMode = localStorage.getItem('results-view-mode') || 'by-student';

        if (filteredEvaluations.length === 0) {
            resultsDisplay.innerHTML = '<p class="empty-state">Nessuna valutazione corrisponde ai filtri selezionati.</p>';
            return;
        }

        if (viewMode === 'by-student') {
            this.renderResultsByStudent(resultsDisplay, filteredEvaluations);
        } else {
            this.renderResultsByClass(resultsDisplay, filteredEvaluations);
        }
    }

    renderResultsByStudent(container, evaluations) {
        const studentGroups = {};
        
        evaluations.forEach(evaluation => {
            if (evaluation.studentId) {
                if (!studentGroups[evaluation.studentId]) {
                    studentGroups[evaluation.studentId] = [];
                }
                studentGroups[evaluation.studentId].push(evaluation);
            }
        });

        let html = '<h4>📊 Risultati per Studente</h4>';
        
        Object.keys(studentGroups).forEach(studentId => {
            const student = this.students.find(s => s.id == studentId);
            const studentEvaluations = studentGroups[studentId];
            const avgScore = this.calculateAverageScore(studentEvaluations);
            
            html += `
                <div class="card student-results">
                    <div class="student-results-header">
                        <h5>${student ? student.name : 'Studente sconosciuto'}</h5>
                        ${avgScore !== null ? `<span class="avg-score">Media: ${avgScore.toFixed(2)}/10</span>` : ''}
                    </div>
                    <div class="student-evaluations">
                        ${studentEvaluations.map(evaluation => {
                            const criterion = this.evaluationCriteria.find(c => c.id == evaluation.criterionId);
                            const grid = this.evaluationGrids.find(g => g.id == evaluation.gridId);
                            return `
                                <div class="evaluation-row">
                                    <span class="eval-date">${evaluation.date}</span>
                                    <span class="eval-criterion">${criterion ? criterion.name : (grid ? grid.name : 'N/D')}</span>
                                    ${evaluation.subjectId ? `<span class="eval-subject">${evaluation.subjectId}</span>` : ''}
                                    ${evaluation.score ? `<span class="eval-score">${evaluation.score}/10</span>` : '<span class="eval-score">-</span>'}
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    renderResultsByClass(container, evaluations) {
        const classGroups = {};
        
        evaluations.forEach(evaluation => {
            let className = null;
            
            // Get class from evaluation or from student
            if (evaluation.classId) {
                const cls = this.classes.find(c => c.id == evaluation.classId);
                className = cls ? cls.name : null;
            } else if (evaluation.studentId) {
                const student = this.students.find(s => s.id == evaluation.studentId);
                className = student ? student.class : null;
            }
            
            if (className) {
                if (!classGroups[className]) {
                    classGroups[className] = [];
                }
                classGroups[className].push(evaluation);
            }
        });

        let html = '<h4>📊 Risultati Aggregati per Classe</h4>';
        
        Object.keys(classGroups).forEach(className => {
            const classEvaluations = classGroups[className];
            const avgScore = this.calculateAverageScore(classEvaluations);
            const subjectStats = this.calculateSubjectStats(classEvaluations);
            
            html += `
                <div class="card class-results">
                    <div class="class-results-header">
                        <h5>${className}</h5>
                        ${avgScore !== null ? `<span class="avg-score">Media Generale: ${avgScore.toFixed(2)}/10</span>` : ''}
                    </div>
                    <div class="class-stats">
                        <p><strong>Totale Valutazioni:</strong> ${classEvaluations.length}</p>
                        ${subjectStats ? `
                            <div class="subject-stats">
                                <strong>Medie per Disciplina:</strong>
                                ${Object.keys(subjectStats).map(subject => `
                                    <div class="subject-stat-row">
                                        <span>${subject}</span>
                                        <span>${subjectStats[subject].avg.toFixed(2)}/10 (${subjectStats[subject].count} valutazioni)</span>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    calculateAverageScore(evaluations) {
        const scored = evaluations.filter(e => e.score !== null && e.score !== '');
        if (scored.length === 0) return null;
        const sum = scored.reduce((acc, e) => acc + parseFloat(e.score), 0);
        return sum / scored.length;
    }

    calculateSubjectStats(evaluations) {
        const stats = {};
        
        evaluations.forEach(evaluation => {
            if (evaluation.subjectId && evaluation.score) {
                if (!stats[evaluation.subjectId]) {
                    stats[evaluation.subjectId] = { sum: 0, count: 0 };
                }
                stats[evaluation.subjectId].sum += parseFloat(evaluation.score);
                stats[evaluation.subjectId].count++;
            }
        });

        Object.keys(stats).forEach(subject => {
            stats[subject].avg = stats[subject].sum / stats[subject].count;
        });

        return Object.keys(stats).length > 0 ? stats : null;
    }

    async generateCriteriaWithAI() {
        const subject = prompt('Per quale disciplina vuoi generare i criteri di valutazione?');
        if (!subject) return;

        const topic = prompt('Quale argomento o competenza vuoi valutare?');
        if (!topic) return;

        const apiKey = localStorage.getItem('openrouter-api-key');
        if (!apiKey) {
            alert('Configura la tua API Key di OpenRouter nelle impostazioni prima di usare questa funzione');
            return;
        }

        const loadingMsg = document.getElementById('chat-messages');
        if (loadingMsg) {
            const tempDiv = document.createElement('div');
            tempDiv.className = 'message assistant-message';
            tempDiv.textContent = '🤖 Generazione criteri di valutazione in corso...';
            loadingMsg.appendChild(tempDiv);
            loadingMsg.scrollTop = loadingMsg.scrollHeight;
        }

        try {
            const modelId = localStorage.getItem('openrouter-model-id') || 'alibaba/tongyi-deepresearch-30b-a3b';
            const response = await this.callOpenRouterAPI(
                `Genera 4-6 criteri di valutazione dettagliati per la disciplina "${subject}" sull'argomento "${topic}". 
                Per ogni criterio fornisci:
                - Nome del criterio
                - Descrizione dettagliata
                - Tipo (es. conoscenza, competenza, abilità)
                
                Rispondi in formato JSON array con questa struttura:
                [{"name": "...", "description": "...", "type": "..."}]`,
                apiKey,
                modelId
            );

            if (response && response.content) {
                try {
                    const jsonMatch = response.content.match(/\[[\s\S]*\]/);
                    if (jsonMatch) {
                        const criteria = JSON.parse(jsonMatch[0]);
                        
                        criteria.forEach(c => {
                            this.evaluationCriteria.push({
                                id: Date.now() + Math.random(),
                                name: c.name,
                                description: c.description,
                                subject: subject,
                                type: c.type,
                                createdAt: new Date().toISOString()
                            });
                        });

                        this.saveData();
                        this.renderEvaluations();
                        alert(`${criteria.length} criteri di valutazione generati con successo!`);
                    }
                } catch (e) {
                    console.error('Error parsing AI response:', e);
                    alert('Errore nella generazione dei criteri. Riprova.');
                }
            }
        } catch (error) {
            console.error('Error generating criteria:', error);
            alert('Errore nella generazione dei criteri');
        }
    }

    // AI Assistant methods
    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
            const displayElement = document.getElementById('selected-file-display');
            displayElement.innerHTML = `
                <div class="file-info">
                    <span class="file-name">📄 ${file.name} (${this.formatFileSize(file.size)})</span>
                    <button class="remove-file-btn" onclick="app.clearSelectedFile()">Rimuovi</button>
                </div>
            `;
            displayElement.classList.add('active');
        }
    }

    clearSelectedFile() {
        this.selectedFile = null;
        const fileInput = document.getElementById('ai-file-input');
        if (fileInput) {
            fileInput.value = '';
        }
        const displayElement = document.getElementById('selected-file-display');
        if (displayElement) {
            displayElement.innerHTML = '';
            displayElement.classList.remove('active');
        }
    }

    formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    async sendAIMessage() {
        const input = document.getElementById('ai-input');
        const message = input.value.trim();
        
        if (!message && !this.selectedFile) return;

        const apiKey = localStorage.getItem('openrouter-api-key');
        
        if (!apiKey) {
            alert('Configura la tua API key di OpenRouter nelle impostazioni prima di usare l\'IA');
            this.switchTab('settings');
            return;
        }

        // Build user message with context
        let userMessage = message;
        if (this.activeClass) {
            userMessage = `[Classe: ${this.activeClass}] ${message}`;
        }

        this.addChatMessage('user', message);
        
        // Handle file upload
        if (this.selectedFile) {
            const fileInfo = `📎 File allegato: ${this.selectedFile.name}`;
            this.addChatMessage('system', fileInfo);
            
            // Check if file is supported (basic check - most models don't support file uploads via this API)
            this.addChatMessage('system', 'Nota: Il file è stato selezionato, ma la maggior parte dei modelli OpenRouter non supporta l\'upload diretto di file. Il file verrà ignorato in questa richiesta.');
            
            // Clear the selected file after attempting to send
            this.clearSelectedFile();
        }
        
        input.value = '';

        try {
            const response = await this.callOpenRouterAPI(userMessage, apiKey);
            
            if (response && response.content) {
                this.addChatMessage('ai', response.content);
            }
        } catch (error) {
            console.error('Error calling AI:', error);
            this.addChatMessage('system', `Errore: ${error.message}`);
        }
    }

    quickAIPrompt(prompt) {
        document.getElementById('ai-input').value = prompt;
        this.switchTab('ai-assistant');
    }

    addChatMessage(type, content) {
        const messagesContainer = document.getElementById('chat-messages');
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = content;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        this.chatMessages.push({ type, content, timestamp: new Date().toISOString() });
    }

    async callOpenRouterAPI(prompt, apiKey) {
        const modelId = localStorage.getItem('openrouter-model-id') || 'alibaba/tongyi-deepresearch-30b-a3b';
        
        // Build system message with context
        let systemMessage = 'Sei un assistente IA specializzato nell\'aiutare gli insegnanti con la pianificazione didattica, la creazione di materiali educativi e la gestione della classe. Rispondi sempre in italiano in modo chiaro e professionale.';
        
        if (this.activeClass) {
            systemMessage += ` L'insegnante sta lavorando con la classe ${this.activeClass}.`;
        }
        
        const schoolYear = localStorage.getItem('school-year');
        if (schoolYear) {
            systemMessage += ` Anno scolastico: ${schoolYear}.`;
        }
        
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: modelId,
                messages: [
                    {
                        role: 'system',
                        content: systemMessage
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.choices && data.choices.length > 0) {
            return {
                content: data.choices[0].message.content
            };
        }

        throw new Error('No response from AI');
    }

    // Settings methods
    saveSettings() {
        const apiKey = document.getElementById('openrouter-api-key').value;
        const modelId = document.getElementById('openrouter-model-id').value;
        const firstName = document.getElementById('teacher-first-name').value;
        const lastName = document.getElementById('teacher-last-name').value;
        const email = document.getElementById('teacher-email').value;
        const schoolLevel = document.getElementById('school-level').value;
        const schoolName = document.getElementById('school-name').value;
        const schoolYear = document.getElementById('school-year').value;
        const yearStart = document.getElementById('school-year-start').value;
        const yearEnd = document.getElementById('school-year-end').value;

        if (apiKey) {
            localStorage.setItem('openrouter-api-key', apiKey);
        }
        if (modelId) {
            localStorage.setItem('openrouter-model-id', modelId);
        }
        if (firstName) {
            localStorage.setItem('teacher-first-name', firstName);
        }
        if (lastName) {
            localStorage.setItem('teacher-last-name', lastName);
        }
        if (email) {
            localStorage.setItem('teacher-email', email);
        }
        if (schoolLevel) {
            localStorage.setItem('school-level', schoolLevel);
        }
        if (schoolName) {
            localStorage.setItem('school-name', schoolName);
        }
        if (schoolYear) {
            localStorage.setItem('school-year', schoolYear);
        }
        if (yearStart) {
            localStorage.setItem('school-year-start', yearStart);
        }
        if (yearEnd) {
            localStorage.setItem('school-year-end', yearEnd);
        }

        // Save subjects
        localStorage.setItem('teacher-subjects', JSON.stringify(this.subjects));

        this.renderDashboard();
        alert('Impostazioni salvate con successo!');
    }

    loadSettings() {
        const apiKey = localStorage.getItem('openrouter-api-key');
        const modelId = localStorage.getItem('openrouter-model-id');
        const firstName = localStorage.getItem('teacher-first-name');
        const lastName = localStorage.getItem('teacher-last-name');
        const email = localStorage.getItem('teacher-email');
        const schoolLevel = localStorage.getItem('school-level');
        const schoolName = localStorage.getItem('school-name');
        const schoolYear = localStorage.getItem('school-year');
        const yearStart = localStorage.getItem('school-year-start');
        const yearEnd = localStorage.getItem('school-year-end');
        const subjectsData = localStorage.getItem('teacher-subjects');

        if (apiKey) {
            document.getElementById('openrouter-api-key').value = apiKey;
        }
        if (modelId) {
            document.getElementById('openrouter-model-id').value = modelId;
        }
        if (firstName) {
            const firstNameInput = document.getElementById('teacher-first-name');
            if (firstNameInput) firstNameInput.value = firstName;
        }
        if (lastName) {
            const lastNameInput = document.getElementById('teacher-last-name');
            if (lastNameInput) lastNameInput.value = lastName;
        }
        if (email) {
            const emailInput = document.getElementById('teacher-email');
            if (emailInput) emailInput.value = email;
        }
        if (schoolLevel) {
            const schoolLevelInput = document.getElementById('school-level');
            if (schoolLevelInput) schoolLevelInput.value = schoolLevel;
        }
        if (schoolName) {
            document.getElementById('school-name').value = schoolName;
        }
        if (schoolYear) {
            document.getElementById('school-year').value = schoolYear;
        }
        if (yearStart) {
            const yearStartInput = document.getElementById('school-year-start');
            if (yearStartInput) yearStartInput.value = yearStart;
        }
        if (yearEnd) {
            const yearEndInput = document.getElementById('school-year-end');
            if (yearEndInput) yearEndInput.value = yearEnd;
        }

        // Load subjects
        if (subjectsData) {
            try {
                this.subjects = JSON.parse(subjectsData);
                this.renderAllSubjects();
            } catch (e) {
                console.error('Error loading subjects:', e);
                this.subjects = [];
            }
        }

        // Initialize API key status icon
        const statusIcon = document.getElementById('api-key-status');
        if (statusIcon) {
            statusIcon.textContent = '⚪';
            statusIcon.className = 'api-key-status';
            statusIcon.title = 'Non verificata';
        }
    }

    async verifyAPIKey() {
        const apiKeyInput = document.getElementById('openrouter-api-key');
        const statusIcon = document.getElementById('api-key-status');
        const apiKey = apiKeyInput.value.trim();

        if (!apiKey) {
            alert('Inserisci una API key prima di verificarla');
            return;
        }

        const modelId = document.getElementById('openrouter-model-id').value.trim() || 'alibaba/tongyi-deepresearch-30b-a3b';

        // Update status to show verification in progress
        statusIcon.textContent = '⏳';
        statusIcon.className = 'api-key-status';
        statusIcon.title = 'Verifica in corso...';

        try {
            // Make a minimal test call to OpenRouter API
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: modelId,
                    messages: [
                        {
                            role: 'user',
                            content: 'test'
                        }
                    ],
                    max_tokens: 5
                })
            });

            if (response.ok) {
                // API key is valid
                statusIcon.textContent = '✅';
                statusIcon.className = 'api-key-status verified';
                statusIcon.title = 'API Key valida';
                alert(`✅ API Key verificata con successo!\n\nLa chiave API è valida e funzionante.\nModello verificato: ${modelId}`);
            } else {
                // API key is invalid
                const errorData = await response.json().catch(() => ({}));
                statusIcon.textContent = '❌';
                statusIcon.className = 'api-key-status invalid';
                statusIcon.title = 'API Key non valida';
                alert(`❌ Verifica fallita!\n\nLa chiave API non è valida.\nErrore: ${response.status} ${response.statusText}\n\n${errorData.error?.message || 'Verifica che la chiave sia corretta.'}`);
            }
        } catch (error) {
            // Network or other error
            statusIcon.textContent = '❌';
            statusIcon.className = 'api-key-status invalid';
            statusIcon.title = 'Errore di verifica';
            alert(`❌ Errore durante la verifica!\n\n${error.message}\n\nVerifica la tua connessione internet e riprova.`);
        }
    }

    // Data persistence methods
    saveData() {
        localStorage.setItem('docente-plus-lessons', JSON.stringify(this.lessons));
        localStorage.setItem('docente-plus-students', JSON.stringify(this.students));
        localStorage.setItem('docente-plus-classes', JSON.stringify(this.classes));
        localStorage.setItem('docente-plus-evaluation-criteria', JSON.stringify(this.evaluationCriteria));
        localStorage.setItem('docente-plus-evaluation-grids', JSON.stringify(this.evaluationGrids));
        localStorage.setItem('docente-plus-evaluations', JSON.stringify(this.evaluations));
        localStorage.setItem('docente-plus-notifications', JSON.stringify(this.notifications));
        localStorage.setItem('docente-plus-reminders', JSON.stringify(this.reminders));
        localStorage.setItem('docente-plus-notification-settings', JSON.stringify(this.notificationSettings));
        localStorage.setItem('docente-plus-activities', JSON.stringify(this.activities));
        localStorage.setItem('docente-plus-schedule', JSON.stringify(this.schedule));
        localStorage.setItem('docente-plus-rss-feeds', JSON.stringify(this.rssFeeds));
        localStorage.setItem('docente-plus-news-items', JSON.stringify(this.newsItems));
    }

    loadData() {
        const lessonsData = localStorage.getItem('docente-plus-lessons');
        const studentsData = localStorage.getItem('docente-plus-students');
        const classesData = localStorage.getItem('docente-plus-classes');
        const evaluationCriteriaData = localStorage.getItem('docente-plus-evaluation-criteria');
        const evaluationGridsData = localStorage.getItem('docente-plus-evaluation-grids');
        const evaluationsData = localStorage.getItem('docente-plus-evaluations');

        if (lessonsData) {
            try {
                this.lessons = JSON.parse(lessonsData);
            } catch (e) {
                console.error('Error loading lessons:', e);
                this.lessons = [];
            }
        }

        if (studentsData) {
            try {
                this.students = JSON.parse(studentsData);
            } catch (e) {
                console.error('Error loading students:', e);
                this.students = [];
            }
        }

        if (classesData) {
            try {
                this.classes = JSON.parse(classesData);
            } catch (e) {
                console.error('Error loading classes:', e);
                this.classes = [];
            }
        }

        if (evaluationCriteriaData) {
            try {
                this.evaluationCriteria = JSON.parse(evaluationCriteriaData);
            } catch (e) {
                console.error('Error loading evaluation criteria:', e);
                this.evaluationCriteria = [];
            }
        }

        if (evaluationGridsData) {
            try {
                this.evaluationGrids = JSON.parse(evaluationGridsData);
            } catch (e) {
                console.error('Error loading evaluation grids:', e);
                this.evaluationGrids = [];
            }
        }

        if (evaluationsData) {
            try {
                this.evaluations = JSON.parse(evaluationsData);
            } catch (e) {
                console.error('Error loading evaluations:', e);
                this.evaluations = [];
            }
        }

        // Load notifications
        const notificationsData = localStorage.getItem('docente-plus-notifications');
        if (notificationsData) {
            try {
                this.notifications = JSON.parse(notificationsData);
            } catch (e) {
                console.error('Error loading notifications:', e);
                this.notifications = [];
            }
        }

        // Load reminders
        const remindersData = localStorage.getItem('docente-plus-reminders');
        if (remindersData) {
            try {
                this.reminders = JSON.parse(remindersData);
            } catch (e) {
                console.error('Error loading reminders:', e);
                this.reminders = [];
            }
        }

        // Load notification settings
        const notificationSettingsData = localStorage.getItem('docente-plus-notification-settings');
        if (notificationSettingsData) {
            try {
                this.notificationSettings = JSON.parse(notificationSettingsData);
            } catch (e) {
                console.error('Error loading notification settings:', e);
            }
        }

        // Load activities
        const activitiesData = localStorage.getItem('docente-plus-activities');
        if (activitiesData) {
            try {
                this.activities = JSON.parse(activitiesData);
            } catch (e) {
                console.error('Error loading activities:', e);
                this.activities = [];
            }
        }

        // Load schedule
        const scheduleData = localStorage.getItem('docente-plus-schedule');
        if (scheduleData) {
            try {
                this.schedule = JSON.parse(scheduleData);
            } catch (e) {
                console.error('Error loading schedule:', e);
                this.schedule = {};
            }
        }

        // Load imported documents
        const importedDocsData = localStorage.getItem('imported-documents');
        if (importedDocsData) {
            try {
                this.importedDocuments = JSON.parse(importedDocsData);
            } catch (e) {
                console.error('Error loading imported documents:', e);
                this.importedDocuments = [];
            }
        }

        // Load RSS feeds
        const rssFeedsData = localStorage.getItem('docente-plus-rss-feeds');
        if (rssFeedsData) {
            try {
                this.rssFeeds = JSON.parse(rssFeedsData);
            } catch (e) {
                console.error('Error loading RSS feeds:', e);
                this.rssFeeds = [];
            }
        }

        // Load news items
        const newsItemsData = localStorage.getItem('docente-plus-news-items');
        if (newsItemsData) {
            try {
                this.newsItems = JSON.parse(newsItemsData);
            } catch (e) {
                console.error('Error loading news items:', e);
                this.newsItems = [];
            }
        }
    }

    exportData() {
        // Store the export type and show format selection modal
        this.currentExportType = 'data';
        this.showExportModal();
    }

    exportEvaluations() {
        // Store the export type and show format selection modal
        this.currentExportType = 'evaluations';
        this.showExportModal();
    }

    showExportModal() {
        const modal = document.getElementById('export-format-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    closeExportModal() {
        const modal = document.getElementById('export-format-modal');
        if (modal) {
            modal.style.display = 'none';
        }
        this.currentExportType = null;
    }

    executeExport(format) {
        this.closeExportModal();
        
        if (this.currentExportType === 'data') {
            this.exportDataInFormat(format);
        } else if (this.currentExportType === 'evaluations') {
            this.exportEvaluationsInFormat(format);
        }
    }

    exportDataInFormat(format) {
        const data = {
            lessons: this.lessons,
            students: this.students,
            classes: this.classes,
            subjects: this.subjects,
            activities: this.activities,
            schedule: this.schedule,
            evaluationCriteria: this.evaluationCriteria,
            evaluationGrids: this.evaluationGrids,
            evaluations: this.evaluations,
            notifications: this.notifications,
            reminders: this.reminders,
            notificationSettings: this.notificationSettings,
            teacherProfile: {
                firstName: localStorage.getItem('teacher-first-name'),
                lastName: localStorage.getItem('teacher-last-name'),
                email: localStorage.getItem('teacher-email'),
                schoolLevel: localStorage.getItem('school-level'),
                schoolName: localStorage.getItem('school-name'),
                schoolYear: localStorage.getItem('school-year'),
                schoolYearStart: localStorage.getItem('school-year-start'),
                schoolYearEnd: localStorage.getItem('school-year-end')
            },
            exportDate: new Date().toISOString()
        };

        switch(format) {
            case 'json':
                this.exportAsJSON(data, 'docente-plus-export');
                break;
            case 'pdf':
                this.exportDataAsPDF(data);
                break;
            case 'excel':
                this.exportDataAsExcel(data);
                break;
        }

        // Track backup date
        this.notificationSettings.lastBackupDate = new Date().toISOString();
        this.saveData();

        // Create backup notification
        this.createNotification({
            title: '✅ Backup Completato',
            message: `I tuoi dati sono stati esportati con successo in formato ${format.toUpperCase()}`,
            type: 'system',
            notificationId: `backup-success-${Date.now()}`
        });
    }

    exportEvaluationsInFormat(format) {
        // Calculate statistics for export
        const stats = {
            totalEvaluations: this.evaluations.length,
            totalStudents: new Set(this.evaluations.map(e => e.studentId).filter(id => id)).size,
            totalClasses: new Set(this.evaluations.map(e => e.classId).filter(id => id)).size,
            averageScore: this.calculateAverageScore(this.evaluations),
            evaluationsBySubject: {},
            evaluationsByClass: {}
        };

        // Calculate by subject
        this.subjects.forEach(subject => {
            const subjectEvals = this.evaluations.filter(e => e.subjectId === subject);
            if (subjectEvals.length > 0) {
                stats.evaluationsBySubject[subject] = {
                    count: subjectEvals.length,
                    averageScore: this.calculateAverageScore(subjectEvals)
                };
            }
        });

        // Calculate by class
        this.classes.forEach(cls => {
            const classEvals = this.evaluations.filter(e => e.classId == cls.id);
            if (classEvals.length > 0) {
                stats.evaluationsByClass[cls.name] = {
                    count: classEvals.length,
                    averageScore: this.calculateAverageScore(classEvals)
                };
            }
        });

        const data = {
            evaluationCriteria: this.evaluationCriteria,
            evaluationGrids: this.evaluationGrids,
            evaluations: this.evaluations.map(evaluation => {
                const student = this.students.find(s => s.id == evaluation.studentId);
                const cls = this.classes.find(c => c.id == evaluation.classId);
                const criterion = this.evaluationCriteria.find(c => c.id == evaluation.criterionId);
                const grid = this.evaluationGrids.find(g => g.id == evaluation.gridId);

                return {
                    ...evaluation,
                    studentName: student ? student.name : null,
                    className: cls ? cls.name : null,
                    criterionName: criterion ? criterion.name : null,
                    gridName: grid ? grid.name : null,
                    subjectName: evaluation.subjectId || null
                };
            }),
            statistics: stats,
            exportDate: new Date().toISOString()
        };

        switch(format) {
            case 'json':
                this.exportAsJSON(data, 'valutazioni-export');
                break;
            case 'pdf':
                this.exportEvaluationsAsPDF(data);
                break;
            case 'excel':
                this.exportEvaluationsAsExcel(data);
                break;
        }

        alert(`Valutazioni esportate con successo in formato ${format.toUpperCase()}!`);
    }

    exportAsJSON(data, filename) {
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    }

    exportDataAsPDF(data) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Title
        doc.setFontSize(20);
        doc.text('Docente++ - Export Dati Completo', 14, 20);
        
        // Teacher info
        doc.setFontSize(12);
        doc.text(`Docente: ${data.teacherProfile.firstName} ${data.teacherProfile.lastName}`, 14, 30);
        doc.text(`Scuola: ${data.teacherProfile.schoolName || 'N/D'}`, 14, 37);
        doc.text(`Anno Scolastico: ${data.teacherProfile.schoolYear || 'N/D'}`, 14, 44);
        doc.text(`Data Export: ${new Date(data.exportDate).toLocaleDateString('it-IT')}`, 14, 51);
        
        let yPos = 65;

        // Summary statistics
        doc.setFontSize(14);
        doc.text('Riepilogo', 14, yPos);
        yPos += 10;
        doc.setFontSize(10);
        doc.text(`Lezioni: ${data.lessons.length}`, 14, yPos);
        yPos += 7;
        doc.text(`Studenti: ${data.students.length}`, 14, yPos);
        yPos += 7;
        doc.text(`Classi: ${data.classes.length}`, 14, yPos);
        yPos += 7;
        doc.text(`Discipline: ${data.subjects.length}`, 14, yPos);
        yPos += 7;
        doc.text(`Attività: ${data.activities.length}`, 14, yPos);
        yPos += 7;
        doc.text(`Slot Orario Configurati: ${Object.keys(data.schedule || {}).length}`, 14, yPos);
        yPos += 7;
        doc.text(`Valutazioni: ${data.evaluations.length}`, 14, yPos);
        yPos += 7;
        doc.text(`Criteri di Valutazione: ${data.evaluationCriteria.length}`, 14, yPos);
        yPos += 7;
        doc.text(`Griglie di Valutazione: ${data.evaluationGrids.length}`, 14, yPos);
        yPos += 15;

        // Classes table
        if (data.classes.length > 0) {
            doc.setFontSize(14);
            doc.text('Classi', 14, yPos);
            yPos += 7;
            
            const classesData = data.classes.map(c => [
                c.name,
                c.year || 'N/D',
                c.section || 'N/D',
                c.studentsCount || 0
            ]);
            
            doc.autoTable({
                startY: yPos,
                head: [['Nome', 'Anno', 'Sezione', 'N. Studenti']],
                body: classesData,
                theme: 'grid',
                styles: { fontSize: 9 }
            });
            
            yPos = doc.lastAutoTable.finalY + 10;
        }

        // Students table (if space available)
        if (data.students.length > 0 && yPos < 250) {
            if (yPos > 240) {
                doc.addPage();
                yPos = 20;
            }
            doc.setFontSize(14);
            doc.text('Studenti', 14, yPos);
            yPos += 7;
            
            const studentsData = data.students.slice(0, 20).map(s => {
                const cls = data.classes.find(c => c.id == s.classId);
                return [s.name, cls ? cls.name : 'N/D'];
            });
            
            doc.autoTable({
                startY: yPos,
                head: [['Nome Studente', 'Classe']],
                body: studentsData,
                theme: 'grid',
                styles: { fontSize: 9 }
            });
            
            yPos = doc.lastAutoTable.finalY + 10;
        }

        // Schedule summary
        const scheduleEntries = Object.keys(data.schedule || {}).length;
        if (scheduleEntries > 0) {
            if (yPos > 240) {
                doc.addPage();
                yPos = 20;
            }
            doc.setFontSize(14);
            doc.text('Orario Didattico', 14, yPos);
            yPos += 7;
            
            const scheduleData = Object.entries(data.schedule).map(([key, slot]) => {
                const [dateStr, hour] = key.split('-').slice(0, 2);
                const hourStr = key.split('-')[2];
                const date = new Date(dateStr);
                const dayName = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'][date.getDay()];
                const cls = data.classes.find(c => c.id == slot.classId);
                const activityTypes = { 'theory': 'Teoria', 'drawing': 'Disegno', 'lab': 'Laboratorio' };
                return [
                    `${dayName} ${date.getDate()}/${date.getMonth() + 1}`,
                    `${hourStr}:00`,
                    cls ? cls.name : 'N/D',
                    activityTypes[slot.activityType] || 'N/D'
                ];
            });
            
            doc.autoTable({
                startY: yPos,
                head: [['Giorno', 'Ora', 'Classe', 'Tipo Attività']],
                body: scheduleData,
                theme: 'grid',
                styles: { fontSize: 8 }
            });
            
            yPos = doc.lastAutoTable.finalY + 10;
        }

        // Activities table
        if (data.activities && data.activities.length > 0) {
            if (yPos > 240) {
                doc.addPage();
                yPos = 20;
            }
            doc.setFontSize(14);
            doc.text('Attività Didattiche', 14, yPos);
            yPos += 7;
            
            const activitiesData = data.activities.slice(0, 30).map(a => {
                const cls = data.classes.find(c => c.id == a.classId);
                const statusLabels = {
                    'planned': 'Pianificata',
                    'in-progress': 'In corso',
                    'completed': 'Completata'
                };
                const typeLabels = {
                    'lesson': 'Lezione',
                    'exercise': 'Esercitazione',
                    'lab': 'Laboratorio',
                    'project': 'Progetto',
                    'homework': 'Compiti',
                    'exam': 'Verifica'
                };
                return [
                    a.title || 'N/D',
                    typeLabels[a.type] || a.type || 'N/D',
                    cls ? cls.name : 'Generale',
                    statusLabels[a.status] || a.status || 'N/D',
                    a.deadline ? new Date(a.deadline).toLocaleDateString('it-IT') : '-'
                ];
            });
            
            doc.autoTable({
                startY: yPos,
                head: [['Titolo', 'Tipo', 'Classe', 'Stato', 'Scadenza']],
                body: activitiesData,
                theme: 'striped',
                styles: { fontSize: 8 }
            });
        }

        // Footer with privacy note
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(128);
            doc.text('Documento generato da Docente++ - Dati riservati', 14, 285);
            doc.text(`Pagina ${i} di ${pageCount}`, 170, 285);
        }
        
        doc.save(`docente-plus-export-${new Date().toISOString().split('T')[0]}.pdf`);
    }

    exportEvaluationsAsPDF(data) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Title
        doc.setFontSize(20);
        doc.text('Docente++ - Export Valutazioni', 14, 20);
        
        // Teacher info
        const teacherName = `${localStorage.getItem('teacher-first-name') || ''} ${localStorage.getItem('teacher-last-name') || ''}`.trim();
        doc.setFontSize(12);
        if (teacherName) {
            doc.text(`Docente: ${teacherName}`, 14, 30);
        }
        doc.text(`Data Export: ${new Date(data.exportDate).toLocaleDateString('it-IT')}`, 14, 37);
        
        let yPos = 50;

        // Statistics
        doc.setFontSize(14);
        doc.text('Statistiche', 14, yPos);
        yPos += 10;
        doc.setFontSize(10);
        doc.text(`Totale Valutazioni: ${data.statistics.totalEvaluations}`, 14, yPos);
        yPos += 7;
        doc.text(`Studenti Valutati: ${data.statistics.totalStudents}`, 14, yPos);
        yPos += 7;
        doc.text(`Classi: ${data.statistics.totalClasses}`, 14, yPos);
        yPos += 7;
        doc.text(`Media Generale: ${data.statistics.averageScore ? data.statistics.averageScore.toFixed(2) : 'N/D'}`, 14, yPos);
        yPos += 15;

        // Statistics by subject
        if (Object.keys(data.statistics.evaluationsBySubject).length > 0) {
            doc.setFontSize(14);
            doc.text('Statistiche per Disciplina', 14, yPos);
            yPos += 7;
            
            const subjectData = Object.entries(data.statistics.evaluationsBySubject).map(([subject, stats]) => [
                subject,
                stats.count,
                stats.averageScore ? stats.averageScore.toFixed(2) : 'N/D'
            ]);
            
            doc.autoTable({
                startY: yPos,
                head: [['Disciplina', 'N. Valutazioni', 'Media']],
                body: subjectData,
                theme: 'grid',
                styles: { fontSize: 9 }
            });
            
            yPos = doc.lastAutoTable.finalY + 10;
        }

        // Evaluations table
        if (data.evaluations.length > 0) {
            if (yPos > 240) {
                doc.addPage();
                yPos = 20;
            }
            doc.setFontSize(14);
            doc.text('Valutazioni', 14, yPos);
            yPos += 7;
            
            const evaluationsData = data.evaluations.slice(0, 50).map(e => [
                e.studentName || 'N/D',
                e.className || 'N/D',
                e.subjectName || 'N/D',
                e.score || 'N/D',
                new Date(e.date).toLocaleDateString('it-IT')
            ]);
            
            doc.autoTable({
                startY: yPos,
                head: [['Studente', 'Classe', 'Disciplina', 'Voto', 'Data']],
                body: evaluationsData,
                theme: 'striped',
                styles: { fontSize: 8 }
            });
        }

        // Footer with privacy note
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(128);
            doc.text('Documento generato da Docente++ - Dati riservati e protetti', 14, 285);
            doc.text(`Pagina ${i} di ${pageCount}`, 170, 285);
        }
        
        doc.save(`valutazioni-export-${new Date().toISOString().split('T')[0]}.pdf`);
    }

    exportDataAsExcel(data) {
        const wb = XLSX.utils.book_new();
        
        // Teacher Profile sheet
        const profileData = [
            ['Campo', 'Valore'],
            ['Nome', data.teacherProfile.firstName],
            ['Cognome', data.teacherProfile.lastName],
            ['Email', data.teacherProfile.email],
            ['Scuola', data.teacherProfile.schoolName],
            ['Livello Scuola', data.teacherProfile.schoolLevel],
            ['Anno Scolastico', data.teacherProfile.schoolYear],
            ['Inizio Anno', data.teacherProfile.schoolYearStart],
            ['Fine Anno', data.teacherProfile.schoolYearEnd],
            ['Data Export', new Date(data.exportDate).toLocaleDateString('it-IT')]
        ];
        const wsProfile = XLSX.utils.aoa_to_sheet(profileData);
        XLSX.utils.book_append_sheet(wb, wsProfile, 'Profilo Docente');

        // Classes sheet
        if (data.classes.length > 0) {
            const classesData = [
                ['Nome', 'Anno', 'Sezione', 'N. Studenti', 'Data Creazione']
            ];
            data.classes.forEach(c => {
                classesData.push([
                    c.name,
                    c.year || '',
                    c.section || '',
                    c.studentsCount || 0,
                    c.createdAt ? new Date(c.createdAt).toLocaleDateString('it-IT') : ''
                ]);
            });
            const wsClasses = XLSX.utils.aoa_to_sheet(classesData);
            XLSX.utils.book_append_sheet(wb, wsClasses, 'Classi');
        }

        // Students sheet
        if (data.students.length > 0) {
            const studentsData = [
                ['Nome Studente', 'Classe', 'Data Inserimento']
            ];
            data.students.forEach(s => {
                const cls = data.classes.find(c => c.id == s.classId);
                studentsData.push([
                    s.name,
                    cls ? cls.name : '',
                    s.createdAt ? new Date(s.createdAt).toLocaleDateString('it-IT') : ''
                ]);
            });
            const wsStudents = XLSX.utils.aoa_to_sheet(studentsData);
            XLSX.utils.book_append_sheet(wb, wsStudents, 'Studenti');
        }

        // Lessons sheet
        if (data.lessons.length > 0) {
            const lessonsData = [
                ['Disciplina', 'Classe', 'Argomento', 'Data', 'Ora Inizio', 'Ora Fine', 'Note']
            ];
            data.lessons.forEach(l => {
                const cls = data.classes.find(c => c.id == l.classId);
                lessonsData.push([
                    l.subject || '',
                    cls ? cls.name : '',
                    l.topic || '',
                    l.date || '',
                    l.startTime || '',
                    l.endTime || '',
                    l.notes || ''
                ]);
            });
            const wsLessons = XLSX.utils.aoa_to_sheet(lessonsData);
            XLSX.utils.book_append_sheet(wb, wsLessons, 'Lezioni');
        }

        // Activities sheet
        if (data.activities && data.activities.length > 0) {
            const activitiesData = [
                ['Titolo', 'Tipo', 'Descrizione', 'Scadenza', 'Classe', 'Studente', 'Stato', 'Data Creazione']
            ];
            data.activities.forEach(a => {
                const cls = data.classes.find(c => c.id == a.classId);
                const student = data.students.find(s => s.id == a.studentId);
                activitiesData.push([
                    a.title || '',
                    a.type || '',
                    a.description || '',
                    a.deadline ? new Date(a.deadline).toLocaleDateString('it-IT') : '',
                    cls ? cls.name : '',
                    student ? student.name : '',
                    a.status || '',
                    a.createdAt ? new Date(a.createdAt).toLocaleDateString('it-IT') : ''
                ]);
            });
            const wsActivities = XLSX.utils.aoa_to_sheet(activitiesData);
            XLSX.utils.book_append_sheet(wb, wsActivities, 'Attività');
        }

        // Evaluations sheet
        if (data.evaluations.length > 0) {
            const evaluationsData = [
                ['Studente', 'Classe', 'Disciplina', 'Voto', 'Criterio', 'Griglia', 'Data', 'Note']
            ];
            data.evaluations.forEach(e => {
                const student = data.students.find(s => s.id == e.studentId);
                const cls = data.classes.find(c => c.id == e.classId);
                const criterion = data.evaluationCriteria.find(c => c.id == e.criterionId);
                const grid = data.evaluationGrids.find(g => g.id == e.gridId);
                
                evaluationsData.push([
                    student ? student.name : '',
                    cls ? cls.name : '',
                    e.subjectId || '',
                    e.score || '',
                    criterion ? criterion.name : '',
                    grid ? grid.name : '',
                    e.date || '',
                    e.notes || ''
                ]);
            });
            const wsEvaluations = XLSX.utils.aoa_to_sheet(evaluationsData);
            XLSX.utils.book_append_sheet(wb, wsEvaluations, 'Valutazioni');
        }

        // Subjects sheet
        if (data.subjects.length > 0) {
            const subjectsData = [['Disciplina']];
            data.subjects.forEach(s => {
                subjectsData.push([s]);
            });
            const wsSubjects = XLSX.utils.aoa_to_sheet(subjectsData);
            XLSX.utils.book_append_sheet(wb, wsSubjects, 'Discipline');
        }

        // Schedule sheet
        if (data.schedule && Object.keys(data.schedule).length > 0) {
            const scheduleData = [
                ['Giorno', 'Data', 'Ora', 'Classe', 'Tipo Attività']
            ];
            Object.entries(data.schedule).forEach(([key, slot]) => {
                const [dateStr, hourStr] = key.split('-');
                const date = new Date(dateStr);
                const dayNames = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
                const dayName = dayNames[date.getDay()];
                const cls = data.classes.find(c => c.id == slot.classId);
                const activityTypes = { 'theory': 'Teoria', 'drawing': 'Disegno', 'lab': 'Laboratorio' };
                
                scheduleData.push([
                    dayName,
                    date.toLocaleDateString('it-IT'),
                    `${hourStr}:00`,
                    cls ? cls.name : '',
                    activityTypes[slot.activityType] || ''
                ]);
            });
            const wsSchedule = XLSX.utils.aoa_to_sheet(scheduleData);
            XLSX.utils.book_append_sheet(wb, wsSchedule, 'Orario');
        }

        // Write file
        XLSX.writeFile(wb, `docente-plus-export-${new Date().toISOString().split('T')[0]}.xlsx`);
    }

    exportEvaluationsAsExcel(data) {
        const wb = XLSX.utils.book_new();
        
        // Statistics sheet
        const statsData = [
            ['Statistiche Generali', ''],
            ['Totale Valutazioni', data.statistics.totalEvaluations],
            ['Studenti Valutati', data.statistics.totalStudents],
            ['Classi', data.statistics.totalClasses],
            ['Media Generale', data.statistics.averageScore ? data.statistics.averageScore.toFixed(2) : 'N/D'],
            ['', ''],
            ['Statistiche per Disciplina', ''],
            ['Disciplina', 'N. Valutazioni', 'Media']
        ];
        
        Object.entries(data.statistics.evaluationsBySubject).forEach(([subject, stats]) => {
            statsData.push([subject, stats.count, stats.averageScore ? stats.averageScore.toFixed(2) : 'N/D']);
        });
        
        statsData.push(['', '']);
        statsData.push(['Statistiche per Classe', '']);
        statsData.push(['Classe', 'N. Valutazioni', 'Media']);
        
        Object.entries(data.statistics.evaluationsByClass).forEach(([className, stats]) => {
            statsData.push([className, stats.count, stats.averageScore ? stats.averageScore.toFixed(2) : 'N/D']);
        });
        
        const wsStats = XLSX.utils.aoa_to_sheet(statsData);
        XLSX.utils.book_append_sheet(wb, wsStats, 'Statistiche');

        // Evaluations sheet
        if (data.evaluations.length > 0) {
            const evaluationsData = [
                ['Studente', 'Classe', 'Disciplina', 'Voto', 'Criterio', 'Griglia', 'Data', 'Note']
            ];
            data.evaluations.forEach(e => {
                evaluationsData.push([
                    e.studentName || '',
                    e.className || '',
                    e.subjectName || '',
                    e.score || '',
                    e.criterionName || '',
                    e.gridName || '',
                    e.date || '',
                    e.notes || ''
                ]);
            });
            const wsEvaluations = XLSX.utils.aoa_to_sheet(evaluationsData);
            XLSX.utils.book_append_sheet(wb, wsEvaluations, 'Valutazioni');
        }

        // Criteria sheet
        if (data.evaluationCriteria.length > 0) {
            const criteriaData = [
                ['Nome Criterio', 'Disciplina', 'Tipo', 'Descrizione']
            ];
            data.evaluationCriteria.forEach(c => {
                criteriaData.push([
                    c.name || '',
                    c.subject || '',
                    c.type || '',
                    c.description || ''
                ]);
            });
            const wsCriteria = XLSX.utils.aoa_to_sheet(criteriaData);
            XLSX.utils.book_append_sheet(wb, wsCriteria, 'Criteri');
        }

        // Grids sheet
        if (data.evaluationGrids.length > 0) {
            const gridsData = [
                ['Nome Griglia', 'Disciplina', 'N. Livelli']
            ];
            data.evaluationGrids.forEach(g => {
                gridsData.push([
                    g.name || '',
                    g.subject || '',
                    g.levels ? g.levels.length : 0
                ]);
            });
            const wsGrids = XLSX.utils.aoa_to_sheet(gridsData);
            XLSX.utils.book_append_sheet(wb, wsGrids, 'Griglie');
        }

        // Write file
        XLSX.writeFile(wb, `valutazioni-export-${new Date().toISOString().split('T')[0]}.xlsx`);
    }

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    
                    if (data.lessons) {
                        this.lessons = data.lessons;
                    }
                    if (data.students) {
                        this.students = data.students;
                    }
                    if (data.classes) {
                        this.classes = data.classes;
                    }
                    if (data.subjects) {
                        this.subjects = data.subjects;
                        localStorage.setItem('teacher-subjects', JSON.stringify(this.subjects));
                    }
                    if (data.activities) {
                        this.activities = data.activities;
                    }
                    if (data.schedule) {
                        this.schedule = data.schedule;
                    }
                    if (data.evaluationCriteria) {
                        this.evaluationCriteria = data.evaluationCriteria;
                    }
                    if (data.evaluationGrids) {
                        this.evaluationGrids = data.evaluationGrids;
                    }
                    if (data.evaluations) {
                        this.evaluations = data.evaluations;
                    }
                    if (data.notifications) {
                        this.notifications = data.notifications;
                    }
                    if (data.reminders) {
                        this.reminders = data.reminders;
                    }
                    if (data.notificationSettings) {
                        this.notificationSettings = data.notificationSettings;
                    }
                    if (data.teacherProfile) {
                        const profile = data.teacherProfile;
                        if (profile.firstName) localStorage.setItem('teacher-first-name', profile.firstName);
                        if (profile.lastName) localStorage.setItem('teacher-last-name', profile.lastName);
                        if (profile.email) localStorage.setItem('teacher-email', profile.email);
                        if (profile.schoolLevel) localStorage.setItem('school-level', profile.schoolLevel);
                        if (profile.schoolName) localStorage.setItem('school-name', profile.schoolName);
                        if (profile.schoolYear) localStorage.setItem('school-year', profile.schoolYear);
                        if (profile.schoolYearStart) localStorage.setItem('school-year-start', profile.schoolYearStart);
                        if (profile.schoolYearEnd) localStorage.setItem('school-year-end', profile.schoolYearEnd);
                    }
                    
                    this.saveData();
                    this.renderLessons();
                    this.renderStudents();
                    this.renderClasses();
                    this.renderActivities();
                    this.renderSchedule();
                    this.renderEvaluations();
                    this.renderNotifications();
                    this.updateClassSelectors();
                    this.loadSettings();
                    this.renderDashboard();
                    
                    // Create import success notification
                    this.createNotification({
                        title: '✅ Importazione Completata',
                        message: 'I dati sono stati importati e ripristinati con successo',
                        type: 'system',
                        notificationId: `import-success-${Date.now()}`
                    });
                    
                    alert('Dati importati con successo!');
                } catch (error) {
                    console.error('Error importing data:', error);
                    alert('Errore durante l\'importazione dei dati');
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    }

    // Notification Management Methods
    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('Notification permission granted');
                } else {
                    console.log('Notification permission denied');
                }
            });
        }
    }

    startNotificationChecks() {
        // Check for notifications every 5 minutes
        this.notificationCheckInterval = setInterval(() => {
            this.checkAndSendNotifications();
        }, 5 * 60 * 1000); // 5 minutes

        // Also check immediately
        this.checkAndSendNotifications();
    }

    checkAndSendNotifications() {
        const now = new Date();

        // Check if we're in quiet hours
        if (this.isQuietHours(now)) {
            return;
        }

        // Check lesson reminders
        if (this.notificationSettings.lessonReminders) {
            this.checkLessonReminders(now);
        }

        // Check activity deadline reminders
        this.checkActivityDeadlineReminders(now);

        // Check custom reminders
        this.checkCustomReminders(now);

        // Check backup reminders
        if (this.notificationSettings.backupReminders) {
            this.checkBackupReminders(now);
        }
    }

    isQuietHours(date) {
        if (!this.notificationSettings.quietHoursEnabled) {
            return false;
        }

        const currentTime = date.getHours() * 60 + date.getMinutes();
        const [startHour, startMin] = this.notificationSettings.quietHoursStart.split(':').map(Number);
        const [endHour, endMin] = this.notificationSettings.quietHoursEnd.split(':').map(Number);
        const startTime = startHour * 60 + startMin;
        const endTime = endHour * 60 + endMin;

        if (startTime < endTime) {
            return currentTime >= startTime && currentTime <= endTime;
        } else {
            // Quiet hours span midnight
            return currentTime >= startTime || currentTime <= endTime;
        }
    }

    checkLessonReminders(now) {
        this.lessons.forEach(lesson => {
            const lessonDate = new Date(lesson.date + 'T' + lesson.time);
            const timeDiff = lessonDate - now;
            const hoursDiff = timeDiff / (1000 * 60 * 60);

            // Check for 24-hour reminder
            if (this.notificationSettings.remindersBefore24h && 
                hoursDiff > 23.5 && hoursDiff <= 24.5) {
                const notificationId = `lesson-24h-${lesson.id}`;
                if (!this.hasNotificationBeenSent(notificationId)) {
                    this.createNotification({
                        title: '📚 Promemoria Lezione (24 ore)',
                        message: `Domani alle ${lesson.time}: ${lesson.title}`,
                        type: 'lesson-reminder',
                        relatedId: lesson.id,
                        notificationId: notificationId
                    });
                }
            }

            // Check for 1-hour reminder
            if (this.notificationSettings.remindersBefore1h && 
                hoursDiff > 0.5 && hoursDiff <= 1.5) {
                const notificationId = `lesson-1h-${lesson.id}`;
                if (!this.hasNotificationBeenSent(notificationId)) {
                    this.createNotification({
                        title: '📚 Promemoria Lezione (1 ora)',
                        message: `Tra un\'ora: ${lesson.title}`,
                        type: 'lesson-reminder',
                        relatedId: lesson.id,
                        notificationId: notificationId
                    });
                }
            }
        });
    }

    checkActivityDeadlineReminders(now) {
        this.activities.forEach(activity => {
            // Skip completed activities or those without deadlines
            if (activity.status === 'completed' || !activity.deadline) {
                return;
            }

            const deadlineDate = new Date(activity.deadline);
            const timeDiff = deadlineDate - now;
            const hoursDiff = timeDiff / (1000 * 60 * 60);
            const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

            // Check for 3-day reminder
            if (daysDiff > 2.9 && daysDiff <= 3.1) {
                const notificationId = `activity-3d-${activity.id}`;
                if (!this.hasNotificationBeenSent(notificationId)) {
                    const cls = this.classes.find(c => c.id == activity.classId);
                    const classInfo = cls ? ` per ${cls.name}` : '';
                    this.createNotification({
                        title: '📋 Promemoria Attività (3 giorni)',
                        message: `Scadenza tra 3 giorni${classInfo}: ${activity.title}`,
                        type: 'activity-reminder',
                        relatedId: activity.id,
                        notificationId: notificationId
                    });
                }
            }

            // Check for 24-hour reminder
            if (hoursDiff > 23.5 && hoursDiff <= 24.5) {
                const notificationId = `activity-24h-${activity.id}`;
                if (!this.hasNotificationBeenSent(notificationId)) {
                    const cls = this.classes.find(c => c.id == activity.classId);
                    const classInfo = cls ? ` per ${cls.name}` : '';
                    this.createNotification({
                        title: '📋 Promemoria Attività (24 ore)',
                        message: `Scadenza domani${classInfo}: ${activity.title}`,
                        type: 'activity-reminder',
                        relatedId: activity.id,
                        notificationId: notificationId
                    });
                }
            }

            // Check for overdue
            if (timeDiff < 0 && timeDiff > -24 * 60 * 60 * 1000) {
                const notificationId = `activity-overdue-${activity.id}`;
                if (!this.hasNotificationBeenSent(notificationId)) {
                    const cls = this.classes.find(c => c.id == activity.classId);
                    const classInfo = cls ? ` per ${cls.name}` : '';
                    this.createNotification({
                        title: '⚠️ Attività Scaduta',
                        message: `Scadenza superata${classInfo}: ${activity.title}`,
                        type: 'activity-reminder',
                        relatedId: activity.id,
                        notificationId: notificationId
                    });
                }
            }
        });
    }

    checkCustomReminders(now) {
        this.reminders.forEach(reminder => {
            if (reminder.dismissed || reminder.notified) {
                return;
            }

            const reminderDate = new Date(reminder.dateTime);
            const timeDiff = reminderDate - now;

            if (timeDiff <= 0 && timeDiff > -5 * 60 * 1000) { // Within 5 minutes of reminder time
                this.createNotification({
                    title: `🔔 ${reminder.title}`,
                    message: reminder.message,
                    type: 'custom-reminder',
                    relatedId: reminder.id,
                    notificationId: `reminder-${reminder.id}`
                });
                reminder.notified = true;
                this.saveData();
            }
        });
    }

    hasNotificationBeenSent(notificationId) {
        return this.notifications.some(n => n.notificationId === notificationId);
    }

    checkBackupReminders(now) {
        const lastBackup = this.notificationSettings.lastBackupDate;
        const interval = this.notificationSettings.backupReminderInterval;
        
        if (!lastBackup) {
            // First time - suggest backup after 7 days of use
            const firstUseDate = localStorage.getItem('docente-plus-first-use');
            if (!firstUseDate) {
                localStorage.setItem('docente-plus-first-use', now.toISOString());
                return;
            }
            
            const daysSinceFirstUse = (now - new Date(firstUseDate)) / (1000 * 60 * 60 * 24);
            if (daysSinceFirstUse >= 7) {
                const notificationId = 'backup-initial';
                if (!this.hasNotificationBeenSent(notificationId)) {
                    this.createNotification({
                        title: '💾 Promemoria Backup',
                        message: 'È consigliato eseguire un backup dei tuoi dati. Vai in Impostazioni > Esporta Dati',
                        type: 'backup',
                        notificationId: notificationId
                    });
                }
            }
        } else {
            // Check if it's time for regular backup reminder
            const lastBackupDate = new Date(lastBackup);
            const daysSinceBackup = (now - lastBackupDate) / (1000 * 60 * 60 * 24);
            
            if (daysSinceBackup >= interval) {
                const notificationId = `backup-${lastBackupDate.toISOString()}`;
                if (!this.hasNotificationBeenSent(notificationId)) {
                    this.createNotification({
                        title: '💾 Promemoria Backup Periodico',
                        message: `Sono passati ${Math.floor(daysSinceBackup)} giorni dall'ultimo backup. Esporta i tuoi dati per sicurezza.`,
                        type: 'backup',
                        notificationId: notificationId
                    });
                }
            }
        }
    }

    createNotification(data) {
        const notification = {
            id: Date.now(),
            ...data,
            createdAt: new Date().toISOString(),
            read: false
        };

        this.notifications.unshift(notification);
        this.saveData();

        // Send browser notification
        if (this.notificationSettings.browserNotifications && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(notification.title, {
                body: notification.message,
                icon: '🎓',
                tag: notification.notificationId
            });
        }

        // Update UI if on notifications tab
        this.renderNotifications();
    }

    addReminder() {
        const title = document.getElementById('reminder-title').value;
        const message = document.getElementById('reminder-message').value;
        const date = document.getElementById('reminder-date').value;
        const time = document.getElementById('reminder-time').value;

        if (!title || !date || !time) {
            alert('Inserisci titolo, data e ora per il promemoria');
            return;
        }

        const reminder = {
            id: Date.now(),
            title,
            message,
            dateTime: `${date}T${time}`,
            createdAt: new Date().toISOString(),
            notified: false,
            dismissed: false
        };

        this.reminders.push(reminder);
        this.saveData();
        this.renderNotifications();
        this.hideAddReminderForm();

        // Clear form
        document.getElementById('reminder-title').value = '';
        document.getElementById('reminder-message').value = '';
        document.getElementById('reminder-date').value = '';
        document.getElementById('reminder-time').value = '';
    }

    deleteReminder(id) {
        if (confirm('Sei sicuro di voler eliminare questo promemoria?')) {
            this.reminders = this.reminders.filter(r => r.id !== id);
            this.saveData();
            this.renderNotifications();
        }
    }

    dismissReminder(id) {
        const reminder = this.reminders.find(r => r.id === id);
        if (reminder) {
            reminder.dismissed = true;
            this.saveData();
            this.renderNotifications();
        }
    }

    markNotificationRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            this.saveData();
            this.renderNotifications();
        }
    }

    markAllNotificationsRead() {
        this.notifications.forEach(n => n.read = true);
        this.saveData();
        this.renderNotifications();
    }

    deleteNotification(id) {
        this.notifications = this.notifications.filter(n => n.id !== id);
        this.saveData();
        this.renderNotifications();
    }

    clearAllNotifications() {
        if (confirm('Sei sicuro di voler eliminare tutte le notifiche?')) {
            this.notifications = [];
            this.saveData();
            this.renderNotifications();
        }
    }

    saveNotificationSettings() {
        this.notificationSettings.browserNotifications = document.getElementById('notification-browser').checked;
        this.notificationSettings.emailNotifications = document.getElementById('notification-email').checked;
        this.notificationSettings.lessonReminders = document.getElementById('notification-lesson-reminders').checked;
        this.notificationSettings.remindersBefore24h = document.getElementById('notification-24h').checked;
        this.notificationSettings.remindersBefore1h = document.getElementById('notification-1h').checked;
        this.notificationSettings.backupReminders = document.getElementById('notification-backup-reminders').checked;
        
        const backupInterval = document.getElementById('notification-backup-interval').value;
        if (backupInterval) {
            this.notificationSettings.backupReminderInterval = parseInt(backupInterval);
        }
        
        this.notificationSettings.quietHoursEnabled = document.getElementById('notification-quiet-hours').checked;
        this.notificationSettings.quietHoursStart = document.getElementById('notification-quiet-start').value;
        this.notificationSettings.quietHoursEnd = document.getElementById('notification-quiet-end').value;

        this.saveData();
        alert('Impostazioni notifiche salvate!');
    }

    showAddReminderForm() {
        document.getElementById('add-reminder-form').style.display = 'block';
    }

    hideAddReminderForm() {
        document.getElementById('add-reminder-form').style.display = 'none';
    }

    filterNotifications(filter) {
        this.notificationFilter = filter;
        this.renderNotifications();
    }

    getNotificationStats() {
        const stats = {
            total: this.notifications.length,
            unread: this.notifications.filter(n => !n.read).length,
            byType: {}
        };

        // Count by type
        this.notifications.forEach(n => {
            const type = n.type || 'other';
            stats.byType[type] = (stats.byType[type] || 0) + 1;
        });

        return stats;
    }

    renderNotifications() {
        // Render notifications list
        const notificationsList = document.getElementById('notifications-list');
        if (notificationsList) {
            const stats = this.getNotificationStats();
            const unreadCount = stats.unread;
            const notificationsHeader = document.getElementById('notifications-header');
            if (notificationsHeader) {
                notificationsHeader.innerHTML = `
                    <h3>🔔 Notifiche Recenti</h3>
                    ${unreadCount > 0 ? `<span class="badge">${unreadCount} non lette</span>` : ''}
                `;
            }

            // Add filter buttons
            const filterSection = document.getElementById('notifications-filter');
            if (filterSection) {
                filterSection.innerHTML = `
                    <div class="notification-filters">
                        <button class="filter-btn ${this.notificationFilter === 'all' ? 'active' : ''}" onclick="app.filterNotifications('all')">
                            Tutte (${stats.total})
                        </button>
                        <button class="filter-btn ${this.notificationFilter === 'lesson-reminder' ? 'active' : ''}" onclick="app.filterNotifications('lesson-reminder')">
                            📚 Lezioni (${stats.byType['lesson-reminder'] || 0})
                        </button>
                        <button class="filter-btn ${this.notificationFilter === 'activity-reminder' ? 'active' : ''}" onclick="app.filterNotifications('activity-reminder')">
                            📋 Attività (${stats.byType['activity-reminder'] || 0})
                        </button>
                        <button class="filter-btn ${this.notificationFilter === 'custom-reminder' ? 'active' : ''}" onclick="app.filterNotifications('custom-reminder')">
                            ⏰ Promemoria (${stats.byType['custom-reminder'] || 0})
                        </button>
                        <button class="filter-btn ${this.notificationFilter === 'backup' ? 'active' : ''}" onclick="app.filterNotifications('backup')">
                            💾 Backup (${stats.byType['backup'] || 0})
                        </button>
                        <button class="filter-btn ${this.notificationFilter === 'system' ? 'active' : ''}" onclick="app.filterNotifications('system')">
                            ⚙️ Sistema (${stats.byType['system'] || 0})
                        </button>
                    </div>
                `;
            }

            // Filter notifications based on current filter
            let filteredNotifications = this.notifications;
            if (this.notificationFilter !== 'all') {
                filteredNotifications = this.notifications.filter(n => n.type === this.notificationFilter);
            }

            if (filteredNotifications.length === 0) {
                notificationsList.innerHTML = '<p class="empty-state">Nessuna notifica</p>';
            } else {
                notificationsList.innerHTML = filteredNotifications.slice(0, 50).map(notification => `
                    <div class="notification-item ${notification.read ? 'read' : 'unread'} notification-type-${notification.type || 'other'}">
                        <div class="notification-header">
                            <h4>${notification.title}</h4>
                            <span class="notification-time">${new Date(notification.createdAt).toLocaleString('it-IT')}</span>
                        </div>
                        <p>${notification.message}</p>
                        <div class="notification-actions">
                            ${!notification.read ? `<button class="btn btn-sm" onclick="app.markNotificationRead(${notification.id})">Segna come letta</button>` : ''}
                            <button class="btn btn-sm btn-danger" onclick="app.deleteNotification(${notification.id})">Elimina</button>
                        </div>
                    </div>
                `).join('');
            }
        }

        // Render reminders list
        const remindersList = document.getElementById('reminders-list');
        if (remindersList) {
            const activeReminders = this.reminders.filter(r => !r.dismissed);
            
            if (activeReminders.length === 0) {
                remindersList.innerHTML = '<p class="empty-state">Nessun promemoria attivo</p>';
            } else {
                remindersList.innerHTML = activeReminders.map(reminder => {
                    const reminderDate = new Date(reminder.dateTime);
                    const isPast = reminderDate < new Date();
                    
                    return `
                        <div class="reminder-item ${isPast ? 'past' : 'upcoming'}">
                            <div class="reminder-header">
                                <h4>${reminder.title}</h4>
                                <span class="reminder-time">${reminderDate.toLocaleString('it-IT')}</span>
                            </div>
                            ${reminder.message ? `<p>${reminder.message}</p>` : ''}
                            <div class="reminder-actions">
                                <button class="btn btn-sm" onclick="app.dismissReminder(${reminder.id})">Archivia</button>
                                <button class="btn btn-sm btn-danger" onclick="app.deleteReminder(${reminder.id})">Elimina</button>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }

        // Load notification settings into form
        const browserCheckbox = document.getElementById('notification-browser');
        if (browserCheckbox) {
            browserCheckbox.checked = this.notificationSettings.browserNotifications;
            document.getElementById('notification-email').checked = this.notificationSettings.emailNotifications;
            document.getElementById('notification-lesson-reminders').checked = this.notificationSettings.lessonReminders;
            document.getElementById('notification-24h').checked = this.notificationSettings.remindersBefore24h;
            document.getElementById('notification-1h').checked = this.notificationSettings.remindersBefore1h;
            
            const backupCheckbox = document.getElementById('notification-backup-reminders');
            if (backupCheckbox) {
                backupCheckbox.checked = this.notificationSettings.backupReminders;
            }
            const backupIntervalInput = document.getElementById('notification-backup-interval');
            if (backupIntervalInput) {
                backupIntervalInput.value = this.notificationSettings.backupReminderInterval || 7;
            }
            
            document.getElementById('notification-quiet-hours').checked = this.notificationSettings.quietHoursEnabled;
            document.getElementById('notification-quiet-start').value = this.notificationSettings.quietHoursStart;
            document.getElementById('notification-quiet-end').value = this.notificationSettings.quietHoursEnd;
        }
    }

    // ========================================
    // DOCUMENT IMPORT MODULE METHODS
    // ========================================

    showImportStudentsDialog() {
        this.switchTab('document-import');
        // Optionally show a hint or focus on upload area
        const uploadArea = document.getElementById('document-upload-area');
        if (uploadArea) {
            uploadArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
            uploadArea.style.border = '2px solid #3498db';
            setTimeout(() => {
                uploadArea.style.border = '';
            }, 2000);
        }
    }

    async handleDocumentUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const statusDiv = document.getElementById('document-upload-status');
        statusDiv.style.display = 'block';
        statusDiv.innerHTML = `
            <div class="upload-progress">
                <p>📤 Caricamento file: <strong>${file.name}</strong></p>
                <p>Dimensione: ${this.formatFileSize(file.size)}</p>
                <div class="loading-spinner">⏳ Analisi in corso...</div>
            </div>
        `;

        try {
            // Read file based on type
            const fileData = await this.readFileContent(file);
            
            // Classify document with AI
            await this.classifyDocument(file, fileData);
            
        } catch (error) {
            console.error('Error uploading document:', error);
            statusDiv.innerHTML = `
                <div class="error-message">
                    ❌ Errore durante il caricamento: ${error.message}
                </div>
            `;
        }
    }

    async readFileContent(file) {
        const extension = file.name.split('.').pop().toLowerCase();
        
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                try {
                    let parsedData = null;
                    
                    if (extension === 'csv') {
                        // Parse CSV using PapaParse
                        parsedData = Papa.parse(e.target.result, {
                            header: true,
                            skipEmptyLines: true,
                            dynamicTyping: true
                        });
                        resolve({ type: 'csv', data: parsedData.data, raw: e.target.result });
                        
                    } else if (extension === 'xlsx' || extension === 'xls') {
                        // Parse Excel using XLSX
                        const workbook = XLSX.read(e.target.result, { type: 'binary' });
                        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
                        resolve({ type: 'excel', data: jsonData, raw: e.target.result, workbook });
                        
                    } else if (extension === 'json') {
                        // Parse JSON
                        parsedData = JSON.parse(e.target.result);
                        resolve({ type: 'json', data: parsedData, raw: e.target.result });
                        
                    } else if (extension === 'txt') {
                        // Plain text
                        resolve({ type: 'text', data: e.target.result, raw: e.target.result });
                        
                    } else if (extension === 'pdf') {
                        // Extract text from PDF using PDF.js
                        this.extractTextFromPDF(e.target.result).then(pdfText => {
                            resolve({ type: 'pdf', data: pdfText, raw: e.target.result });
                        }).catch(err => {
                            console.error('PDF extraction error:', err);
                            resolve({ type: 'pdf', data: null, raw: e.target.result });
                        });
                    } else {
                        reject(new Error('Formato file non supportato'));
                    }
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('Errore nella lettura del file'));
            
            if (extension === 'pdf') {
                reader.readAsArrayBuffer(file);
            } else if (extension === 'xlsx' || extension === 'xls') {
                reader.readAsBinaryString(file);
            } else {
                reader.readAsText(file);
            }
        });
    }

    async extractTextFromPDF(arrayBuffer) {
        // Configure PDF.js worker
        if (typeof pdfjsLib !== 'undefined') {
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }

        try {
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = '';

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += pageText + '\n';
            }

            return fullText;
        } catch (error) {
            console.error('Error extracting text from PDF:', error);
            throw error;
        }
    }

    async classifyDocument(file, fileData) {
        const apiKey = localStorage.getItem('openrouter-api-key');
        
        if (!apiKey) {
            // Show classification without AI
            this.showManualClassification(file, fileData);
            return;
        }

        const statusDiv = document.getElementById('document-upload-status');
        statusDiv.innerHTML = `
            <div class="upload-progress">
                <p>🤖 Analisi documento con IA...</p>
                <div class="loading-spinner">⏳ Classificazione in corso...</div>
            </div>
        `;

        try {
            // Prepare data preview for AI
            let dataPreview = '';
            if (fileData.type === 'csv' || fileData.type === 'excel') {
                const preview = fileData.data.slice(0, 5);
                dataPreview = JSON.stringify(preview, null, 2);
            } else if (fileData.type === 'text' || fileData.type === 'json') {
                dataPreview = fileData.raw.substring(0, 1000);
            } else if (fileData.type === 'pdf') {
                // Use extracted text from PDF
                dataPreview = fileData.data ? fileData.data.substring(0, 1500) : 'Documento PDF (contenuto non estratto)';
            }

            const prompt = `Analizza questo documento e classifica il tipo di contenuto.

Nome file: ${file.name}
Tipo: ${fileData.type}

Anteprima dati:
${dataPreview}

Identifica se il documento contiene:
1. ANAGRAFICA_STUDENTI - Lista di studenti con dati anagrafici (nome, cognome, data nascita, classe, email, ecc.)
2. MATERIALI_DIDATTICI - Materiali didattici, programmi, contenuti delle lezioni
3. ATTIVITA - Attività didattiche, compiti, progetti, esercitazioni
4. VALUTAZIONI - Griglie di valutazione, criteri, voti
5. ALTRO - Altro tipo di documento

Rispondi SOLO in formato JSON con questa struttura:
{
  "tipo": "ANAGRAFICA_STUDENTI|MATERIALI_DIDATTICI|ATTIVITA|VALUTAZIONI|ALTRO",
  "confidenza": 0.0-1.0,
  "descrizione": "breve descrizione del contenuto",
  "suggerimenti": "suggerimenti per l'importazione"
}`;

            const response = await this.callOpenRouterAPI(prompt, apiKey);
            
            // Parse AI response
            let classification;
            try {
                // Try to extract JSON from response
                const jsonMatch = response.content.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    classification = JSON.parse(jsonMatch[0]);
                } else {
                    throw new Error('Risposta non in formato JSON');
                }
            } catch (e) {
                console.error('Error parsing AI classification:', e);
                classification = {
                    tipo: 'ALTRO',
                    confidenza: 0.5,
                    descrizione: response.content,
                    suggerimenti: 'Classificazione manuale consigliata'
                };
            }

            this.documentClassification = classification;
            this.currentImportData = { file, fileData };
            
            this.showClassificationResult(file, classification, fileData);
            
        } catch (error) {
            console.error('Error classifying document:', error);
            statusDiv.innerHTML = `
                <div class="warning-message">
                    ⚠️ Impossibile classificare automaticamente il documento.
                    <button class="btn btn-secondary" onclick="app.showManualClassification()">Classifica Manualmente</button>
                </div>
            `;
        }
    }

    showClassificationResult(file, classification, fileData) {
        const statusDiv = document.getElementById('document-upload-status');
        const classificationDiv = document.getElementById('document-classification');
        const resultDiv = document.getElementById('classification-result');
        const actionsDiv = document.getElementById('classification-actions');
        
        statusDiv.style.display = 'none';
        classificationDiv.style.display = 'block';

        const typeIcons = {
            'ANAGRAFICA_STUDENTI': '👥',
            'MATERIALI_DIDATTICI': '📚',
            'ATTIVITA': '📋',
            'VALUTAZIONI': '✅',
            'ALTRO': '📄'
        };

        const typeLabels = {
            'ANAGRAFICA_STUDENTI': 'Anagrafica Studenti',
            'MATERIALI_DIDATTICI': 'Materiali Didattici',
            'ATTIVITA': 'Attività Didattiche',
            'VALUTAZIONI': 'Valutazioni',
            'ALTRO': 'Altro'
        };

        const confidencePercent = Math.round(classification.confidenza * 100);
        
        resultDiv.innerHTML = `
            <div class="classification-card">
                <div class="classification-header">
                    <span class="classification-icon">${typeIcons[classification.tipo] || '📄'}</span>
                    <h4>${typeLabels[classification.tipo] || classification.tipo}</h4>
                </div>
                <div class="classification-details">
                    <p><strong>Confidenza:</strong> ${confidencePercent}%</p>
                    <p><strong>Descrizione:</strong> ${classification.descrizione}</p>
                    ${classification.suggerimenti ? `<p><strong>Suggerimenti:</strong> ${classification.suggerimenti}</p>` : ''}
                </div>
            </div>
        `;

        // Show appropriate actions based on classification
        if (classification.tipo === 'ANAGRAFICA_STUDENTI') {
            actionsDiv.innerHTML = `
                <button class="btn btn-primary" onclick="app.processStudentsImport()">
                    ✅ Importa Studenti
                </button>
                <button class="btn btn-secondary" onclick="app.showManualClassification()">
                    🔄 Riclassifica
                </button>
            `;
        } else if (classification.tipo === 'MATERIALI_DIDATTICI') {
            actionsDiv.innerHTML = `
                <button class="btn btn-primary" onclick="app.processMaterialsImport()">
                    ✅ Importa Materiali
                </button>
                <button class="btn btn-secondary" onclick="app.showManualClassification()">
                    🔄 Riclassifica
                </button>
            `;
        } else if (classification.tipo === 'ATTIVITA') {
            actionsDiv.innerHTML = `
                <button class="btn btn-primary" onclick="app.processActivitiesImport()">
                    ✅ Importa Attività
                </button>
                <button class="btn btn-secondary" onclick="app.showManualClassification()">
                    🔄 Riclassifica
                </button>
            `;
        } else {
            actionsDiv.innerHTML = `
                <button class="btn btn-secondary" onclick="app.showManualClassification()">
                    📋 Classifica Manualmente
                </button>
            `;
        }
    }

    showManualClassification(file, fileData) {
        const classificationDiv = document.getElementById('document-classification');
        const resultDiv = document.getElementById('classification-result');
        const actionsDiv = document.getElementById('classification-actions');
        
        classificationDiv.style.display = 'block';
        
        resultDiv.innerHTML = `
            <div class="manual-classification">
                <h4>Seleziona il tipo di documento:</h4>
                <select id="manual-classification-type" class="form-control">
                    <option value="">-- Seleziona tipo --</option>
                    <option value="ANAGRAFICA_STUDENTI">👥 Anagrafica Studenti</option>
                    <option value="MATERIALI_DIDATTICI">📚 Materiali Didattici</option>
                    <option value="ATTIVITA">📋 Attività Didattiche</option>
                    <option value="VALUTAZIONI">✅ Valutazioni</option>
                    <option value="ALTRO">📄 Altro</option>
                </select>
            </div>
        `;
        
        actionsDiv.innerHTML = `
            <button class="btn btn-primary" onclick="app.processManualClassification()">
                ✅ Procedi con Importazione
            </button>
            <button class="btn btn-secondary" onclick="app.cancelImport()">
                ❌ Annulla
            </button>
        `;
    }

    processManualClassification() {
        const typeSelect = document.getElementById('manual-classification-type');
        const selectedType = typeSelect.value;
        
        if (!selectedType) {
            alert('Seleziona un tipo di documento');
            return;
        }

        this.documentClassification = {
            tipo: selectedType,
            confidenza: 1.0,
            descrizione: 'Classificazione manuale',
            suggerimenti: ''
        };

        // Process based on type
        if (selectedType === 'ANAGRAFICA_STUDENTI') {
            this.processStudentsImport();
        } else if (selectedType === 'MATERIALI_DIDATTICI') {
            this.processMaterialsImport();
        } else if (selectedType === 'ATTIVITA') {
            this.processActivitiesImport();
        } else {
            alert('Tipo di documento non ancora supportato per l\'importazione automatica');
        }
    }

    async processStudentsImport() {
        if (!this.currentImportData) {
            alert('Nessun dato da importare');
            return;
        }

        const { fileData } = this.currentImportData;
        const previewDiv = document.getElementById('document-preview');
        const previewContent = document.getElementById('preview-content');
        
        // Hide classification, show preview
        document.getElementById('document-classification').style.display = 'none';
        previewDiv.style.display = 'block';

        // Extract student data
        let studentsData = [];
        
        if (fileData.type === 'csv' || fileData.type === 'excel') {
            studentsData = this.extractStudentsFromTabularData(fileData.data);
        } else if (fileData.type === 'json') {
            studentsData = this.extractStudentsFromJSON(fileData.data);
        }

        // Store for confirmation
        this.currentImportData.studentsData = studentsData;

        // Show preview
        if (studentsData.length === 0) {
            previewContent.innerHTML = `
                <div class="warning-message">
                    ⚠️ Nessun dato studente trovato nel file.
                    Verifica che il file contenga colonne come: nome, cognome, email, classe, data_nascita, ecc.
                </div>
            `;
        } else {
            previewContent.innerHTML = `
                <p><strong>Trovati ${studentsData.length} studenti da importare</strong></p>
                <div class="preview-table-container">
                    <table class="preview-table">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Classe</th>
                                <th>Data Nascita</th>
                                <th>Onomastico</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${studentsData.map(s => `
                                <tr>
                                    <td>${s.name || 'N/D'}</td>
                                    <td>${s.email || 'N/D'}</td>
                                    <td>${s.class || 'N/D'}</td>
                                    <td>${s.birthdate || 'N/D'}</td>
                                    <td>${s.nameday || 'N/D'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
    }

    extractStudentsFromTabularData(data) {
        // Map common column names to our fields
        const fieldMappings = {
            nome: 'name',
            name: 'name',
            cognome: 'lastName',
            lastname: 'lastName',
            email: 'email',
            'e-mail': 'email',
            classe: 'class',
            class: 'class',
            data_nascita: 'birthdate',
            data_di_nascita: 'birthdate',
            birthdate: 'birthdate',
            nascita: 'birthdate',
            onomastico: 'nameday',
            santo: 'nameday',
            nameday: 'nameday',
            note: 'notes',
            notes: 'notes'
        };

        return data.map(row => {
            const student = {
                name: '',
                email: '',
                class: '',
                birthdate: null,
                nameday: null,
                notes: null
            };

            // Map row fields to student object
            Object.keys(row).forEach(key => {
                const normalizedKey = key.toLowerCase().trim();
                const mappedField = fieldMappings[normalizedKey];
                
                if (mappedField) {
                    student[mappedField] = row[key];
                }
            });

            // Combine name and lastName if separate
            if (student.lastName) {
                student.name = `${student.name || ''} ${student.lastName}`.trim();
                delete student.lastName;
            }

            // Only include if we have at least a name
            return student.name ? student : null;
        }).filter(s => s !== null);
    }

    extractStudentsFromJSON(data) {
        // If data is an array, process it
        if (Array.isArray(data)) {
            return this.extractStudentsFromTabularData(data);
        }
        
        // If data has a students property, use it
        if (data.students && Array.isArray(data.students)) {
            return this.extractStudentsFromTabularData(data.students);
        }

        return [];
    }

    confirmImport() {
        if (!this.currentImportData || !this.currentImportData.studentsData) {
            alert('Nessun dato da importare');
            return;
        }

        const studentsData = this.currentImportData.studentsData;
        let importedCount = 0;
        let duplicatesCount = 0;

        studentsData.forEach(studentData => {
            // Check for duplicates
            const existing = this.students.find(s => 
                s.name.toLowerCase() === studentData.name.toLowerCase() &&
                s.email === studentData.email
            );

            if (existing) {
                // Update existing student with new data (merge)
                if (studentData.birthdate && !existing.birthdate) existing.birthdate = studentData.birthdate;
                if (studentData.nameday && !existing.nameday) existing.nameday = studentData.nameday;
                if (studentData.class && !existing.class) existing.class = studentData.class;
                if (studentData.notes) {
                    existing.notes = existing.notes ? 
                        `${existing.notes}\n${studentData.notes}` : 
                        studentData.notes;
                }
                duplicatesCount++;
            } else {
                // Add new student
                const student = {
                    id: Date.now() + importedCount,
                    name: studentData.name,
                    email: studentData.email || '',
                    class: studentData.class || '',
                    birthdate: studentData.birthdate || null,
                    nameday: studentData.nameday || null,
                    notes: studentData.notes || null,
                    createdAt: new Date().toISOString()
                };
                this.students.push(student);
                importedCount++;
            }
        });

        // Save and refresh
        this.saveData();
        this.renderStudents();
        this.updateClassSelectors();

        // Record imported document
        this.recordImportedDocument({
            fileName: this.currentImportData.file.name,
            fileType: this.currentImportData.fileData.type,
            classificationType: this.documentClassification.tipo,
            importedCount,
            duplicatesCount,
            timestamp: new Date().toISOString()
        });

        // Create notification
        this.createNotification({
            title: '✅ Importazione Completata',
            message: `Importati ${importedCount} nuovi studenti. ${duplicatesCount} duplicati aggiornati.`,
            type: 'system',
            notificationId: `import-${Date.now()}`
        });

        // Show success and reset
        alert(`✅ Importazione completata!\n\nNuovi studenti: ${importedCount}\nDuplicati aggiornati: ${duplicatesCount}`);
        
        this.cancelImport();
        this.switchTab('students');
    }

    processMaterialsImport() {
        alert('Importazione materiali didattici sarà disponibile in una prossima versione');
        // TODO: Implement materials import
    }

    processActivitiesImport() {
        if (!this.currentImportData) {
            alert('Nessun dato da importare');
            return;
        }

        const { file, fileData } = this.currentImportData;
        const previewDiv = document.getElementById('document-preview');
        const previewContent = document.getElementById('preview-content');
        
        // Hide classification, show preview
        document.getElementById('document-classification').style.display = 'none';
        previewDiv.style.display = 'block';

        let activitiesData = [];

        // Extract activities based on file type
        if (fileData.type === 'csv' || fileData.type === 'excel') {
            activitiesData = this.extractActivitiesFromTabularData(fileData.data);
        } else if (fileData.type === 'json') {
            activitiesData = this.extractActivitiesFromJSON(fileData.data);
        } else if (fileData.type === 'pdf' && fileData.data) {
            // Extract activities from PDF text
            activitiesData = this.extractActivitiesFromPDF(fileData.data);
        } else if (fileData.type === 'text' && fileData.data) {
            // Extract from plain text
            activitiesData = this.extractActivitiesFromPDF(fileData.data);
        }

        // Store for confirmation
        this.currentImportData.activitiesData = activitiesData;

        // Show preview
        if (activitiesData.length === 0) {
            previewContent.innerHTML = `
                <div class="warning-message">
                    ⚠️ Nessuna attività trovata nel file.
                    <p>Verifica che il documento contenga informazioni su attività didattiche per i livelli: Prima, Seconda, Terza Media.</p>
                </div>
            `;
        } else {
            // Group by class level
            const groupedActivities = this.groupActivitiesByClass(activitiesData);
            
            previewContent.innerHTML = `
                <p><strong>Trovate ${activitiesData.length} attività da importare</strong></p>
                ${this.renderActivitiesPreviewTable(groupedActivities)}
                <div class="form-actions" style="margin-top: 20px;">
                    <button class="btn btn-primary" onclick="app.confirmActivitiesImport()">
                        ✅ Conferma Importazione
                    </button>
                    <button class="btn btn-secondary" onclick="app.cancelImport()">
                        ❌ Annulla
                    </button>
                </div>
            `;
        }
    }

    extractActivitiesFromPDF(textContent) {
        const activities = [];
        
        // Pattern to detect class levels
        const classPatterns = {
            'Prima': /\b(?:prima|1[°^ª]|classe prima)\b/gi,
            'Seconda': /\b(?:seconda|2[°^ª]|classe seconda)\b/gi,
            'Terza': /\b(?:terza|3[°^ª]|classe terza)\b/gi
        };

        // Split content by sections (using common delimiters)
        const sections = textContent.split(/\n\n+|\r\n\r\n+/);
        
        let currentClass = null;
        
        for (let section of sections) {
            section = section.trim();
            if (!section) continue;

            // Detect class level in section
            for (let [className, pattern] of Object.entries(classPatterns)) {
                if (pattern.test(section)) {
                    currentClass = className;
                    break;
                }
            }

            // Extract activities from section
            // Look for activity indicators like: numbers, bullets, dashes, activity types
            const activityPatterns = [
                /(?:^|\n)\s*[-•·]\s*(.+?)(?=\n|$)/gm,  // Bullet points
                /(?:^|\n)\s*\d+[.)]\s*(.+?)(?=\n|$)/gm,  // Numbered lists
                /(?:lezione|laboratorio|esercitazione|progetto|verifica|compito):\s*(.+?)(?=\n|$)/gi,  // Activity types
            ];

            for (let pattern of activityPatterns) {
                let match;
                while ((match = pattern.exec(section)) !== null) {
                    const title = match[1].trim();
                    if (title && title.length > 10 && title.length < 200) {
                        // Determine activity type from keywords
                        const type = this.detectActivityType(title);
                        
                        activities.push({
                            title: title,
                            type: type,
                            classLevel: currentClass || 'Generale',
                            description: '',
                            status: 'planned',
                            source: 'PDF Import'
                        });
                    }
                }
            }
        }

        // If no activities found with patterns, try a more general approach
        if (activities.length === 0) {
            // Split by lines and look for meaningful content
            const lines = textContent.split(/\n/).filter(line => {
                const trimmed = line.trim();
                return trimmed.length > 15 && trimmed.length < 200 && !trimmed.match(/^[0-9\s.]+$/);
            });

            let currentClass = 'Prima';  // Default starting class
            
            for (let line of lines) {
                // Check for class level markers
                for (let [className, pattern] of Object.entries(classPatterns)) {
                    if (pattern.test(line)) {
                        currentClass = className;
                        break;
                    }
                }

                // If line contains activity-related keywords, consider it an activity
                if (this.looksLikeActivity(line)) {
                    activities.push({
                        title: line.trim(),
                        type: this.detectActivityType(line),
                        classLevel: currentClass,
                        description: '',
                        status: 'planned',
                        source: 'PDF Import'
                    });
                }
            }
        }

        return activities;
    }

    detectActivityType(text) {
        const lowerText = text.toLowerCase();
        
        if (lowerText.match(/\b(?:lezione|spiegazione|introduzione|teoria)\b/)) return 'lesson';
        if (lowerText.match(/\b(?:laboratorio|pratica|esperimento)\b/)) return 'lab';
        if (lowerText.match(/\b(?:esercitazione|esercizi|attività)\b/)) return 'exercise';
        if (lowerText.match(/\b(?:progetto|elaborato)\b/)) return 'project';
        if (lowerText.match(/\b(?:compito|compiti|homework)\b/)) return 'homework';
        if (lowerText.match(/\b(?:verifica|test|esame|valutazione)\b/)) return 'exam';
        
        return 'lesson';  // Default type
    }

    looksLikeActivity(text) {
        const activityKeywords = [
            'disegno', 'progetto', 'laboratorio', 'costruzione', 'realizzazione',
            'studio', 'analisi', 'ricerca', 'presentazione', 'lavoro',
            'esercitazione', 'compito', 'verifica', 'lezione', 'introduzione',
            'applicazione', 'sviluppo', 'tecnologia', 'materiali', 'strumenti'
        ];

        const lowerText = text.toLowerCase();
        return activityKeywords.some(keyword => lowerText.includes(keyword));
    }

    extractActivitiesFromTabularData(data) {
        const activities = [];
        
        const fieldMappings = {
            titolo: 'title',
            title: 'title',
            attivita: 'title',
            attività: 'title',
            tipo: 'type',
            type: 'type',
            classe: 'classLevel',
            class: 'classLevel',
            livello: 'classLevel',
            descrizione: 'description',
            description: 'description',
            stato: 'status',
            status: 'status'
        };

        data.forEach(row => {
            const activity = {
                title: '',
                type: 'lesson',
                classLevel: 'Generale',
                description: '',
                status: 'planned',
                source: 'Tabular Import'
            };

            // Map fields
            for (let [key, value] of Object.entries(row)) {
                const normalizedKey = key.toLowerCase().trim();
                const mappedField = fieldMappings[normalizedKey];
                
                if (mappedField && value) {
                    activity[mappedField] = String(value).trim();
                }
            }

            if (activity.title) {
                activities.push(activity);
            }
        });

        return activities;
    }

    extractActivitiesFromJSON(data) {
        const activities = [];
        
        // Handle different JSON structures
        let items = Array.isArray(data) ? data : (data.activities || data.attivita || []);
        
        items.forEach(item => {
            if (item.title || item.titolo || item.attivita) {
                activities.push({
                    title: item.title || item.titolo || item.attivita || '',
                    type: item.type || item.tipo || 'lesson',
                    classLevel: item.classLevel || item.classe || item.livello || 'Generale',
                    description: item.description || item.descrizione || '',
                    status: item.status || item.stato || 'planned',
                    source: 'JSON Import'
                });
            }
        });

        return activities;
    }

    groupActivitiesByClass(activities) {
        const grouped = {
            'Prima': [],
            'Seconda': [],
            'Terza': [],
            'Generale': []
        };

        activities.forEach(activity => {
            const classLevel = activity.classLevel || 'Generale';
            if (grouped[classLevel]) {
                grouped[classLevel].push(activity);
            } else {
                grouped['Generale'].push(activity);
            }
        });

        return grouped;
    }

    renderActivitiesPreviewTable(groupedActivities) {
        let html = '';
        
        for (let [classLevel, activities] of Object.entries(groupedActivities)) {
            if (activities.length === 0) continue;

            const typeLabels = {
                'lesson': '📚 Lezione',
                'exercise': '✏️ Esercitazione',
                'lab': '🔬 Laboratorio',
                'project': '📊 Progetto',
                'homework': '📝 Compiti',
                'exam': '📄 Verifica'
            };

            html += `
                <div class="class-activities-group" style="margin-bottom: 20px;">
                    <h4>📘 ${classLevel} Media (${activities.length} attività)</h4>
                    <div class="preview-table-container">
                        <table class="preview-table">
                            <thead>
                                <tr>
                                    <th>Titolo</th>
                                    <th>Tipo</th>
                                    <th>Stato</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${activities.map(a => `
                                    <tr>
                                        <td>${a.title || 'N/D'}</td>
                                        <td>${typeLabels[a.type] || a.type}</td>
                                        <td>${a.status === 'planned' ? 'Pianificata' : a.status}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }

        return html;
    }

    confirmActivitiesImport() {
        if (!this.currentImportData || !this.currentImportData.activitiesData) {
            alert('Nessuna attività da importare');
            return;
        }

        const activitiesData = this.currentImportData.activitiesData;
        const file = this.currentImportData.file;

        // Import activities without automatic class mapping
        // Activities are for general grade levels (Prima, Seconda, Terza) not specific sections
        activitiesData.forEach(activityData => {
            const classLevel = activityData.classLevel || 'Generale';
            const levelLabel = classLevel !== 'Generale' ? ` - ${classLevel} Media` : '';
            
            const activity = {
                id: Date.now() + Math.random(),
                title: activityData.title,
                description: activityData.description || `Importata da ${file.name}${levelLabel}`,
                type: activityData.type,
                classId: null, // Keep null for general level activities
                status: activityData.status || 'planned',
                priority: 'medium',
                deadline: null,
                createdAt: new Date().toISOString(),
                importSource: file.name,
                importedAt: new Date().toISOString(),
                classLevel: classLevel // Store the grade level for reference
            };

            this.activities.push(activity);
        });

        // Save to localStorage
        this.saveData();

        // Record import
        this.recordImportedDocument({
            fileName: file.name,
            classificationType: 'ATTIVITA',
            importedCount: activitiesData.length,
            timestamp: new Date().toISOString()
        });

        // Render updated activities
        this.renderActivities();

        // Show success message
        const previewContent = document.getElementById('preview-content');
        previewContent.innerHTML = `
            <div class="success-message">
                ✅ <strong>Importazione completata con successo!</strong>
                <p>${activitiesData.length} attività sono state importate e sono ora disponibili nella sezione Attività.</p>
            </div>
            <div class="form-actions" style="margin-top: 20px;">
                <button class="btn btn-primary" onclick="app.switchTab('activities')">
                    📋 Vai alle Attività
                </button>
                <button class="btn btn-secondary" onclick="app.cancelImport()">
                    🔙 Chiudi
                </button>
            </div>
        `;
    }

    createClassMapping(activitiesData) {
        // NOTE: This function is kept for backward compatibility but is no longer used
        // Activities are imported at general level (Prima, Seconda, Terza) without
        // automatic assignment to specific class sections
        return {};
    }

    cancelImport() {
        // Reset state
        this.currentImportData = null;
        this.documentClassification = null;
        
        // Hide all sections
        document.getElementById('document-upload-status').style.display = 'none';
        document.getElementById('document-classification').style.display = 'none';
        document.getElementById('document-preview').style.display = 'none';
        
        // Reset file input
        const fileInput = document.getElementById('document-file-input');
        if (fileInput) fileInput.value = '';
    }

    refineWithAI() {
        alert('Funzionalità di affinamento con IA in fase di sviluppo');
        // TODO: Implement AI refinement for import data
    }

    recordImportedDocument(documentInfo) {
        this.importedDocuments.push(documentInfo);
        localStorage.setItem('imported-documents', JSON.stringify(this.importedDocuments));
        this.renderImportedDocuments();
    }

    renderImportedDocuments() {
        const listDiv = document.getElementById('imported-documents-list');
        
        if (this.importedDocuments.length === 0) {
            listDiv.innerHTML = '<p class="empty-state">Nessun documento importato</p>';
            return;
        }

        listDiv.innerHTML = this.importedDocuments.map((doc, index) => `
            <div class="imported-doc-item">
                <div class="doc-info">
                    <h4>📄 ${doc.fileName}</h4>
                    <p><strong>Tipo:</strong> ${doc.classificationType}</p>
                    <p><strong>Importati:</strong> ${doc.importedCount} elementi</p>
                    <p><strong>Data:</strong> ${new Date(doc.timestamp).toLocaleString('it-IT')}</p>
                </div>
            </div>
        `).join('');
    }

    // ========================================
    // AUDIO RECORDING MODULE METHODS
    // ========================================

    async startAudioRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            this.mediaRecorder = new MediaRecorder(stream);
            this.recordingChunks = [];
            
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.recordingChunks.push(event.data);
                }
            };
            
            this.mediaRecorder.onstop = () => {
                this.saveRecording();
            };
            
            this.mediaRecorder.start();
            this.recordingStartTime = Date.now();
            
            // Update UI
            document.getElementById('start-recording-btn').style.display = 'none';
            document.getElementById('stop-recording-btn').style.display = 'inline-block';
            document.getElementById('recording-timer').style.display = 'inline-block';
            
            // Start timer
            this.recordingTimer = setInterval(() => {
                const elapsed = Date.now() - this.recordingStartTime;
                const minutes = Math.floor(elapsed / 60000);
                const seconds = Math.floor((elapsed % 60000) / 1000);
                document.getElementById('timer-display').textContent = 
                    `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            }, 1000);
            
            document.getElementById('recording-status').innerHTML = 
                '<p class="success-message">🎙️ Registrazione in corso...</p>';
            
        } catch (error) {
            console.error('Error starting recording:', error);
            alert('Impossibile avviare la registrazione. Verifica i permessi del microfono.');
        }
    }

    stopAudioRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
            
            // Stop all tracks
            this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
            
            // Clear timer
            if (this.recordingTimer) {
                clearInterval(this.recordingTimer);
                this.recordingTimer = null;
            }
            
            // Update UI
            document.getElementById('start-recording-btn').style.display = 'inline-block';
            document.getElementById('stop-recording-btn').style.display = 'none';
            document.getElementById('recording-timer').style.display = 'none';
            
            document.getElementById('recording-status').innerHTML = 
                '<p class="success-message">✅ Registrazione salvata</p>';
        }
    }

    saveRecording() {
        const blob = new Blob(this.recordingChunks, { type: 'audio/webm' });
        const duration = Date.now() - this.recordingStartTime;
        
        // Create recording object
        const recording = {
            id: Date.now(),
            blob: blob,
            duration: duration,
            timestamp: new Date().toISOString(),
            activeClass: this.activeClass || 'N/D',
            context: this.generateRecordingContext()
        };
        
        // Store in memory (not in localStorage due to size limits)
        this.audioRecordings.push(recording);
        
        // Render recordings list
        this.renderRecordings();
        
        // Create notification
        this.createNotification({
            title: '🎙️ Registrazione Salvata',
            message: `Registrazione di ${Math.floor(duration / 1000)} secondi salvata con successo`,
            type: 'system',
            notificationId: `recording-${recording.id}`
        });
    }

    generateRecordingContext() {
        // Generate context information for the recording
        const context = {
            class: this.activeClass || null,
            date: new Date().toLocaleDateString('it-IT'),
            time: new Date().toLocaleTimeString('it-IT')
        };
        
        // Add current lesson if available
        const today = new Date().toISOString().split('T')[0];
        const todayLessons = this.lessons.filter(l => l.date === today);
        if (todayLessons.length > 0) {
            context.lesson = todayLessons[0].topic || todayLessons[0].subject;
        }
        
        return context;
    }

    renderRecordings() {
        const listDiv = document.getElementById('recordings-list');
        
        if (this.audioRecordings.length === 0) {
            listDiv.innerHTML = '<p class="empty-state">Nessuna registrazione disponibile</p>';
            return;
        }

        listDiv.innerHTML = `
            <h4>Registrazioni (${this.audioRecordings.length})</h4>
            ${this.audioRecordings.map(rec => {
                const durationMin = Math.floor(rec.duration / 60000);
                const durationSec = Math.floor((rec.duration % 60000) / 1000);
                const url = URL.createObjectURL(rec.blob);
                
                return `
                    <div class="recording-item">
                        <div class="recording-info">
                            <p><strong>📅 ${new Date(rec.timestamp).toLocaleString('it-IT')}</strong></p>
                            <p>Classe: ${rec.context.class || 'N/D'}</p>
                            ${rec.context.lesson ? `<p>Lezione: ${rec.context.lesson}</p>` : ''}
                            <p>Durata: ${durationMin}:${String(durationSec).padStart(2, '0')}</p>
                        </div>
                        <audio controls src="${url}"></audio>
                        <div class="recording-actions">
                            <button class="btn btn-sm btn-secondary" onclick="app.downloadRecording(${rec.id})">
                                💾 Download
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="app.deleteRecording(${rec.id})">
                                🗑️ Elimina
                            </button>
                        </div>
                    </div>
                `;
            }).join('')}
        `;
    }

    downloadRecording(id) {
        const recording = this.audioRecordings.find(r => r.id === id);
        if (!recording) return;
        
        const url = URL.createObjectURL(recording.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `registrazione-${new Date(recording.timestamp).toISOString()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
    }

    deleteRecording(id) {
        if (confirm('Sei sicuro di voler eliminare questa registrazione?')) {
            this.audioRecordings = this.audioRecordings.filter(r => r.id !== id);
            this.renderRecordings();
        }
    }

    // ==========================================
    // NEWS AND RSS FEEDS MODULE
    // ==========================================

    showAddFeedForm() {
        document.getElementById('add-feed-form').style.display = 'block';
    }

    hideAddFeedForm() {
        document.getElementById('add-feed-form').style.display = 'none';
        document.getElementById('feed-name').value = '';
        document.getElementById('feed-url').value = '';
        document.getElementById('feed-category').value = 'istituzionale';
    }

    async addRSSFeed() {
        const name = document.getElementById('feed-name').value.trim();
        const url = document.getElementById('feed-url').value.trim();
        const category = document.getElementById('feed-category').value;

        if (!name || !url) {
            alert('Inserisci nome e URL del feed');
            return;
        }

        const feed = {
            id: Date.now().toString(),
            name: name,
            url: url,
            category: category,
            addedDate: new Date().toISOString(),
            lastFetched: null,
            itemCount: 0,
            active: true
        };

        this.rssFeeds.push(feed);
        this.saveData();
        this.hideAddFeedForm();
        this.renderFeeds();

        // Fetch news from this feed immediately
        await this.fetchFeedNews(feed.id);
    }

    async fetchFeedNews(feedId) {
        const feed = this.rssFeeds.find(f => f.id === feedId);
        if (!feed) return;

        try {
            // Use a CORS proxy to fetch the RSS feed
            const corsProxy = 'https://api.allorigins.win/raw?url=';
            const response = await fetch(corsProxy + encodeURIComponent(feed.url));
            
            if (!response.ok) {
                throw new Error('Errore nel caricamento del feed');
            }

            const text = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, 'text/xml');

            // Check for RSS or Atom format
            const items = xmlDoc.querySelectorAll('item');
            const entries = xmlDoc.querySelectorAll('entry');

            let newsArray = [];

            if (items.length > 0) {
                // RSS format
                items.forEach(item => {
                    const newsItem = {
                        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                        feedId: feedId,
                        feedName: feed.name,
                        category: feed.category,
                        title: item.querySelector('title')?.textContent || 'Senza titolo',
                        link: item.querySelector('link')?.textContent || '',
                        description: item.querySelector('description')?.textContent || '',
                        pubDate: item.querySelector('pubDate')?.textContent || new Date().toISOString(),
                        fetchedDate: new Date().toISOString()
                    };
                    newsArray.push(newsItem);
                });
            } else if (entries.length > 0) {
                // Atom format
                entries.forEach(entry => {
                    const newsItem = {
                        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                        feedId: feedId,
                        feedName: feed.name,
                        category: feed.category,
                        title: entry.querySelector('title')?.textContent || 'Senza titolo',
                        link: entry.querySelector('link')?.getAttribute('href') || '',
                        description: entry.querySelector('summary')?.textContent || entry.querySelector('content')?.textContent || '',
                        pubDate: entry.querySelector('published')?.textContent || entry.querySelector('updated')?.textContent || new Date().toISOString(),
                        fetchedDate: new Date().toISOString()
                    };
                    newsArray.push(newsItem);
                });
            }

            // Add news items that don't already exist
            newsArray.forEach(newsItem => {
                const exists = this.newsItems.some(n => n.link === newsItem.link && n.feedId === feedId);
                if (!exists) {
                    this.newsItems.unshift(newsItem);
                }
            });

            // Update feed metadata
            feed.lastFetched = new Date().toISOString();
            feed.itemCount = newsArray.length;

            this.saveData();
            this.renderFeeds();
            this.renderNews();
            this.updateNewsFilters();

            return newsArray.length;

        } catch (error) {
            console.error('Error fetching feed:', error);
            alert(`Errore nel caricamento del feed "${feed.name}": ${error.message}`);
            return 0;
        }
    }

    async refreshAllFeeds() {
        if (this.rssFeeds.length === 0) {
            alert('Nessun feed RSS configurato');
            return;
        }

        const feedsList = document.getElementById('feeds-list');
        if (feedsList) {
            feedsList.innerHTML = '<div class="loading-spinner">🔄 Aggiornamento feed in corso...</div>';
        }

        let totalNews = 0;
        for (const feed of this.rssFeeds.filter(f => f.active)) {
            const count = await this.fetchFeedNews(feed.id);
            totalNews += count;
        }

        alert(`Aggiornamento completato! ${totalNews} nuove news caricate.`);
    }

    deleteFeed(feedId) {
        if (!confirm('Sei sicuro di voler eliminare questa fonte RSS?')) {
            return;
        }

        // Remove feed
        this.rssFeeds = this.rssFeeds.filter(f => f.id !== feedId);
        
        // Remove associated news
        this.newsItems = this.newsItems.filter(n => n.feedId !== feedId);
        
        this.saveData();
        this.renderFeeds();
        this.renderNews();
        this.updateNewsFilters();
    }

    toggleFeedActive(feedId) {
        const feed = this.rssFeeds.find(f => f.id === feedId);
        if (feed) {
            feed.active = !feed.active;
            this.saveData();
            this.renderFeeds();
        }
    }

    renderFeeds() {
        const feedsList = document.getElementById('feeds-list');
        if (!feedsList) return;

        if (this.rssFeeds.length === 0) {
            feedsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📡</div>
                    <p>Nessuna fonte RSS configurata</p>
                    <p><small>Aggiungi una fonte RSS per iniziare a ricevere news</small></p>
                </div>
            `;
            return;
        }

        feedsList.innerHTML = this.rssFeeds.map(feed => {
            const lastFetched = feed.lastFetched 
                ? new Date(feed.lastFetched).toLocaleString('it-IT')
                : 'Mai';

            return `
                <div class="feed-item">
                    <div class="feed-item-header">
                        <div>
                            <div class="feed-item-title">${feed.name}</div>
                            <span class="feed-item-category">${feed.category}</span>
                        </div>
                        <div>
                            ${feed.active ? '✅' : '⏸️'}
                        </div>
                    </div>
                    <div class="feed-item-url">${feed.url}</div>
                    <div class="feed-item-meta">
                        <span>📊 ${feed.itemCount} news</span>
                        <span>🕐 Ultimo aggiornamento: ${lastFetched}</span>
                    </div>
                    <div class="feed-item-actions">
                        <button class="btn btn-sm btn-secondary" onclick="app.fetchFeedNews('${feed.id}')">🔄 Aggiorna</button>
                        <button class="btn btn-sm btn-secondary" onclick="app.toggleFeedActive('${feed.id}')">${feed.active ? '⏸️ Disattiva' : '▶️ Attiva'}</button>
                        <button class="btn btn-sm btn-danger" onclick="app.deleteFeed('${feed.id}')">🗑️ Elimina</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    filterNews() {
        const sourceFilter = document.getElementById('news-filter-source').value;
        const categoryFilter = document.getElementById('news-filter-category').value;
        
        this.newsFilter = {
            source: sourceFilter,
            category: categoryFilter
        };

        this.renderNews();
    }

    renderNews() {
        const newsList = document.getElementById('news-list');
        if (!newsList) return;

        let filteredNews = [...this.newsItems];

        // Apply filters
        if (this.newsFilter.source) {
            filteredNews = filteredNews.filter(n => n.feedId === this.newsFilter.source);
        }
        if (this.newsFilter.category) {
            filteredNews = filteredNews.filter(n => n.category === this.newsFilter.category);
        }

        // Sort by date (newest first)
        filteredNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

        if (filteredNews.length === 0) {
            newsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📰</div>
                    <p>Nessuna news disponibile</p>
                    <p><small>Aggiungi fonti RSS e aggiorna per vedere le news</small></p>
                </div>
            `;
            return;
        }

        newsList.innerHTML = filteredNews.slice(0, 50).map(news => {
            const pubDate = new Date(news.pubDate).toLocaleString('it-IT');
            const description = news.description.length > 300 
                ? news.description.substring(0, 300) + '...'
                : news.description;

            return `
                <div class="news-item">
                    <div class="news-item-header">
                        <div>
                            <div class="news-item-title">
                                <a href="${news.link}" target="_blank" rel="noopener noreferrer">${news.title}</a>
                            </div>
                            <div class="news-item-meta">
                                <span class="news-item-source">📡 ${news.feedName}</span>
                                <span>🏷️ ${news.category}</span>
                                <span>📅 ${pubDate}</span>
                            </div>
                        </div>
                    </div>
                    <div class="news-item-description">${this.stripHtml(description)}</div>
                    <div class="news-item-actions">
                        <a href="${news.link}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary">📖 Leggi</a>
                        <button class="btn btn-sm btn-secondary" onclick="app.openAIAgentWithNews('${news.link}', '${this.escapeHtml(news.title)}')">🤖 Analizza con IA</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateNewsFilters() {
        const sourceSelect = document.getElementById('news-filter-source');
        if (!sourceSelect) return;

        // Populate source filter
        const currentValue = sourceSelect.value;
        sourceSelect.innerHTML = '<option value="">Tutte le fonti</option>';
        this.rssFeeds.forEach(feed => {
            const option = document.createElement('option');
            option.value = feed.id;
            option.textContent = feed.name;
            if (feed.id === currentValue) {
                option.selected = true;
            }
            sourceSelect.appendChild(option);
        });
    }

    stripHtml(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML.replace(/"/g, '&quot;');
    }

    // ==========================================
    // AI AGENT FOR NEWS ANALYSIS
    // ==========================================

    toggleAIAgentModal() {
        const modal = document.getElementById('ai-agent-modal');
        if (modal) {
            modal.style.display = modal.style.display === 'none' ? 'flex' : 'none';
        }
    }

    closeAIAgentModal() {
        const modal = document.getElementById('ai-agent-modal');
        if (modal) {
            modal.style.display = 'none';
        }
        // Clear form
        document.getElementById('ai-agent-news-url').value = '';
        document.getElementById('ai-agent-context').value = '';
        document.getElementById('ai-agent-results').style.display = 'none';
    }

    openAIAgentWithNews(newsUrl, newsTitle) {
        this.toggleAIAgentModal();
        document.getElementById('ai-agent-news-url').value = newsUrl;
        document.getElementById('ai-agent-context').value = `Analizza questa news: "${newsTitle}" ed estrai date, scadenze, documenti e soggetti coinvolti.`;
    }

    setAIAgentPrompt(prompt) {
        document.getElementById('ai-agent-context').value = prompt;
    }

    async analyzeNewsWithAI() {
        const newsUrl = document.getElementById('ai-agent-news-url').value.trim();
        const context = document.getElementById('ai-agent-context').value.trim();

        if (!newsUrl) {
            alert('Inserisci l\'URL della news da analizzare');
            return;
        }

        const apiKey = localStorage.getItem('openrouter-api-key');
        if (!apiKey) {
            alert('Configura la tua API key di OpenRouter nelle impostazioni prima di usare l\'IA');
            this.switchTab('settings');
            return;
        }

        // Show loading state
        const resultsDiv = document.getElementById('ai-agent-results');
        const resultsContent = document.getElementById('ai-agent-results-content');
        const actionsDiv = document.getElementById('ai-agent-actions');
        
        resultsDiv.style.display = 'block';
        resultsContent.innerHTML = '<div class="loading-spinner">🤖 Analisi in corso...</div>';
        actionsDiv.style.display = 'none';

        try {
            // Build the AI prompt
            const prompt = `
Analizza la news disponibile al seguente URL: ${newsUrl}

${context ? `Richiesta specifica: ${context}` : 'Estrai tutte le informazioni rilevanti per un docente.'}

Fornisci un'analisi strutturata con:
1. 📅 DATE E SCADENZE: Identifica tutte le date importanti e scadenze menzionate
2. 📎 DOCUMENTI: Elenca eventuali documenti, moduli o allegati menzionati
3. 👥 SOGGETTI: Identifica destinatari, uffici, responsabili coinvolti
4. 📋 AZIONI CONSIGLIATE: Proponi azioni concrete che il docente dovrebbe intraprendere

Per ogni azione consigliata, specifica il tipo (es. SCADENZA, PROMEMORIA, CIRCOLARE, ATTIVITÀ) e i dettagli necessari.

Rispondi in italiano in modo chiaro e strutturato.
            `;

            const response = await this.callOpenRouterAPI(prompt, apiKey);

            if (response && response.content) {
                resultsContent.innerHTML = response.content.replace(/\n/g, '<br>');

                // Try to extract proposed actions from the response
                this.extractProposedActions(response.content);
            }

        } catch (error) {
            console.error('Error analyzing news with AI:', error);
            resultsContent.innerHTML = `<div class="error-message">Errore nell'analisi: ${error.message}</div>`;
        }
    }

    extractProposedActions(aiResponse) {
        const actionsDiv = document.getElementById('ai-agent-actions');
        const proposedActionsDiv = document.getElementById('ai-agent-proposed-actions');

        // Simple parsing to extract actions
        // This is a basic implementation - in a real scenario, you might want structured output from the AI
        const lines = aiResponse.split('\n');
        const actions = [];

        let inActionsSection = false;
        for (const line of lines) {
            if (line.toLowerCase().includes('azioni consigliate') || line.toLowerCase().includes('azioni proposte')) {
                inActionsSection = true;
                continue;
            }

            if (inActionsSection && line.trim()) {
                // Look for action indicators
                if (line.match(/SCADENZA|PROMEMORIA|CIRCOLARE|ATTIVITÀ|TODO/i)) {
                    actions.push({
                        text: line.trim(),
                        type: this.detectActionType(line)
                    });
                }
            }
        }

        if (actions.length > 0) {
            actionsDiv.style.display = 'block';
            proposedActionsDiv.innerHTML = actions.map((action, index) => `
                <div class="proposed-action-item">
                    <div class="proposed-action-text">
                        <span class="proposed-action-type">${action.type}</span>
                        ${action.text}
                    </div>
                    <button class="btn btn-sm btn-primary" onclick="app.createItemFromAction(${index}, '${action.type}')">✅ Crea</button>
                </div>
            `).join('');
        }
    }

    detectActionType(text) {
        if (text.match(/SCADENZA|deadline|entro|scade/i)) return 'SCADENZA';
        if (text.match(/PROMEMORIA|ricorda|reminder/i)) return 'PROMEMORIA';
        if (text.match(/CIRCOLARE|comunicazione|avviso/i)) return 'CIRCOLARE';
        if (text.match(/ATTIVITÀ|compito|task/i)) return 'ATTIVITÀ';
        return 'AZIONE';
    }

    createItemFromAction(actionIndex, actionType) {
        // This would create an actual item based on the action type
        // For now, we'll show an alert
        alert(`Funzionalità in sviluppo: Creazione automatica di ${actionType} dall'analisi IA.`);
        
        // In a full implementation, this would:
        // - Extract details from the action text
        // - Create a reminder, activity, or notification based on the type
        // - Save to the appropriate data structure
        // - Navigate to the relevant section
    }
}

// Initialize the application
const app = new DocentePlusPlus();
