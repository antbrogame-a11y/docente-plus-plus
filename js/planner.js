
// js/planner.js

/**
 * @module planner
 * Gestisce la logica di pianificazione intelligente e la validazione dell'orario.
 */

import { state } from './data.js';
import { showToast } from './ui.js';

// --- REGOLE DEL PIANIFICATORE ---
const MAX_HOURS_PER_DAY = 5;
const WORKING_DAYS = [1, 2, 3, 4, 5]; // Da Lunedì (1) a Venerdì (5)
const START_HOUR = 8;
const END_HOUR = 14;

/**
 * Controlla se è possibile aggiungere un evento in una data e ora specifica.
 * @param {string} isoDate - La data in formato YYYY-MM-DD.
 * @param {string} time - L'ora in formato HH:MM.
 * @returns {{isValid: boolean, reason: string | null}}
 */
export function canSchedule(isoDate, time) {
    const date = new Date(`${isoDate}T${time || '00:00:00'}`);
    const dayOfWeek = date.getDay();
    const hour = date.getHours();

    // 1. Controlla se è un giorno lavorativo (Lunedì-Venerdì)
    if (!WORKING_DAYS.includes(dayOfWeek)) {
        const reason = 'Non è possibile pianificare nel weekend (Sabato o Domenica).';
        showToast(reason, 'warning');
        return { isValid: false, reason };
    }

    // 2. Controlla se l'ora è nell'intervallo lavorativo (8-14)
    if (hour < START_HOUR || hour >= END_HOUR) {
        const reason = `L'orario deve essere compreso tra le ${START_HOUR}:00 e le ${END_HOUR}:00.`;
        showToast(reason, 'warning');
        return { isValid: false, reason };
    }

    // 3. Controlla se lo slot orario è già occupato
    const lessonsInSlot = state.lessons.filter(l => l.date === isoDate && l.time.startsWith(time.substring(0, 2)));
    if (lessonsInSlot.length > 0) {
        const reason = `Slot orario ${time} già occupato da un'altra lezione.`;
        showToast(reason, 'warning');
        return { isValid: false, reason };
    }

    // 4. Controlla il numero massimo di ore giornaliere
    const hoursOnDate = state.lessons.filter(l => l.date === isoDate).length;
    if (hoursOnDate >= MAX_HOURS_PER_DAY) {
        const reason = `Limite massimo di ${MAX_HOURS_PER_DAY} ore giornaliere già raggiunto.`;
        showToast(reason, 'error');
        return { isValid: false, reason };
    }

    // Se tutti i controlli passano, è possibile pianificare
    return { isValid: true, reason: null };
}

/**
 * Trova il prossimo slot disponibile basandosi sulle regole.
 * @param {string} [startingDate=today] - La data da cui iniziare la ricerca (YYYY-MM-DD).
 * @returns {{date: string, time: string} | null}
 */
export function findNextAvailableSlot(startingDate) {
    let currentDate = startingDate ? new Date(startingDate) : new Date();
    currentDate.setHours(START_HOUR, 0, 0, 0); // Inizia la ricerca dall'inizio della giornata lavorativa

    // Cicla per un massimo di 30 giorni per evitare loop infiniti
    for (let i = 0; i < 30; i++) {
        const isoDate = currentDate.toISOString().split('T')[0];
        
        // Prova a pianificare per ogni ora lavorativa della giornata corrente
        for (let hour = START_HOUR; hour < END_HOUR; hour++) {
            const time = `${String(hour).padStart(2, '0')}:00`;
            const check = canSchedule(isoDate, time);
            if (check.isValid) {
                // Trovato uno slot valido
                return { date: isoDate, time };
            }
        }

        // Se non ci sono slot disponibili oggi, passa al giorno successivo
        currentDate.setDate(currentDate.getDate() + 1);
    }

    showToast('Nessuno slot disponibile trovato nei prossimi 30 giorni.', 'info');
    return null; // Non è stato trovato nessuno slot
}
