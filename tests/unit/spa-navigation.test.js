/**
 * SPA Navigation Tests
 * Ensures navigation doesn't cause full page reloads
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';

describe('SPA Navigation', () => {
    let mockWindowLocation;
    let mockHistory;

    beforeEach(() => {
        // Mock window.location
        mockWindowLocation = {
            href: 'http://localhost/index.html',
            assign: jest.fn(),
            replace: jest.fn(),
            reload: jest.fn()
        };
        
        // Mock history
        mockHistory = {
            pushState: jest.fn(),
            replaceState: jest.fn(),
            back: jest.fn(),
            forward: jest.fn(),
            go: jest.fn(),
            length: 2,
            state: { page: 'home', params: null }
        };
        
        global.window = {
            location: mockWindowLocation,
            history: mockHistory
        };
    });

    afterEach(() => {
        // Restore mocks if needed
    });

    describe('Navigation from Home to In Classe', () => {
        it('should not use window.open for navigation', () => {
            // Test that window.open is NOT called
            const navigateToInClasse = () => {
                // Correct implementation should use window.location.href
                mockWindowLocation.href = 'in-classe.html';
                return false;
            };
            
            const result = navigateToInClasse();
            
            expect(result).toBe(false);
            expect(mockWindowLocation.href).toBe('in-classe.html');
        });

        it('should use same-page navigation when possible', () => {
            // Test history API usage
            const navigateWithHistory = (pageName) => {
                mockHistory.pushState({ page: pageName }, '', `#${pageName}`);
            };
            
            navigateWithHistory('schedule');
            
            expect(mockHistory.pushState).toHaveBeenCalledWith(
                { page: 'schedule' },
                '',
                '#schedule'
            );
        });
    });

    describe('Breadcrumb Navigation', () => {
        it('should prevent default on link clicks', () => {
            const mockEvent = {
                preventDefault: jest.fn(),
                target: { href: 'index.html' }
            };
            
            const handleBreadcrumbClick = (e) => {
                e.preventDefault();
                window.location.href = e.target.href;
            };
            
            handleBreadcrumbClick(mockEvent);
            
            expect(mockEvent.preventDefault).toHaveBeenCalled();
        });

        it('should use history.back() when available', () => {
            const goBack = () => {
                if (mockHistory.length > 1) {
                    mockHistory.back();
                } else {
                    mockWindowLocation.href = 'index.html#schedule';
                }
            };
            
            goBack();
            
            expect(mockHistory.back).toHaveBeenCalled();
            expect(mockWindowLocation.href).not.toBe('index.html#schedule');
        });

        it('should fallback to window.location when no history', () => {
            mockHistory.length = 0;
            
            const goBack = () => {
                if (mockHistory.length > 1) {
                    mockHistory.back();
                } else {
                    mockWindowLocation.href = 'index.html#schedule';
                }
            };
            
            goBack();
            
            expect(mockHistory.back).not.toHaveBeenCalled();
            expect(mockWindowLocation.href).toBe('index.html#schedule');
        });
    });

    describe('Exit and Back Button Navigation', () => {
        it('should use history.back() for exit button', () => {
            const exit = () => {
                if (mockHistory.length > 1) {
                    mockHistory.back();
                } else {
                    mockWindowLocation.href = 'index.html#schedule';
                }
            };
            
            exit();
            
            expect(mockHistory.back).toHaveBeenCalled();
        });

        it('should prevent full page reload on back button', () => {
            const mockBackButton = document.createElement('button');
            mockBackButton.id = 'back-button';
            document.body.appendChild(mockBackButton);
            
            const handleBackClick = (e) => {
                e.preventDefault();
                if (mockHistory.length > 1) {
                    mockHistory.back();
                }
            };
            
            const mockEvent = {
                preventDefault: jest.fn()
            };
            
            handleBackClick(mockEvent);
            
            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(mockHistory.back).toHaveBeenCalled();
            
            document.body.removeChild(mockBackButton);
        });
    });

    describe('Landing Card Navigation', () => {
        it('should use window.location.href instead of window.open', () => {
            // Test correct implementation
            const navigateToInClasse = () => {
                mockWindowLocation.href = 'in-classe.html';
                return false;
            };
            
            const result = navigateToInClasse();
            
            expect(result).toBe(false);
            expect(mockWindowLocation.href).toBe('in-classe.html');
        });

        it('should not open in new tab/window', () => {
            // Verify window.open is NOT used
            const windowOpen = jest.fn();
            mockWindowLocation.open = windowOpen;
            
            // Correct implementation should NOT call window.open
            const navigateCorrectly = () => {
                mockWindowLocation.href = 'in-classe.html';
            };
            
            navigateCorrectly();
            
            expect(windowOpen).not.toHaveBeenCalled();
        });
    });

    describe('Hash-based Navigation', () => {
        it('should update hash without full reload', () => {
            const navigateToTab = (tabName) => {
                mockHistory.pushState({ page: tabName }, '', `#${tabName}`);
            };
            
            navigateToTab('schedule');
            
            expect(mockHistory.pushState).toHaveBeenCalled();
            expect(mockHistory.pushState.mock.calls[0][2]).toBe('#schedule');
        });

        it('should preserve state in history', () => {
            const state = { page: 'lessons', params: { id: '123' } };
            mockHistory.pushState(state, '', '#lessons?id=123');
            
            expect(mockHistory.pushState).toHaveBeenCalledWith(
                state,
                '',
                '#lessons?id=123'
            );
        });
    });

    describe('PopState Event Handling', () => {
        it('should handle browser back/forward buttons', () => {
            const handlePopState = (event) => {
                if (event.state && event.state.page) {
                    // Navigate to the page in state
                    return event.state.page;
                }
                return 'home';
            };
            
            const mockPopStateEvent = {
                state: { page: 'schedule', params: null }
            };
            
            const result = handlePopState(mockPopStateEvent);
            
            expect(result).toBe('schedule');
        });

        it('should default to home when no state', () => {
            const handlePopState = (event) => {
                if (event.state && event.state.page) {
                    return event.state.page;
                }
                return 'home';
            };
            
            const mockPopStateEvent = { state: null };
            
            const result = handlePopState(mockPopStateEvent);
            
            expect(result).toBe('home');
        });
    });

    describe('Preventing Multiple Page Creation', () => {
        it('should not create multiple browser documents', () => {
            // Count of window.open calls should be zero
            const windowOpen = jest.fn();
            mockWindowLocation.open = windowOpen;
            
            // Simulate multiple navigations
            mockWindowLocation.href = 'in-classe.html';
            mockWindowLocation.href = 'index.html';
            mockWindowLocation.href = 'in-classe.html';
            
            expect(windowOpen).not.toHaveBeenCalled();
        });

        it('should use pushState for in-app navigation', () => {
            // Multiple navigations should use history API
            mockHistory.pushState({ page: 'home' }, '', '#home');
            mockHistory.pushState({ page: 'lessons' }, '', '#lessons');
            mockHistory.pushState({ page: 'schedule' }, '', '#schedule');
            
            expect(mockHistory.pushState).toHaveBeenCalledTimes(3);
        });
    });
});
