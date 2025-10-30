
const setupSchedule = () => {
    // --- ELEMENTI DEL DOM ---
    const gridContainer = document.getElementById('schedule-grid');
    const modal = document.getElementById('schedule-modal');
    const modalCloseButton = document.getElementById('modal-close-button');
    const modalSlotInfo = document.getElementById('modal-slot-info');
    const modalClassSelector = document.getElementById('modal-class-selector');
    const modalNotes = document.getElementById('modal-notes');
    const modalSaveButton = document.getElementById('modal-save-button');
    const modalDeleteButton = document.getElementById('modal-delete-button');

    // --- CONFIGURAZIONE E DATI ---
    const days = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
    const hours = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
    let scheduleData = loadData('docentepp_schedule', {});
    const classes = loadData('docentepp_classes', []);
    let currentSlot = null;

    // --- FUNZIONI PRINCIPALI ---

    /**
     * Crea la struttura della griglia dell'orario, con intestazioni per giorni e ore.
     */
    const createGrid = () => {
        gridContainer.innerHTML = '';
        gridContainer.style.gridTemplateColumns = `auto repeat(${days.length}, 1fr)`;

        // Intestazione vuota angolo in alto a sinistra
        gridContainer.appendChild(document.createElement('div'));

        // Intestazioni dei giorni
        days.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'schedule-header';
            dayHeader.textContent = day;
            gridContainer.appendChild(dayHeader);
        });

        // Righe delle ore
        hours.forEach(hour => {
            const hourHeader = document.createElement('div');
            hourHeader.className = 'schedule-header';
            hourHeader.textContent = hour;
            gridContainer.appendChild(hourHeader);

            // Celle per ogni giorno in questa fascia oraria
            days.forEach(day => {
                const cell = document.createElement('div');
                const slotId = `${day}-${hour}`;
                cell.className = 'schedule-cell';
                cell.dataset.day = day;
                cell.dataset.hour = hour;
                cell.addEventListener('click', () => openModal(day, hour));
                gridContainer.appendChild(cell);
            });
        });
    };

    /**
     * Popola la griglia con i dati delle lezioni salvati.
     */
    const populateGrid = () => {
        // Rimuove le lezioni esistenti per evitare duplicati
        document.querySelectorAll('.lesson').forEach(lessonEl => lessonEl.remove());

        for (const slotId in scheduleData) {
            const lesson = scheduleData[slotId];
            const cell = gridContainer.querySelector(`[data-day="${lesson.day}"][data-hour="${lesson.hour}"]`);
            if (cell && lesson.classId) {
                const classInfo = classes.find(c => c.id === parseInt(lesson.classId));
                if (classInfo) {
                    cell.innerHTML = `
                        <div class="lesson" style="background-color: ${classInfo.color || '#2a3b4d'}">
                            <span class="lesson-class">${classInfo.name}</span>
                            ${lesson.notes ? `<span class="lesson-notes">${lesson.notes}</span>` : ''}
                        </div>
                    `;
                }
            } else if (cell) {
                 cell.innerHTML = ''; // Pulisce la cella se non c'è lezione
            }
        }
    };

    /**
     * Apre la modale per un dato slot (giorno/ora) e la popola.
     */
    const openModal = (day, hour) => {
        currentSlot = { day, hour };
        const slotId = `${day}-${hour}`;
        const existingLesson = scheduleData[slotId];

        modalSlotInfo.textContent = `Slot: ${day}, Ora: ${hour}`;

        // Popola il selettore delle classi
        modalClassSelector.innerHTML = '<option value="">-- Nessuna --</option>';
        classes.forEach(c => {
            const option = document.createElement('option');
            option.value = c.id;
            option.textContent = c.name;
            modalClassSelector.appendChild(option);
        });

        if (existingLesson && existingLesson.classId) {
            modalClassSelector.value = existingLesson.classId;
            modalNotes.value = existingLesson.notes || '';
            modalDeleteButton.style.display = 'inline-block';
        } else {
            modalClassSelector.value = '';
            modalNotes.value = '';
            modalDeleteButton.style.display = 'none';
        }

        modal.style.display = 'flex';
    };

    /**
     * Chiude la modale.
     */
    const closeModal = () => {
        modal.style.display = 'none';
        currentSlot = null;
    };

    /**
     * Salva la lezione corrente dalla modale nel localStorage.
     */
    const saveLesson = () => {
        if (!currentSlot) return;
        const slotId = `${currentSlot.day}-${currentSlot.hour}`;
        const classId = modalClassSelector.value;
        const notes = modalNotes.value.trim();

        if (classId) { // Salva solo se è stata selezionata una classe
            scheduleData[slotId] = {
                day: currentSlot.day,
                hour: currentSlot.hour,
                classId: classId,
                notes: notes
            };
        } else { // Altrimenti rimuove la lezione dallo slot
            delete scheduleData[slotId];
        }

        saveData('docentepp_schedule', scheduleData);
        populateGrid();
        closeModal();
    };

    /**
     * Elimina la lezione per lo slot corrente.
     */
    const deleteLesson = () => {
        if (!currentSlot) return;
        const slotId = `${currentSlot.day}-${currentSlot.hour}`;
        delete scheduleData[slotId];
        saveData('docentepp_schedule', scheduleData);
        populateGrid();
        closeModal();
    };

    // --- EVENT LISTENERS ---
    modalCloseButton.addEventListener('click', closeModal);
    modalSaveButton.addEventListener('click', saveLesson);
    modalDeleteButton.addEventListener('click', deleteLesson);
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // --- INIZIALIZZAZIONE ---
    createGrid();
    populateGrid();
};
