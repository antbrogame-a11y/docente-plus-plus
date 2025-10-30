
// Funzione di setup per la sezione Importazione Documenti
const setupDocumentImport = () => {

    if (typeof loadData !== 'function' || typeof saveData !== 'function') {
        console.error('Le funzioni globali loadData o saveData non sono state trovate.');
        return;
    }

    // --- ELEMENTI DEL DOM ---
    const classSelect = document.getElementById('import-class-select');
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('file-input');
    const importBtn = document.getElementById('import-btn');
    const importResultDiv = document.getElementById('import-result');

    // --- DATI ---
    let classes = loadData('docentepp_classes', []);
    let students = loadData('docentepp_students', []);
    let selectedFile = null;

    // --- FUNZIONI ---

    const populateClasses = () => {
        classSelect.innerHTML = '<option value="">Seleziona una classe...</option>';
        if (classes.length === 0) {
            classSelect.innerHTML = '<option value="">Nessuna classe creata</option>';
        } else {
            classes.forEach(c => {
                const option = document.createElement('option');
                option.value = c.id;
                option.textContent = c.name;
                classSelect.appendChild(option);
            });
        }
    };

    const handleFileSelect = (file) => {
        if (file && file.type === 'text/csv') {
            selectedFile = file;
            dropArea.textContent = `File selezionato: ${file.name}`;
            dropArea.classList.add('file-selected');
            updateImportButtonState();
        } else {
            selectedFile = null;
            importResultDiv.innerHTML = '<p class="error">Formato file non valido. Seleziona un file .csv</p>';
            dropArea.textContent = 'Trascina il file qui o clicca per selezionarlo';
            dropArea.classList.remove('file-selected');
            updateImportButtonState();
        }
    };

    const updateImportButtonState = () => {
        importBtn.disabled = !(selectedFile && classSelect.value !== '' && classSelect.value !== null);
    };

    const processImport = () => {
        if (!selectedFile || !classSelect.value) return;

        const classId = Number(classSelect.value);
        const reader = new FileReader();

        reader.onload = (event) => {
            const csv = event.target.result;
            const lines = csv.split(/\r\n|\n/);
            let importedCount = 0;
            let errors = [];

            lines.forEach((line, index) => {
                if (line.trim() === '') return; // Salta righe vuote

                const [name, surname, email] = line.split(',').map(field => field.trim());

                if (name && surname) {
                    const newStudent = {
                        id: Date.now() + index, // Garantisce ID univoco anche in batch
                        classId: classId,
                        name: name,
                        surname: surname,
                        email: email || ''
                    };
                    students.push(newStudent);
                    importedCount++;
                } else {
                    errors.push(`Riga ${index + 1}: Dati mancanti o formattati non correttamente.`);
                }
            });

            saveData('docentepp_students', students);
            displayImportResult(importedCount, errors);
            // Resetta l'interfaccia
            resetImportArea();
        };

        reader.onerror = () => {
            importResultDiv.innerHTML = '<p class="error">Errore durante la lettura del file.</p>';
        };

        reader.readAsText(selectedFile);
    };

    const displayImportResult = (count, errors) => {
        let html = `<p class="success"><strong>${count} studenti importati con successo!</strong></p>`;
        if (errors.length > 0) {
            html += '<p class="error">Sono stati riscontrati alcuni problemi:</p><ul>';
            errors.forEach(err => {
                html += `<li>${err}</li>`;
            });
            html += '</ul>';
        }
        importResultDiv.innerHTML = html;
    };
    
    const resetImportArea = () => {
        selectedFile = null;
        fileInput.value = ''; // Resetta l'input file
        dropArea.textContent = 'Trascina il file qui o clicca per selezionarlo';
        dropArea.classList.remove('file-selected');
        updateImportButtonState();
    };

    // --- EVENT LISTENER ---
    classSelect.addEventListener('change', updateImportButtonState);
    importBtn.addEventListener('click', processImport);

    // Eventi per Drag & Drop
    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.classList.add('drag-over');
    });
    dropArea.addEventListener('dragleave', () => dropArea.classList.remove('drag-over'));
    dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dropArea.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        handleFileSelect(file);
    });
    dropArea.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFileSelect(e.target.files[0]));

    // --- INIZIALIZZAZIONE ---
    populateClasses();
    updateImportButtonState();
};
