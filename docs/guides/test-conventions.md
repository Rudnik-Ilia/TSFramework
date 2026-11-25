# Test and TypeScript Conventions

## Strict Page Object Model

The framework uses strict POM boundaries, not merely page-shaped helper files.

Tests may:

- Request typed pages, clients, and workflows from fixtures
- Pass test data into public methods
- Coordinate scenario-specific branches
- Read returned domain state or assertion-friendly page state
- Perform the scenario's expectations

Tests must not:

- Create application locators with `getBy*`, `locator`, CSS, or XPath
- Call raw application UI actions such as `click`, `fill`, `check`, or `selectOption`
- Navigate with `page.goto` for application routes
- Depend on DOM structure or selector details
- Construct page objects directly

Page objects may:

- Own relative routes and route matchers
- Create page-specific locators
- Perform page-specific actions
- Compose shared component wrappers
- Expose a limited locator or state method for test assertions
- Wait for a route or page-owned observable state

Page objects must not:

- Read test data files
- Import fixtures or specs
- Own an entire reusable multi-page journey
- Hide scenario-specific branching or expected outcomes
- Store credentials or environment configuration

## OOP design

- One class has one clear responsibility.
- Constructor parameters make dependencies explicit.
- Fields are `readonly` unless mutation is essential.
- Implementation locators are `private`; assertion surfaces are intentionally public.
- Prefer small methods and cohesive classes over large inheritance hierarchies.
- Prefer composition for shared behavior and UI.
- Use `BasePage` only for behavior universal to navigable pages.
- Do not add methods to `BasePage` merely to reduce a few lines in two pages.
- Avoid static mutable state and singleton clients.
- Do not create empty interfaces, marker base classes, or wrappers that add no behavior or boundary.

## Locator priority

Playwright maps `getByTestId()` to the application's `data-qa` attribute through `playwright.settings.json`.

Use locators in this order:

1. `getByTestId` for an available stable `data-qa` value
2. `getByRole` with a stable accessible name
3. `getByLabel` for associated form controls
4. Exact visible text when text is stable and user-facing
5. A carefully scoped structural locator only when no stable contract exists

Examples:

```ts
page.getByTestId("signInButton");
page.getByRole("heading", { name: "Log in to your account", level: 1 });
page.getByLabel("Email address");
page.getByText("Welcome to Talkspace!", { exact: true });
```

Avoid:

- Generated IDs such as `inputId17`
- Generated classes such as `css-1f5g2vo`
- XPath
- `nth()`, `first()`, or `last()` used to hide an ambiguous selector
- Long CSS chains and parent/sibling traversal
- Text that changes by locale or experiment when a test ID exists
- Selector values copied without live verification

When multiple elements legitimately share a test ID, narrow them with stable semantic content inside the page/component. If uniqueness is expected, treat duplicate matches as an application/testability problem rather than selecting by position.

## Dynamic locators

Dynamic locator construction remains inside the owner:

```ts
private countryOption(countryCode: string): Locator {
  return this.page.getByTestId(`${COUNTRY_OPTION_PREFIX}${countryCode}`);
}

async selectCountry(countryName: string, countryCode: string): Promise<void> {
  await this.countryDropdown.click();
  await this.countrySearch.fill(countryName);
  await this.countryOption(countryCode).click();
}
```

Validate or constrain arguments when invalid input would produce a misleading selector.

## Navigation and URLs

- Store relative routes on the owning page, normally as `static readonly path`.
- Use `page.goto(PageClass.path)` only inside the page object.
- Use `waitForURL` for redirect-driven pages.
- For dynamic routes, match the pathname with an intentionally anchored predicate or regular expression.
- Avoid asserting a full environment-specific origin when the pathname is sufficient.
- Keep URL fragments/query construction in the page if it is part of that page's navigation contract.

## Actions and waiting

Playwright actions auto-wait for actionability. Do not add a manual wait before a normal click or fill unless a separate observable event must occur.

