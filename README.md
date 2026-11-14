# TSFramework

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
npm run qa -- run "submits valid data set 1"

# By file or file and line
npm run qa -- run --file tests/contact-us/contact-navigation.spec.ts
npm run qa -- run --file tests/contact-us/contact-navigation.spec.ts:44

# By regular expression
npm run qa -- run --grep "attachment"

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
npm run qa -- run "Contact Us" \
  --file tests/contact-us/contact-navigation.spec.ts \
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

Run all tests locally in the same container used by CI:

```bash
docker compose up \
  --build \
  --abort-on-container-exit \
  --exit-code-from tests
```

The nightly workflow runs every day at `02:00 Asia/Jerusalem` and can also be started manually from the GitHub Actions page. It:

1. Builds the Playwright image.
2. Pushes it to private GHCR as `e2e-<commit-sha>`.
3. Runs all tests through Docker Compose.
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
