import { type EmailPreview, MailSlurp } from "mailslurp-client";

import { MatchOptionFieldEnum, MatchOptionShouldEnum, WaitForMatchingEmailsSortEnum } from "mailslurp-client";

import type { InboxData } from "./contracts/inbox-id-name.contract";

export type { InboxData };

export class MailClient {
  // TODO: Read this test-only MailSlurp API key from an environment variable supplied as a Jenkins secret.
  private static apiKey = "sk_UkakdtesUFdMSexI_0co54vtepiURCetbvMB5Qvw4YL3xj1ikXdTZLiogEAUnZadcDf5zhzaykOG2pifS";
  inboxId?: string;
  emailAddress?: string;
  private static readonly verificationPath = "https://app.canary.talkspace.com/email-verification#verificationCode=";

  private readonly client: MailSlurp;

  constructor() {
    this.client = new MailSlurp({ apiKey: MailClient.apiKey });
  }

  async createNewInbox(emailAddress?: string): Promise<void> {
    const inbox = await this.client.inboxController.createInbox({ emailAddress });
    if (!inbox.emailAddress || !inbox.id) {
      throw new Error(`MailSlurp did not return an inbox ID and email address for ${emailAddress}`);
    }

    this.inboxId = inbox.id;
    this.emailAddress = inbox.emailAddress;
  }

  get inboxInfo(): InboxData {
    if (!this.inboxId || !this.emailAddress) {
      throw new Error("Inbox ID and email address are not set. Call createNewInbox() first.");
    }

    return {
      id: this.inboxId,
      emailAddress: this.emailAddress,
    };
  }

  private async getLastEmail(emailSubject: string, since?: Date): Promise<EmailPreview> {
    if (!this.inboxId) {
      throw new Error("Inbox ID is not set. Call createNewInbox() first.");
    }

    const [email] = await this.client.waitController.waitForMatchingEmails({
      inboxId: this.inboxId,
      count: 1,
      unreadOnly: true,
      sort: WaitForMatchingEmailsSortEnum.DESC,
      timeout: 30_000,
      since,
      matchOptions: {
        matches: [{ field: MatchOptionFieldEnum.SUBJECT, should: MatchOptionShouldEnum.EQUAL, value: emailSubject }],
      },
    });

    if (!email) {
      throw new Error(`The last email with ${emailSubject} was not found`);
    }

    return email;
  }

  private async extractCode(emailID: string, html_selector: string): Promise<string> {
    const { lines } = await this.client.emailController.getEmailHTMLQuery({ emailId: emailID, htmlSelector: html_selector });
    const verificationCode = lines.find((line) => /^\s*\d{6}\s*$/.test(line))?.trim();

    if (!verificationCode) {
      throw new Error("Six-digit email verification code was not found");
    }
    return verificationCode;
  }

  async GetEmailLink(email_subject: string, after_time: Date): Promise<string> {
    const email = await this.getLastEmail(email_subject, after_time);
    const { links } = await this.client.emailController.getEmailLinks({ emailId: email.id });
    const verificationUrl = links.find((link) => link.includes(MailClient.verificationPath));

    if (!verificationUrl) {
      throw new Error("Email verification link was not found");
    }
    return verificationUrl;
  }

  async GetEmailVerificationCode(email_subject: string, after_time: Date): Promise<string> {
    const email = await this.getLastEmail(email_subject, after_time);
    return this.extractCode(email.id, "td.em_defaultlink > p");
  }

  async GetEmailOneTimeLoginPass(email_subject: string, after_time: Date): Promise<string> {
    const email = await this.getLastEmail(email_subject, after_time);
    return this.extractCode(email.id, "td.em_richText > b");
  }
}
