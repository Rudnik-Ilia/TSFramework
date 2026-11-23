import { type EmailPreview, MailSlurp } from "mailslurp-client";

export interface VerificationEmail {
  previewUrl: string;
  verificationUrl: string;
}

export interface WaitForVerificationEmailOptions {
  since?: Date;
  unreadOnly?: boolean;
  verificationPath?: string;
}

export class MailClient {
  private static apiKey = "sk_7ZSCitbRKnjPg0UQ_JX73kfqCWlZSgeVwlyHRmkeF7z87WH8cxgbSZMzEhqi5RsIweL6k5O1w4aosg3pz";
  private static mailID = "d562dcc4-1f11-4df7-8e42-4ceb42d7a157";
  private static readonly timeout = 60_000;
  private static readonly verificationPath = "https://app.canary.talkspace.com/email-verification#verificationCode=";

  private readonly client: MailSlurp;

  constructor() {
    this.client = new MailSlurp({ apiKey: MailClient.apiKey });
  }

  private async getLastEmail(emailSubject: string): Promise<EmailPreview> {
    const emails = await this.client.inboxController.getEmails({ inboxId: MailClient.mailID, limit: 10 });
    const email = emails.filter(({ subject }) => subject === emailSubject).at(-1);

    if (!email) {
      throw new Error(`The last email with ${emailSubject} was not found`);
    }

    return email;
  }

  async GetEmailLink(): Promise<string> {
    const email = await this.client.emailController.getLatestEmailInInbox1({ inboxId: MailClient.mailID });
    const { links } = await this.client.emailController.getEmailLinks({ emailId: email.id });
    const verificationUrl = links.find((link) => link.includes(MailClient.verificationPath));

    if (!verificationUrl) {
      throw new Error("Email verification link was not found");
    }
    return verificationUrl;
  }

  async GetEmailVerificationCode(): Promise<string> {
    const email = await this.getLastEmail("Verify your email address");

    const { lines } = await this.client.emailController.getEmailHTMLQuery({ emailId: email.id, htmlSelector: "td.em_defaultlink > p" });
    const verificationCode = lines.find((line) => /^\s*\d{6}\s*$/.test(line))?.trim();

    if (!verificationCode) {
      throw new Error("Six-digit email verification code was not found");
    }
    return verificationCode;
  }

  async GetEmailOneTimeLoginPass(): Promise<string> {
    const email = await this.getLastEmail("One time login password");

    const { lines } = await this.client.emailController.getEmailHTMLQuery({ emailId: email.id, htmlSelector: "td.em_richText > b" });
    const oneTimeCode = lines.find((line) => /^\s*\d{6}\s*$/.test(line))?.trim();

    if (!oneTimeCode) {
      throw new Error("Six-digit one-time code was not found");
    }
    return oneTimeCode;
  }
}
