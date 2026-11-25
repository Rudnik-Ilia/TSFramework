#!/usr/bin/env bash

set -u

PLAYWRIGHT_RESULT_PATH="/tmp/playwright-exit-code"
rm -f "$PLAYWRIGHT_RESULT_PATH"

set +e
npm run qa -- run --browser "${E2E_BROWSER:-chromium}"
playwright_exit_code=$?
set -e

printf '%s\n' "$playwright_exit_code" > "$PLAYWRIGHT_RESULT_PATH"
echo "Playwright finished with exit code $playwright_exit_code. The container will remain running."

exec sleep infinity
