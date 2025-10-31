# Architecture Overview

Visual representation of how StudyVibe is structured.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (Client)                      │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                 React Application                       │ │
│  │                                                          │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │ │
│  │  │   Login/     │  │              │  │              │ │ │
│  │  │   Signup     │→ │  Dashboard   │→ │  Calendar/   │ │ │
│  │  │   Pages      │  │              │  │  Grid Views  │ │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │ │
│  │         ↓                  ↓                  ↓         │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │           Auth Context (Global State)            │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │         ↓                  ↓                  ↓         │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │ │
│  │  │   Firebase   │  │   Scheduler  │  │  LocalStorage│ │ │
│  │  │   Service    │  │   Utils      │  │              │ │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ↓
        ┌───────────────────────────────────┐
        │     External Services             │
        │                                   │
        │  ┌─────────────────────────────┐ │
        │  │   Firebase Authentication   │ │
        │  └─────────────────────────────┘ │
        │                                   │
        │  ┌─────────────────────────────┐ │
        │  │   Backend API (Optional)    │ │
        │  │   (Render/other hosting)    │ │
        │  └─────────────────────────────┘ │
        └───────────────────────────────────┘
```

## Component Hierarchy

```
App
├── AuthProvider (Context)
│   └── RouterProvider
│       ├── Login
│       │   ├── useLogin hook
│       │   ├── loginAsDemo
│       │   └── Footer
│       │
│       ├── SignUp
│       │   ├── useSignup hook
│       │   └── Footer
│       │
│       └── Dashboard
│           ├── Sidebar
│           │   ├── Navigation
│           │   └── useLogout
│           │
│           ├── AdvancedSchedulerForm
│           │   ├── AdvancedSubjectInput (multiple)
│           │   ├── SubjectForm
│           │   └── useAdvancedScheduler
│           │
│           ├── StudyCalendar
│           │   └── FullCalendar component
│           │
│           ├── WeeklyScheduleGrid
│           │   └── Timetable
│           │
│           ├── ProgressDashboard
│           │   └── Progress stats
│           │
│           └── AICustomizer
│               └── Plan customization UI
```

## Data Flow

### Authentication Flow

```
User Input
    ↓
Login Component
    ↓
useLogin hook → Firebase Auth
    ↓
Firebase responds
    ↓
onAuthStateChanged in authContext
    ↓
Context updates user state
    ↓
App.jsx checks user state
    ↓
Redirects to Dashboard
```

### Schedule Generation Flow

```
User fills form
    ↓
AdvancedSchedulerForm collects data
    ↓
Validates inputs
    ↓
Calls useAdvancedScheduler.generate()
    ↓
Hook calls advancedScheduler.generateAdvancedStaticPlan()
    ↓
Algorithm runs:
  1. Calculate daily available hours
  2. For each day:
     - Get active subjects
     - Calculate weights
     - Distribute hours
     - Format sessions
    ↓
Returns plan object
    ↓
Hook updates state
    ↓
State passed to Calendar/Grid components
    ↓
