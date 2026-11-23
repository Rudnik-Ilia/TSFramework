import { test as base } from "@playwright/test";

import { EmailVerificationOtpPage } from "../../domain/web/pages/email-verification-otp.page";
import { EmailResendPage } from "../../domain/web/pages/email-resend.page";
import { LoginPage } from "../../domain/web/pages/login.page";
import { SignupPage } from "../../domain/web/pages/signup.page";
import { WelcomeTalkspace } from "../../domain/web/pages/welcome-talkspace.page";

interface PageFixtures {
  emailVerificationCompletePage: EmailVerificationCompletePage;
  emailVerificationOtpPage: EmailVerificationOtpPage;
  emailResendPage: EmailResendPage;
  loginPage: LoginPage;
  signupPage: SignupPage;
  welcomeTalkspace: WelcomeTalkspace;
}

export const test = base.extend<PageFixtures>({
  welcomeTalkspace: async ({ page }, use) => {
    await use(new WelcomeTalkspace(page));
  },

  emailVerificationOtpPage: async ({ page }, use) => {
    await use(new EmailVerificationOtpPage(page));
  },

  emailResendPage: async ({ page }, use) => {
    await use(new EmailResendPage(page));
  },

  loginPage: async ({ baseURL, page }, use) => {
    if (!baseURL) {
      throw new Error("Playwright baseURL is required for LoginPage");
    }

    await use(new LoginPage(page, baseURL));
  },

  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page));
  },
});

export { expect } from "@playwright/test";
