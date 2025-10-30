
// Funzione di setup per la sezione Agenda, caricata dinamicamente.
const setupAgenda = () => {

    // Tenta di accedere alle funzioni globali definite in app.js
    if (typeof loadData !== 'function' || typeof navigateToTab !== 'function') {
        console.error('Le funzioni globali loadData o navigateToTab non sono state trovate. Assicurati che app.js sia caricato correttamente.');
        return;
    }

    // --- ELEMENTI DEL DOM ---
    const statsClassCount = document.getElementById('stats-class-count');
    const statsStudentCount = document.getElementById('stats-student-count');
    const latestEvaluationsList = document.getElementById('latest-evaluations-list');
    const quickAddClassBtn = document.getElementById('quick-add-class');
    const quickAddStudentBtn = document.getElementById('quick-add-student');
    const quickAddEvaluationBtn = document.getElementById('quick-add-evaluation');

    // --- CARICAMENTO DATI ---
    const classes = loadData('docentepp_classes', []);
    const students = loadData('docentepp_students', []);
    const evaluations = loadData('docentepp_evaluations', []);

    // --- AGGIORNAMENTO STATISTICHE RAPIDE ---
    if (statsClassCount) {
        statsClassCount.textContent = classes.length;
    }
    if (statsStudentCount) {
        statsStudentCount.textContent = students.length;
    }

    // --- POPOLAMENTO ULTIME VALUTAZIONI ---
    if (latestEvaluationsList) {
        latestEvaluationsList.innerHTML = ''; // Svuota la lista

        if (evaluations.length === 0) {
            latestEvaluationsList.innerHTML = '<p class="empty-list-message">Nessuna valutazione registrata.</p>';
        } else {
            // Ordina le valutazioni per data (ipotizzando una prop 'date') e prendi le ultime 5
            const recentEvaluations = evaluations.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

            recentEvaluations.forEach(ev => {
                const student = students.find(s => s.id === ev.studentId);
                const listItem = document.createElement('div');
                listItem.className = 'list-item';
                
                const studentName = student ? `${student.name} ${student.surname}` : 'Studente non trovato';
                const grade = ev.grade || 'N/D';
                const subject = ev.subject || 'Materia non specificata';

                listItem.innerHTML = `
                    <div class="list-item-main">
                        <span class="material-symbols-outlined">person</span>
                        <span><strong>${studentName}</strong></span>
                    </div>
                    <div class="list-item-details">
                        <span>Voto: <strong>${grade}</strong> in ${subject}</span>
                    </div>
                `;
                latestEvaluationsList.appendChild(listItem);
            });
        }
    }

    // --- SETUP AZIONI RAPIDE ---
    if (quickAddClassBtn) {
        quickAddClassBtn.addEventListener('click', () => navigateToTab('classes'));
    }
    if (quickAddStudentBtn) {
        quickAddStudentBtn.addEventListener('click', () => navigateToTab('students'));
    }
    if (quickAddEvaluationBtn) {
        quickAddEvaluationBtn.addEventListener('click', () => navigateToTab('evaluations'));
    }
};