# Authoring Tests and Framework Objects

This guide explains how to add each kind of code without breaking strict Page Object Model and OOP boundaries.

## Start with the scenario

Before creating a class, write down:

- The user-visible behavior under test
- The starting state and required data
- The pages and external services involved
- The observable expected outcome
- Whether existing page methods already cover the required actions
- Whether the behavior must be reused by another scenario

Choose the smallest implementation. A new test often needs only existing fixtures and page methods. Do not create a workflow, component, client, or base class preemptively.

## Add a new test with existing pages

### Location

Use `tests/<feature>/<behavior>.spec.ts`. Place data used only by that feature under `tests/<feature>/test-data/`.

### Imports

Import `test` from the narrowest fixture:

- `infra/core/fixtures/pages.fixture` for page-only scenarios
- `infra/core/fixtures/email.fixture` when `MailClient` is required

Import `expect` from the same fixture when practical. Use `Markers` and `TestTags` for selection.

### Structure

```ts
import { test, expect } from "../../infra/core/fixtures/pages.fixture";
import { Markers, TestTags } from "../../infra/utils/markers.util";

test.describe("Login validation", () => {
  test(
    "shows an authentication error for invalid credentials",
    Markers(TestTags.REGRESSION),
    async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.login("invalid@example.test", "invalid-password");

      await expect(loginPage.authenticationError).toBeVisible();
    },
  );
});
```

The example assumes `authenticationError` is defined by `LoginPage`; the test must not create that locator itself.

### Test rules

- The title describes behavior and outcome, not implementation steps.
- Arrange state, act through public page/workflow APIs, and assert in the spec.
- Do not use raw `page.getBy*`, `page.locator`, `page.goto`, `click`, or `fill` for application UI in the test.
- Do not hide the scenario's key expected result inside a page action.
- Do not rely on another test having run first.
- Prefer one complete user behavior per test.

## Add a locator module

Create `infra/domain/web/locators/<page-name>.locators.ts` when a new page or cohesive component needs reusable locator values.

```ts
export const EXAMPLE_HEADING = "Example account page";
export const EXAMPLE_EMAIL_INPUT = "exampleEmailInput";
export const EXAMPLE_SUBMIT_BUTTON = "exampleSubmitButton";
export const EXAMPLE_OPTION_PREFIX = "exampleOption-";
```

Rules:

- Constants hold stable values, not `Locator` instances.
- Prefer one module per page or reusable component.
- Use UPPER_SNAKE_CASE and include the page/component context in the name.
- Do not add constants for guessed selectors.
- Dynamic values such as an option suffix are joined inside the owning page/component method.

## Add a new page object

### Step 1: verify the UI contract

Confirm the exact relative route, redirects, `data-qa` values, accessible roles/names, conditional states, and successful action outcome in the live application. Do not create an implementation from screenshots or assumptions alone.

### Step 2: create the page class

Place it at `infra/domain/web/pages/<feature>/<page-name>.page.ts`. A top-level page may live directly under `pages/`; group related page families in a feature subdirectory such as `pages/log-in/`.

New navigable pages extend `BasePage`.

```ts
import type { Locator, Page } from "@playwright/test";

import { step } from "../../../utils/step.util";
import {
  EXAMPLE_EMAIL_INPUT,
  EXAMPLE_HEADING,
  EXAMPLE_SUBMIT_BUTTON,
} from "../locators/example.locators";
import { BasePage } from "./base.page";

export class ExamplePage extends BasePage {
  static readonly path = "/example";

  readonly heading: Locator;
  private readonly emailInput: Locator;
  private readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole("heading", { name: EXAMPLE_HEADING, level: 1 });
    this.emailInput = page.getByTestId(EXAMPLE_EMAIL_INPUT);
    this.submitButton = page.getByTestId(EXAMPLE_SUBMIT_BUTTON);
  }

  @step
  async goto(): Promise<void> {
    await this.page.goto(ExamplePage.path);
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  @step
  async submit(email: string): Promise<void> {
    await this.fillEmail(email);
    await this.submitButton.click();
  }
}
```

