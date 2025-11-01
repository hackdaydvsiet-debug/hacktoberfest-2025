# StudyVibe — Student Smart Scheduler (Frontend)

A smart study planner that helps students turn subjects, deadlines, and preferences into a realistic weekly timetable with progress tracking.

## Live demo

Live URL: https://studyvibe.tech


The backend is live at https://studyvibe-backend.onrender.com


## Why and what

PPT Link: https://drive.google.com/file/d/1_n9WYmxXJZ_yTAGU1UjWg4SNL37qiMyk/view?usp=drive_link


- Problem: Students struggle to plan consistent study sessions across multiple subjects with different deadlines and difficulty levels.
- Solution: StudyVibe generates a balanced schedule and visualizes it on a calendar and grid, adapting to user availability, preferred times, and study style.
- Outcome: Clear day-by-day plan, fewer cramming spikes, and visibility into progress.

## Core features

- Smart timetable generator using deadlines, difficulty, and available time
- AI customization surface for refining study plans
- Weekly Schedule Grid and Calendar view (FullCalendar)
- Progress dashboard to track sessions and completion
- Authentication with Google (Firebase Auth)

## How it works (flow)

1. Sign in with Google (Firebase).
2. Add subjects with exam dates and difficulty; set your availability and preferences (Pomodoro, preferred times, min/max session length).
3. Generate plan — the scheduler distributes time across days and subjects.
4. Review in Calendar and Weekly Grid; fine‑tune via AI Customizer.
5. Track progress on the dashboard as you study.

## Under the hood (scheduling logic)

There are two complementary generators in `src/utils/`:

- `studyPlanGenerator.js` — a simple proportional scheduler that allocates each day's available time by 1/days‑to‑exam weights.
- `advancedScheduler.js` — a richer heuristic that:
  - Calculates daily available time from your manual schedule and commitments.
  - Considers Pomodoro breaks (reduces usable time to be realistic).
  - Distributes hours by a combined weight: urgency (days left), subject difficulty, progress deficit, and hours remaining.
  - Respects min/max session lengths and preferred time windows (morning/afternoon/evening/night).
  - Outputs friendly durations (e.g., 1 hr 25 min) rounded to 5‑minute increments.

This yields a practical plan with earlier focus on urgent and harder subjects while keeping sessions within preferred times.

## Demo login

Explore the app instantly without creating an account:

- On the Login page, click "Continue as Demo User".
- Demo mode persists across refresh and ends when you log out.

## Architecture and stack

- React + Vite frontend
- Tailwind CSS + DaisyUI for UI
- FullCalendar for calendar visualization
- Firebase (Auth) for sign‑in; app config via Vite env vars

## Screenshots

## Roadmap

- Deeper AI suggestions (study strategy per subject)
- Collaboration (study buddy/shared plans)
- Mobile‑first offline mode
- Calendar export (Google/ICS)

---

## Feature overview (with status)

- Smart timetable generator (deadlines, difficulty, available time) — Available
- AI customization surface for refining study plans — Available
- Weekly Schedule Grid and Calendar view (FullCalendar) — Available
- Progress dashboard to track sessions and completion — Available
- Authentication with Google (Firebase Auth) — Available
- Demo login (“Continue as Demo User”) — Available

Preview and roadmap status:

- Quick Plan: AI Enhance — Preview
- Notifications — Under development
- Advanced Scheduler — Under development
- Cloud storage/sync for produced schedules — Under development

## Screenshots


## Contributing

Contributions are welcome! Please see the root `CONTRIBUTING.md` and the frontend docs in `StudyVibe_Frontend/` for project conventions.

## License

Licensed under the terms in the repository’s `LICENSE` file.
