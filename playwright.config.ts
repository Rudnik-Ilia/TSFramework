import { defineConfig, devices } from "@playwright/test";
import { reportId } from "./src/utils/randomUtil";

export default defineConfig({
  testDir: "./tests",

  timeout: 30_000,

  expect: {
    timeout: 5_000,
  },
  reporter: [
    ["list"],
    [
      "html",
      {
        outputFolder: `reports/html/${reportId()}`,
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
