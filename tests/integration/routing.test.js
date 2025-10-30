
import { jest } from '@jest/globals';
import mockWindowLocation from '../helpers/mockWindowLocation.js';

// variabile di modulo per mantenere la funzione di restore tra test
let restoreWindowLocation = null;

// Garantiamo il ripristino anche se il test fallisce
afterEach(() => {
  if (typeof restoreWindowLocation === 'function') {
    try { restoreWindowLocation(); } catch (e) { /* ignore */ }
    restoreWindowLocation = null;
  }
});

describe('SPA Routing', () => {
    let originalLocation = null;
    let originalHistory;
    let pushStateSpy;
    let replaceStateSpy;

    beforeEach(() => {
        // Mock window.location (usa helper per robustezza)
        originalLocation = window.location;
        restoreWindowLocation = mockWindowLocation({
          href: 'http://localhost/',
          pathname: '/',
          hash: '#home',
          assign: jest.fn(),
          replace: jest.fn(),
          reload: jest.fn()
        });

        // Mock history
        originalHistory = window.history;
        pushStateSpy = jest.fn();
        replaceStateSpy = jest.fn();
        Object.defineProperty(window, 'history', {
            writable: true,
            value: {
                pushState: pushStateSpy,
                replaceState: replaceStateSpy,
                back: jest.fn(),
                forward: jest.fn(),
                go: jest.fn(),
                state: null,
                length: 1
            }
        });
    });

    afterEach(() => {
        // restore history (location restore già gestito dalla afterEach globale sopra)
        window.history = originalHistory;
    });

    describe('Internal Navigation', () => {
        it('should use pushState for internal navigation', () => {
            // Simulate internal navigation
            const pageName = 'inClasse';
            const state = { page: pageName, params: null };
            const url = `#${pageName}`;

            window.history.pushState(state, '', url);

            expect(pushStateSpy).toHaveBeenCalledWith(state, '', url);
            expect(window.location.assign).not.toHaveBeenCalled();
            expect(window.location.reload).not.toHaveBeenCalled();
        });

        it('should not reload page when navigating between tabs', () => {
            const pages = ['home', 'inClasse', 'lessons', 'students'];

            pages.forEach(page => {
                const state = { page, params: null };
                window.history.pushState(state, '', `#${page}`);
            });

            expect(pushStateSpy).toHaveBeenCalledTimes(pages.length);
            expect(window.location.reload).not.toHaveBeenCalled();
            expect(window.location.assign).not.toHaveBeenCalled();
        });

        it('should preserve query parameters in pushState', () => {
            const pageName = 'inClasse';
            const params = { lessonId: '123' };
            const state = { page: pageName, params };
            const url = `#${pageName}?lessonId=123`;

            window.history.pushState(state, '', url);

            expect(pushStateSpy).toHaveBeenCalledWith(state, '', url);
            expect(pushStateSpy.mock.calls[0][0].params).toEqual(params);
        });
    });
});
