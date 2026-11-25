# Commands, Configuration, and Validation

Run commands from the repository root.

## Prerequisites and installation

Local execution requires a compatible Node.js/npm environment and Playwright browser dependencies.

Install the locked dependency graph:

```bash
npm ci
```

The Docker image already includes the browser system dependencies required by the pinned Playwright base image.

Do not replace `npm ci` with an unreviewed dependency update. When dependencies intentionally change, update `package.json` and `package-lock.json` together.

## QA CLI overview

The public command entry point is:

```bash
npm run qa -- <command> [arguments] [options]
```

Available commands:

- `run` — execute matching Playwright tests
- `list` — discover and list matching tests without running them
- `debug` — execute matching tests with the Playwright inspector
- `report` — open the newest or specified HTML report

Help:

```bash
npm run qa -- --help
npm run qa -- run --help
npm run qa -- list --help
npm run qa -- debug --help
npm run qa -- report --help
```

`executor.ts` starts `infra/core/cli/program.cli.ts`. The CLI validates input, converts it to Playwright arguments, starts `npx playwright`, and returns the Playwright exit code.

## Run tests

Run the entire suite:

```bash
npm run qa -- run
```

Run by literal title text:

```bash
npm run qa -- run "shows an email format warning"
```

The positional title is escaped as literal text before being passed to Playwright.

Run by regular expression:

```bash
npm run qa -- run --grep "login|signup"
```

Run one file or one line:

```bash
npm run qa -- run --file tests/signup-filling/test-signup-wrong.spec.ts
npm run qa -- run --file tests/signup-filling/test-signup-wrong.spec.ts:10
```

The CLI verifies that the file exists and that a supplied line number is a positive integer.

## Select by tag

```bash
npm run qa -- run --smoke
npm run qa -- run --regression
npm run qa -- run --sanity
```

Combine tags:

```bash
npm run qa -- run --smoke --regression
```

Combined title, `--grep`, and tag filters use AND semantics. A test must match every supplied condition.

Example:

```bash
npm run qa -- run "authentication" \
  --grep "login|signup" \
  --smoke \
  --browser chromium \
  --workers 2 \
  --headed \
  --parallel
```

## Execution options

The `run`, `list`, and `debug` commands accept:

| Option | Meaning |
| --- | --- |
| `[test-name]` | Literal title text to require |
| `--grep <pattern>` | Additional regular-expression title/tag filter |
| `--file <path[:line]>` | Test file and optional line selector |
| `--smoke` | Require the `@smoke` tag |
| `--regression` | Require the `@regression` tag |
| `--sanity` | Require the `@sanity` tag |
| `--browser <name>` | Select a configured Playwright project |
| `--workers <count>` | Use a positive worker count |
| `--headed` | Display the browser |
| `--parallel` | Pass fully parallel execution to Playwright |

Examples:

```bash
npm run qa -- run --browser chromium
npm run qa -- run --workers 1
npm run qa -- run --headed
npm run qa -- run --parallel
```

## Test discovery

List every test:

```bash
npm run qa -- list
```

List only an affected file or tag:

```bash
npm run qa -- list --file tests/signup-filling/test-signup-wrong.spec.ts
npm run qa -- list --regression
```

Discovery is required after changing specs, data-driven generation, fixtures, imports, Playwright configuration, or TypeScript that is loaded by tests.

## Debugging

Run matching tests with the Playwright inspector:

```bash
npm run qa -- debug
npm run qa -- debug "specific test title"
npm run qa -- debug --file tests/log-in/test-log-in.spec.ts
```

Use debug mode locally. Do not commit `page.pause()`, focused tests, or temporary debug statements.

## Reports

Open the newest HTML report under `reports/*/html`:

```bash
npm run qa -- report
```

Open a specific report directory or its `index.html`:

```bash
npm run qa -- report reports/<report-id>/html
npm run qa -- report reports/<report-id>/html/index.html
```

The report resolver validates the path and fails clearly when a report does not exist.

Configured output:

```text
reports/
└── <report-id>/
    ├── html/
    │   └── index.html
    └── test-results/
        ├── trace.zip
        └── screenshots
```

The generated report ID contains a timestamp and random numeric suffix. Traces are retained on failure, and screenshots are captured only on failure.

## npm shortcuts

```bash
npm test
npm run qa:run
npm run qa:list
npm run qa:debug
npm run qa:report
```

`npm test` and `npm run qa:run` both execute the CLI `run` command.

## TypeScript validation

Canonical command:

```bash
npx tsc --noEmit --project tsconfig.json
```

The current `package.json` `typecheck` script references `tsconfig.cli.json`, which is not present in the repository. Until that script is corrected in a separately scoped change, do not use it as proof that the project was type-checked.

`tsconfig.json` checks:

- `infra/**/*.ts`
- `tests/**/*.ts`
- `playwright.config.ts`
- `executor.ts`

It uses ES2022, NodeNext modules/resolution, JSON imports, strict mode, Node types, and no emitted output.

## Playwright configuration

`playwright.config.ts` reads settings from:

