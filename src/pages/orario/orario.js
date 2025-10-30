/**
 * Orario (Schedule) Module
 * Grid-based timetable rendering with collision detection
 * Mobile-first, accessible schedule display
 */

/**
 * Normalize time string to HH:MM format
 * @param {string} time - Time string in various formats (e.g., "8:00", "08:00", "8")
 * @returns {string} Normalized time in HH:MM format
 */
export function normalizeTime(time) {
  if (!time || typeof time !== 'string') {
    console.warn('Invalid time input:', time);
    return '00:00';
  }

  // Remove whitespace
  time = time.trim();

  // Handle HH:MM format
  if (time.includes(':')) {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours, 10);
    const m = parseInt(minutes, 10);
    
    if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) {
      console.warn('Invalid time format:', time);
      return '00:00';
    }
    
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  // Handle hour-only format
  const h = parseInt(time, 10);
  if (isNaN(h) || h < 0 || h > 23) {
    console.warn('Invalid hour:', time);
    return '00:00';
  }
  
  return `${String(h).padStart(2, '0')}:00`;
}

/**
 * Convert day name to column index (1-indexed for CSS Grid)
 * @param {string} day - Day name (e.g., "Lunedì", "Monday")
 * @returns {number} Column index (1 = Monday, 5 = Friday, 0 = invalid)
 */
export function dayToColumnIndex(day) {
  if (!day || typeof day !== 'string') {
    console.warn('Invalid day input:', day);
    return 0;
  }

  const dayMap = {
    'lunedì': 1,
    'monday': 1,
    'lun': 1,
    'mon': 1,
    'martedì': 2,
    'tuesday': 2,
    'mar': 2,
    'tue': 2,
    'mercoledì': 3,
    'wednesday': 3,
    'mer': 3,
    'wed': 3,
    'giovedì': 4,
    'thursday': 4,
    'gio': 4,
    'thu': 4,
    'venerdì': 5,
    'friday': 5,
    'ven': 5,
    'fri': 5,
    'sabato': 6,
    'saturday': 6,
    'sab': 6,
    'sat': 6,
    'domenica': 7,
    'sunday': 7,
    'dom': 7,
    'sun': 7
  };

  const normalized = day.toLowerCase().trim();
  return dayMap[normalized] || 0;
}

/**
 * Convert time to row index (1-indexed for CSS Grid)
 * @param {string} time - Time in HH:MM format
 * @param {string} startTime - Start time of the schedule (default "08:00")
 * @returns {number} Row index (1 = first time slot)
 */
export function timeToRowIndex(time, startTime = '08:00') {
  const normalized = normalizeTime(time);
  const normalizedStart = normalizeTime(startTime);
  
  // Parse hours and minutes
  const [hours, minutes] = normalized.split(':').map(Number);
  const [startHours, startMinutes] = normalizedStart.split(':').map(Number);
  
  // Convert to minutes since midnight
  const timeInMinutes = hours * 60 + minutes;
  const startInMinutes = startHours * 60 + startMinutes;
  
  // Calculate offset in hours (each row = 1 hour)
  const offsetInMinutes = timeInMinutes - startInMinutes;
  const rowIndex = Math.floor(offsetInMinutes / 60) + 1;
  
  return rowIndex > 0 ? rowIndex : 1;
}

/**
 * Calculate duration in grid rows (hours)
 * @param {string} startTime - Start time in HH:MM format
 * @param {string} endTime - End time in HH:MM format
 * @returns {number} Duration in hours (grid rows)
 */
export function calculateDuration(startTime, endTime) {
  const normalizedStart = normalizeTime(startTime);
  const normalizedEnd = normalizeTime(endTime);
  
  const [startHours, startMinutes] = normalizedStart.split(':').map(Number);
  const [endHours, endMinutes] = normalizedEnd.split(':').map(Number);
  
  const startInMinutes = startHours * 60 + startMinutes;
  const endInMinutes = endHours * 60 + endMinutes;
  
  const durationInMinutes = endInMinutes - startInMinutes;
  return Math.ceil(durationInMinutes / 60);
}

/**
 * Detect collision between two schedule slots
 * @param {Object} slot1 - First schedule slot
 * @param {Object} slot2 - Second schedule slot
 * @returns {boolean} True if slots collide
 */
export function detectCollision(slot1, slot2) {
  if (!slot1 || !slot2) return false;
  
  // Slots on different days don't collide
  if (slot1.day !== slot2.day) return false;
  
  const start1 = normalizeTime(slot1.startTime);
  const end1 = normalizeTime(slot1.endTime);
  const start2 = normalizeTime(slot2.startTime);
  const end2 = normalizeTime(slot2.endTime);
  
  // Convert to minutes for comparison
  const [h1s, m1s] = start1.split(':').map(Number);
  const [h1e, m1e] = end1.split(':').map(Number);
  const [h2s, m2s] = start2.split(':').map(Number);
  const [h2e, m2e] = end2.split(':').map(Number);
  
  const start1Min = h1s * 60 + m1s;
  const end1Min = h1e * 60 + m1e;
  const start2Min = h2s * 60 + m2s;
  const end2Min = h2e * 60 + m2e;
  
  // Check for overlap
  return !(end1Min <= start2Min || start1Min >= end2Min);
}

