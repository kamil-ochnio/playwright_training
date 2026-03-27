import { test, expect } from '@playwright/test';

test('homepage loads via baseURL', async ({ page }) => {
  const response = await page.goto('/');
  expect(response && response.ok()).toBeTruthy();
  await expect(page.locator('body')).toBeVisible();
});
