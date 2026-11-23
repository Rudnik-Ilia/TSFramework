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
  private static mailID = "250076b5-12f0-47ec-9683-518232c5515d";
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
}
