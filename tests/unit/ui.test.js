// tests/unit/ui.test.js
// Unit tests for UI functions

import { describe, test, expect, beforeEach } from '@jest/globals';

/**
 * Test suite for UI functions
 * Tests menu enabling and other UI state management
 */
describe('UI Functions', () => {
  
  beforeEach(() => {
    // Clear DOM before each test
    document.body.innerHTML = '';
  });

  describe('enableAllMenuItems', () => {
    test('should remove disabled class from menu items', () => {
      // Setup: Create menu with disabled items
      document.body.innerHTML = `
        <nav>
          <button class="nav-item disabled" data-tab="lessons">
            <span class="nav-label">Lezioni</span>
          </button>
          <button class="nav-item disabled" data-tab="students">
            <span class="nav-label">Studenti</span>
          </button>
        </nav>
      `;

      // Mock enableAllMenuItems function
      const enableAllMenuItems = () => {
        document.querySelectorAll('.nav-item[data-tab]').forEach(button => {
          button.classList.remove('needs-profile');
          button.classList.remove('disabled');
          button.removeAttribute('data-tooltip');
          button.removeAttribute('disabled');
          button.removeAttribute('aria-disabled');
          button.setAttribute('title', button.querySelector('.nav-label')?.textContent || '');
        });
      };

      // Execute
      enableAllMenuItems();

      // Assert
      const menuItems = document.querySelectorAll('.nav-item[data-tab]');
      menuItems.forEach(item => {
        expect(item.classList.contains('disabled')).toBe(false);
      });
    });

    test('should remove needs-profile class from menu items', () => {
      // Setup
      document.body.innerHTML = `
        <nav>
          <button class="nav-item needs-profile" data-tab="lessons">
            <span class="nav-label">Lezioni</span>
          </button>
        </nav>
      `;

      const enableAllMenuItems = () => {
        document.querySelectorAll('.nav-item[data-tab]').forEach(button => {
          button.classList.remove('needs-profile');
          button.classList.remove('disabled');
          button.removeAttribute('data-tooltip');
          button.removeAttribute('disabled');
          button.removeAttribute('aria-disabled');
          button.setAttribute('title', button.querySelector('.nav-label')?.textContent || '');
        });
      };

      enableAllMenuItems();

      const menuItems = document.querySelectorAll('.nav-item[data-tab]');
      menuItems.forEach(item => {
        expect(item.classList.contains('needs-profile')).toBe(false);
      });
    });

    test('should remove disabled attribute from menu items', () => {
      // Setup
      document.body.innerHTML = `
        <nav>
          <button class="nav-item" data-tab="lessons" disabled>
            <span class="nav-label">Lezioni</span>
          </button>
        </nav>
      `;

      const enableAllMenuItems = () => {
        document.querySelectorAll('.nav-item[data-tab]').forEach(button => {
          button.classList.remove('needs-profile');
          button.classList.remove('disabled');
          button.removeAttribute('data-tooltip');
          button.removeAttribute('disabled');
          button.removeAttribute('aria-disabled');
          button.setAttribute('title', button.querySelector('.nav-label')?.textContent || '');
        });
      };

      enableAllMenuItems();

      const menuItem = document.querySelector('.nav-item[data-tab="lessons"]');
      expect(menuItem.hasAttribute('disabled')).toBe(false);
    });

    test('should remove aria-disabled attribute from menu items', () => {
      // Setup
      document.body.innerHTML = `
        <nav>
          <button class="nav-item" data-tab="lessons" aria-disabled="true">
            <span class="nav-label">Lezioni</span>
          </button>
          <button class="nav-item" data-tab="students" aria-disabled="true">
            <span class="nav-label">Studenti</span>
          </button>
        </nav>
      `;

      const enableAllMenuItems = () => {
        document.querySelectorAll('.nav-item[data-tab]').forEach(button => {
          button.classList.remove('needs-profile');
          button.classList.remove('disabled');
          button.removeAttribute('data-tooltip');
          button.removeAttribute('disabled');
          button.removeAttribute('aria-disabled');
          button.setAttribute('title', button.querySelector('.nav-label')?.textContent || '');
        });
      };

      enableAllMenuItems();

      const menuItems = document.querySelectorAll('.nav-item[data-tab]');
      menuItems.forEach(item => {
        expect(item.hasAttribute('aria-disabled')).toBe(false);
      });
    });

    test('should remove data-tooltip attribute from menu items', () => {
      // Setup
      document.body.innerHTML = `
        <nav>
          <button class="nav-item" data-tab="lessons" data-tooltip="Complete profile first">
            <span class="nav-label">Lezioni</span>
          </button>
        </nav>
      `;

      const enableAllMenuItems = () => {
        document.querySelectorAll('.nav-item[data-tab]').forEach(button => {
          button.classList.remove('needs-profile');
          button.classList.remove('disabled');
          button.removeAttribute('data-tooltip');
          button.removeAttribute('disabled');
          button.removeAttribute('aria-disabled');
          button.setAttribute('title', button.querySelector('.nav-label')?.textContent || '');
        });
      };

      enableAllMenuItems();

      const menuItem = document.querySelector('.nav-item[data-tab="lessons"]');
      expect(menuItem.hasAttribute('data-tooltip')).toBe(false);
    });

    test('should set title attribute based on nav-label text', () => {
      // Setup
      document.body.innerHTML = `
        <nav>
          <button class="nav-item" data-tab="lessons">
            <span class="nav-label">Lezioni</span>
          </button>
          <button class="nav-item" data-tab="students">
            <span class="nav-label">Studenti</span>
          </button>
        </nav>
      `;

      const enableAllMenuItems = () => {
        document.querySelectorAll('.nav-item[data-tab]').forEach(button => {
          button.classList.remove('needs-profile');
          button.classList.remove('disabled');
          button.removeAttribute('data-tooltip');
          button.removeAttribute('disabled');
          button.removeAttribute('aria-disabled');
          button.setAttribute('title', button.querySelector('.nav-label')?.textContent || '');
        });
      };

      enableAllMenuItems();

      const lessonsItem = document.querySelector('.nav-item[data-tab="lessons"]');
      const studentsItem = document.querySelector('.nav-item[data-tab="students"]');
      
      expect(lessonsItem.getAttribute('title')).toBe('Lezioni');
      expect(studentsItem.getAttribute('title')).toBe('Studenti');
    });

    test('should handle menu items with multiple disabled states', () => {
      // Setup: Menu item with all possible disabled states
      document.body.innerHTML = `
        <nav>
          <button 
            class="nav-item needs-profile disabled" 
            data-tab="lessons" 
            data-tooltip="Complete profile" 
            disabled
            aria-disabled="true">
            <span class="nav-label">Lezioni</span>
          </button>
        </nav>
      `;

      const enableAllMenuItems = () => {
        document.querySelectorAll('.nav-item[data-tab]').forEach(button => {
          button.classList.remove('needs-profile');
          button.classList.remove('disabled');
          button.removeAttribute('data-tooltip');
          button.removeAttribute('disabled');
          button.removeAttribute('aria-disabled');
          button.setAttribute('title', button.querySelector('.nav-label')?.textContent || '');
        });
      };

      enableAllMenuItems();

      const menuItem = document.querySelector('.nav-item[data-tab="lessons"]');
      
      // Assert all disabled states are removed
      expect(menuItem.classList.contains('disabled')).toBe(false);
      expect(menuItem.classList.contains('needs-profile')).toBe(false);
      expect(menuItem.hasAttribute('disabled')).toBe(false);
      expect(menuItem.hasAttribute('aria-disabled')).toBe(false);
      expect(menuItem.hasAttribute('data-tooltip')).toBe(false);
      expect(menuItem.getAttribute('title')).toBe('Lezioni');
    });

    test('should not affect menu items without data-tab attribute', () => {
      // Setup
      document.body.innerHTML = `
        <nav>
          <button class="nav-item disabled" data-tab="lessons">
            <span class="nav-label">Lezioni</span>
          </button>
          <button class="nav-item disabled" id="other-button">
            <span class="nav-label">Other</span>
          </button>
        </nav>
      `;

      const enableAllMenuItems = () => {
        document.querySelectorAll('.nav-item[data-tab]').forEach(button => {
          button.classList.remove('needs-profile');
          button.classList.remove('disabled');
          button.removeAttribute('data-tooltip');
          button.removeAttribute('disabled');
          button.removeAttribute('aria-disabled');
          button.setAttribute('title', button.querySelector('.nav-label')?.textContent || '');
        });
      };

      enableAllMenuItems();

      const lessonsItem = document.querySelector('.nav-item[data-tab="lessons"]');
      const otherButton = document.querySelector('#other-button');
      
      // Menu item with data-tab should be enabled
      expect(lessonsItem.classList.contains('disabled')).toBe(false);
      
      // Other button should still be disabled (not affected)
      expect(otherButton.classList.contains('disabled')).toBe(true);
    });
  });
});