```text
PW_SETTINGS environment variable, if set
otherwise playwright.settings.json
```

Example with an alternate settings file:

```bash
PW_SETTINGS=playwright.local.settings.json npm run qa -- list
```

Do not commit local settings containing secrets.

`playwright.settings.json` currently configures:

- Test directory: `./tests`
- Output directory: `reports/{reportId}/test-results`
- Full parallel execution
- Four workers
- 60-second test timeout
- 5-second assertion timeout
- List and HTML reporters
- Base URL: Talkspace Canary
- `data-qa` as the test ID attribute
- Failure-retained traces
- Failure-only screenshots
- Maximized Chromium with a visible local browser and configured slow motion
- Chromium as the current project

When `CI=true`, `playwright.config.ts` forces headless execution.

## Environment variables

Framework-level variables currently used by committed runtime files:

| Variable | Purpose |
| --- | --- |
| `PW_SETTINGS` | Select an alternate Playwright settings JSON file |
| `CI` | Force headless Playwright execution when equal to `true` |
| `E2E_IMAGE` | Select the Docker image used by Compose |
| `E2E_BROWSER` | Select the Playwright project/browser used by Compose |
| `COMPOSE_PROJECT_NAME` | Isolate Compose resources, set by CI |

New external-service credentials must use clearly named environment variables and must never be printed or committed.

## Docker execution

Build and run the same container shape used by CI:

```bash
docker compose up \
  --build \
  --abort-on-container-exit \
  --exit-code-from tests
```

The Compose service:

- Builds `Dockerfile` unless `E2E_IMAGE` is supplied
- Runs with `CI=true`
- Uses host IPC for Chromium stability
- Mounts host `./reports` to `/app/reports`
- Runs the QA CLI with the project from `E2E_BROWSER` or `chromium`

Use a prebuilt image:

```bash
E2E_IMAGE=ghcr.io/<owner>/<repository>:<tag> docker compose up \
  --no-build \
  --abort-on-container-exit \
  --exit-code-from tests
```

Clean up Compose resources:

```bash
docker compose down --volumes --remove-orphans
```

## CI workflow

`.github/workflows/nightly-e2e.yml` supports manual dispatch and a scheduled run on November 14 at 20:00 `Asia/Jerusalem`.

The job:

1. Checks out the repository.
2. Builds an image tagged `ghcr.io/<repository>:e2e-<commit-sha>`.
3. Pushes the immutable image to private GHCR.
4. Runs Docker Compose without rebuilding.
5. Captures Compose logs and container inspection even when tests fail.
6. Uploads `artifacts/` and `reports/` for 30 days.
7. Removes temporary Compose resources.
8. Exits with the captured Playwright result.

CI concurrency uses one `nightly-playwright-e2e` group and does not cancel an in-progress run.

## Required validation by change type

### Documentation only

```bash
git diff --check
```

Also verify local Markdown links and command accuracy.

### Test or test-data change

```bash
npx tsc --noEmit --project tsconfig.json
npm run qa -- list --file <changed-spec>
npm run qa -- run --file <changed-spec>
```

### Page, component, workflow, fixture, validation, client, or utility change

```bash
npx tsc --noEmit --project tsconfig.json
npm run qa -- list
npm run qa -- run --file <narrowest-affected-spec>
```

Then run all feature suites that consume the shared object.

### CLI or configuration change

```bash
npx tsc --noEmit --project tsconfig.json
npm run qa -- --help
npm run qa -- list
```

Validate both accepted and rejected CLI arguments. For browser/configuration changes, run at least one real affected test.

### Docker or CI change

Run local checks plus:

```bash
docker compose config
docker compose up --build --abort-on-container-exit --exit-code-from tests
```

## Troubleshooting

### No tests are listed

- Confirm the spec is under `tests/` and ends in `.spec.ts`.
- Check that data-driven loops actually produce cases.
- Remove or correct overly restrictive title, regex, tag, or file filters.
- Type-check imports and fixture property names.

### A CLI file selector fails

- Run from repository root.
- Use a real file path.
- Use `:line` only with a positive integer.
- Prefer forward-slash paths in documentation and CI.

### No HTML report is found

- Run at least one Playwright test first.
- Confirm `reports/<report-id>/html/index.html` exists.
- Supply the explicit report directory if newest-report resolution is not desired.

### A test passes alone but fails in parallel

- Check fixed accounts, inboxes, shared worker fixtures, and module-level state.
- Ensure generated data is unique.
- Confirm the test does not depend on execution order.
- Do not solve state leakage by making the whole suite serial without identifying the shared resource.

### Email waits time out

- Create the `since` timestamp immediately before the triggering action.
- Confirm the expected subject and inbox.
- Ensure the external service configuration is available.
- Do not increase the timeout until matching logic and triggering behavior are verified.

### Browser behavior differs in CI

- Remember that `CI=true` forces headless mode.
- Reproduce with Docker Compose.
- Inspect the retained trace, screenshot, Compose log, and container diagnostics.
- Check viewport, project, environment, and external-service availability before changing waits.
