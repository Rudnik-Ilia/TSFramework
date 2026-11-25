# AI Test Generation Assistant

This file is the canonical instruction source for agents working in this repository. Read it before editing code. Detailed examples and inventories are linked below.

## Project

This repository is a TypeScript and Playwright Test E2E framework for the Talkspace Canary application at `https://app.canary.talkspace.com`.

Current coverage includes authentication, signup, email verification, two-factor authentication, and early onboarding routes. The framework also contains a project-specific CLI, MailSlurp integration, Docker execution, and a scheduled GitHub Actions workflow.

Primary stack:

- Node.js and npm
- TypeScript with strict type checking
- Playwright Test
- Commander for the QA CLI
- MailSlurp for disposable inboxes and verification codes
- Docker Compose and GitHub Actions for CI execution

## Required reading

Read these documents before making a relevant change:

1. [AI assistant workflow](docs/ai-assistant/README.md)
2. [Complete framework architecture and repository map](docs/framework/architecture.md)
3. [How to add tests, pages, wrappers, fixtures, workflows, and clients](docs/guides/authoring-tests.md)
4. [Test, locator, waiting, data, and TypeScript conventions](docs/guides/test-conventions.md)
5. [Commands, configuration, reports, Docker, and CI](docs/reference/commands.md)

## Repository map

```text
.github/workflows/              Scheduled and manually triggered CI workflows
docs/                           Agent-facing framework documentation
infra/core/cli/                 Project-specific QA command-line interface
infra/core/clients/             API and external-service clients
infra/core/clients/contracts/   Client-specific TypeScript contracts
infra/core/fixtures/            Playwright fixture composition and dependency injection
infra/core/validations/         Small reusable web-first assertion helpers
infra/domain/web/locators/      Stable locator values used by page objects
infra/domain/web/pages/         Page Objects grouped by feature
infra/utils/                    Small cross-cutting utilities
tests/                          E2E specifications grouped by feature
tests/**/test-data/             Scenario data local to a test feature
```

Create these folders only when the corresponding abstraction becomes necessary:

```text
infra/domain/web/components/    UI component wrappers shared by multiple pages
infra/logic/                    Reusable workflows spanning multiple pages
infra/data/                     Typed data shared by multiple test features
test-assets/                    Files uploaded or consumed by tests
```

Top-level runtime files:

- `executor.ts` starts the QA CLI.
- `playwright.config.ts` loads and transforms `playwright.settings.json`.
- `playwright.settings.json` contains test, reporter, browser, timeout, and base URL settings.
- `package.json` contains npm scripts and dependencies.
- `Dockerfile` and `compose.yaml` define container execution.
- `README.md` is the human-facing quick start.

## Mandatory operating workflow

1. Read the nearest existing test, page, fixture, locator module, and test data before editing.
2. Inspect the live UI before adding a selector. Never guess a route, `data-qa` value, accessible name, or state transition.
3. Explain any architecture change before implementing it.
4. Make the smallest change that satisfies the request and follows the dependency boundaries below.
5. Preserve unrelated and pre-existing user changes.
6. Do not add a dependency unless the existing stack cannot solve the problem; document the reason.
7. After implementation, run TypeScript checking, Playwright test discovery, and the narrowest relevant tests.

## Strict architecture boundaries

The intended dependency direction is:

```text
tests
  -> workflows (only for reusable multi-page journeys)
  -> page objects
       -> shared component wrappers
       -> locator constants
  -> fixtures
  -> service clients / validations / utilities
```

Rules:

- Tests describe scenarios, provide data, coordinate objects, and assert outcomes.
- Tests must not create application locators or perform raw application UI actions.
- Page objects own one page or route family: navigation, page locators, and page-specific actions.
- Component wrappers own a cohesive UI region reused by at least two pages and are composed into pages.
- Workflows coordinate multiple page objects only when the same journey is reused.
- Fixtures construct and supply dependencies. Ordinary fixtures must not navigate or perform scenario actions.
- Clients own browser-independent API or third-party service behavior and must not contain UI locators.
- Utilities stay small and application-neutral. Do not turn `utils` into a miscellaneous business-logic layer.
- Domain code must never import tests. Page objects and components must never import fixtures.

## Page Object Model and OOP rules

