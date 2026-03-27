import { test, expect } from '@playwright/test';
import { LoginPage } from './page-objects/login.page';

test.describe('@smoke', () => {
  test('Login Functionality - Successful Login with Demo Credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await expect(page).toHaveTitle('Login - Rolnopol');

    await loginPage.login('demo@example.com', 'demo123');

    try {
      await page.waitForURL('/profile.html', { timeout: 10000 });
      expect(page.url()).toBe('http://localhost:3000/profile.html');
    } catch {
      await page.waitForFunction(() => document.cookie.includes('rolnopolToken'), { timeout: 5000 });
      const hasToken = await page.evaluate(() => document.cookie.includes('rolnopolToken'));
      expect(hasToken).toBe(true);
    }
  });
});

test.describe('Login - negative scenarios', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('shows error notification for invalid credentials', async ({ page }) => {
    await loginPage.login('invalid@example.com', 'wrongpassword');

    await expect(page).toHaveURL('/login.html');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Invalid credentials');
  });

  test('does not submit when email is empty', async ({ page }) => {
    await loginPage.login('', 'somepassword');

    await expect(page).toHaveURL('/login.html');
  });

  test('does not submit when password is empty', async ({ page }) => {
    await loginPage.login('user@example.com', '');

    await expect(page).toHaveURL('/login.html');
  });
});