import { MailSlurp } from "mailslurp-client";

export async function waitForVerificationCode(): Promise<string | undefined> {
  const apiKey = process.env.MAILSLURP_API_KEY ?? "sk_7ZSCitbRKnjPg0UQ_JX73kfqCWlZSgeVwlyHRmkeF7z87WH8cxgbSZMzEhqi5RsIweL6k5O1w4aosg3pz";
  const inboxId = process.env.MAILSLURP_INBOX_ID ?? "0170d9e2-6a0e-4737-839d-2993f98f18b1";
  //
  //   if (!apiKey) {
  //     throw new Error("MAILSLURP_API_KEY is not set");
  //   }
  //
  //   if (!inboxId) {
  //     throw new Error("MAILSLURP_INBOX_ID is not set");
  //   }
  const loginStartedAt = new Date();

  const mailClient = new MailSlurp({ apiKey });
  const email = await mailClient.waitController.waitForLatestEmail({
    inboxId,
    timeout: 60_000,
    // unreadOnly: true,
    // since: loginStartedAt,
  });

  return email.body?.match(/\b\d{6}\b/)?.[0];
}
