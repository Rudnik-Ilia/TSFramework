import { runCli } from "./src/core/cli/program";

void runCli(process.argv).then((exitCode) => {
  process.exitCode = exitCode;
});
