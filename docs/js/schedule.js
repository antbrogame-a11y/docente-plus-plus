
import { db, auth } from '../firebase-config.js';
import { doc, getDoc, setDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";

let eventListeners = [];
let scheduleData = {}; // Stato locale per le modifiche all'orario
let userSubjects = []; // Stato locale per le materie dell'utente

// --- Funzioni di Utilità ---
const showToast = (message) => {
    const toast = document.createElement('div');
    toast.className = 'toast show';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
};

// --- Gestione Dati e UI ---
const populateScheduleTable = () => {
    const cells = document.querySelectorAll('#schedule-table tbody td');
    cells.forEach(cell => {
        const key = `cell-${cell.dataset.hour}-${cell.dataset.day}`;
        const entry = scheduleData[key];
        if (entry && entry.subject) {
            cell.innerHTML = `
                <div class="schedule-entry">
                    <span class="schedule-subject">${entry.subject}</span>
                    <span class="schedule-class">${entry.className || ''}</span>
                </div>
            `;
        } else {
            cell.innerHTML = '--';
        }
    });
};

const loadScheduleData = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const scheduleRef = doc(db, 'schedules', user.uid);
    try {
        const docSnap = await getDoc(scheduleRef);
        if (docSnap.exists() && docSnap.data().cells) {
            scheduleData = docSnap.data().cells;
        } else {
            scheduleData = {};
        }
        populateScheduleTable();
    } catch (error) {
        console.error("Errore nel caricamento dell'orario:", error);
        showToast("Errore nel caricamento dell'orario.");
    }
};

const saveSchedule = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const scheduleRef = doc(db, 'schedules', user.uid);
    try {
        await setDoc(scheduleRef, { cells: scheduleData });
        showToast("Orario salvato con successo!");
        document.getElementById('save-schedule-btn').style.display = 'none';
    } catch (error) {
        console.error("Errore nel salvataggio dell'orario:", error);
        showToast("Errore nel salvataggio dell'orario.");
    }
};

const loadSubjects = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const subjectsRef = collection(db, 'users', user.uid, 'subjects');
    try {
        const querySnapshot = await getDocs(subjectsRef);
        userSubjects = querySnapshot.docs.map(doc => doc.data().name).sort();
        populateSubjectSelect();
    } catch (error) {
        console.error("Errore nel caricamento delle materie:", error);
        showToast("Non è stato possibile caricare le materie.");
    }
};


// --- Gestione Modale ---
const modal = document.getElementById('schedule-cell-modal');
const form = document.getElementById('cell-form');
const hourInput = document.getElementById('cell-hour-input');
const dayInput = document.getElementById('cell-day-input');
const subjectSelect = document.getElementById('cell-subject-select');
const classInput = document.getElementById('cell-class-input');
const deleteBtn = document.getElementById('delete-entry-btn');

const populateSubjectSelect = () => {
    subjectSelect.innerHTML = '<option value="">-- Seleziona una materia --</option>';
    userSubjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = subject;
        subjectSelect.appendChild(option);
    });
};

const openCellModal = (hour, day) => {
    const key = `cell-${hour}-${day}`;
    const entry = scheduleData[key] || {};
    hourInput.value = hour;
    dayInput.value = day;
    subjectSelect.value = entry.subject || '';
    classInput.value = entry.className || '';
    deleteBtn.style.display = entry.subject ? 'inline-block' : 'none';
    modal.style.display = 'block';
    subjectSelect.focus();
};

const closeCellModal = () => {
    modal.style.display = 'none';
    form.reset();
};

const handleCellFormSubmit = (e) => {
    e.preventDefault();
    const hour = hourInput.value;
    const day = dayInput.value;
    const subject = subjectSelect.value;
    const className = classInput.value.trim();
    const key = `cell-${hour}-${day}`;

    if (subject) {
        scheduleData[key] = { subject, className };
    } else {
        delete scheduleData[key];
    }
    
    document.getElementById('save-schedule-btn').style.display = 'inline-block';
    populateScheduleTable();
    closeCellModal();
};

const handleDeleteEntry = () => {
    const hour = hourInput.value;
    const day = dayInput.value;
    const key = `cell-${hour}-${day}`;
    delete scheduleData[key];
    document.getElementById('save-schedule-btn').style.display = 'inline-block';
    populateScheduleTable();
    closeCellModal();
};

// --- Setup e Cleanup ---
const generateScheduleRows = () => {
    const tableBody = document.querySelector('#schedule-table tbody');
    if (!tableBody) return;
    tableBody.innerHTML = ''; 
    const startHour = 8, endHour = 14;
    for (let hour = startHour; hour <= endHour; hour++) {
        const row = document.createElement('tr');
        row.innerHTML = `<th>${hour}:00 - ${hour+1}:00</th>`;
        for (let day = 0; day < 6; day++) {
            row.innerHTML += `<td data-hour="${hour}" data-day="${day}">--</td>`;
        }
        tableBody.appendChild(row);
    }
};

export const setupScheduleUI = async () => {
    generateScheduleRows();

    const addListener = (element, type, listener) => {
        element.addEventListener(type, listener);
        eventListeners.push({ element, type, listener });
    };

    // Listeners per la tabella
    const tableBody = document.querySelector('#schedule-table tbody');
    addListener(tableBody, 'click', (e) => {
        const cell = e.target.closest('td');
        if (cell) openCellModal(cell.dataset.hour, cell.dataset.day);
    });

    // Listeners per la modale
    addListener(form, 'submit', handleCellFormSubmit);
    addListener(deleteBtn, 'click', handleDeleteEntry);
    addListener(document.getElementById('save-schedule-btn'), 'click', saveSchedule);
    addListener(modal.querySelector('.close-btn'), 'click', closeCellModal);
    addListener(window, 'click', (e) => {
        if (e.target === modal) closeCellModal();
    });

    await loadSubjects(); // Carica le materie prima di tutto
    await loadScheduleData(); // Carica i dati dell'orario e popola la griglia
    console.log("Pagina Orario configurata con materie integrate.");
};

export const cleanupSchedule = () => {
    console.log("Pulizia della pagina Orario...");
    eventListeners.forEach(({ element, type, listener }) => {
        element.removeEventListener(type, listener);
    });
    eventListeners = [];
    scheduleData = {};
    userSubjects = [];
};
