import { type Page } from '@playwright/test';

export abstract class BasePage {
  protected abstract readonly url: string;

  constructor(protected readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto(this.url);
  }
}
