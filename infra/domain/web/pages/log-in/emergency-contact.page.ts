import type { Locator, Page } from "@playwright/test";

import { step } from "../../../../utils/step.util";
import { EMERGENCY_CONTACT_FULL_NAME_PLACEHOLDER } from "../../locators/emergency-contact.locators";
import { BasePage } from "../abstract/base.page.abs";

export class EmergencyContactPage extends BasePage {
  private static readonly route = /^\/room\/[^/]+\/onboarding\/emergency-contact\/source\/onboarding\/?$/;

  private readonly fullNameInput: Locator;

  constructor(page: Page) {
    super(page);
    this.fullNameInput = page.getByPlaceholder(EMERGENCY_CONTACT_FULL_NAME_PLACEHOLDER, { exact: true });
  }

  @step
  async goto(): Promise<void> {
    throw new Error("Emergency contact intake is only reachable through the onboarding flow.");
  }

  @step
  async waitForRedirect(): Promise<void> {
    await this.page.waitForURL((url) => EmergencyContactPage.route.test(url.pathname));
  }

  @step
  async submitFullName(fullName: string): Promise<void> {
    const normalizedFullName = fullName.trim();

    if (!normalizedFullName) {
      throw new Error("Emergency contact full name must not be empty.");
    }

    await this.fullNameInput.fill(normalizedFullName);
    await this.fullNameInput.press("Enter");
  }
}
