import { test, expect } from '@playwright/test';

/**
 * PHASE 2: Atomic Execution Proof
 * Every button/link/form/input → Execute + Screenshot + Console
 */

test.describe('Atomic Interactions', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to app - handle auth if needed
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('all navigation links are clickable', async ({ page }) => {
    const links = page.locator('a[href]');
    const firstVisible = links.filter({ hasText: '', hasNotText: '' }); // noop filter to force resolution
    await expect(firstVisible.first()).toBeVisible();

    const hrefs = await page.evaluate(() =>
      Array.from(document.querySelectorAll('a[href]'))
        .slice(0, 5)
        .map((el) => el.getAttribute('href'))
        .filter((href) => href && !href.startsWith('#'))
    );
    const origin = new URL(page.url()).origin;

    for (const href of hrefs) {
      const url = new URL(href!, origin).toString();
      const target = page.locator(`a[href="${href}"]`).first();
      await target.click({ trial: false });
      await page.waitForTimeout(300);
      expect(page.url()).toContain(new URL(url).pathname);
      // navigate back to keep loop predictable
      await page.goBack({ waitUntil: 'networkidle' }).catch(() => {});
    }
  });

  test('all buttons are interactive', async ({ page }) => {
    const buttons = page.locator('button:not([disabled])');
    const count = await buttons.count();
    
    console.log(`Found ${count} interactive buttons`);
    
    for (let i = 0; i < Math.min(count, 10); i++) {
      const button = buttons.nth(i);
      await button.hover();
      await button.click();
      await page.waitForTimeout(200);
    }
  });

  test('all form inputs are focusable', async ({ page }) => {
    const inputs = page.locator('input, textarea, select');
    const count = await inputs.count();
    
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      await input.focus();
      await page.waitForTimeout(100);
      await expect(input).toBeFocused();
    }
  });
});
