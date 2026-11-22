import type { TestCommandMode, TestCommandOptions } from "./types";

const smokeTag = "@smoke";
const regressionTag = "@regression";
const sanityTag = "@sanity";

export function buildTestArguments(mode: TestCommandMode, testName: string | undefined, options: TestCommandOptions): string[] {
  const argumentsList = ["test"];

  if (options.file !== undefined) {
    argumentsList.push(options.file);
  }

  if (options.browser !== undefined) {
    argumentsList.push("--project", options.browser);
  }

  if (options.workers !== undefined) {
    argumentsList.push("--workers", String(options.workers));
  }

  if (options.headed === true) {
    argumentsList.push("--headed");
  }

  if (options.parallel === true) {
    argumentsList.push("--fully-parallel");
  }

  const grepPattern = buildGrepPattern(testName, options);

  if (grepPattern !== undefined) {
    argumentsList.push("--grep", grepPattern);
  }

  if (mode === "list") {
    argumentsList.push("--list");
  }

  if (mode === "debug") {
    argumentsList.push("--debug=inspector");
  }

  return argumentsList;
}

function buildGrepPattern(testName: string | undefined, options: TestCommandOptions): string | undefined {
  const patterns: string[] = [];

  if (testName !== undefined) {
    patterns.push(escapeRegularExpression(testName.trim()));
  }

  if (options.grep !== undefined) {
    patterns.push(options.grep);
  }

  if (options.smoke === true) {
    patterns.push(escapeRegularExpression(smokeTag));
  }

  if (options.regression === true) {
    patterns.push(escapeRegularExpression(regressionTag));
  }

  if (options.sanity === true) {
    patterns.push(escapeRegularExpression(sanityTag));
  }

  if (patterns.length === 0) {
    return undefined;
  }

  if (patterns.length === 1) {
    return patterns[0];
  }

  return patterns.map((pattern) => `(?=.*(?:${pattern}))`).join("");
}

function escapeRegularExpression(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
