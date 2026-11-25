# AI Assistant Guide

This guide tells an agent how to approach work in this repository. The root `AGENTS.md` is canonical; these documents expand it with repository-specific details and examples.

## Documentation index

Read only the relevant sections, but always start with the architecture:

1. [Framework architecture](../framework/architecture.md) — complete repository tree, layer ownership, dependencies, runtime flow, configuration, Docker, and CI.
2. [Authoring guide](../guides/authoring-tests.md) — step-by-step instructions for tests, pages, locator modules, component wrappers, workflows, fixtures, clients, validations, and utilities.
3. [Test conventions](../guides/test-conventions.md) — strict POM/OOP, locators, waiting, assertions, isolation, data, tags, naming, and security.
4. [Command reference](../reference/commands.md) — installation, CLI options, test selection, reports, type checking, Docker, CI, and troubleshooting.

## Before changing anything

1. Read `AGENTS.md`.
2. Check the working tree and preserve all unrelated changes.
3. Identify the smallest existing feature that resembles the request.
4. Read its specification, test data, page objects, locator modules, and fixtures together.
5. Determine whether the request is a test-only change or requires a framework extension.
6. Inspect the real application when routes, selectors, accessible names, or UI behavior are involved.
7. State architectural changes before implementing them.

Do not treat an existing pattern as correct automatically. Some current tests and pages are transitional and intentionally documented as examples of behavior rather than style.

## Change classification

Use this table to choose the correct layer.

| Need | Correct location | Do not put it in |
| --- | --- | --- |
| New scenario or expected outcome | `tests/<feature>/` | Page object |
| Data used by one feature | `tests/<feature>/test-data/` | Utility class |
| Data type shared by features | `infra/data/` | Random test file |
| Locator or action for one page | `infra/domain/web/pages/` and `locators/` | Test |
| Reusable UI region on multiple pages | `infra/domain/web/components/` | Base page |
| Reusable journey spanning pages | `infra/logic/` | Page object or fixture |
| Page/client/workflow construction | `infra/core/fixtures/` | Test hook |
| External API or email integration | `infra/core/clients/` | Page object |
| Generic repeated assertion | `infra/core/validations/` | Workflow |
| Small application-neutral helper | `infra/utils/` | Page object superclass |
| New CLI option or command | `infra/core/cli/` | Playwright configuration |
| Browser/test/reporter setting | `playwright.settings.json` | Individual test |
| Configuration loading/transformation | `playwright.config.ts` | Test fixture |

## Implementation workflow

### For a new test using existing objects

1. Add the spec under the correct feature directory.
2. Import the narrowest fixture that exposes the required dependencies.
3. Reuse page intent methods; do not reach into raw Playwright UI APIs.
4. Add typed or JSON test data beside the feature when useful.
5. Keep the test's key expectations visible in the spec.
6. Add suitable tags.
7. Type-check, list the test, then run it by file or exact title.

### For a new page or UI behavior

1. Verify the route and stable selector contract in the live UI.
2. Add or update a page-specific locator constants module.
3. Implement the page object with focused actions and explicit types.
4. Extract a component wrapper if the UI region is shared by multiple pages.
5. Register the page in `pages.fixture.ts`.
6. Use it from a test; never instantiate it directly in the test.
7. Validate discovery and behavior.

### For a reusable cross-page flow

1. Confirm at least two scenarios need the same journey.
2. Keep page actions in page objects.
3. Add a workflow class that coordinates those page objects through constructor injection.
4. Register the workflow in a fixture.
5. Keep scenario-specific assertions and branch expectations in tests.

### For a client or infrastructure change

1. Keep browser-independent integration logic in `infra/core/clients/`.
2. Add a contract under `clients/contracts/` when the boundary returns structured data.
3. Read secrets from configuration or environment variables; never embed new credentials.
4. Decide fixture scope deliberately: test scope for mutable/isolated state, worker scope only for safely shared resources.
5. Add clear error messages for unavailable external dependencies.

## Review checklist

Before finishing, verify:

- The change lives in the correct layer.
- Tests contain no new locators or raw application UI actions.
- Page objects contain no fixture setup or unrelated multi-page orchestration.
- Component wrappers are composed, not inherited.
- New selectors use verified `data-qa` values when available.
- No hard wait, debug pause, generated selector, secret, or real user data was added.
- New public APIs have strict types and intentional names.
- Tests are isolated or any serial dependency is explicit and justified.
- Type checking, discovery, and relevant execution results are reported accurately.
- Documentation was updated if the framework contract changed.

## Preserve scope

Do not reformat, rename, or refactor unrelated code while implementing a focused request. When touched code contains a legacy pattern, improve only what is necessary and safe for the requested change. Report larger cleanup opportunities separately instead of silently expanding the task.
