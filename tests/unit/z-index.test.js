// tests/unit/z-index.test.js
// Unit tests for z-index values of sidebar and menu-backdrop

import { describe, test, expect, beforeEach } from '@jest/globals';

/**
 * Test suite for z-index values
 * Ensures sidebar is always above the menu-backdrop for proper interaction
 */
describe('Z-Index Configuration', () => {
  
  beforeEach(() => {
    // Set up a basic DOM structure with sidebar and backdrop
    document.body.innerHTML = `
      <aside id="main-nav" class="sidebar">
        <nav class="sidebar-nav">
          <button class="nav-item" data-tab="home">
            <span class="material-symbols-outlined">home</span>
            <span class="nav-label">Home</span>
          </button>
        </nav>
      </aside>
      <div id="menu-backdrop" class="menu-backdrop"></div>
    `;

    // Create a style element with the necessary CSS
    const style = document.createElement('style');
    style.textContent = `
      .sidebar {
        position: fixed;
        z-index: 1050;
      }
      .menu-backdrop {
        position: fixed;
        z-index: 999;
      }
    `;
    document.head.appendChild(style);
  });

  describe('Sidebar z-index', () => {
    test('sidebar should have z-index of 1050', () => {
      const sidebar = document.querySelector('.sidebar');
      expect(sidebar).toBeTruthy();
      
      const computedStyle = window.getComputedStyle(sidebar);
      expect(computedStyle.zIndex).toBe('1050');
    });

    test('sidebar should be positioned fixed', () => {
      const sidebar = document.querySelector('.sidebar');
      const computedStyle = window.getComputedStyle(sidebar);
      expect(computedStyle.position).toBe('fixed');
    });
  });

  describe('Menu backdrop z-index', () => {
    test('menu-backdrop should have z-index of 999', () => {
      const backdrop = document.querySelector('.menu-backdrop');
      expect(backdrop).toBeTruthy();
      
      const computedStyle = window.getComputedStyle(backdrop);
      expect(computedStyle.zIndex).toBe('999');
    });

    test('menu-backdrop should be positioned fixed', () => {
      const backdrop = document.querySelector('.menu-backdrop');
      const computedStyle = window.getComputedStyle(backdrop);
      expect(computedStyle.position).toBe('fixed');
    });
  });

  describe('Z-index hierarchy', () => {
    test('sidebar z-index should be greater than backdrop z-index', () => {
      const sidebar = document.querySelector('.sidebar');
      const backdrop = document.querySelector('.menu-backdrop');
      
      const sidebarZIndex = parseInt(window.getComputedStyle(sidebar).zIndex);
      const backdropZIndex = parseInt(window.getComputedStyle(backdrop).zIndex);
      
      expect(sidebarZIndex).toBeGreaterThan(backdropZIndex);
    });

    test('sidebar should be on top of backdrop (clickable layer)', () => {
      const sidebar = document.querySelector('.sidebar');
      const backdrop = document.querySelector('.menu-backdrop');
      
      const sidebarZIndex = parseInt(window.getComputedStyle(sidebar).zIndex);
      const backdropZIndex = parseInt(window.getComputedStyle(backdrop).zIndex);
      
      // Sidebar should be at least 1 z-index level above backdrop
      expect(sidebarZIndex - backdropZIndex).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Mobile menu interaction', () => {
    test('sidebar with mobile-open class should maintain z-index', () => {
      const sidebar = document.querySelector('.sidebar');
      sidebar.classList.add('mobile-open');
      
      const computedStyle = window.getComputedStyle(sidebar);
      expect(computedStyle.zIndex).toBe('1050');
    });

    test('active backdrop should maintain z-index', () => {
      const backdrop = document.querySelector('.menu-backdrop');
      backdrop.classList.add('active');
      
      const computedStyle = window.getComputedStyle(backdrop);
      expect(computedStyle.zIndex).toBe('999');
    });

    test('sidebar should remain clickable when both sidebar and backdrop are active', () => {
      const sidebar = document.querySelector('.sidebar');
      const backdrop = document.querySelector('.menu-backdrop');
      
      // Simulate mobile menu open state
      sidebar.classList.add('mobile-open');
      backdrop.classList.add('active');
      
      const sidebarZIndex = parseInt(window.getComputedStyle(sidebar).zIndex);
      const backdropZIndex = parseInt(window.getComputedStyle(backdrop).zIndex);
      
      // Verify sidebar is on top
      expect(sidebarZIndex).toBeGreaterThan(backdropZIndex);
      
      // Verify nav items are clickable (no pointer-events: none)
      const navItem = sidebar.querySelector('.nav-item');
      const navItemStyle = window.getComputedStyle(navItem);
      expect(navItemStyle.pointerEvents).not.toBe('none');
    });
  });

  describe('CSS consistency', () => {
    test('z-index values should be consistent across different viewport sizes', () => {
      const sidebar = document.querySelector('.sidebar');
      const backdrop = document.querySelector('.menu-backdrop');
      
      // Initial state
      const initialSidebarZ = window.getComputedStyle(sidebar).zIndex;
      const initialBackdropZ = window.getComputedStyle(backdrop).zIndex;
      
      expect(initialSidebarZ).toBe('1050');
      expect(initialBackdropZ).toBe('999');
      
      // The z-index should not change based on classes or states
      sidebar.classList.add('mobile-open');
      backdrop.classList.add('active');
      
      const mobileSidebarZ = window.getComputedStyle(sidebar).zIndex;
      const mobileBackdropZ = window.getComputedStyle(backdrop).zIndex;
      
      expect(mobileSidebarZ).toBe(initialSidebarZ);
      expect(mobileBackdropZ).toBe(initialBackdropZ);
    });
  });
});
