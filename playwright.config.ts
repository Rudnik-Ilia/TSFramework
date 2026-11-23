import { readFileSync } from "node:fs";
import { defineConfig, devices } from "@playwright/test";
import { RandomUtil } from "./infra/utils/random.util";

const settingsFile = process.env.PW_SETTINGS ?? "playwright.settings.json";

const reportId = RandomUtil.createReportName("report");
const config = JSON.parse(readFileSync(settingsFile, "utf8").replaceAll("{reportId}", reportId));

if (process.env.CI === "true") {
  config.use.headless = true;
}

config.projects = config.projects.map((project: { name: string; device: keyof typeof devices }) => ({
  name: project.name,
  use: devices[project.device],
}));

export default defineConfig(config);
