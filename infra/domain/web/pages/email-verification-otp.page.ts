import type { Locator, Page } from "@playwright/test";

import { step } from "../../../utils/step";
import {
  EMAIL_VERIFICATION_CODE_INPUT_PREFIX,
  EMAIL_VERIFICATION_CONTACT_SUPPORT_LINK,
  EMAIL_VERIFICATION_OTP_ENVELOPE_IMAGE,
  EMAIL_VERIFICATION_OTP_MESSAGE,
  EMAIL_VERIFICATION_OTP_TITLE,
  EMAIL_VERIFICATION_RESEND_CODE_BUTTON,
  EMAIL_VERIFICATION_UPDATE_EMAIL_BUTTON,
} from "../locators/email-verification-otp.locators";
import { BasePage } from "./base.page";

export class EmailVerificationOtpPage extends BasePage {
  static readonly path = "/email-verification/otp";
  static readonly codeLength = 6;

  readonly envelopeImage: Locator;
  readonly title: Locator;
  readonly sentCodeMessage: Locator;
  readonly verificationCodeInputs: readonly Locator[];
  readonly resendCodeButton: Locator;
  readonly updateEmailButton: Locator;
  readonly contactSupportLink: Locator;

  constructor(page: Page) {
    super(page);
    this.envelopeImage = page.getByRole("img", { name: EMAIL_VERIFICATION_OTP_ENVELOPE_IMAGE });
    this.title = page.getByText(EMAIL_VERIFICATION_OTP_TITLE, { exact: true });
    this.sentCodeMessage = page.getByText(EMAIL_VERIFICATION_OTP_MESSAGE, { exact: false });
    this.verificationCodeInputs = Array.from({ length: EmailVerificationOtpPage.codeLength }, (_, index) =>
      page.getByTestId(`${EMAIL_VERIFICATION_CODE_INPUT_PREFIX}${index}`),
    );
    this.resendCodeButton = page.getByTestId(EMAIL_VERIFICATION_RESEND_CODE_BUTTON);
    this.updateEmailButton = page.getByTestId(EMAIL_VERIFICATION_UPDATE_EMAIL_BUTTON);
    this.contactSupportLink = page.getByTestId(EMAIL_VERIFICATION_CONTACT_SUPPORT_LINK);
  }

  @step
  async goto(verificationUrl?: string): Promise<void> {
    await this.page.goto(verificationUrl ?? EmailVerificationOtpPage.path);
  }

  emailAddress(email: string): Locator {
    return this.sentCodeMessage.getByText(email, { exact: true });
  }

  @step
  async fillVerificationCode(code: string): Promise<void> {
    const digits = [...code];

    if (
      digits.length !== EmailVerificationOtpPage.codeLength ||
      digits.some((digit) => digit < "0" || digit > "9")
    ) {
      throw new Error(`Verification code must contain exactly ${EmailVerificationOtpPage.codeLength} digits`);
    }

    for (const [index, digit] of digits.entries()) {
      await this.verificationCodeInputs[index].fill(digit);
    }
  }

  @step
  async resendCode(): Promise<void> {
    await this.resendCodeButton.click();
  }

  @step
  async updateEmail(): Promise<void> {
    await this.updateEmailButton.click();
  }
}
