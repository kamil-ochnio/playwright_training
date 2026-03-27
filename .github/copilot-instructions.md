# Conventional Commits - Short Guide

Format:
  <type>[optional scope]: <short summary>
  [empty line]
  [optional body]
  [empty line]
  [optional footer(s)]

Rules:
- Use one-line summary in imperative present tense (no trailing period), ≤72 chars.
- Types (choose one): feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
- Scope is optional: single word or hyphenated (e.g., auth, api-client)
- Body can explain *what* and *why* (wrap at ~72 chars)
- Indicate breaking changes with either:
  - an exclamation mark after type/scope: feat!: drop Node 8 support
  - or a footer line: BREAKING CHANGE: <description>
- Reference issues in footer: Closes #123, Fixes #456

Examples:
  feat(auth): add JWT refresh endpoint
  fix(api): correct null pointer on user lookup
  docs: update contributing guide
  chore(deps): bump jest to 29.0.0
  feat!: remove legacy oauth1 (BREAKING CHANGE: clients must use oauth2)

Use this consistently for clearer history, automated changelogs, and release notes.