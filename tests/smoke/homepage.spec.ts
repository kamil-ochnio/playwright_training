import { test, expect } from '@playwright/test';

test.describe('Smoke: Homepage', () => {
  test('root responds and page renders', async ({ page }) => {
    const response = await page.goto('/');
    expect(response && response.ok()).toBeTruthy();
    await expect(page.locator('body')).toBeVisible();
  });
});
