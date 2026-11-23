export const TestTags = {
  SMOKE: "@smoke",
  REGRESSION: "@regression",
  SANITY: "@sanity",
} as const;

type TestTag = (typeof TestTags)[keyof typeof TestTags];

export function Markers(...tags: TestTag[]) {
  return {
    tag: tags,
  };
}
