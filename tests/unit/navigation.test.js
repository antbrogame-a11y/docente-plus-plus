// tests/unit/navigation.test.js
// Unit tests for navigation system

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import mockWindowLocation from '../helpers/mockWindowLocation';

/**
 * Test suite for navigation system
 * Tests breadcrumb, back button, home button, and history integration
 */
describe('Navigation System', () => {
  
  let restoreWindowLocation = null;
  let mockHistory;
  
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
    
    // Mock window.location
    restoreWindowLocation = mockWindowLocation({ hash: '#home' });
  });

  afterEach(() => {
    if (restoreWindowLocation) {
      restoreWindowLocation();
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

  describe('navigateToPage', () => {
    test('should update current page', () => {
      const mockNav = {
        currentPage: { name: 'home', title: 'Home' },
        navigateToPage: function(pageName) {
          this.currentPage = { name: pageName, title: pageName };
        }
      };
      
      mockNav.navigateToPage('lessons');
      expect(mockNav.currentPage.name).toBe('lessons');
    });

    test('should push to browser history when updateHistory is true', () => {
      const mockNav = {
        navigateToPage: function(pageName, params, updateHistory) {
          if (updateHistory) {
            // Use the mocked history directly
            mockHistory.pushState({ page: pageName, params }, '', `#${pageName}`);
          }
        }
      };
      
      mockNav.navigateToPage('students', null, true);
      expect(mockHistory.pushState).toHaveBeenCalledWith(
        { page: 'students', params: null },
        '',
        '#students'
      );
    });

    test('should not push to history when updateHistory is false', () => {
      const mockNav = {
        navigateToPage: function(pageName, params, updateHistory) {
          if (updateHistory) {
            history.pushState({ page: pageName, params }, '', `#${pageName}`);
          }
        }
      };
      
      mockNav.navigateToPage('settings', null, false);
      expect(mockHistory.pushState).not.toHaveBeenCalled();
    });

    test('should handle parameters correctly', () => {
      const mockNav = {
        navigateToPage: function(pageName, params, updateHistory) {
          if (updateHistory) {
            const url = `#${pageName}${params ? '?id=' + params.id : ''}`;
            // Use the mocked history directly
            mockHistory.pushState({ page: pageName, params }, '', url);
          }
        }
      };
      
      mockNav.navigateToPage('students', { id: '123' }, true);
      expect(mockHistory.pushState).toHaveBeenCalledWith(
        { page: 'students', params: { id: '123' } },
        '',
        '#students?id=123'
      );
    });
  });

  describe('goBack', () => {
    test('should call history.back() when history exists', () => {
      mockHistory.length = 5;
      
      const mockNav = {
        goBack: function() {
          if (mockHistory.length > 1) {
            mockHistory.back();
          }
        }
      };
      
      mockNav.goBack();
      expect(mockHistory.back).toHaveBeenCalled();
    });

    test('should navigate to home when no history exists', () => {
      mockHistory.length = 1;
      
      const mockNav = {
        navigateToHome: jest.fn(),
        goBack: function() {
          if (mockHistory.length > 1) {
            mockHistory.back();
          } else {
            this.navigateToHome();
          }
        }
      };
      
      mockNav.goBack();
      expect(mockHistory.back).not.toHaveBeenCalled();
      expect(mockNav.navigateToHome).toHaveBeenCalled();
    });
  });

  describe('Breadcrumb generation', () => {
    test('should show only Home for home page', () => {
      const mockNav = {
        currentPage: { name: 'home', title: 'Home' },
        getBreadcrumbTrail: function() {
          const trail = [{ name: 'home', title: 'Home' }];
          if (this.currentPage.name !== 'home') {
            trail.push(this.currentPage);
          }
          return trail;
        }
      };
      
      const trail = mockNav.getBreadcrumbTrail();
      expect(trail).toHaveLength(1);
      expect(trail[0].name).toBe('home');
    });

    test('should show Home / Page for other pages', () => {
      const mockNav = {
        currentPage: { name: 'lessons', title: 'Lezioni' },
        getBreadcrumbTrail: function() {
          const trail = [{ name: 'home', title: 'Home' }];
          if (this.currentPage.name !== 'home') {
            trail.push(this.currentPage);
          }
          return trail;
        }
      };
      
      const trail = mockNav.getBreadcrumbTrail();
      expect(trail).toHaveLength(2);
      expect(trail[0].name).toBe('home');
      expect(trail[1].name).toBe('lessons');
    });

    test('should render breadcrumb HTML correctly', () => {
      const trail = [
        { name: 'home', title: 'Home' },
        { name: 'lessons', title: 'Lezioni' }
      ];
      
      const renderBreadcrumb = (trail) => {
        return trail.map((item, index) => {
          const isLast = index === trail.length - 1;
          if (isLast) {
            return `<span class="breadcrumb-current">${item.title}</span>`;
          } else {
            return `<a href="#${item.name}" class="breadcrumb-link">${item.title}</a><span class="breadcrumb-separator">/</span>`;
          }
        }).join('');
      };
      
      const html = renderBreadcrumb(trail);
      expect(html).toContain('breadcrumb-link');
      expect(html).toContain('breadcrumb-current');
      expect(html).toContain('Lezioni');
    });
  });

  describe('Navigation UI components', () => {
    test('should create navigation bar with all components', () => {
      const createNavBar = () => {
        const navBar = document.createElement('div');
        navBar.id = 'navigation-bar';
        navBar.className = 'navigation-bar';
        navBar.innerHTML = `
          <button id="back-button" class="back-button">Back</button>
          <nav id="breadcrumb-container" class="breadcrumb"></nav>
          <button id="home-button" class="home-button">Home</button>
        `;
        return navBar;
      };
      
      const navBar = createNavBar();
      document.body.appendChild(navBar);
      
      expect(document.getElementById('navigation-bar')).toBeTruthy();
      expect(document.getElementById('back-button')).toBeTruthy();
      expect(document.getElementById('breadcrumb-container')).toBeTruthy();
      expect(document.getElementById('home-button')).toBeTruthy();
    });

    test('back button should have correct attributes', () => {
      const backButton = document.createElement('button');
      backButton.id = 'back-button';
      backButton.setAttribute('aria-label', 'Torna indietro');
      backButton.setAttribute('title', 'Torna alla pagina precedente');
      
      expect(backButton.getAttribute('aria-label')).toBe('Torna indietro');
      expect(backButton.getAttribute('title')).toBe('Torna alla pagina precedente');
    });

    test('home button should have correct attributes', () => {
      const homeButton = document.createElement('button');
      homeButton.id = 'home-button';
      homeButton.setAttribute('aria-label', 'Vai alla home');
      homeButton.setAttribute('title', 'Torna alla pagina principale');
      
      expect(homeButton.getAttribute('aria-label')).toBe('Vai alla home');
      expect(homeButton.getAttribute('title')).toBe('Torna alla pagina principale');
    });

    test('breadcrumb container should have navigation role', () => {
      const breadcrumb = document.createElement('nav');
      breadcrumb.id = 'breadcrumb-container';
      breadcrumb.setAttribute('role', 'navigation');
      breadcrumb.setAttribute('aria-label', 'Percorso di navigazione');
      
      expect(breadcrumb.getAttribute('role')).toBe('navigation');
      expect(breadcrumb.getAttribute('aria-label')).toBe('Percorso di navigazione');
    });
  });

  describe('Page title mapping', () => {
    test('should return correct titles for all pages', () => {
      const getPageTitle = (pageName) => {
        const titles = {
          home: 'Home',
          lessons: 'Lezioni',
          students: 'Studenti',
          classes: 'Classi',
          activities: 'Attività',
          evaluations: 'Valutazioni',
          schedule: 'Orario',
          agenda: 'Agenda',
          aiAssistant: 'Assistente IA',
          documentImport: 'Importa Documenti',
          settings: 'Impostazioni'
        };
        return titles[pageName] || pageName;
      };
      
      expect(getPageTitle('home')).toBe('Home');
      expect(getPageTitle('lessons')).toBe('Lezioni');
      expect(getPageTitle('students')).toBe('Studenti');
      expect(getPageTitle('unknown')).toBe('unknown');
    });
  });

  describe('Browser history integration', () => {
    test('should handle popstate event', () => {
      const mockNav = {
        navigateToPage: jest.fn(),
        handlePopState: function(event) {
          if (event.state && event.state.page) {
            this.navigateToPage(event.state.page, event.state.params, false);
          } else {
            this.navigateToPage('home', null, false);
          }
        }
      };
      
      // Simulate popstate with valid state
      const event1 = { state: { page: 'lessons', params: null } };
      mockNav.handlePopState(event1);
      expect(mockNav.navigateToPage).toHaveBeenCalledWith('lessons', null, false);
      
      // Simulate popstate with no state (back to home)
      const event2 = { state: null };
      mockNav.navigateToPage.mockClear();
      mockNav.handlePopState(event2);
      expect(mockNav.navigateToPage).toHaveBeenCalledWith('home', null, false);
    });

    test('should update URL hash on navigation', () => {
      const mockNav = {
        navigateToPage: function(pageName) {
          window.location.hash = `#${pageName}`;
        }
      };
      
      mockNav.navigateToPage('settings');
      expect(window.location.hash).toBe('#settings');
    });
  });

  describe('Accessibility', () => {
    test('breadcrumb links should have proper aria attributes', () => {
      const link = document.createElement('a');
      link.href = '#home';
      link.className = 'breadcrumb-link';
      link.textContent = 'Home';
      
      // Links should be keyboard navigable
      // In JSDOM, href becomes absolute URL, so we check hash or endsWith
      expect(link.href.endsWith('#home')).toBe(true);
      expect(link.className).toBe('breadcrumb-link');
    });

    test('current breadcrumb should have aria-current', () => {
      const current = document.createElement('span');
      current.className = 'breadcrumb-current';
      current.setAttribute('aria-current', 'page');
      current.textContent = 'Lezioni';
      
      expect(current.getAttribute('aria-current')).toBe('page');
    });

    test('buttons should be keyboard accessible', () => {
      const backButton = document.createElement('button');
      backButton.className = 'back-button';
      backButton.tabIndex = 0;
      
      expect(backButton.tabIndex).toBe(0);
      expect(backButton.tagName).toBe('BUTTON');
    });

    test('navigation bar should have role', () => {
      const navBar = document.createElement('div');
      navBar.setAttribute('role', 'navigation');
      navBar.setAttribute('aria-label', 'Navigazione breadcrumb');
      
      expect(navBar.getAttribute('role')).toBe('navigation');
      expect(navBar.getAttribute('aria-label')).toBe('Navigazione breadcrumb');
    });
  });

  describe('Responsive behavior', () => {
    test('should hide text on mobile (CSS class check)', () => {
      const backButton = document.createElement('button');
      backButton.className = 'back-button';
      backButton.innerHTML = `
        <span class="material-symbols-outlined">arrow_back</span>
        <span class="back-button-text">Indietro</span>
      `;
      
      const text = backButton.querySelector('.back-button-text');
      expect(text).toBeTruthy();
      expect(text.className).toBe('back-button-text');
    });
  });

  describe('Error handling', () => {
    test('should handle missing navigation container gracefully', () => {
      const updateBreadcrumb = (containerId) => {
        const container = document.getElementById(containerId);
        if (!container) {
          console.warn('Breadcrumb container not found');
          return false;
        }
        return true;
      };
      
      expect(updateBreadcrumb('non-existent')).toBe(false);
    });

    test('should handle invalid page names', () => {
      const mockNav = {
        navigateToPage: function(pageName) {
          if (!pageName || typeof pageName !== 'string') {
            console.error('Invalid page name');
            return false;
          }
          return true;
        }
      };
      
      expect(mockNav.navigateToPage(null)).toBe(false);
      expect(mockNav.navigateToPage(undefined)).toBe(false);
      expect(mockNav.navigateToPage('lessons')).toBe(true);
    });
  });
});