/**
 * Render a schedule slot to the grid
 * @param {Object} slot - Schedule slot data
 * @param {HTMLElement} gridContainer - Grid container element
 * @param {Object} options - Rendering options
 * @returns {HTMLElement} Created slot element
 */
export function renderSlotToGrid(slot, gridContainer, options = {}) {
  if (!slot || !gridContainer) {
    console.error('Invalid slot or grid container');
    return null;
  }

  const {
    startTime: scheduleStartTime = '08:00',
    onSlotClick = null,
    collisionDetection = true
  } = options;

  // Calculate grid position
  const columnIndex = dayToColumnIndex(slot.day);
  if (columnIndex === 0) {
    console.error('Invalid day:', slot.day);
    return null;
  }

  const rowStart = timeToRowIndex(slot.startTime, scheduleStartTime);
  const duration = calculateDuration(slot.startTime, slot.endTime);
  const rowEnd = rowStart + duration;

  // Check for collisions if enabled
  if (collisionDetection) {
    const existingSlots = Array.from(gridContainer.querySelectorAll('.schedule-slot'));
    const hasCollision = existingSlots.some(existingElement => {
      const existingSlot = {
        day: existingElement.dataset.day,
        startTime: existingElement.dataset.startTime,
        endTime: existingElement.dataset.endTime
      };
      return detectCollision(slot, existingSlot);
    });

    if (hasCollision) {
      console.warn('Collision detected for slot:', slot.id);
      // You can handle collision here (e.g., adjust position, show warning, etc.)
    }
  }

  // Create slot element
  const slotElement = document.createElement('div');
  slotElement.className = 'schedule-slot';
  slotElement.dataset.slotId = slot.id;
  slotElement.dataset.day = slot.day;
  slotElement.dataset.startTime = slot.startTime;
  slotElement.dataset.endTime = slot.endTime;
  
  // Set grid position using CSS custom properties
  slotElement.style.gridColumn = columnIndex;
  slotElement.style.gridRow = `${rowStart} / ${rowEnd}`;
  
  // Apply custom color if provided
  if (slot.color) {
    slotElement.style.backgroundColor = slot.color;
  }

  // Add accessibility attributes
  slotElement.setAttribute('role', 'button');
  slotElement.setAttribute('tabindex', '0');
  slotElement.setAttribute('aria-label', 
    `${slot.subject}, ${slot.class}, ${slot.day} ${slot.startTime}-${slot.endTime}`
  );

  // Build slot content
  const content = `
    <div class="slot-header">
      <span class="slot-time">${slot.startTime} - ${slot.endTime}</span>
      ${slot.multiHour ? '<span class="slot-badge">Multi-ora</span>' : ''}
    </div>
    <div class="slot-body">
      <div class="slot-subject">${slot.subject}</div>
      <div class="slot-class">${slot.class}</div>
      <div class="slot-room">${slot.room || ''}</div>
    </div>
    ${slot.type ? `<div class="slot-type">${slot.type}</div>` : ''}
  `;
  
  slotElement.innerHTML = content;

  // Add click handler
  if (onSlotClick) {
    slotElement.addEventListener('click', () => onSlotClick(slot));
    slotElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSlotClick(slot);
      }
    });
  }

  // Append to grid
  gridContainer.appendChild(slotElement);

  return slotElement;
}

/**
 * Initialize and render the schedule grid
 * @param {Array} slots - Array of schedule slot objects
 * @param {HTMLElement} container - Container element for the grid
 * @param {Object} options - Rendering options
 */
export function initializeScheduleGrid(slots, container, options = {}) {
  if (!container) {
    console.error('Container element is required');
    return;
  }

  if (!Array.isArray(slots)) {
    console.error('Slots must be an array');
    return;
  }

  // Clear existing content
  container.innerHTML = '';
  container.className = 'timetable';

  // Add accessibility attributes
  container.setAttribute('role', 'grid');
  container.setAttribute('aria-label', 'Orario settimanale');

  // Render each slot
  slots.forEach(slot => {
    renderSlotToGrid(slot, container, options);
  });

  console.log(`Rendered ${slots.length} schedule slots`);
}

/**
 * Load schedule data from mock JSON
 * @param {string} jsonPath - Path to JSON file
 * @returns {Promise<Object>} Schedule data
 */
export async function loadScheduleData(jsonPath = '/src/mock/orario-mock.json') {
  try {
    const response = await fetch(jsonPath);
    if (!response.ok) {
      throw new Error(`Failed to load schedule: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading schedule data:', error);
    return { schedule: [], timeSlots: [], days: [] };
  }
}
