import type { APIRequestContext, APIResponse, Page, Response } from "@playwright/test";

export class Request {
  private lastResponse?: APIResponse | Response;

  constructor(private readonly context: APIRequestContext) {}

  get response(): APIResponse | Response | undefined {
    return this.lastResponse;
  }

  async send(method: "GET" | "POST", url: string, payload?: unknown): Promise<APIResponse> {
    const response = await this.context.fetch(url, method === "POST" ? { method, data: payload } : { method });
    this.lastResponse = response;
    return response;
  }

  async waitForResponse(page: Page, matches: (response: Response) => boolean, timeout?: number): Promise<Response> {
    const response = await page.waitForResponse(matches, { timeout });
    this.lastResponse = response;
    return response;
  }

  async waitForOnboardingResponse(page: Page, trigger: () => Promise<void>): Promise<Response> {
    const [response] = await Promise.all([
      this.waitForResponse(page, (candidate) => {
        const { pathname } = new URL(candidate.url());
        return candidate.request().method() === "GET" && /^\/v3\/clients\/\d+\/onboarding\/?$/.test(pathname);
      }, 15_000),
      trigger(),
    ]);

    return response;
  }
}
