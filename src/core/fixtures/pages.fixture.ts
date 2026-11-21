import { test as base } from "@playwright/test";

import { LoginPage } from "../../domain/pages/login.page";
import { SignupPage } from "../../domain/pages/signup.page";

interface PageFixtures {
  loginPage: LoginPage;
  signupPage: SignupPage;
}

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page));
  },
});

export { expect } from "@playwright/test";
