import { test as base } from "@playwright/test";

import { EmailVerificationCodePage } from "../../domain/web/pages/email-verification-code.page";
import { EmailResendPage } from "../../domain/web/pages/email-resend.page";
import { LoginPage } from "../../domain/web/pages/login.page";
import { SignupPage } from "../../domain/web/pages/signup.page";
import { WelcomeTalkspace } from "../../domain/web/pages/welcome-talkspace.page";
import { TwoFactorVerifyPage } from "../../domain/web/pages/two-factor-verify.page";

interface PageFixtures {
  emailVerificationCodePage: EmailVerificationCodePage;
  emailResendPage: EmailResendPage;
  loginPage: LoginPage;
  signupPage: SignupPage;
  welcomeTalkspace: WelcomeTalkspace;
  twoFactorVerifyPage: TwoFactorVerifyPage;
}

export const test = base.extend<PageFixtures>({
  welcomeTalkspace: async ({ page }, use) => {
    await use(new WelcomeTalkspace(page));
  },

  emailVerificationCodePage: async ({ page }, use) => {
    await use(new EmailVerificationCodePage(page));
  },

  emailResendPage: async ({ page }, use) => {
    await use(new EmailResendPage(page));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page));
  },

  twoFactorVerifyPage: async ({ page }, use) => {
    await use(new TwoFactorVerifyPage(page));
  },
});

export { expect } from "@playwright/test";
