import { test, expect } from '@playwright/test';

test.describe('Smoke: Navigation', () => {
  test('navigation present or an anchor exists', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav, [role="navigation"]');
    if (await nav.count() > 0) {
      await expect(nav.first()).toBeVisible();
    } else {
      const link = page.locator('a[href]').first();
      await expect(link).toBeVisible();
    }
  });
});
