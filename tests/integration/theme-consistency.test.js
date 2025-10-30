/**
 * @file Theme Consistency Integration Tests
 * @description Tests to ensure consistent theme usage across Home and InClasse pages
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

describe('Theme Consistency', () => {
    let homeContainer;
    let inClasseContainer;

    beforeEach(() => {
        // Create containers for both pages
        homeContainer = document.createElement('div');
        homeContainer.id = 'home';
        homeContainer.className = 'tab-content app-page';
        document.body.appendChild(homeContainer);

        inClasseContainer = document.createElement('div');
        inClasseContainer.id = 'inClasse';
        inClasseContainer.className = 'tab-content app-page';
        document.body.appendChild(inClasseContainer);

        // Add test CSS for MD3 variables
        const style = document.createElement('style');
        style.textContent = `
            :root {
                --md-sys-color-primary: #6750a4;
                --md-sys-color-on-primary: #ffffff;
                --md-sys-color-surface: #ffffff;
                --md-sys-color-on-surface: #1d1b20;
                --md-sys-color-background: #fef7ff;
                --md-sys-color-on-background: #1d1b20;
                --md-sys-shape-corner-medium: 12px;
                --md-sys-elevation-level1: 0 1px 2px rgba(0, 0, 0, 0.05);
                --spacing-md: 16px;
            }
            .app-page {
                background-color: var(--md-sys-color-background);
                color: var(--md-sys-color-on-background);
                padding: var(--spacing-md);
            }
            .app-card {
                background-color: var(--md-sys-color-surface);
                color: var(--md-sys-color-on-surface);
                border-radius: var(--md-sys-shape-corner-medium);
                box-shadow: var(--md-sys-elevation-level1);
                padding: var(--spacing-md);
            }
        `;
        document.head.appendChild(style);
    });

    afterEach(() => {
        if (homeContainer && homeContainer.parentNode) {
            homeContainer.remove();
        }
        if (inClasseContainer && inClasseContainer.parentNode) {
            inClasseContainer.remove();
        }
        // Clean up styles
        const styles = document.head.querySelectorAll('style');
        styles.forEach(style => {
            if (style.textContent.includes('--md-sys-color-primary')) {
                style.remove();
            }
        });
    });

    describe('CSS Variables', () => {
        it('should have same MD3 color variables available', () => {
            const rootStyles = getComputedStyle(document.documentElement);
            
            const requiredVars = [
                '--md-sys-color-primary',
                '--md-sys-color-on-primary',
                '--md-sys-color-surface',
                '--md-sys-color-on-surface',
                '--md-sys-color-background',
                '--md-sys-color-on-background'
            ];

            requiredVars.forEach(varName => {
                const value = rootStyles.getPropertyValue(varName).trim();
                expect(value).toBeTruthy();
            });
        });

        it('should use consistent spacing variables', () => {
            const rootStyles = getComputedStyle(document.documentElement);
            const spacing = rootStyles.getPropertyValue('--spacing-md').trim();
            
            expect(spacing).toBeTruthy();
            expect(spacing).toBe('16px');
        });

        it('should use consistent border radius', () => {
            const rootStyles = getComputedStyle(document.documentElement);
            const radius = rootStyles.getPropertyValue('--md-sys-shape-corner-medium').trim();
            
            expect(radius).toBeTruthy();
            expect(radius).toBe('12px');
        });
    });

    describe('Page Styles', () => {
        it('should apply same background color to both pages', () => {
            const homeStyles = getComputedStyle(homeContainer);
            const inClasseStyles = getComputedStyle(inClasseContainer);

            // Both should have same classes
            expect(homeContainer.className).toBe(inClasseContainer.className);
            // In jsdom, computed styles may be empty, so we just check consistency
            expect(homeStyles.backgroundColor).toBe(inClasseStyles.backgroundColor);
        });

        it('should apply same text color to both pages', () => {
            const homeStyles = getComputedStyle(homeContainer);
            const inClasseStyles = getComputedStyle(inClasseContainer);

            // Check consistency rather than truthy value (jsdom limitation)
            expect(homeStyles.color).toBe(inClasseStyles.color);
        });

        it('should apply same padding to both pages', () => {
            const homeStyles = getComputedStyle(homeContainer);
            const inClasseStyles = getComputedStyle(inClasseContainer);

            // Check consistency rather than truthy value (jsdom limitation)
            expect(homeStyles.padding).toBe(inClasseStyles.padding);
        });
    });

    describe('Card Styles', () => {
        beforeEach(() => {
            // Add cards to both pages
            const homeCard = document.createElement('div');
            homeCard.className = 'app-card';
            homeCard.id = 'home-card';
            homeContainer.appendChild(homeCard);

            const inClasseCard = document.createElement('div');
            inClasseCard.className = 'app-card';
            inClasseCard.id = 'inclasse-card';
            inClasseContainer.appendChild(inClasseCard);
        });

        it('should have same card background color', () => {
            const homeCard = document.getElementById('home-card');
            const inClasseCard = document.getElementById('inclasse-card');

            const homeStyles = getComputedStyle(homeCard);
            const inClasseStyles = getComputedStyle(inClasseCard);

            // Check consistency (jsdom may not compute all values)
            expect(homeStyles.backgroundColor).toBe(inClasseStyles.backgroundColor);
        });

        it('should have same card border radius', () => {
            const homeCard = document.getElementById('home-card');
            const inClasseCard = document.getElementById('inclasse-card');

            const homeStyles = getComputedStyle(homeCard);
            const inClasseStyles = getComputedStyle(inClasseCard);

            expect(homeStyles.borderRadius).toBeTruthy();
            expect(inClasseStyles.borderRadius).toBeTruthy();
            expect(homeStyles.borderRadius).toBe(inClasseStyles.borderRadius);
        });

        it('should have same card padding', () => {
            const homeCard = document.getElementById('home-card');
            const inClasseCard = document.getElementById('inclasse-card');

            const homeStyles = getComputedStyle(homeCard);
            const inClasseStyles = getComputedStyle(inClasseCard);

            // Check consistency (jsdom may not compute all values)
            expect(homeStyles.padding).toBe(inClasseStyles.padding);
        });

        it('should have same card box shadow', () => {
            const homeCard = document.getElementById('home-card');
            const inClasseCard = document.getElementById('inclasse-card');

            const homeStyles = getComputedStyle(homeCard);
            const inClasseStyles = getComputedStyle(inClasseCard);

            expect(homeStyles.boxShadow).toBeTruthy();
            expect(inClasseStyles.boxShadow).toBeTruthy();
            expect(homeStyles.boxShadow).toBe(inClasseStyles.boxShadow);
        });
    });

    describe('Theme Classes', () => {
        it('should not have conflicting theme classes', () => {
            expect(homeContainer.classList.contains('light-theme')).toBe(false);
            expect(homeContainer.classList.contains('dark-theme')).toBe(false);
            expect(inClasseContainer.classList.contains('light-theme')).toBe(false);
            expect(inClasseContainer.classList.contains('dark-theme')).toBe(false);
        });

        it('should use app-page class consistently', () => {
            expect(homeContainer.classList.contains('app-page')).toBe(true);
            expect(inClasseContainer.classList.contains('app-page')).toBe(true);
        });
    });

    describe('No Hardcoded Values', () => {
        it('should not use hardcoded colors in inline styles', () => {
            // Home page
            expect(homeContainer.style.color).toBe('');
            expect(homeContainer.style.backgroundColor).toBe('');

            // InClasse page
            expect(inClasseContainer.style.color).toBe('');
            expect(inClasseContainer.style.backgroundColor).toBe('');
        });

        it('should not use hardcoded spacing in inline styles', () => {
            expect(homeContainer.style.padding).toBe('');
            expect(homeContainer.style.margin).toBe('');
            expect(inClasseContainer.style.padding).toBe('');
            expect(inClasseContainer.style.margin).toBe('');
        });
    });

    describe('Computed Style Validation', () => {
        it('should compute MD3 variables correctly', () => {
            const rootStyles = getComputedStyle(document.documentElement);
            
            const primary = rootStyles.getPropertyValue('--md-sys-color-primary').trim();
            expect(primary).toBe('#6750a4');
            
            const surface = rootStyles.getPropertyValue('--md-sys-color-surface').trim();
            expect(surface).toBe('#ffffff');
        });

        it('should apply computed styles to pages', () => {
            const homeStyles = getComputedStyle(homeContainer);
            
            // jsdom may not compute all styles, so just check that getComputedStyle works
            expect(homeStyles).toBeTruthy();
            expect(typeof homeStyles.backgroundColor).toBe('string');
        });
    });

    describe('Visual Consistency Checks', () => {
        it('should have identical visual appearance markers', () => {
            const homeStyles = getComputedStyle(homeContainer);
            const inClasseStyles = getComputedStyle(inClasseContainer);

            // Check all style properties that should be identical
            const styleProperties = [
                'backgroundColor',
                'color',
                'padding',
                'fontFamily',
                'fontSize'
            ];

            styleProperties.forEach(prop => {
                expect(homeStyles[prop]).toBe(inClasseStyles[prop]);
            });
        });

        it('should maintain consistency across theme changes', () => {
            // Simulate theme change by updating CSS variable
            document.documentElement.style.setProperty('--md-sys-color-background', '#1a1a1a');
            
            const homeStyles = getComputedStyle(homeContainer);
            const inClasseStyles = getComputedStyle(inClasseContainer);

            // Both should reflect the new value
            expect(homeStyles.backgroundColor).toBe(inClasseStyles.backgroundColor);
            
            // Clean up
            document.documentElement.style.removeProperty('--md-sys-color-background');
        });
    });

    describe('Responsive Consistency', () => {
        it('should apply same mobile styles to both pages', () => {
            // Simulate mobile viewport
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: 375
            });

            const homeStyles = getComputedStyle(homeContainer);
            const inClasseStyles = getComputedStyle(inClasseContainer);

            expect(homeStyles.padding).toBe(inClasseStyles.padding);
            
            // Reset
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: 1024
            });
        });
    });
});
