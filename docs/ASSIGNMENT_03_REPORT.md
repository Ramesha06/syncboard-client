# Assignment 03 Project Report: Full-Stack Database Integration

**Course:** Software Engineering / Web Application Development  
**Project:** SyncBoard — Collaborative Agile Kanban Management System  
**Group:** Group 96  
**Assignment:** Assignment 03 — Working Full-Stack Application (Frontend, Backend, and Persistent Database)

---

## 1. Executive Summary

Assignment 03 successfully migrates **SyncBoard** from mock/in-memory data stores to a production-grade, persistent full-stack architecture powered by **MongoDB Atlas** and the **Mongoose ODM**. The solution seamlessly bridges the React (Vite) client interface with an Express/Node.js REST API and a cloud-hosted document database.

All business operations—including user authentication with salted bcrypt hashing, multi-tenant board isolation, and granular CRUD management on Kanban tasks—are now persistently retained across backend server restarts, verified through rigorous Postman and Newman automated test suites.

---

## 2. Group 96 — Complete Team Contributions (Assignment 03)

The following table records the individual contributions and deliverables of all 9 team members for Assignment 03:

| Member # | Name | Student ID | Git Author / Username | Key Deliverable & Component | Commit Hash / Contribution Summary |
| :---: | :--- | :---: | :--- | :--- | :--- |
| **Member 1** | KGG Theekshana | 30751 | `theekshana-git` | Database Connectivity & Health Subsystem | `b568ab9` Configured Mongoose connection manager, `.env` parsing, dynamic Atlas URI loading, and database health reporting at `/api/health`. |
| **Member 2** | ALD Semitha | 30789 | `dinsara0611` | Error Interception & Validation Guards | `e35f3c5` Implemented centralized error handler mapping Mongoose `E11000` duplicate key to `409 Conflict`, `CastError` to `404 Not Found`, and created `validateObjectId` middleware. |
| **Member 3** | ATN Fernando | 30966 | `thihanf` | User Data Layer & Authentication Models | `994a8da` Designed User Mongoose schema, email validation regex, bcrypt hashing lifecycle hooks, `toJSON` password-stripping transform, and migrated `userRepository`. |
| **Member 4** | MS Liyanaaracchi | 30860 | `Malik Shiran Liyanaarachchi` | Board Data Layer & Workspace Isolation | `97a1eca` Created Board Mongoose schema with member references, configured `{ members: 1 }` multikey index, and migrated `boardRepository`. |
| **Member 5** | RRP Weerasinghe | 30851 | `Rashmie` | Task Data Layer & High-Performance Indexing | `d8afdb4` Implemented Task Mongoose schema, enum validations, compound index `{ boardId: 1, status: 1 }`, and migrated `taskRepository` to MongoDB. |
| **Member 6** | PKPGSD Gunarathna | 29921 | `Siluni` | Database Seeding Automation & Service Alignment | `7b2d564` Built automated idempotent database seeding script (`npm run db:seed`) and refactored core backend service methods for Mongoose query mechanics. |
| **Member 7** | DMSK Dissanayake | 33337 | `sithumi-i` | Client-Side Database & ObjectId Integration | `5010cb9` Refactored React frontend client for 24-character hex MongoDB ObjectIds, updated state sync, and ensured seamless live database UI updates. |
| **Member 8** | MHF Zaina | 33211 | `zaina-hz` | Test Automation & Persistence Verification Suite | `e4e7b6d`<br>`2c0b067`<br>`df72ab2` Extended Postman collection with dynamic environment extraction (`boardId`, `taskId`), restart persistence acceptance tests, duplicate conflict checks, and Newman CLI docs. |
| **Member 9** | PSD Wijesinghe | 30843 | `senura-d` | Architectural Documentation, Data Modeling Justification & Release Assembly | Created comprehensive MongoDB data modeling justification table, MongoDB Atlas cloud deployment guide, Assignment 03 formal report, executed final monorepo merge, and tagged release `Assignment-03`. |

---

## 3. System Architecture

SyncBoard follows a decoupled, 3-tier client-server architecture:

```
┌────────────────────────────────────────────────────────┐
│                   Presentation Tier                    │
│            React 18 + Vite (Tailwind/CSS)              │
│       Kanban Columns, Task Detail, Auth Forms          │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP / REST / JSON
                            │ (Bearer JWT Authorization)
┌───────────────────────────▼────────────────────────────┐
│                    Application Tier                    │
│                 Node.js + Express.js                   │
│                                                        │
│  Controllers ──► Services ──► Repositories ──► Models  │
│  [Zod Validator] [Rate Limiter] [Central Error Handler]│
└───────────────────────────┬────────────────────────────┘
                            │ Mongoose ODM (BSON)
                            │ TLS 1.3 / SCRAM-SHA-256
┌───────────────────────────▼────────────────────────────┐
│                      Data Tier                         │
│                  MongoDB Atlas Cloud                   │
│                                                        │
│   [users]                 [boards]            [tasks]  │
│   (Unique email)     (Multikey members)  ({boardId,    │
│                                            status})    │
└────────────────────────────────────────────────────────┘
```

