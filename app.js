// Docente++ - Main Application JavaScript
// Web app for teacher didactics management powered by OpenRouter AI

class DocentePlusPlus {
    constructor() {
        this.lessons = [];
        this.students = [];
        this.settings = {};
        this.chatMessages = [];
        this.activeClass = '';
        this.selectedFile = null;
        this.init();
    }

    init() {
        // Load data from localStorage
        this.loadData();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Render initial data
        this.renderDashboard();
        this.renderLessons();
        this.renderStudents();
        this.loadSettings();
        this.loadActiveClass();
        
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

        // AI input
        const aiInput = document.getElementById('ai-input');
        if (aiInput) {
            aiInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                    this.sendAIMessage();
                }
            });
        }
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
    }

    // Dashboard methods
    renderDashboard() {
        document.getElementById('lesson-count').textContent = this.lessons.length;
        document.getElementById('student-count').textContent = this.students.length;
        document.getElementById('evaluation-count').textContent = '0';
        
        const apiKey = localStorage.getItem('openrouter-api-key');
        document.getElementById('ai-status').textContent = apiKey ? '✓' : '✗';
        
        // Update active class display
        this.updateClassDisplay();
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
            class: document.getElementById('lesson-class').value,
            date: document.getElementById('lesson-date').value,
            time: document.getElementById('lesson-time').value || '',
            type: document.getElementById('lesson-type').value || 'normal',
            status: document.getElementById('lesson-status').value || 'planned',
            description: document.getElementById('lesson-description').value,
            notes: document.getElementById('lesson-notes').value || '',
            materials: document.getElementById('lesson-materials').value || '',
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString()
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

    editLesson(id) {
        const lesson = this.lessons.find(l => l.id === id);
        if (!lesson) return;

        // Populate form with lesson data
        document.getElementById('lesson-title').value = lesson.title;
        document.getElementById('lesson-subject').value = lesson.subject;
        document.getElementById('lesson-class').value = lesson.class || '';
        document.getElementById('lesson-date').value = lesson.date;
        document.getElementById('lesson-time').value = lesson.time || '';
        document.getElementById('lesson-type').value = lesson.type || 'normal';
        document.getElementById('lesson-status').value = lesson.status || 'planned';
        document.getElementById('lesson-description').value = lesson.description || '';
        document.getElementById('lesson-notes').value = lesson.notes || '';
        document.getElementById('lesson-materials').value = lesson.materials || '';

        // Delete the old lesson (it will be re-added with same data or modified)
        this.lessons = this.lessons.filter(l => l.id !== id);

        // Show form
        this.showAddLessonForm();
    }

    updateLessonStatus(id) {
        const lesson = this.lessons.find(l => l.id === id);
        if (!lesson) return;

        const statuses = ['planned', 'completed', 'modified', 'skipped'];
        const statusLabels = {
            'planned': '📅 Pianificata',
            'completed': '✅ Svolta',
            'modified': '✏️ Modificata',
            'skipped': '⏭️ Saltata'
        };

        const currentIndex = statuses.indexOf(lesson.status || 'planned');
        const nextIndex = (currentIndex + 1) % statuses.length;
        lesson.status = statuses[nextIndex];
        lesson.modifiedAt = new Date().toISOString();

        this.saveData();
        this.renderLessons();
        this.renderDashboard();
    }

    showAnnualProgramming() {
        document.getElementById('annual-programming-modal').style.display = 'flex';
    }

    hideAnnualProgramming() {
        document.getElementById('annual-programming-modal').style.display = 'none';
        document.getElementById('programming-preview').innerHTML = '';
    }

    generateAnnualProgramming() {
        const className = document.getElementById('programming-class').value;
        const subject = document.getElementById('programming-subject').value;
        const weeks = parseInt(document.getElementById('programming-weeks').value) || 33;
        const lessonsPerWeek = parseInt(document.getElementById('programming-lessons-per-week').value) || 2;

        if (!className || !subject) {
            alert('Seleziona una classe e inserisci una materia');
            return;
        }

        const totalLessons = weeks * lessonsPerWeek;
        const startDate = new Date();
        const preview = document.getElementById('programming-preview');
        
        preview.innerHTML = `
            <div class="programming-summary">
                <h4>Anteprima Programmazione</h4>
                <p><strong>Classe:</strong> ${className}</p>
                <p><strong>Materia:</strong> ${subject}</p>
                <p><strong>Totale lezioni:</strong> ${totalLessons}</p>
                <p><strong>Periodo:</strong> ${weeks} settimane</p>
                <button class="btn btn-primary" onclick="app.confirmAnnualProgramming('${className}', '${subject}', ${weeks}, ${lessonsPerWeek})">
                    Conferma e Crea Lezioni
                </button>
            </div>
        `;
    }

    confirmAnnualProgramming(className, subject, weeks, lessonsPerWeek) {
        const totalLessons = weeks * lessonsPerWeek;
        const startDate = new Date();
        
        // Generate lessons
        for (let week = 0; week < weeks; week++) {
            for (let lessonNum = 0; lessonNum < lessonsPerWeek; lessonNum++) {
                const lessonDate = new Date(startDate);
                lessonDate.setDate(lessonDate.getDate() + (week * 7) + (lessonNum * Math.floor(7 / lessonsPerWeek)));
                
                const lesson = {
                    id: Date.now() + week * 1000 + lessonNum,
                    title: `${subject} - Settimana ${week + 1} - Lezione ${lessonNum + 1}`,
                    subject: subject,
                    class: className,
                    date: lessonDate.toISOString().split('T')[0],
                    time: '',
                    type: 'normal',
                    status: 'planned',
                    description: `Lezione ${lessonNum + 1} della settimana ${week + 1}`,
                    notes: '',
                    materials: '',
                    createdAt: new Date().toISOString(),
                    modifiedAt: new Date().toISOString(),
                    annualProgramming: true
                };
                
                this.lessons.push(lesson);
            }
        }

        this.saveData();
        this.renderLessons();
        this.renderDashboard();
        this.hideAnnualProgramming();
        alert(`${totalLessons} lezioni create con successo!`);
    }

    async generateAnnualProgrammingWithAI() {
        const apiKey = localStorage.getItem('openrouter-api-key');
        
        if (!apiKey) {
            alert('Configura la tua API key di OpenRouter nelle impostazioni prima di usare l\'IA');
            this.switchTab('settings');
            return;
        }

        const className = document.getElementById('programming-class').value;
        const subject = document.getElementById('programming-subject').value;
        const weeks = parseInt(document.getElementById('programming-weeks').value) || 33;
        const lessonsPerWeek = parseInt(document.getElementById('programming-lessons-per-week').value) || 2;

        if (!className || !subject) {
            alert('Seleziona una classe e inserisci una materia');
            return;
        }

        const preview = document.getElementById('programming-preview');
        preview.innerHTML = '<p>Generazione programmazione con IA in corso...</p>';

        try {
            const response = await this.callOpenRouterAPI(
                `Genera una programmazione annuale dettagliata per ${subject} per la classe ${className}.
                La programmazione deve coprire ${weeks} settimane con ${lessonsPerWeek} lezioni a settimana.
                Per ogni lezione, fornisci: titolo, descrizione breve, obiettivi, e materiali suggeriti.
                Organizza le lezioni in modo progressivo e didattico.
                Rispondi in formato JSON con array di oggetti lezione con campi: week, lessonNumber, title, description, objectives, materials.`,
                apiKey
            );

            if (response && response.content) {
                preview.innerHTML = `
                    <div class="ai-programming-result">
                        <h4>Programmazione generata dall'IA</h4>
                        <pre>${response.content}</pre>
                        <button class="btn btn-primary" onclick="app.confirmAnnualProgramming('${className}', '${subject}', ${weeks}, ${lessonsPerWeek})">
                            Usa Programmazione Base
                        </button>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error generating annual programming:', error);
            preview.innerHTML = `<p class="error">Errore nella generazione: ${error.message}</p>`;
        }
    }

    renderLessons() {
        const lessonsList = document.getElementById('lessons-list');
        
        // Get filter values
        const filterStatus = document.getElementById('filter-status')?.value || '';
        const filterClass = document.getElementById('filter-class')?.value || '';
        const filterType = document.getElementById('filter-type')?.value || '';
        
        // Filter lessons
        let filteredLessons = this.lessons;
        if (filterStatus) {
            filteredLessons = filteredLessons.filter(l => l.status === filterStatus);
        }
        if (filterClass) {
            filteredLessons = filteredLessons.filter(l => l.class === filterClass);
        }
        if (filterType) {
            filteredLessons = filteredLessons.filter(l => (l.type || 'normal') === filterType);
        }
        
        if (filteredLessons.length === 0) {
            lessonsList.innerHTML = `
                <div class="empty-state">
                    <h3>Nessuna lezione trovata</h3>
                    <p>Inizia aggiungendo una nuova lezione o generandola con l'IA</p>
                </div>
            `;
            return;
        }

        // Get status and type labels
        const getStatusLabel = (status) => {
            const labels = {
                'planned': '📅 Pianificata',
                'completed': '✅ Svolta',
                'modified': '✏️ Modificata',
                'skipped': '⏭️ Saltata'
            };
            return labels[status] || '📅 Pianificata';
        };

        const getTypeLabel = (type) => {
            const labels = {
                'normal': '📝 Standard',
                'lab': '🔬 Laboratorio',
                'test': '✅ Verifica',
                'review': '📚 Ripasso',
                'presentation': '🎤 Presentazione',
                'project': '🎨 Progetto'
            };
            return labels[type || 'normal'] || '📝 Standard';
        };

        lessonsList.innerHTML = filteredLessons
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(lesson => `
                <div class="lesson-item lesson-status-${lesson.status || 'planned'}">
                    <div class="lesson-header">
                        <h4>${lesson.title}</h4>
                        <span class="lesson-status-badge">${getStatusLabel(lesson.status || 'planned')}</span>
                    </div>
                    <div class="lesson-details">
                        <p><strong>🎯 Tipo:</strong> ${getTypeLabel(lesson.type)}</p>
                        <p><strong>📚 Materia:</strong> ${lesson.subject}</p>
                        ${lesson.class ? `<p><strong>👥 Classe:</strong> ${lesson.class}</p>` : ''}
                        <p><strong>📅 Data:</strong> ${new Date(lesson.date).toLocaleDateString('it-IT')}${lesson.time ? ` - ⏰ ${lesson.time}` : ''}</p>
                        ${lesson.description ? `<p><strong>📝 Descrizione:</strong> ${lesson.description}</p>` : ''}
                        ${lesson.notes ? `<p><strong>📌 Note:</strong> ${lesson.notes}</p>` : ''}
                        ${lesson.materials ? `<p><strong>🎒 Materiali:</strong> ${lesson.materials}</p>` : ''}
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-sm btn-primary" onclick="app.editLesson(${lesson.id})">Modifica</button>
                        <button class="btn btn-sm btn-secondary" onclick="app.updateLessonStatus(${lesson.id})">Cambia Stato</button>
                        <button class="btn btn-sm btn-danger" onclick="app.deleteLesson(${lesson.id})">Elimina</button>
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
                    <p>Inizia aggiungendo un nuovo studente</p>
                </div>
            `;
            return;
        }

        studentsList.innerHTML = this.students.map(student => `
            <div class="student-item">
                <h4>${student.name}</h4>
                <p><strong>Email:</strong> ${student.email || 'N/D'}</p>
                <p><strong>Classe:</strong> ${student.class || 'N/D'}</p>
                <div class="item-actions">
                    <button class="btn btn-danger" onclick="app.deleteStudent(${student.id})">Elimina</button>
                </div>
            </div>
        `).join('');
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
        const teacherName = document.getElementById('teacher-name').value;
        const schoolName = document.getElementById('school-name').value;
        const schoolYear = document.getElementById('school-year').value;

        if (apiKey) {
            localStorage.setItem('openrouter-api-key', apiKey);
        }
        if (modelId) {
            localStorage.setItem('openrouter-model-id', modelId);
        }
        if (teacherName) {
            localStorage.setItem('teacher-name', teacherName);
        }
        if (schoolName) {
            localStorage.setItem('school-name', schoolName);
        }
        if (schoolYear) {
            localStorage.setItem('school-year', schoolYear);
        }

        this.renderDashboard();
        alert('Impostazioni salvate con successo!');
    }

    loadSettings() {
        const apiKey = localStorage.getItem('openrouter-api-key');
        const modelId = localStorage.getItem('openrouter-model-id');
        const teacherName = localStorage.getItem('teacher-name');
        const schoolName = localStorage.getItem('school-name');
        const schoolYear = localStorage.getItem('school-year');

        if (apiKey) {
            document.getElementById('openrouter-api-key').value = apiKey;
        }
        if (modelId) {
            document.getElementById('openrouter-model-id').value = modelId;
        }
        if (teacherName) {
            document.getElementById('teacher-name').value = teacherName;
        }
        if (schoolName) {
            document.getElementById('school-name').value = schoolName;
        }
        if (schoolYear) {
            document.getElementById('school-year').value = schoolYear;
        }

        // Initialize API key status icon
        const statusIcon = document.getElementById('api-key-status');
        if (statusIcon) {
            statusIcon.textContent = '⚪';
            statusIcon.className = 'api-key-status unverified';
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
    }

    loadData() {
        const lessonsData = localStorage.getItem('docente-plus-lessons');
        const studentsData = localStorage.getItem('docente-plus-students');

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
    }

    exportData() {
        const data = {
            lessons: this.lessons,
            students: this.students,
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `docente-plus-export-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
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
                    
                    this.saveData();
                    this.renderLessons();
                    this.renderStudents();
                    this.renderDashboard();
                    
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
}

// Initialize the application
const app = new DocentePlusPlus();
