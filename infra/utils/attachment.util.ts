import { test } from "@playwright/test";

export class TestAttachments {
  static async log(message: string): Promise<void> {
    await test.info().attach("log", { body: message, contentType: "text/plain" });
  }

  static async attachJson(name: string, data: unknown): Promise<void> {
    await test.info().attach(name, {
      body: JSON.stringify(data, null, 2),
      contentType: "application/json",
    });
  }
}
