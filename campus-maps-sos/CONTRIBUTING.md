# Contributing to Campus Maps & SOS

Thanks for wanting to contribute! This file highlights the most important steps to get your change accepted.

1. Fork the repo and create a branch following the repo convention:
   - `feature/<short-description>` for new features
   - `fix/<issue-number>-<short-description>` for bug fixes

2. Run and test locally
```bash
python -m http.server 8000
# open http://localhost:8000/campus-maps-sos/index.html
```

3. Update or add documentation in this folder (`README.md`, or this file) if your change affects usage.

4. Commit with small, focused commits and open a pull request against `main`. In the PR description include:
   - Summary of changes
   - Related issue (if any)
   - Test steps (how to run and verify locally)
   - Any accessibility considerations

5. Expect maintainers to request changes; address feedback promptly.
