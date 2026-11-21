export const TestTags = {
  SMOKE: "@smoke",
  REGRESSION: "@regression",
  SIGNUP: "@signup",
} as const;

type TestTag = (typeof TestTags)[keyof typeof TestTags];

export function testMetadata(description: string, ...tags: TestTag[]) {
  return {
    tag: tags,
    annotation: {
      type: "description",
      description,
    },
  };
}
