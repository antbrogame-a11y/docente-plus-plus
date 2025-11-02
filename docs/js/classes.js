
// Funzione di setup per la sezione Classi, migrata a Firestore.
const setupClasses = () => {

    // --- VERIFICA ISTANZA FIREDB ---
    if (!window.db) {
        console.error("Istanza Firestore non trovata. Assicurati che firestore.js sia caricato e inizializzato correttamente.");
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

    const userId = firebase.auth().currentUser.uid;
    const classesRef = db.collection('users').doc(userId).collection('classes');

    // --- FUNZIONI ---

    const renderClasses = (docs) => {
        classListDiv.innerHTML = '';
        if (docs.empty) {
            classListDiv.innerHTML = '<p class="empty-list-message">Nessuna classe trovata. Inizia aggiungendone una!</p>';
            return;
        }

        docs.forEach(doc => {
            const c = { id: doc.id, ...doc.data() };
            const classElement = document.createElement('div');
            classElement.className = 'list-item';
            classElement.setAttribute('data-id', c.id);
            classElement.innerHTML = `
                <div class="list-item-main">
                    <span class="material-symbols-outlined">school</span>
                    <span>${c.name}</span>
                </div>
                <div class="list-item-actions">
                    <button class="btn-icon btn-edit"><span class="material-symbols-outlined">edit</span></button>
                    <button class="btn-icon btn-delete"><span class="material-symbols-outlined">delete</span></button>
                </div>
            `;

            classElement.querySelector('.btn-edit').addEventListener('click', () => openEditModal(c.id, c.name));
            classElement.querySelector('.btn-delete').addEventListener('click', () => deleteClass(c.id));

            classListDiv.appendChild(classElement);
        });
    };

    const addClass = async (e) => {
        e.preventDefault();
        const newName = classNameInput.value.trim();
        if (newName) {
            try {
                await classesRef.add({ name: newName });
                classNameInput.value = '';
            } catch (error) {
                console.error("Errore nell'aggiungere la classe:", error);
                alert("Si è verificato un errore durante l'aggiunta della classe.");
            }
        }
    };

    const deleteClass = async (id) => {
        if (confirm('Sei sicuro di voler eliminare questa classe? Verranno eliminati anche tutti gli studenti e le valutazioni associate in modo permanente.')) {
            try {
                const batch = db.batch();
                const studentsRef = db.collection('users').doc(userId).collection('students');
                const evaluationsRef = db.collection('users').doc(userId).collection('evaluations');

                // 1. Trova ed elimina gli studenti e le loro valutazioni
                const studentsQuery = await studentsRef.where('classId', '==', id).get();
                if (!studentsQuery.empty) {
                    for (const studentDoc of studentsQuery.docs) {
                        const studentId = studentDoc.id;
                        // Trova ed elimina le valutazioni dello studente
                        const evaluationsQuery = await evaluationsRef.where('studentId', '==', studentId).get();
                        evaluationsQuery.forEach(evalDoc => batch.delete(evalDoc.ref));
                        // Elimina lo studente
                        batch.delete(studentDoc.ref);
                    }
                }

                // 2. Elimina la classe
                batch.delete(classesRef.doc(id));

                // 3. Esegui il batch
                await batch.commit();

            } catch (error) {
                console.error("Errore nell'eliminazione a cascata della classe:", error);
                alert("Si è verificato un errore complesso durante l'eliminazione della classe.");
            }
        }
    };

    const openEditModal = (id, currentName) => {
        editClassIdInput.value = id;
        editClassNameInput.value = currentName;
        editModal.style.display = 'flex';
        editClassNameInput.focus();
    };

    const closeEditModal = () => {
        editModal.style.display = 'none';
    };

    const saveClassChanges = async (e) => {
        e.preventDefault();
        const id = editClassIdInput.value;
        const newName = editClassNameInput.value.trim();
        if (id && newName) {
            try {
                await classesRef.doc(id).update({ name: newName });
                closeEditModal();
            } catch (error) {
                console.error("Errore nell'aggiornare la classe:", error);
                alert("Si è verificato un errore durante l'aggiornamento.");
            }
        }
    };

    // --- LISTENER IN TEMPO REALE ---
    classesRef.orderBy('name').onSnapshot(renderClasses, err => {
        console.error("Errore nel listener di Firestore:", err);
        classListDiv.innerHTML = '<p class="error-message">Errore nel caricamento delle classi. Controlla la console.</p>';
    });

    // --- EVENT LISTENER GLOBALI ---
    classForm.addEventListener('submit', addClass);
    editForm.addEventListener('submit', saveClassChanges);
    closeModalBtn.addEventListener('click', closeEditModal);
    window.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeEditModal();
        }
    });

    console.log("Modulo Classi caricato e configurato con Firestore.");
};

// Avvia la configurazione non appena lo script viene eseguito.
setupClasses();
