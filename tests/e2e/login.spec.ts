import { test, expect } from '@playwright/test';

test.describe('Login Route', () => {
  test('should load login page directly', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL(/.*login/);
    await expect(page.locator('h1')).toContainText(/Welcome|Create Account/);
  });

  test('should navigate from authenticate button', async ({ page }) => {
    await page.goto('/');
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Look for authenticate button
    const authButton = page.locator('text=Authenticate').first();
    if (await authButton.isVisible()) {
      await authButton.click();
      await expect(page).toHaveURL(/.*login/);
    }
  });

  test('should display login form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});