Allowed synchronization includes:

- `expect(locator).toBeVisible()` or another web-first assertion
- `page.waitForURL()` for a redirect
- `page.waitForResponse()` registered before the triggering action
- `Promise.all([wait, trigger])` when an event can happen immediately
- Locator assertions for enabled, checked, value, text, or attribute state

Forbidden synchronization includes:

- `page.waitForTimeout()`
- `setTimeout` or sleep helpers
- Repeating an action until it happens to pass
- Inflating global timeouts to hide a race
- `networkidle` as a default readiness signal for a continuously active application

Use a specific timeout only when the external boundary has a documented service-level expectation, such as waiting for email. Keep it close to that boundary and give timeout failures useful context.

## Assertions

Use Playwright web-first assertions because they retry until the expected state or timeout.

Preferred:

```ts
await expect(signupPage.passwordError).toBeHidden();
await expect(page).toHaveURL(/\/signup/);
```

Avoid immediate boolean assertions on asynchronous UI state:

```ts
expect(await locator.isVisible()).toBe(true);
```

Rules:

- Keep the test's main outcome in the test.
- Use `Validate` for small generic checks already standardized by the framework.
- Do not add a page method named `verifyEverything()` that hides multiple expectations.
- A page may expose an assertion-friendly locator or a typed state method.
- Use `expect.poll` only when observing non-locator state that cannot use a web-first locator assertion.

## Test structure

Use `test.describe` to group one behavior area. Keep setup local and explicit unless a fixture owns resource construction.

A clear test normally reads as:

1. Arrange data/resource state
2. Navigate through a page object
3. Act through page or workflow methods
4. Assert the user-visible or service-visible outcome

Avoid long scripts that test several unrelated outcomes. If a failure would make it unclear which behavior broke, split the scenario while preserving state independence.

## Isolation, parallelism, and serial tests

`fullyParallel` is enabled and the default worker count is four. Every test must assume that other tests may run simultaneously and in a different order.

- Do not share mutable module-level state.
- Use unique disposable input when the application persists data.
- Do not reuse a fixed account when concurrent actions can conflict.
- Clean up created external resources where supported.
- A test must pass when run by itself.
- Prefer one test containing a required sequential journey over two tests that share state.
- Use `Serial()` only when the business scenario truly requires cross-test state and explain the reason in the suite.

Worker fixtures persist across multiple tests on the same worker. A mutable worker-scoped client can retain inbox or response state; use test scope when isolation matters.

## Tags and selection

Available tags are defined in `infra/utils/markers.util.ts`:

- `TestTags.SMOKE` / `@smoke` — small set of critical health checks
- `TestTags.REGRESSION` / `@regression` — broader behavioral coverage
- `TestTags.SANITY` / `@sanity` — focused confidence after a narrow change

Use:

```ts
test("critical login works", Markers(TestTags.SMOKE, TestTags.REGRESSION), async ({ loginPage }) => {
  // Scenario
});
```

Combined CLI tag flags use AND semantics. A test tagged with both smoke and regression matches `--smoke --regression`.

Do not use tags as a substitute for feature directories or descriptive titles.

## Data-driven tests

Data-driven loops are appropriate when the workflow and assertion remain the same and only inputs/expected values change.

- Keep data readable and scenario-focused.
- Include a description field when values do not create a clear title.
- Generate a unique test title for every row.
- Do not place secrets in JSON.
- Use reserved/example domains for validation-only addresses.
- Avoid hundreds of nearly identical UI cases when a smaller equivalence set plus boundary cases provides the intended coverage; do not omit genuine boundaries solely for runtime reasons.

If rows require different branches or assertions, use separate tests instead of a large conditional data loop.

## Email and API scenarios

