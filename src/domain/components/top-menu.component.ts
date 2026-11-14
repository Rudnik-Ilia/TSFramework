import type { Locator, Page } from "@playwright/test";
import { step } from "../../utils/step";

export class TopMenuComponent {
  readonly container: Locator;
  readonly homeLink: Locator;
  readonly productsLink: Locator;
  readonly cartLink: Locator;
  readonly signupLoginLink: Locator;
  readonly testCasesLink: Locator;
  readonly apiTestingLink: Locator;
  readonly videoTutorialsLink: Locator;
  readonly contactUsLink: Locator;
  readonly menuLinks: readonly Locator[];

  constructor(page: Page) {
    this.container = page.getByRole("banner").getByRole("list");
    this.homeLink = this.container.getByRole("link", { name: /Home$/i });
    this.productsLink = this.container.getByRole("link", { name: /Products$/i });
    this.cartLink = this.container.getByRole("link", { name: /Cart$/i });
    this.signupLoginLink = this.container.getByRole("link", { name: /Signup \/ Login$/i });
    this.testCasesLink = this.container.getByRole("link", { name: /Test Cases$/i });
    this.apiTestingLink = this.container.getByRole("link", { name: /API Testing$/i });
    this.videoTutorialsLink = this.container.getByRole("link", { name: /Video Tutorials$/i });
    this.contactUsLink = this.container.getByRole("link", { name: /Contact us$/i });
    this.menuLinks = [
      this.homeLink,
      this.productsLink,
      this.cartLink,
      this.signupLoginLink,
      this.testCasesLink,
      this.apiTestingLink,
      this.videoTutorialsLink,
      this.contactUsLink,
    ];
  }

  async openHome(): Promise<void> {
    await this.homeLink.click();
  }
  @step
  async openContactUs(): Promise<void> {
    await this.contactUsLink.click();
  }
}
