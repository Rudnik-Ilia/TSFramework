import type { Locator, Page } from "@playwright/test";

import type { ContactData } from "../../contracts/data/contact";
import { BasePage } from "./base.page";
import { step } from "../../utils/step";

export class ContactPage extends BasePage {
  static readonly path = "/contact_us";

  readonly getInTouchHeading: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly subjectInput: Locator;
  readonly messageInput: Locator;
  readonly fileInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.getInTouchHeading = page.getByRole("heading", { name: "Get In Touch" });
    this.nameInput = page.getByPlaceholder("Name", { exact: true });
    this.emailInput = page.getByPlaceholder("Email", { exact: true });
    this.subjectInput = page.getByPlaceholder("Subject", { exact: true });
    this.messageInput = page.getByPlaceholder("Your Message Here", { exact: true });
    this.fileInput = page.getByRole("button", { name: "Choose File" });
    this.submitButton = page.getByRole("button", { name: "Submit", exact: true });
    this.successMessage = page.locator("#contact-page").getByText("Success! Your details have been submitted successfully.", { exact: true });
  }

  @step
  async goto(): Promise<void> {
    await this.page.goto(ContactPage.path);
  }

  async fillName(name: string): Promise<void> {
    await this.nameInput.fill(name);
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillSubject(subject: string): Promise<void> {
    await this.subjectInput.fill(subject);
  }

  async fillMessage(message: string): Promise<void> {
    await this.messageInput.fill(message);
  }

  async uploadFile(filePath: string): Promise<void> {
    await this.fileInput.setInputFiles(filePath);
  }

  async fillForm(contactData: ContactData): Promise<void> {
    await this.fillName(contactData.name);
    await this.fillEmail(contactData.email);
    await this.fillSubject(contactData.subject);
    await this.fillMessage(contactData.message);

    if (contactData.attachmentPath !== undefined) {
      await this.uploadFile(contactData.attachmentPath);
    }
  }

  async submit(): Promise<void> {
    await Promise.all([this.acceptConfirmationDialog(), this.submitButton.click()]);
  }

  private async acceptConfirmationDialog(): Promise<void> {
    const confirmationDialog = await this.page.waitForEvent("dialog");
    await confirmationDialog.accept();
  }
}