### Page design rules

- `static readonly path` is a relative route. Use a route matcher for dynamic paths.
- Initialize locators once in the constructor when possible.
- Keep action methods small and intention-revealing.
- Make implementation locators private. Expose a readonly locator only when tests need direct web-first assertions.
- Return useful domain state when an action naturally produces it; do not return arbitrary Playwright internals.
- Use `@step` on business actions that improve reports.
- Avoid assertions in action methods. An optional page-specific state method may return a value or locator for the test to assert.
- If a page cannot be directly navigated to, model `waitForRedirect()` clearly; do not add a misleading `goto()` that throws a generic error.

### Step 3: register the fixture

Update `infra/core/fixtures/pages.fixture.ts` in three places:

1. Import the class.
2. Add the property to `PageFixtures`.
3. Add a constructor fixture using `page` and `use`.

```ts
interface PageFixtures {
  examplePage: ExamplePage;
}

export const test = base.extend<PageFixtures>({
  examplePage: async ({ page }, use) => {
    await use(new ExamplePage(page));
  },
});
```

The fixture constructs only. Do not call `goto()`, log in, seed state, or assert inside an ordinary page fixture.

### Step 4: add the scenario

Use the injected `examplePage` from a spec. Do not call `new ExamplePage(page)` in the test.

## Add a component wrapper

A component wrapper is a Page Object for a cohesive region rather than an entire route. Create one only when the same UI contract appears on at least two pages or when a complex component needs an independent, reusable API.

Good candidates:

- Six-digit OTP input
- Shared header/navigation
- Country/state selector
- Reusable confirmation modal
- Date picker or autocomplete

Location: `infra/domain/web/components/<name>.component.ts`.

```ts
import type { Locator } from "@playwright/test";

export class OtpInputComponent {
  static readonly codeLength = 6;

  constructor(private readonly root: Locator) {}

  private digitInput(index: number): Locator {
    return this.root.getByTestId(`verificationCodeInput${index}`);
  }

  async fill(code: string): Promise<void> {
    if (!/^\d{6}$/.test(code)) {
      throw new Error("OTP code must contain exactly six digits.");
    }

    for (let index = 0; index < OtpInputComponent.codeLength; index += 1) {
      await this.digitInput(index).fill(code[index]);
    }
  }
}
```

Compose the wrapper into pages:

```ts
export class TwoFactorVerifyPage extends BasePage {
  readonly otp: OtpInputComponent;

  constructor(page: Page) {
    super(page);
    this.otp = new OtpInputComponent(page.getByTestId("otpContainer"));
  }
}
```

Component rules:

- Accept a stable root `Locator` or `Page` through the constructor.
- Own every locator and interaction inside the component.
- Do not navigate between pages.
- Do not import fixtures or tests.
- Do not make a page inherit from a component; compose it.
- Do not create a wrapper for a one-off button or field.

## Add a reusable workflow

Create `infra/logic/<journey>.workflow.ts` only when a multi-page journey is reused by more than one scenario.

```ts
export class LoginWithTwoFactorWorkflow {
  constructor(
    private readonly loginPage: LoginPage,
    private readonly twoFactorVerifyPage: TwoFactorVerifyPage,
    private readonly mailClient: MailClient,
  ) {}

  async execute(email: string, password: string, since: Date): Promise<void> {
    await this.loginPage.goto();
    await this.loginPage.login(email, password);
    await this.twoFactorVerifyPage.waitForRedirect();

    const code = await this.mailClient.getEmailOneTimeLoginPass(
      "One time login password",
      since,
    );
    await this.twoFactorVerifyPage.fillCode(code);
    await this.twoFactorVerifyPage.continue();
  }
}
```

Register a workflow in a fixture by injecting its existing page/client fixtures and passing them to the constructor. The workflow may coordinate actions but must not define UI locators or hide scenario-specific expectations.

