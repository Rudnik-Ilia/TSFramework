import { spawn } from "node:child_process";
import process from "node:process";

export async function spawnPlaywright(argumentsList: readonly string[]): Promise<number> {
  const npxExecutable = process.platform === "win32" ? "npx.cmd" : "npx";

  return await new Promise<number>((resolve, reject) => {
    const childProcess = spawn(npxExecutable, ["playwright", ...argumentsList], {
      cwd: process.cwd(),
      env: process.env,
      shell: false,
      stdio: "inherit",
    });

    childProcess.once("error", reject);
    childProcess.once("close", (exitCode, signal) => {
      if (exitCode !== null) {
        resolve(exitCode);
        return;
      }

      console.error(`Playwright terminated by signal ${signal ?? "unknown"}.`);
      resolve(1);
    });
  });
}
