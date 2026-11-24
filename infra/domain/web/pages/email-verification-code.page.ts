import type { Locator, Page } from "@playwright/test";

import { step } from "../../../utils/step.util";
import {
  EMAIL_VERIFICATION_CONTACT_SUPPORT_LINK,
  EMAIL_VERIFICATION_OTP_ENVELOPE_IMAGE,
  EMAIL_VERIFICATION_OTP_MESSAGE,
  EMAIL_VERIFICATION_OTP_TITLE,
  EMAIL_VERIFICATION_RESEND_CODE_BUTTON,
  EMAIL_VERIFICATION_UPDATE_EMAIL_BUTTON,
} from "../locators/email-verification-otp.locators";
import { BasePage } from "./base.page";

export class EmailVerificationCodePage extends BasePage {
  static readonly path = "/email-verification/otp";
  static readonly codeLength = 6;

  readonly envelopeImage: Locator;
  readonly title: Locator;
  readonly sentCodeMessage: Locator;
  readonly codeInput1: Locator;
  readonly codeInput2: Locator;
  readonly codeInput3: Locator;
  readonly codeInput4: Locator;
  readonly codeInput5: Locator;
  readonly codeInput6: Locator;
  readonly otpError: Locator;
  readonly resendCodeButton: Locator;
  readonly updateEmailButton: Locator;
  readonly contactSupportLink: Locator;

  constructor(page: Page) {
    super(page);
    this.envelopeImage = page.getByRole("img", { name: EMAIL_VERIFICATION_OTP_ENVELOPE_IMAGE });
    this.title = page.getByText(EMAIL_VERIFICATION_OTP_TITLE, { exact: true });
    this.sentCodeMessage = page.getByText(EMAIL_VERIFICATION_OTP_MESSAGE, { exact: false });
    this.codeInput1 = page.getByTestId("verificationCodeInput0");
    this.codeInput2 = page.getByTestId("verificationCodeInput1");
    this.codeInput3 = page.getByTestId("verificationCodeInput2");
    this.codeInput4 = page.getByTestId("verificationCodeInput3");
    this.codeInput5 = page.getByTestId("verificationCodeInput4");
    this.codeInput6 = page.getByTestId("verificationCodeInput5");
    this.otpError = page.getByText("Error validating OTP", { exact: true });
    this.resendCodeButton = page.getByTestId(EMAIL_VERIFICATION_RESEND_CODE_BUTTON);
    this.updateEmailButton = page.getByTestId(EMAIL_VERIFICATION_UPDATE_EMAIL_BUTTON);
    this.contactSupportLink = page.getByTestId(EMAIL_VERIFICATION_CONTACT_SUPPORT_LINK);
  }

  @step
  async goto(verificationUrl?: string): Promise<void> {
    await this.page.goto(verificationUrl ?? EmailVerificationCodePage.path);
  }

  emailAddress(email: string): Locator {
    return this.sentCodeMessage.getByText(email, { exact: true });
  }

  async waitForRedirect(): Promise<void> {
    await this.page.waitForURL((url) => url.pathname === EmailVerificationCodePage.path);
  }

  async fillCodeInput1(digit: string): Promise<void> {
    await this.codeInput1.fill(digit);
  }

  async fillCodeInput2(digit: string): Promise<void> {
    await this.codeInput2.fill(digit);
  }

  async fillCodeInput3(digit: string): Promise<void> {
    await this.codeInput3.fill(digit);
  }

  async fillCodeInput4(digit: string): Promise<void> {
    await this.codeInput4.fill(digit);
  }

  async fillCodeInput5(digit: string): Promise<void> {
    await this.codeInput5.fill(digit);
  }

  async fillCodeInput6(digit: string): Promise<void> {
    await this.codeInput6.fill(digit);
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
