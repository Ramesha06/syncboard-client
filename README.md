# SyncBoard — Task Management & API Server

A Jira-style Kanban board built with React, Vite, Node.js, and Express. This repository contains both the front-end client (syncboard-client) and a minimal REST API server (syncboard-server) to support full end-to-end development and testing for Assignment 02.

---

## 👥 Group 96 — Team Contributions

The table below lists the team members recorded in the project. Update roles/IDs below if you want exact assignment-role mapping.

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

---

## 🚀 Quick overview

- Frontend: React + Vite app located at the repository root (this folder) — run with `npm run dev` after installing dependencies.
- Backend: Express server in `syncboard-server/` providing REST endpoints for tasks and authentication — run with `cd syncboard-server && npm run dev`.
- Postman: `postman/` contains a placeholder Postman collection and environment; replace with a full export from your team for testing.

---

## Prerequisites

- Node.js v18+
- npm v9+

---

## Installation (client + server)

```bash
# Clone the repository
git clone https://github.com/Ramesha06/syncboard-client.git
cd syncboard-client

# Install client dependencies (root)
npm install

# Install server dependencies
cd syncboard-server
npm install
cd ..
```

---

## Environment configuration

Do NOT commit sensitive environment files (e.g. `.env.local`). Use `.env.example` as a template.

Client (Vite)
- Create `.env.local` in the project root with:
```
VITE_API_BASE_URL=http://localhost:4000
```

Server
- Create `.env` inside `syncboard-server/` (example values):
```
PORT=4000
JWT_SECRET=replace_with_a_strong_secret
NODE_ENV=development
```

Required server env vars may include (depending on your server code):
- PORT
- JWT_SECRET
- (optional) RATE_LIMIT_MAX, DB_URL, etc.

---

## Start the apps (development)

Open two terminals:

Terminal 1 — start backend
```bash
cd syncboard-server
npm run dev
```

Terminal 2 — start frontend
```bash
# from repo root
npm run dev
```

The frontend opens at `http://localhost:5173` by default and will use the API base URL from `VITE_API_BASE_URL`.

Optional: Add a top-level `dev` script (not included) or use a tool like `concurrently` if you want a single command to run both.

---

## Postman & API testing

A placeholder Postman collection and environment are added under `postman/`:
- `postman/SyncBoard.postman_collection.json`
- `postman/SyncBoard.postman_environment.json`

Import these into Postman and set the `baseUrl` variable to your running server (`http://localhost:4000` by default).

Replace these placeholders with your exported Postman collection and environment for full testing.

---

## API endpoints (front-end expectations)

These are the endpoints the front-end client expects by default. If your server uses different paths, IDs, or response envelopes, update `src/api/taskApi.js` accordingly.

- GET /api/tasks — list tasks (returns an array)
- GET /api/tasks/:id — get single task
- POST /api/tasks — create a task; body: { title, description, assignee, dueDate (YYYY-MM-DD), status }
- PUT /api/tasks/:id — replace a task
- PATCH /api/tasks/:id — partial update
- DELETE /api/tasks/:id — delete a task (204)
- POST /api/auth/register — create user (if implemented)
- POST /api/auth/login — returns JWT token (if implemented)

Example GET /api/tasks response
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

Example POST /api/tasks request
```json
{
  "title": "New task",
  "description": "Details",
  "assignee": "Alice",
  "dueDate": "2026-09-30",
  "status": "todo"
}
```

Example POST /api/tasks response (201)
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

Notes on common mismatch areas
- Base path: `/api/tasks` vs `/tasks`
- ID field: `id` vs `_id`
- Response envelope: raw array vs { data: [...] }
- Auth flow: how tokens are issued and expected in Authorization header

---

## Frontend: API client & wiring

The front-end API client is in `src/api/taskApi.js`. It reads the base URL from `import.meta.env.VITE_API_BASE_URL` and includes helpers for GET/POST/PUT/PATCH/DELETE. If your backend uses different routes/field names, update this file and ensure `.env.local` points to the correct base URL.

Helpful quick commands
- Check the current branch and latest commit:
```bash
git branch --show-current
git log -1
```
- Inspect the Postman folder:
```bash
ls postman
cat postman/SyncBoard.postman_collection.json | jq . | head -n 50
```

---

## Testing & troubleshooting

- CORS errors: enable CORS in the backend (e.g., `app.use(cors())`) or configure a Vite proxy in `vite.config.js`.
- 401/403: confirm JWT_SECRET and token handling; check localStorage key names (token or syncboard_token).
- Timeouts: `src/api/taskApi.js` includes a default fetch timeout; make sure the server starts and responds on the configured port.

---

## Next steps & recommendations

1. Replace placeholder Postman files with full exported collection + environment.
2. Confirm API contract (ID field names, response envelopes) and update `src/api/taskApi.js` accordingly.
3. Wire the front-end hooks/state to use the API (if parts of the app still use mock data in `src/data/mockTasks.js`).
4. Add a smoke-test script and optionally a CI workflow that runs it on pushes to feature branches.

---

## License & Code of Conduct

Include your project license and any contributor guidelines here.

---

If you want, I can commit this polished README to `feature/assignment-2-backend-integration` now and also:
- add a `docs/API.md` file with expanded request/response examples, or
- replace the placeholder Postman files if you upload the exported collection.

Reply "Commit README" to apply this README to the feature branch, or tell me edits to make before committing.
