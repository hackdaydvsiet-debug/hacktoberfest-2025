# Code Structure Guide

This document explains how the code is organized and how different parts work together.

## Overview

StudyVibe is a React app that helps students create study schedules. The main flow is:

1. User logs in (Firebase auth or demo mode)
2. User adds subjects with exam dates
3. User sets their availability and preferences
4. App generates a smart study schedule
5. User views schedule in calendar/grid format
6. User tracks progress as they study

## Directory Structure

### `/src/components`

React components organized by purpose:

#### `Planner/` - Study planning components

- `AdvancedSchedulerForm.jsx` - Form for inputting subjects and preferences
- `AdvancedSubjectInput.jsx` - Individual subject input fields
- `AICustomizer.jsx` - UI for fine-tuning generated plans
- `ProgressDashboard.jsx` - Shows study progress and stats
- `StudyCalendar.jsx` - Calendar view using FullCalendar
- `SubjectForm.jsx` - Basic subject entry form
- `Timetable.jsx` - Visual timetable grid
- `WeeklyScheduleGrid.jsx` - Weekly hour-by-hour schedule

#### `Reusable/` - Shared components

- `Footer.jsx` - App footer
- `MotivationalQuote.jsx` - Random motivational quotes
- `Sidebar.jsx` - Navigation sidebar

### `/src/contexts`

React Context for global state:

- `authContext.jsx` - User authentication state
  - Tracks logged-in user (Firebase or demo)
  - Provides login/logout functions
  - Persists demo mode in localStorage

### `/src/hooks`

Custom React hooks for data and actions:

- `useLogin.js` - Email/password login
- `useLogout.js` - Logout (clears auth + demo mode)
- `useSignup.js` - User registration
- `useAdvancedScheduler.js` - Hook for advanced schedule generation
- `useGeneratePlan.js` - Hook for basic plan generation
- `useSmartTimetable.js` - Hook for timetable logic

### `/src/pages`

Main page components:

- `Login.jsx` - Login page with email/password and demo option
- `SignUp.jsx` - Registration page
- `Dashboard.jsx` - Main app interface after login
- `Contact.jsx` - Contact/support page
- `NotFound.jsx` - 404 page

### `/src/services`

External service integrations:

- `firebase.js` - Firebase configuration and auth setup
- `api.js` - Backend API calls (health check, etc.)

### `/src/utils`

Core logic and algorithms:

#### `studyPlanGenerator.js` - Basic scheduler

Simple algorithm that divides study time based on urgency (days until exam).

**How it works:**

1. For each day, calculate which exams are still upcoming
2. Give each subject a weight = 1 / daysUntilExam
3. Distribute available study hours proportionally

**Example:**

- Math exam in 2 days → weight = 1/2 = 0.5
- History exam in 5 days → weight = 1/5 = 0.2
- Total weight = 0.7
- Math gets 0.5/0.7 = 71% of study time
- History gets 0.2/0.7 = 29% of study time

#### `advancedScheduler.js` - Advanced scheduler

More sophisticated algorithm that considers:

1. **Urgency** - How soon is the exam?
2. **Difficulty** - How hard is the subject?
3. **Progress** - Are we behind on this subject?
4. **Time needed** - Total hours required
5. **Availability** - Actual free time each day
6. **Preferences** - Preferred study times, Pomodoro breaks

**Main functions:**

`calculateDailyAvailableHours(schedule, commitments, preferences, dayOfWeek)`

- Starts with 24 hours
- Subtracts sleep time
- Subtracts scheduled blocks (classes, work)
- Subtracts commitments
- Accounts for Pomodoro breaks
- Returns realistic study time available

`getPreferredStartHour(preferences, sessionIndex)`

- Looks at user's preferred time slots (morning, afternoon, evening, night)
- Returns an hour (0-23) when sessions should start
- Spreads multiple sessions across preferred times

`generateAdvancedStaticPlan(subjects, schedule, commitments, preferences, studyHoursAvailable)`

- Main scheduling function
- For each day:
  - Calculate available hours
  - Calculate weights for each subject (combining all factors)
  - Distribute hours proportionally
  - Format into readable sessions (e.g., "2 hr 30 min")
- Returns object with dates as keys and sessions as values

**Weight calculation:**

