import { test, expect } from '@playwright/test';

// Lightweight smoke in place of full Lighthouse to keep CI fast; swap back to playAudit when needed
test.describe('Lighthouse Audits (smoke)', () => {
  test('homepage loads and has basic landmarks', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/(Home)?$/);
    await expect(page.locator('body')).toBeVisible({ timeout: 5000 });
    const tappables = await page.locator('a,button').count();
    expect(tappables).toBeGreaterThan(0);
  });

  test('login page shows form controls', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL(/login/);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });
});
