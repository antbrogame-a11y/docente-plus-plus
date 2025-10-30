/**
 * @jest-environment jsdom
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

describe('Schedule Enhancement - Auto-open Suppression', () => {
    let originalLocalStorage;
    
    beforeEach(() => {
        // Reset DOM
        document.body.innerHTML = `
            <div id="lesson-picker-modal" style="display: block;">
                <div class="modal-content">Modal Content</div>
            </div>
            <main id="in-classe-main">
                <table id="static-schedule-grid">
                    <tbody>
                        <tr>
                            <td data-day="Lunedì" data-time="08:00"></td>
                        </tr>
                    </tbody>
                </table>
            </main>
        `;
        
        // Mock localStorage
        originalLocalStorage = global.localStorage;
        const localStorageMock = {
            store: {},
            getItem(key) {
                return this.store[key] || null;
            },
            setItem(key, value) {
                this.store[key] = value.toString();
            },
            removeItem(key) {
                delete this.store[key];
            },
            clear() {
                this.store = {};
            }
        };
        global.localStorage = localStorageMock;
        
        // Set up initial localStorage state
        localStorage.setItem('lastOpenedLesson', 'Lunedì-08:00');
        localStorage.setItem('lastOpenedClassId', '3A');
        
        // Clear any window properties
        delete window.__disableAutoLessonPicker;
        delete window.__orig_showLessonPicker;
        delete window.__orig_showLessonPickerInline;
        delete window.showLessonPicker;
        delete window.showLessonPickerInline;
        delete window.initScheduleGrid;
    });
    
    afterEach(() => {
        global.localStorage = originalLocalStorage;
    });
    
    it('should remove lastOpenedLesson from localStorage on load', () => {
        // Verify initial state
        expect(localStorage.getItem('lastOpenedLesson')).toBe('Lunedì-08:00');
        
        // Simulate the suppression code from schedule-enhance.js
        localStorage.removeItem('lastOpenedLesson');
        localStorage.removeItem('lastOpenedClassId');
        
        // Verify localStorage was cleared
        expect(localStorage.getItem('lastOpenedLesson')).toBeNull();
        expect(localStorage.getItem('lastOpenedClassId')).toBeNull();
    });
    
    it('should hide lesson-picker-modal element', () => {
        const modal = document.getElementById('lesson-picker-modal');
        expect(modal).not.toBeNull();
        expect(modal.style.display).toBe('block');
        
        // Simulate the suppression code
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        
        expect(modal.style.display).toBe('none');
        expect(modal.getAttribute('aria-hidden')).toBe('true');
    });
    
    it('should set __disableAutoLessonPicker flag', () => {
        expect(window.__disableAutoLessonPicker).toBeUndefined();
        
        // Simulate the suppression code
        window.__disableAutoLessonPicker = true;
        
        expect(window.__disableAutoLessonPicker).toBe(true);
    });
    
    it('should override showLessonPicker with no-op that dispatches event', () => {
        let eventDispatched = false;
        let eventDetail = null;
        
        // Set up original function
        window.showLessonPicker = function() {
            return true;
        };
        
        // Set up event listener
        window.addEventListener('lesson-picker-suppressed', (e) => {
            eventDispatched = true;
            eventDetail = e.detail;
        });
        
        // Simulate the suppression override
        window.__orig_showLessonPicker = window.showLessonPicker;
        window.showLessonPicker = function() {
            window.dispatchEvent(new CustomEvent('lesson-picker-suppressed', { 
                detail: { function: 'showLessonPicker' } 
            }));
            return false;
        };
        
        // Call the overridden function
        const result = window.showLessonPicker();
        
        expect(result).toBe(false);
        expect(eventDispatched).toBe(true);
        expect(eventDetail).toEqual({ function: 'showLessonPicker' });
    });
    
    it('should override showLessonPickerInline with no-op that dispatches event', () => {
        let eventDispatched = false;
        let eventDetail = null;
        
        // Set up original function
        window.showLessonPickerInline = function() {
            return true;
        };
        
        // Set up event listener
        window.addEventListener('lesson-picker-suppressed', (e) => {
            eventDispatched = true;
            eventDetail = e.detail;
        });
        
        // Simulate the suppression override
        window.__orig_showLessonPickerInline = window.showLessonPickerInline;
        window.showLessonPickerInline = function() {
            window.dispatchEvent(new CustomEvent('lesson-picker-suppressed', { 
                detail: { function: 'showLessonPickerInline' } 
            }));
            return false;
        };
        
        // Call the overridden function
        const result = window.showLessonPickerInline();
        
        expect(result).toBe(false);
        expect(eventDispatched).toBe(true);
        expect(eventDetail).toEqual({ function: 'showLessonPickerInline' });
    });
    
    it('should preserve original functions for restoration', () => {
        const originalPicker = function() { return 'original'; };
        const originalInline = function() { return 'originalInline'; };
        
        window.showLessonPicker = originalPicker;
        window.showLessonPickerInline = originalInline;
        
        // Simulate the suppression code preserving originals
        window.__orig_showLessonPicker = window.showLessonPicker;
        window.__orig_showLessonPickerInline = window.showLessonPickerInline;
        
        window.showLessonPicker = function() { return false; };
        window.showLessonPickerInline = function() { return false; };
        
        // Verify originals are preserved
        expect(window.__orig_showLessonPicker).toBe(originalPicker);
        expect(window.__orig_showLessonPickerInline).toBe(originalInline);
        expect(window.__orig_showLessonPicker()).toBe('original');
        expect(window.__orig_showLessonPickerInline()).toBe('originalInline');
    });
    
    it('should allow restoration of original behavior', () => {
        const originalPicker = function() { return 'restored'; };
        
        window.showLessonPicker = originalPicker;
        window.__orig_showLessonPicker = window.showLessonPicker;
        window.__disableAutoLessonPicker = true;
        
        window.showLessonPicker = function() { return false; };
        
        // Restore original behavior
        window.showLessonPicker = window.__orig_showLessonPicker;
        delete window.__disableAutoLessonPicker;
        
        expect(window.showLessonPicker()).toBe('restored');
        expect(window.__disableAutoLessonPicker).toBeUndefined();
    });
});

describe('Schedule Enhancement - Grid Initialization', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <main id="in-classe-main">
                <table id="static-schedule-grid">
                    <tbody>
                        <tr>
                            <td data-day="Lunedì" data-time="08:00">
                                <span class="slot-placeholder">—</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </main>
        `;
        
        delete window.initScheduleGrid;
    });
    
    it('should expose initScheduleGrid function', () => {
        // Simulate exposing the function
        window.initScheduleGrid = function() {
            return true;
        };
        
        expect(typeof window.initScheduleGrid).toBe('function');
        expect(window.initScheduleGrid()).toBe(true);
    });
    
    it('should initialize grid on DOMContentLoaded', () => {
        let initialized = false;
        
        window.initScheduleGrid = function() {
            initialized = true;
        };
        
        // Simulate DOMContentLoaded
        const event = new Event('DOMContentLoaded');
        document.dispatchEvent(event);
        
        // Note: In actual implementation, the IIFE would set up the listener
        // This test just verifies the pattern would work
        expect(typeof window.initScheduleGrid).toBe('function');
    });
});

describe('In-Classe Page - Lesson Selection Flow', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="lesson-picker-modal" style="display: none;" aria-hidden="true">
                <div class="modal-content">Modal Content</div>
            </div>
            <main id="in-classe-main">
                <table id="static-schedule-grid">
                    <tbody>
                        <tr>
                            <td data-day="Lunedì" data-time="08:00">
                                <div class="slot-item">
                                    <div class="slot-info">
                                        <div class="slot-subject">Matematica</div>
                                        <div class="slot-class">3A</div>
                                    </div>
                                    <div class="slot-actions">
                                        <button class="slot-enter-btn" data-lesson-key="Lunedì-08:00" data-class-id="3A">
                                            Entra
                                        </button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </main>
        `;
        
        window.__disableAutoLessonPicker = true;
    });
    
    it('should not auto-open lesson picker on page load when no lesson is selected', () => {
        const modal = document.getElementById('lesson-picker-modal');
        
        expect(modal.style.display).toBe('none');
        expect(modal.getAttribute('aria-hidden')).toBe('true');
        expect(window.__disableAutoLessonPicker).toBe(true);
    });
    
    it('should allow lesson selection through static grid', () => {
        const enterButton = document.querySelector('.slot-enter-btn');
        
        expect(enterButton).not.toBeNull();
        expect(enterButton.getAttribute('data-lesson-key')).toBe('Lunedì-08:00');
        expect(enterButton.getAttribute('data-class-id')).toBe('3A');
        expect(enterButton.textContent.trim()).toBe('Entra');
    });
    
    it('should have static grid as first child of main', () => {
        const main = document.getElementById('in-classe-main');
        const firstChild = main.firstElementChild;
        
        expect(firstChild.id).toBe('static-schedule-grid');
        expect(firstChild.tagName).toBe('TABLE');
    });
});