Components render schedule
```

## File Organization

```
StudyVibe_Frontend/
│
├── public/                  # Static assets
│
├── src/
│   ├── main.jsx            # Entry point
│   ├── App.jsx             # Main app with routing
│   ├── App.css             # Global styles
│   │
│   ├── components/
│   │   ├── Planner/        # Scheduling features
│   │   │   ├── AdvancedSchedulerForm.jsx
│   │   │   ├── AdvancedSubjectInput.jsx
│   │   │   ├── AICustomizer.jsx
│   │   │   ├── ProgressDashboard.jsx
│   │   │   ├── StudyCalendar.jsx
│   │   │   ├── SubjectForm.jsx
│   │   │   ├── Timetable.jsx
│   │   │   └── WeeklyScheduleGrid.jsx
│   │   │
│   │   └── Reusable/       # Shared components
│   │       ├── Footer.jsx
│   │       ├── MotivationalQuote.jsx
│   │       └── Sidebar.jsx
│   │
│   ├── contexts/           # React Context
│   │   └── authContext.jsx
│   │
│   ├── hooks/              # Custom hooks
│   │   ├── useAdvancedScheduler.js
│   │   ├── useGeneratePlan.js
│   │   ├── useLogin.js
│   │   ├── useLogout.js
│   │   ├── useSignup.js
│   │   └── useSmartTimetable.js
│   │
│   ├── pages/              # Page components
│   │   ├── Contact.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── NotFound.jsx
│   │   ├── SignUp.jsx
│   │   └── signup_test.jsx
│   │
│   ├── services/           # External services
│   │   ├── api.js         # Backend API
│   │   └── firebase.js    # Firebase config
│   │
│   └── utils/              # Helper functions
│       ├── advancedScheduler.js
│       └── studyPlanGenerator.js
│
├── .env                    # Environment variables (not in git)
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS config
├── postcss.config.js       # PostCSS config
├── vercel.json             # Vercel deployment config
│
├── README.md               # Project overview
├── CONTRIBUTING.md         # How to contribute
├── CODE_STRUCTURE.md       # Code organization guide
├── DEPLOYMENT.md           # Deployment instructions
└── ARCHITECTURE.md         # This file
```

## Key Technologies

### Frontend Core

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing

### Styling

- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library built on Tailwind

### State Management

- **React Context** - Global auth state
- **React Hooks** - Local component state

### External Services

- **Firebase Auth** - User authentication
- **FullCalendar** - Calendar UI component

### Date/Time

- **Day.js** - Date manipulation and formatting

## Security Considerations

1. **Environment Variables**

   - All sensitive config (Firebase keys, API URLs) in `.env`
   - Never committed to git
   - Set in deployment platform

2. **Firebase Auth**

   - Handles user authentication securely
   - Tokens managed by Firebase SDK
   - Auth state synced across tabs

3. **Demo Mode**

   - Stored in localStorage only
   - No backend access with demo user
   - Clears on logout

4. **Client-Side Only**
   - No backend required for basic functionality
   - Scheduling algorithm runs in browser
   - Data stays on client (privacy-friendly)

## Performance

### Bundle Size

- Main bundle: ~721KB (203KB gzipped)
- Styles: ~84KB (14KB gzipped)
- Could be improved with code splitting

### Optimization Strategies

- React memo for expensive components
- Lazy loading for routes (future improvement)
- Calendar virtualization for large date ranges
- LocalStorage for caching (demo mode, preferences)

### Build Optimization

- Vite handles tree-shaking automatically
- Production builds minified
- CSS purged of unused classes by Tailwind

## Scalability

### Current State

- Pure client-side app
- No backend database
- Schedules stored in browser only

### Future Enhancements

- Add backend for persistence
- User accounts with cloud sync
- Multi-device support
- Collaboration features
- Mobile app (React Native)

## Testing Strategy (Future)

```
Unit Tests (Jest)
    ↓
Test individual functions
(schedulers, helpers, etc.)

Component Tests (React Testing Library)
    ↓
Test component behavior
(forms, buttons, navigation)

Integration Tests
    ↓
Test feature workflows
(login → generate plan → view calendar)

E2E Tests (Playwright/Cypress)
    ↓
Test full user journeys
(signup → create schedule → track progress)
```

## Deployment Architecture

```
Developer                     Version Control              Hosting
    ↓                               ↓                         ↓
Local Dev      →      GitHub Repository      →         Vercel/Netlify
    ↓                               ↓                         ↓
npm run dev         Push to main branch            Auto-deploy on push
                                                             ↓
                                                    CDN serves static files
                                                             ↓
                                                         End Users
```

## Monitoring & Analytics

### Current

- Console logging for debugging
- Firebase Auth analytics

### Future

- Error tracking (Sentry)
- User analytics (Google Analytics, Plausible)
- Performance monitoring (Web Vitals)
- Uptime monitoring (UptimeRobot)

## Questions?

Refer to other documentation files:

- [README.md](README.md) - Project overview
- [CODE_STRUCTURE.md](CODE_STRUCTURE.md) - Detailed code walkthrough
- [CONTRIBUTING.md](CONTRIBUTING.md) - How to contribute
- [DEPLOYMENT.md](DEPLOYMENT.md) - How to deploy
