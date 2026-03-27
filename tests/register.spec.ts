import { test, expect } from '@playwright/test';
import { RegisterPage } from './page-objects/register.page';

test('Successful registration redirects to login page', async ({ page }) => {
  const registerPage = new RegisterPage(page);

  await registerPage.goto();
  await expect(page).toHaveTitle('Register - Rolnopol');

  const uniqueEmail = `user_${Date.now()}@example.com`;

  await registerPage.register(uniqueEmail, 'Test User', 'Test1234');

  await expect(page).toHaveURL('/login.html');
  await expect(page).toHaveTitle('Login - Rolnopol');
});

test.describe('Registration - negative scenarios', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  test('does not submit when email field is empty', async ({ page }) => {
    await registerPage.register('', 'Test User', 'Test1234');

    await expect(page).toHaveURL('/register.html');
  });

  test('shows inline validation error for invalid email format', async ({ page }) => {
    await registerPage.register('not-an-email', 'Test User', 'Test1234');

    await expect(page).toHaveURL('/register.html');
    await expect(page.getByRole('alert').first()).toBeVisible();
  });

  test('does not submit when password is too short', async ({ page }) => {
    const uniqueEmail = `user_${Date.now()}@example.com`;
    await registerPage.register(uniqueEmail, 'Test User', 'ab');

    await expect(page).toHaveURL('/register.html');
  });
});
