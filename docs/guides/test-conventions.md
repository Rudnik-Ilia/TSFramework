# Test and TypeScript Conventions

## Locators

1. Use `getByTestId("value")` whenever the element exposes `data-qa`; Playwright maps it through `testIdAttribute`.
2. Otherwise prefer `getByRole` with an accessible name, then `getByLabel` or exact visible text.
3. Never use generated IDs/classes, XPath, positional selectors, or brittle DOM traversal.
4. Dynamic locators must be page/component methods with typed arguments.
5. Verify every new selector in the live UI with `playwright-cli`.

## Interactions and waiting

- Use relative paths so `baseURL` remains configurable.
- Rely on Playwright auto-waiting and web-first assertions.
- Never use `waitForTimeout`, sleeps, or arbitrary retries.
- Wait for an observable outcome: URL, response, visible state, enabled control, or text.
- Keep all browser interaction inside a page object or component wrapper.

## Assertions

- Keep scenario outcomes in tests.
- Page objects may expose assertion-friendly locators or state-query methods.
- Put only broadly reusable web-first checks in `Validate`.
- Do not hide a test's central expectation inside a page action.

## TypeScript and naming

- Strict typing is required; do not use `any` or unsafe casts.
- Use ES imports/exports, `async`/`await`, `readonly` fields, and explicit `Promise<void>` returns.
- Files use kebab-case suffixes: `.page.ts`, `.locators.ts`, `.fixture.ts`, `.workflow.ts`, `.util.ts`, and `.spec.ts`.
- Classes and types use PascalCase; methods and variables use camelCase; constants use UPPER_SNAKE_CASE.
- Test titles describe behavior and expected outcome in plain English.

## Safety and isolation

- Never commit credentials or use real user data.
- Do not create accounts while exploring the UI. Account creation in automated tests must use approved disposable test services.
- Each test owns its state and must run alone or in parallel unless explicitly documented otherwise.
- Do not add dependencies without a concrete framework need and justification.
