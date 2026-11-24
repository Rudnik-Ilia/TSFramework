# Commands and Validation

## Discover and run tests

```bash
npm run qa -- list
npm run qa -- run
npm run qa -- run "test title"
npm run qa -- run --grep "login|signup"
npm run qa -- run --smoke
npm run qa -- run --regression
npm run qa -- debug
```

Useful execution options include `--browser chromium`, `--workers 2`, `--headed`, and `--parallel`.

## Required validation after changes

```bash
npx tsc --noEmit --project tsconfig.json
npm run qa -- list
npm run qa -- run "affected test title"
```

Run the smallest relevant test first, then the broader affected feature. Do not declare completion when type-checking or test discovery fails. Reports are written under `reports/<report-id>/`; traces and screenshots are retained for failures.

## Container parity

```bash
docker compose up --build --abort-on-container-exit --exit-code-from tests
```

Use the container command when validating CI parity or environment-sensitive behavior.
