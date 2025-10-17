/**
 * Orario (Schedule) Page - JavaScript Module
 * CSS Grid-based schedule rendering with robust slot positioning
 * Supports multi-hour slots, collision detection, and deep-linking
 */

import { initBreadcrumbs } from '../../components/breadcrumbs/breadcrumbs.js';

/**
 * Orario Manager
 * Handles schedule data loading and grid rendering
 */
class OrarioManager {
  constructor() {
    this.scheduleData = null;
    this.gridContainer = null;
    
    // Grid configuration
    this.days = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì'];
    this.timeSlots = [
      '08:00', '09:00', '10:00', '11:00', '12:00', 
      '13:00', '14:00', '15:00', '16:00', '17:00'
    ];
    
    // Track occupied cells for collision detection
    this.occupiedCells = new Set();
  }

  /**
   * Initialize the Orario page
   */
  async init() {
    // Initialize breadcrumbs
    initBreadcrumbs('breadcrumbs-container');
    
    this.gridContainer = document.getElementById('schedule-grid');
    
    if (!this.gridContainer) {
      console.error('Schedule grid container not found');
      return;
    }
    
    // Load schedule data
    await this.loadScheduleData();
    
    // Render grid
    this.renderGrid();
    
    console.log('Orario page initialized');
  }

  /**
   * Load schedule data from mock JSON
   */
  async loadScheduleData() {
    try {
      // Try to load from mock file
      const response = await fetch('../../src/mock/orario-mock.json');
      
      if (response.ok) {
        this.scheduleData = await response.json();
      } else {
        // Fallback to inline mock data
        this.scheduleData = this.getDefaultMockData();
      }
    } catch (error) {
      console.warn('Error loading schedule data, using default mock:', error);
      this.scheduleData = this.getDefaultMockData();
    }
  }

  /**
   * Get default mock data
   */
  getDefaultMockData() {
    return {
      lessons: [
        {
          id: 'lesson-1',
          day: 'Lunedì',
          startTime: '08:00',
          endTime: '09:00',
          class: '3A',
          subject: 'Matematica',
          type: 'Teoria'
        },
        {
          id: 'lesson-2',
          day: 'Lunedì',
          startTime: '10:00',
          endTime: '12:00', // Multi-hour slot
          class: '3B',
          subject: 'Fisica',
          type: 'Laboratorio'
        },
        {
          id: 'lesson-3',
          day: 'Martedì',
          startTime: '09:00',
          endTime: '10:00',
          class: '3A',
          subject: 'Italiano',
          type: 'Teoria'
        },
        {
          id: 'lesson-4',
          day: 'Mercoledì',
          startTime: '14:00',
          endTime: '16:00', // Multi-hour slot
          class: '4A',
          subject: 'Storia',
          type: 'Seminario'
        },
        {
          id: 'lesson-5',
          day: 'Giovedì',
          startTime: '08:00',
          endTime: '09:00',
          class: '3A',
          subject: 'Matematica',
          type: 'Esercizi'
        },
        {
          id: 'lesson-6',
          day: 'Venerdì',
          startTime: '15:00',
          endTime: '17:00', // Multi-hour slot
          class: '5A',
          subject: 'Filosofia',
          type: 'Dibattito'
        }
      ]
    };
  }

  /**
   * Render the schedule grid
   */
  renderGrid() {
    // Clear existing content
    this.gridContainer.innerHTML = '';
    this.occupiedCells.clear();
    
    // Set up grid template
    const cols = this.days.length + 1; // +1 for time column
    const rows = this.timeSlots.length + 1; // +1 for header row
    
    this.gridContainer.style.gridTemplateColumns = `100px repeat(${this.days.length}, 1fr)`;
    this.gridContainer.style.gridTemplateRows = `auto repeat(${this.timeSlots.length}, 1fr)`;
    
    // Render header row (days)
    this.renderHeaderRow();
    
    // Render time slots and lessons
    this.renderTimeSlots();
    
    // Render lessons
    this.renderLessons();
    
    // Fill empty cells
    this.fillEmptyCells();
  }

  /**
   * Render header row with days
   */
  renderHeaderRow() {
    // Top-left corner cell (empty)
    const cornerCell = this.createCell('', 'header', 1, 1);
    this.gridContainer.appendChild(cornerCell);
    
    // Day headers
    this.days.forEach((day, index) => {
      const dayCell = this.createCell(day, 'header', 1, index + 2);
      this.gridContainer.appendChild(dayCell);
      
      // Mark as occupied
      this.markCellOccupied(1, index + 2);
    });
  }

  /**
   * Render time slot labels
   */
  renderTimeSlots() {
    this.timeSlots.forEach((time, index) => {
      const timeCell = this.createCell(time, 'time', index + 2, 1);
      this.gridContainer.appendChild(timeCell);
      
      // Mark as occupied
      this.markCellOccupied(index + 2, 1);
    });
  }

  /**
   * Render lessons into grid
   */
  renderLessons() {
    if (!this.scheduleData || !this.scheduleData.lessons) {
      console.warn('No lesson data to render');
      return;
    }
    
    this.scheduleData.lessons.forEach(lesson => {
      this.renderSlotToGrid(lesson);
    });
  }

