import type { Locator, Page } from "@playwright/test";

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

  async openContactUs(): Promise<void> {
    await this.contactUsLink.click();
  }
}
