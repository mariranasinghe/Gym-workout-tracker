# GymTrack

A mobile-first workout tracking app with exercise library, workout logging, template management, and progress visualization — all stored in localStorage.

## Run & Operate

- `pnpm --filter @workspace/gymtrack run dev` — run GymTrack (port 22111, preview at `/`)
- `pnpm run typecheck` — full typecheck across all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind v4 + shadcn/ui
- Routing: wouter
- State: React context + useReducer + localStorage (no backend)
- Charts: recharts
- Notifications: sonner

## Where things live

- `artifacts/gymtrack/src/` — all source files
- `artifacts/gymtrack/src/pages/` — page components (home, exercises, exercise-detail, workout, progress, templates, new-template)
- `artifacts/gymtrack/src/components/` — shared UI components (bottom-nav, page-header, exercise-card, stat-card, template-card)
- `artifacts/gymtrack/src/components/workout/` — workout-specific components (exercise-entry, set-row, add-exercise-dialog, rest-timer)
- `artifacts/gymtrack/src/store.tsx` — global state (WorkoutProvider + useWorkout)
- `artifacts/gymtrack/src/types.ts` — TypeScript types
- `artifacts/gymtrack/src/exercises.ts` — exercise library (~50 exercises) + muscleGroups/equipmentTypes exports
- `artifacts/gymtrack/src/templates.ts` — default workout templates

## Architecture decisions

- Pure frontend — no API, no DB. All state in localStorage via `gym-tracker-data` key.
- Dark theme always on — `dark` class added to `<html>` in main.tsx; colors use oklch variables.
- Wouter for routing — base URL uses `import.meta.env.BASE_URL.replace(/\/$/, '')` for Replit proxy compatibility.
- React hooks must all be called before any early returns (enforced by fixing workout/progress pages).
- Workout state follows a START → exercises/sets → END_WORKOUT reducer pattern that auto-calculates duration and updates streak/volume stats.

## Product

- Home screen with active workout banner, weekly goal tracker, stats grid, and last workout summary
- Exercise library (50+ exercises) with muscle group / equipment filters and search
- Exercise detail pages with instructions, tips, muscles worked, and PR history
- Active workout tracker with timer, set logging (weight/reps/complete toggle), add/remove exercises, rest timer
- Templates page with preset routines (PPL, Upper/Lower, Full Body) and custom template builder
- Progress page with weekly volume bar chart, personal records, and workout history

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- All hooks must be declared before any conditional `return` in React components — progress.tsx and workout.tsx moved the `isHydrated` check after all hooks.
- The `exercises.ts` file exports both the array AND helper functions (`getExerciseById`, `muscleGroups`, `equipmentTypes`) — import from `@/exercises` not `@/lib/data/exercises`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
