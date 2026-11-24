# AI Test Generation Assistant

This repository uses an AI test-generation assistant. Keep this file short; detailed guidance lives in `docs/`.

## Start here

- [Assistant index](docs/ai-assistant/README.md)

## Quick links

- [Framework architecture](docs/framework/architecture.md)
- [Adding tests, pages, wrappers, and classes](docs/guides/authoring-tests.md)
- [Test and TypeScript conventions](docs/guides/test-conventions.md)
- [Commands and validation](docs/reference/commands.md)

## Non-negotiable rules

- Use strict Page Object Model and OOP boundaries.
- Keep every locator and browser interaction inside a page object or component wrapper.
- Prefer `getByTestId()` for `data-qa`; verify new selectors with `playwright-cli`.
- Keep assertions primarily in tests and keep tests isolated.
- Do not use hard waits, generated selectors, real credentials, or real account creation during investigation.
- Preserve existing user changes, avoid unrelated edits, and validate every implementation.
- Root `AGENTS.md` is canonical for this repository.
