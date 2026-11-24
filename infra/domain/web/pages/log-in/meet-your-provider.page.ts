import type { Locator, Page } from "@playwright/test";

import { step } from "../../../../utils/step.util";

export class MeetYourProviderPage {
  private static readonly route = /^\/room\/[^/]+\/onboarding\/meet-your-provider\/?$/;

  readonly title: Locator;
  readonly closeButton: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByText("We’re thrilled to introduce you to your provider", { exact: true });
    this.closeButton = page.getByTestId("therapistCardMainButtonPress");
  }

  @step
  async waitForRedirect(): Promise<void> {
    await this.page.waitForURL((url) => MeetYourProviderPage.route.test(url.pathname));
  }

  @step
  async close(): Promise<void> {
    await this.closeButton.click();
  }
}
