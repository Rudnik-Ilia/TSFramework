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
