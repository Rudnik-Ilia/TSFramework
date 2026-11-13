import type { Locator, Page } from "@playwright/test";

import type { ContactPage } from "../pages/contact.page";
import type { HomePage } from "../pages/home.page";

export class TopMenuComponent {
  private readonly page: Page;
  private readonly homeLink: Locator;
  private readonly contactUsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.homeLink = page.getByRole("link", { name: /Home$/i });
    this.contactUsLink = page.getByRole("link", {
      name: /Contact us$/i,
    });
  }

  async openHome(): Promise<HomePage> {
    await this.homeLink.click();
    const { HomePage } = await import("../pages/home.page.js");

    return new HomePage(this.page);
  }

  async openContactUs(): Promise<ContactPage> {
    await this.contactUsLink.click();
    const { ContactPage } = await import("../pages/contact.page.js");

    return new ContactPage(this.page);
  }
}
