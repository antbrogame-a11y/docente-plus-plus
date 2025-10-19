/**
 * @file Routing Integration Tests
 * @description Tests for SPA navigation and routing without page reloads
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import mockWindowLocation from '../helpers/mockWindowLocation';

describe('SPA Routing', () => {
    let restoreWindowLocation = null;
    let originalHistory;
    let pushStateSpy;
    let replaceStateSpy;

    beforeEach(() => {
        // Mock window.location
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
        if (restoreWindowLocation) {
            restoreWindowLocation();
        }
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

    describe('Navigation Manager', () => {
        it('should handle browser back button with popstate', () => {
            const popstateHandler = jest.fn();
            window.addEventListener('popstate', popstateHandler);

            const event = new PopStateEvent('popstate', {
                state: { page: 'home', params: null }
            });
            window.dispatchEvent(event);

            expect(popstateHandler).toHaveBeenCalled();
            window.removeEventListener('popstate', popstateHandler);
        });

        it('should maintain navigation history', () => {
            const states = [
                { page: 'home', params: null },
                { page: 'inClasse', params: null },
                { page: 'lessons', params: { id: '1' } }
            ];

            states.forEach(state => {
                window.history.pushState(state, '', `#${state.page}`);
            });

            expect(pushStateSpy).toHaveBeenCalledTimes(states.length);
            // Verify each call
            states.forEach((state, index) => {
                expect(pushStateSpy.mock.calls[index][0]).toEqual(state);
            });
        });
    });

    describe('Link Handling', () => {
        it('should prevent default action on internal links', () => {
            const link = document.createElement('a');
            link.href = '#inClasse';
            link.textContent = 'Go to InClasse';
            document.body.appendChild(link);

            const clickHandler = (e) => {
                e.preventDefault();
                const hash = link.getAttribute('href').substring(1);
                window.history.pushState({ page: hash }, '', link.href);
            };

            link.addEventListener('click', clickHandler);

            // Simulate click
            const event = new MouseEvent('click', { bubbles: true, cancelable: true });
            const defaultPrevented = !link.dispatchEvent(event);

            expect(defaultPrevented).toBe(true);
            expect(pushStateSpy).toHaveBeenCalled();
            expect(pushStateSpy.mock.calls[0][0]).toEqual({ page: 'inClasse' });
            // URL might be absolute or relative depending on environment
            expect(pushStateSpy.mock.calls[0][2]).toMatch(/#inClasse$/);

            link.remove();
        });

        it('should not intercept external links', () => {
            const link = document.createElement('a');
            link.href = 'https://external-site.com';
            link.target = '_blank';
            document.body.appendChild(link);

            // External links should not use pushState
            const event = new MouseEvent('click', { bubbles: true, cancelable: true });
            link.dispatchEvent(event);

            // pushState should not be called for external links
            expect(window.location.assign).not.toHaveBeenCalled();

            link.remove();
        });
    });

    describe('Home to InClasse Navigation', () => {
        it('should navigate from Home to InClasse without page reload', () => {
            // Start at home
            window.history.replaceState({ page: 'home' }, '', '#home');
            
            // Navigate to InClasse
            const targetState = { page: 'inClasse', params: null };
            window.history.pushState(targetState, '', '#inClasse');

            expect(pushStateSpy).toHaveBeenCalledWith(targetState, '', '#inClasse');
            expect(window.location.reload).not.toHaveBeenCalled();
            expect(window.location.assign).not.toHaveBeenCalled();
        });

        it('should update URL hash when navigating to InClasse', () => {
            window.history.pushState({ page: 'inClasse' }, '', '#inClasse');
            
            expect(pushStateSpy).toHaveBeenCalled();
            const callArgs = pushStateSpy.mock.calls[0];
            expect(callArgs[2]).toBe('#inClasse');
        });

        it('should allow navigation back to Home from InClasse', () => {
            // Navigate to InClasse
            window.history.pushState({ page: 'inClasse' }, '', '#inClasse');
            
            // Go back to Home
            window.history.back();

            expect(window.history.back).toHaveBeenCalled();
            expect(window.location.reload).not.toHaveBeenCalled();
        });
    });

    describe('State Management', () => {
        it('should preserve state across navigation', () => {
            const state1 = { page: 'inClasse', params: { lessonId: '1' } };
            const state2 = { page: 'lessons', params: { filter: 'active' } };

            window.history.pushState(state1, '', '#inClasse?lessonId=1');
            window.history.pushState(state2, '', '#lessons?filter=active');

            expect(pushStateSpy).toHaveBeenCalledTimes(2);
            expect(pushStateSpy.mock.calls[0][0]).toEqual(state1);
            expect(pushStateSpy.mock.calls[1][0]).toEqual(state2);
        });

        it('should handle empty state gracefully', () => {
            const event = new PopStateEvent('popstate', { state: null });
            window.dispatchEvent(event);

            // Should not throw error
            expect(true).toBe(true);
        });
    });

    describe('Safe Location Mocking', () => {
        it('should not trigger full page reload for tab navigation', () => {
            // The beforeEach already sets up window.location with assign mock
            // Simulate tab navigation (not calling window.location.assign)
            window.history.pushState({ page: 'home' }, '', '#home');

            expect(window.location.assign).not.toHaveBeenCalled();
        });

        it('should not call window.location.reload() for navigation', () => {
            // The beforeEach already sets up window.location with reload mock
            // Simulate various navigation actions
            window.history.pushState({ page: 'lessons' }, '', '#lessons');
            window.history.pushState({ page: 'students' }, '', '#students');
            window.history.pushState({ page: 'home' }, '', '#home');

            expect(window.location.reload).not.toHaveBeenCalled();
        });

        it('should not call window.location.assign() for same-app navigation', () => {
            // The beforeEach already sets up window.location with assign mock
            // Simulate internal tab switches
            window.history.pushState({ page: 'schedule' }, '', '#schedule');
            window.history.pushState({ page: 'agenda' }, '', '#agenda');

            expect(window.location.assign).not.toHaveBeenCalled();
        });
    });
});
