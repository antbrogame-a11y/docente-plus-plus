document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTI PRINCIPALI ---
    const mainContent = document.querySelector('main');
    const navItems = document.querySelectorAll('.nav-item');

    // --- FIREBASE e AI ---
    let firebaseConfig = {};
    let app;
    let vertex;
    let model;

    // --- CHIAVI DATI ---
    const DATA_KEYS = ['docentepp_classes', 'docentepp_students', 'docentepp_evaluations', 'docentepp_lessons', 'docentepp_activities', 'docentepp_schedule'];

    // --- GESTIONE DATI ---
    const loadData = (key, defaults) => {
        try {
            const dataJSON = localStorage.getItem(key);
            return dataJSON ? JSON.parse(dataJSON) : defaults;
        } catch {
            return defaults;
        }
    };
    const saveData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

    // --- INIZIALIZZAZIONE APP ---
    const initializeApp = () => {
        // Setup navigazione
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const tab = item.dataset.tab;
                navigateToTab(tab, true);
            });
        });

        // Carica la tab iniziale (Agenda)
        const initialTab = 'agenda';
        document.querySelector(`.nav-item[data-tab="${initialTab}"]`).classList.add('active');
        loadContent(initialTab);
    };

    // --- ROUTING E CARICAMENTO CONTENUTI ---
    const navigateToTab = (tab, isClick = false) => {
        if (!isClick) {
            document.querySelector(`.nav-item[data-tab="${tab}"]`)?.click();
        } else {
            document.querySelector('.nav-item.active')?.classList.remove('active');
            document.querySelector(`.nav-item[data-tab="${tab}"]`)?.classList.add('active');
            loadContent(tab);
        }
    };

    const loadContent = (tab) => {
        fetch(`${tab}.html`)
            .then(response => response.ok ? response.text() : Promise.reject(`File non trovato`))
            .then(html => {
                mainContent.innerHTML = html;
                setupTab(tab);
            })
            .catch(error => {
                mainContent.innerHTML = `<h2>Pagina non trovata</h2><p>${error}</p>`;
            });
    };

    const setupTab = (tab) => {
        const setups = {
            'agenda': setupAgenda,
            'classes': setupClasses,
            'students': () => {},
            'lessons': () => {},
            'activities': () => {},
            'evaluations': () => {},
            'statistiche': setupStatistiche,
            'aiAssistant': setupAiAssistant,
            'documentImport': () => {},
            'settings': () => {},
            'help': () => {},
        };
        setups[tab]?.();
    };

    // --- SETUP SEZIONI ---

    const setupAgenda = () => {
        // ... (logica agenda invariata)
    };

    const setupAiAssistant = () => {
        // ... (logica assistente IA invariata)
    };

    const setupClasses = () => {
        // ... (logica classi invariata)
    };

    const setupStatistiche = () => {
        const classSelector = document.getElementById('stats-class-selector');
        const generalReportDiv = document.getElementById('stats-general-report');
        const classSpecificReportDiv = document.getElementById('stats-class-specific-report');
        const generalContentDiv = document.getElementById('general-stats-content');
        const classSpecificContentDiv = document.getElementById('class-specific-stats-content');
        const classSpecificTitle = document.getElementById('class-specific-title');

        const classes = loadData('docentepp_classes', []);
        const students = loadData('docentepp_students', []);
        const evaluations = loadData('docentepp_evaluations', []);

        const calculateAverage = (grades) => {
            if (grades.length === 0) return 0;
            const sum = grades.reduce((acc, curr) => acc + curr, 0);
            return sum / grades.length;
        };

        // Popola il selettore delle classi
        classes.forEach(c => {
            const option = document.createElement('option');
            option.value = c.id;
            option.textContent = c.name;
            classSelector.appendChild(option);
        });

        const renderStats = (classId) => {
            if (classId === 'all') {
                generalReportDiv.style.display = 'block';
                classSpecificReportDiv.style.display = 'none';
                renderGeneralReport();
            } else {
                generalReportDiv.style.display = 'none';
                classSpecificReportDiv.style.display = 'block';
                renderClassSpecificReport(Number(classId));
            }
        };

        const renderGeneralReport = () => {
            if (classes.length === 0) {
                generalContentDiv.innerHTML = '<p>Nessuna classe da analizzare. Aggiungi prima una classe.</p>';
                return;
            }

            let html = '<table><thead><tr><th>Classe</th><th>N° Studenti</th><th>N° Valutazioni</th><th>Media Generale</th></tr></thead><tbody>';
            classes.forEach(c => {
                const studentsInClass = students.filter(s => s.classId === c.id);
                const studentIds = studentsInClass.map(s => s.id);
                const evalsInClass = evaluations.filter(ev => studentIds.includes(ev.studentId));
                const grades = evalsInClass.map(ev => ev.grade);
                const avg = calculateAverage(grades);

                html += `
                    <tr>
                        <td>${c.name}</td>
                        <td>${studentsInClass.length}</td>
                        <td>${evalsInClass.length}</td>
                        <td>${avg.toFixed(2)}</td>
                    </tr>
                `;
            });
            html += '</tbody></table>';
            generalContentDiv.innerHTML = html;
        };

        const renderClassSpecificReport = (classId) => {
            const selectedClass = classes.find(c => c.id === classId);
            if (!selectedClass) return;

            classSpecificTitle.textContent = `Report Dettagliato: ${selectedClass.name}`;
            const studentsInClass = students.filter(s => s.classId === classId);

            if (studentsInClass.length === 0) {
                classSpecificContentDiv.innerHTML = '<p>Nessuno studente in questa classe.</p>';
                return;
            }

            let html = '<table><thead><tr><th>Studente</th><th>N° Valutazioni</th><th>Media Voti</th></tr></thead><tbody>';
            studentsInClass.forEach(s => {
                const studentEvals = evaluations.filter(ev => ev.studentId === s.id);
                const grades = studentEvals.map(ev => ev.grade);
                const avg = calculateAverage(grades);

                html += `
                    <tr>
                        <td>${s.name} ${s.surname}</td>
                        <td>${studentEvals.length}</td>
                        <td>${avg.toFixed(2)}</td>
                    </tr>
                `;
            });
            html += '</tbody></table>';
            classSpecificContentDiv.innerHTML = html;
        };

        classSelector.addEventListener('change', (e) => renderStats(e.target.value));

        // Render iniziale
        renderStats('all');
    };

    // --- CARICAMENTO CONFIGURAZIONE FIREBASE ---
    fetch('./firebase-config.json')
        .then(response => {
            if (!response.ok) throw new Error('firebase-config.json non trovato.');
            return response.json();
        })
        .then(config => {
            firebaseConfig = config;
            app = firebase.initializeApp(firebaseConfig);
            vertex = firebase.vertexAI();
            model = vertex.getGenerativeModel({ model: "gemini-pro" });
            console.log("Firebase e Gemini inizializzati.");
        })
        .catch(error => {
            console.error("Errore inizializzazione Firebase:", error);
            const setupOriginal = setupAiAssistant;
            setupAiAssistant = () => {
                setupOriginal();
                const chatBox = document.getElementById('ai-chat-box');
                if(chatBox) chatBox.innerHTML = `<div class="chat-message ai-error-message">Impossibile inizializzare l'Assistente AI. Controlla la console per i dettagli.</div>`;
            }
        })
        .finally(() => {
            initializeApp();
        });
});