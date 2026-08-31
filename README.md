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

## Backend Integration (Assignment 2)

This branch (`feature/assignment-2-backend-integration`) adds basic integration artifacts for the SyncBoard backend API so you can test the front-end against a running server.

What I added in this branch:

- `postman/SyncBoard.postman_collection.json` — a placeholder Postman collection with example requests for common endpoints (GET /api/tasks, POST /api/tasks). Replace with a full exported collection from Postman if you have one.
- `postman/SyncBoard.postman_environment.json` — a Postman environment with the `baseUrl` variable (defaults to `http://localhost:4000`).
- README updates describing the API endpoints and how to use the Postman collection.
- `.env.example` — example Vite environment variable to configure the API base URL.
- `src/api/taskApi.js` — updated API client that reads VITE_API_BASE_URL, adds a timeout, and exposes PUT/PATCH helpers.

Quick start to test with a local backend

1. Start your backend API server (example):

```bash
cd path/to/syncboard-backend
npm install
npm run dev # or the command your backend uses
```

2. Configure the frontend to point at the backend. Create a `.env.local` file in the frontend repo root (do NOT commit this file) and add:

```
VITE_API_BASE_URL=http://localhost:4000
```

3. Start the frontend:

```bash
npm install
npm run dev
```

4. Import the Postman collection (if you have a full export) and run requests against your backend.

API endpoints (front-end expectations)

- GET /api/tasks — returns JSON array of tasks
- GET /api/tasks/:id — returns single task object
- POST /api/tasks — create a new task (JSON body: title, description, assignee, dueDate (YYYY-MM-DD), status)
- PUT /api/tasks/:id — replace a task
- PATCH /api/tasks/:id — partial update (optional)
- DELETE /api/tasks/:id — delete a task

API Reference — examples

GET /api/tasks
Request
```
GET /api/tasks
```
Response (200)
```json
[
  {
    "id": "1",
    "title": "Design login",
    "description": "Add login page",
    "assignee": "Alice",
    "dueDate": "2026-09-30",
    "status": "todo",
    "createdAt": "2026-08-01T12:00:00.000Z"
  }
]
```

POST /api/tasks
Request
```json
{
  "title": "New task",
  "description": "Details",
  "assignee": "Alice",
  "dueDate": "2026-09-30",
  "status": "todo"
}
```
Response (201)
```json
{
  "id": "2",
  "title": "New task",
  "description": "Details",
  "assignee": "Alice",
  "dueDate": "2026-09-30",
  "status": "todo",
  "createdAt": "2026-08-31T00:00:00.000Z"
}
```

PUT /api/tasks/:id
Request
```json
{
  "title": "Updated title",
  "description": "Updated",
  "assignee": "Bob",
  "dueDate": "2026-10-01",
  "status": "inprogress"
}
```
Response (200)
```json
{
  "id": "2",
  "title": "Updated title",
  "description": "Updated",
  "assignee": "Bob",
  "dueDate": "2026-10-01",
  "status": "inprogress",
  "updatedAt": "2026-08-31T00:10:00.000Z"
}
```

DELETE /api/tasks/:id
Response (204)

Notes

- These are example shapes — if your backend uses different field names or response shapes, update `src/api/taskApi.js` accordingly.
- Use `.env.local` with Vite as shown above to switch backends without changing code.
- Replace the placeholder Postman collection with an exported collection from your team and push it into the `postman/` directory.

