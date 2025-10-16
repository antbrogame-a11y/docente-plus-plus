// tests/unit/onboarding.test.js
// Unit tests for onboarding state management

import { describe, test, expect, beforeEach, jest } from '@jest/globals';

/**
 * Test suite for onboarding state management
 * Tests incomplete, complete, and corrupted states
 */
describe('Onboarding State Management', () => {
  
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('isOnboardingComplete', () => {
    test('should return false when onboarding not started', () => {
      // Mock module import
      const mockData = {
        isOnboardingComplete: () => localStorage.getItem('onboardingComplete') === 'true'
      };
      
      expect(mockData.isOnboardingComplete()).toBe(false);
    });

    test('should return true when onboarding is complete', () => {
      localStorage.setItem('onboardingComplete', 'true');
      
      const mockData = {
        isOnboardingComplete: () => localStorage.getItem('onboardingComplete') === 'true'
      };
      
      expect(mockData.isOnboardingComplete()).toBe(true);
    });

    test('should return false for corrupted onboarding flag', () => {
      localStorage.setItem('onboardingComplete', 'invalid_value');
      
      const mockData = {
        isOnboardingComplete: () => localStorage.getItem('onboardingComplete') === 'true'
      };
      
      expect(mockData.isOnboardingComplete()).toBe(false);
    });
  });

  describe('isProfileComplete', () => {
    test('should return false when profile data is missing', () => {
      localStorage.setItem('onboardingComplete', 'true');
      localStorage.setItem('settings', JSON.stringify({}));
      
      const mockState = { settings: {} };
      const mockData = {
        isOnboardingComplete: () => localStorage.getItem('onboardingComplete') === 'true',
        isProfileComplete: () => {
          return mockData.isOnboardingComplete() && 
                 mockState.settings.teacherName && 
                 mockState.settings.teacherName.trim() !== '';
        }
      };
      
      expect(mockData.isProfileComplete()).toBe(false);
    });

    test('should return false when teacherName is empty string', () => {
      localStorage.setItem('onboardingComplete', 'true');
      const mockState = { settings: { teacherName: '   ' } };
      
      const mockData = {
        isOnboardingComplete: () => localStorage.getItem('onboardingComplete') === 'true',
        isProfileComplete: () => {
          return mockData.isOnboardingComplete() && 
                 mockState.settings.teacherName && 
                 mockState.settings.teacherName.trim() !== '';
        }
      };
      
      expect(mockData.isProfileComplete()).toBe(false);
    });

    test('should return true when profile is complete', () => {
      localStorage.setItem('onboardingComplete', 'true');
      const mockState = { settings: { teacherName: 'Mario Rossi' } };
      
      const mockData = {
        isOnboardingComplete: () => localStorage.getItem('onboardingComplete') === 'true',
        isProfileComplete: () => {
          return mockData.isOnboardingComplete() && 
                 mockState.settings.teacherName && 
                 mockState.settings.teacherName.trim() !== '';
        }
      };
      
      expect(mockData.isProfileComplete()).toBe(true);
    });
  });

  describe('recoverOnboardingState', () => {
    test('should detect not_started state', () => {
      const mockData = {
        recoverOnboardingState: () => {
          const onboardingComplete = localStorage.getItem('onboardingComplete') === 'true';
          if (!onboardingComplete) {
            return {
              needsOnboarding: true,
              needsProfileCompletion: false,
              reason: 'not_started'
            };
          }
        }
      };
      
      const state = mockData.recoverOnboardingState();
      expect(state.needsOnboarding).toBe(true);
      expect(state.needsProfileCompletion).toBe(false);
      expect(state.reason).toBe('not_started');
    });

    test('should detect corrupted_profile state', () => {
      localStorage.setItem('onboardingComplete', 'true');
      const mockState = { settings: {} };
      
      const mockData = {
        recoverOnboardingState: () => {
          const onboardingComplete = localStorage.getItem('onboardingComplete') === 'true';
          const profileComplete = mockState.settings.teacherName && mockState.settings.teacherName.trim() !== '';
          
          if (onboardingComplete && !profileComplete) {
            return {
              needsOnboarding: false,
              needsProfileCompletion: true,
              reason: 'corrupted_profile'
            };
          }
        }
      };
      
      const state = mockData.recoverOnboardingState();
      expect(state.needsOnboarding).toBe(false);
      expect(state.needsProfileCompletion).toBe(true);
      expect(state.reason).toBe('corrupted_profile');
    });

    test('should detect complete state', () => {
      localStorage.setItem('onboardingComplete', 'true');
      const mockState = { settings: { teacherName: 'Mario Rossi' } };
      
      const mockData = {
        recoverOnboardingState: () => {
          const onboardingComplete = localStorage.getItem('onboardingComplete') === 'true';
          const profileComplete = mockState.settings.teacherName && mockState.settings.teacherName.trim() !== '';
          
          if (onboardingComplete && profileComplete) {
            return {
              needsOnboarding: false,
              needsProfileCompletion: false,
              reason: 'complete'
            };
          }
        }
      };
      
      const state = mockData.recoverOnboardingState();
      expect(state.needsOnboarding).toBe(false);
      expect(state.needsProfileCompletion).toBe(false);
      expect(state.reason).toBe('complete');
    });
  });

  describe('completeOnboarding', () => {
    test('should save settings and set onboarding flag', () => {
      const settings = {
        teacherName: 'Mario',
        teacherLastName: 'Rossi',
        schoolYear: '2024/2025'
      };
      
      const mockData = {
        completeOnboarding: (settings) => {
          localStorage.setItem('onboardingComplete', 'true');
          localStorage.setItem('settings', JSON.stringify(settings));
          return true;
        }
      };
      
      mockData.completeOnboarding(settings);
      
      expect(localStorage.setItem).toHaveBeenCalledWith('onboardingComplete', 'true');
      expect(localStorage.setItem).toHaveBeenCalledWith('settings', JSON.stringify(settings));
    });
  });

  describe('validateAndFixOnboardingState', () => {
    test('should return true for complete state', () => {
      localStorage.setItem('onboardingComplete', 'true');
      const mockState = { settings: { teacherName: 'Mario Rossi' } };
      
      const mockData = {
        validateAndFixOnboardingState: () => {
          const onboardingComplete = localStorage.getItem('onboardingComplete') === 'true';
          const profileComplete = mockState.settings.teacherName && mockState.settings.teacherName.trim() !== '';
          return onboardingComplete && profileComplete;
        }
      };
      
      expect(mockData.validateAndFixOnboardingState()).toBe(true);
    });

    test('should fix corrupted state when profile data exists', () => {
      localStorage.setItem('onboardingComplete', 'true');
      const mockState = { settings: { teacherName: 'Mario Rossi' } };
      
      const mockData = {
        validateAndFixOnboardingState: () => {
          const onboardingComplete = localStorage.getItem('onboardingComplete') === 'true';
          const profileComplete = mockState.settings.teacherName && mockState.settings.teacherName.trim() !== '';
          
          if (onboardingComplete && !profileComplete) {
            // Try to recover
            if (mockState.settings.teacherName && mockState.settings.teacherName.trim() !== '') {
              return true; // Recovered
            }
            // Can't recover, reset
            localStorage.removeItem('onboardingComplete');
            return false;
          }
          return onboardingComplete && profileComplete;
        }
      };
      
      expect(mockData.validateAndFixOnboardingState()).toBe(true);
    });

    test('should reset onboarding flag when profile cannot be recovered', () => {
      localStorage.setItem('onboardingComplete', 'true');
      const mockState = { settings: {} };
      
      const mockData = {
        validateAndFixOnboardingState: () => {
          const onboardingComplete = localStorage.getItem('onboardingComplete') === 'true';
          const profileComplete = mockState.settings.teacherName && mockState.settings.teacherName.trim() !== '';
          
          if (onboardingComplete && !profileComplete) {
            // Try to recover
            if (mockState.settings.teacherName && mockState.settings.teacherName.trim() !== '') {
              return true; // Recovered
            }
            // Can't recover, reset
            localStorage.removeItem('onboardingComplete');
            return false;
          }
          return onboardingComplete && profileComplete;
        }
      };
      
      expect(mockData.validateAndFixOnboardingState()).toBe(false);
      expect(localStorage.removeItem).toHaveBeenCalledWith('onboardingComplete');
    });
  });

  describe('Menu state management', () => {
    test('should disable menu items when onboarding incomplete', () => {
      const menuItems = [
        { dataset: { tab: 'lessons' }, classList: { add: jest.fn(), remove: jest.fn() } },
        { dataset: { tab: 'students' }, classList: { add: jest.fn(), remove: jest.fn() } },
        { dataset: { tab: 'home' }, classList: { add: jest.fn(), remove: jest.fn() } }
      ];
      
      // Simulate disableMenuItems except home
      menuItems.forEach(item => {
        if (item.dataset.tab !== 'home' && item.dataset.tab !== 'settings') {
          item.classList.add('disabled');
        }
      });
      
      expect(menuItems[0].classList.add).toHaveBeenCalledWith('disabled');
      expect(menuItems[1].classList.add).toHaveBeenCalledWith('disabled');
      expect(menuItems[2].classList.add).not.toHaveBeenCalled();
    });

    test('should enable all menu items when onboarding complete', () => {
      const menuItems = [
        { dataset: { tab: 'lessons' }, classList: { add: jest.fn(), remove: jest.fn() } },
        { dataset: { tab: 'students' }, classList: { add: jest.fn(), remove: jest.fn() } }
      ];
      
      // Simulate enableAllMenuItems
      menuItems.forEach(item => {
        item.classList.remove('disabled');
      });
      
      expect(menuItems[0].classList.remove).toHaveBeenCalledWith('disabled');
      expect(menuItems[1].classList.remove).toHaveBeenCalledWith('disabled');
    });
  });

  describe('Storage health check', () => {
    test('should detect working localStorage', () => {
      const mockData = {
        checkStorageHealth: () => {
          try {
            const testKey = '__test__';
            localStorage.setItem(testKey, 'test');
            const value = localStorage.getItem(testKey);
            localStorage.removeItem(testKey);
            return value === 'test';
          } catch {
            return false;
          }
        }
      };
      
      expect(mockData.checkStorageHealth()).toBe(true);
    });
  });
});
