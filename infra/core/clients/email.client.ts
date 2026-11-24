import { type EmailPreview, MailSlurp } from "mailslurp-client";

import { MatchOptionFieldEnum, MatchOptionShouldEnum, WaitForMatchingEmailsSortEnum } from "mailslurp-client";

export class MailClient {
  private static apiKey = "sk_7ZSCitbRKnjPg0UQ_JX73kfqCWlZSgeVwlyHRmkeF7z87WH8cxgbSZMzEhqi5RsIweL6k5O1w4aosg3pz";
  inboxId = "c62bc08b-78ea-4f38-98ee-e3b499250bb9";
  emailAddress?: string;
  private static readonly verificationPath = "https://app.canary.talkspace.com/email-verification#verificationCode=";

  private readonly client: MailSlurp;

  constructor() {
    this.client = new MailSlurp({ apiKey: MailClient.apiKey });
  }

  async createNewInbox(emailAddress?: string): Promise<string> {
    const inbox = await this.client.inboxController.createInbox({ emailAddress });
    if (!inbox.emailAddress || !inbox.id) {
      throw new Error(`MailSlurp did not return an inbox ID and email address for ${emailAddress}`);
    }

    this.inboxId = inbox.id;
    this.emailAddress = inbox.emailAddress;
    return inbox.emailAddress;
  }

  private async getLastEmail(emailSubject: string, since?: Date): Promise<EmailPreview> {
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

  async GetEmailLink(): Promise<string> {
    const email = await this.client.emailController.getLatestEmailInInbox1({ inboxId: this.inboxId });
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
