import { test as base } from "@playwright/test";

import { ContactPage } from "../../domain/pages/contact.page";
import { HomePage } from "../../domain/pages/home.page";

interface PageFixtures {
  homePage: HomePage;
  contactPage: ContactPage;
}

export const test = base.extend<PageFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  contactPage: async ({ page }, use) => {
    await use(new ContactPage(page));
  },
});

export { expect } from "@playwright/test";
