import { MailClient } from "../clients/email.client";
import { test as pagesTest } from "./pages.fixture";

interface WorkerFixtures {
  mailClient: MailClient;
}

export const test = pagesTest.extend<{}, WorkerFixtures>({
  mailClient: [
    async ({}, use) => {
      await use(new MailClient());
    },
    { scope: "worker" },
  ],
});

export { expect } from "@playwright/test";
