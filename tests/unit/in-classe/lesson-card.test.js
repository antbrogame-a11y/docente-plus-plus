/**
 * Unit tests for LessonCard component
 * @jest-environment jsdom
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { LessonCard, createLessonCard } from '../../../src/components/LessonCard.js';

describe('LessonCard', () => {
    let mockLessonData;

    beforeEach(() => {
        mockLessonData = {
            id: 'test-lesson-001',
            title: 'Test Lesson Title',
            teacher: 'Prof. Test Teacher',
            subject: 'Test Subject',
            date: '2025-10-20',
            time: '14:00 - 15:00',
            duration: 60,
            className: 'Test Class 3A',
            type: 'Teoria',
            enrolledCount: 10,
            maxCapacity: 25,
            onEnroll: jest.fn(),
            onViewDetails: jest.fn()
        };
    });

    describe('constructor', () => {
        it('should create a new LessonCard instance', () => {
            const card = new LessonCard(mockLessonData);
            
            expect(card).toBeInstanceOf(LessonCard);
            expect(card.config).toEqual(mockLessonData);
            expect(card.element).toBeNull();
        });
    });

    describe('render', () => {
        it('should render a card element', () => {
            const card = new LessonCard(mockLessonData);
            const element = card.render();
            
            expect(element).toBeInstanceOf(HTMLElement);
            expect(element.tagName).toBe('ARTICLE');
            expect(element.classList.contains('lesson-card')).toBe(true);
        });

        it('should display lesson title', () => {
            const card = new LessonCard(mockLessonData);
            const element = card.render();
            
            const title = element.querySelector('.lesson-title');
            expect(title).not.toBeNull();
            expect(title.textContent).toBe('Test Lesson Title');
        });

        it('should display teacher name', () => {
            const card = new LessonCard(mockLessonData);
            const element = card.render();
            
            const content = element.innerHTML;
            expect(content).toContain('Prof. Test Teacher');
        });

        it('should display class name', () => {
            const card = new LessonCard(mockLessonData);
            const element = card.render();
            
            const content = element.innerHTML;
            expect(content).toContain('Test Class 3A');
        });

        it('should display availability information', () => {
            const card = new LessonCard(mockLessonData);
            const element = card.render();
            
            const availabilityText = element.querySelector('.availability-text');
            expect(availabilityText).not.toBeNull();
            expect(availabilityText.textContent).toContain('10 / 25');
        });

        it('should show "Completo" badge when lesson is full', () => {
            const fullLesson = { ...mockLessonData, enrolledCount: 25, maxCapacity: 25 };
            const card = new LessonCard(fullLesson);
            const element = card.render();
            
            const fullBadge = element.querySelector('.full-badge');
            expect(fullBadge).not.toBeNull();
            expect(fullBadge.textContent).toBe('Completo');
        });

        it('should not show "Completo" badge when lesson is not full', () => {
            const card = new LessonCard(mockLessonData);
            const element = card.render();
            
            const fullBadge = element.querySelector('.full-badge');
            expect(fullBadge).toBeNull();
        });

        it('should disable enroll button when lesson is full', () => {
            const fullLesson = { ...mockLessonData, enrolledCount: 25, maxCapacity: 25 };
            const card = new LessonCard(fullLesson);
            const element = card.render();
            
            const enrollBtn = element.querySelector('.btn-enroll');
            expect(enrollBtn.disabled).toBe(true);
        });

        it('should enable enroll button when lesson is not full', () => {
            const card = new LessonCard(mockLessonData);
            const element = card.render();
            
            const enrollBtn = element.querySelector('.btn-enroll');
            expect(enrollBtn.disabled).toBe(false);
        });

        it('should set correct data-lesson-id attribute', () => {
            const card = new LessonCard(mockLessonData);
            const element = card.render();
            
            expect(element.getAttribute('data-lesson-id')).toBe('test-lesson-001');
        });

        it('should have proper ARIA attributes', () => {
            const card = new LessonCard(mockLessonData);
            const element = card.render();
            
            expect(element.getAttribute('role')).toBe('article');
            expect(element.getAttribute('aria-label')).toContain('Test Lesson Title');
            expect(element.getAttribute('tabindex')).toBe('0');
        });

        it('should apply correct type class for Teoria', () => {
            const card = new LessonCard(mockLessonData);
            const element = card.render();
            
            const typeBadge = element.querySelector('.lesson-type-badge');
            expect(typeBadge.classList.contains('type-teoria')).toBe(true);
        });

        it('should apply correct type class for Laboratorio', () => {
            const labLesson = { ...mockLessonData, type: 'Laboratorio' };
            const card = new LessonCard(labLesson);
            const element = card.render();
            
            const typeBadge = element.querySelector('.lesson-type-badge');
            expect(typeBadge.classList.contains('type-laboratorio')).toBe(true);
        });

        it('should escape HTML in user-provided content', () => {
            const maliciousData = {
                ...mockLessonData,
                title: '<script>alert("XSS")</script>Test',
                teacher: '<img src=x onerror=alert(1)>Teacher'
            };
            
            const card = new LessonCard(maliciousData);
            const element = card.render();
            
            // Should contain escaped content (verified by innerHTML containing escaped tags)
            const title = element.querySelector('.lesson-title');
            expect(title.innerHTML).toContain('&lt;script&gt;');
            expect(title.innerHTML).toContain('&lt;/script&gt;');
            
            // Check teacher is escaped
            const content = element.innerHTML;
            expect(content).toContain('&lt;img');
        });
    });

    describe('update', () => {
        it('should update card data', () => {
            const card = new LessonCard(mockLessonData);
            card.render();
            
            // Update should merge config
            card.update({ enrolledCount: 15 });
            
            expect(card.config.enrolledCount).toBe(15);
            expect(card.config.title).toBe(mockLessonData.title); // Other props should remain
        });

        it('should re-render card after update when in DOM', () => {
            const container = document.createElement('div');
            document.body.appendChild(container);
            
            const card = new LessonCard(mockLessonData);
            const element = card.render();
            container.appendChild(element);
            
            card.update({ title: 'Updated Title' });
            
            // After update, config should be updated
            expect(card.config.title).toBe('Updated Title');
            
            // New element should reflect changes
            const title = card.element.querySelector('.lesson-title');
            expect(title.textContent).toBe('Updated Title');
            
            document.body.removeChild(container);
        });
    });

    describe('destroy', () => {
        it('should remove element from DOM', () => {
            const card = new LessonCard(mockLessonData);
            const element = card.render();
            document.body.appendChild(element);
            
            expect(document.body.contains(element)).toBe(true);
            
            card.destroy();
            
            expect(document.body.contains(element)).toBe(false);
            expect(card.element).toBeNull();
        });
    });

    describe('createLessonCard helper', () => {
        it('should create and render a card element', () => {
            const element = createLessonCard(mockLessonData);
            
            expect(element).toBeInstanceOf(HTMLElement);
            expect(element.classList.contains('lesson-card')).toBe(true);
        });
    });

    describe('availability calculation', () => {
        it('should calculate correct availability percentage', () => {
            const halfFull = { ...mockLessonData, enrolledCount: 12, maxCapacity: 24 };
            const card = new LessonCard(halfFull);
            
            // Test internal method
            const percent = card._getAvailabilityPercent();
            expect(percent).toBe(50);
        });

        it('should handle zero capacity gracefully', () => {
            const zeroCapacity = { ...mockLessonData, enrolledCount: 0, maxCapacity: 0 };
            const card = new LessonCard(zeroCapacity);
            
            const percent = card._getAvailabilityPercent();
            expect(percent).toBe(0);
        });
    });

    describe('type icon mapping', () => {
        it('should return correct icon for Teoria', () => {
            const card = new LessonCard(mockLessonData);
            expect(card._getTypeIcon('Teoria')).toBe('menu_book');
        });

        it('should return correct icon for Laboratorio', () => {
            const card = new LessonCard(mockLessonData);
            expect(card._getTypeIcon('Laboratorio')).toBe('science');
        });

        it('should return default icon for unknown type', () => {
            const card = new LessonCard(mockLessonData);
            expect(card._getTypeIcon('UnknownType')).toBe('school');
        });
    });

    describe('date formatting', () => {
        it('should format date in Italian locale', () => {
            const card = new LessonCard(mockLessonData);
            const formatted = card._formatDate('2025-10-20');
            
            // Should contain Italian day/month names
            expect(formatted.toLowerCase()).toMatch(/lunedì|martedì|mercoledì|giovedì|venerdì|sabato|domenica/);
        });

        it('should handle invalid date gracefully', () => {
            const card = new LessonCard(mockLessonData);
            const formatted = card._formatDate('invalid-date');
            
            // Invalid date may format as "Invalid Date" or return original, both are acceptable
            expect(typeof formatted).toBe('string');
            expect(formatted.length).toBeGreaterThan(0);
        });
    });
});
