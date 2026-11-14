import process from "node:process";

import { Command, CommanderError } from "commander";

import { buildTestArguments } from "./playwright-arguments";
import { spawnPlaywright } from "./process-runner";
import { resolveReportDirectory } from "./report-resolver";
import type { TestCommandMode, TestCommandOptions } from "./types";
import {
  parseFileSelector,
  parseNonEmptyValue,
  parsePositiveInteger,
  parseRegularExpression,
} from "./validation";

export async function runCli(argumentsList: readonly string[] = process.argv): Promise<number> {
  let commandExitCode = 0;
  const program = createProgram(async (playwrightArguments) => {
    commandExitCode = await spawnPlaywright(playwrightArguments);
  });

  program.exitOverride();

  try {
    await program.parseAsync([...argumentsList]);
    return commandExitCode;
  } catch (error: unknown) {
    if (error instanceof CommanderError) {
      return error.exitCode;
    }

    console.error(error instanceof Error ? error.message : String(error));
    return 1;
  }
}

function createProgram(execute: (argumentsList: readonly string[]) => Promise<void>): Command {
  const program = new Command()
    .name("qa-cli")
    .description("Project-specific Playwright command wrapper")
    .version("1.0.0")
    .showHelpAfterError()
    .addHelpText(
      "after",
      `
Examples:
  npm run qa -- run --smoke --browser chromium
  npm run qa -- run "submits valid data set 1"
  npm run qa -- run --file tests/contact-us/contact-navigation.spec.ts:44
  npm run qa -- list --smoke --regression
  npm run qa -- debug --file tests/home-page/home.spec.ts
  npm run qa -- report
`,
    );

  program.action(() => {
    program.help({ error: true });
  });

  program.addCommand(createTestCommand("run", "Run Playwright tests", "run", execute));
  program.addCommand(createTestCommand("list", "List matching Playwright tests", "list", execute));
  program.addCommand(createTestCommand("debug", "Debug matching Playwright tests", "debug", execute));

  const reportCommand = new Command("report")
    .description("Open an HTML report; defaults to the latest reports/*/html directory")
    .argument("[path]", "HTML report directory or index.html path", parseNonEmptyValue)
    .action(async (reportPath: string | undefined) => {
      const reportDirectory = resolveReportDirectory(reportPath);
      await execute(["show-report", reportDirectory]);
    });

  program.addCommand(reportCommand);
  return program;
}

function createTestCommand(
  name: TestCommandMode,
  description: string,
  mode: TestCommandMode,
  execute: (argumentsList: readonly string[]) => Promise<void>,
): Command {
  const command = new Command(name)
    .description(description)
    .argument("[test-name]", "Test title text; combined with --grep and tag flags")
    .option("--smoke", "Require the @smoke tag")
    .option("--regression", "Require the @regression tag")
    .option("--browser <name>", "Playwright project/browser name", parseNonEmptyValue)
    .option("--workers <count>", "Positive worker count", parsePositiveInteger)
    .option("--headed", "Run with a visible browser")
    .option("--grep <pattern>", "Additional regular expression for test titles", parseRegularExpression)
    .option("--file <path>", "Test file, optionally followed by :line", parseFileSelector)
    .option("--parallel", "Enable fully parallel Playwright execution")
    .action(async (testName: string | undefined) => {
      const normalizedTestName = testName === undefined ? undefined : parseNonEmptyValue(testName);
      const options = command.opts<TestCommandOptions>();
      const playwrightArguments = buildTestArguments(mode, normalizedTestName, options);
      await execute(playwrightArguments);
    });

  return command;
}
