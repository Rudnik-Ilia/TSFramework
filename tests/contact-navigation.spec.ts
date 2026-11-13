import { expect, test } from "@playwright/test";

import { ContactPage } from "../src/domain/pages/contact.page";
import { HomePage } from "../src/domain/pages/home.page";

test("navigates from Home to Contact Us through the top menu", async ({ page }) => {
  const homePage = new HomePage(page);

  await homePage.goto();
  await homePage.topMenu.openContactUs();

  const contactPage = new ContactPage(page);

  await expect(contactPage.page).toHaveURL(ContactPage.path);
});