- Record `since = new Date()` immediately before the action that triggers an email to avoid matching an older message.
- Match emails by inbox, subject, time, and expected structure.
- Attach safe diagnostic metadata, not secret content.
- Register `waitForResponse` before triggering the UI action to avoid races.
- Assert or explicitly handle every expected response status.
- Keep API transport logic in clients and scenario meaning in tests/workflows.
- Never log API keys, authorization headers, session tokens, OTPs, or passwords.

## Attachments and diagnostics

Use `Attacher` for small useful report context such as safe IDs, email addresses created specifically for the test, and response status metadata.

Do not attach:

- API keys or tokens
- Full authorization headers
- Real personal data
- Passwords or reusable OTPs
- Very large payloads without a debugging need

Traces and failure screenshots are already configured. Avoid duplicating large artifacts.

## TypeScript standards

- `strict` is enabled and required.
- Do not use `any`, `@ts-ignore`, or unchecked type assertions.
- Use `unknown` for untrusted input and narrow it.
- Use `import type` for type-only imports.
- Prefer readonly properties and immutable input objects.
- Public async methods use explicit `Promise<...>` return types.
- Use `async`/`await`; do not mix promise chains without a reason.
- Avoid non-null assertions. Validate required state and throw a descriptive error.
- Use discriminated unions or literal unions for closed sets.
- Keep functions small and names descriptive.
- Remove unused imports, types, constants, and dead comments.

## Naming

Files:

- `login.page.ts`
- `login.locators.ts`
- `otp-input.component.ts`
- `login-with-two-factor.workflow.ts`
- `email.fixture.ts`
- `api.client.ts`
- `validate.validation.ts`
- `random.util.ts`
- `login.spec.ts`
- `valid-login.data.json`

Code:

- Classes/interfaces/types: PascalCase
- Methods/functions/variables: camelCase
- Constants: UPPER_SNAKE_CASE
- Fixture properties: camelCase ending in the object role, such as `loginPage` or `mailClient`
- Boolean names: `is`, `has`, `can`, or `should` when appropriate
- Test titles: plain-English behavior plus expected outcome

Use verbs for actions (`submit`, `selectCountry`, `waitForRedirect`) and nouns for objects/state (`heading`, `inboxInfo`). Do not introduce capitalized method names.

## Decorated steps

Use `@step` on meaningful public actions to improve report readability:

- `LoginPage.login`
- `SignupPage.fillAccountDetails`
- `EmailResendPage.resendEmail`

Do not decorate every private field helper or one-line locator factory. Step names are derived from class and method names, so choose stable, readable method names.

## Credentials and safety

- Never commit new secrets or real credentials.
- Read required secrets from environment/configuration.
- Never submit real user credentials during UI inspection.
- Do not create persistent accounts during inspection.
- Automated account creation uses approved disposable resources and should clean them up when supported.
- Do not print secret environment variables in logs, reports, or command output.
- Existing embedded configuration is legacy debt, not a template.

## Common anti-patterns

Do not add:

- Locators or raw UI actions in a spec
- Assertions hidden in a generic action method
- `waitForTimeout`
- `page.pause()` in committed test paths
- Fixed credentials in test source
- A component wrapper used by only one simple page
- A workflow for one page action
- Navigation inside a normal fixture
- A page that imports another page merely to continue a scenario; use a workflow
- A global mutable client or test data object
- Catch-and-ignore blocks that turn failures into passes
- Conditionals that accept any unexpected application state
- Focused `.only` tests or accidental `.skip`

## Review checklist

- Is every UI locator/action owned by a page or component?
- Does the class have one responsibility?
- Is shared UI composed rather than inherited?
- Are selectors stable, verified, and test-ID-first?
- Are waits tied to observable outcomes?
- Are the important expectations visible in the test?
- Can the test run alone and in parallel?
- Are data and external resources unique and safe?
- Are all public APIs strictly typed and consistently named?
- Are logs and attachments free of secrets?
- Are debug pauses, hard waits, dead comments, and focused tests absent?
