import { type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  protected readonly url = '/login.html';

  constructor(page: Page) {
    super(page);
  }

  get errorMessage() {
    return this.page.getByRole('alert');
  }

  async login(email: string, password: string): Promise<void> {
    await this.page.fill('input[name="email"]', email);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('button[type="submit"]');
  }
}
