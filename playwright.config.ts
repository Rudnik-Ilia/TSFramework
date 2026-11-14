import { defineConfig, devices } from "@playwright/test";
import { reportId } from "./src/utils/randomUtil";

const ID: string = reportId();

export default defineConfig({
  testDir: "./tests",
  outputDir: `reports/${ID}/test-results`,
  // fullyParallel: true,
  // workers: 4,

  timeout: 30_000,

  expect: {
    timeout: 5_000,
  },
  reporter: [
    ["list"],
    [
      "html",
      {
        outputFolder: `reports/${ID}/html`,
        open: "never",
      },
    ],
  ],

  use: {
    baseURL: "https://automationexercise.com",
    headless: false,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
