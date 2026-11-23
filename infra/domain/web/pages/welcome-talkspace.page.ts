import type { Locator, Page } from "@playwright/test";

import { Validate } from "../../../core/validations/validate";
import { BasePage } from "./base.page";
import { MAIL_VERIFYED, WELCOME_MESSAGE } from "../locators/welcome-talkspace.locators";

export class WelcomeTalkspace extends BasePage {
  readonly successAlert: Locator;
  readonly welcomeMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.successAlert = page.getByRole("alert");
    this.welcomeMessage = page.getByText(WELCOME_MESSAGE, { exact: true });
  }

  async goto(verificationLink?: string): Promise<void> {
    if (!verificationLink) {
      throw new Error("Email verification link is required");
    }

    await this.page.goto(verificationLink);
  }

  async verifySucces(): Promise<void> {
    await Validate.visible(this.welcomeMessage);
    await Validate.containText(this.successAlert, MAIL_VERIFYED);
  }
}
