# TSFramework

Playwright TypeScript E2E framework for Talkspace Canary authentication.

## QA CLI

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
npm run qa -- run "shows the login form"

# By regular expression
npm run qa -- run --grep "login|signup"

# By tags; combined tags use AND matching
npm run qa -- run --smoke
npm run qa -- run --regression
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

## Docker and scheduled GitHub Actions

Clone the repository, build the test runner, and keep it running in the background:

```bash
git clone <repository-url>
cd TSFramework
docker compose up --detach --build
docker compose ps
```

All Chromium tests start automatically when the container starts. Follow their output with:

```bash
docker compose logs --follow tests
```

Press `Ctrl+C` to stop following the logs; the container continues running. Read the completed test run's exit code with:

```bash
docker compose exec tests cat /tmp/playwright-exit-code
```

Run all tests again or run one spec file inside the existing container:

```bash
docker compose exec tests npm run qa -- run --browser chromium
docker compose exec tests npm run qa -- run --file tests/signup-full-flow/test-signup-full-flow.spec.ts
```

The container remains running after the command completes, and reports are written to the host `reports/` directory. Open a shell or stop the runner with:

```bash
docker compose exec tests bash
docker compose down
```

The workflow is scheduled for November 14 at `20:00 Asia/Jerusalem` and can also be started manually from the GitHub Actions page. It:

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

### CLI architecture

```text
executor.ts
   ↓
program.ts
   ├── validation.ts
   ├── playwright-arguments.ts
   ├── report-resolver.ts
   └── process-runner.ts → Playwright
        ↑
      types.ts
```

- `executor.ts` — CLI entry point and final exit code.
- `program.ts` — defines Commander commands, options, and help.
- `validation.ts` — validates workers, regexes, files, and line numbers.
- `playwright-arguments.ts` — converts CLI options into Playwright arguments and combines filters/tags.
- `process-runner.ts` — starts Playwright with Node.js `spawn()` and returns its exit code.
- `report-resolver.ts` — locates a requested report or the latest `reports/*/html` report.
- `types.ts` — shared strict TypeScript types for commands and options.
