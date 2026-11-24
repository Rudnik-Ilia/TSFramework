import type { Locator, Page } from "@playwright/test";

import { step } from "../../../utils/step.util";
import {
  CANCELLATION_POLICY_LINK_SIGNUP,
  COUNTRY_DROPDOWN_INPUT_SIGNUP,
  COUNTRY_DROPDOWN_OPTION_PREFIX_SIGNUP,
  COUNTRY_DROPDOWN_SELECTED_VALUE_SIGNUP,
  COUNTRY_DROPDOWN_SIGNUP,
  CREATE_ACCOUNT_BUTTON_SIGNUP,
  EMAIL_INPUT_SIGNUP,
  HEADING_SIGNUP,
  LOGIN_LINK_SIGNUP,
  NICKNAME_INPUT_SIGNUP,
  PASSWORD_INPUT_SIGNUP,
  PRIVACY_POLICY_LINK_SIGNUP,
  SHOW_PASSWORD_BUTTON_SIGNUP,
  STATE_DROPDOWN_INPUT_SIGNUP,
  STATE_DROPDOWN_OPTION_PREFIX_SIGNUP,
  STATE_DROPDOWN_SIGNUP,
  STATE_PRIVACY_RIGHTS_LINK_SIGNUP,
  TELEMEDICINE_LINK_SIGNUP,
  TERMS_OF_USE_LINK_SIGNUP,
} from "../locators/login.sign.locators";
import { BasePage } from "./base.page";
import { Validate } from "../../../core/validations/validate.validation";

export class SignupPage extends BasePage {
  static readonly path = "/signup/autoswitchpt";

  readonly heading: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly showPasswordButton: Locator;
  readonly nicknameInput: Locator;
  readonly countryDropdown: Locator;
  readonly countryDropdownInput: Locator;
  readonly countryDropdownSelectedValue: Locator;
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
    this.heading = page.getByRole("heading", { name: HEADING_SIGNUP, level: 1 });
    this.emailInput = page.getByTestId(EMAIL_INPUT_SIGNUP);
    this.passwordInput = page.getByTestId(PASSWORD_INPUT_SIGNUP);
    this.showPasswordButton = page.getByRole("button", { name: SHOW_PASSWORD_BUTTON_SIGNUP });
    this.nicknameInput = page.getByTestId(NICKNAME_INPUT_SIGNUP);
    this.countryDropdown = page.getByTestId(COUNTRY_DROPDOWN_SIGNUP);
    this.countryDropdownInput = page.getByTestId(COUNTRY_DROPDOWN_INPUT_SIGNUP);
    this.countryDropdownSelectedValue = page.getByTestId(COUNTRY_DROPDOWN_SELECTED_VALUE_SIGNUP);
    this.stateDropdown = page.getByTestId(STATE_DROPDOWN_SIGNUP);
    this.stateDropdownInput = page.getByTestId(STATE_DROPDOWN_INPUT_SIGNUP);
    this.createAccountButton = page.getByTestId(CREATE_ACCOUNT_BUTTON_SIGNUP);
    this.telemedicineLink = page.getByTestId(TELEMEDICINE_LINK_SIGNUP);
    this.cancellationPolicyLink = page.getByTestId(CANCELLATION_POLICY_LINK_SIGNUP);
    this.termsOfUseLink = page.getByTestId(TERMS_OF_USE_LINK_SIGNUP);
    this.privacyPolicyLink = page.getByTestId(PRIVACY_POLICY_LINK_SIGNUP);
    this.statePrivacyRightsLink = page.getByTestId(STATE_PRIVACY_RIGHTS_LINK_SIGNUP);
    this.loginLink = page.getByTestId(LOGIN_LINK_SIGNUP);
  }

  @step
  async goto(): Promise<void> {
    await this.page.goto(SignupPage.path);
  }

  async fillEmail(email: string): Promise<void> {
    Validate.enabled(this.emailInput);

    await this.emailInput.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    Validate.enabled(this.passwordInput);
    await this.passwordInput.fill(password);
  }

  async fillNickname(nickname: string): Promise<void> {
    Validate.enabled(this.nicknameInput);
    await this.nicknameInput.fill(nickname);
  }

  @step
  async fillAccountDetails(email: string, password: string, nickname: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.fillNickname(nickname);
  }

  async selectCountry(countryName: string, countryCode: string): Promise<void> {
    await this.countryDropdown.click();
    await this.countryDropdownInput.fill(countryName);
    await this.page.getByTestId(`${COUNTRY_DROPDOWN_OPTION_PREFIX_SIGNUP}${countryCode}`).click();
  }

  async selectState(stateName: string): Promise<void> {
    await this.stateDropdown.click();
    await this.stateDropdownInput.fill(stateName);
  }

  async createAccount(): Promise<void> {
    await this.createAccountButton.click();
  }
}
