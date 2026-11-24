import type { Page } from "@playwright/test";

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  abstract goto(): Promise<void>;

  async pause(): Promise<void> {
    await this.page.pause();
  }
}
