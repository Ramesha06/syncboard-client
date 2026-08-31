# SyncBoard — Task Management Client

A Jira-style Kanban board built with React and Vite for managing project tasks across team members. This is the front-end skeleton for Assignment 01, running entirely on mock data with a clean component structure and prepared API integration points.

**Group 96**

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation
```bash
git clone https://github.com/Ramesha06/syncboard-client.git
cd syncboard-client
npm install
```

### Run Development Server
```bash
npm run dev
```
Opens at `http://localhost:5173` by default.

### Build for Production
```bash
npm run build
npm run preview
```

## Folder Structure

```
src/
├── api/            # All fetch calls (taskApi.js) — components never fetch directly
├── components/     # Reusable presentational components (Button, TaskCard, Column, Board, etc.)
├── constants/      # Shared constants (column definitions, nav theme)
├── context/        # Context providers (TaskContext, ThemeContext) and hooks
├── data/           # Mock data (mockTasks.js) — stand-in for the database
├── hooks/          # Custom hooks (useTasks)
├── pages/          # One component per route (BoardPage, TaskDetailPage, NotFoundPage, etc.)
└── utils/          # Pure helper functions (validation, date formatting, filters)
```

### Conventions
- One component per file, named to match
- Shared state lives in Context providers, not prop drilling
- Task state managed with useReducer (add, move, delete actions)
- API calls go in `src/api/`, never inside components
- Navigation uses React Router `<Link>`, not `<a>` tags

## Features

- **Kanban Board** — Three columns (To Do, In Progress, Done) with per-column task counts
- **Create Tasks** — Controlled form with validation (title required, min 3 characters, due date not in past)
- **Move Tasks** — Left/right buttons to shift tasks between columns
- **Delete Tasks** — With confirmation dialog before removal
- **Task Detail** — Deep-linkable `/tasks/:id` route with not-found handling
- **Filter & Search** — Filter by assignee or status, search by title, empty state when nothing matches
- **Theme Toggle** — Dark/light mode via ThemeContext
- **Four UI States** — Loading spinner, error banner, empty state, and success (board) all handled
- **Issues View** — Table listing of all tasks
- **Timeline View** — Tasks ordered by due date
- **Settings Page** — Theme preferences

## Team Contributions — Group 96

| Member | Student ID | Contribution |
|--------|-----------|--------------|
| RRP Weerasinghe | 30851 | Project setup, React Router and navigation UI |
| ALD Semitha | 30789 | Board and column layout UI |
| ATN Fernando | 30966 | TaskCard UI and mock data setup |
| PKPGSD Gunarathna | 29921 | Add Task Form UI and validation logic |
| MS Liyanaaracchi | 30860 | Move/Delete buttons and confirmation modal UI |
| MHF Zaina | 33211 | Search bar and filter dropdowns UI |
| DMSK Dissanayake | 33337 | Loading spinner, error banner, and empty state UI |
| PSD Wijesinghe | 30843 | Global state (useReducer) and reusable Badge/Button UI |
| KGG Theekshana | 30751 | Pages, routing, context integration, deployment, and overall assembly |

## Known Limitations

- Data is stored in-memory (mock data) — refreshing the page resets all changes
- No backend API connected yet — `src/api/taskApi.js` is prepared but not wired up
- Filter dropdowns use client-side filtering only
- No drag-and-drop support (tasks move via left/right buttons)
- No user authentication

## Tech Stack

- React 19
- Vite 8
- React Router 7
- CSS Modules


