import type { Locator, Page } from "@playwright/test";

export class TwoFactorVerifyPage {
  static readonly path = "/2fa/verify";
  readonly codeInput1: Locator;
  readonly codeInput2: Locator;
  readonly codeInput3: Locator;
  readonly codeInput4: Locator;
  readonly codeInput5: Locator;
  readonly codeInput6: Locator;
  readonly continueButton: Locator;

  constructor(private readonly page: Page) {
    this.codeInput1 = page.getByTestId("verificationCodeInput0");
    this.codeInput2 = page.getByTestId("verificationCodeInput1");
    this.codeInput3 = page.getByTestId("verificationCodeInput2");
    this.codeInput4 = page.getByTestId("verificationCodeInput3");
    this.codeInput5 = page.getByTestId("verificationCodeInput4");
    this.codeInput6 = page.getByTestId("verificationCodeInput5");
    this.continueButton = page.getByTestId("2faVerifyContinueButton");
  }

  async waitForRedirect(): Promise<void> {
    await this.page.waitForURL((url) => url.pathname === TwoFactorVerifyPage.path);
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

  async submit(): Promise<void> {
    await this.continueButton.click();
  }
}
