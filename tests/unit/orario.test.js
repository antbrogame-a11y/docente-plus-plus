/**
 * Tests for Orario (Schedule) Module
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import {
  normalizeTime,
  dayToColumnIndex,
  timeToRowIndex,
  calculateDuration,
  detectCollision
} from '../../src/pages/orario/orario.js';

describe('Orario Module', () => {
  describe('normalizeTime', () => {
    test('normalizes HH:MM format correctly', () => {
      expect(normalizeTime('08:00')).toBe('08:00');
      expect(normalizeTime('14:30')).toBe('14:30');
      expect(normalizeTime('09:05')).toBe('09:05');
    });

    test('normalizes H:MM format correctly', () => {
      expect(normalizeTime('8:00')).toBe('08:00');
      expect(normalizeTime('9:30')).toBe('09:30');
    });

    test('normalizes hour-only format correctly', () => {
      expect(normalizeTime('8')).toBe('08:00');
      expect(normalizeTime('14')).toBe('14:00');
      expect(normalizeTime('09')).toBe('09:00');
    });

    test('handles invalid input', () => {
      expect(normalizeTime('')).toBe('00:00');
      expect(normalizeTime(null)).toBe('00:00');
      expect(normalizeTime('invalid')).toBe('00:00');
      expect(normalizeTime('25:00')).toBe('00:00');
      expect(normalizeTime('12:70')).toBe('00:00');
    });

    test('trims whitespace', () => {
      expect(normalizeTime('  08:00  ')).toBe('08:00');
      expect(normalizeTime(' 9:30 ')).toBe('09:30');
    });
  });

  describe('dayToColumnIndex', () => {
    test('maps Italian weekdays correctly', () => {
      expect(dayToColumnIndex('Lunedì')).toBe(1);
      expect(dayToColumnIndex('Martedì')).toBe(2);
      expect(dayToColumnIndex('Mercoledì')).toBe(3);
      expect(dayToColumnIndex('Giovedì')).toBe(4);
      expect(dayToColumnIndex('Venerdì')).toBe(5);
      expect(dayToColumnIndex('Sabato')).toBe(6);
      expect(dayToColumnIndex('Domenica')).toBe(7);
    });

    test('maps English weekdays correctly', () => {
      expect(dayToColumnIndex('Monday')).toBe(1);
      expect(dayToColumnIndex('Tuesday')).toBe(2);
      expect(dayToColumnIndex('Wednesday')).toBe(3);
      expect(dayToColumnIndex('Thursday')).toBe(4);
      expect(dayToColumnIndex('Friday')).toBe(5);
      expect(dayToColumnIndex('Saturday')).toBe(6);
      expect(dayToColumnIndex('Sunday')).toBe(7);
    });

    test('maps abbreviated weekdays correctly', () => {
      expect(dayToColumnIndex('Lun')).toBe(1);
      expect(dayToColumnIndex('Mar')).toBe(2);
      expect(dayToColumnIndex('Mer')).toBe(3);
      expect(dayToColumnIndex('Mon')).toBe(1);
      expect(dayToColumnIndex('Tue')).toBe(2);
    });

    test('is case-insensitive', () => {
      expect(dayToColumnIndex('lunedì')).toBe(1);
      expect(dayToColumnIndex('LUNEDÌ')).toBe(1);
      expect(dayToColumnIndex('LuNeDì')).toBe(1);
      expect(dayToColumnIndex('monday')).toBe(1);
      expect(dayToColumnIndex('MONDAY')).toBe(1);
    });

    test('handles invalid input', () => {
      expect(dayToColumnIndex('')).toBe(0);
      expect(dayToColumnIndex(null)).toBe(0);
      expect(dayToColumnIndex('InvalidDay')).toBe(0);
    });

    test('trims whitespace', () => {
      expect(dayToColumnIndex('  Lunedì  ')).toBe(1);
      expect(dayToColumnIndex(' Monday ')).toBe(1);
    });
  });

  describe('timeToRowIndex', () => {
    test('calculates row index from default start time 08:00', () => {
      expect(timeToRowIndex('08:00')).toBe(1);
      expect(timeToRowIndex('09:00')).toBe(2);
      expect(timeToRowIndex('10:00')).toBe(3);
      expect(timeToRowIndex('11:00')).toBe(4);
      expect(timeToRowIndex('12:00')).toBe(5);
    });

    test('calculates row index from custom start time', () => {
      expect(timeToRowIndex('10:00', '09:00')).toBe(2);
      expect(timeToRowIndex('11:00', '09:00')).toBe(3);
      expect(timeToRowIndex('14:00', '12:00')).toBe(3);
    });

    test('handles time at start of day', () => {
      expect(timeToRowIndex('08:00', '08:00')).toBe(1);
      expect(timeToRowIndex('09:00', '09:00')).toBe(1);
    });

    test('handles non-hour times', () => {
      expect(timeToRowIndex('08:30', '08:00')).toBe(1);
      expect(timeToRowIndex('09:30', '08:00')).toBe(2);
      expect(timeToRowIndex('10:45', '08:00')).toBe(3);
    });

    test('minimum row index is 1', () => {
      expect(timeToRowIndex('07:00', '08:00')).toBe(1);
      expect(timeToRowIndex('06:00', '08:00')).toBe(1);
    });
  });

  describe('calculateDuration', () => {
    test('calculates duration for 1-hour slots', () => {
      expect(calculateDuration('08:00', '09:00')).toBe(1);
      expect(calculateDuration('14:00', '15:00')).toBe(1);
    });

    test('calculates duration for multi-hour slots', () => {
      expect(calculateDuration('08:00', '10:00')).toBe(2);
      expect(calculateDuration('09:00', '12:00')).toBe(3);
      expect(calculateDuration('10:00', '14:00')).toBe(4);
    });

    test('calculates duration for non-hour boundaries', () => {
      expect(calculateDuration('08:00', '09:30')).toBe(2); // Ceil to 2
      expect(calculateDuration('08:30', '10:00')).toBe(2);
      expect(calculateDuration('08:15', '10:45')).toBe(3); // Ceil to 3
    });

    test('handles same start and end time', () => {
      expect(calculateDuration('08:00', '08:00')).toBe(0);
    });
  });

  describe('detectCollision', () => {
    test('detects collision for overlapping times on same day', () => {
      const slot1 = { day: 'Lunedì', startTime: '08:00', endTime: '10:00' };
      const slot2 = { day: 'Lunedì', startTime: '09:00', endTime: '11:00' };
      expect(detectCollision(slot1, slot2)).toBe(true);
    });

    test('detects no collision for non-overlapping times on same day', () => {
      const slot1 = { day: 'Lunedì', startTime: '08:00', endTime: '09:00' };
      const slot2 = { day: 'Lunedì', startTime: '09:00', endTime: '10:00' };
      expect(detectCollision(slot1, slot2)).toBe(false);
    });

    test('detects no collision for different days', () => {
      const slot1 = { day: 'Lunedì', startTime: '08:00', endTime: '10:00' };
      const slot2 = { day: 'Martedì', startTime: '08:00', endTime: '10:00' };
      expect(detectCollision(slot1, slot2)).toBe(false);
    });

    test('detects collision when one slot contains another', () => {
      const slot1 = { day: 'Lunedì', startTime: '08:00', endTime: '12:00' };
      const slot2 = { day: 'Lunedì', startTime: '09:00', endTime: '10:00' };
      expect(detectCollision(slot1, slot2)).toBe(true);
    });

    test('detects collision when slots are identical', () => {
      const slot1 = { day: 'Lunedì', startTime: '08:00', endTime: '10:00' };
      const slot2 = { day: 'Lunedì', startTime: '08:00', endTime: '10:00' };
      expect(detectCollision(slot1, slot2)).toBe(true);
    });

    test('handles null or undefined slots', () => {
      const slot1 = { day: 'Lunedì', startTime: '08:00', endTime: '10:00' };
      expect(detectCollision(slot1, null)).toBe(false);
      expect(detectCollision(null, slot1)).toBe(false);
      expect(detectCollision(null, null)).toBe(false);
    });

    test('detects partial overlap at start', () => {
      const slot1 = { day: 'Lunedì', startTime: '08:00', endTime: '10:00' };
      const slot2 = { day: 'Lunedì', startTime: '07:00', endTime: '09:00' };
      expect(detectCollision(slot1, slot2)).toBe(true);
    });

    test('detects partial overlap at end', () => {
      const slot1 = { day: 'Lunedì', startTime: '08:00', endTime: '10:00' };
      const slot2 = { day: 'Lunedì', startTime: '09:00', endTime: '11:00' };
      expect(detectCollision(slot1, slot2)).toBe(true);
    });
  });
});
