import { runCli } from "./infra/core/cli/program.cli";

void runCli(process.argv).then((exitCode) => {
  process.exitCode = exitCode;
});
