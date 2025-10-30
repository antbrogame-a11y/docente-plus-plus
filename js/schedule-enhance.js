/**
 * schedule-enhance.js - Enhancement script for static schedule grid
 * Populates the grid from localStorage, adds keyboard navigation, and handles lesson entry
 */
(function() {
  'use strict';

  // ========== SAFEGUARDS: Suppress auto-open lesson picker ==========
  // Remove any auto-open state from localStorage
  try {
    localStorage.removeItem('lastOpenedLesson');
    localStorage.removeItem('lastOpenedClassId');
  } catch (e) {
    console.debug('schedule-enhance: failed to clear auto-open state', e);
  }

  // Hide the legacy lesson-picker modal and set aria-hidden
  const modal = document.getElementById('lesson-picker-modal');
  if (modal) {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  }

  // Override window.showLessonPicker and window.showLessonPickerInline with no-ops
  // that dispatch events so calling code knows they were suppressed
  window.__orig_showLessonPicker = window.showLessonPicker;
  window.__orig_showLessonPickerInline = window.showLessonPickerInline;
  
  window.showLessonPicker = function() {
    console.debug('schedule-enhance: showLessonPicker() suppressed');
    window.dispatchEvent(new CustomEvent('lesson-picker-suppressed', { 
      detail: { function: 'showLessonPicker' } 
    }));
    return false;
  };
  
  window.showLessonPickerInline = function() {
    console.debug('schedule-enhance: showLessonPickerInline() suppressed');
    window.dispatchEvent(new CustomEvent('lesson-picker-suppressed', { 
      detail: { function: 'showLessonPickerInline' } 
    }));
    return false;
  };

  // Set flag to disable auto lesson picker
  window.__disableAutoLessonPicker = true;
  // ========== END SAFEGUARDS ==========

  const STORAGE_KEYS = ['teacherSchedule', 'schedule', 'appSchedule', 'stateSchedule'];
  const DAY_ORDER = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];

  /**
   * Load schedule from storage using available APIs or fallback to localStorage
   */
  function loadSchedule() {
    // Try using the existing API if available
    if (typeof window.loadScheduleFromStorageOrOpener === 'function') {
      try {
        const schedule = window.loadScheduleFromStorageOrOpener();
        if (schedule) return schedule;
      } catch (e) {
        console.debug('schedule-enhance: loadScheduleFromStorageOrOpener failed', e);
      }
    }

    // Fallback to localStorage keys
    for (const key of STORAGE_KEYS) {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          const parsed = JSON.parse(data);
          if (parsed && (parsed.slots || Object.keys(parsed).length > 0)) {
            return parsed;
          }
        }
      } catch (e) {
        console.debug(`schedule-enhance: failed to parse ${key}`, e);
      }
    }
    return null;
  }

  /**
   * Normalize schedule to a flat array of slots
   */
  function normalizeSchedule(schedule) {
    if (!schedule) return [];
    
    // Already an array with slots
    if (Array.isArray(schedule.slots)) {
      return schedule.slots;
    }
    
    // Per-day arrays structure
    const slots = [];
    for (const key of Object.keys(schedule)) {
      if (Array.isArray(schedule[key])) {
        slots.push(...schedule[key]);
      }
    }
    return slots;
  }

  /**
   * Normalize individual slot data
   */
  function normalizeSlot(slot) {
    return {
      day: (slot.day || slot.giorno || '').toString().trim(),
      time: (slot.time || slot.orario || slot.hour || '').toString().trim(),
      subject: slot.subject || slot.materia || slot.title || '',
      classId: slot.classId || slot.classe || slot.group || '',
      activityType: slot.activityType || slot.tipo || '',
      lessonKey: slot.lessonKey || slot.key || `${slot.day || slot.giorno || ''}-${slot.time || slot.orario || ''}`
    };
  }

  /**
   * Deduplicate lessons by lessonKey
   */
  function deduplicateSlots(slots) {
    const seen = new Set();
    return slots.filter(slot => {
      if (seen.has(slot.lessonKey)) return false;
      seen.add(slot.lessonKey);
      return true;
    });
  }

  /**
   * Map slots to grid cells by data-day and data-time
   */
  function mapSlotsToGrid(slots) {
    const grid = {};
    
    slots.forEach(slot => {
      if (!slot.day || !slot.time) return;
      
      const key = `${slot.day}|${slot.time}`;
      if (!grid[key]) grid[key] = [];
      grid[key].push(slot);
    });
    
    return grid;
  }

  /**
   * Create a lesson button element
   */
  function createLessonButton(lessonKey, classId) {
    const btn = document.createElement('button');
    btn.className = 'btn btn-sm btn-primary slot-enter-btn';
    btn.setAttribute('data-lesson-key', lessonKey);
    btn.setAttribute('data-class-id', classId || '');
    btn.textContent = 'Entra';
    btn.setAttribute('aria-label', `Entra in lezione ${classId || ''}`);
    
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      enterLesson(lessonKey, classId);
    });
    
    return btn;
  }

  /**
   * Enter a lesson using available APIs or fallback
   */
  function enterLesson(lessonKey, classId) {
    // Try using the existing API if available
    if (typeof window.enterLessonFromSchedule === 'function') {
      try {
        window.enterLessonFromSchedule(lessonKey, classId);
        return;
      } catch (e) {
        console.debug('schedule-enhance: enterLessonFromSchedule failed', e);
      }
    }
    
    // Fallback: store in localStorage and reload
    try {
      localStorage.setItem('lastOpenedLesson', lessonKey);
      if (classId) {
        localStorage.setItem('lastOpenedClassId', classId);
      }
      window.location.reload();
    } catch (e) {
      console.error('schedule-enhance: failed to enter lesson', e);
    }
  }

  /**
   * Render a slot item inside a cell
   */
  function renderSlotItem(slot) {
    const item = document.createElement('div');
    item.className = 'slot-item';
    
    const info = document.createElement('div');
    info.className = 'slot-info';
    
    if (slot.subject) {
      const subject = document.createElement('div');
      subject.className = 'slot-subject';
      subject.textContent = slot.subject;
      info.appendChild(subject);
    }
    
    if (slot.classId) {
      const classIdEl = document.createElement('div');
      classIdEl.className = 'slot-class';
      classIdEl.textContent = slot.classId;
      info.appendChild(classIdEl);
    }
    
    if (slot.activityType) {
      const badge = document.createElement('span');
      badge.className = 'slot-badge';
      badge.textContent = slot.activityType;
      info.appendChild(badge);
    }
    
    item.appendChild(info);
    
    const actions = document.createElement('div');
    actions.className = 'slot-actions';
    actions.appendChild(createLessonButton(slot.lessonKey, slot.classId));
    item.appendChild(actions);
    
    return item;
  }

  /**
   * Populate the static grid with schedule data
   */
  function populateGrid() {
    const table = document.getElementById('static-schedule-grid');
    if (!table) {
      console.debug('schedule-enhance: static grid not found');
      return;
    }

    const schedule = loadSchedule();
    if (!schedule) {
      console.debug('schedule-enhance: no schedule data found');
      return;
    }

    let slots = normalizeSchedule(schedule);
    slots = slots.map(normalizeSlot).filter(s => s.day && s.time);
    slots = deduplicateSlots(slots);
    
    const grid = mapSlotsToGrid(slots);

    // Find all cells and populate them
    const cells = table.querySelectorAll('td[data-day][data-time]');
    cells.forEach(cell => {
      const day = cell.getAttribute('data-day');
      const time = cell.getAttribute('data-time');
      const key = `${day}|${time}`;
      const cellSlots = grid[key] || [];
      
      // Clear placeholder content
      cell.innerHTML = '';
      
      if (cellSlots.length === 0) {
        // Keep cell empty/with placeholder
        const placeholder = document.createElement('span');
        placeholder.className = 'slot-placeholder';
        placeholder.textContent = '—';
        placeholder.setAttribute('aria-label', 'Nessuna lezione');
        cell.appendChild(placeholder);
      } else {
        // Add all lessons for this cell
        cellSlots.forEach(slot => {
          cell.appendChild(renderSlotItem(slot));
        });
      }
    });

    console.debug('schedule-enhance: grid populated with', slots.length, 'lessons');
  }

  /**
   * Add keyboard navigation support
   */
  function addKeyboardNavigation() {
    const table = document.getElementById('static-schedule-grid');
    if (!table) return;

    const cells = Array.from(table.querySelectorAll('td[data-day][data-time]'));
    if (cells.length === 0) return;

    // Make cells focusable
    cells.forEach(cell => {
      if (!cell.hasAttribute('tabindex')) {
        cell.setAttribute('tabindex', '-1');
      }
    });

    // Set first cell as initially focusable
    if (cells[0]) cells[0].setAttribute('tabindex', '0');

    // Helper to get grid dimensions
    function getGridDimensions() {
      const rows = new Set();
      const cols = new Set();
      cells.forEach(cell => {
        rows.add(cell.getAttribute('data-time'));
        cols.add(cell.getAttribute('data-day'));
      });
      return {
        rows: Array.from(rows),
        cols: Array.from(cols).sort((a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b))
      };
    }

    // Helper to find cell by row/col
    function findCell(row, col) {
      return cells.find(c => 
        c.getAttribute('data-time') === row && 
        c.getAttribute('data-day') === col
      );
    }

    // Navigation handler
    table.addEventListener('keydown', function(e) {
      const target = e.target;
      if (target.tagName !== 'TD') return;

      const currentRow = target.getAttribute('data-time');
      const currentCol = target.getAttribute('data-day');
      const { rows, cols } = getGridDimensions();
      
      const rowIdx = rows.indexOf(currentRow);
      const colIdx = cols.indexOf(currentCol);
      
      let newCell = null;

      switch(e.key) {
        case 'ArrowUp':
          if (rowIdx > 0) {
            newCell = findCell(rows[rowIdx - 1], currentCol);
          }
          break;
        case 'ArrowDown':
          if (rowIdx < rows.length - 1) {
            newCell = findCell(rows[rowIdx + 1], currentCol);
          }
          break;
        case 'ArrowLeft':
          if (colIdx > 0) {
            newCell = findCell(currentRow, cols[colIdx - 1]);
          }
          break;
        case 'ArrowRight':
          if (colIdx < cols.length - 1) {
            newCell = findCell(currentRow, cols[colIdx + 1]);
          }
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          handleCellActivation(target);
          return;
        default:
          return;
      }

      if (newCell) {
        e.preventDefault();
        target.setAttribute('tabindex', '-1');
        newCell.setAttribute('tabindex', '0');
        newCell.focus();
      }
    });
  }

  /**
   * Handle cell activation (Enter/Space key)
   */
  function handleCellActivation(cell) {
    const buttons = cell.querySelectorAll('.slot-enter-btn');
    
    if (buttons.length === 0) {
      // No lessons
      return;
    } else if (buttons.length === 1) {
      // Single lesson - click the button
      buttons[0].click();
    } else {
      // Multiple lessons - dispatch custom event
      const event = new CustomEvent('open-lesson-list', {
        detail: {
          cell: cell,
          lessons: Array.from(buttons).map(btn => ({
            lessonKey: btn.getAttribute('data-lesson-key'),
            classId: btn.getAttribute('data-class-id')
          }))
        },
        bubbles: true
      });
      cell.dispatchEvent(event);
    }
  }

  /**
   * Hide the legacy lesson-picker modal to prevent auto-opening
   */
  function hideLegacyModal() {
    const modal = document.getElementById('lesson-picker-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  /**
   * Initialize the schedule grid enhancement
   */
  function initScheduleGrid() {
    hideLegacyModal();
    populateGrid();
    addKeyboardNavigation();
  }

  // Expose public API
  window.initScheduleGrid = initScheduleGrid;

  // Auto-initialize on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScheduleGrid);
  } else {
    // DOM already loaded
    initScheduleGrid();
  }
})();
