import { test } from "@playwright/test";

export const TestTags = {
  REGRESSION: "@regression",
  SMOKE: "@smoke",
  SANITY: "@sanity",
} as const;

type TestTag = (typeof TestTags)[keyof typeof TestTags];

export function Markers(...tags: TestTag[]) {
  return { tag: tags };
}

export function Serial(): void {
  test.describe.configure({ mode: "serial" });
}
