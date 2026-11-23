import type { Locator, Page } from "@playwright/test";

import { step } from "../../../utils/step";
import { EMAIL_VERIFICATION_COMPLETE_HEADING } from "../locators/email-verification-complete.locators";
import { BasePage } from "./base.page";

export class EmailVerificationCompletePage extends BasePage {
  static readonly path = "/email-verification";

  readonly heading: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByText(EMAIL_VERIFICATION_COMPLETE_HEADING).first();
  }

  @step
  async goto(verificationUrl?: string): Promise<void> {
    if (!verificationUrl) {
      throw new Error("Email verification URL is required");
    }

    await this.page.goto(verificationUrl);
  }
}
