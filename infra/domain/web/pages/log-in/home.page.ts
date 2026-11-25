import type { Locator, Page } from "@playwright/test";

import { step } from "../../../../utils/step.util";
import { BasePage } from "../abstract/base.page.abs";

export class HomePage extends BasePage {
  static readonly path = "/home";

  readonly homeNavigation: Locator;

  constructor(page: Page) {
    super(page);
    this.homeNavigation = page.getByRole("button").filter({
      has: page.getByText("Home", { exact: true }),
    });
  }

  @step
  async goto(): Promise<void> {
    await this.page.goto(HomePage.path);
  }

  @step
  async waitForRedirect(): Promise<void> {
    await this.page.waitForURL((url) => url.pathname === HomePage.path && url.search === "");
  }
}
