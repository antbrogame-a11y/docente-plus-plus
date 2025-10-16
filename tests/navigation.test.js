/**
 * Navigation Tests for Docente++
 * Tests breadcrumbs, back button, keyboard navigation, and browser history
 */

const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://localhost:8000';

test.describe('Navigation System', () => {
    test.beforeEach(async ({ page }) => {
        // Clear localStorage to start fresh
        await page.goto(BASE_URL);
        await page.evaluate(() => localStorage.clear());
        await page.reload();
    });

    test('should show onboarding modal on first visit', async ({ page }) => {
        await page.goto(BASE_URL);
        
        // Check that onboarding modal is visible
        const modal = page.locator('#onboarding-modal');
        await expect(modal).toBeVisible();
        
        // Check that menu items are disabled
        const disabledItems = page.locator('.nav-item.disabled');
        const count = await disabledItems.count();
        expect(count).toBeGreaterThan(0);
    });

    test('should complete onboarding and enable menu', async ({ page }) => {
        await page.goto(BASE_URL);
        
        // Fill onboarding form
        await page.fill('#onboarding-first-name', 'Test');
        await page.fill('#onboarding-last-name', 'User');
        await page.fill('#onboarding-school-year', '2024/2025');
        
        // Submit form
        await page.click('button[type="submit"]');
        
        // Wait for modal to close
        await page.waitForSelector('#onboarding-modal', { state: 'hidden' });
        
        // Check that menu items are now enabled
        const disabledItems = page.locator('.nav-item.disabled');
        const count = await disabledItems.count();
        expect(count).toBe(0);
    });

    test('should show Home button in header', async ({ page }) => {
        // Complete onboarding first
        await page.goto(BASE_URL);
        await page.fill('#onboarding-first-name', 'Test');
        await page.click('button[type="submit"]');
        await page.waitForSelector('#onboarding-modal', { state: 'hidden' });
        
        // Check that Home button exists and is visible
        const homeButton = page.locator('#home-button');
        await expect(homeButton).toBeVisible();
        await expect(homeButton).toHaveAttribute('aria-label', 'Vai alla Home');
    });

    test('should display breadcrumbs', async ({ page }) => {
        // Complete onboarding
        await page.goto(BASE_URL);
        await page.fill('#onboarding-first-name', 'Test');
        await page.click('button[type="submit"]');
        await page.waitForSelector('#onboarding-modal', { state: 'hidden' });
        
        // Check breadcrumb navigation exists
        const breadcrumb = page.locator('#breadcrumb-nav');
        await expect(breadcrumb).toBeVisible();
        await expect(breadcrumb).toHaveAttribute('aria-label', 'Breadcrumb');
        
        // Check initial breadcrumb shows Home
        const breadcrumbText = await page.locator('.breadcrumb-list').textContent();
        expect(breadcrumbText).toContain('Home');
    });

    test('should update breadcrumbs when navigating', async ({ page }) => {
        // Complete onboarding
        await page.goto(BASE_URL);
        await page.fill('#onboarding-first-name', 'Test');
        await page.click('button[type="submit"]');
        await page.waitForSelector('#onboarding-modal', { state: 'hidden' });
        
        // Navigate to Students
        await page.click('button[data-tab="students"]');
        
        // Check breadcrumb updated
        const breadcrumbText = await page.locator('.breadcrumb-list').textContent();
        expect(breadcrumbText).toContain('Home');
        expect(breadcrumbText).toContain('Studenti');
        
        // Check URL updated
        expect(page.url()).toContain('tab=students');
    });

    test('should navigate back using breadcrumb link', async ({ page }) => {
        // Complete onboarding
        await page.goto(BASE_URL);
        await page.fill('#onboarding-first-name', 'Test');
        await page.click('button[type="submit"]');
        await page.waitForSelector('#onboarding-modal', { state: 'hidden' });
        
        // Navigate to Students
        await page.click('button[data-tab="students"]');
        await page.waitForURL(/tab=students/);
        
        // Click Home in breadcrumb
        await page.click('.breadcrumb-link');
        
        // Check we're back at home
        await page.waitForURL(/tab=home/);
        const activeTab = page.locator('#home.tab-content.active');
        await expect(activeTab).toBeVisible();
    });

    test('should navigate back using keyboard shortcut Alt+Left', async ({ page }) => {
        // Complete onboarding
        await page.goto(BASE_URL);
        await page.fill('#onboarding-first-name', 'Test');
        await page.click('button[type="submit"]');
        await page.waitForSelector('#onboarding-modal', { state: 'hidden' });
        
        // Navigate to Students
        await page.click('button[data-tab="students"]');
        await page.waitForURL(/tab=students/);
        
        // Press Alt+Left
        await page.keyboard.press('Alt+ArrowLeft');
        
        // Check we're back at home
        await page.waitForURL(/tab=home/);
    });

    test('should navigate home using header button', async ({ page }) => {
        // Complete onboarding
        await page.goto(BASE_URL);
        await page.fill('#onboarding-first-name', 'Test');
        await page.click('button[type="submit"]');
        await page.waitForSelector('#onboarding-modal', { state: 'hidden' });
        
        // Navigate to Students
        await page.click('button[data-tab="students"]');
        await page.waitForURL(/tab=students/);
        
        // Click Home button in header
        await page.click('#home-button');
        
        // Check we're at home
        await page.waitForURL(/tab=home/);
    });

    test('should support browser back button', async ({ page }) => {
        // Complete onboarding
        await page.goto(BASE_URL);
        await page.fill('#onboarding-first-name', 'Test');
        await page.click('button[type="submit"]');
        await page.waitForSelector('#onboarding-modal', { state: 'hidden' });
        
        // Navigate to Students
        await page.click('button[data-tab="students"]');
        await page.waitForURL(/tab=students/);
        
        // Use browser back button
        await page.goBack();
        
        // Check we're back at home
        await page.waitForURL(/tab=home/);
    });

    test('should navigate to specific tab from URL', async ({ page }) => {
        // Complete onboarding
        await page.goto(BASE_URL);
        await page.fill('#onboarding-first-name', 'Test');
        await page.click('button[type="submit"]');
        await page.waitForSelector('#onboarding-modal', { state: 'hidden' });
        
        // Navigate directly to students via URL
        await page.goto(`${BASE_URL}/?tab=classes`);
        
        // Check we're on classes tab
        const activeTab = page.locator('#classes.tab-content.active');
        await expect(activeTab).toBeVisible();
        
        // Check breadcrumb updated
        const breadcrumbText = await page.locator('.breadcrumb-list').textContent();
        expect(breadcrumbText).toContain('Classi');
    });

    test('should handle keyboard navigation in menu', async ({ page }) => {
        // Complete onboarding
        await page.goto(BASE_URL);
        await page.fill('#onboarding-first-name', 'Test');
        await page.click('button[type="submit"]');
        await page.waitForSelector('#onboarding-modal', { state: 'hidden' });
        
        // Focus on first nav item
        const firstNavItem = page.locator('.nav-item').first();
        await firstNavItem.focus();
        
        // Press ArrowDown to navigate
        await page.keyboard.press('ArrowDown');
        
        // Check focus moved
        const focusedElement = await page.evaluate(() => document.activeElement.className);
        expect(focusedElement).toContain('nav-item');
    });

    test('should show disabled menu items with lock icon when profile incomplete', async ({ page }) => {
        // Set incomplete profile state
        await page.goto(BASE_URL);
        await page.evaluate(() => {
            localStorage.setItem('onboardingComplete', 'true');
            // Don't set teacherName - this simulates corrupted data
        });
        await page.reload();
        
        // Check that menu items are disabled
        const disabledItems = page.locator('.nav-item.disabled');
        const count = await disabledItems.count();
        expect(count).toBeGreaterThan(0);
        
        // Check that lock icon is shown
        const navText = await page.locator('.nav-item.disabled').first().textContent();
        expect(navText).toContain('🔒');
    });

    test('should show onboarding banner when profile incomplete', async ({ page }) => {
        // Set incomplete profile state
        await page.goto(BASE_URL);
        await page.evaluate(() => {
            localStorage.setItem('onboardingComplete', 'true');
        });
        await page.reload();
        
        // Check that banner is visible
        const banner = page.locator('#onboarding-incomplete-banner');
        await expect(banner).toBeVisible();
        
        // Check banner content
        const bannerText = await banner.textContent();
        expect(bannerText).toContain('Configurazione incompleta');
    });
});
