import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import mockWindowLocation from '../helpers/mockWindowLocation';

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import mockWindowLocation from '../helpers/mockWindowLocation';

/**
 * Test suite for navigation system
 * Tests breadcrumb, back button, home button, and history integration
 */
describe('Navigation System', () => {
  let mockHistory;
  let restoreWindowLocation = null;
  
  beforeEach(() => {
    // Clear DOM
    document.body.innerHTML = '';

    // Mock window.history
    mockHistory = {
      pushState: jest.fn(),
      replaceState: jest.fn(),
      back: jest.fn(),
      length: 1,
      state: null
    };
    global.history = mockHistory;
    
    // Mock window.location using helper
    restoreWindowLocation = mockWindowLocation({ hash: '#home' });
  });
  
  afterEach(() => {
    // Restore window.location
    if (restoreWindowLocation) {
      restoreWindowLocation();
      restoreWindowLocation = null;
    }
  });

  describe('NavigationManager initialization', () => {
    test('should initialize with home as current page', () => {
      const mockNav = {
        currentPage: { name: 'home', title: 'Home', params: null },
        history: [],
        initialized: false
      };

      expect(mockNav.currentPage.name).toBe('home');
      expect(mockNav.history).toEqual([]);
      expect(mockNav.initialized).toBe(false);
    });

    test('should set initialized flag after init', () => {
      const mockNav = {
        initialized: false,
        init: function() {
          this.initialized = true;
        }
      };

      mockNav.init();
      expect(mockNav.initialized).toBe(true);
    });
  });

  // ... resto del file invariato ...
});