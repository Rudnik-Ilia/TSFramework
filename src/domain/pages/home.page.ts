import type { Page } from "@playwright/test";

import { BasePage } from "./base.page";

export class HomePage extends BasePage {
  static readonly path = "/";

  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.page.goto(HomePage.path);
  }
}
