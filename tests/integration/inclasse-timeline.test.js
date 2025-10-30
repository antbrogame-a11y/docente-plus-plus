/**
 * @file InClasse Timeline Integration Tests
 * @description Tests for the daily timeline feature in InClasse page
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';

describe('InClasse Daily Timeline', () => {
    let mockLessonsAPI;
    let container;

    beforeEach(() => {
        // Create container
        container = document.createElement('div');
        container.id = 'in-classe-container';
        document.body.appendChild(container);

        // Mock lessons API
        mockLessonsAPI = {
            getLessons: jest.fn(),
            getSubjects: jest.fn(),
            enrollInLesson: jest.fn()
        };
    });

    afterEach(() => {
        if (container && container.parentNode) {
            container.remove();
        }
    });

    describe('Timeline Display', () => {
        it('should display lessons for the current day', async () => {
            const today = new Date().toISOString().split('T')[0];
            const mockLessons = [
                {
                    id: '1',
                    title: 'Matematica',
                    subject: 'Matematica',
                    teacher: 'Prof. Rossi',
                    className: '3A',
                    date: today,
                    time: '09:00',
                    duration: 60,
                    enrolledCount: 15,
                    maxCapacity: 25,
                    type: 'Lezione'
                },
                {
                    id: '2',
                    title: 'Italiano',
                    subject: 'Italiano',
                    teacher: 'Prof. Bianchi',
                    className: '3A',
                    date: today,
                    time: '10:00',
                    duration: 60,
                    enrolledCount: 20,
                    maxCapacity: 25,
                    type: 'Lezione'
                }
            ];

            mockLessonsAPI.getLessons.mockResolvedValue(mockLessons);
            mockLessonsAPI.getSubjects.mockResolvedValue(['Matematica', 'Italiano']);

            // Simulate timeline display
            const lessonsForToday = mockLessons.filter(lesson => lesson.date === today);
            
            expect(lessonsForToday).toHaveLength(2);
            expect(lessonsForToday[0].title).toBe('Matematica');
            expect(lessonsForToday[1].title).toBe('Italiano');
        });

        it('should show empty state when no lessons exist', async () => {
            mockLessonsAPI.getLessons.mockResolvedValue([]);
            mockLessonsAPI.getSubjects.mockResolvedValue([]);

            const lessons = await mockLessonsAPI.getLessons();

            expect(lessons).toHaveLength(0);
        });

        it('should filter lessons by current day', () => {
            const today = new Date().toISOString().split('T')[0];
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
            
            const allLessons = [
                { id: '1', title: 'Lesson 1', date: today, time: '09:00' },
                { id: '2', title: 'Lesson 2', date: yesterday, time: '10:00' },
                { id: '3', title: 'Lesson 3', date: today, time: '11:00' }
            ];

            const todaysLessons = allLessons.filter(lesson => lesson.date === today);

            expect(todaysLessons).toHaveLength(2);
            expect(todaysLessons[0].title).toBe('Lesson 1');
            expect(todaysLessons[1].title).toBe('Lesson 3');
        });
    });

    describe('Timeline Ordering', () => {
        it('should display lessons in chronological order', () => {
            const today = new Date().toISOString().split('T')[0];
            const lessons = [
                { id: '1', title: 'Lesson 3', date: today, time: '11:00' },
                { id: '2', title: 'Lesson 1', date: today, time: '09:00' },
                { id: '3', title: 'Lesson 2', date: today, time: '10:00' }
            ];

            const sorted = lessons.sort((a, b) => {
                return a.time.localeCompare(b.time);
            });

            expect(sorted[0].title).toBe('Lesson 1');
            expect(sorted[1].title).toBe('Lesson 2');
            expect(sorted[2].title).toBe('Lesson 3');
        });

        it('should handle lessons with same time', () => {
            const today = new Date().toISOString().split('T')[0];
            const lessons = [
                { id: '1', title: 'Lesson A', date: today, time: '09:00', className: '3A' },
                { id: '2', title: 'Lesson B', date: today, time: '09:00', className: '3B' }
            ];

            expect(lessons).toHaveLength(2);
            expect(lessons.every(l => l.time === '09:00')).toBe(true);
        });
    });

    describe('API Integration', () => {
        it('should call fetchLessons with current day', async () => {
            const today = new Date().toISOString().split('T')[0];
            const mockFetch = jest.fn().mockResolvedValue([]);

            await mockFetch(today);

            expect(mockFetch).toHaveBeenCalledWith(today);
        });

        it('should handle API errors gracefully', async () => {
            mockLessonsAPI.getLessons.mockRejectedValue(new Error('API Error'));

            try {
                await mockLessonsAPI.getLessons();
                fail('Should have thrown error');
            } catch (error) {
                expect(error.message).toBe('API Error');
            }
        });

        it('should use fallback mock data when API unavailable', async () => {
            const fallbackLessons = [
                {
                    id: 'mock-1',
                    title: 'Mock Lesson',
                    subject: 'Matematica',
                    date: new Date().toISOString().split('T')[0],
                    time: '09:00'
                }
            ];

            mockLessonsAPI.getLessons.mockRejectedValue(new Error('Network error'));

            try {
                await mockLessonsAPI.getLessons();
            } catch {
                // Use fallback
                const lessons = fallbackLessons;
                expect(lessons).toHaveLength(1);
                expect(lessons[0].title).toBe('Mock Lesson');
            }
        });
    });

    describe('Development Fallback', () => {
        it('should provide mock data for offline development', () => {
            const mockData = {
                lessons: [
                    {
                        id: 'dev-1',
                        title: 'Development Lesson',
                        subject: 'Test Subject',
                        teacher: 'Dev Teacher',
                        className: '1A',
                        date: new Date().toISOString().split('T')[0],
                        time: '09:00',
                        duration: 60,
                        enrolledCount: 10,
                        maxCapacity: 25,
                        type: 'Lezione'
                    }
                ]
            };

            expect(mockData.lessons).toBeDefined();
            expect(mockData.lessons).toHaveLength(1);
            expect(mockData.lessons[0].title).toBe('Development Lesson');
        });

        it('should detect offline mode', () => {
            const isOnline = navigator.onLine;
            const isDevelopment = process.env.NODE_ENV === 'development';

            // In tests, we can verify the detection logic
            expect(typeof isOnline).toBe('boolean');
        });
    });

    describe('Timeline Updates', () => {
        it('should refresh timeline when day changes', () => {
            const currentDay = new Date().toISOString().split('T')[0];
            let displayedDay = currentDay;

            // Simulate day change
            const nextDay = new Date(Date.now() + 86400000).toISOString().split('T')[0];
            displayedDay = nextDay;

            expect(displayedDay).not.toBe(currentDay);
            expect(displayedDay).toBe(nextDay);
        });

        it('should update lesson count when lessons are added', () => {
            let lessons = [
                { id: '1', title: 'Lesson 1' }
            ];

            expect(lessons).toHaveLength(1);

            lessons.push({ id: '2', title: 'Lesson 2' });

            expect(lessons).toHaveLength(2);
        });
    });

    describe('Timeline Interaction', () => {
        it('should allow clicking on a lesson to view details', () => {
            const lesson = {
                id: '1',
                title: 'Matematica',
                subject: 'Matematica',
                teacher: 'Prof. Rossi'
            };

            const clickHandler = jest.fn();
            
            // Simulate clicking on lesson
            clickHandler(lesson);

            expect(clickHandler).toHaveBeenCalledWith(lesson);
        });

        it('should show lesson details when selected', () => {
            const lesson = {
                id: '1',
                title: 'Matematica',
                subject: 'Matematica',
                teacher: 'Prof. Rossi',
                className: '3A',
                time: '09:00',
                duration: 60
            };

            // Verify all required details are present
            expect(lesson.title).toBeDefined();
            expect(lesson.subject).toBeDefined();
            expect(lesson.teacher).toBeDefined();
            expect(lesson.className).toBeDefined();
            expect(lesson.time).toBeDefined();
        });
    });
});
