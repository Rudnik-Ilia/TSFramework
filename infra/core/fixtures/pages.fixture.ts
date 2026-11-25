import { test as base } from "@playwright/test";

import { EmailVerificationCodePage } from "../../domain/web/pages/log-in/email-verification-code.page";
import { EmailResendPage } from "../../domain/web/pages/email-resend.page";
import { LoginPage } from "../../domain/web/pages/log-in/login.page";
import { SignupPage } from "../../domain/web/pages/signup.page";
import { WelcomeTalkspacePage } from "../../domain/web/pages/log-in/welcome-talkspace.page";
import { TwoFactorVerifyPage } from "../../domain/web/pages/two-factor-verify.page";
import { HomePage } from "../../domain/web/pages/log-in/home.page";
import { MeetYourProviderPage } from "../../domain/web/pages/log-in/meet-your-provider.page";
import { MentalHealthIntakePage } from "../../domain/web/pages/log-in/mental-health-intake.page";
import { MentalHealthIntakeGenderPage } from "../../domain/web/pages/log-in/mental-health-intake-gender.page";
import { OnboardingPage } from "../../domain/web/pages/log-in/onboarding.page";
import { ChangeNumberPage } from "../../domain/web/pages/log-in/change-number.page";

interface PageFixtures {
  emailVerificationCodePage: EmailVerificationCodePage;
  emailResendPage: EmailResendPage;
  loginPage: LoginPage;
  signupPage: SignupPage;
  welcomeTalkspacePage: WelcomeTalkspacePage;
  twoFactorVerifyPage: TwoFactorVerifyPage;
  homePage: HomePage;
  meetYourProviderPage: MeetYourProviderPage;
  mentalHealthIntakePage: MentalHealthIntakePage;
  mentalHealthIntakeGenderPage: MentalHealthIntakeGenderPage;
  onboardingPage: OnboardingPage;
  changeNumberPage: ChangeNumberPage;
}

export const test = base.extend<PageFixtures>({
  welcomeTalkspacePage: async ({ page }, use) => {
    await use(new WelcomeTalkspacePage(page));
  },
  mentalHealthIntakeGenderPage: async ({ page }, use) => {
    await use(new MentalHealthIntakeGenderPage(page));
  },

  meetYourProviderPage: async ({ page }, use) => {
    await use(new MeetYourProviderPage(page));
  },

  mentalHealthIntakePage: async ({ page }, use) => {
    await use(new MentalHealthIntakePage(page));
  },

  onboardingPage: async ({ page }, use) => {
    await use(new OnboardingPage(page));
  },

  changeNumberPage: async ({ page }, use) => {
    await use(new ChangeNumberPage(page));
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
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
});

export { expect } from "@playwright/test";
