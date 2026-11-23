import { MailClient } from "../../clients/mailClient";
import { test as pagesTest } from "./pages.fixture";

interface MailFixtures {
  mailClient: MailClient;
}

export const test = pagesTest.extend<MailFixtures>({
  mailClient: async ({}, use) => {
    await use(new MailClient());
  },
});

export { expect } from "@playwright/test";