- Every application locator and UI interaction belongs in a page object or shared component wrapper.
- New navigable pages extend `BasePage`; keep `BasePage` minimal and application-neutral.
- Prefer composition over inheritance for shared UI.
- Use inheritance only for a genuine is-a relationship; avoid deep class hierarchies.
- Constructor dependencies must be explicit and typed.
- Keep fields `readonly`. Keep implementation-only locators `private`; expose a locator only when a test needs it for a direct web-first assertion.
- Public methods describe user intent, for example `login`, `fillAccountDetails`, `selectCountry`, or `resendCode`.
- Keep methods small. A method should perform one coherent action or one clearly named business operation.
- Add the `@step` decorator to meaningful reportable actions, not every internal helper.
- Avoid global mutable state, static scenario state, unnecessary base classes, and abstractions with only one trivial caller.

## Locator rules

Playwright is configured with `testIdAttribute: "data-qa"`.

1. Use `page.getByTestId("value")` whenever `data-qa` exists.
2. If no test ID exists, prefer `getByRole` with an accessible name, then `getByLabel`, then exact visible text.
3. Put reusable locator values in the page's `*.locators.ts` module.
4. Keep dynamic locator construction inside a typed page or component method.
5. Never use generated IDs, generated CSS classes, XPath, positional selectors, or brittle DOM traversal.
6. Verify selectors against the live UI before committing them.

## Interaction, waiting, and assertion rules

- Use relative paths so `baseURL` remains configurable.
- Rely on Playwright actionability and auto-waiting.
- Never use `waitForTimeout`, sleeps, or hardcoded delays for synchronization.
- Wait for an observable outcome: URL, response, visible state, enabled state, attribute, or text.
- Use web-first assertions.
- Keep scenario-defining assertions in test files.
- Page objects may expose assertion-friendly locators or state-query methods but must not hide the test's central expected outcome inside an action.
- Add a method to `Validate` only when the assertion is generic and reused.

## Tests, fixtures, and data

- Keep tests independent, deterministic, and safe to run alone or in parallel.
- Use serial mode only for a deliberately stateful scenario that cannot reasonably be one test; document why state is shared.
- Import `test` from the narrowest framework fixture: `pages.fixture.ts` for UI-only tests and `email.fixture.ts` when email is required.
- Register every new page, component-backed page, client, or workflow in the appropriate typed fixture.
- Put feature-local JSON under `tests/<feature>/test-data/`.
- Define TypeScript interfaces for non-trivial data shapes; validate assumptions at the boundary.
- Use `Markers` and `TestTags` for `@smoke`, `@regression`, and `@sanity` selection.
- Never leave `page.pause()` in committed automated scenarios or CI paths.

## TypeScript rules

- Strict typing is mandatory. Do not use `any`, `@ts-ignore`, or unsafe casts to bypass errors.
- Prefer `unknown` at external boundaries and narrow it safely.
- Use ES imports and exports, `async`/`await`, meaningful names, and explicit return types for public methods.
- Use PascalCase for classes and types, camelCase for methods and variables, and UPPER_SNAKE_CASE for constants.
- Follow file suffixes such as `.page.ts`, `.locators.ts`, `.fixture.ts`, `.workflow.ts`, `.client.ts`, `.validation.ts`, `.util.ts`, and `.spec.ts`.

## Credentials and external services

- Never add or expose real credentials, API keys, tokens, or personal user data.
- Prefer environment variables and fail with a clear message when required configuration is missing.
- Do not create accounts or submit real credentials while inspecting the application.
- Automated account creation must use approved disposable test data and cleanup where possible.
- Treat the existing email integration as legacy-sensitive code: do not copy embedded defaults into new clients or tests.

## Definition of done

A change is complete only when:

- Architecture boundaries and strict POM rules are preserved.
- New routes and selectors were verified against the application.
- TypeScript passes with `npx tsc --noEmit --project tsconfig.json`.
- Playwright discovers the intended tests with `npm run qa -- list`.
- Relevant tests were run, or an external blocker is clearly reported.
- No debug pauses, focused tests, hard waits, secrets, generated artifacts, or unrelated edits were introduced.
- Documentation is updated when a folder, fixture, command, configuration contract, or architectural pattern changes.

## Current-state warning

Some existing files predate these rules and contain transitional patterns, including public implementation locators, page-level assertions, serial shared state, interactive pauses, inconsistent naming, and embedded service configuration. They show current behavior, not the standard for new code. Do not copy an exception merely because it already exists; improve touched code safely and avoid unrelated refactors.
