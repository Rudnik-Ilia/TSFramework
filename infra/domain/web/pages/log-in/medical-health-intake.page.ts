import type { Locator, Page } from "@playwright/test";

import { step } from "../../../../utils/step.util";
import { MEDICAL_HEALTH_INTAKE_PRIMARY_CARE_DOCTOR_SKIP_BUTTON } from "../../locators/medical-health-intake.locators";
import { BasePage } from "../abstract/base.page.abs";

export class MedicalHealthIntakePage extends BasePage {
  private static readonly route = /^\/room\/[^/]+\/onboarding\/medical-health\/source\/onboarding\/?$/;

  private readonly skipPrimaryCareDoctorButton: Locator;

  constructor(page: Page) {
    super(page);
    this.skipPrimaryCareDoctorButton = page.getByTestId(MEDICAL_HEALTH_INTAKE_PRIMARY_CARE_DOCTOR_SKIP_BUTTON);
  }

  @step
  async goto(): Promise<void> {
    throw new Error("Medical health intake is only reachable through the onboarding flow.");
  }

  @step
  async waitForRedirect(): Promise<void> {
    await this.page.waitForURL((url) => MedicalHealthIntakePage.route.test(url.pathname));
  }

  @step
  async skipPrimaryCareDoctor(): Promise<void> {
    await this.skipPrimaryCareDoctorButton.click();
  }
}
