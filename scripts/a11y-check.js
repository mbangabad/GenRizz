#!/usr/bin/env node
// Simple axe-core + Playwright a11y check against running dev server.
const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');

(async () => {
  const url = process.env.A11Y_URL || 'http://localhost:5174/Home';
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  const results = await new AxeBuilder({ page }).analyze();
  console.log(`A11y Violations for ${url}: ${results.violations.length}`);
  results.violations.slice(0, 20).forEach((v, idx) => {
    console.log(`${idx + 1}. [${v.id}] ${v.help}`);
    console.log('  Nodes:', v.nodes.map((n) => n.target.join(' ')).join(' | '));
  });
  await browser.close();
  if (results.violations.length) process.exitCode = 1;
})();