Do not create a workflow for a single-page form action; that belongs in its page object.

## Add or extend a fixture

Choose scope deliberately:

- Test scope is the default and provides isolation.
- Worker scope is for expensive resources that are demonstrably safe to share across tests on the same worker.

For a worker fixture:

```ts
interface WorkerFixtures {
  serviceClient: ServiceClient;
}

export const test = pagesTest.extend<{}, WorkerFixtures>({
  serviceClient: [
    async ({}, use) => {
      const client = new ServiceClient();
      await use(client);
      await client.dispose();
    },
    { scope: "worker" },
  ],
});
```

Add teardown when the resource needs cleanup. Never make a mutable client worker-scoped without understanding parallel behavior and state leakage.

## Add an external-service or API client

Place browser-independent integrations under `infra/core/clients/`. Add response/data contracts under `infra/core/clients/contracts/`.

Client rules:

- Inject configuration through the constructor or environment.
- Fail clearly if required configuration is absent.
- Use `unknown` at untrusted boundaries and narrow/validate it.
- Return typed data or raw responses intentionally.
- Do not make scenario assertions inside clients.
- Do not reference UI locators or page classes.
- Never embed an API key, token, password, or personal user data.

```ts
export class ServiceClient {
  constructor(
    private readonly apiKey: string,
    private readonly request: APIRequestContext,
  ) {
    if (apiKey.length === 0) {
      throw new Error("SERVICE_API_KEY is required.");
    }
  }
}
```

## Add validation helpers

Add a static method to `Validate` only when the same generic web-first assertion is repeated.

```ts
static async checked(locator: Locator): Promise<void> {
  await expect(locator).toBeChecked();
}
```

Do not add business-specific methods such as `loginSucceeded()` to `Validate`. Keep those expectations in the scenario or expose relevant page state.

## Add a utility

Use `infra/utils/` for a small, focused helper that is reusable and not owned by a page, workflow, client, or test.

Before adding a utility, ask:

- Is it application-neutral?
- Does it have one clear responsibility?
- Is an existing utility the correct home?
- Can it be a simple function rather than a class?
- Can it be deterministic and unit-testable?

Do not place domain workflows, selectors, test data, or service configuration in `utils`.

## Add test data

Use feature-local data for feature-local scenarios:

```text
tests/signup-filling/
├── signup-validation.spec.ts
└── test-data/
    └── invalid-signup.data.json
```

Use descriptive property names and fake/reserved data. Keep credentials out of JSON. For non-trivial shapes, define a TypeScript type and assign imported data to it so schema changes fail during type checking.

Move data to `infra/data/` only when multiple unrelated features share the same domain type or factory. Do not centralize all data into one global file.

## Add a CLI option

When extending `npm run qa`:

1. Add the option to `TestCommandOptions` if it applies to test commands.
2. Define the Commander option in `program.cli.ts`.
3. Add a parser in `cli-args.validation.ts` when validation is required.
4. Translate it in `playwright-arguments.cli.ts`.
5. Keep process execution in `process-runner.cli.ts`.
6. Update help examples, `README.md`, and `docs/reference/commands.md`.
7. Validate valid and invalid input plus exit-code propagation.

## Refactoring repeated code

Use this order:

1. Repeated locator/action on one page: private page helper.
2. Cohesive action used multiple times on one page: public page intent method.
3. Same UI region on multiple pages: component wrapper.
4. Same journey across multiple pages: workflow.
5. Browser-independent repeated integration: client.
6. Application-neutral repeated operation: utility.

Avoid a new abstraction when duplication is accidental, tiny, or likely to evolve differently.

## Validation after authoring

At minimum:

1. Run `npx tsc --noEmit --project tsconfig.json`.
2. Run `npm run qa -- list` or list the affected file.
3. Run the narrowest affected test by file/title/tag.
4. Run the broader feature suite when shared pages, components, fixtures, clients, configuration, or CLI behavior changed.
5. Confirm no debug pause, focused test, secret, generated output, or unrelated edit remains.
