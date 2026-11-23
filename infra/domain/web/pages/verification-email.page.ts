import type { Locator, Page } from "@playwright/test";

import { step } from "../../../utils/step";
import { VERIFY_EMAIL_LINK } from "../locators/verification-email.locators";
import { BasePage } from "./base.page";
import { EmailVerificationCompletePage } from "./email-verification-complete.page";

export class VerificationEmailPage extends BasePage {
  readonly verifyEmailLink: Locator;

  constructor(page: Page) {
    super(page);
    this.verifyEmailLink = page.getByRole("link", { name: VERIFY_EMAIL_LINK, exact: true });
  }

  @step
  async goto(previewUrl?: string): Promise<void> {
    if (!previewUrl) {
      throw new Error("Email preview URL is required");
    }

    await this.page.goto(previewUrl, { waitUntil: "domcontentloaded" });
  }

  @step
  async clickVerifyEmail(): Promise<EmailVerificationCompletePage> {
    await this.verifyEmailLink.evaluate((link) => {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });

    const verificationPagePromise = this.page.context().waitForEvent("page");
    await this.verifyEmailLink.click();
    const verificationPage = await verificationPagePromise;
    await verificationPage.waitForLoadState("domcontentloaded");

    return new EmailVerificationCompletePage(verificationPage);
  }
}
