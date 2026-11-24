# Adding Tests and Framework Objects

## Add a test

1. Create or extend `tests/<feature>/<feature>.spec.ts`.
2. Put scenario-specific JSON under the feature's `test-data/` directory.
3. Import `test` from the narrowest fixture (`pages.fixture` or `email.fixture`), never directly from Playwright when framework fixtures are needed.
4. Arrange through fixtures and data, act through public page/workflow methods, and assert with `expect` or `Validate`.
5. Apply tags with `Markers(TestTags.SMOKE)` or `Markers(TestTags.REGRESSION)`.

```ts
test("shows an error for invalid credentials", Markers(TestTags.REGRESSION), async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.login(user.email, user.password);
  await expect(loginPage.authenticationError).toBeVisible();
});
```

Tests must be independent. Use serial mode only when a scenario intentionally creates state that a later test consumes and cannot be modeled as one test.

## Add a page object

1. Verify the route and every selector with `playwright-cli`.
2. Add page-specific locator values under `infra/domain/web/locators/<page>.locators.ts`.
3. Create `infra/domain/web/pages/<feature>/<page>.page.ts` and extend `BasePage`.
4. Define a static relative `path`, initialize typed `Locator` fields in the constructor, and expose small intent-level methods.
5. Register the page in `PageFixtures` and construct it in `pages.fixture.ts`. The fixture must not navigate.

```ts
export class ExamplePage extends BasePage {
  static readonly path = "/example";
  private readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.submitButton = page.getByTestId("exampleSubmitButton");
  }

  async goto(): Promise<void> {
    await this.page.goto(ExamplePage.path);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }
}
```

## Add a component wrapper

Use a wrapper only for a cohesive UI region reused by multiple pages, such as an OTP input, header, modal, or country selector.

- Place it under `infra/domain/web/components/`.
- Accept a `Page` or stable root `Locator` in the constructor.
- Own all locators and actions inside that component.
- Compose it into pages; do not make pages inherit from components.
- Keep navigation and page-specific assertions out of the component.

```ts
export class OtpInputComponent {
  constructor(private readonly root: Locator) {}

  async fill(code: string): Promise<void> {
    // Component-owned locators and interactions only.
  }
}
```

## Add a workflow or another class

- Add `infra/logic/<name>.workflow.ts` only for a reusable flow spanning multiple page objects. Inject its page objects through the constructor and register it in a fixture.
- Add API/email integrations under `infra/core/clients/`; keep Playwright UI locators out of clients.
- Add shared input types under `infra/data/` and small application-neutral helpers under `infra/utils/`.
- Every class should have one responsibility, explicit constructor dependencies, strict types, and focused methods. Avoid static global state and `any`.
