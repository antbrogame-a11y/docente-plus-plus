
// Funzione di setup per la sezione Importazione Documenti
const setupDocumentImport = () => {

    // Verifica che le funzioni di Firestore siano disponibili
    if (typeof getClassesFromFirestore !== 'function' || typeof addStudentToFirestore !== 'function' || typeof checkStudentExists !== 'function') {
        console.error('Le funzioni Firestore non sono state trovate.');
        document.getElementById('import-result').innerHTML = '<p class="error">Errore critico: mancano le dipendenze di Firestore.</p>';
        return;
    }

    // --- ELEMENTI DEL DOM ---
    const classSelect = document.getElementById('import-class-select');
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('file-input');
    const importBtn = document.getElementById('import-btn');
    const importResultDiv = document.getElementById('import-result');

    // --- DATI ---
    let selectedFile = null;

    // --- FUNZIONI ---

    const populateClasses = async () => {
        try {
            const classes = await getClassesFromFirestore();
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
        } catch (error) {
            console.error("Errore nel caricamento delle classi: ", error);
            classSelect.innerHTML = '<option value="">Errore nel caricare le classi</option>';
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

    const processImport = async () => {
        if (!selectedFile || !classSelect.value) return;

        const classId = classSelect.value;
        importBtn.disabled = true;
        importResultDiv.innerHTML = '<p>Importazione in corso... questo potrebbe richiedere qualche istante.</p>';

        const reader = new FileReader();

        reader.onload = async (event) => {
            const csv = event.target.result;
            const lines = csv.split(/\r\n|\n/);
            let importedCount = 0;
            let skippedCount = 0;
            let errors = [];

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (line.trim() === '') continue;

                const [name, surname, email] = line.split(',').map(field => field.trim());

                if (name && surname && email) {
                    try {
                        const studentExists = await checkStudentExists(classId, email);
                        if (studentExists) {
                            skippedCount++;
                            continue; // Salta lo studente se esiste già
                        }

                        const newStudent = {
                            classId: classId,
                            name: name,
                            surname: surname,
                            email: email
                        };
                        
                        await addStudentToFirestore(newStudent);
                        importedCount++;
                    } catch (error) {
                        errors.push(`Riga ${i + 1}: Errore nel salvataggio su Firestore - ${error.message}`);
                    }
                } else {
                    errors.push(`Riga ${i + 1}: Dati mancanti o formattati non correttamente.`);
                }
            }

            displayImportResult(importedCount, skippedCount, errors);
            resetImportArea();
        };

        reader.onerror = () => {
            importResultDiv.innerHTML = '<p class="error">Errore durante la lettura del file.</p>';
            importBtn.disabled = false;
        };

        reader.readAsText(selectedFile);
    };

    const displayImportResult = (imported, skipped, errors) => {
        let html = `<p class="success"><strong>${imported} studenti importati con successo!</strong></p>`;
        if (skipped > 0) {
             html += `<p><strong>${skipped} studenti saltati perché già presenti.</strong></p>`;
        }
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
        fileInput.value = '';
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
