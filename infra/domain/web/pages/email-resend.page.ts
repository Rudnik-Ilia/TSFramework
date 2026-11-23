import type { Locator, Page } from "@playwright/test";

import { step } from "../../../utils/step.util";
import {
  EMAIL_VERIFICATION_CONTACT_SUPPORT_LINK,
  EMAIL_VERIFICATION_ENVELOPE_IMAGE,
  EMAIL_VERIFICATION_SENT_MESSAGE,
  EMAIL_VERIFICATION_SENT_TITLE,
} from "../locators/email-resend.locators";
import { BasePage } from "./base.page";

export class EmailResendPage extends BasePage {
  static readonly path = "/email-verification/sent";

  static pathForEmail(email: string): string {
    return `${EmailResendPage.path}#email=${encodeURIComponent(email)}`;
  }

  readonly envelopeImage: Locator;
  readonly title: Locator;
  readonly sentEmailMessage: Locator;
  readonly resendEmailButton: Locator;
  readonly contactSupportLink: Locator;

  constructor(page: Page) {
    super(page);
    this.envelopeImage = page.getByRole("img", { name: EMAIL_VERIFICATION_ENVELOPE_IMAGE });
    this.title = page.getByText(EMAIL_VERIFICATION_SENT_TITLE, { exact: true });
    this.sentEmailMessage = page.getByText(EMAIL_VERIFICATION_SENT_MESSAGE, { exact: false });
    this.resendEmailButton = page.getByRole("button");
    this.contactSupportLink = page.getByRole("link", { name: EMAIL_VERIFICATION_CONTACT_SUPPORT_LINK, exact: true });
  }

  @step
  async goto(email?: string): Promise<void> {
    const path = email ? EmailResendPage.pathForEmail(email) : EmailResendPage.path;
    await this.page.goto(path);
  }

  getEmailAddress(email: string): Locator {
    return this.sentEmailMessage.getByText(email, { exact: true });
  }

  @step
  async resendEmail(): Promise<void> {
    await this.resendEmailButton.click();
  }
}
