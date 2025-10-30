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
        table.appendChild(thead);
        table.appendChild(document.createElement('tbody'));
        return table;
    };

    const populateTable = (table, dataRows) => {
        const tbody = table.querySelector('tbody');
        tbody.innerHTML = '';
        dataRows.forEach(rowData => {
            const tr = document.createElement('tr');
            rowData.forEach(cellData => {
                const td = document.createElement('td');
                td.textContent = cellData;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
    };

    classes.forEach(c => {
        const option = document.createElement('option');
        option.value = c.id;
        option.textContent = c.name;
        classSelector.appendChild(option);
    });

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
            return [c.name, studentsInClass.length, evalsInClass.length, calculateAverage(grades)];
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
            classSpecificContentDiv.innerHTML = '<p>Nessuno studente in questa classe.</p>';
            return;
        }
        const headers = ['Studente', 'N° Valutazioni', 'Media Voti'];
        const table = createTable(headers);
        const dataRows = studentsInClass.map(s => {
            const studentEvals = evaluations.filter(ev => ev.studentId === s.id);
            const grades = studentEvals.map(ev => ev.grade);
            return [`${s.name} ${s.surname}`, studentEvals.length, calculateAverage(grades)];
        });
        populateTable(table, dataRows);
        classSpecificContentDiv.appendChild(table);
    };

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

    classSelector.addEventListener('change', (e) => renderStats(e.target.value));
    renderStats('all');
};