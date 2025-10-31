
// Funzione di setup per la sezione Classi, caricata dinamicamente.
const setupClasses = async () => {

    // Tenta di accedere alle funzioni globali definite in app.js
    if (typeof loadData !== 'function' || typeof saveData !== 'function') {
        console.error('Le funzioni globali loadData o saveData non sono state trovate. Assicurati che app.js sia caricato correttamente.');
        return;
    }

    // --- ELEMENTI DEL DOM ---
    const classForm = document.getElementById('add-class-form');
    const classNameInput = document.getElementById('class-name-input');
    const classListDiv = document.getElementById('class-list');
    const editModal = document.getElementById('edit-class-modal');
    const editForm = document.getElementById('edit-class-form');
    const editClassIdInput = document.getElementById('edit-class-id');
    const editClassNameInput = document.getElementById('edit-class-name');
    const closeModalBtn = editModal.querySelector('.close-btn');

    // --- DATI ---
    let classes = await loadData('classes', []);

    // --- FUNZIONI ---

    const renderClasses = () => {
        classListDiv.innerHTML = '';
        if (classes.length === 0) {
            classListDiv.innerHTML = '<p class="empty-list-message">Nessuna classe trovata. Inizia aggiungendone una!</p>';
            return;
        }

        classes.forEach(c => {
            const classElement = document.createElement('div');
            classElement.className = 'list-item';
            classElement.innerHTML = `
                <div class="list-item-main">
                    <span class="material-symbols-outlined">school</span>
                    <span>${c.name}</span>
                </div>
                <div class="list-item-actions">
                    <button class="btn-icon btn-edit" data-id="${c.id}"><span class="material-symbols-outlined">edit</span></button>
                    <button class="btn-icon btn-delete" data-id="${c.id}"><span class="material-symbols-outlined">delete</span></button>
                </div>
            `;

            // Aggiungi event listener per modifica ed eliminazione
            classElement.querySelector('.btn-edit').addEventListener('click', () => openEditModal(c.id));
            classElement.querySelector('.btn-delete').addEventListener('click', () => deleteClass(c.id));

            classListDiv.appendChild(classElement);
        });
    };

    const addClass = async (e) => {
        e.preventDefault();
        const newName = classNameInput.value.trim();
        if (newName) {
            const newClass = {
                id: Date.now(), // ID univoco basato sul timestamp
                name: newName
            };
            classes.push(newClass);
            await saveData('classes', classes);
            renderClasses();
            classNameInput.value = '';
        }
    };

    const deleteClass = async (id) => {
        if (confirm('Sei sicuro di voler eliminare questa classe? Verranno eliminati anche tutti gli studenti e le valutazioni associate.')) {
            let students = await loadData('students', []);
            let evaluations = await loadData('evaluations', []);

            const studentsInClass = students.filter(s => s.classId === id);
            const studentIdsToDelete = studentsInClass.map(s => s.id);

            students = students.filter(s => s.classId !== id);
            evaluations = evaluations.filter(ev => !studentIdsToDelete.includes(ev.studentId));

            classes = classes.filter(c => c.id !== id);

            await saveData('classes', classes);
            await saveData('students', students);
            await saveData('evaluations', evaluations);

            renderClasses();
        }
    };

    const openEditModal = (id) => {
        const classToEdit = classes.find(c => c.id === id);
        if (classToEdit) {
            editClassIdInput.value = classToEdit.id;
            editClassNameInput.value = classToEdit.name;
            editModal.style.display = 'flex';
        }
    };

    const closeEditModal = () => {
        editModal.style.display = 'none';
    };

    const saveClassChanges = async (e) => {
        e.preventDefault();
        const id = Number(editClassIdInput.value);
        const newName = editClassNameInput.value.trim();
        if (id && newName) {
            const classIndex = classes.findIndex(c => c.id === id);
            if (classIndex !== -1) {
                classes[classIndex].name = newName;
                await saveData('classes', classes);
                renderClasses();
                closeEditModal();
            }
        }
    };

    // --- EVENT LISTENER ---
    classForm.addEventListener('submit', addClass);
    editForm.addEventListener('submit', saveClassChanges);
    closeModalBtn.addEventListener('click', closeEditModal);
    window.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeEditModal();
        }
    });

    // --- RENDER INIZIALE ---
    renderClasses();
};