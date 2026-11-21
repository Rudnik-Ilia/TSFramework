import { basename, resolve } from "node:path";

import { test } from "../../src/core/fixtures/pages.fixture";
import type { ContactData } from "../../src/contracts/data/contact";
import { ContactPage } from "../../src/domain/pages/contact.page";
import validContactDataJson from "./test_data/contact-us.data.json";
import uploadContactDataJson from "./test_data/contact-us-upload.data.json";

import { Validate } from "../../src/core/validators/validate";

const validContactData: readonly ContactData[] = validContactDataJson;

type ContactDataWithAttachment = ContactData & { attachmentPath: string };

const uploadContactData: readonly ContactDataWithAttachment[] = uploadContactDataJson.map((contactData) => ({
  ...contactData,
  attachmentPath: resolve("tests/contact-us/test_data", contactData.attachmentPath),
}));

test.describe("Contact Us page", () => {
  test("navigates from Home through the top menu", async ({ homePage, contactPage }) => {
    await homePage.goto();
    await homePage.topMenu.openContactUs();

    await Validate.haveUrl(contactPage.page, ContactPage.path);
    await Validate.haveTitle(contactPage.page, "Automation Exercise - Contact Us");
  });

  test("shows Get In Touch and all form fields", async ({ contactPage }) => {
    await contactPage.goto();

    await Validate.visibleAll([
      contactPage.getInTouchHeading,
      contactPage.nameInput,
      contactPage.emailInput,
      contactPage.subjectInput,
      contactPage.messageInput,
      contactPage.fileInput,
      contactPage.submitButton,
    ]);
  });

  for (const [dataSetIndex, contactData] of uploadContactData.entries()) {
    test(`submits all fields with attachment ${dataSetIndex + 1}`, async ({ contactPage }) => {
      await contactPage.goto();
      await contactPage.fillForm(contactData);

      await Validate.haveValue(contactPage.nameInput, contactData.name);
      await Validate.haveValue(contactPage.emailInput, contactData.email);
      await Validate.haveValue(contactPage.subjectInput, contactData.subject);
      await Validate.haveValue(contactPage.messageInput, contactData.message);
      await Validate.haveValue(contactPage.fileInput, new RegExp(`${basename(contactData.attachmentPath)}$`));

      await contactPage.submit();

      await Validate.visible(contactPage.successMessage);
    });
  }

  for (const [dataSetIndex, contactData] of validContactData.entries()) {
    test(`submits valid data set ${dataSetIndex + 1}`, async ({ contactPage }) => {
      await contactPage.goto();
      await contactPage.fillForm(contactData);

      await Validate.haveValue(contactPage.nameInput, contactData.name);
      await Validate.haveValue(contactPage.emailInput, contactData.email);
      await Validate.haveValue(contactPage.subjectInput, contactData.subject);
      await Validate.haveValue(contactPage.messageInput, contactData.message);

      await contactPage.submit();

      await Validate.visible(contactPage.successMessage);
    });
  }
});
