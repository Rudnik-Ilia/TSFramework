# Framework Architecture

This is a Playwright Test and TypeScript E2E framework for Talkspace Canary. TypeScript is strict and tests run against the configurable `baseURL` from `playwright.settings.json`.

## Layers

```text
tests/                         Scenarios, assertions, and test-local data
  -> infra/logic/              Reusable multi-page workflows (create only when needed)
  -> infra/domain/web/pages/   Page-specific state and behavior
       -> components/          Shared UI wrappers composed by pages (create when needed)
       -> locators/            Stable locator values
  -> infra/core/fixtures/      Object construction and dependency injection
  -> infra/core/clients/       Non-UI service clients
  -> infra/core/validations/   Small reusable web-first assertions
  -> infra/utils/              Framework-neutral helpers
```

Dependencies point downward. Domain objects must not import tests. Page objects must not depend on fixtures. Fixtures may construct pages, components, clients, and workflows, but must not navigate.

## Strict POM and OOP rules

- Tests never call `page.locator`, `getBy*`, `page.goto`, or raw `click/fill` for application UI.
- A page object owns its route, page-specific locators, and focused user actions.
- `BasePage` remains minimal: Playwright `Page`, navigation contract, and only truly universal behavior.
- Prefer composition for shared UI. A component wrapper receives a `Page` or root `Locator`; pages expose intent-level methods that delegate to it.
- Keep fields `readonly`; hide implementation locators with `private` unless a test needs a locator for a direct web-first assertion.
- Public methods describe user intent, such as `login`, `selectCountry`, or `submit`, not DOM mechanics.
- Use inheritance only for a real is-a relationship. Do not build deep page hierarchies.
- Add `@step` to meaningful business actions, not every tiny helper.
- A workflow coordinates page objects across pages; it must not define locators.

## Existing framework services

- `pages.fixture.ts` constructs page objects for each test.
- `email.fixture.ts` extends page fixtures with a worker-scoped `MailClient`.
- `Validate` provides reusable Playwright web-first checks.
- `Markers`, `TestTags`, and `Serial` configure test metadata.
- `Attacher` adds diagnostic artifacts to reports.
- `executor.ts` and `infra/core/cli/` provide the `npm run qa` command interface.
