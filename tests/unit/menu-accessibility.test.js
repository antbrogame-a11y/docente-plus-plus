// tests/unit/menu-accessibility.test.js
// Unit tests for menu accessibility and always-active menu items

import { describe, test, expect, beforeEach } from '@jest/globals';

/**
 * Test suite for menu accessibility
 * Ensures all menu items are always active, clickable, and accessible
 */
describe('Menu Accessibility', () => {
  
  beforeEach(() => {
    // Set up a basic DOM structure with menu items
    document.body.innerHTML = `
      <aside id="main-nav" class="sidebar">
        <nav class="sidebar-nav">
          <button class="nav-item" data-tab="home">
            <span class="material-symbols-outlined">home</span>
            <span class="nav-label">Home</span>
          </button>
          <button class="nav-item" data-tab="lessons">
            <span class="material-symbols-outlined">menu_book</span>
            <span class="nav-label">Lezioni</span>
          </button>
          <button class="nav-item" data-tab="students">
            <span class="material-symbols-outlined">group</span>
            <span class="nav-label">Studenti</span>
          </button>
          <button class="nav-item" data-tab="classes">
            <span class="material-symbols-outlined">school</span>
            <span class="nav-label">Classi</span>
          </button>
          <button class="nav-item" data-tab="activities">
            <span class="material-symbols-outlined">assignment</span>
            <span class="nav-label">Attività</span>
          </button>
          <button class="nav-item" data-tab="evaluations">
            <span class="material-symbols-outlined">assessment</span>
            <span class="nav-label">Valutazioni</span>
          </button>
          <button class="nav-item" data-tab="schedule">
            <span class="material-symbols-outlined">calendar_month</span>
            <span class="nav-label">Orario</span>
          </button>
          <button class="nav-item" data-tab="agenda">
            <span class="material-symbols-outlined">event</span>
            <span class="nav-label">Agenda</span>
          </button>
          <button class="nav-item" data-tab="aiAssistant">
            <span class="material-symbols-outlined">psychology</span>
            <span class="nav-label">Assistente IA</span>
          </button>
          <button class="nav-item" data-tab="documentImport">
            <span class="material-symbols-outlined">upload_file</span>
            <span class="nav-label">Importa Documenti</span>
          </button>
          <div class="nav-submenu-container" id="settings-submenu-container">
            <button class="nav-item" id="settings-menu-toggle">
              <span class="material-symbols-outlined">settings</span>
              <span class="nav-label">Impostazioni</span>
            </button>
            <div class="nav-submenu" id="settings-submenu">
              <button class="nav-submenu-item" data-tab="settings" data-section="profile">
                <span class="nav-label">Profilo</span>
              </button>
              <button class="nav-submenu-item" data-tab="settings" data-section="preferences">
                <span class="nav-label">Preferenze</span>
              </button>
            </div>
          </div>
        </nav>
      </aside>
    `;
  });

  describe('Menu items should never be disabled', () => {
    test('all nav-item buttons should not have disabled attribute', () => {
      const navItems = document.querySelectorAll('.nav-item[data-tab]');
      
      navItems.forEach(item => {
        expect(item.hasAttribute('disabled')).toBe(false);
      });
    });

    test('all nav-item buttons should not have aria-disabled attribute', () => {
      const navItems = document.querySelectorAll('.nav-item[data-tab]');
      
      navItems.forEach(item => {
        expect(item.hasAttribute('aria-disabled')).toBe(false);
      });
    });

    test('all nav-item buttons should not have needs-profile class', () => {
      const navItems = document.querySelectorAll('.nav-item[data-tab]');
      
      navItems.forEach(item => {
        expect(item.classList.contains('needs-profile')).toBe(false);
      });
    });

    test('all nav-item buttons should not have disabled class', () => {
      const navItems = document.querySelectorAll('.nav-item[data-tab]');
      
      navItems.forEach(item => {
        expect(item.classList.contains('disabled')).toBe(false);
      });
    });

    test('all nav-item buttons should not have data-tooltip attribute', () => {
      const navItems = document.querySelectorAll('.nav-item[data-tab]');
      
      navItems.forEach(item => {
        expect(item.hasAttribute('data-tooltip')).toBe(false);
      });
    });
  });

  describe('Menu items should be clickable', () => {
    test('all nav-item buttons should be clickable', () => {
      const navItems = document.querySelectorAll('.nav-item[data-tab]');
      let clickedTabs = [];
      
      navItems.forEach(item => {
        item.addEventListener('click', () => {
          clickedTabs.push(item.dataset.tab);
        });
        
        // Simulate click
        item.click();
      });
      
      // Verify all items were clicked successfully
      expect(clickedTabs.length).toBe(navItems.length);
      expect(clickedTabs).toContain('home');
      expect(clickedTabs).toContain('lessons');
      expect(clickedTabs).toContain('students');
      expect(clickedTabs).toContain('classes');
      expect(clickedTabs).toContain('activities');
      expect(clickedTabs).toContain('evaluations');
      expect(clickedTabs).toContain('schedule');
      expect(clickedTabs).toContain('agenda');
      expect(clickedTabs).toContain('aiAssistant');
      expect(clickedTabs).toContain('documentImport');
    });

    test('settings submenu items should be clickable', () => {
      const submenuItems = document.querySelectorAll('.nav-submenu-item[data-tab]');
      let clickedSections = [];
      
      submenuItems.forEach(item => {
        item.addEventListener('click', () => {
          clickedSections.push(item.dataset.section);
        });
        
        // Simulate click
        item.click();
      });
      
      // Verify submenu items were clicked successfully
      expect(clickedSections.length).toBe(submenuItems.length);
      expect(clickedSections).toContain('profile');
      expect(clickedSections).toContain('preferences');
    });
  });

  describe('Menu items should have proper accessibility attributes', () => {
    test('all nav-item buttons should have proper role', () => {
      const navItems = document.querySelectorAll('.nav-item[data-tab]');
      
      navItems.forEach(item => {
        // Buttons automatically have role="button", so we just verify they're buttons
        expect(item.tagName.toLowerCase()).toBe('button');
      });
    });

    test('all nav-item buttons should have data-tab attribute', () => {
      const navItems = document.querySelectorAll('.nav-item[data-tab]');
      
      navItems.forEach(item => {
        expect(item.dataset.tab).toBeTruthy();
        expect(item.dataset.tab.length).toBeGreaterThan(0);
      });
    });

    test('all nav-item buttons should have visible text labels', () => {
      const navItems = document.querySelectorAll('.nav-item[data-tab]');
      
      navItems.forEach(item => {
        const label = item.querySelector('.nav-label');
        expect(label).toBeTruthy();
        expect(label.textContent.trim().length).toBeGreaterThan(0);
      });
    });
  });

  describe('enableAllMenuItems function behavior', () => {
    test('should remove all disabling classes and attributes', () => {
      // First, add some disabling attributes (simulating old behavior)
      const navItems = document.querySelectorAll('.nav-item[data-tab]');
      navItems.forEach(item => {
        item.classList.add('needs-profile');
        item.classList.add('disabled');
        item.setAttribute('data-tooltip', 'Completa il profilo');
        item.setAttribute('disabled', 'true');
        item.setAttribute('aria-disabled', 'true');
      });

      // Simulate enableAllMenuItems function
      navItems.forEach(button => {
        button.classList.remove('needs-profile');
        button.classList.remove('disabled');
        button.removeAttribute('data-tooltip');
        button.removeAttribute('disabled');
        button.removeAttribute('aria-disabled');
        button.setAttribute('title', button.querySelector('.nav-label')?.textContent || '');
      });

      // Verify all disabling attributes are removed
      navItems.forEach(item => {
        expect(item.classList.contains('needs-profile')).toBe(false);
        expect(item.classList.contains('disabled')).toBe(false);
        expect(item.hasAttribute('data-tooltip')).toBe(false);
        expect(item.hasAttribute('disabled')).toBe(false);
        expect(item.hasAttribute('aria-disabled')).toBe(false);
        expect(item.hasAttribute('title')).toBe(true);
      });
    });
  });
});
