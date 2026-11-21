import type { Locator, Page } from "@playwright/test";

import { step } from "../../utils/step";
import { BasePage } from "./base.page";

export class SignupPage extends BasePage {
  static readonly path = "/signup";
  static readonly formPath = `${SignupPage.path}?force=1`;

  readonly heading: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly showPasswordButton: Locator;
  readonly nicknameInput: Locator;
  readonly countryDropdown: Locator;
  readonly countryDropdownInput: Locator;
  readonly stateDropdown: Locator;
  readonly stateDropdownInput: Locator;
  readonly createAccountButton: Locator;
  readonly telemedicineLink: Locator;
  readonly cancellationPolicyLink: Locator;
  readonly termsOfUseLink: Locator;
  readonly privacyPolicyLink: Locator;
  readonly statePrivacyRightsLink: Locator;
  readonly loginLink: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole("heading", { name: "Create your account", level: 1 });
    this.emailInput = page.getByTestId("emailInput");
    this.passwordInput = page.getByTestId("createAccountPasswordInput");
    this.showPasswordButton = page.getByRole("button", { name: "see password" });
    this.nicknameInput = page.getByTestId("nicknameInput");
    this.countryDropdown = page.getByTestId("countryDropdown");
    this.countryDropdownInput = page.getByTestId("countryDropdownInput");
    this.stateDropdown = page.getByTestId("stateDropdown");
    this.stateDropdownInput = page.getByTestId("stateDropdownInput");
    this.createAccountButton = page.getByTestId("createAccountSubmitButton");
    this.telemedicineLink = page.getByTestId("telemedicineLink");
    this.cancellationPolicyLink = page.getByTestId("createAccountCancellationLink");
    this.termsOfUseLink = page.getByTestId("createAccountTermsLink");
    this.privacyPolicyLink = page.getByTestId("createAccountPrivacyLink");
    this.statePrivacyRightsLink = page.getByTestId("createAccountNoticeOfUSStatePrivacyRightsLink");
    this.loginLink = page.getByTestId("loginLink");
  }

  @step
  async goto(): Promise<void> {
    await this.page.goto(SignupPage.formPath);
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async fillNickname(nickname: string): Promise<void> {
    await this.nicknameInput.fill(nickname);
  }

  async fillAccountDetails(email: string, password: string, nickname: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.fillNickname(nickname);
  }

  async selectCountry(countryCode: string): Promise<void> {
    await this.countryDropdown.click();
    await this.page.getByTestId(`countryDropdownOption-${countryCode}`).click();
  }

  async selectState(stateCode: string): Promise<void> {
    await this.stateDropdown.click();
    await this.page.getByTestId(`stateDropdownOption-${stateCode}`).click();
  }

  async submit(): Promise<void> {
    await this.createAccountButton.click();
  }
}
