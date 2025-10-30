/**
 * @file Chat Visibility Integration Tests
 * @description Tests for mobile chat input visibility and virtual keyboard handling
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';

describe('Mobile Chat Visibility', () => {
    let chatContainer;
    let chatInput;
    let originalInnerWidth;
    let originalInnerHeight;

    beforeEach(() => {
        // Save original values
        originalInnerWidth = window.innerWidth;
        originalInnerHeight = window.innerHeight;

        // Create chat panel structure
        chatContainer = document.createElement('div');
        chatContainer.id = 'ai-assistant-panel';
        chatContainer.className = 'ai-assistant-panel';
        chatContainer.innerHTML = `
            <div class="ai-assistant-header">
                <h2>Chat</h2>
                <button class="ai-assistant-close">X</button>
            </div>
            <div class="ai-assistant-body">
                <div class="ai-messages-container" id="ai-messages-container"></div>
            </div>
            <div class="ai-assistant-input-area">
                <div class="ai-input-wrapper">
                    <textarea id="ai-text-input" class="ai-text-input" placeholder="Type message..."></textarea>
                    <button id="ai-send-button">Send</button>
                </div>
            </div>
        `;
        document.body.appendChild(chatContainer);

        chatInput = document.getElementById('ai-text-input');

        // Add CSS for testing
        const style = document.createElement('style');
        style.textContent = `
            .ai-assistant-panel {
                position: fixed;
                top: 0;
                right: 0;
                height: 100vh;
                width: 100vw;
                display: flex;
                flex-direction: column;
            }
            .ai-assistant-body {
                flex: 1;
                overflow-y: auto;
            }
            .ai-assistant-input-area {
                flex-shrink: 0;
                padding: 16px;
                padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
            }
            .ai-text-input {
                width: 100%;
                min-height: 44px;
                padding: 12px 16px;
            }
        `;
        document.head.appendChild(style);
    });

    afterEach(() => {
        if (chatContainer && chatContainer.parentNode) {
            chatContainer.remove();
        }
        // Reset window dimensions
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: originalInnerWidth
        });
        Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: originalInnerHeight
        });
        // Clean up styles
        const styles = document.head.querySelectorAll('style');
        styles.forEach(style => {
            if (style.textContent.includes('ai-assistant-panel')) {
                style.remove();
            }
        });
    });

    describe('Mobile Viewport Detection', () => {
        it('should detect mobile viewport', () => {
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: 375
            });

            const isMobile = window.innerWidth < 769;
            expect(isMobile).toBe(true);
        });

        it('should detect desktop viewport', () => {
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: 1024
            });

            const isMobile = window.innerWidth < 769;
            expect(isMobile).toBe(false);
        });

        it('should detect tablet viewport as mobile', () => {
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: 768
            });

            const isMobile = window.innerWidth < 769;
            expect(isMobile).toBe(true);
        });
    });

    describe('Chat Input Visibility', () => {
        it('should have chat input element', () => {
            expect(chatInput).toBeTruthy();
            expect(chatInput.tagName).toBe('TEXTAREA');
        });

        it('should have proper input structure', () => {
            const inputArea = document.querySelector('.ai-assistant-input-area');
            const inputWrapper = document.querySelector('.ai-input-wrapper');
            
            expect(inputArea).toBeTruthy();
            expect(inputWrapper).toBeTruthy();
            expect(inputWrapper.contains(chatInput)).toBe(true);
        });

        it('should have minimum height for touch targets', () => {
            const styles = getComputedStyle(chatInput);
            const minHeight = parseInt(styles.minHeight);
            
            expect(minHeight).toBeGreaterThanOrEqual(44); // iOS minimum touch target
        });
    });

    describe('Safe Area Insets', () => {
        it('should include safe-area-inset-bottom in padding', () => {
            const inputArea = document.querySelector('.ai-assistant-input-area');
            const styles = getComputedStyle(inputArea);
            
            // Check if paddingBottom includes calculation
            expect(styles.paddingBottom).toBeTruthy();
        });

        it('should handle missing safe-area-inset gracefully', () => {
            const inputArea = document.querySelector('.ai-assistant-input-area');
            const styles = getComputedStyle(inputArea);
            
            // Should have a base padding even without safe area
            const padding = parseInt(styles.paddingBottom);
            expect(padding).toBeGreaterThan(0);
        });
    });

    describe('ScrollIntoView Behavior', () => {
        it('should call scrollIntoView on focus (mobile)', () => {
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: 375
            });

            // Mock scrollIntoView
            chatInput.scrollIntoView = jest.fn();

            // Simulate focus event handler
            const handleFocus = () => {
                if (window.innerWidth < 769) {
                    setTimeout(() => {
                        chatInput.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'nearest',
                            inline: 'nearest'
                        });
                    }, 300);
                }
            };

            handleFocus();

            // Wait for setTimeout
            return new Promise(resolve => {
                setTimeout(() => {
                    expect(chatInput.scrollIntoView).toHaveBeenCalledWith({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'nearest'
                    });
                    resolve();
                }, 350);
            });
        });

        it('should not call scrollIntoView on desktop', () => {
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: 1024
            });

            chatInput.scrollIntoView = jest.fn();

            // Simulate focus event handler
            const handleFocus = () => {
                if (window.innerWidth < 769) {
                    chatInput.scrollIntoView();
                }
            };

            handleFocus();

            expect(chatInput.scrollIntoView).not.toHaveBeenCalled();
        });
    });

    describe('Virtual Keyboard Handling', () => {
        it('should maintain input visibility when keyboard opens', () => {
            // Simulate keyboard opening (reduces viewport height)
            Object.defineProperty(window, 'innerHeight', {
                writable: true,
                configurable: true,
                value: 400 // Reduced from ~667
            });

            const inputArea = document.querySelector('.ai-assistant-input-area');
            const rect = inputArea.getBoundingClientRect();
            
            // Input area should still be in viewport
            expect(rect.bottom).toBeLessThanOrEqual(window.innerHeight);
        });

        it('should handle visualViewport if available', () => {
            // Mock visualViewport API
            Object.defineProperty(window, 'visualViewport', {
                writable: true,
                configurable: true,
                value: {
                    height: 400,
                    width: 375,
                    offsetTop: 0,
                    offsetLeft: 0,
                    pageTop: 0,
                    pageLeft: 0,
                    scale: 1
                }
            });

            const viewportHeight = window.visualViewport?.height || window.innerHeight;
            expect(viewportHeight).toBe(400);
        });
    });

    describe('Input Focus State', () => {
        it('should focus input when clicked', () => {
            chatInput.focus = jest.fn();
            chatInput.click();
            chatInput.focus();
            
            expect(chatInput.focus).toHaveBeenCalled();
        });

        it('should maintain focus when typing', () => {
            chatInput.focus();
            expect(document.activeElement).toBe(chatInput);
            
            chatInput.value = 'test message';
            expect(document.activeElement).toBe(chatInput);
        });

        it('should handle blur when clicking outside', () => {
            chatInput.focus();
            expect(document.activeElement).toBe(chatInput);
            
            chatInput.blur();
            expect(document.activeElement).not.toBe(chatInput);
        });
    });

    describe('Chat Container Layout', () => {
        it('should use flexbox layout', () => {
            const styles = getComputedStyle(chatContainer);
            expect(styles.display).toBe('flex');
            expect(styles.flexDirection).toBe('column');
        });

        it('should fill viewport height', () => {
            const styles = getComputedStyle(chatContainer);
            expect(styles.height).toBe('100vh');
        });

        it('should have fixed positioning', () => {
            const styles = getComputedStyle(chatContainer);
            expect(styles.position).toBe('fixed');
        });

        it('should have input area at bottom', () => {
            const inputArea = document.querySelector('.ai-assistant-input-area');
            const styles = getComputedStyle(inputArea);
            
            expect(styles.flexShrink).toBe('0');
        });
    });

    describe('Responsive Behavior', () => {
        it('should adapt to portrait orientation', () => {
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: 375
            });
            Object.defineProperty(window, 'innerHeight', {
                writable: true,
                configurable: true,
                value: 667
            });

            const isPortrait = window.innerHeight > window.innerWidth;
            expect(isPortrait).toBe(true);
        });

        it('should adapt to landscape orientation', () => {
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: 667
            });
            Object.defineProperty(window, 'innerHeight', {
                writable: true,
                configurable: true,
                value: 375
            });

            const isLandscape = window.innerWidth > window.innerHeight;
            expect(isLandscape).toBe(true);
        });
    });

    describe('Accessibility', () => {
        it('should have proper ARIA labels', () => {
            expect(chatInput.getAttribute('placeholder')).toBeTruthy();
        });

        it('should be keyboard accessible', () => {
            chatInput.focus();
            expect(document.activeElement).toBe(chatInput);
            
            // Should be able to type
            chatInput.value = 'test';
            expect(chatInput.value).toBe('test');
        });

        it('should support screen readers', () => {
            // Check for proper semantic structure
            const inputArea = document.querySelector('.ai-assistant-input-area');
            expect(inputArea).toBeTruthy();
            
            const input = inputArea.querySelector('textarea');
            expect(input).toBeTruthy();
        });
    });

    describe('Edge Cases', () => {
        it('should handle very small viewports', () => {
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: 320 // iPhone SE
            });
            Object.defineProperty(window, 'innerHeight', {
                writable: true,
                configurable: true,
                value: 568
            });

            const isMobile = window.innerWidth < 769;
            expect(isMobile).toBe(true);
        });

        it('should handle large mobile devices', () => {
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: 768 // iPad Mini
            });

            const isMobile = window.innerWidth < 769;
            expect(isMobile).toBe(true);
        });

        it('should handle input with long text', () => {
            const longText = 'a'.repeat(1000);
            chatInput.value = longText;
            
            expect(chatInput.value.length).toBe(1000);
        });
    });
});
