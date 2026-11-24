import type { Locator, Page } from "@playwright/test";

import { Validate } from "../../../../core/validations/validate.validation";
import { step } from "../../../../utils/step.util";
import { BasePage } from "../base.page";

export class MentalHealthIntakePage extends BasePage {
  private static readonly route = /^\/room\/[^/]+\/onboarding\/mental-health\/source\/onboarding\/?$/;

  readonly title: Locator;
  readonly startIntakeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.getByText(/^Let['’]s prepare for your first session$/);
    this.startIntakeButton = page.getByTestId("mentalIntakeWelcomeScreenPrimaryButton");
  }

  @step
  async goto(): Promise<void> {
    throw new Error("NotImplemented");
  }

  @step
  async waitForRedirect(): Promise<void> {
    await this.page.waitForURL((url) => MentalHealthIntakePage.route.test(url.pathname));
  }

  @step
  async expectTitleVisible(): Promise<void> {
    await Validate.visible(this.title);
  }

  @step
  async startIntake(): Promise<void> {
    await this.startIntakeButton.click();
  }
}