### Key Architectural Characteristics:
1. **Repository Pattern:** Business logic inside `services/` remains strictly decoupled from storage mechanics. Database queries are isolated in `repositories/` (`userRepository.js`, `boardRepository.js`, `taskRepository.js`).
2. **Schema Virtuals & Envelopes:** All domain models transform MongoDB's native `_id` into a JSON-friendly `id` property via Mongoose `toJSON` transforms, hiding internal database keys (`__v`, passwords) from clients.
3. **Stateless Authentication:** JSON Web Tokens (JWT) signed with HMAC-SHA256 authenticate user requests, enabling multi-tenant board isolation without server-side session memory.

---

## 4. Database Schema Design & Relationships

### 4.1 Relationship Overview
- **User $\leftrightarrow$ Board ($N:M$):** Users collaborate on multiple boards; each board lists enrolled users in an array of ObjectIds (`members: [ObjectId]`).
- **Board $\rightarrow$ Task ($1:N$):** Tasks are modeled independently and reference their parent board via `boardId: ObjectId`. This avoids the MongoDB 16MB document limit and eliminates document reallocation.
- **User $\rightarrow$ Task ($1:N$):** Tasks maintain a `createdBy` reference for user accountability, while storing denormalized `assignee` and `assigneeInitials` strings to eliminate `$lookup` latency during Kanban column rendering.

### 4.2 Indexing Rationale
- **Compound Index `{ boardId: 1, status: 1 }` on `tasks`:** Allows instant retrieval of tasks filtered by board and status (e.g. `todo`, `in_progress`, `done`).
- **Multikey Index `{ members: 1 }` on `boards`:** Enables instantaneous workspace discovery for logged-in users.
- **Unique Index `{ email: 1 }` on `users`:** Enforces email uniqueness at the storage engine level.

---

## 5. Centralized Error Handling & HTTP Status Code Mapping

The backend implementation maps native database and application exceptions directly to standard HTTP status codes:

| Exception Type | Trigger Scenario | Handled By | HTTP Status Code | Response Envelope |
| :--- | :--- | :--- | :---: | :--- |
| **Duplicate Key Error (`E11000`)** | Attempting to register an existing email | `errorHandler.js` | `409 Conflict` | `{ success: false, status: 409, message: "Email already exists." }` |
| **Invalid ObjectId (`CastError`)** | Malformed task ID in URL (e.g., `GET /api/tasks/invalid-123`) | `errorHandler.js` / `validateObjectId.js` | `404 Not Found` | `{ success: false, status: 404, message: "Resource not found with id of invalid-123" }` |
| **Mongoose Validation Error** | Missing required title or category | `errorHandler.js` | `400 Bad Request` | `{ success: false, status: 400, message: "Title is required" }` |
| **Zod Schema Error** | Invalid payload type or malformed body | `validate.js` | `400 Bad Request` | `{ success: false, status: 400, message: "Validation Error", errors: [...] }` |
| **JWT Verification Error** | Expired or forged Bearer token | `authMiddleware.js` | `401 Unauthorized` | `{ success: false, status: 401, message: "Invalid token. Please log in again." }` |

---

## 6. Verification & Acceptance Testing (Member 8 Suite)

### 6.1 Automated Postman Test Suite
The repository includes an acceptance test suite in `postman/`:
- `SyncBoard.postman_collection.json`
- `SyncBoard.postman_environment.json`

The collection automatically chains variables across requests:
1. **`GET /api/boards`:** Dynamically captures the first available board ID and assigns `{{boardId}}`.
2. **`POST /api/tasks`:** Submits a new task attached to `{{boardId}}` and dynamically captures `{{taskId}}`.
3. **`GET /api/tasks/{{taskId}}`:** Verifies that the task exists and returns HTTP 200.
4. **Data Persistence Verification:** Stopping and restarting the backend server (`npm run dev`) and re-running `GET /api/tasks/{{taskId}}` confirms persistent database retention without data loss.
5. **Conflict Verification:** Attempting duplicate user registration confirms HTTP 409.
6. **Guard Verification:** Querying a malformed task ID (`/api/tasks/invalid-123`) confirms HTTP 404.

### 6.2 Running Headless via Newman CLI
```bash
# Install Newman globally
npm install -g newman

# Execute automated test suite against running server
newman run postman/SyncBoard.postman_collection.json \
  -e postman/SyncBoard.postman_environment.json \
  --env-var "baseUrl=http://localhost:5000" \
  --reporters cli
```

---

## 7. Conclusion

With the completion of Assignment 03, **SyncBoard** has transformed into a robust, cloud-connected full-stack application. By implementing MongoDB Atlas with Mongoose schemas, compound indexes, relational referencing, and centralized error mapping, the system satisfies all performance, reliability, and security criteria required for modern web applications.
