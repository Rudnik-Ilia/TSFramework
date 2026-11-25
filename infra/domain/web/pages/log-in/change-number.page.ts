import type { Locator, Page } from "@playwright/test";

import { step } from "../../../../utils/step.util";
import { CHANGE_NUMBER_SKIP_ACTION, CHANGE_NUMBER_TITLE } from "../../locators/change-number.locators";
import { BasePage } from "../abstract/base.page.abs";

export class ChangeNumberPage extends BasePage {
  static readonly path = "/2fa/reminder/change-number";

  readonly title: Locator;
  private readonly skipAction: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.getByRole("heading", { name: CHANGE_NUMBER_TITLE, level: 2 });
    this.skipAction = page.getByText(CHANGE_NUMBER_SKIP_ACTION, { exact: true });
  }

  @step
  async goto(): Promise<void> {
    await this.page.goto(ChangeNumberPage.path);
  }

  @step
  async waitForRedirect(): Promise<void> {
    await this.page.waitForURL((url) => url.pathname === ChangeNumberPage.path);
  }

  @step
  async skipForNow(): Promise<void> {
    await this.skipAction.click();
  }
}
