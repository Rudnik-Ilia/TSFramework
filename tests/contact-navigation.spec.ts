import { expect, test } from "../src/core/fixtures/pages.fixture";
import { ContactPage } from "../src/domain/pages/contact.page";

test("navigates from Home to Contact Us through the top menu", async ({ homePage, contactPage }) => {
  await homePage.goto();
  await homePage.topMenu.openContactUs();

  await expect(contactPage.page).toHaveURL(ContactPage.path);
});
