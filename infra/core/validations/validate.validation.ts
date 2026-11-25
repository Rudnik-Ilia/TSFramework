import { expect, type Locator, type Page } from "@playwright/test";

export class Validate {
  static async clickable(locator: Locator): Promise<void> {
    await locator.click({ trial: true });
  }

  static async visibleAll(locators: readonly Locator[]): Promise<void> {
    for (const locator of locators) {
      await expect(locator).toBeVisible();
    }
  }
  static async visible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  static async hidden(locator: Locator): Promise<void> {
    await expect(locator).toBeHidden();
  }
  static async haveValueAll(locators: readonly Locator[]): Promise<void> {
    for (const locator of locators) {
      await expect(locator).toBeVisible();
    }
  }
  static async haveValue(locator: Locator, expectedValue: string | RegExp): Promise<void> {
    await expect(locator).toHaveValue(expectedValue);
  }

  static async containText(locator: Locator, expectedText: string | RegExp): Promise<void> {
    await expect(locator).toContainText(expectedText);
  }

  static async enabled(locator: Locator): Promise<void> {
    await expect(locator).toBeEnabled();
  }

  static async haveAttribute(locator: Locator, name: string, expectedValue: string | RegExp): Promise<void> {
    await expect(locator).toHaveAttribute(name, expectedValue);
  }

  static async haveUrl(page: Page, expectedUrl: string | RegExp): Promise<void> {
    await expect(page).toHaveURL(expectedUrl);
  }

  static async haveTitle(page: Page, expectedTitle: string | RegExp): Promise<void> {
    await expect(page).toHaveTitle(expectedTitle);
  }

  static async notEqual(actualValue: unknown, unexpectedValue: unknown): Promise<void> {
    expect(actualValue).not.toBe(unexpectedValue);
  }
}
