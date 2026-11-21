import type { Locator, Page } from "@playwright/test";

import { step } from "../../../utils/step";
import {
  EMAIL_INPUT_LOGIN,
  FORGOT_PASSWORD_LINK_LOGIN,
  HEADING_LOGIN,
  PASSWORD_INPUT_LOGIN,
  PROVIDER_SIGN_IN_LINK_LOGIN,
  REMEMBER_ME_CHECKBOX_LOGIN,
  SIGN_IN_BUTTON_LOGIN,
  SIGN_UP_LINK_LOGIN,
  SSO_SIGN_IN_LINK_LOGIN,
} from "../locators/login.sign.locators";
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
    this.heading = page.getByRole("heading", { name: HEADING_LOGIN, level: 1 });
    this.emailInput = page.getByTestId(EMAIL_INPUT_LOGIN);
    this.passwordInput = page.getByTestId(PASSWORD_INPUT_LOGIN);
    this.forgotPasswordLink = page.getByTestId(FORGOT_PASSWORD_LINK_LOGIN);
    this.rememberMeCheckbox = page.getByTestId(REMEMBER_ME_CHECKBOX_LOGIN);
    this.signInButton = page.getByTestId(SIGN_IN_BUTTON_LOGIN);
    this.ssoSignInLink = page.getByTestId(SSO_SIGN_IN_LINK_LOGIN);
    this.signUpLink = page.getByTestId(SIGN_UP_LINK_LOGIN);
    this.providerSignInLink = page.getByTestId(PROVIDER_SIGN_IN_LINK_LOGIN);
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
