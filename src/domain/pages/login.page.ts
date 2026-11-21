import type { Locator, Page } from "@playwright/test";

import { step } from "../../utils/step";
import { BasePage } from "./base.page";

export class LoginPage extends BasePage {
  static readonly mainAuthPath = "/";
  static readonly path = "/login";

  readonly heading: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly forgotPasswordLink: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly signInButton: Locator;
  readonly ssoSignInLink: Locator;
  readonly signUpLink: Locator;
  readonly providerSignInLink: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole("heading", { name: "Log in to your account", level: 1 });
    this.emailInput = page.getByTestId("emailInput");
    this.passwordInput = page.getByTestId("loginPasswordInput");
    this.forgotPasswordLink = page.getByTestId("forgotPasswordLink");
    this.rememberMeCheckbox = page.getByTestId("rememberMeCheckbox");
    this.signInButton = page.getByTestId("signInButton");
    this.ssoSignInLink = page.getByTestId("ssoSignInLink");
    this.signUpLink = page.getByTestId("signUpLink");
    this.providerSignInLink = page.getByTestId("providerSignInLink");
  }

  @step
  async goto(): Promise<void> {
    await this.page.goto(LoginPage.path);
  }

  @step
  async gotoMainAuth(): Promise<void> {
    await this.page.goto(LoginPage.mainAuthPath);
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async fillCredentials(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
  }

  async toggleRememberMe(): Promise<void> {
    await this.rememberMeCheckbox.click();
  }

  async submit(): Promise<void> {
    await this.signInButton.click();
  }
}
