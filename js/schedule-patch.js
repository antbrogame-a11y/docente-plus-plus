/* schedule-patch.js - improved renderer: normalize, dedupe and stacked lessons */
(function () {
    const DAY_ORDER = ['Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato','Domenica'];

    function sortDays(days) {
        return Array.from(days).sort((a,b) => {
            const ia = DAY_ORDER.indexOf(a), ib = DAY_ORDER.indexOf(b);
            if (ia === -1 && ib === -1) return a.localeCompare(b);
            if (ia === -1) return 1;
            if (ib === -1) return -1;
            return ia - ib;
        });
    }

    function escapeHtml(str) {
        if (!str && str !== 0) return '';
        return String(str).replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
    }
    function encodeHtmlAttr(str) { return escapeHtml(str).replace(/"/g,'&quot;'); }

    function buildSlotsArray(schedule) {
        if (!schedule) return [];
        if (Array.isArray(schedule.slots)) return schedule.slots;
        const arr = [];
        for (const k of Object.keys(schedule)) {
            if (Array.isArray(schedule[k])) arr.push(...schedule[k]);
        }
        return arr;
    }

    function hideLegacyModal() {
        try {
            const legacyModal = document.getElementById('lesson-picker-modal');
            if (legacyModal) legacyModal.style.display = 'none';
        } catch (e) { /* ignore */ }
    }

    function newRenderScheduleView() {
        hideLegacyModal();

        const schedule = (typeof loadScheduleFromStorageOrOpener === 'function') ? loadScheduleFromStorageOrOpener() : null;
        const container = document.getElementById('schedule-container');
        if (!container) return;

        console.debug('schedule-patch: raw schedule', schedule);

        let slots = buildSlotsArray(schedule);

        slots = slots.map(s => ({
            day: (s.day || s.giorno || '').toString().trim(),
            time: (s.time || s.orario || s.hour || '').toString().trim(),
            subject: s.subject || s.materia || s.title || '',
            classId: s.classId || s.classe || s.group || '',
            lessonKey: s.lessonKey || s.key || `${s.day || s.giorno || ''}-${s.time || s.orario || ''}`
        })).filter(s => s.day && s.time);

        const map = {};
        const daysSet = new Set();
        const timesSet = new Set();
        slots.forEach(s => {
            daysSet.add(s.day);
            timesSet.add(s.time);
            if (!map[s.time]) map[s.time] = {};
            if (!map[s.time][s.day]) map[s.time][s.day] = [];
            if (!map[s.time][s.day].some(x => x.lessonKey === s.lessonKey)) {
                map[s.time][s.day].push(s);
            }
        });

        if (daysSet.size === 0 || timesSet.size === 0) {
            container.innerHTML = `
                <div class="empty-schedule" style="padding:var(--spacing-md);">
                    <h3>Nessuna lezione disponibile nell'orario</h3>
                    <p>Puoi selezionare manualmente la lezione oppure caricare l'orario dalle Impostazioni.</p>
                    <div style="margin-top:12px;">
                        <button id="open-lesson-picker-inline" class="btn btn-secondary">Seleziona manualmente</button>
                        <button id="use-default-lesson" class="btn btn-primary">Usa default (Lunedì 08:00)</button>
                    </div>
                </div>`;
            const btn = document.getElementById('open-lesson-picker-inline');
            if (btn) btn.addEventListener('click', () => { if (this && typeof this.showLessonPickerInline === 'function') this.showLessonPickerInline(); });
            const defaultBtn = document.getElementById('use-default-lesson');
            if (defaultBtn) defaultBtn.addEventListener('click', () => { if (this && typeof this.enterLessonFromSchedule === 'function') this.enterLessonFromSchedule('Lunedì-08:00', null); });
            return;
        }

        const days = sortDays(daysSet);
        const times = Array.from(timesSet).sort((a,b) => a.localeCompare(b));

        let html = '<div class="schedule-table" role="table" aria-label="Orario della settimana">';
        html += `<div class="header-cell" role="columnheader" aria-hidden="true"></div>`;
        days.forEach(day => { html += `<div class="header-cell" role="columnheader">${escapeHtml(day)}</div>`; });

        times.forEach(time => {
            html += `<div class="time-cell" role="rowheader">${escapeHtml(time)}</div>`;
            days.forEach(day => {
                const bucket = (map[time] && map[time][day]) ? map[time][day] : [];
                if (bucket.length === 0) {
                    html += `<div class="slot-cell" role="cell" aria-label="Nessuna lezione"></div>`;
                } else {
                    html += `<div class="slot-cell" role="cell">`;
                    bucket.forEach(slot => {
                        const lessonKey = slot.lessonKey;
                        const subject = slot.subject || '—';
                        const classId = slot.classId || '';
                        html += `<div class="slot-item">`;
                        html += `<div class="slot-item-info"><div class="slot-subject" style="font-weight:600">${escapeHtml(subject)}</div><div class="slot-class" style="font-size:.9rem;color:var(--md-text-secondary)">${escapeHtml(classId)}</div></div>`;
                        html += `<div class="slot-actions"><button class="btn btn-sm btn-primary enter-lesson-btn" data-lesson-key="${encodeHtmlAttr(lessonKey)}" data-class-id="${encodeHtmlAttr(classId)}" aria-label="Entra in lezione ${escapeHtml(subject)} ${escapeHtml(classId)}">Entra</button></div>`;
                        html += `</div>`;
                    });
                    html += `</div>`;
                }
            });
        });

        html += '</div>';
        container.innerHTML = html;

        container.querySelectorAll('.enter-lesson-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lessonKey = e.currentTarget.getAttribute('data-lesson-key');
                const classId = e.currentTarget.getAttribute('data-class-id') || null;
                if (this && typeof this.enterLessonFromSchedule === 'function') {
                    this.enterLessonFromSchedule(lessonKey, classId);
                } else {
                    try { localStorage.setItem('lastOpenedLesson', lessonKey); if (classId) localStorage.setItem('lastOpenedClassId', classId); } catch (err) {}
                    window.location.reload();
                }
            });
        });
    }

    function tryPatch() {
        if (window.InClasseUI && window.InClasseUI.prototype) {
            window.InClasseUI.prototype.renderScheduleView = newRenderScheduleView;
            if (typeof window.InClasseUI.prototype.init === 'function') {
                const originalInit = window.InClasseUI.prototype.init;
                window.InClasseUI.prototype.init = function(...args) {
                    try { hideLegacyModal(); } catch(e){}
                    return originalInit.apply(this, args);
                };
            }
            return true;
        }
        return false;
    }

    if (!tryPatch()) {
        window.addEventListener('DOMContentLoaded', () => {
            const maxAttempts = 12; let attempts = 0;
            const timer = setInterval(() => {
                attempts++;
                if (tryPatch() || attempts >= maxAttempts) clearInterval(timer);
            }, 200);
        });
    }
})();
