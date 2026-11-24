import type { Locator, Page } from "@playwright/test";

import { Validate } from "../../../../core/validations/validate.validation";
import { step } from "../../../../utils/step.util";

export class MentalHealthIntakeGenderPage {
  readonly title: Locator;
  readonly maleOption: Locator;

  constructor(page: Page) {
    this.title = page.getByText("What is your gender identity?", { exact: true });
    this.maleOption = page.getByTestId("mentalIntakeGenderRadioButton").filter({
      hasText: /^\s*Male\s*$/,
    });
  }

  @step
  async expectTitleVisible(): Promise<void> {
    await Validate.visible(this.title);
  }

  @step
  async selectMale(): Promise<void> {
    await this.maleOption.click();
  }
}
