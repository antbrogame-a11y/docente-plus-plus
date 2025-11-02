
const setupSchedule = async () => {
    // --- PRECONDIZIONI ---
    if (!window.db || !firebase.auth().currentUser) {
        console.error("Firestore o utente non disponibili. Impossibile inizializzare il modulo Orario.");
        document.getElementById('schedule-grid').innerHTML = '<p class="error-message">Impossibile caricare l'orario. Dati di autenticazione non trovati.</p>';
        return;
    }

    // --- ELEMENTI DEL DOM ---
    const gridContainer = document.getElementById('schedule-grid');
    const modal = document.getElementById('schedule-modal');
    const modalCloseButton = document.getElementById('modal-close-button');
    const modalSlotInfo = document.getElementById('modal-slot-info');
    const modalClassSelector = document.getElementById('modal-class-selector');
    const modalNotes = document.getElementById('modal-notes');
    const modalSaveButton = document.getElementById('modal-save-button');
    const modalDeleteButton = document.getElementById('modal-delete-button');
    const exportScheduleBtn = document.getElementById('export-schedule-btn');

    // --- CONFIGURAZIONE E RIFERIMENTI FIRESTORE ---
    const days = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
    const hours = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
    const userId = firebase.auth().currentUser.uid;
    const scheduleRef = db.collection('users').doc(userId).collection('schedule');
    const classesRef = db.collection('users').doc(userId).collection('classes');
    
    let localClasses = []; // Cache locale delle classi per riferimento
    let currentSlot = null; // Slot (giorno, ora) selezionato per la modifica

    // --- FUNZIONI DI BASE ---

    const createGrid = () => {
        gridContainer.innerHTML = ''; 
        gridContainer.style.gridTemplateColumns = `auto repeat(${days.length}, 1fr)`;

        gridContainer.appendChild(document.createElement('div')); 
        days.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'schedule-header';
            dayHeader.textContent = day;
            gridContainer.appendChild(dayHeader);
        });

        hours.forEach(hour => {
            const hourHeader = document.createElement('div');
            hourHeader.className = 'schedule-header';
            hourHeader.textContent = hour;
            gridContainer.appendChild(hourHeader);

            days.forEach(day => {
                const cell = document.createElement('div');
                cell.className = 'schedule-cell';
                cell.dataset.day = day;
                cell.dataset.hour = hour;
                gridContainer.appendChild(cell);
            });
        });
    };
    
    const populateClasses = async () => {
        try {
            const snapshot = await classesRef.orderBy('name').get();
            localClasses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Errore nel caricamento delle classi:", error);
            alert("Impossibile caricare l'elenco delle classi per l'orario.");
        }
    };

    // --- GESTIONE MODALE ---

    const openModal = (day, hour, lesson = null) => {
        currentSlot = { day, hour };
        modalSlotInfo.textContent = `Slot: ${day}, Ora: ${hour}`;
        modalClassSelector.innerHTML = '<option value="">-- Nessuna --</option>';
        localClasses.forEach(c => {
            const option = document.createElement('option');
            option.value = c.id;
            option.textContent = c.name;
            modalClassSelector.appendChild(option);
        });

        if (lesson && lesson.classId) {
            modalClassSelector.value = lesson.classId;
            modalNotes.value = lesson.notes || '';
            modalDeleteButton.style.display = 'inline-block';
        } else {
            modalClassSelector.value = '';
            modalNotes.value = '';
            modalDeleteButton.style.display = 'none';
        }
        modal.style.display = 'flex';
    };

    const closeModal = () => {
        modal.style.display = 'none';
        currentSlot = null;
    };

    // --- OPERAZIONI CRUD SU FIRESTORE ---

    const saveLesson = async () => {
        if (!currentSlot) return;
        const slotId = `${currentSlot.day}-${currentSlot.hour}`;
        const classId = modalClassSelector.value;
        const notes = modalNotes.value.trim();

        if (classId) {
            const lessonData = { day: currentSlot.day, hour: currentSlot.hour, classId, notes };
            try {
                await scheduleRef.doc(slotId).set(lessonData);
            } catch (error) {
                console.error("Errore nel salvataggio della lezione:", error);
                alert("Errore durante il salvataggio della lezione.");
            }
        } else {
            // Se si seleziona "Nessuna", si elimina la lezione
            await deleteLesson(true); 
        }
        closeModal();
    };

    const deleteLesson = async (silent = false) => {
        if (!currentSlot) return;
        const proceed = silent || confirm("Sei sicuro di voler eliminare questa lezione dall'orario?");
        if (proceed) {
            const slotId = `${currentSlot.day}-${currentSlot.hour}`;
            try {
                await scheduleRef.doc(slotId).delete();
            } catch (error) {
                console.error("Errore nell'eliminazione della lezione:", error);
                alert("Errore durante l'eliminazione della lezione.");
            }
        }
        closeModal();
    };
    
    // --- ESPORTAZIONE ---

    const exportScheduleToCSV = async () => {
        // Carica i dati aggiornati prima di esportare
        const scheduleSnapshot = await scheduleRef.get();
        const scheduleDataForExport = {};
        scheduleSnapshot.forEach(doc => {
            scheduleDataForExport[doc.id] = doc.data();
        });

        const header = ['"Ora"'].concat(days.map(d => `"${d}"`)).join(',');
        const rows = hours.map(hour => {
            const row = [`"${hour}"`];
            days.forEach(day => {
                const slotId = `${day}-${hour}`;
                const lesson = scheduleDataForExport[slotId];
                let cellContent = '';
                if (lesson && lesson.classId) {
                    const classInfo = localClasses.find(c => c.id === lesson.classId);
                    if (classInfo) {
                        cellContent = `${classInfo.name}`;
                        if (lesson.notes) cellContent += ` (${lesson.notes})`;
                    }
                }
                row.push(`"${cellContent.replace(/"/g, '''''''')}"`);
            });
            return row.join(',');
        });

        const csvString = [header].concat(rows).join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'orario_scolastico.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --- INIZIALIZZAZIONE E LISTENER IN TEMPO REALE ---
    
    createGrid();
    await populateClasses(); 

    scheduleRef.onSnapshot(snapshot => {
        const allCells = document.querySelectorAll('.schedule-cell');
        allCells.forEach(cell => cell.innerHTML = ''); // Pulisce la griglia

        let scheduleData = {};
        snapshot.docs.forEach(doc => {
            const lesson = doc.data();
            scheduleData[doc.id] = lesson;
            const cell = gridContainer.querySelector(`[data-day="${lesson.day}"][data-hour="${lesson.hour}"]`);
            if (cell) {
                const classInfo = localClasses.find(c => c.id === lesson.classId);
                if (classInfo) {
                    cell.innerHTML = `
                        <div class="lesson">
                            <span class="lesson-class">${classInfo.name}</span>
                            ${lesson.notes ? `<span class="lesson-notes">${lesson.notes}</span>` : ''}
                        </div>
                    `;
                }
            }
        });

        // Ri-attacca i listener per l'apertura della modale
        allCells.forEach(cell => {
            cell.onclick = () => {
                const { day, hour } = cell.dataset;
                const slotId = `${day}-${hour}`;
                openModal(day, hour, scheduleData[slotId]);
            };
        });

    }, error => {
        console.error("Errore nel listener dell'orario:", error);
        gridContainer.innerHTML = '<p class="error-message">Errore nel caricamento in tempo reale dell'orario.</p>';
    });

    // --- LISTENER GLOBALI ---
    modalCloseButton.addEventListener('click', closeModal);
    modalSaveButton.addEventListener('click', saveLesson);
    modalDeleteButton.addEventListener('click', () => deleteLesson(false));
    exportScheduleBtn.addEventListener('click', exportScheduleToCSV);
    window.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });
    
    console.log("Modulo Orario caricato e configurato con Firestore.");
};

// Avvia la configurazione non appena lo script viene eseguito
setupSchedule();
