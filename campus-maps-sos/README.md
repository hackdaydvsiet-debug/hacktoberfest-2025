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