```javascript
weight = urgencyWeight * difficultyMultiplier * progressDeficit * hoursWeight

where:
- urgencyWeight = 1 / sqrt(daysLeft)
- difficultyMultiplier = difficulty / 3
- progressDeficit = 1 - (hoursAllocated / hoursNeeded)
- hoursWeight = sqrt(hoursRemaining)
```

This ensures:

- Urgent exams get priority (but not TOO much via sqrt)
- Hard subjects get more time
- Subjects we're behind on get boosted
- Subjects that need more hours overall get attention

## Data Flow

### Login Flow

1. User enters email/password OR clicks "Continue as Demo"
2. `Login.jsx` calls `useLogin.login()` or `authContext.loginAsDemo()`
3. Auth state updates in `authContext`
4. `App.jsx` sees user is logged in and redirects to Dashboard

### Schedule Generation Flow

1. User fills out `AdvancedSchedulerForm`
2. Form calls `useAdvancedScheduler.generate()`
3. Hook calls `advancedScheduler.generateAdvancedStaticPlan()`
4. Plan is generated and stored in React state
5. Plan is passed to `StudyCalendar` and `WeeklyScheduleGrid`
6. Components render the schedule

### Progress Tracking Flow

1. User marks sessions as complete in UI
2. Completion data is stored in state (and potentially localStorage/backend)
3. `ProgressDashboard` aggregates completion data
4. Shows stats like "80% complete this week"

## Key Patterns

### Custom Hooks

We use custom hooks to separate logic from UI:

```javascript
// Hook handles the logic
const { plan, loading, generate } = useAdvancedScheduler();

// Component handles the UI
return (
  <button onClick={generate} disabled={loading}>
    Generate Plan
  </button>
);
```

### Context for Global State

Authentication state is global (needed everywhere), so we use Context:

```javascript
// Provided at app root
<AuthContext.Provider value={{ user, setUser, loginAsDemo }}>
  <App />
</AuthContext.Provider>;

// Used in any component
const { user } = useContext(AuthContext);
```

### Protected Routes

App.jsx checks auth before rendering pages:

```javascript
<Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
```

## Adding New Features

### Adding a new component

1. Create file in appropriate directory (e.g., `src/components/Planner/NewFeature.jsx`)
2. Import and use in parent component
3. Add comments explaining what it does

### Adding a new page

1. Create file in `src/pages/`
2. Add route in `App.jsx`
3. Update navigation in `Sidebar.jsx` if needed

### Modifying the scheduler

1. Edit logic in `src/utils/advancedScheduler.js` or `studyPlanGenerator.js`
2. Test with various inputs (different exam dates, difficulty levels, etc.)
3. Add comments explaining new logic
4. Update this doc if you change the algorithm significantly

### Adding backend integration

1. Add function to `src/services/api.js`
2. Call from appropriate hook or component
3. Handle loading states and errors
4. Remember to update CORS settings on backend if needed

## Performance Considerations

- Scheduler runs on client side (no server needed for basic functionality)
- Calendar re-renders can be expensive - we memoize where possible
- LocalStorage is used for auth persistence (demo mode flag)
- Firebase auth state is cached by Firebase SDK

## Common Issues

### "Cannot read property of undefined"

Usually means you're trying to access data before it's loaded. Add loading states:

```javascript
if (!plan) return <div>Loading...</div>;
```

### Schedule looks wrong

Check console logs - the scheduler logs a lot of debug info:

```javascript
console.log("📆 Monday: 5.5 hours available");
console.log("📚 Math: weight=0.823, daysLeft=3");
```

### Demo mode not persisting

Make sure `localStorage.setItem('studyvibe_demo', 'true')` is being called and check that localStorage isn't being cleared somewhere.

## Testing Locally

```bash
# Start dev server
npm run dev

# Test different scenarios:
# 1. Login with email/password
# 2. Login as demo user
# 3. Add subjects with various exam dates
# 4. Generate schedule
# 5. View in calendar and grid
# 6. Mark sessions complete
# 7. Logout and login again (check persistence)
```

## Future Improvements

Some ideas for contributors:

- Add automated tests (Jest + React Testing Library)
- Add backend sync for saving schedules
- Export schedule to Google Calendar
- Mobile app version
- Collaboration features (study groups)
- More sophisticated AI recommendations
- Dark mode
- Accessibility improvements (keyboard navigation, screen readers)

## Questions?

Open an issue or check CONTRIBUTING.md for ways to get help.
