import { expect, test } from "../src/core/fixtures/pages.fixture";
import type { ContactData } from "../src/data/contact-data";
import { ContactPage } from "../src/domain/pages/contact.page";

const validContactData = [
  {
    name: "Alex Morgan",
    email: "alex.morgan+contact@example.com",
    subject: "Product availability question",
    message: "Please send additional information about current product availability.",
  },
  {
    name: "Maya Cohen",
    email: "maya.cohen+feedback@example.org",
    subject: "Website feedback",
    message: "The website is easy to use, and I would like to share additional feedback.",
  },
] satisfies readonly ContactData[];

test.describe("Contact Us page", () => {
  test("navigates from Home through the top menu", async ({ homePage, contactPage }) => {
    await homePage.goto();
    await homePage.topMenu.openContactUs();

    await expect(contactPage.page).toHaveURL(ContactPage.path);
    await expect(contactPage.page).toHaveTitle("Automation Exercise - Contact Us");
  });

  test("shows Get In Touch and all form fields", async ({ contactPage }) => {
    await contactPage.goto();

    await expect(contactPage.getInTouchHeading).toBeVisible();
    await expect(contactPage.nameInput).toBeVisible();
    await expect(contactPage.emailInput).toBeVisible();
    await expect(contactPage.subjectInput).toBeVisible();
    await expect(contactPage.messageInput).toBeVisible();
    await expect(contactPage.fileInput).toBeVisible();
    await expect(contactPage.submitButton).toBeVisible();
  });

  for (const [dataSetIndex, contactData] of validContactData.entries()) {
    test(`submits valid data set ${dataSetIndex + 1}`, async ({ contactPage }) => {
      await contactPage.goto();
      await contactPage.fillForm(contactData);

      await expect(contactPage.nameInput).toHaveValue(contactData.name);
      await expect(contactPage.emailInput).toHaveValue(contactData.email);
      await expect(contactPage.subjectInput).toHaveValue(contactData.subject);
      await expect(contactPage.messageInput).toHaveValue(contactData.message);

      await contactPage.submit();

      await expect(contactPage.successMessage).toBeVisible();
    });
  }
});
