import { readFileSync } from "node:fs";
import { defineConfig, devices } from "@playwright/test";
import { reportId } from "./src/utils/randomUtil";

const settingsFile = process.env.PW_SETTINGS ?? "playwright.settings.json";

const config = JSON.parse(readFileSync(settingsFile, "utf8").replaceAll("{reportId}", reportId()));

config.projects = config.projects.map((project: { name: string; device: keyof typeof devices }) => ({
  name: project.name,
  use: devices[project.device],
}));

export default defineConfig(config);
