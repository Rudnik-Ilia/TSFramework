# TSFramework

TypeScript and Playwright Test E2E framework for the Talkspace Canary application.

The project covers signup, email verification, login, two-factor authentication, and onboarding flows. It includes a typed Page Object Model, a project-specific QA CLI, MailSlurp integration, HTML reports, Docker execution, and scheduled GitHub Actions runs.

## Contents

- [Requirements](#requirements)
- [Clone the repository](#clone-the-repository)
- [Run without Docker](#run-without-docker)
- [Select and configure tests](#select-and-configure-tests)
- [Run with Docker](#run-with-docker)
- [Reports and debugging](#reports-and-debugging)
- [Environment variables](#environment-variables)
- [GitHub Actions](#github-actions)
- [Project structure](#project-structure)
- [Troubleshooting](#troubleshooting)

## Requirements

Choose one execution method:

| Method | Required software | Recommended for |
| --- | --- | --- |
| Docker | Git, Docker Engine or Docker Desktop, Docker Compose v2 | Reproducible execution matching CI |
| Local | Git, a current Node.js LTS release, npm | Development, debugging, and faster iteration |

The tests require network access to the Talkspace Canary application and to the configured external email service.

## Clone the repository

```bash
git clone https://github.com/Rudnik-Ilia/TSFramework.git
cd TSFramework
```

> [!IMPORTANT]
> Run all `npm` and `docker compose` commands from the repository root—the directory containing `package.json` and `compose.yaml`.

## Run without Docker

### Install dependencies

Install the locked npm dependency graph from the repository root:

```bash
npm ci
```

Install Chromium:

```bash
npx playwright install chromium
```

On Linux, install Chromium and its operating-system dependencies together:

```bash
npx playwright install --with-deps chromium
```

### Run tests locally

Run the complete suite:

```bash
npm run qa -- run
```

Equivalent shortcuts:

```bash
npm test
npm run qa:run
```

The committed local configuration uses a visible Chromium browser. Set `CI=true` when headless behavior is required:

```bash
CI=true npm run qa -- run
```

### Validate without running tests

```bash
npx tsc --noEmit --project tsconfig.json
npm run qa -- list
```

## Select and configure tests

The public CLI format is `npm run qa -- <command> [test-name] [options]`.

```bash
# Help
npm run qa -- --help
npm run qa -- run --help

# Run tests
npm run qa -- run

# List tests without running them
npm run qa -- list

# Debug with Playwright Inspector
npm run qa -- debug

# Open the latest or a specific HTML report
npm run qa -- report
npm run qa -- report reports/<report-id>/html
```

### Select tests

```bash
# By test name
npm run qa -- run "creates a new account"

# By regular expression
npm run qa -- run --grep "login|signup"

# By file or exact line
npm run qa -- run --file tests/signup-filling/test-signup-wrong.spec.ts
npm run qa -- run --file tests/signup-filling/test-signup-wrong.spec.ts:10

# By tags; combined tags use AND matching
npm run qa -- run --smoke
npm run qa -- run --regression
npm run qa -- run --sanity
npm run qa -- run --smoke --regression
```

### Execution options

```bash
npm run qa -- run --browser chromium
npm run qa -- run --workers 2
npm run qa -- run --headed
npm run qa -- run --parallel
```

Options can be combined:

```bash
npm run qa -- run "authentication" \
  --grep "login|signup" \
  --smoke \
  --browser chromium \
  --workers 2 \
  --headed \
  --parallel
```

Shortcuts:

```bash
npm run qa:run
npm run qa:list
npm run qa:debug
npm run qa:report
```

The CLI propagates the Playwright exit code. Invalid arguments return a non-zero exit code.

## Run with Docker

Docker provides the same browser and operating-system dependencies used by CI.

### First run

Build the image and start the test runner in the background:

```bash
docker compose up --detach --build
```

When the container starts, it automatically runs the complete Chromium suite, writes reports to the host `reports/` directory, records the Playwright exit code, and then remains running.

Check the container and follow the test output:

```bash
docker compose ps
docker compose logs --follow tests
```

Press `Ctrl+C` to stop following the logs; the container continues running. After the final `Playwright finished` message, read the completed run's exit code:

```bash
docker compose exec tests cat /tmp/playwright-exit-code
```

Exit code `0` means the suite passed. Any other value means the run failed.

### Work with the running container

Run all tests again:

```bash
docker compose exec tests npm run qa -- run --browser chromium
```

Run one spec or list tests:

```bash
docker compose exec tests npm run qa -- run \
  --file tests/signup-full-flow/test-signup-full-flow.spec.ts
docker compose exec tests npm run qa -- list
```

Open a shell:

```bash
docker compose exec tests bash
```

All options from [Select and configure tests](#select-and-configure-tests) work inside the container after `docker compose exec tests npm run qa --`.

### Update and recreate

```bash
git pull
docker compose up --detach --build --force-recreate
```

Recreating or restarting the container triggers the complete automatic run again.

### Stop and remove

Stop without removing the container:

```bash
docker compose stop
```

Start the stopped container:

```bash
docker compose start
```

Remove the container and Compose network:

```bash
docker compose down
```

Remove the container, network, and volumes:

```bash
docker compose down --volumes --remove-orphans
```

Remove the locally built image too:

```bash
docker compose down --rmi local --volumes --remove-orphans
```

### Use a prebuilt image

Authenticate first when the GHCR package is private:

```bash
docker login ghcr.io
docker pull ghcr.io/<owner>/<repository>:<tag>
E2E_IMAGE=ghcr.io/<owner>/<repository>:<tag> \
  docker compose up --detach --no-build
```

## Reports and debugging

Every run creates a unique report directory:

```text
reports/
└── <report-id>/
    ├── html/
    │   └── index.html
    └── test-results/
        ├── trace.zip
        └── screenshots
```

Open the newest or a specific local HTML report:

```bash
npm run qa -- report
npm run qa -- report reports/<report-id>/html
```

Run with Playwright Inspector or open a retained trace:

```bash
npm run qa -- debug --file tests/signup-full-flow/test-signup-full-flow.spec.ts
npx playwright show-trace reports/<report-id>/test-results/<test-directory>/trace.zip
```

Docker mounts `/app/reports` to the host `reports/` directory, so container reports remain available after the container is removed.

## Environment variables

| Variable | Purpose | Default |
| --- | --- | --- |
| `PW_SETTINGS` | Alternate Playwright settings JSON file | `playwright.settings.json` |
| `CI` | Force headless execution when set to `true` | Not set locally |
| `E2E_BROWSER` | Browser used by the automatic Docker run | `chromium` |
| `E2E_IMAGE` | Image used by Docker Compose | `tsframework-e2e:local` |
| `COMPOSE_PROJECT_NAME` | Isolate Compose resources | `tsframework` |

Examples:

```bash
PW_SETTINGS=playwright.local.settings.json npm run qa -- list
E2E_BROWSER=chromium docker compose up --detach --build
```

Do not commit local settings or environment files containing credentials.

## GitHub Actions

The workflow runs every day at `01:00 Asia/Jerusalem` and can also be started manually from the GitHub Actions page. It:

1. Builds the Playwright image.
2. Pushes it to private GHCR as `e2e-<commit-sha>`.
3. Starts the Docker Compose test runner, which automatically executes all tests and then remains running.
4. Uploads `reports/`, Docker Compose logs, and `docker inspect` as GitHub artifacts for 30 days.
5. Removes temporary containers while preserving the immutable image in GHCR.

Download an image from GHCR:

```bash
docker pull ghcr.io/<owner>/<repository>:e2e-<commit-sha>
```

Artifacts produced by the workflow:

```text
artifacts/
├── docker-compose.log
└── container-inspect.json

reports/
└── <report-id>/
    ├── html/
    └── test-results/
        ├── trace.zip
        └── screenshots
```

## Project structure

```text
TSFramework/
├── .github/
│   └── workflows/
│       └── nightly-e2e.yml          # Scheduled and manual CI execution
├── docs/
│   ├── ai-assistant/                # Agent workflow
│   ├── framework/                   # Architecture reference
│   ├── guides/                      # Test-authoring conventions
│   └── reference/                   # Commands and configuration
├── infra/
│   ├── core/
│   │   ├── cli/                     # Project-specific QA CLI
│   │   ├── clients/                 # API and MailSlurp integrations
│   │   ├── fixtures/                # Typed Playwright fixtures
│   │   └── validations/             # Reusable web-first assertions
│   ├── domain/web/
│   │   ├── locators/                # Stable locator constants
│   │   └── pages/                   # Page Objects grouped by feature
│   └── utils/                        # Small cross-cutting utilities
├── tests/
│   ├── signup-filling/              # Signup validation scenarios
│   │   └── test-data/               # Feature-local JSON data
│   └── signup-full-flow/             # Signup and onboarding journeys
│       └── test-data/
├── Dockerfile                       # Playwright runner image
├── compose.yaml                     # Long-running test service
├── docker-entrypoint.sh             # Automatic test run and keep-alive
├── executor.ts                      # QA CLI entry point
├── package.json                     # npm scripts and dependencies
├── playwright.config.ts             # Settings loader and transformation
├── playwright.settings.json         # Browser, reporter, URL, and test settings
└── tsconfig.json                     # Strict TypeScript configuration
```

The primary dependency direction is:

```text
tests
  → workflows, when a multi-page journey is reused
  → page objects
      → shared components, when reused by multiple pages
      → locator constants
  → fixtures
  → clients, validations, and utilities
```

Detailed documentation:

- [Framework architecture](docs/framework/architecture.md)
- [Authoring tests](docs/guides/authoring-tests.md)
- [Test conventions](docs/guides/test-conventions.md)
- [Command reference](docs/reference/commands.md)

## Troubleshooting

### `no configuration file provided: not found`

Docker Compose was started outside the repository root:

```bash
cd /path/to/TSFramework
docker compose up --detach --build
```

Alternatively, provide the Compose file explicitly:

```bash
docker compose -f /path/to/TSFramework/compose.yaml up --detach --build
```

### The running container did not start the tests again

`docker compose up` does not restart an unchanged running container. Run the suite inside it:

```bash
docker compose exec tests npm run qa -- run --browser chromium
```

Or recreate the container to trigger its automatic run:

```bash
docker compose up --detach --build --force-recreate
```

### Remove a container directly

The preferred project command is:

```bash
docker compose down
```

If the Compose project directory is unavailable:

```bash
docker rm --force tsframework-tests-1
```

### No tests are listed

- Run the command from the repository root.
- Confirm the file is under `tests/` and ends with `.spec.ts`.
- Check the file selector, title filter, regular expression, and tags.
- Run `npx tsc --noEmit --project tsconfig.json` to find import or fixture errors.

### Browser executable or system dependency is missing

For local Linux execution:

```bash
npx playwright install --with-deps chromium
```

For Docker execution, rebuild the pinned Playwright image:

```bash
docker compose build --pull
```

### No HTML report is found

Run at least one test first, then look for generated reports:

```bash
find reports -path '*/html/index.html'
```

### Email-based tests time out

- Confirm network access to the application and external email service.
- Confirm that the required service configuration is available.
- Check the expected email subject and generated inbox information in the test report.
- Never print API keys, authorization headers, passwords, OTPs, or session tokens while debugging.
