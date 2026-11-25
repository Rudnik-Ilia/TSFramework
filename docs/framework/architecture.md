# Framework Architecture

## Purpose and scope

This repository is an end-to-end automation framework for the Talkspace Canary web application. It uses Playwright Test as the runner and browser automation library, TypeScript as the implementation language, and Node.js as the runtime.

The current test surface covers:

- Main authentication and login
- Signup form validation and country/state selection
- Account creation using disposable email
- Email verification through OTP
- Login two-factor verification
- Post-login routing to home or provider onboarding
- Initial mental-health intake screens

The framework also includes a custom QA CLI, report naming and discovery, external email/API clients, Docker execution, and a scheduled GitHub Actions pipeline.

## Architectural model

The framework uses a layered Page Object Model with strict dependency direction.

```text
Test scenario and expectations
            |
            v
Reusable workflow (only when a journey spans pages and is reused)
            |
            v
Page Object -----------------> shared component wrapper
    |                                  |
    +------------------+---------------+
                       v
              verified locator values

Fixtures construct pages, clients, and workflows.
Clients, validations, and utilities provide supporting services.
```

The essential boundaries are:

- Tests know fixtures, workflows, pages, validations, data, and utilities.
- Workflows know page objects and clients required for a reusable journey.
- Page objects know Playwright, their locator values, component wrappers, and small generic validation helpers.
- Component wrappers know Playwright and the UI region they own.
- Fixtures know constructors but do not execute scenarios.
- Clients know external APIs but do not know page locators.
- No production framework layer imports from `tests/`.

## Complete repository map

### `.github/`

GitHub-hosted automation.

```text
.github/
└── workflows/
    └── nightly-e2e.yml
```

`nightly-e2e.yml` can be manually dispatched and is scheduled for November 14 at 20:00 in `Asia/Jerusalem`. It checks out the repository, builds an immutable Playwright image, pushes it to GHCR, executes Docker Compose, captures reports and container diagnostics, uploads artifacts for 30 days, cleans up containers, and returns the Playwright exit code.

Do not place test logic in workflow YAML. CI should invoke the same repository commands used locally.

### `docs/`

Agent and maintainer documentation.

```text
docs/
├── ai-assistant/
│   └── README.md
├── framework/
│   └── architecture.md
├── guides/
│   ├── authoring-tests.md
│   └── test-conventions.md
└── reference/
    └── commands.md
```

- `ai-assistant/README.md` defines the agent workflow and directs changes to the correct layer.
- `framework/architecture.md` is this detailed repository and dependency map.
- `guides/authoring-tests.md` contains implementation recipes and class templates.
- `guides/test-conventions.md` contains strict coding and testing rules.
- `reference/commands.md` documents local, CLI, Docker, report, and CI commands.

Update documentation when a folder, command, fixture contract, configuration rule, or architecture boundary changes.

### `infra/core/cli/`

The project-specific QA command-line interface. `executor.ts` calls `runCli()`, and this folder converts user-friendly options into Playwright CLI arguments.

```text
infra/core/cli/
├── cli-args.validation.ts
├── command-options.types.ts
├── playwright-arguments.cli.ts
├── process-runner.cli.ts
├── program.cli.ts
└── report-resolver.ts
```

- `program.cli.ts` defines `run`, `list`, `debug`, and `report` commands with Commander.
- `command-options.types.ts` defines strict option and command-mode types.
- `cli-args.validation.ts` validates positive worker counts, non-empty values, regular expressions, and file selectors.
- `playwright-arguments.cli.ts` translates CLI options into `npx playwright` arguments. Multiple title, regex, and tag filters are combined with lookaheads, so they use AND semantics.
- `process-runner.cli.ts` spawns Playwright without a shell and propagates its exit code.
- `report-resolver.ts` validates an explicit report path or finds the newest `reports/*/html` directory.

When adding a CLI flag, update the option type, Commander definition, validation if needed, argument mapping, help/examples, documentation, and CLI-focused tests if present.

### `infra/core/clients/`

Browser-independent integrations and their contracts.

```text
infra/core/clients/
├── api.client.ts
├── email.client.ts
└── contracts/
    └── inbox-id-name.contract.ts
```

- `api.client.ts` contains `Request`, a wrapper around Playwright's `APIRequestContext`. It can send GET/POST requests, remember the last response, wait for browser responses, and coordinate the post-login onboarding response with its triggering UI action.
- `email.client.ts` contains `MailClient`, which creates MailSlurp inboxes, waits for subject-matched email, extracts six-digit codes, and finds verification links.
- `contracts/inbox-id-name.contract.ts` defines the readonly `InboxData` boundary returned by the email client.

Clients must not contain page locators or scenario assertions. New secrets must come from environment/configuration, never source code. A stateful client should be test-scoped unless sharing it is deliberate and concurrency-safe.

### `infra/core/fixtures/`

Typed Playwright dependency injection.

