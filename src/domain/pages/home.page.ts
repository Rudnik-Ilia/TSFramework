import type { Page } from "@playwright/test";

import { BasePage } from "./base.page";
import { step } from "../../utils/step";

export class HomePage extends BasePage {
  static readonly path = "/";

  constructor(page: Page) {
    super(page);
  }

  @step
  async goto(): Promise<void> {
    await this.page.goto(HomePage.path);
  }
}
