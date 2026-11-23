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
  private static readonly timeout = 60_000;
  private static readonly verificationPath = "/email-verification#verificationCode=";

  private readonly client: MailSlurp;

  constructor(
    apiKey = process.env.MAILSLURP_API_KEY ?? "sk_7ZSCitbRKnjPg0UQ_JX73kfqCWlZSgeVwlyHRmkeF7z87WH8cxgbSZMzEhqi5RsIweL6k5O1w4aosg3pz",
    private readonly inboxId = process.env.MAILSLURP_INBOX_ID ?? "0170d9e2-6a0e-4737-839d-2993f98f18b1",
  ) {
    //
    //   if (!apiKey) {
    //     throw new Error("MAILSLURP_API_KEY is not set");
    //   }
    //
    //   if (!inboxId) {
    //     throw new Error("MAILSLURP_INBOX_ID is not set");
    //   }
    this.client = new MailSlurp({ apiKey });
  }

  async waitForVerificationCode(): Promise<string | undefined> {
    const email = await this.waitForLatestEmail();
    return email.body?.match(/\b\d{6}\b/)?.[0];
  }

  async waitForVerificationLink(verificationPath = MailClient.verificationPath): Promise<string> {
    const { verificationUrl } = await this.waitForVerificationEmail({ verificationPath });
    return verificationUrl;
  }

  async waitForVerificationEmail(options: WaitForVerificationEmailOptions = {}): Promise<VerificationEmail> {
    const { since, unreadOnly = true, verificationPath = MailClient.verificationPath } = options;
    const email = await this.waitForLatestEmail(since, unreadOnly);
    const [{ links }, { plainHtmlBodyUrl }] = await Promise.all([
      this.client.emailController.getEmailLinks({
        emailId: email.id,
      }),
      this.client.emailController.getEmailPreviewURLs({
        emailId: email.id,
      }),
    ]);
    const verificationUrl = links.find((link) => link.includes(verificationPath));

    if (!verificationUrl) {
      throw new Error("Email verification link was not found");
    }

    return {
      previewUrl: plainHtmlBodyUrl,
      verificationUrl,
    };
  }

  private async waitForLatestEmail(since?: Date, unreadOnly = true): Promise<Email> {
    const loginStartedAt = since ?? new Date();

    return this.client.waitController.waitForLatestEmail({
      inboxId: this.inboxId,
      timeout: MailClient.timeout,
      unreadOnly,
      since,
      // unreadOnly: true,
      // since: loginStartedAt,
    });
  }
}

const mailClient = new MailClient();

export async function waitForVerificationCode(): Promise<string | undefined> {
  return mailClient.waitForVerificationCode();
}

export async function waitForVerificationLink(): Promise<string> {
  return mailClient.waitForVerificationLink();
}

export async function waitForVerificationEmail(): Promise<VerificationEmail> {
  return mailClient.waitForVerificationEmail();
}
