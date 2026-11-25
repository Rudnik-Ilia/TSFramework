import type { Page, Response } from "@playwright/test";

import { step } from "../../../../utils/step.util";
import { BasePage } from "../abstract/base.page.abs";

export class OnboardingPage extends BasePage {
  private static readonly route = /^\/room\/(\d+)\/onboarding(?:\/.*)?$/;
  private static readonly responseRoute = /^\/v3\/clients\/\d+\/onboarding\/?$/;

  static pathForRoom(roomId: string): string {
    OnboardingPage.validateRoomId(roomId);
    return `/room/${roomId}/onboarding`;
  }

  constructor(page: Page) {
    super(page);
  }

  @step
  async goto(roomId?: string): Promise<void> {
    if (roomId === undefined) {
      throw new Error("A room ID is required to navigate to onboarding.");
    }

    await this.page.goto(OnboardingPage.pathForRoom(roomId));
  }

  @step
  async waitForRedirect(trigger: () => Promise<void>): Promise<string> {
    const [response] = await Promise.all([this.page.waitForResponse((candidate) => OnboardingPage.isOnboardingResponse(candidate)), trigger()]);

    if (!response.ok()) {
      throw new Error(`Onboarding request failed with status ${response.status()}.`);
    }

    const roomIds = await OnboardingPage.roomIdsFrom(response);
    let redirectedRoomId: string | undefined;

    await this.page.waitForURL((url) => {
      const routeMatch = OnboardingPage.route.exec(url.pathname);
      const roomId = routeMatch?.[1];

      if (roomId === undefined || !roomIds.has(roomId)) {
        return false;
      }

      redirectedRoomId = roomId;
      return true;
    });

    if (redirectedRoomId === undefined) {
      throw new Error("The onboarding redirect did not contain a room ID from the onboarding response.");
    }

    return redirectedRoomId;
  }

  private static isOnboardingResponse(response: Response): boolean {
    const { pathname } = new URL(response.url());
    return response.request().method() === "GET" && OnboardingPage.responseRoute.test(pathname);
  }

  private static async roomIdsFrom(response: Response): Promise<ReadonlySet<string>> {
    const payload: unknown = await response.json();

    if (!OnboardingPage.isRecord(payload) || !OnboardingPage.isRecord(payload.data)) {
      throw new Error("Onboarding response must contain a data object keyed by room ID.");
    }

    const roomIds = Object.keys(payload.data).filter((roomId) => /^\d+$/.test(roomId));

    if (roomIds.length === 0) {
      throw new Error("Onboarding response did not contain a numeric room ID.");
    }

    return new Set(roomIds);
  }

  private static isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }

  private static validateRoomId(roomId: string): void {
    if (!/^\d+$/.test(roomId)) {
      throw new Error("Room ID must contain only digits.");
    }
  }
}
