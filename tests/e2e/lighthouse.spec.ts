import { test, expect } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';
import { chromium } from '@playwright/test';

/**
 * PHASE 1 & 7: Lighthouse Audits
 * Performance 100 + Accessibility 100 + Best Practices 100 + SEO 95
 */

test.describe('Lighthouse Audits', () => {
  test('homepage meets all performance targets', async () => {
    const browser = await chromium.launch({
      args: ['--remote-debugging-port=9222'],
    });
    
    const page = await browser.newPage();
    await page.goto('/');

    await playAudit({
      page,
      thresholds: {
        performance: 100,
        accessibility: 100,
        'best-practices': 100,
        seo: 95,
      },
      port: 9222,
    });

    await browser.close();
  });

  test('login page accessibility', async () => {
    const browser = await chromium.launch({
      args: ['--remote-debugging-port=9223'],
    });
    
    const page = await browser.newPage();
    await page.goto('/login');

    await playAudit({
      page,
      thresholds: {
        accessibility: 100,
      },
      port: 9223,
    });

    await browser.close();
  });
});

