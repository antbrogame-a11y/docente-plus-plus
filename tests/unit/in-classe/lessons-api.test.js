/**
 * Unit tests for Lessons API
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { LessonsAPI } from '../../../src/api/lessons.js';

describe('LessonsAPI', () => {
    let api;

    beforeEach(() => {
        api = new LessonsAPI({ useMock: true });
    });

    describe('getLessons', () => {
        it('should return an array of lessons', async () => {
            const lessons = await api.getLessons();
            
            expect(Array.isArray(lessons)).toBe(true);
            expect(lessons.length).toBeGreaterThan(0);
        });

        it('should return lessons with required properties', async () => {
            const lessons = await api.getLessons();
            const lesson = lessons[0];
            
            expect(lesson).toHaveProperty('id');
            expect(lesson).toHaveProperty('title');
            expect(lesson).toHaveProperty('teacher');
            expect(lesson).toHaveProperty('subject');
            expect(lesson).toHaveProperty('date');
            expect(lesson).toHaveProperty('time');
            expect(lesson).toHaveProperty('duration');
            expect(lesson).toHaveProperty('classId');
            expect(lesson).toHaveProperty('className');
            expect(lesson).toHaveProperty('type');
            expect(lesson).toHaveProperty('status');
            expect(lesson).toHaveProperty('enrolledCount');
            expect(lesson).toHaveProperty('maxCapacity');
        });

        it('should filter lessons by search query (title)', async () => {
            const lessons = await api.getLessons({ search: 'Algebra' });
            
            expect(lessons.length).toBeGreaterThan(0);
            lessons.forEach(lesson => {
                const titleMatch = lesson.title.toLowerCase().includes('algebra');
                const teacherMatch = lesson.teacher.toLowerCase().includes('algebra');
                expect(titleMatch || teacherMatch).toBe(true);
            });
        });

        it('should filter lessons by search query (teacher)', async () => {
            const lessons = await api.getLessons({ search: 'Rossi' });
            
            expect(lessons.length).toBeGreaterThan(0);
            lessons.forEach(lesson => {
                const titleMatch = lesson.title.toLowerCase().includes('rossi');
                const teacherMatch = lesson.teacher.toLowerCase().includes('rossi');
                expect(titleMatch || teacherMatch).toBe(true);
            });
        });

        it('should filter lessons by subject', async () => {
            const lessons = await api.getLessons({ subject: 'Matematica' });
            
            expect(lessons.length).toBeGreaterThan(0);
            lessons.forEach(lesson => {
                expect(lesson.subject).toBe('Matematica');
            });
        });

        it('should filter lessons by status', async () => {
            const lessons = await api.getLessons({ status: 'scheduled' });
            
            lessons.forEach(lesson => {
                expect(lesson.status).toBe('scheduled');
            });
        });

        it('should return empty array when no matches found', async () => {
            const lessons = await api.getLessons({ search: 'NonexistentLesson12345' });
            
            expect(Array.isArray(lessons)).toBe(true);
            expect(lessons.length).toBe(0);
        });
    });

    describe('getLesson', () => {
        it('should return a single lesson by ID', async () => {
            const lesson = await api.getLesson('lesson-001');
            
            expect(lesson).not.toBeNull();
            expect(lesson.id).toBe('lesson-001');
        });

        it('should return null for non-existent ID', async () => {
            const lesson = await api.getLesson('non-existent-id');
            
            expect(lesson).toBeNull();
        });
    });

    describe('getSubjects', () => {
        it('should return an array of unique subjects', async () => {
            const subjects = await api.getSubjects();
            
            expect(Array.isArray(subjects)).toBe(true);
            expect(subjects.length).toBeGreaterThan(0);
            
            // Check uniqueness
            const uniqueSubjects = [...new Set(subjects)];
            expect(subjects.length).toBe(uniqueSubjects.length);
        });

        it('should return sorted subjects', async () => {
            const subjects = await api.getSubjects();
            
            const sorted = [...subjects].sort();
            expect(subjects).toEqual(sorted);
        });
    });

    describe('enrollInLesson', () => {
        it('should successfully enroll in a lesson', async () => {
            const result = await api.enrollInLesson('lesson-001');
            
            expect(result).toHaveProperty('success');
            expect(result).toHaveProperty('message');
            expect(result.success).toBe(true);
            expect(typeof result.message).toBe('string');
        });

        it('should fail to enroll in non-existent lesson', async () => {
            const result = await api.enrollInLesson('non-existent-id');
            
            expect(result.success).toBe(false);
            expect(result.message).toContain('non trovata');
        });

        it('should increment enrolledCount after successful enrollment', async () => {
            // Get initial lesson state
            const lessonBefore = await api.getLesson('lesson-001');
            const initialCount = lessonBefore.enrolledCount;
            
            // Enroll
            const result = await api.enrollInLesson('lesson-001');
            expect(result.success).toBe(true);
            
            // Check updated count
            const lessonAfter = await api.getLesson('lesson-001');
            expect(lessonAfter.enrolledCount).toBe(initialCount + 1);
        });
    });

    describe('configuration', () => {
        it('should use mock data by default', () => {
            const defaultApi = new LessonsAPI();
            expect(defaultApi.useMock).toBe(true);
        });

        it('should allow disabling mock data', () => {
            const realApi = new LessonsAPI({ useMock: false });
            expect(realApi.useMock).toBe(false);
        });

        it('should set custom base URL', () => {
            const customApi = new LessonsAPI({ baseURL: 'https://custom-api.com' });
            expect(customApi.baseURL).toBe('https://custom-api.com');
        });

        it('should use default base URL if not provided', () => {
            const defaultApi = new LessonsAPI();
            expect(defaultApi.baseURL).toBe('/api');
        });
    });
});
