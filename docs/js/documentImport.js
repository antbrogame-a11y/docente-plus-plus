
// Funzione di setup per la sezione Importazione Dati
const setupDocumentImport = () => {

    // --- VERIFICA DIPENDENZE ---
    const firestoreDependencies = [
        'getClassesFromFirestore', 'addStudentToFirestore', 'checkStudentExists',
        'getEvaluationsFromFirestore', 'getStudentsByEmails', 'addGradesInBatch' // Dipendenze ottimizzate
    ];

    let missingDeps = firestoreDependencies.filter(dep => typeof window[dep] !== 'function');
    if (missingDeps.length > 0) {
        console.error(`Errore critico: mancano le seguenti dipendenze di Firestore: ${missingDeps.join(', ')}.`);
        const importResultDiv = document.getElementById('import-result');
        if(importResultDiv) importResultDiv.innerHTML = `<p class="error">Errore critico: impossibile caricare il modulo di importazione.</p>`;
        return;
    }

    const importResultDiv = document.getElementById('import-result');

    // --- SEZIONE: IMPORTAZIONE STUDENTI (invariata) ---
    const setupStudentImport = () => {
        // ... (la logica di importazione studenti rimane la stessa)
        const classSelect = document.getElementById('import-student-class-select');
        const dropArea = document.getElementById('student-drop-area');
        const fileInput = document.getElementById('student-file-input');
        const importBtn = document.getElementById('import-student-btn');
        let selectedFile = null;

        const populateClasses = async () => {
            try {
                const classes = await getClassesFromFirestore();
                classSelect.innerHTML = '<option value="">Seleziona una classe...</option>';
                classes.forEach(c => {
                    const option = document.createElement('option');
                    option.value = c.id;
                    option.textContent = c.name;
                    classSelect.appendChild(option);
                });
            } catch (error) {
                console.error("Errore nel caricamento delle classi: ", error);
            }
        };

        const handleFileSelect = (file) => {
            if (file && file.type === 'text/csv') {
                selectedFile = file;
                dropArea.textContent = `File: ${file.name}`;
                dropArea.classList.add('file-selected');
            } else {
                selectedFile = null;
                dropArea.textContent = 'Trascina o clicca per selezionare';
                dropArea.classList.remove('file-selected');
            }
            updateImportButtonState();
        };

        const updateImportButtonState = () => { importBtn.disabled = !(selectedFile && classSelect.value); };

        const processImport = async () => {
            if (!selectedFile || !classSelect.value) return;
            const classId = classSelect.value;
            importBtn.disabled = true;
            importResultDiv.innerHTML = '<p>Importazione studenti in corso...</p>';
            const reader = new FileReader();
            reader.onload = async (event) => {
                const lines = event.target.result.split(/\r\n|\n/);
                let importedCount = 0, skippedCount = 0, errors = [];
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    if (line.trim() === '') continue;
                    const [name, surname, email] = line.split(',').map(f => f.trim());
                    if (name && surname && email) {
                        try {
                            if (await checkStudentExists(classId, email)) {
                                skippedCount++;
                            } else {
                                await addStudentToFirestore({ classId, name, surname, email });
                                importedCount++;
                            }
                        } catch (error) { errors.push(`Riga ${i + 1}: ${error.message}`); }
                    } else { errors.push(`Riga ${i + 1}: Dati mancanti.`); }
                }
                displayImportResult('Studenti', importedCount, skippedCount, errors);
                resetImportArea();
            };
            reader.readAsText(selectedFile);
        };
        
        const resetImportArea = () => {
            selectedFile = null;
            fileInput.value = '';
            dropArea.textContent = 'Trascina o clicca per selezionare';
            dropArea.classList.remove('file-selected');
            updateImportButtonState();
        };

        classSelect.addEventListener('change', updateImportButtonState);
        importBtn.addEventListener('click', processImport);
        dropArea.addEventListener('dragover', (e) => { e.preventDefault(); dropArea.classList.add('drag-over'); });
        dropArea.addEventListener('dragleave', () => dropArea.classList.remove('drag-over'));
        dropArea.addEventListener('drop', (e) => { e.preventDefault(); dropArea.classList.remove('drag-over'); handleFileSelect(e.dataTransfer.files[0]); });
        dropArea.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => handleFileSelect(e.target.files[0]));
        populateClasses();
        updateImportButtonState();
    };

    // --- SEZIONE: IMPORTAZIONE VALUTAZIONI (Logica Ottimizzata) ---
    const setupEvaluationImport = () => {
        const evaluationSelect = document.getElementById('import-evaluation-select');
        const dropArea = document.getElementById('evaluation-drop-area');
        const fileInput = document.getElementById('evaluation-file-input');
        const importBtn = document.getElementById('import-evaluation-btn');
        let selectedFile = null;

        const populateEvaluations = async () => {
            try {
                const evaluations = await getEvaluationsFromFirestore();
                evaluationSelect.innerHTML = '<option value="">Seleziona una valutazione...</option>';
                evaluations.forEach(e => {
                    const option = document.createElement('option');
                    option.value = e.id;
                    option.textContent = e.name;
                    evaluationSelect.appendChild(option);
                });
            } catch (error) {
                console.error("Errore nel caricamento delle valutazioni: ", error);
            }
        };

        const handleFileSelect = (file) => {
            if (file && file.type === 'text/csv') {
                selectedFile = file;
                dropArea.textContent = `File: ${file.name}`;
                dropArea.classList.add('file-selected');
            } else {
                selectedFile = null;
                dropArea.textContent = 'Trascina o clicca per selezionare';
                dropArea.classList.remove('file-selected');
            }
            updateImportButtonState();
        };

        const updateImportButtonState = () => { importBtn.disabled = !(selectedFile && evaluationSelect.value); };

        const processImport = async () => {
            if (!selectedFile || !evaluationSelect.value) return;

            const evaluationId = evaluationSelect.value;
            importBtn.disabled = true;
            importResultDiv.innerHTML = '<p>Lettura file e preparazione dati...</p>';

            const reader = new FileReader();
            reader.onload = async (event) => {
                const lines = event.target.result.split(/\r\n|\n/).filter(line => line.trim() !== '');
                if (lines.length === 0) {
                    importResultDiv.innerHTML = '<p class="error">File vuoto o non valido.</p>';
                    resetImportArea();
                    return;
                }

                const gradesToProcess = [];
                const emailsInFile = new Set();
                let errors = [];

                lines.forEach((line, index) => {
                    const [email, gradeStr] = line.split(',').map(f => f.trim());
                    const grade = parseFloat(gradeStr);
                    if (email && !isNaN(grade)) {
                        emailsInFile.add(email);
                        gradesToProcess.push({ email, grade, lineNum: index + 1 });
                    } else {
                        errors.push(`Riga ${index + 1}: Dati mancanti o voto non numerico.`);
                    }
                });

                if (emailsInFile.size === 0) {
                    displayImportResult('Valutazioni', 0, lines.length, errors);
                    resetImportArea();
                    return;
                }

                try {
                    importResultDiv.innerHTML = `<p>Recupero di ${emailsInFile.size} studenti dal database...</p>`;
                    const studentsMap = await getStudentsByEmails(Array.from(emailsInFile));
                    
                    const gradesDataForBatch = [];
                    let skippedCount = 0;

                    gradesToProcess.forEach(item => {
                        const student = studentsMap.get(item.email);
                        if (student) {
                            gradesDataForBatch.push({ studentId: student.id, grade: item.grade });
                        } else {
                            errors.push(`Riga ${item.lineNum}: Studente con email ${item.email} non trovato.`);
                            skippedCount++;
                        }
                    });

                    if (gradesDataForBatch.length > 0) {
                        importResultDiv.innerHTML = `<p>Salvataggio di ${gradesDataForBatch.length} voti in corso...</p>`;
                        await addGradesInBatch(evaluationId, gradesDataForBatch);
                    }

                    displayImportResult('Voti', gradesDataForBatch.length, skippedCount, errors);

                } catch (error) {
                    importResultDiv.innerHTML = `<p class="error">Errore irreversibile durante l'importazione: ${error.message}</p>`;
                } finally {
                    resetImportArea();
                }
            };
            reader.readAsText(selectedFile);
        };
        
        const resetImportArea = () => {
            selectedFile = null;
            fileInput.value = '';
            dropArea.textContent = 'Trascina il file o clicca per selezionarlo';
            dropArea.classList.remove('file-selected');
            updateImportButtonState();
        };

        evaluationSelect.addEventListener('change', updateImportButtonState);
        importBtn.addEventListener('click', processImport);
        dropArea.addEventListener('dragover', (e) => { e.preventDefault(); dropArea.classList.add('drag-over'); });
        dropArea.addEventListener('dragleave', () => dropArea.classList.remove('drag-over'));
        dropArea.addEventListener('drop', (e) => { e.preventDefault(); dropArea.classList.remove('drag-over'); handleFileSelect(e.dataTransfer.files[0]); });
        dropArea.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => handleFileSelect(e.target.files[0]));

        populateEvaluations();
        updateImportButtonState();
    };

    // --- FUNZIONI COMUNI ---
    const displayImportResult = (type, imported, skipped, errors) => {
        let html = `<p class="success"><strong>${imported} ${type} importati/e con successo!</strong></p>`;
        if (skipped > 0) {
             html += `<p><strong>${skipped} record saltati (studenti non trovati o dati non validi).</strong></p>`;
        }
        if (errors.length > 0) {
            html += '<p class="error">Dettaglio errori:</p><ul>';
            errors.forEach(err => { html += `<li>${err}</li>`; });
            html += '</ul>';
        }
        importResultDiv.innerHTML = html;
    };

    // --- INIZIALIZZAZIONE ---
    setupStudentImport();
    setupEvaluationImport();
};
