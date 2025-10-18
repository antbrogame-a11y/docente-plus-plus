(function preventAutoLessonPickerAutoOpen() {
  try {
    try { localStorage.removeItem('lastOpenedLesson'); } catch (e) {}
    try { localStorage.removeItem('lastOpenedClassId'); } catch (e) {}
    try {
      const legacyModal = document.getElementById('lesson-picker-modal') || document.querySelector('.lesson-picker-modal');
      if (legacyModal) { legacyModal.style.display = 'none'; legacyModal.setAttribute('aria-hidden', 'true'); }
    } catch (e) {}
    try {
      if (window && typeof window.showLessonPicker === 'function' && !window.__orig_showLessonPicker) { window.__orig_showLessonPicker = window.showLessonPicker; window.showLessonPicker = function () { console.debug('Auto-open of lesson picker suppressed.'); window.dispatchEvent(new CustomEvent('lesson-picker-suppressed', { bubbles: true })); }; }
      if (window && typeof window.showLessonPickerInline === 'function' && !window.__orig_showLessonPickerInline) { window.__orig_showLessonPickerInline = window.showLessonPickerInline; window.showLessonPickerInline = function () { console.debug('Auto-open of inline lesson picker suppressed.'); window.dispatchEvent(new CustomEvent('lesson-picker-inline-suppressed', { bubbles: true })); }; }
    } catch (e) {}
    try { window.__disableAutoLessonPicker = true; } catch (e) {}
  } catch (err) { console.warn('preventAutoLessonPickerAutoOpen error', err); }
})();
(function () {
  function loadSchedule() {
    if (typeof window.loadScheduleFromStorageOrOpener === 'function') return window.loadScheduleFromStorageOrOpener();
    try { const keys = ['teacherSchedule','schedule','appSchedule','stateSchedule']; for (const k of keys) { const raw = localStorage.getItem(k); if (raw) { try { return JSON.parse(raw); } catch (e) { continue; } } } } catch (e) {}
    return null;
  }
  function renderCell(cell, lessons) {
    cell.innerHTML = '';
    if (!lessons || lessons.length === 0) { const span = document.createElement('div'); span.className = 'empty-slot'; span.textContent = '—'; cell.appendChild(span); cell.setAttribute('aria-label', `Nessuna lezione ${cell.dataset.day} ${cell.dataset.time}`); return; }
    lessons.forEach(lesson => {
      const item = document.createElement('div'); item.className = 'slot-item'; const info = document.createElement('div'); info.className = 'slot-subject'; info.textContent = lesson.subject || lesson.title || lesson.materia || 'Lezione'; const actions = document.createElement('div'); actions.className = 'slot-actions'; const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'btn-enter'; btn.textContent = 'Entra'; btn.dataset.lessonKey = lesson.lessonKey || lesson.key || `${lesson.day || cell.dataset.day}-${lesson.time || cell.dataset.time}`; if (lesson.classId) btn.dataset.classId = lesson.classId; btn.addEventListener('click', (e) => { e.stopPropagation(); const lk = e.currentTarget.dataset.lessonKey; const cid = e.currentTarget.dataset.classId || null; const day = cell.dataset.day || null; const time = cell.dataset.time || null; if (window && typeof window.enterLessonFromSchedule === 'function') { try { window.enterLessonFromSchedule(lk, cid); return; } catch (err) {} } enterLessonInPlace(lk, cid, day, time); }); actions.appendChild(btn); item.appendChild(info); item.appendChild(actions); cell.appendChild(item); });
  }
  function populateGrid(schedule) {
    const slots = [];
    if (!schedule) return;
    if (Array.isArray(schedule.slots)) slots.push(...schedule.slots); else Object.keys(schedule).forEach(k => { if (Array.isArray(schedule[k])) slots.push(...schedule[k]); });
    const map = {};
    slots.forEach(s => { const day = (s.day||s.giorno||s.weekday||'').toString().trim(); const time = (s.time||s.orario||s.hour||'').toString().trim(); if (!day||!time) return; if (!map[time]) map[time]={}; if (!map[time][day]) map[time][day]=[]; const lk = s.lessonKey||s.key||`${day}-${time}`; if (!map[time][day].some(x => (x.lessonKey||x.key)===lk)) map[time][day].push(Object.assign({},s,{lessonKey:lk})); });
    const selector = '#schedule-grid, #static-schedule-grid';
    const cells = Array.from(document.querySelectorAll(selector + ' td[role="gridcell"], ' + selector + ' td[data-day]'));
    cells.forEach(cell => { const day = cell.dataset.day; const time = cell.dataset.time || cell.querySelector('.schedule-time')?.textContent || cell.closest('tr')?.querySelector('.schedule-time')?.textContent; const lessons = (map[time] && map[time][day]) ? map[time][day] : []; renderCell(cell, lessons); });
  }
  function enableGridKeyboard() {
    const selector = document.getElementById('schedule-grid') || document.getElementById('static-schedule-grid');
    const grid = selector; if (!grid) return; const rows = Array.from(grid.tBodies[0].rows); const coords = new Map(); rows.forEach((row,rIdx)=>{ Array.from(row.cells).slice(1).forEach((cell,cIdx)=>{ coords.set(cell,{r:rIdx,c:cIdx}); cell.setAttribute('tabindex','-1'); }); });
    function getCellAt(rowIndex,colIndex){ const row=rows[rowIndex]; if(!row) return null; return row.cells[colIndex+1]; }
    function setFocusedCell(cell){ Array.from(grid.querySelectorAll('td[data-day]')).forEach(td=>td.setAttribute('tabindex', td===cell?'0':'-1')); if(cell) cell.focus(); }
    const cells = Array.from(grid.querySelectorAll('td[data-day]'));
    let initialCell = cells.find(c=>c.querySelector('.slot-item'))||cells[0]; if(initialCell) initialCell.setAttribute('tabindex','0');
    grid.addEventListener('keydown', (e)=>{ const active=document.activeElement; if(!coords.has(active)) return; const {r,c}=coords.get(active); let target=null; switch(e.key){ case 'ArrowRight': target=getCellAt(r, Math.min(c+1, rows[0].cells.length-2)); break; case 'ArrowLeft': target=getCellAt(r, Math.max(c-1,0)); break; case 'ArrowDown': target=getCellAt(Math.min(r+1, rows.length-1), c); break; case 'ArrowUp': target=getCellAt(Math.max(r-1,0), c); break; case 'Enter': case ' ': e.preventDefault(); const lessons=Array.from(active.querySelectorAll('.slot-item')); if(lessons.length===0){ const ev=new CustomEvent('open-lesson-picker-inline',{bubbles:true}); active.dispatchEvent(ev); } else if(lessons.length===1){ const btn=active.querySelector('.slot-actions button'); if(btn) btn.click(); } else { const ev=new CustomEvent('open-lesson-list',{detail:{day:active.dataset.day,time:active.dataset.time},bubbles:true}); active.dispatchEvent(ev); } return; default: return; } if(target){ setFocusedCell(target); e.preventDefault(); } });
    cells.forEach(cell=>{ cell.addEventListener('click',()=>setFocusedCell(cell)); cell.addEventListener('open-lesson-picker-inline', ()=>{ if(window && typeof window.showLessonPickerInline==='function') window.showLessonPickerInline(); }); });
  }
  function enterLessonInPlace(lessonKey, classId, day, time){ document.body.classList.add('lesson-mode'); document.body.dataset.lessonKey=lessonKey||''; if(classId) document.body.dataset.classId=classId; if(day) document.body.dataset.lessonDay=day; if(time) document.body.dataset.lessonTime=time; const topTitle=document.querySelector('.topbar .title')||document.querySelector('#topbar-title'); if(topTitle) topTitle.textContent = `${day||''} ${time||''}`.trim()||'Lezione'; const scheduleWrapper=document.getElementById('schedule-wrapper')||document.querySelector('.schedule-table-wrapper'); const lessonPanel=document.getElementById('lesson-panel'); if(scheduleWrapper) scheduleWrapper.classList.add('hidden'); if(lessonPanel){ lessonPanel.classList.remove('hidden'); lessonPanel.setAttribute('aria-hidden','false'); lessonPanel.innerHTML = '<div class="loading">Caricamento lezione…</div>'; }
    if(window && typeof window.fetchLessonDetails==='function'){ window.fetchLessonDetails(lessonKey,classId).then(data=>populateLessonPanel(lessonPanel,data)).catch(()=>populateLessonPanel(lessonPanel,{title:lessonKey||'Lezione',description:''})); } else { populateLessonPanel(lessonPanel,{title:lessonKey||'Lezione',description:''}); }
    try{ if(window && typeof window.trackEvent==='function') window.trackEvent('enter_lesson',{lessonKey, classId, day, time}); }catch(e){}
    try{ history.pushState({lessonKey,classId,day,time},'',`#lesson-${encodeURIComponent(lessonKey||'')}`); }catch(e){}
    setTimeout(()=>{ const foc = lessonPanel && lessonPanel.querySelector('[tabindex], button, a'); if(foc) foc.focus(); },100);
  }
  function populateLessonPanel(panel,data){ if(!panel) return; panel.innerHTML=''; const h=document.createElement('h2'); h.textContent=data.title||'Lezione'; const p=document.createElement('p'); p.textContent=data.description||''; panel.appendChild(h); panel.appendChild(p); const exit=document.createElement('button'); exit.type='button'; exit.textContent='Esci lezione'; exit.addEventListener('click',()=>{ document.body.classList.remove('lesson-mode'); if(panel){ panel.classList.add('hidden'); panel.setAttribute('aria-hidden','true'); } const scheduleWrapper=document.getElementById('schedule-wrapper')||document.querySelector('.schedule-table-wrapper'); if(scheduleWrapper) scheduleWrapper.classList.remove('hidden'); try{ history.back(); }catch(e){} }); panel.appendChild(exit); }
  function initScheduleGrid(){ const root = document.getElementById('schedule-grid') || document.getElementById('static-schedule-grid'); if(!root) return; const schedule=loadSchedule(); populateGrid(schedule); enableGridKeyboard(); }
  window.initScheduleGrid = initScheduleGrid; document.addEventListener('DOMContentLoaded', ()=>{ setTimeout(initScheduleGrid,50); });
})();