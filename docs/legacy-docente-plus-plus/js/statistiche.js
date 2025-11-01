
const setupStatistiche = () => {
    // Selettori del DOM
    const classSelector = document.getElementById('stats-class-selector');
    const generalReportDiv = document.getElementById('stats-general-report');
    const classSpecificReportDiv = document.getElementById('stats-class-specific-report');
    const generalContentDiv = document.getElementById('general-stats-content');
    const classSpecificContentDiv = document.getElementById('class-specific-stats-content');
    const classSpecificTitle = document.getElementById('class-specific-title');
    const studentChartContainer = document.getElementById('student-chart-container');
    const classChartContainer = document.getElementById('class-chart-container');

    // Variabili per tenere traccia delle istanze dei grafici
    let studentPerformanceChart = null;
    let classDistributionChart = null;

    // Caricamento dati dal localStorage
    const classes = loadData('docentepp_classes', []);
    const students = loadData('docentepp_students', []);
    const evaluations = loadData('docentepp_evaluations', []);

    // --- FUNZIONI DI UTILITY ---
    const calculateAverage = (grades) => {
        if (grades.length === 0) return 0;
        const sum = grades.reduce((acc, curr) => acc + parseFloat(curr), 0);
        return (sum / grades.length).toFixed(2);
    };

    const createTable = (headers) => {
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tr = document.createElement('tr');
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            tr.appendChild(th);
        });
        thead.appendChild(tr);
        table.appendChild(document.createElement('tbody'));
        return table;
    };

    const populateTable = (table, dataRows, onRowClick) => {
        const tbody = table.querySelector('tbody');
        tbody.innerHTML = '';
        dataRows.forEach(rowData => {
            const tr = document.createElement('tr');
            rowData.data.forEach(cellData => {
                const td = document.createElement('td');
                td.textContent = cellData;
                tr.appendChild(td);
            });
            if (onRowClick) {
                tr.style.cursor = 'pointer';
                tr.addEventListener('click', () => onRowClick(rowData.studentId));
            }
            tbody.appendChild(tr);
        });
    };

    // Popola il selettore delle classi
    classes.forEach(c => {
        const option = document.createElement('option');
        option.value = c.id;
        option.textContent = c.name;
        classSelector.appendChild(option);
    });

    // --- FUNZIONI PER I GRAFICI (CHART.JS) ---

    const renderStudentPerformanceChart = (studentId) => {
        const student = students.find(s => s.id === studentId);
        if (!student) return;

        const studentEvals = evaluations
            .filter(ev => ev.studentId === studentId)
            .sort((a, b) => new Date(a.date) - new Date(b.date)); // Ordina per data

        const labels = studentEvals.map(ev => new Date(ev.date).toLocaleDateString());
        const data = studentEvals.map(ev => ev.grade);

        studentChartContainer.style.display = 'block';
        const ctx = document.getElementById('student-performance-chart').getContext('2d');

        if (studentPerformanceChart) {
            studentPerformanceChart.destroy(); // Distrugge il grafico precedente per evitare sovrapposizioni
        }

        studentPerformanceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `Andamento Voti di ${student.name} ${student.surname}`,
                    data: data,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    };

    const renderClassDistributionChart = (classId) => {
        const studentsInClass = students.filter(s => s.classId === classId);
        const studentIds = studentsInClass.map(s => s.id);
        const evalsInClass = evaluations.filter(ev => studentIds.includes(ev.studentId));
        const grades = evalsInClass.map(ev => ev.grade);

        // Conta la frequenza di ogni voto
        const gradeCounts = {};
        for (let i = 1; i <= 10; i++) { gradeCounts[i] = 0; } // Inizializza
        grades.forEach(grade => {
            const roundedGrade = Math.round(grade);
            if (gradeCounts[roundedGrade] !== undefined) {
                gradeCounts[roundedGrade]++;
            }
        });

        const labels = Object.keys(gradeCounts);
        const data = Object.values(gradeCounts);

        classChartContainer.style.display = 'block';
        const ctx = document.getElementById('class-distribution-chart').getContext('2d');

        if (classDistributionChart) {
            classDistributionChart.destroy();
        }

        classDistributionChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Distribuzione dei Voti',
                    data: data,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1 // Mostra solo interi sull'asse Y
                        }
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    };

    // --- FUNZIONI DI RENDERING DEI REPORT ---

    const renderGeneralReport = () => {
        generalContentDiv.innerHTML = '';
        if (classes.length === 0) {
            generalContentDiv.innerHTML = '<p>Nessuna classe da analizzare. Aggiungi prima una classe.</p>';
            return;
        }
        const headers = ['Classe', 'N° Studenti', 'N° Valutazioni', 'Media Generale'];
        const table = createTable(headers);
        const dataRows = classes.map(c => {
            const studentsInClass = students.filter(s => s.classId === c.id);
            const studentIds = studentsInClass.map(s => s.id);
            const evalsInClass = evaluations.filter(ev => studentIds.includes(ev.studentId));
            const grades = evalsInClass.map(ev => ev.grade);
            return { data: [c.name, studentsInClass.length, evalsInClass.length, calculateAverage(grades)] };
        });
        populateTable(table, dataRows);
        generalContentDiv.appendChild(table);
    };

    const renderClassSpecificReport = (classId) => {
        classSpecificContentDiv.innerHTML = '';
        const selectedClass = classes.find(c => c.id === classId);
        if (!selectedClass) return;

        classSpecificTitle.textContent = `Report Dettagliato: ${selectedClass.name}`;
        const studentsInClass = students.filter(s => s.classId === classId);

        if (studentsInClass.length === 0) {
            classSpecificContentDiv.innerHTML = '<p>Nessuno studente in questa classe. Clicca su uno studente per vedere il suo andamento.</p>';
            return;
        }
        const headers = ['Studente', 'N° Valutazioni', 'Media Voti'];
        const table = createTable(headers);
        const dataRows = studentsInClass.map(s => {
            const studentEvals = evaluations.filter(ev => ev.studentId === s.id);
            const grades = studentEvals.map(ev => ev.grade);
            return {
                studentId: s.id,
                data: [`${s.name} ${s.surname}`, studentEvals.length, calculateAverage(grades)]
            };
        });

        // Aggiungo il gestore di eventi per il click sulla riga
        populateTable(table, dataRows, (studentId) => {
            renderStudentPerformanceChart(studentId);
        });

        classSpecificContentDiv.appendChild(table);

        // Renderizzo anche il grafico di distribuzione per la classe
        renderClassDistributionChart(classId);
    };

    // Funzione principale che orchestra la visualizzazione
    const renderStats = (classId) => {
        // Nasconde sempre i grafici quando si cambia selezione
        studentChartContainer.style.display = 'none';
        classChartContainer.style.display = 'none';

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

    // Event listener per il cambio di classe
    classSelector.addEventListener('change', (e) => renderStats(e.target.value));

    // Render iniziale
    renderStats('all');
};
