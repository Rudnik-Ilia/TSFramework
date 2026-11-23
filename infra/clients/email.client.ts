import { type Email, MailSlurp } from "mailslurp-client";

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

  async GetEmailLink(): Promise<string> {
    const email = await this.client.emailController.getLatestEmailInInbox1({ inboxId: MailClient.mailID });
    const { links } = await this.client.emailController.getEmailLinks({ emailId: email.id });
    const verificationUrl = links.find((link) => link.includes(MailClient.verificationPath));

    if (!verificationUrl) {
      throw new Error("Email verification link was not found");
    }
    return verificationUrl;
  }

  async GetEmailCode(): Promise<string> {
    const emails = await this.client.inboxController.getEmails({ inboxId: MailClient.mailID, limit: 10 });
    const email = emails.find(({ subject }) => subject === "Verify your email address");

    if (!email) {
      throw new Error("Verification email was not found");
    }

    const { lines } = await this.client.emailController.getEmailHTMLQuery({ emailId: email.id, htmlSelector: "td.em_defaultlink > p" });
    const verificationCode = lines.find((line) => /^\s*\d{6}\s*$/.test(line))?.trim();

    if (!verificationCode) {
      throw new Error("Six-digit email verification code was not found");
    }
    return verificationCode;
  }
}