```text
infra/core/fixtures/
├── pages.fixture.ts
└── email.fixture.ts
```

- `pages.fixture.ts` extends base Playwright `test`, defines `PageFixtures`, and creates all current page objects from the built-in `page` fixture. These objects are test-scoped by default.
- `email.fixture.ts` extends the page fixture and adds a worker-scoped `MailClient`.
- Both fixtures re-export `expect` for consumers that want one framework import.

Fixtures construct and release resources. They do not navigate, fill forms, log in, or assert scenario outcomes. Add the new dependency to the fixture type and fixture object together.

### `infra/core/validations/`

Small generic Playwright assertion helpers.

```text
infra/core/validations/
└── validate.validation.ts
```

`Validate` currently wraps common checks for visibility, hidden state, values, contained text, enabled state, attributes, URL, title, and trial-click actionability. These helpers use Playwright assertions and therefore auto-retry.

Add a helper only when it is generic, correctly named, and reused. A scenario's important expected outcome belongs in the test, not hidden inside this class.

### `infra/domain/web/locators/`

Stable selector values and accessible text used by pages.

```text
infra/domain/web/locators/
├── email-resend.locators.ts
├── email-verification-otp.locators.ts
├── login.sign.locators.ts
├── verification-email.locators.ts
└── welcome-talkspace.locators.ts
```

The folder stores constants such as `data-qa` values, button/link names, headings, messages, and dynamic test-ID prefixes. Locator constants do not call Playwright and do not perform actions.

New code should normally use one locator module per page or shared component. A combined module is acceptable only when the UI contract is truly shared. Keep selector construction in the owning page/component when it needs runtime arguments.

### `infra/domain/web/pages/`

Application Page Objects.

```text
infra/domain/web/pages/
├── base.page.ts
├── email-resend.page.ts
├── signup.page.ts
├── two-factor-verify.page.ts
└── log-in/
    ├── email-verification-code.page.ts
    ├── home.page.ts
    ├── login.page.ts
    ├── meet-your-provider.page.ts
    ├── mental-health-intake-gender.page.ts
    ├── mental-health-intake.page.ts
    ├── onboarding.page.ts
    └── welcome-talkspace.page.ts
```

Responsibilities of the current pages:

- `base.page.ts` stores the Playwright `Page`, defines the navigation contract, and currently exposes a local-debug pause method.
- `login.page.ts` owns `/login`, the main auth path `/`, login controls, credential entry, remember-me, and submit/login actions.
- `signup.page.ts` owns `/signup/autoswitchpt`, account fields, password state, country/state selection, related links, and account submission.
- `email-resend.page.ts` owns `/email-verification/sent`, its email-fragment URL builder, resend action, and page content.
- `email-verification-code.page.ts` owns `/email-verification/otp`, six OTP inputs, resend/update controls, redirect waiting, and verification messaging.
- `two-factor-verify.page.ts` owns `/2fa/verify`, six 2FA inputs, redirect waiting, and continue.
- `home.page.ts` owns `/home`, home navigation, and redirect waiting.
- `meet-your-provider.page.ts` represents a dynamic room onboarding route and close action.
- `mental-health-intake.page.ts` represents a dynamic mental-health onboarding route and its start action.
- `mental-health-intake-gender.page.ts` represents the gender step and selection behavior.
- `onboarding.page.ts` coordinates a race-free wait for the onboarding API response and validates that the resulting dynamic room route uses a room ID from that response.
- `welcome-talkspace.page.ts` follows a verification link and represents the successful email-verification state.

A page owns one route or tightly related route family. It should expose user intent, not require tests to understand DOM structure. Dynamic routes that cannot be visited directly may implement redirect waiting instead of usable direct navigation, but new contracts should make that explicit rather than throwing a generic `NotImplemented` error.

### `infra/utils/`

Small cross-cutting helpers that are not page or business logic.

```text
infra/utils/
├── attachment.util.ts
├── markers.util.ts
├── random.util.ts
├── step.util.ts
└── template.util.ts
```

- `attachment.util.ts` attaches text, JSON, and inbox metadata to the current Playwright report.
- `markers.util.ts` defines `@regression`, `@smoke`, and `@sanity`, creates tag metadata, and provides explicit serial describe configuration.
- `random.util.ts` generates numeric strings and unique timestamped report names.
- `step.util.ts` is a method decorator that wraps async class methods in boxed `test.step` entries named from the class and method.
- `template.util.ts` performs literal placeholder replacement.

Utilities must stay small, deterministic where possible, and independent of application pages. Business workflows do not belong here.

### `tests/`

E2E scenarios and feature-local input data.

```text
tests/
├── log-in/
│   └── test-log-in.spec.ts
├── signup-filling/
│   ├── test-signup-filling-correct.spec.ts
│   ├── test-signup-wrong.spec.ts
│   └── test-data/
│       ├── form-for-all.data.json
│       ├── form-for-us.data.json
│       ├── form-passwords.data.json
│       └── form-wrong.data.json
└── signup-full-flow/
    ├── test-signup-full-flow.spec.ts
    └── test-data/
        └── form.data.json
```

