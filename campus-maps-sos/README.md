# Campus Maps & SOS

Goal
- Interactive campus map with indoor finder, room/faculty lookup, and SOS contacts.

Suggested tech
- Frontend: React + Leaflet / Mapbox GL
- Backend: Node.js or serverless endpoints
- Data: JSON map of rooms/facilities, optional indoor map tiles

Starter tasks
- Add a searchable list of rooms and a basic map view
- Provide emergency/SOS contact UI
- Add accessibility metadata for buildings

Good first tasks
- Add sample JSON data and a UI that lists rooms
- Implement basic search/filter UI

Related projects
- External example: Alert-yaar24 branches — https://github.com/Ethicalmind/Alert-yaar24/branches

If this link should point to a specific branch or PR, mention it in an issue or provide the exact URL and I'll update this file.

Contributors
- @Ethicalmind — Hacktoberfest 2025 (Hackathon submission)

How to contribute
- Edit `campus-maps-sos/data/locations.json` to add or update rooms, accessibility info and tags.
- Run the prototype locally to verify changes:

```bash
python -m http.server 8000
# open http://localhost:8000/campus-maps-sos/index.html
```

- Commit your changes to a feature branch and open a pull request against `main`. Include a short description of the data you changed and why.
- If you want to submit this as a hackathon entry, include "Hacktoberfest 2025" in your PR title or description.

If you'd like, you can download the sample locations JSON from the Finder panel and edit it locally before submitting.

Branch naming (local guidance)
- Use branch names that match repository conventions when opening a PR from your fork:
	- `feature/<short-description>` for new features
	- `fix/<issue-number>-<short-description>` for bug fixes

Pull request checklist (include in PR description)
- Link the PR to an issue if applicable (e.g., "Fixes #5").
- Briefly describe what you changed and why.
- Add test steps to reproduce and verify locally (see "Run locally" below).
- Keep commits small and focused; follow branch naming above.

Run locally / Test steps
1. From the repo root run a static server (Python 3):

```bash
python -m http.server 8000
# open http://localhost:8000/campus-maps-sos/index.html
```

2. Use the Finder to search for rooms. Try keyboard navigation (Arrow keys + Enter). Select a room to view details and accessibility info.
3. To test editing data:
	 - Download the sample data from the Finder (`Download sample data`).
	 - Edit the JSON locally and re-load the page to see updates.

If you plan to contribute, please open a small PR with your changes and include the checklist above in the PR description.
