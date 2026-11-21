import { existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

export function resolveReportDirectory(requestedPath?: string): string {
  if (requestedPath !== undefined) {
    return validateReportDirectory(requestedPath);
  }

  const reportsDirectory = resolve("reports");

  if (!existsSync(reportsDirectory)) {
    throw new Error("No reports directory found. Run tests before opening a report.");
  }

  const reportCandidates = readdirSync(reportsDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(reportsDirectory, entry.name, "html"))
    .filter((directory) => isHtmlReportDirectory(directory))
    .sort((left, right) => statSync(right).mtimeMs - statSync(left).mtimeMs);

  const latestReport = reportCandidates[0];

  if (latestReport === undefined) {
    throw new Error("No HTML report found under reports/*/html.");
  }

  return latestReport;
}

function validateReportDirectory(requestedPath: string): string {
  const absolutePath = resolve(requestedPath);
  const reportDirectory = absolutePath.endsWith("index.html") ? dirname(absolutePath) : absolutePath;

  if (!isHtmlReportDirectory(reportDirectory)) {
    throw new Error(`HTML report not found: ${requestedPath}`);
  }

  return reportDirectory;
}

function isHtmlReportDirectory(directory: string): boolean {
  return existsSync(directory) && statSync(directory).isDirectory() && existsSync(join(directory, "index.html"));
}
