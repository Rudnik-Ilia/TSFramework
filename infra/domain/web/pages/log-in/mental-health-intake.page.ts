import type { Locator, Page } from "@playwright/test";

import { Validate } from "../../../../core/validations/validate.validation";
import { step } from "../../../../utils/step.util";
import {
  MENTAL_HEALTH_INTAKE_GENDER_OPTION,
  MENTAL_HEALTH_INTAKE_GENDER_OPTIONS,
  MENTAL_HEALTH_INTAKE_PREVIOUS_TREATMENT_OPTION,
  MENTAL_HEALTH_INTAKE_PREVIOUS_TREATMENT_OPTIONS,
  type GenderIdentityOption,
  type PreviousMentalHealthTreatmentOption,
} from "../../locators/mental-health-intake.locators";
import { BasePage } from "../abstract/base.page.abs";

export class MentalHealthIntakePage extends BasePage {
  private static readonly route = /^\/room\/[^/]+\/onboarding\/mental-health\/source\/onboarding\/?$/;

  readonly title: Locator;
  readonly startIntakeButton: Locator;
  readonly genderIdentityTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.getByText(/^Let['’]s prepare for your first session$/);
    this.startIntakeButton = page.getByTestId("mentalIntakeWelcomeScreenPrimaryButton");
    this.genderIdentityTitle = page.getByText("What is your gender identity?", { exact: true });
  }

  @step
  async goto(): Promise<void> {
    throw new Error("NotImplemented");
  }

  @step
  async waitForRedirect(): Promise<void> {
    await this.page.waitForURL((url) => MentalHealthIntakePage.route.test(url.pathname));
  }

  @step
  async expectTitleVisible(): Promise<void> {
    await Validate.visible(this.title);
  }

  @step
  async startIntake(): Promise<void> {
    await this.startIntakeButton.click();
  }

  @step
  async expectGenderIdentityVisible(): Promise<void> {
    await Validate.visible(this.genderIdentityTitle);
  }

  @step
  async selectGenderIdentity(option: GenderIdentityOption): Promise<void> {
    await this.genderIdentityOption(option).click();
  }

  @step
  async selectPreviousMentalHealthTreatment(option: PreviousMentalHealthTreatmentOption): Promise<void> {
    await this.previousMentalHealthTreatmentOption(option).click();
  }

  private genderIdentityOption(option: GenderIdentityOption): Locator {
    const optionIndex = MENTAL_HEALTH_INTAKE_GENDER_OPTIONS.indexOf(option);

    if (optionIndex === -1) {
      throw new Error(`Unsupported gender identity option: ${option}`);
    }

    return this.page.getByTestId(`${MENTAL_HEALTH_INTAKE_GENDER_OPTION}${optionIndex}`);
  }

  private previousMentalHealthTreatmentOption(option: PreviousMentalHealthTreatmentOption): Locator {
    const optionIndex = MENTAL_HEALTH_INTAKE_PREVIOUS_TREATMENT_OPTIONS.indexOf(option);

    if (optionIndex === -1) {
      throw new Error(`Unsupported previous mental health treatment option: ${option}`);
    }

    return this.page.getByTestId(`${MENTAL_HEALTH_INTAKE_PREVIOUS_TREATMENT_OPTION}${optionIndex}`);
  }
}
