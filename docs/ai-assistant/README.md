# AI Assistant Index

Use this index before creating or changing tests.

## Read in this order

1. [Framework architecture](../framework/architecture.md)
2. [Authoring tests and framework objects](../guides/authoring-tests.md)
3. [Test and TypeScript conventions](../guides/test-conventions.md)
4. [Commands and validation](../reference/commands.md)

## Working procedure

1. Read the available `playwright-best-practices` skill before designing tests, page objects, or fixtures.
2. Inspect the existing test, page object, fixture, and test data nearest to the requested behavior.
3. Read the `playwright-cli` skill, then use it to explore the UI. Never guess a locator or submit real credentials.
4. Explain any architectural change before editing.
5. Make the smallest change that follows the existing layers.
6. Type-check, list the affected tests, and run the narrowest relevant Playwright tests.

## Decision guide

- A single-page UI operation belongs to that page object.
- UI reused by two or more pages belongs in a component wrapper.
- A reusable journey spanning pages belongs in `infra/logic/`.
- Browser-independent integration code belongs in `infra/core/clients/`.
- Reusable assertions belong in `Validate`; scenario-specific expectations stay in tests.
- Test-only input belongs beside the test in `test-data/`; broadly shared typed data belongs in `infra/data/`.

Do not add an abstraction for one call site unless it enforces an important boundary or clearly removes duplication.
