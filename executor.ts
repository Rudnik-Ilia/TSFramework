import { runCli } from "./infra/core/cli/program";

void runCli(process.argv).then((exitCode) => {
  process.exitCode = exitCode;
});
