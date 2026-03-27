import { type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class RegisterPage extends BasePage {
  protected readonly url = '/register.html';

  constructor(page: Page) {
    super(page);
  }

  get errorMessage() {
    return this.page.locator('#message');
  }

  async register(email: string, displayName: string, password: string): Promise<void> {
    await this.page.getByTestId('email-input').fill(email);
    await this.page.getByTestId('display-name-input').fill(displayName);
    await this.page.getByTestId('password-input').fill(password);
    await this.page.getByRole('button', { name: 'Create Account' }).click();
  }
}
