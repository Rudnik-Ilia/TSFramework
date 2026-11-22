import { test as base } from "@playwright/test";

import { EmailVerificationOtpPage } from "../../domain/web/pages/email-verification-otp.page";
import { EmailVerificationSentPage } from "../../domain/web/pages/email-verification-sent.page";
import { LoginPage } from "../../domain/web/pages/login.page";
import { SignupPage } from "../../domain/web/pages/signup.page";

interface PageFixtures {
  emailVerificationOtpPage: EmailVerificationOtpPage;
  emailVerificationSentPage: EmailVerificationSentPage;
  loginPage: LoginPage;
  signupPage: SignupPage;
}

export const test = base.extend<PageFixtures>({
  emailVerificationOtpPage: async ({ page }, use) => {
    await use(new EmailVerificationOtpPage(page));
  },

  emailVerificationSentPage: async ({ page }, use) => {
    await use(new EmailVerificationSentPage(page));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page));
  },
});

export { expect } from "@playwright/test";
