import type { Locator, Page } from "@playwright/test";
import { step } from "../../utils/step";

export class TopMenuComponent {
  private readonly homeLink: Locator;
  private readonly contactUsLink: Locator;

  constructor(page: Page) {
    this.homeLink = page.getByRole("link", { name: /Home$/i });
    this.contactUsLink = page.getByRole("link", { name: /Contact us$/i });
  }

  async openHome(): Promise<void> {
    await this.homeLink.click();
  }
  @step
  async openContactUs(): Promise<void> {
    await this.contactUsLink.click();
  }
}
