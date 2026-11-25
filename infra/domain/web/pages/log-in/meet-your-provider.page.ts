import type { Locator, Page } from "@playwright/test";

import { Validate } from "../../../../core/validations/validate.validation";
import { step } from "../../../../utils/step.util";
import { BasePage } from "../abstract/base.page.abs";

export class MeetYourProviderPage extends BasePage {
  private static readonly route = /^\/room\/[^/]+\/onboarding\/meet-your-provider\/?$/;

  readonly title: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.getByText("We’re thrilled to introduce you to your provider", { exact: true });
    this.closeButton = page.getByTestId("therapistCardMainButtonPress");
  }

  @step
  async goto(): Promise<void> {
    throw new Error("NotImplemented");
  }

  @step
  async waitForRedirect(): Promise<void> {
    await this.page.waitForURL((url) => MeetYourProviderPage.route.test(url.pathname));
  }

  @step
  async expectTitleVisible(): Promise<void> {
    await Validate.visible(this.title);
  }

  @step
  async close(): Promise<void> {
    await this.closeButton.click();
  }
}
