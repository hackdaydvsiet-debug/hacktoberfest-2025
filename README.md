# Hacktoberfest 2025 — DVSIT CSE Department

Welcome to the official Hacktoberfest 2025 repository hosted by the CSE Department, DVSIT. This repo is designed to help participants learn collaboration, practice contributing to open source, and complete Hacktoberfest contribution goals.

Whether you're new to Git/GitHub or a seasoned contributor, this README shows exactly how to contribute with clear Git commands and workflow examples.

---

## Table of contents

- About
- How to participate
- Contribution workflow (step-by-step git commands)
- Branching & commit message guidelines
- Creating a great Pull Request
- Updating your fork / keeping branches up-to-date
- Labels, issues, and what to pick
- Code of Conduct
- Support / Contact

---

## About

Hacktoberfest 2025 is an event that encourages open-source contribution. This repository contains curated issues, learning materials, and small tasks suitable for first-time contributors and experienced developers.

All valid contributions are welcome: documentation updates, bug fixes, new examples, and small features.

---

## How to participate (high level)

1. Find an issue labeled `good first issue`, `easy`, or `help wanted`.
2. Comment on the issue to let maintainers know you're working on it (optional but polite).
3. Fork the repository to your GitHub account.
4. Create a branch with a descriptive name.
5. Make commits with clear messages.
6. Push the branch to your fork and open a Pull Request (PR) against this repository.
7. Follow review comments and update the PR until it’s merged.

---

## Contribution workflow — step-by-step with git commands

Replace the placeholders (YOUR_USERNAME, ISSUE_NUMBER, feature/short-desc) with your own values.

1. Fork the repo on GitHub:
   - Click "Fork" in the top-right corner of the repo page.

2. Clone your fork locally:
```bash
git clone https://github.com/YOUR_USERNAME/hacktoberfest-2025.git
cd hacktoberfest-2025
```

3. Set the original repo as `upstream` (so you can pull new changes later):
```bash
git remote add upstream https://github.com/hackdaydvsiet-debug/hacktoberfest-2025.git
git fetch upstream
```

4. Create a new branch for your work (use a descriptive branch name):
```bash
# Start from the latest main
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-short-description
```

5. Make changes locally. Stage and commit them:
```bash
git add path/to/changed-file
git commit -m "feat: add X feature to Y (closes #ISSUE_NUMBER)"
```
- Use conventional, meaningful commit messages.
- If you're addressing an issue, include "closes #ISSUE_NUMBER" or "fixes #ISSUE_NUMBER".

6. Push your branch to your fork:
```bash
git push origin feature/your-short-description
```

7. Open a Pull Request:
- Go to your fork on GitHub.
- Click "Compare & pull request".
- Choose the base repository `hackdaydvsiet-debug/hacktoberfest-2025` and base branch `main`.
- Fill the PR template (see guidance below) and create the PR.

---

## Branching & commit message guidelines

- Branch names: feature/..., fix/..., docs/..., chore/...
  - Example: `feature/add-contributor-guide`, `fix/typo-readme`
- Commit messages:
  - Short summary (max 50 chars)
  - Optionally a longer description after a blank line
  - Include issue references when applicable: `closes #12`
  - Example: `docs: update contributing instructions for git setup`

---

## PR template & what to include

When you open a PR, include:
- A short description of the change.
- The issue number it addresses (if any).
- Steps to reproduce / test instructions.
- Screenshots (if UI changes).
- Any assumptions or design decisions.

Example PR title:
```
feat: add CONTRIBUTING.md and README improvements (closes #34)
```

Example PR body:
- What I changed and why
- How to test locally:
```bash
# example steps
npm install
npm test
```
- Related issue: #34

---

## Keeping your fork and branch up-to-date

If the upstream repository changes while you work, update your branch before opening or updating a PR.

Option A — Merge upstream main into your branch:
```bash
# on your main
git checkout main
git fetch upstream
git merge upstream/main
git push origin main

# update your feature branch
git checkout feature/your-short-description
git merge main
# resolve conflicts if any, then:
git push origin feature/your-short-description
```

Option B — Rebase your branch on latest main (cleaner history):
```bash
git fetch upstream
git checkout feature/your-short-description
git rebase upstream/main
# resolve conflicts if any, then:
git push --force-with-lease origin feature/your-short-description
```
Note: Use force-push only if you understand rewriting history and you're the only one working on the branch.

---

## Labels, issues, and what to pick

- `good first issue` — beginner-friendly tasks.
- `help wanted` — tasks maintainers want help with.
- `enhancement` — new features or improvements.
- `bug` — bug fixes.

If you don't find an issue that fits, open a new issue describing the improvement you want to make. Maintainers will label it appropriately.

---

## Code of Conduct

Be respectful and inclusive. Follow standard open-source etiquette:
- Be kind in comments and PR reviews.
- Aim to help teammates learn.
- If you encounter harassment or policy violations, contact the maintainers.

(You can add a detailed CODE_OF_CONDUCT.md in the repo — contributions welcome.)

---

## Licenses & credit

By contributing, you agree that your contributions will be available under the project's license. If a LICENSE file exists, refer to it for details. If not, contact maintainers.

---

## Troubleshooting & tips

- Make small, focused PRs — easier to review and merge.
- Run linters/tests locally if available before opening a PR.
- If you're unsure, open an issue and discuss the change first.

Useful Git commands (quick reference):
```bash
# check remotes
git remote -v

# create a branch
git checkout -b branch-name

# see status and staged files
git status
git add .
git commit -m "message"

# update from upstream
git fetch upstream
git merge upstream/main

# push changes
git push origin branch-name
```

---

## Need help?

Open an issue on this repository, or mention @hackdaydvsiet-debug in comments to get maintainers' attention. We're happy to help new contributors.

Happy hacking and good luck with Hacktoberfest 2025! 🎉
```
