# Playwright Training

This project is a minimal Playwright Test setup.

Quick commands:

```powershell
npm install
npx playwright install
npm test
# or run headed
npm run test:headed
# view HTML report
npm run show-report
```

Files created:
- `package.json` — project manifest
- `playwright.config.ts` — Playwright config
- `tests/example.spec.ts` — sample test

## Commit message template (Conventional Commits)

This repo includes a Conventional Commits template at `.gitmessage` and a Husky hook at `.husky/prepare-commit-msg` that prefills commit messages.

To enable the template without Husky (simple):

```bash
git config commit.template .gitmessage
```

To enable automatic prefilling with Husky (recommended):

1. Install Husky (dev dependency):

```bash
npm install -D husky
npx husky install
```

2. Ensure hooks are enabled (on Windows use Git Bash or WSL for scripts):

```bash
git add .husky/prepare-commit-msg
git commit -m "chore: add prepare-commit-msg hook" # or run any commit to initialize
```

Notes:
- The hook will only prefill empty commit messages (it won't override merge/squash/amend messages).
- You can also keep the template globally via `git config --global commit.template /path/to/.gitmessage`.

