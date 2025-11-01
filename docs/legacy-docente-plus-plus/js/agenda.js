
// Funzione di setup per la sezione Agenda, caricata dinamicamente.
const setupAgenda = async () => {

    // Controlla se la funzione di caricamento dati è disponibile
    if (typeof window.loadData !== 'function') {
        console.error('La funzione globale loadData non è stata trovata. L\'app potrebbe non essere inizializzata.');
        const list = document.getElementById('latest-evaluations-list');
        if(list) list.innerHTML = '<p class="error-message">Errore nel caricamento dei dati. Prova a ricaricare la pagina.</p>';
        return;
    }

    // --- ELEMENTI DEL DOM ---
    const statsClassCount = document.getElementById('stats-class-count');
    const statsStudentCount = document.getElementById('stats-student-count');
    const latestEvaluationsList = document.getElementById('latest-evaluations-list');
    const quickAddClassBtn = document.getElementById('quick-add-class');
    const quickAddStudentBtn = document.getElementById('quick-add-student');
    const quickAddEvaluationBtn = document.getElementById('quick-add-evaluation');

    // Mostra un caricamento iniziale
    if (latestEvaluationsList) latestEvaluationsList.innerHTML = '<p>Caricamento dati...</p>';

    // --- CARICAMENTO DATI ASINCRONO ---
    const classes = await window.loadData('classes', []);
    const students = await window.loadData('students', []);
    const evaluations = await window.loadData('evaluations', []);

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
            // Ordina le valutazioni per data e prendi le ultime 5
            const recentEvaluations = evaluations.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

            recentEvaluations.forEach(ev => {
                const student = students.find(s => s.id === ev.studentId);
                const listItem = document.createElement('div');
                listItem.className = 'list-item';
                
                const studentName = student ? `${student.name} ${student.surname}` : 'Studente non trovato';
                
                listItem.innerHTML = `
                    <div class="list-item-main">
                        <span class="material-symbols-outlined">person</span>
                        <span><strong>${studentName}</strong></span>
                    </div>
                    <div class="list-item-details">
                        <span>Voto: <strong>${ev.grade}</strong></span>
                        <span>Data: ${new Date(ev.date).toLocaleDateString()}</span>
                    </div>
                `;
                latestEvaluationsList.appendChild(listItem);
            });
        }
    }

    // --- SETUP AZIONI RAPIDE ---
    if (quickAddClassBtn) {
        quickAddClassBtn.addEventListener('click', () => window.navigateToTab('classes'));
    }
    if (quickAddStudentBtn) {
        quickAddStudentBtn.addEventListener('click', () => window.navigateToTab('students'));
    }
    if (quickAddEvaluationBtn) {
        quickAddEvaluationBtn.addEventListener('click', () => window.navigateToTab('evaluations'));
    }
};