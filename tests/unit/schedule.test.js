/**
 * @jest-environment jsdom
 */

import { describe, it, expect, beforeEach } from '@jest/globals';

describe('Personal Schedule System', () => {
    let mockState;
    let mockApp;

    beforeEach(() => {
        // Reset DOM
        document.body.innerHTML = '';
        
        // Mock state
        mockState = {
            schedule: {},
            classes: [
                { id: 'class1', name: '1A' },
                { id: 'class2', name: '2B' }
            ],
            students: [
                { id: 'student1', classId: 'class1', firstName: 'Mario', lastName: 'Rossi' },
                { id: 'student2', classId: 'class1', firstName: 'Giulia', lastName: 'Bianchi' }
            ],
            settings: {
                schedule: {
                    hoursPerDay: 6,
                    startTime: '08:00',
                    endTime: '14:00',
                    workingDays: [1, 2, 3, 4, 5]
                }
            }
        };

        // Mock app methods
        mockApp = {
            getDayName: (date) => {
                const days = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
                return days[date.getDay()];
            },
            getScheduleKey: (date, time) => {
                const dayName = mockApp.getDayName(date);
                return `${dayName}-${time}`;
            },
            getActivityTypeIcon: (type) => {
                const types = {
                    'T': { icon: 'T', label: 'Teoria', color: '#3498db' },
                    'D': { icon: 'D', label: 'Disegno', color: '#e67e22' },
                    'L': { icon: 'L', label: 'Laboratorio', color: '#27ae60' },
                    'ECiv': { icon: 'EC', label: 'Ed. Civica', color: '#9b59b6' },
                    'V': { icon: 'V', label: 'Verifica', color: '#e74c3c' },
                    'P': { icon: 'P', label: 'Pratica', color: '#f39c12' }
                };
                return types[type] || { icon: '?', label: 'N/A', color: '#999' };
            }
        };
    });

    describe('Schedule Key Format', () => {
        it('should generate correct schedule key format', () => {
            const monday = new Date('2024-10-21'); // A Monday
            const key = mockApp.getScheduleKey(monday, '08:00');
            
            expect(key).toBe('Lunedì-08:00');
        });

        it('should generate correct schedule key for different days', () => {
            const tuesday = new Date('2024-10-22');
            const wednesday = new Date('2024-10-23');
            
            expect(mockApp.getScheduleKey(tuesday, '10:00')).toBe('Martedì-10:00');
            expect(mockApp.getScheduleKey(wednesday, '14:00')).toBe('Mercoledì-14:00');
        });

        it('should use day names, not dates', () => {
            const monday1 = new Date('2024-10-21');
            const monday2 = new Date('2024-10-28'); // Different Monday
            
            const key1 = mockApp.getScheduleKey(monday1, '08:00');
            const key2 = mockApp.getScheduleKey(monday2, '08:00');
            
            // Both should generate the same key (recurring weekly)
            expect(key1).toBe(key2);
        });
    });

    describe('Schedule Data Structure', () => {
        it('should store schedule with day-time keys', () => {
            mockState.schedule['Lunedì-08:00'] = {
                classId: 'class1',
                subject: 'Matematica',
                activityType: 'T'
            };

            expect(mockState.schedule['Lunedì-08:00']).toBeDefined();
            expect(mockState.schedule['Lunedì-08:00'].classId).toBe('class1');
            expect(mockState.schedule['Lunedì-08:00'].activityType).toBe('T');
        });

        it('should support all activity types', () => {
            const activityTypes = ['T', 'D', 'L', 'ECiv', 'V', 'P'];
            
            activityTypes.forEach((type, index) => {
                const key = `Lunedì-0${8 + index}:00`;
                mockState.schedule[key] = {
                    classId: 'class1',
                    subject: 'Test',
                    activityType: type
                };
            });

            expect(Object.keys(mockState.schedule).length).toBe(6);
        });

        it('should allow optional notes field', () => {
            mockState.schedule['Martedì-10:00'] = {
                classId: 'class1',
                subject: 'Storia',
                activityType: 'L',
                notes: 'Lezione sul Rinascimento'
            };

            expect(mockState.schedule['Martedì-10:00'].notes).toBe('Lezione sul Rinascimento');
        });
    });

    describe('Activity Types', () => {
        it('should have correct activity type definitions', () => {
            const typeT = mockApp.getActivityTypeIcon('T');
            expect(typeT.label).toBe('Teoria');
            expect(typeT.icon).toBe('T');

            const typeECiv = mockApp.getActivityTypeIcon('ECiv');
            expect(typeECiv.label).toBe('Ed. Civica');
            expect(typeECiv.icon).toBe('EC');
        });

        it('should return default for unknown type', () => {
            const unknown = mockApp.getActivityTypeIcon('UNKNOWN');
            expect(unknown.label).toBe('N/A');
            expect(unknown.icon).toBe('?');
        });
    });

    describe('Schedule Validation', () => {
        it('should require both classId and activityType for complete slot', () => {
            const completeSlot = {
                classId: 'class1',
                subject: 'Matematica',
                activityType: 'T'
            };

            const incompleteSlot1 = {
                classId: 'class1',
                subject: 'Matematica'
                // Missing activityType
            };

            const incompleteSlot2 = {
                subject: 'Matematica',
                activityType: 'T'
                // Missing classId
            };

            expect(!!(completeSlot.classId && completeSlot.activityType)).toBe(true);
            expect(!!(incompleteSlot1.classId && incompleteSlot1.activityType)).toBe(false);
            expect(!!(incompleteSlot2.classId && incompleteSlot2.activityType)).toBe(false);
        });
    });

    describe('Today\'s Schedule', () => {
        it('should filter schedule by current day name', () => {
            mockState.schedule = {
                'Lunedì-08:00': { classId: 'class1', activityType: 'T' },
                'Lunedì-10:00': { classId: 'class2', activityType: 'D' },
                'Martedì-08:00': { classId: 'class1', activityType: 'L' },
                'Mercoledì-08:00': { classId: 'class1', activityType: 'V' }
            };

            const monday = new Date('2024-10-21'); // A Monday
            const dayName = mockApp.getDayName(monday);
            
            const todaySlots = Object.entries(mockState.schedule)
                .filter(([key]) => key.startsWith(dayName));

            expect(todaySlots.length).toBe(2);
            expect(todaySlots[0][0]).toContain('Lunedì');
        });
    });

    describe('Weekly Recurring Schedule', () => {
        it('should work for any week of the year', () => {
            mockState.schedule['Venerdì-14:00'] = {
                classId: 'class1',
                subject: 'Fisica',
                activityType: 'L'
            };

            // Different Fridays
            const friday1 = new Date('2024-10-25');
            const friday2 = new Date('2024-11-01');
            const friday3 = new Date('2024-12-06');

            const key1 = mockApp.getScheduleKey(friday1, '14:00');
            const key2 = mockApp.getScheduleKey(friday2, '14:00');
            const key3 = mockApp.getScheduleKey(friday3, '14:00');

            // All should produce the same key
            expect(key1).toBe('Venerdì-14:00');
            expect(key2).toBe('Venerdì-14:00');
            expect(key3).toBe('Venerdì-14:00');

            // All should access the same slot
            expect(mockState.schedule[key1]).toBe(mockState.schedule[key2]);
            expect(mockState.schedule[key2]).toBe(mockState.schedule[key3]);
        });
    });

    describe('Schedule Settings', () => {
        it('should have default schedule settings', () => {
            expect(mockState.settings.schedule.hoursPerDay).toBe(6);
            expect(mockState.settings.schedule.startTime).toBe('08:00');
            expect(mockState.settings.schedule.workingDays).toEqual([1, 2, 3, 4, 5]);
        });

        it('should support custom working days', () => {
            mockState.settings.schedule.workingDays = [1, 2, 3]; // Mon-Wed only
            expect(mockState.settings.schedule.workingDays.length).toBe(3);
            expect(mockState.settings.schedule.workingDays).toContain(1); // Monday
            expect(mockState.settings.schedule.workingDays).not.toContain(4); // Thursday
        });
    });
});

describe('In-Class Interface', () => {
    it('should require classId and activityType to enter classroom', () => {
        const validSlot = {
            classId: 'class1',
            subject: 'Matematica',
            activityType: 'T'
        };

        const invalidSlot1 = {
            classId: 'class1',
            subject: 'Matematica'
        };

        const invalidSlot2 = {
            subject: 'Matematica',
            activityType: 'T'
        };

        const canEnter = (slot) => {
            return !!(slot && slot.classId && slot.activityType);
        };

        expect(canEnter(validSlot)).toBe(true);
        expect(canEnter(invalidSlot1)).toBe(false);
        expect(canEnter(invalidSlot2)).toBe(false);
    });

    it('should parse schedule key correctly for display', () => {
        const scheduleKey = 'Mercoledì-10:00';
        const [dayName, time] = scheduleKey.split('-');

        expect(dayName).toBe('Mercoledì');
        expect(time).toBe('10:00');
    });
});