  /**
   * Render a lesson slot to the grid with robust positioning
   * Handles multi-hour slots and collision detection
   */
  renderSlotToGrid(lesson) {
    try {
      // Get day column (1-based, +1 for time column)
      const dayIndex = this.days.indexOf(lesson.day);
      if (dayIndex === -1) {
        console.warn(`Invalid day: ${lesson.day}`);
        return;
      }
      const col = dayIndex + 2; // +1 for time column, +1 for 1-based
      
      // Get start row (1-based, +1 for header row)
      const startTimeIndex = this.timeSlots.indexOf(lesson.startTime);
      if (startTimeIndex === -1) {
        console.warn(`Invalid start time: ${lesson.startTime}`);
        return;
      }
      const startRow = startTimeIndex + 2; // +1 for header row, +1 for 1-based
      
      // Calculate row span
      const endTimeIndex = this.timeSlots.indexOf(lesson.endTime);
      let rowSpan = 1;
      
      if (endTimeIndex !== -1 && endTimeIndex > startTimeIndex) {
        // Multi-hour slot
        rowSpan = endTimeIndex - startTimeIndex;
      }
      
      // Collision detection
      const hasCollision = this.checkCollision(startRow, col, rowSpan, 1);
      if (hasCollision) {
        console.warn(`Collision detected for lesson ${lesson.id} at ${lesson.day} ${lesson.startTime}`);
        // Continue anyway but log the warning
      }
      
      // Create lesson cell
      const lessonCell = this.createLessonCell(lesson, startRow, col, rowSpan);
      this.gridContainer.appendChild(lessonCell);
      
      // Mark cells as occupied
      for (let r = startRow; r < startRow + rowSpan; r++) {
        this.markCellOccupied(r, col);
      }
      
    } catch (error) {
      console.error(`Error rendering lesson ${lesson.id}:`, error);
      // Fallback: try to render at a safe position
      this.renderLessonFallback(lesson);
    }
  }

  /**
   * Fallback rendering for lessons that fail normal rendering
   */
  renderLessonFallback(lesson) {
    console.warn(`Using fallback rendering for lesson ${lesson.id}`);
    
    // Try to find any free slot on the specified day
    const dayIndex = this.days.indexOf(lesson.day);
    if (dayIndex === -1) return;
    
    const col = dayIndex + 2;
    
    // Find first free row
    for (let row = 2; row <= this.timeSlots.length + 1; row++) {
      if (!this.isCellOccupied(row, col)) {
        const lessonCell = this.createLessonCell(lesson, row, col, 1);
        this.gridContainer.appendChild(lessonCell);
        this.markCellOccupied(row, col);
        return;
      }
    }
  }

  /**
   * Create a lesson cell
   */
  createLessonCell(lesson, row, col, rowSpan = 1) {
    const cell = document.createElement('div');
    cell.className = 'schedule-cell schedule-cell--lesson';
    cell.style.gridRow = `${row} / span ${rowSpan}`;
    cell.style.gridColumn = col;
    cell.setAttribute('role', 'button');
    cell.setAttribute('tabindex', '0');
    cell.setAttribute('aria-label', `Lezione di ${lesson.subject} per la classe ${lesson.class} il ${lesson.day} dalle ${lesson.startTime} alle ${lesson.endTime}`);
    
    cell.innerHTML = `
      <div class="lesson-class">${this.escapeHtml(lesson.class)}</div>
      <div class="lesson-subject">${this.escapeHtml(lesson.subject)}</div>
      <div class="lesson-time">${lesson.startTime} - ${lesson.endTime}</div>
    `;
    
    // Add click handler for deep-linking
    const deepLinkUrl = this.buildDeepLink(lesson);
    cell.addEventListener('click', () => {
      window.location.href = deepLinkUrl;
    });
    
    cell.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.location.href = deepLinkUrl;
      }
    });
    
    return cell;
  }

  /**
   * Build deep-link URL to In Classe page
   */
  buildDeepLink(lesson) {
    const params = new URLSearchParams({
      date: this.getCurrentWeekDate(lesson.day),
      time: lesson.startTime,
      class: lesson.class,
      subject: lesson.subject,
      slotId: lesson.id
    });
    
    return `../in-classe/in-classe.html?${params.toString()}`;
  }

  /**
   * Get date for a day in current week (simplified)
   */
  getCurrentWeekDate(dayName) {
    // For now, return current date
    // In production, calculate actual date based on day name
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Fill empty cells in the grid
   */
  fillEmptyCells() {
    const rows = this.timeSlots.length + 1;
    const cols = this.days.length + 1;
    
    for (let row = 2; row <= rows; row++) {
      for (let col = 2; col <= cols; col++) {
        if (!this.isCellOccupied(row, col)) {
          const emptyCell = this.createCell('', 'empty', row, col);
          this.gridContainer.appendChild(emptyCell);
        }
      }
    }
  }

  /**
   * Create a grid cell
   */
  createCell(content, type, row, col) {
    const cell = document.createElement('div');
    cell.className = `schedule-cell schedule-cell--${type}`;
    cell.style.gridRow = row;
    cell.style.gridColumn = col;
    cell.textContent = content;
    
    return cell;
  }

  /**
   * Mark a cell as occupied
   */
  markCellOccupied(row, col) {
    this.occupiedCells.add(`${row}-${col}`);
  }

  /**
   * Check if a cell is occupied
   */
  isCellOccupied(row, col) {
    return this.occupiedCells.has(`${row}-${col}`);
  }

  /**
   * Check for collision in a range of cells
   */
  checkCollision(startRow, col, rowSpan, colSpan) {
    for (let r = startRow; r < startRow + rowSpan; r++) {
      for (let c = col; c < col + colSpan; c++) {
        if (this.isCellOccupied(r, c)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Escape HTML
   */
  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}

// Initialize when DOM is ready
let orarioManager;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    orarioManager = new OrarioManager();
    orarioManager.init();
  });
} else {
  orarioManager = new OrarioManager();
  orarioManager.init();
}

// Make available globally
if (typeof window !== 'undefined') {
  window.orarioManager = orarioManager;
}

export default OrarioManager;
