
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
    const exportScheduleBtn = document.getElementById('export-schedule-btn'); // Nuovo

    // --- CONFIGURAZIONE E DATI ---
    const days = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
    const hours = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
    let scheduleData = loadData('docentepp_schedule', {});
    const classes = loadData('docentepp_classes', []);
    let currentSlot = null;

    // --- FUNZIONI PRINCIPALI ---

    const createGrid = () => {
        gridContainer.innerHTML = '';
        gridContainer.style.gridTemplateColumns = `auto repeat(${days.length}, 1fr)`;

        gridContainer.appendChild(document.createElement('div')); // Angolo vuoto
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
                cell.addEventListener('click', () => openModal(day, hour));
                gridContainer.appendChild(cell);
            });
        });
    };

    const populateGrid = () => {
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
                } else { // Se la classe è stata eliminata, pulisci i dati
                     delete scheduleData[slotId];
                     saveData('docentepp_schedule', scheduleData);
                     cell.innerHTML = '';
                }
            } else if (cell) {
                 cell.innerHTML = '';
            }
        }
    };

    const openModal = (day, hour) => {
        currentSlot = { day, hour };
        const slotId = `${day}-${hour}`;
        const existingLesson = scheduleData[slotId];
        modalSlotInfo.textContent = `Slot: ${day}, Ora: ${hour}`;
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

    const closeModal = () => {
        modal.style.display = 'none';
        currentSlot = null;
    };

    const saveLesson = () => {
        if (!currentSlot) return;
        const slotId = `${currentSlot.day}-${currentSlot.hour}`;
        const classId = modalClassSelector.value;
        const notes = modalNotes.value.trim();

        if (classId) {
            scheduleData[slotId] = { day: currentSlot.day, hour: currentSlot.hour, classId: classId, notes: notes };
        } else {
            delete scheduleData[slotId];
        }
        saveData('docentepp_schedule', scheduleData);
        populateGrid();
        closeModal();
    };

    const deleteLesson = () => {
        if (!currentSlot) return;
        const slotId = `${currentSlot.day}-${currentSlot.hour}`;
        delete scheduleData[slotId];
        saveData('docentepp_schedule', scheduleData);
        populateGrid();
        closeModal();
    };

    // NUOVA FUNZIONE: Esportazione CSV
    const exportScheduleToCSV = () => {
        const header = ['"Ora"'].concat(days.map(d => `"${d}"`)).join(',');
        
        const rows = hours.map(hour => {
            const row = [`"${hour}"`];
            days.forEach(day => {
                const slotId = `${day}-${hour}`;
                const lesson = scheduleData[slotId];
                let cellContent = '';
                if (lesson && lesson.classId) {
                    const classInfo = classes.find(c => c.id === parseInt(lesson.classId));
                    if (classInfo) {
                        cellContent = `${classInfo.name}`;
                        if (lesson.notes) {
                            cellContent += ` (${lesson.notes})`;
                        }
                    }
                }
                row.push(`"${cellContent.replace(/"/g, '''''''')}"`); // Escape double quotes
            });
            return row.join(',');
        });

        const csvString = [header].concat(rows).join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'orario_scolastico.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --- EVENT LISTENERS ---
    modalCloseButton.addEventListener('click', closeModal);
    modalSaveButton.addEventListener('click', saveLesson);
    modalDeleteButton.addEventListener('click', deleteLesson);
    exportScheduleBtn.addEventListener('click', exportScheduleToCSV); // Nuovo listener
    window.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });

    // --- INIZIALIZZAZIONE ---
    createGrid();
    populateGrid();
};