- `log-in/` covers login, email-delivered 2FA, and early onboarding behavior.
- `signup-filling/` contains data-driven positive and negative form validation without intentionally completing account creation.
- `signup-full-flow/` creates a disposable inbox, creates/verifies an account, logs in, and branches according to the onboarding API response. It currently uses serial state between two tests.

Tests own scenario descriptions, data selection, branches that define expected behavior, and assertions. They use fixtures rather than constructing pages directly.

### Folders created only when needed

The following architectural locations are approved but do not yet exist in the repository. Do not create empty folders.

```text
infra/domain/web/components/   Shared UI wrappers used by at least two pages
infra/logic/                   Reusable multi-page workflow classes
infra/data/                    Shared typed data, factories, and domain inputs
test-assets/                   Files used for upload/download scenarios
```

Examples:

- The repeated six-digit OTP input could become an `OtpInputComponent` shared by email verification and 2FA pages.
- A repeated signup-plus-email-verification journey could become a workflow after a second scenario needs the same sequence.
- A data contract shared by login and signup features belongs in `infra/data/`, not duplicated JSON schemas.

## Top-level files

```text
AGENTS.md
README.md
executor.ts
package.json
package-lock.json
playwright.config.ts
playwright.settings.json
tsconfig.json
Dockerfile
compose.yaml
.gitignore
.dockerignore
```

- `AGENTS.md` is the canonical agent instruction file.
- `README.md` is a human-oriented CLI and CI quick start.
- `executor.ts` forwards process arguments to the QA CLI and preserves its exit code.
- `package.json` declares scripts and dependencies; `package-lock.json` pins the dependency graph.
- `playwright.config.ts` reads the settings path from `PW_SETTINGS`, substitutes a random `{reportId}`, forces headless mode when `CI=true`, and prepares Playwright projects.
- `playwright.settings.json` defines test directory, output, parallelism, workers, timeouts, reporters, base URL, test ID attribute, trace/screenshot policy, launch options, and projects.
- `tsconfig.json` enables strict ES2022/NodeNext checking for framework, tests, configuration, and CLI entry point.
- `Dockerfile` uses the Playwright 1.65 Noble image, installs locked dependencies, copies the project, sets CI mode, and runs Chromium tests through the QA CLI.
- `compose.yaml` builds or accepts `E2E_IMAGE`, runs the test service with host IPC, and mounts `reports/` back to the host.
- `.gitignore` excludes dependencies, secrets, reports, artifacts, temporary files, and local agent/browser tooling.
- `.dockerignore` keeps Git metadata, local dependencies, reports, artifacts, environment files, and logs out of the build context.

## Runtime flow

```text
npm run qa -- <command>
        |
        v
executor.ts
        |
        v
infra/core/cli/program.cli.ts
        |
        +--> validate and build Playwright arguments
        |
        v
npx playwright test
        |
        v
playwright.config.ts --> playwright.settings.json
        |
        v
tests --> fixtures --> pages / clients
        |
        v
reports/<generated-report-id>/
```

Each Playwright configuration load creates a report ID from the timestamp plus a random numeric suffix. The `{reportId}` placeholders in the configured HTML and test-results paths are replaced before Playwright starts.

## Fixture and object lifetimes

- Built-in Playwright `page` and all objects in `pages.fixture.ts` are test-scoped.
- `MailClient` is currently worker-scoped in `email.fixture.ts`.
- Worker-scoped mutable state can leak between tests running on the same worker. Do not add mutable worker fixtures without a concurrency and cleanup plan.
- A fixture can depend on another fixture and construct a workflow from multiple pages, but it must not execute the workflow automatically.

## Generated and ignored output

These directories are runtime output and are not framework source:

- `node_modules/` — installed dependencies
- `reports/` — versioned HTML reports and Playwright test results
- `artifacts/` — CI diagnostics such as Compose logs and container inspection
- `test-results/` and `playwright-report/` — default Playwright output if generated
- `.env*` — local environment configuration and secrets
- `temp/` — temporary local files

Do not read generated output as an architectural source of truth and do not commit it.

## Current transitional exceptions

The current codebase contains patterns that new code should not copy blindly:

- Some page classes do not yet extend `BasePage`.
- Some pages expose many implementation locators publicly.
- Some page methods perform assertions rather than exposing state to the test.
- The signup full-flow suite shares state through serial tests.
- Existing login/full-flow code includes interactive pauses and environment-specific credentials/configuration.
- Some method and test names do not follow the documented naming conventions.
- `MailClient` contains legacy embedded service configuration.
- The `package.json` `typecheck` script references a configuration file that is not present; use the canonical command documented in `commands.md` until separately corrected.

These are maintenance notes, not permission to repeat the patterns. Improve touched areas when safe and in scope, but do not perform unrelated bulk refactors.
